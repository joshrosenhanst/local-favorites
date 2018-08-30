<template>
<div id="results-list-container" class="scrollable-content">
  <result-display
    v-for="(result) in results"
    v-bind:key="result.place_id"
    v-bind:result="result"
    v-bind:selected-place="selectedPlace"
    v-on:select-result="$emit('select-result',$event)"
    v-on:set-review="$emit('set-review',$event)"
    v-on:toggle-note-form="$emit('toggle-note-form')"
    v-on:close-note-form="$emit('close-note-form')"
    v-on:open-different-note-form="$emit('open-different-note-form',$event)"
  ></result-display>
  <b-loading v-bind:active.sync="isLoading" v-bind:is-full-page="false"></b-loading>
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
    isLoading: Boolean
  },
  data: function () {
    return {
      
    }
  },
  computed: {
    isSelectedPlaceInResults: function () {
      //return boolean if selectedPlace exists inside the results array (matched by place_id)
      return !!(this.selectedPlace && _.find(this.results, { 'place_id': this.selectedPlace.place_id }));
    }
  },
  watch: {
    selectedPlace: function (newPlace) {
      console.log("updated selected place")
      if(!this.isSelectedPlaceInResults) {
        this.results.unshift(this.selectedPlace);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#results-list-container {
  position:relative;
  display:flex;
  flex-direction:column;
}
.scrollable-content {
  flex-grow: 1;
  overflow:auto;
  min-height:0;
}
.result-display{
  border-bottom: 1px solid #dbdbdb;
  border-left: 1px solid #dbdbdb;
  border-right: 1px solid #dbdbdb;
  padding:10px;
  &:first-child{
    border-top: 1px solid #dbdbdb;
  }
  &:hover{
    background-color:#ffaafa;
  }
  &.selected{
    background-color:#dadada;
  }
}
.result-name{
  font-size: 1rem;
  color: #4a4a4a;
  font-weight: 500;
  line-height: 1.25;
}
.result-map{
  margin-left:10px;
}
.result-link{
  margin-left:10px;
}
.result-info{
  font-size:0.8rem;
}

</style>
