<template>
  <div id="app">
    <app-header></app-header>
    <!--<MapDisplay></MapDisplay>-->
    <results-list
      v-bind:results="resultsList" 
      v-bind:reviews="savedReviews"
      v-on:set-review="setReview"
    ></results-list>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AppHeader from './components/AppHeader.vue'
import ResultsList from './components/ResultsList.vue'
import MapDisplay from './components/MapDisplay.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    AppHeader,
    ResultsList,
    MapDisplay
  },
  data: function () {
    return {
      // dummy data
      resultsList: [
        { id: 0, name: 'Good Thai Food', address: '400 Fake Lane', city: 'Aberdeen', state: 'NJ', zip: '07747', url: 'https://google.com/', type: 'Thai' },
        { id: 1, name: 'Mangiannos', address: '360 Fake Ave', city: 'Aberdeen', state: 'NJ', zip: '07747', url: 'https://google.com/', type: 'Italian' },
        { id: 2, name: 'Barnios', address: '360 Fake Ave', city: 'Aberdeen', state: 'NJ', zip: '07747', url: '', type: 'Bar' },
      ],
      savedReviews: [
      ]
    }
  },
  methods: {
    setReview: function (event) {
      // look up id in savedReviews
      let matchedReviewIndex = _.findIndex(this.savedReviews, { id:event.id });
      let starredReview = { id:event.id, stars:event.stars, notes:event.notes };
      if (matchedReviewIndex >= 0) {
        // if it exists, set the review
        this.savedReviews.splice(matchedReviewIndex,1,starredReview);
      }else{
        // else add the review to the array
        this.savedReviews.push(starredReview);
      }
      //update the Results array?
      //update localStorage
      localStorage.setItem('local-reviews-savedReviews', JSON.stringify(this.savedReviews));
    },
    setMaps: function (type,location) {
      
    }
  },
  created: function () {
    // get localstorage review data
    this.savedReviews = (JSON.parse(localStorage.getItem('local-reviews-savedReviews')) || []);

    // loop through savedReviews array and replace matching (by id) results from resultsList array with review/stars (dont overwrite any name/address/etc because results list is more recent)
    if(this.savedReviews.length){
      this.savedReviews.forEach(review => {
        let matchedResultIndex = _.findIndex(this.resultsList, { id:review.id });
        if (matchedResultIndex >= 0) {
          this.resultsList[matchedResultIndex] = Object.assign(this.resultsList[matchedResultIndex], { stars: review.stars, notes: review.notes })
        }
      })
    }
  }
}
</script>

<style lang='scss'>
#app {
}
</style>
