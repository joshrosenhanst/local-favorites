<template>
  <aside id="map-sidebar">
    <nav class="tabs is-fullwidth is-toggle">
      <ul>
        <li v-bind:class="{ 'is-active':(AppData.activeTab === 0) }">
          <a v-on:click="tabClick(0)">
            <font-awesome-icon v-bind:icon="['fas','map-marker-alt']" class="tab-icon is-nearby"></font-awesome-icon>
            <span class="tab_nearby-text">Nearby</span>
          </a>
        </li>
        <li v-bind:class="{ 'is-active':(AppData.activeTab === 1) }">
          <a v-on:click="tabClick(1)">
            <font-awesome-icon v-bind:icon="['fas','bookmark']" class="tab-icon is-bookmark"></font-awesome-icon>
            <span class="tab_favorites-text">My Favorites</span>
          </a>
        </li>
      </ul>
    </nav>
    <section class="tab-content">
      <app-tab-item
        v-bind:active="(AppData.activeTab === 0)"
        v-bind:tab-transition-name="tabTransitionName"
        v-bind:list-id="'nearby-list'"
        v-bind:results="AppData.resultsList"

        v-on:set-review="$emit('set-review',$event)"
        v-on:toggle-save-status="$emit('set-review',$event)"
        v-on:select-result="$emit('select-result',$event)"
        v-on:toggle-note-form="$emit('toggle-note-form')"
        v-on:open-different-note-form="$emit('open-different-note-form',$event)"
        v-on:close-note-form="$emit('close-note-form')"
      >
        <template slot="no-results-text">Try searching in another area</template>
      </app-tab-item>
      <app-tab-item
        v-bind:active="(AppData.activeTab === 1)"
        v-bind:tab-transition-name="tabTransitionName"
        v-bind:list-id="'favorites-list'"
        v-bind:results="favoritesList"

        v-on:set-review="$emit('set-review',$event)"
        v-on:toggle-save-status="$emit('set-review',$event)"
        v-on:select-result="$emit('select-result',$event)"
        v-on:toggle-note-form="$emit('toggle-note-form')"
        v-on:open-different-note-form="$emit('open-different-note-form',$event)"
        v-on:close-note-form="$emit('close-note-form')"
      >
        <template slot="no-results-text">Add a place to your favorites list</template>
      </app-tab-item>
    </section>
  </aside>
</template>

<script>
import AppStore from '../AppStore.js'
import AppTabItem from './AppTabItem.vue'

export default {
  name: 'AppSidebar',
  components: {
    AppTabItem
  },
  props: {
    favoritesList: Array
  },
  data: function () {
    return {
      AppData: AppStore.state,
      tabTransitionName: 'slide-next'
    }
  },
  methods: {
    // tab methods
    changeTab: function (newIndex) {
      if (this.AppData.activeTab === newIndex) return

      this.tabTransitionName = (newIndex < this.AppData.activeTab ? 'slide-next' : 'slide-prev');
      this.$emit('change-tab', { value: newIndex })
    },
    tabClick(value) {
      this.$emit('input', value)
      this.changeTab(value)
    }
  }
}
</script>

<style lang="scss" scoped>
#map-sidebar{
  flex-grow:1;
  min-height:0;
  //max-height:100vh;
  @media (min-width: 769px) {
    flex-grow:0;
    width:400px;
    border-left: 1px solid $border;
    overflow:auto;
  }
}
nav.tabs{
  border-width:0;
  border-bottom:1px solid $border;
  font-weight:bold;
  margin-bottom:-1px;
  &.is-toggle{
    li.is-active a{
      background-color:$primary;
      border:0;
      color:white;
      .tab-icon{
        color:white;
      }
    }
    a{
      border:0;
      &:hover,&:focus{
        background-color:$grey-lighter;
      }
    }
  }
  .tab-icon{
    margin-right:4px;
    &.is-bookmark{
      color:$orange;
    }
    &.is-nearby{
      color:$primary;
    }
  }
}
</style>
