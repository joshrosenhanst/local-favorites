<template>
<div class="results-list-container">
  <result-display
    v-for="(result,index) in results"
    v-bind:key="result.place_id"
    v-bind:result="result"
    v-bind:index="index"
    v-bind:selected-place="selectedPlace"
    v-on:select-result="$emit('select-result',$event)"
    v-on:set-review="$emit('set-review',$event)"
    v-on:toggle-note-form="$emit('toggle-note-form')"
    v-on:close-note-form="$emit('close-note-form')"
    v-on:open-different-note-form="$emit('open-different-note-form',$event)"
  ></result-display>
  <b-loading v-bind:active.sync="isLoading" v-bind:is-full-page="false"></b-loading>
  <div v-if="results.length === 0" class="no-results">
    <h3 class="title">No Results</h3>
    <small class="subtitle"><slot name="no-results-text"></slot></small>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import ResultDisplay from './ResultDisplay.vue'

export default {
  name: 'ResultsList',
  components: {
    ResultDisplay
  },
  props: {
    selectedPlace: Object,
    results: Array,
    isLoading: Boolean,
    isTabActive: Boolean
  },
  data: function () {
    return {
      
    }
  },
  methods: {
    isPlaceInResults: function (place_id) {
      //return boolean if selectedPlace exists inside the results array (matched by place_id)
      return !!(place_id && _.find(this.results, { 'place_id': place_id }));
    }
  },
  watch: {
    /*selectedPlace: function (newPlace) {
      // when the selectedPlace object changes
      // check if the place_id exists, the place is not in the results array, and this tab is active
      // if that is true, add the selectedPlace to the results array
      console.log(newPlace.name);
      if(newPlace.place_id && !this.isPlaceInResults(newPlace.place_id) && this.isTabActive) {
        console.log("unshift")
        this.results.unshift(newPlace);
      }
    }*/
  }
}
</script>

<style lang="scss" scoped>
.results-list-container {
  position:relative;
  //display:flex;
  //flex-direction:column;
}
.no-results{
  text-align:center;
  font-weight:bold;
  padding:1.5rem 10px;
}
</style>
