<template>
  <section class="section">
    <div class="container">
      <ul id="results-list">
        <li
            v-for="(result) in results"
            v-bind:key="result.id"
            class="result-display box"
        >
            <h3 class="result-name">{{ result.name }}</h3>
            <p class="result-info">{{ result.type }} - {{ result.address }}, {{ result.city }}<a class="result-map" href="" title="Open in Google Maps"><font-awesome-icon icon="map-marked-alt"></font-awesome-icon></a><a class="result-link" v-if="result.url" v-bind:href="result.url" title="Open Website"><font-awesome-icon icon="external-link-alt"></font-awesome-icon></a></p>
            <StarRating
              v-bind:stars="result.stars"
              v-on:set-stars="result.stars = $event.value; $emit('set-review', { id: result.id, stars: $event.value, notes: result.notes })"
            ></StarRating>
            <p class="result-notes" v-if="result.notes">{{ result.notes }}</p>
            <button class="button" v-else>
              <span class="icon is-small"><font-awesome-icon icon="comment-alt"></font-awesome-icon></span>
              <span>Leave a Review</span>
            </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import StarRating from './StarRating.vue'

export default {
  name: 'ResultsList',
  components: {
    StarRating
  },
  props: {
    results: Array,
    reviews: Array
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
      this.$emit('set-review', {id: event.id, stars: event.stars, notes:event.notes });
    }, 350)
  },
  created: function () {
  }
}
</script>

<style lang="scss" scoped>
.result-name{
  font-size: 1.5rem;
  color: #4a4a4a;
  font-weight: 400;
  line-height: 1.25;
}
.result-map{
  margin-left:10px;
}
.result-link{
  margin-left:10px;
}
</style>
