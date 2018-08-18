<template>
    <ol id="results-list">
        <li
            v-for="(result,index) in results"
            v-bind:key="result.id"
        >
            {{ index }} - {{ result.name }}
            <select v-model="result.stars">
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
            </select>
            {{ result.notes }}
        </li>
    </ol>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'ResultsList',
  props: {
    results: Array,
    reviews: Array
  },
  data: function () {
    return {
        reviewedResults: {}
    }
  },
  created: function () {
  }
}
</script>

<style lang="scss" scoped>
</style>
