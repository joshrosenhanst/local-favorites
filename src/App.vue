<template>
  <div id="app">
    <app-header></app-header>
    <main id="app-body">
      <google-map
        v-bind:selected-place="selectedPlace"
        v-bind:reviews="savedReviews"
        v-on:start-nearby-search="isLoading = true"
        v-on:get-local-places="updateResultsList"
        v-on:click-map-point="clickMapPoint"
      ></google-map>
      <aside id="map-sidebar">
        <b-tabs position="is-centered" class="block" expanded type="is-toggle"
          v-model="activeTab"
        >
          <b-tab-item>
            <template slot="header">
              <font-awesome-icon v-bind:icon="['fas','map-marker-alt']" class="tab-icon is-nearby"></font-awesome-icon>
              <span class="tab_nearby-text">Nearby</span>
            </template>
            <results-list
              v-bind:selected-place="selectedPlace"
              v-bind:results="resultsList" 
              v-bind:is-loading="isLoading"
              v-on:set-review="setReview"
              v-on:select-result="selectResult"
              v-on:toggle-note-form="toggleNoteForm"
              v-on:toggle-save-status="setReview"
              v-on:open-different-note-form="openDifferentNoteForm"
              v-on:close-note-form="closeNoteForm"
            ></results-list>
          </b-tab-item>
          <b-tab-item>
            <template slot="header">
              <font-awesome-icon v-bind:icon="['fas','bookmark']" class="tab-icon is-bookmark"></font-awesome-icon>
              <span class="tab_favorites-text">My Favorites</span>
            </template>
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
      // update the selectedPlace Obj with the new review
      this.selectedPlace = Object.assign({}, this.selectedPlace, { stars:event.stars, notes:event.notes, saved: event.saved, isNoteFormOpen: false });

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
      if(!event.keepSelected) {
        if(this.resultsList.length) {
          // set the selectedPlace to the first item in ResultsList
          // stars/notes/saved should default to empty and be overridden by result var, isNoteFormOpen should override result property to false
          this.selectedPlace = Object.assign({}, { stars: 0, notes: null, saved: false }, this.resultsList[0], { isNoteFormOpen: false });
        }else{
          this.selectedPlace = {};
        }
      }
      this.isLoading = false;
    },
    selectResult: function (result) {
      // user selects a place from the ResultsList
      // do a sanity check to make sure they arent just clicking the same location
      // update the selectedPlace object
      // stars/notes/saved should default to empty and be overridden by result var, isNoteFormOpen should override result property to false
      if(result.place_id !== this.selectedPlace.place_id) {
        this.selectedPlace = Object.assign({}, { stars: 0, notes: null, saved: false }, result, { isNoteFormOpen: false });
      }
    },
    clickMapPoint: function (place) {
      // user selects a point of interest on the GoogleMap
      // update the selectedPlace obj
      this.selectedPlace = Object.assign({}, { stars: 0, notes: null, saved: false }, place, { isNoteFormOpen: false });
      this.activeTab = TAB_NEARBY;
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
