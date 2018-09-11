<template>
  <div id="app">
    <app-header></app-header>
    <main id="app-body">
      <google-map
        v-bind:selected-place="selectedPlace"
        v-bind:reviews="savedReviews"
        v-on:start-nearby-search="isLoading = (activeTab === 0)"
        v-on:get-local-places="updateResultsList"
        v-on:click-map-point="clickMapPoint"
      ></google-map>
      <aside id="map-sidebar">
        <b-tabs position="is-centered" class="block" expanded type="is-toggle"
          v-model="activeTab"
          v-on:change="onChangeTab"
        >
          <b-tab-item>
            <template slot="header">
              <font-awesome-icon v-bind:icon="['fas','map-marker-alt']" class="tab-icon is-nearby"></font-awesome-icon>
              <span class="tab_nearby-text">Nearby</span>
            </template>
            <results-list id="nearby-list"
              v-bind:selected-place="selectedPlace"
              v-bind:results="resultsList" 
              v-bind:is-loading="isLoading"
              v-bind:is-tab-active="(activeTab === 0)"
              v-on:set-review="setReview"
              v-on:select-result="selectResult"
              v-on:toggle-note-form="toggleNoteForm"
              v-on:toggle-save-status="setReview"
              v-on:open-different-note-form="openDifferentNoteForm"
              v-on:close-note-form="closeNoteForm"
            >
              <template slot="no-results-text">Try searching in another area</template>
            </results-list>
          </b-tab-item>
          <b-tab-item>
            <template slot="header">
              <font-awesome-icon v-bind:icon="['fas','bookmark']" class="tab-icon is-bookmark"></font-awesome-icon>
              <span class="tab_favorites-text">My Favorites</span>
            </template>
            <results-list id="favorites-list"
              v-bind:selected-place="selectedPlace"
              v-bind:results="favoritesList" 
              v-bind:is-loading="isLoading"
              v-bind:is-tab-active="(activeTab === 1)"
              v-on:set-review="setReview"
              v-on:select-result="selectResult"
              v-on:toggle-note-form="toggleNoteForm"
              v-on:toggle-save-status="setReview"
              v-on:open-different-note-form="openDifferentNoteForm"
              v-on:close-note-form="closeNoteForm"
            >
              <template slot="no-results-text">Add a place to your favorites list</template>
            </results-list>
          </b-tab-item>
        </b-tabs>
      </aside>
    </main>
    <footer id="app-footer">
      <p>Your Local Notes and star ratings are stored locally in your browser using HTML5 LocalStorage. Map and location data provided by Google.</p>
    </footer>
    <div id="city-search-container">
      <gmap-city-search></gmap-city-search>
    </div>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import ResultsList from './components/ResultsList.vue'
import GoogleMap from './components/GoogleMap.vue'
import GmapCitySearch from './components/GmapCitySearch.vue'

const TAB_NEARBY = 0, TAB_FAVORITES = 1;

export default {
  name: 'app',
  components: {
    AppHeader,
    ResultsList,
    GoogleMap,
    GmapCitySearch
  },
  data: function () {
    return {
      isLoading: false,
      resultsList: [],
      savedReviews: [],
      selectedPlace: {},
      activeTab: TAB_NEARBY
    }
  },
  computed: {
    favoritesList: function () {
      return this.savedReviews.filter(review => review.saved);
    }
  },
  methods: {
    setReview: function (event) {
      // look up place_id in savedReviews
      let matchedReviewIndex = _.findIndex(this.savedReviews, { place_id:event.place_id });
      // create an object with the place details as well as the stars/notes/saved status
      let starredReview = event;
      if (matchedReviewIndex >= 0) {
        // if it exists, update the entry
        this.savedReviews.splice(matchedReviewIndex,1,starredReview);
      }else{
        // else add the object to the array
        this.savedReviews.push(starredReview);
      }
      // update the Results array with the new review
      let matchedResultIndex = _.findIndex(this.resultsList, { place_id:event.place_id });
      let updatedResult = { ...this.resultsList[matchedResultIndex], stars:event.stars, notes:event.notes, saved: event.saved };
      if (matchedResultIndex >= 0) {
        this.resultsList.splice(matchedResultIndex,1,updatedResult);
      }

      // wait until the DOM has fully updated from changing savedReviews/resultsList, then set the selectedPlace
      this.$nextTick(function () {
        // if we are on the My Favorites tab and we just unsaved something, set a different selectedPlace
        if(this.activeTab === TAB_FAVORITES && !event.saved){
          if(this.favoritesList.length){
            // set the selectedPlace to the first item, if we can
            this.selectedPlace = Object.assign({}, this.favoritesList[0], {isNoteFormOpen: false});
          }else{
            // otherwise, set to empty object
            this.selectedPlace = {};
          }
        }else{
          // update the selectedPlace Obj with the new review
          this.selectedPlace = Object.assign({}, this.selectedPlace, { stars:event.stars, notes:event.notes, saved: event.saved, isNoteFormOpen: false });
        }
        console.log(this.selectedPlace.place_id);
      });

      // update localStorage
      localStorage.setItem('local-reviews-savedReviews', JSON.stringify(this.savedReviews));
    },
    setLocationSaveStatus: function (event) {
      this.setReview(event);
    },
    updateResultsList: function (event) {
      this.resultsList = (event.results?event.results:[]);
      if(this.savedReviews.length > 0 && this.resultsList.length > 0){
        this.savedReviews.forEach(review => {
          let matchedResultIndex = _.findIndex(this.resultsList, { place_id:review.place_id });
          if (matchedResultIndex >= 0) {
            this.resultsList[matchedResultIndex] = Object.assign({}, this.resultsList[matchedResultIndex], { stars: review.stars, notes: review.notes, saved: review.saved, isNoteFormOpen: false })
          }
        })
      }
      if(event.keepSelected) {
        // if we are told to keep the current selectedPlace, check if the selectedPlace is in the resultsList
        this.addMissingSelectedPlace();
      }else{        
        // if we dont need to keep the current selectedPlace, grab the first available
        let currentList = (this.activeTab === TAB_FAVORITES?this.favoritesList:this.resultsList);
        if(currentList.length) {
          // set the selectedPlace to the first item in ResultsList/FavoritesList
          // stars/notes/saved should default to empty and be overridden by result var, isNoteFormOpen should override result property to false
          this.selectedPlace = Object.assign({}, { stars: 0, notes: null, saved: false }, currentList[0], { isNoteFormOpen: false });
        }else{
          this.selectedPlace = {};
        }
      }
      this.isLoading = false;
      this.scrollListToPlace();
    },
    selectResult: function (place) {
      // user selects a place from the ResultsList
      // do a sanity check to make sure they arent just clicking the same location
      // update the selectedPlace object
      // stars/notes/saved should default to empty and be overridden by result var, isNoteFormOpen should override result property to false
      if(place.place_id !== this.selectedPlace.place_id) {
        this.selectedPlace = Object.assign({}, { stars: 0, notes: null, saved: false }, place, { isNoteFormOpen: false });
      }
      this.addMissingSelectedPlace();
    },
    addMissingSelectedPlace: function () {
      if(this.activeTab === TAB_NEARBY){
        // if the selectedPlace object is not in the resultList, add it to the front of the array
        if(!this.isPlaceIDInArray(this.selectedPlace.place_id, this.resultsList)){
          console.log("unshift")
          this.resultsList.unshift(this.selectedPlace);
        }
      }
    },
    clickMapPoint: function (place) {
      // user selects a point of interest on the GoogleMap
      // update the selectedPlace obj
      // this.selectedPlace = Object.assign({}, { stars: 0, notes: null, saved: false }, place, { isNoteFormOpen: false });
      this.selectResult(place);

      if(this.activeTab === TAB_FAVORITES){
        // check if the place is in the favorites list
        // if it isnt, switch tabs
        if(!this.isPlaceIDInArray(this.selectedPlace.place_id, this.favoritesList)){
          this.activeTab = TAB_NEARBY;
        }
      }
      
      this.scrollListToPlace();
    },
    scrollListToPlace: function () {
      let map_sidebar = document.getElementById('map-sidebar');
      //delay the scroll work until the DOM has fully updated
      this.$nextTick(function() {
        let element_id = (this.activeTab === TAB_FAVORITES?'favorites-list':'nearby-list');
        let parent_element = document.getElementById(element_id);
        let selected_element = parent_element.getElementsByClassName('result-display selected')[0];
        if(selected_element){
          map_sidebar.scrollTop = selected_element.offsetTop;
        }
      });
    },
    openNoteForm: function (event) {
      // open the AddNoteForm on the Results List
      this.selectedPlace.isNoteFormOpen = true;
    },
    closeNoteForm: function (event) {
      this.selectedPlace.isNoteFormOpen = false;
    },
    toggleNoteForm: function () {
      this.selectedPlace.isNoteFormOpen = !this.selectedPlace.isNoteFormOpen;
    },
    openDifferentNoteForm: function (result) {
      this.selectedPlace.isNoteFormOpen = false;
      this.selectedPlace = Object.assign({}, { stars: 0, notes: null, saved: false }, result, { isNoteFormOpen: true } );
    },
    isPlaceIDInArray(place_id,array){
      // check if a place_id is in an array, return a boolean
      return !!(place_id && _.find(array, { 'place_id': place_id }));
    },
    onChangeTab(index) {
      // if the tab is changed to "My Favorites", check if the selectedPlace is in the favoritesList
      // if true, set the selectedPlace to that array item
      // if not, set the selectedPlace to the first favoritesList result
      if(index === TAB_FAVORITES){
        if(this.selectedPlace){
          let matchedFavoritesIndex = _.findIndex(this.favoritesList, { place_id:this.selectedPlace.place_id });
          if (matchedFavoritesIndex >= 0) {
            this.selectedPlace = this.favoritesList[matchedFavoritesIndex];
          }else{
            this.selectedPlace = (this.favoritesList.length?this.favoritesList[0]:{});
          }
        }else{
          this.selectedPlace = (this.favoritesList.length?this.favoritesList[0]:{});
        }
      }
    }

  },
  created: function () {
    // get localstorage review data
    this.savedReviews = (JSON.parse(localStorage.getItem('local-reviews-savedReviews')) || []);

    // loop through savedReviews array and replace matching (by place_id) results from resultsList array with review/stars (dont overwrite any name/address/etc because results list is more recent)
    if(this.savedReviews.length){
      this.savedReviews.forEach(review => {
        let matchedResultIndex = _.findIndex(this.resultsList, { place_id:review.place_id });
        if (matchedResultIndex >= 0) {
          this.resultsList[matchedResultIndex] = Object.assign(this.resultsList[matchedResultIndex], { stars: review.stars, notes: review.notes, saved: review.saved })
        }
      })
    }
    this.isLoading = false;
  }
}
</script>

<style lang='scss'>
html{
  overflow-y:auto !important;
}
#app {
  height:100vh;
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
  flex-direction:column;
  @media (min-width: 769px) {
    flex-direction:row;
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
  overflow:auto;
  //max-height:100vh;
  @media (min-width: 769px) {
    flex-grow:0;
    width:400px;
    border-left: 1px solid $border;
  }
  .b-tabs{
    min-height:0;
    nav.tabs{
      border-width:0;
      font-weight:bold;
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
#city-search-container{
  float:left;
  padding:5px 10px;
  background:white;
  box-shadow:rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 2px;
  flex:none;
}
</style>
