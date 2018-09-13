<template>
<div class="results-list-container" v-bind:id="listId">
  <result-display
    v-for="(result,index) in results"
    v-bind:key="result.place_id"
    v-bind:result="result"
    v-bind:index="index"

    v-on:select-result="$emit('select-result',$event)"
    v-on:set-review="$emit('set-review',$event)"
    v-on:toggle-note-form="$emit('toggle-note-form')"
    v-on:close-note-form="$emit('close-note-form')"
    v-on:open-different-note-form="$emit('open-different-note-form',$event)"
  ></result-display>
  <div v-if="results.length === 0" class="no-results">
    <h3 class="title">No Results</h3>
    <small class="subtitle"><slot name="no-results-text"></slot></small>
  </div>
  
  <transition name="fade">
    <div class="loading-overlay is-active" v-if="AppData.isLoading">
        <div class="loading-background" @click="cancelLoading"/>
        <div class="loading-icon"/>
    </div>
  </transition>
</div>
</template>

<script>
import AppStore from '../AppStore.js'
import ResultDisplay from './ResultDisplay.vue'

export default {
  name: 'ResultsList',
  components: {
    ResultDisplay
  },
  props: {
    listId: String,
    results: Array,
    isTabActive: Boolean
  },
  data: function () {
    return {
      AppData: AppStore.state
    }
  },
  methods: {
    cancelLoading: function () { 
      AppStore.setIsLoading(false);
    }
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
