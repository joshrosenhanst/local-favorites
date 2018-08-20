<template>
    <ol id="results-list">
        <li
            v-for="(result,index) in results"
            v-bind:key="result.id"
        >
            {{ index }} - {{ result.name }}
            <div v-if="result.stars || result.notes">
              <StarRating
                v-bind:stars="result.stars"
                v-on:set-stars="result.stars = $event.value; $emit('set-review', { id: result.id, stars: $event.value, notes: result.notes })"
              ></StarRating>
              <textarea
                v-bind:value="result.notes"
                v-on:input="result.notes = $event.target.value; debouncedSetNotes({ id: result.id, stars: result.stars, notes: $event.target.value })"
              ></textarea>
            </div>
            <button v-else>Leave a Rating</button>
        </li>
    </ol>
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
</style>
