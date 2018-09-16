<template>
  <aside id="map-sidebar">
    <nav class="tabs is-fullwidth is-toggle" role="navigation">
      <ul>
        <li v-bind:class="{ 'is-active':(AppData.activeTab === 0) }">
          <a tabindex="0"
            v-on:click="changeTab(0)" 
            v-on:keydown.enter.prevent="changeTab(0)" 
            v-on:keydown.space.prevent="changeTab(0)" 
          >
            <font-awesome-icon v-bind:icon="['fas','map-marker-alt']" class="tab-icon is-nearby"></font-awesome-icon>
            <span class="tab_nearby-text">Nearby</span>
          </a>
        </li>
        <li v-bind:class="{ 'is-active':(AppData.activeTab === 1) }">
          <a tabindex="0"
            v-on:click="changeTab(1)"
            v-on:keydown.enter.prevent="changeTab(1)" 
            v-on:keydown.space.prevent="changeTab(1)" 
          >
            <font-awesome-icon v-bind:icon="['fas','bookmark']" class="tab-icon is-bookmark"></font-awesome-icon>
            <span class="tab_favorites-text">My Favorites</span>
          </a>
        </li>
      </ul>
    </nav>
    <section class="tab-content">
      <app-tab-item
        id="nearby-list-tab-item"
        v-bind:active="(AppData.activeTab === 0)"
        v-bind:tab-transition-name="tabTransitionName"
        v-bind:list-id="'nearby-list'"
        v-bind:results="AppData.resultsList"

        v-on:set-review="$emit('set-review',$event)"
        v-on:select-result="$emit('select-result',$event)"
        v-on:toggle-note-form="$emit('toggle-note-form')"
        v-on:open-different-note-form="$emit('open-different-note-form',$event)"
        v-on:close-note-form="$emit('close-note-form')"
      >
        <template slot="no-results-text">Try searching in another area</template>
      </app-tab-item>
      <app-tab-item
        id="favorites-list-tab-item"
        v-bind:active="(AppData.activeTab === 1)"
        v-bind:tab-transition-name="tabTransitionName"
        v-bind:list-id="'favorites-list'"
        v-bind:results="favoritesList"

        v-on:set-review="$emit('set-review',$event)"
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
      AppStore.setActiveTab(newIndex)
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
  border:0;
  border-bottom:1px solid $border;
  font-weight:bold;
  margin-bottom:1px;
  &.is-toggle{
    li a{
      border:0;
      border-bottom:4px solid transparent;
      &:hover,&:focus{
        background-color:$grey-lighter;
      }
      &:focus,&.is-focused{
        border-color:$focus-outline-color;
      }
    }
    li.is-active a{
      background-color:$primary;
      color:white;
      border-color:$focus-outline-color;
      .tab-icon{
        color:white;
      }
      &:focus,&.is-focused{
        border-color:$focus-outline-color;
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
