<template>
<div id="results-list-container">
  <ul id="results-list">
    <li class="result-display"
      v-for="(result) in results"
      v-bind:class="[ selectedPlace.place_id === result.place_id ? 'selected' : '' ]"
      v-bind:key="result.place_id"
      v-on:click="$emit('select-result',result)"
    >
      <h3 class="result-name">{{ result.name }}</h3>
      <p class="result-info">
        <span class="result-address">{{ result.vicinity || result.formatted_address }}</span>
        <a class="result-map"  v-if="result.url" v-bind:href="result.url" title="Open in Google Maps"><font-awesome-icon icon="map-marked-alt"></font-awesome-icon></a>
        <a class="result-link" v-if="result.website" v-bind:href="result.website" title="Open Website"><font-awesome-icon icon="external-link-alt"></font-awesome-icon></a></p>

      <template v-if="result.notes || result.stars">
        <star-rating
          v-bind:stars="result.stars"
          v-bind:readonly="true"
        ></star-rating>
        <p class="result-notes" v-if="result.notes">{{ result.notes }}</p>
        <add-note-form
          v-bind:result="selectedPlace.place_id === result.place_id ? selectedPlace : result"
          v-on:toggle-note-form="toggleNoteForm(result)"
          v-on:close-note-form="$emit('close-note-form')"
          v-on:submit-note="submitReview(result,$event)"
        >
          <span slot="buttonText">Edit Note</span>
        </add-note-form>
      </template>
      <template v-else>
        <add-note-form
          v-bind:result="selectedPlace.place_id === result.place_id ? selectedPlace : result"
          v-on:toggle-note-form="toggleNoteForm(result)"
          v-on:close-note-form="$emit('close-note-form')"
          v-on:submit-note="submitReview(result,$event)"
        >
          <span slot="buttonText">Add a Note</span>
        </add-note-form>
      </template>
    </li>
  </ul>
  <b-loading v-bind:active.sync="isLoading" v-bind:is-full-page="false"></b-loading>
</div>
</template>

<script>
import _ from 'lodash'
import StarRating from './StarRating.vue'
import AddNoteForm from './AddNoteForm.vue'

export default {
  name: 'ResultsList',
  components: {
    StarRating,
    AddNoteForm
  },
  props: {
    selectedPlace: Object,
    results: Array,
    reviews: Array,
    isLoading: Boolean
  },
  data: function () {
    return {
      
    }
  },
  methods: {
    submitReview: function (result,event) {
      this.$emit('set-review', { place_id: result.place_id, stars: event.stars, notes: event.notes })
    },
    toggleNoteForm: function (result) {
      //event.stopPropogation();
      if(this.selectedPlace.place_id === result.place_id) {
        this.$emit('toggle-note-form');
      }else{
        this.$emit('open-different-note-form', result);
      }
    }
  },
  created: function () {
  }
}
</script>

<style lang="scss" scoped>
#results-list-container {
  position:relative;
  max-height:500px;
  overflow-y:scroll;
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
