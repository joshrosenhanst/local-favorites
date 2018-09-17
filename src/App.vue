<template>
  <div id="app">
    <app-header></app-header>
    <main id="app-body">
      <app-sidebar
        v-bind:favorites-list="favoritesList"

        v-on:set-review="saveReview"
        v-on:select-result="selectResult"
        v-on:toggle-note-form="toggleNoteForm"
        v-on:open-different-note-form="openDifferentNoteForm"
        v-on:close-note-form="closeNoteForm"
      ></app-sidebar>
      
      <google-map
        v-bind:selected-place="AppData.selectedPlace"
        v-bind:reviews="AppData.savedReviews"
        v-on:get-local-places="updateResultsList"
        v-on:click-map-point="clickMapPoint"
      ></google-map>
    </main>
    <footer id="app-footer">
      <p>Your Local Notes and star ratings are stored locally in your browser using HTML5 LocalStorage. Map and location data provided by Google.</p>
    </footer>
    <div id="hidden-controls">
      <div id="autocomplete-search-container">
        <gmap-autocomplete-search></gmap-autocomplete-search>
      </div>
    </div>
  </div>
</template>

<script>
import { findIndex as _findIndex, find as _find } from 'lodash'
import AppStore from './AppStore.js'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import ResultsList from './components/ResultsList.vue'
import GoogleMap from './components/GoogleMap.vue'
import GmapAutocompleteSearch from './components/GmapAutocompleteSearch.vue'

const TAB_NEARBY = 0, TAB_FAVORITES = 1;

export default {
  name: 'app',
  components: {
    AppHeader,
    AppSidebar,
    ResultsList,
    GoogleMap,
    GmapAutocompleteSearch
  },
  data: function () {
    return {
      AppData: AppStore.state
    }
  },
  computed: {
    favoritesList: function () {
      return this.AppData.savedReviews.filter(review => review.saved);
    }
  },
  methods: {
    isPlaceIDInArray: function (place_id,array){
      // check if a place_id is in an array, return a boolean
      return ( place_id && _find(array, { place_id: place_id }) )
    },
    getIndexByPlaceID: function (place_id, array){
      return _findIndex(array, { place_id: place_id })
    },
    saveReview: function (event) {
      // create or update the review in the savedReviews array
      AppStore.setReview(event.place_id, event)

      // update the resultsList array with the new review values
      AppStore.updateResult(event.place_id, { stars:event.stars, notes:event.notes, saved: event.saved })

      // wait until the DOM has fully updated from changing savedReviews/resultsList, then set the selectedPlace
      this.$nextTick(function () {
        // if we are on the My Favorites tab and we just unsaved something, set a different selectedPlace
        if(this.AppData.activeTab === TAB_FAVORITES && !event.saved){
          if(this.favoritesList.length){
            // set the selectedPlace to the first item, if we can
            AppStore.setSelectedPlace(Object.assign({}, this.favoritesList[0], {isNoteFormOpen: false}))
          }else{
            // otherwise, set to empty object
            AppStore.setSelectedPlace({})
          }
        }else{
          // update the selectedPlace Obj with the new review
          AppStore.setSelectedPlace(Object.assign({}, this.AppData.selectedPlace, { stars:event.stars, notes:event.notes, saved: event.saved, isNoteFormOpen: false }))
        }
      });

      // update localStorage
      localStorage.setItem('local-favorites-savedReviews', JSON.stringify(this.AppData.savedReviews));
    },
    setLocationSaveStatus: function (event) {
      this.saveReview(event);
    },
    updateResultsList: function (event) {
      AppStore.setResultsList( event.results?event.results:[] )
      if(this.AppData.savedReviews.length > 0 && this.AppData.resultsList.length > 0){
        this.AppData.savedReviews.forEach(review => {
          AppStore.updateResult(review.place_id, { stars: review.stars, notes: review.notes, saved: review.saved, isNoteFormOpen: false })
        })
      }
      if(this.AppData.activeTab === TAB_NEARBY) {
        // we only need to update the selectedPlace from getLocalPlaces (i.e map scroll) if we are on the nearby tab
        if(event.keepSelected) {
          // if we are told to keep the current selectedPlace or we're on the My Favorites tab, check if the selectedPlace is in the resultsList
          // if we are on the My Favorites tab, addMisingSelectedPlace will do nothing
          this.addMissingSelectedPlace();
        }else{        
          // if we dont need to keep the current selectedPlace, grab the first available and then focus the element
          let currentList = (this.AppData.activeTab === TAB_FAVORITES?this.favoritesList:this.AppData.resultsList);
          if(currentList.length) {
            // set the selectedPlace to the first item in ResultsList/FavoritesList
            // stars/notes/saved should default to empty and be overridden by result var, isNoteFormOpen should override result property to false
            AppStore.setSelectedPlace(Object.assign({}, { stars: 0, notes: null, saved: false }, currentList[0], { isNoteFormOpen: false }))
          }else{
            AppStore.setSelectedPlace({});
          }
          this.focusOnPlaceResult();
        }
      }
      AppStore.setIsLoading(false);
    },
    selectResult: function (place) {
      // user selects a place from the ResultsList
      // do a sanity check to make sure they arent just clicking the same location
      // update the selectedPlace object
      // stars/notes/saved should default to empty and be overridden by result var, isNoteFormOpen should override result property to false
      if(place.place_id !== this.AppData.selectedPlace.place_id) {
        AppStore.setSelectedPlace(Object.assign({}, { stars: 0, notes: null, saved: false }, place, { isNoteFormOpen: false }))
      }
      this.addMissingSelectedPlace();
    },
    addMissingSelectedPlace: function () {
      if(this.AppData.activeTab === TAB_NEARBY){
        // if the selectedPlace object is not in the resultList, add it to the front of the array
        if(!this.isPlaceIDInArray(this.AppData.selectedPlace.place_id, this.AppData.resultsList)){
          AppStore.addFirstResult(this.AppData.selectedPlace)
        }
      }
    },
    clickMapPoint: function (place) {
      // user selects a point of interest on the GoogleMap
      // update the selectedPlace obj
      // this.selectedPlace = Object.assign({}, { stars: 0, notes: null, saved: false }, place, { isNoteFormOpen: false });
      this.selectResult(place);

      if(this.AppData.activeTab === TAB_FAVORITES){
        // check if the place is in the favorites list
        // if it isnt, switch tabs
        if(!this.isPlaceIDInArray(this.AppData.selectedPlace.place_id, this.favoritesList)){
          AppStore.setActiveTab(TAB_NEARBY);
        }
      }
      
      this.focusOnPlaceResult();
    },
    focusOnPlaceResult: function () {
      let map_sidebar = document.getElementById('map-sidebar');
      // wait a tick for the DOM to be fully updated
      this.$nextTick(function() {
        let element_id = (this.AppData.activeTab === TAB_FAVORITES?'favorites-list':'nearby-list');
        let parent_element = document.getElementById(element_id);
        let selected_element = parent_element.getElementsByClassName('result-display selected')[0];
        if(selected_element){
          // focus the element, which will also appropriately scroll the list
          selected_element.focus();
        }
      });
    },
    openNoteForm: function (event) {
      // open the AddNoteForm on the Results List
      AppStore.setSelectedPlace( Object.assign({}, this.AppData.selectedPlace, { isNoteFormOpen: true }) )
    },
    closeNoteForm: function (event) {
      AppStore.setSelectedPlace (Object.assign({}, this.AppData.selectedPlace, { isNoteFormOpen: false }) )
    },
    toggleNoteForm: function () {
      AppStore.setSelectedPlace( Object.assign({}, this.AppData.selectedPlace, { isNoteFormOpen: !this.AppData.selectedPlace.isNoteFormOpen }) )
    },
    openDifferentNoteForm: function (result) {
      // close the old form
      //this.selectedPlace.isNoteFormOpen = false;

      // open the new form
      AppStore.setSelectedPlace( Object.assign({}, { stars: 0, notes: null, saved: false }, result, { isNoteFormOpen: true } ))
    }
  },
  created: function () {
    // get localstorage review data
    this.AppData.savedReviews = (JSON.parse(localStorage.getItem('local-favorites-savedReviews')) || []);

    // loop through savedReviews array and replace matching (by place_id) results from resultsList array with review/stars (dont overwrite any name/address/etc because results list is more recent)
    if(this.AppData.savedReviews.length){
      this.AppData.savedReviews.forEach(review => {
        AppStore.updateResult(review.place_id, { stars: review.stars, notes: review.notes, saved: review.saved })
      })
    }
    AppStore.setIsLoading(false);
  }
}
</script>

<style lang='scss'>
html{
  overflow-y:auto !important;
}
#app {
  @media (min-width: 769px) {
    height:100vh;
  }
  align-items: stretch;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
#app-header{
  flex-grow: 0;
}
#app-body {
  flex-grow: 1;
  min-height:0;
  border-top:1px solid $border;
  border-bottom:1px solid $border;

  display:flex;
  flex-direction:column-reverse;
  @media (min-width: 769px) {
    flex-direction:row-reverse;
  }
}
#app-footer {
  flex-grow: 0;

  font-size:12px;
  font-style:italic;
  padding:10px;
  text-align:center;
}

#map-sidebar{
  flex-grow:1;
  min-height:0;
  //max-height:100vh;
  @media (min-width: 769px) {
    flex-grow:0;
    width:400px;
    border-left: 1px solid $border;
    overflow:auto;
  }
  .b-tabs{
    min-height:0;
    nav.tabs{
      border-width:0;
      border-bottom:1px solid $border;
      font-weight:bold;
      margin-bottom:-1px;
      &.is-toggle{
        li.is-active a{
          background-color:$primary;
          border:0;
          color:white;
          .tab-icon{
            color:white;
          }
        }
        a{
          border:0;
          &:hover,&:focus{
            background-color:$grey-lighter;
          }
        }
      }
      .tab-icon{
        margin-right:4px;
        &.is-bookmark{
          color:$orange;
        }
        &.is-nearby{
          color:$primary;
        }
      }
    }
    .tab-content{
      padding:0;
    }
  }
}
#hidden-controls{
  display:none;
}
#autocomplete-search-container{
  padding:5px 10px;
  background:white;
  box-shadow:rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 2px;
  flex:none;
}
</style>
