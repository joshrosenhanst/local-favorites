<template>
  <div id="app">
    <app-header></app-header>
    <!--<MapDisplay></MapDisplay>-->
    <div class="columns is-gapless">
      <google-map
        v-on:start-nearby-search="isLoading = true"
        v-on:get-local-places="updateResultsList"
        class="column"
      ></google-map>
      <aside class="column is-one-third">
        <div id="searchbox-container" class="has-background-primary">
          <gmap-search-box
            v-on:start-search="isLoading = true"
            v-on:get-local-search="updateResultsList"
          ></gmap-search-box>
        </div>
        <results-list
          v-bind:results="resultsList" 
          v-bind:reviews="savedReviews"
          v-bind:is-loading="isLoading"
          v-on:set-review="setReview"
        ></results-list>
      </aside>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AppHeader from './components/AppHeader.vue'
import ResultsList from './components/ResultsList.vue'
import MapDisplay from './components/MapDisplay.vue'
import GoogleMap from './components/GoogleMap.vue'
import GmapSearchBox from './components/GmapSearchBox.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    AppHeader,
    ResultsList,
    MapDisplay,
    GoogleMap,
    GmapSearchBox
  },
  data: function () {
    return {
      isLoading: false,
      // dummy data
      resultsList: [
        { place_id: 'ChIJYRW7lMbMw4kRxwZoPaGKGNY', name: 'The UPS Store', 'vicinity': '253 Main Street, Matawan', url: '', website: '', types: ["finance", "store", "point_of_interest", "establishment"] },
      ],
      savedReviews: [
      ]
    }
  },
  methods: {
    setReview: function (event) {
      // look up place_id in savedReviews
      let matchedReviewIndex = _.findIndex(this.savedReviews, { place_id:event.place_id });
      let starredReview = { place_id:event.place_id, stars:event.stars, notes:event.notes };
      if (matchedReviewIndex >= 0) {
        // if it exists, set the review
        this.savedReviews.splice(matchedReviewIndex,1,starredReview);
      }else{
        // else add the review to the array
        this.savedReviews.push(starredReview);
      }
      //update the Results array with the new review
      let matchedResultIndex = _.findIndex(this.resultsList, { place_id:event.place_id });
      let updatedResult = { ...this.resultsList[matchedResultIndex], stars:event.stars, notes:event.notes };
      if (matchedResultIndex >= 0) {
        this.resultsList.splice(matchedResultIndex,1,updatedResult);
      }
      //update localStorage
      localStorage.setItem('local-reviews-savedReviews', JSON.stringify(this.savedReviews));
    },
    updateResultsList: function (event) {
      this.resultsList = event.results;
      if(this.savedReviews.length){
        this.savedReviews.forEach(review => {
          let matchedResultIndex = _.findIndex(this.resultsList, { place_id:review.place_id });
          if (matchedResultIndex >= 0) {
            this.resultsList[matchedResultIndex] = Object.assign(this.resultsList[matchedResultIndex], { stars: review.stars, notes: review.notes })
          }
        })
      }
      this.isLoading = false;

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
          this.resultsList[matchedResultIndex] = Object.assign(this.resultsList[matchedResultIndex], { stars: review.stars, notes: review.notes })
        }
      })
    }
    this.isLoading = false;
  }
}
</script>

<style lang='scss'>
#app {
}
#searchbox-container{
  padding:15px 10px;
}
</style>
