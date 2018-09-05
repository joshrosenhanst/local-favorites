<template>
  <div id="app">
    <app-header></app-header>
    <main id="app-body">
      <google-map
        v-bind:selected-place="selectedPlace"
        v-bind:results="resultsList" 
        v-bind:reviews="savedReviews"
        v-on:start-nearby-search="isLoading = true"
        v-on:get-local-places="updateResultsList"
        v-on:click-map-point="clickMapPoint"
      ></google-map>
      <aside id="map-sidebar">
        <!--<b-tabs position="is-centered" class="block" type="is-toggle">
          <b-tab-item label="Nearby"></b-tab-item>
          <b-tab-item label="My Favorites"></b-tab-item>
          <b-tab-item label="My Reviews"></b-tab-item>
        </b-tabs>-->
        <results-list
          v-bind:selected-place="selectedPlace"
          v-bind:results="resultsList" 
          v-bind:reviews="savedReviews"
          v-bind:is-loading="isLoading"
          v-on:set-review="setReview"
          v-on:select-result="selectResult"
          v-on:toggle-note-form="toggleNoteForm"
          v-on:toggle-save-status="setReview"
          v-on:open-different-note-form="openDifferentNoteForm"
          v-on:close-note-form="closeNoteForm"
        ></results-list>
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
      selectedPlace: {}
    }
  },
  methods: {
    setReview: function (event) {
      // look up place_id in savedReviews
      let matchedReviewIndex = _.findIndex(this.savedReviews, { place_id:event.place_id });
      let starredReview = { place_id:event.place_id, stars:event.stars, notes:event.notes, saved: event.saved };
      if (matchedReviewIndex >= 0) {
        // if it exists, set the review
        this.savedReviews.splice(matchedReviewIndex,1,starredReview);
      }else{
        // else add the review to the array
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
      this.resultsList = event.results;
      if(this.savedReviews.length){
        this.savedReviews.forEach(review => {
          let matchedResultIndex = _.findIndex(this.resultsList, { place_id:review.place_id });
          if (matchedResultIndex >= 0) {
            this.resultsList[matchedResultIndex] = Object.assign({}, this.resultsList[matchedResultIndex], { stars: review.stars, notes: review.notes, saved: review.saved, isNoteFormOpen: false })
          }
        })
      }
      console.log(event.keepSelected);
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
  overflow-y:auto;
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
  padding:20px;
  text-align:center;
}

#map-sidebar{
  flex-grow:1;

  display:flex;
  flex-direction:column;
  min-height:0;
  max-height:100vh;
  @media (min-width: 769px) {
    flex-grow:0;
    width:400px;
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
