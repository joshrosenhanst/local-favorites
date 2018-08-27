<template>
<div id="results-list-container">
  <ul id="results-list">
    <li
        v-for="(result) in results"
        v-bind:key="result.place_id"
        class="result-display"
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
            v-bind:result="result"
            v-on:submit-note="submitReview(result,$event)"
          >
            <span slot="buttonText">Edit Note</span>
          </add-note-form>
        </template>
        <template v-else>
          <add-note-form
            v-bind:result="result"
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
    results: Array,
    reviews: Array,
    isLoading: Boolean
  },
  data: function () {
    return {
      
    }
  },
  methods: {
    setNotes: function (event) {
      
    },
    debouncedSetNotes: _.debounce(function (event) {
      console.log("debounced");
      this.$emit('set-review', {place_id: event.place_id, stars: event.stars, notes:event.notes });
    }, 350),
    submitReview: function (result,event) {
      this.$emit('set-review', { place_id: result.place_id, stars: event.stars, notes: event.notes })
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
