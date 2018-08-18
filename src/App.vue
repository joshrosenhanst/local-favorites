<template>
  <div id="app">
    <AppHeader></AppHeader>
    <ResultsList v-bind:results="resultsList" v-bind:reviews="savedReviews"></ResultsList>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AppHeader from './components/AppHeader.vue'
import ResultsList from './components/ResultsList.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    AppHeader,
    ResultsList
  },
  data: function () {
    return {
      // dummy data
      resultsList: [
        { id: 0, name: 'Good Thai Food', address: '400 Fake Lane', city: 'Aberdeen', state: 'NJ', zip: '07747', url: 'https://google.com/' },
        { id: 1, name: 'Mangiannos', address: '360 Fake Ave', city: 'Aberdeen', state: 'NJ', zip: '07747', url: 'https://google.com/' },
        { id: 2, name: 'Barnios', address: '360 Fake Ave', city: 'Aberdeen', state: 'NJ', zip: '07747', url: 'https://google.com/' },
      ],
      savedReviews: [
        { id: 0, stars: '4', notes: 'This is a good thai food place, a little too spicy!' },
        { id: 1, stars: '1', notes: 'Got food poisoning - no thanks :(' }
      ]
    }
  },
  created: function () {
    // get localstorage data

    // loop through savedReviews array and replace matching (by id) results from resultsList array with review/stars (dont overwrite any name/address/etc because results list is more recent)
    this.savedReviews.forEach(review => {
      let matchedResultIndex = _.findIndex(this.resultsList, { id:review.id });
      if(matchedResultIndex >= 0){
          this.resultsList[matchedResultIndex] = Object.assign(this.resultsList[matchedResultIndex], { stars: review.stars, notes: review.notes });
      }
    });
  }
}
</script>

<style lang='scss'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
