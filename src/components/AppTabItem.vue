<template>
  <transition v-bind:name="tabTransitionName">
    <div v-show="active && visible" class="tab-item">
      <results-list 
        v-bind:list-id="listId"
        v-bind:results="results" 
        v-bind:is-tab-active="active"

        v-on:set-review="$emit('set-review',$event)"
        v-on:select-result="$emit('select-result',$event)"
        v-on:toggle-note-form="$emit('toggle-note-form')"
        v-on:open-different-note-form="$emit('open-different-note-form',$event)"
        v-on:close-note-form="$emit('close-note-form')"
      >
        <slot name="no-results-text" slot="no-results-text"></slot>
      </results-list>
    </div>
  </transition>
</template>

<script>
import ResultsList from './ResultsList.vue'

export default {
  name: 'AppTabItem',
  components: {
    ResultsList
  },
  props: {
    // tab display props
    active: Boolean,
    tabTransitionName: String,
    visible: {
      type: Boolean,
      default: true
    },

    //results list props
    listId: String,
    results: Array
  },
  data: function () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.tab-content {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
  .tab-item {
    flex-shrink: 0;
    flex-basis: auto;
  }
}
</style>
