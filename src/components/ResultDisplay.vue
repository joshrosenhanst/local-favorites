<template>
  <div class="result-display"
    v-bind:class="[ isSelected ? 'selected' : '' ]"
    v-on:click="$emit('select-result',result)"
  >
    <div class="result-main-section">
      <div class="result-info-section">
        <div class="result-info-header">
          <span class="bookmark-icon" v-if="!isSelected && result.stars && result.saved" title="Bookmarked"><font-awesome-icon v-bind:icon="['fas','bookmark']"></font-awesome-icon></span>
          <star-rating
            v-if="result.stars"
            v-bind:stars="result.stars"
            v-bind:readonly="true"
          ></star-rating>
        </div>
        <h3 class="result-name">
          <span class="bookmark-icon" v-if="!isSelected && result.saved && !result.stars" title="Bookmarked"><font-awesome-icon v-bind:icon="['fas','bookmark']"></font-awesome-icon></span>
          {{ result.name }}
        </h3>
        <div class="result-address">
          <span class="result-address-text">{{ result.vicinity || result.formatted_address }}</span>
        </div>
        <div class="result-notes" v-if="result.notes">{{ result.notes }}</div>
        <div class="result-external-link" v-if="isSelected">
          <a class="external-link-icon" v-bind:href="mapLinkURL" title="Open in Google Maps" target="_blank" rel="noopener noreferrer" ><font-awesome-icon icon="map-marked-alt"></font-awesome-icon> Open in Google Maps</a>
        </div>
      </div>
      <transition name="slide-in">
      <div class="result-buttons-section" v-show="isSelected">
        <button class="side-button result-favorite"
          v-bind:class="[ result.saved?'is-saved':'' ]"
          v-bind:title="saveButtonText"
          v-on:click="toggleSaveStatus(result)"
        >
          <div class="button-icon"><font-awesome-icon v-bind:icon="[result.saved?'fas':'far','bookmark']" ></font-awesome-icon></div>
          <div class="button-text">{{ saveButtonText }}</div>
        </button>
        <button class="side-button result-add-note"
          v-bind:class="[ isOpen ? 'is-active' : '', (result.notes || result.stars)?'has-note':'' ]"
          v-bind:title="noteButtonText"
          v-on:click.stop="toggleNoteForm(result)" 
        >
          <div class="button-icon"><font-awesome-icon v-bind:icon="[(result.notes || result.stars)?'fas':'far','edit']"></font-awesome-icon></div>
          <div class="button-text">{{ noteButtonText }}</div>
        </button>
      </div>
      </transition>
    </div>
    <div class="result-notes-section" v-if="isSelected">
      <add-note-form
        v-bind:stars="result.stars"
        v-bind:notes="result.notes"
        v-bind:saved="result.saved"
        v-bind:is-open="isOpen"
        
        v-on:toggle-note-form="toggleNoteForm(result)"
        v-on:close-note-form="$emit('close-note-form')"
        v-on:submit-note="submitReview(result,$event)"
      ></add-note-form>
    </div>
  </div>
</template>

<script>
import AppStore from '../AppStore.js'
import StarRating from './StarRating.vue'
import AddNoteForm from './AddNoteForm.vue'

export default {
  name:'ResultDisplay',
  components: {
    StarRating,
    AddNoteForm
  },
  props: {
    result: Object,
    index: Number
  },
  data: function () {
    return {
      AppData: AppStore.state
    }
  },
  methods: {
    submitReview: function (result,event) {
      // this.$emit('set-review', { place_id: result.place_id, stars: event.stars, notes: event.notes, saved: event.saved })
      this.$emit('set-review', Object.assign({}, result, { stars: event.stars, notes: event.notes, saved: event.saved, isNoteFormOpen: false }))
    },
    toggleNoteForm: function (result) {
      //event.stopPropogation();
      if(this.AppData.selectedPlace && this.AppData.selectedPlace.place_id === result.place_id) {
        this.$emit('toggle-note-form');
      }else{
        this.$emit('open-different-note-form', result);
      }
    },
    toggleSaveStatus: function (result) {
      this.submitReview(result, { place_id: result.place_id, stars: result.stars, notes: result.notes, saved: !result.saved })
    },
    getLatLangURL: function (locObject) {
      let lng = (typeof locObject.lng === 'function'?locObject.lng():locObject.lng);
      let lat = (typeof locObject.lat === 'function'?locObject.lat():locObject.lat);
      return lat.toFixed(6)+","+lng.toFixed(6);
    }
  },
  computed: {
    isSelected: function () {
      return this.AppData.selectedPlace && ( this.AppData.selectedPlace.place_id === this.result.place_id )
    },
    isOpen: function () {
      return this.isSelected && this.AppData.selectedPlace.hasOwnProperty('isNoteFormOpen') && this.AppData.selectedPlace.isNoteFormOpen;
    },
    noteButtonText: function () {
      return (this.result.notes || this.result.stars)?"Edit Note":"Add Note";
    },
    saveButtonText: function () {
      return this.result.saved?"Unsave":"Save";
    },
    mapLinkURL: function () {
      let query = this.result.geometry?this.getLatLangURL(this.result.geometry.location):this.result.name;
      return process.env.VUE_APP_MAP_SEARCH_URL + encodeURI("query=" + query + "&query_place_id=" + this.result.place_id);
    }
  }
}
</script>

<style lang="scss" scoped>
.result-display{
  position:relative;
  border-bottom: 1px solid $border;
  border-left: 0;
  border-right: 0;
  padding:0;
  display:flex;
  flex-direction: column;
  align-items:stretch;
  //flex:none;
  cursor:pointer;
  &:first-child{
    //border-top: 1px solid $border;
  }
  &:hover{
    background-color:#ffaafa;
    background-color:$white-ter;
  }
  &.selected{
    //background-color:$white-bis;
    background-color:$primary;
    //border-top: 1px solid $border;
    border-color:$border;
    cursor:default;
    color:$white-bis;
    .result-name{
      //color:$primary;
      color:white;
    }
    .result-notes{
      border-color:$grey-lightest;
      color:$grey-lightest;
    }
    .result-external-link>a{
      color:$white-bis;
      &:hover{
        color:white;
        text-decoration: underline;
      }
    }
    .result-buttons-section{
      background-color:$white-bis;
      opacity:1;
    }
  }
}
.result-main-section {
  flex-grow:1;
  display:flex;
  justify-content:space-between;
}
.result-info-section {
  flex-grow:1;
  padding:10px;
}
.bookmark-icon{
  float:right;
  margin-right:6px;
  font-size:1rem;
  color:$orange;
}
.map-marker-icon{
  float:left;
  margin-right:6px;
  color:$red;
}
.result-external-link{
  font-size:0.8rem;
}
.result-name{
  font-size: 1rem;
  color: #4a4a4a;
  font-weight: 500;
  line-height: 1.25;
}
.result-address{
  font-size:0.85rem;
}
.result-notes{
  font-size:0.85rem;
  font-style:italic;
  border-left:2px solid $turquoise;
  color:$turquoise-dark;
  padding-left:5px;
  margin:5px 0;
}
.result-buttons-section {
  flex-grow:0;
  flex-shrink:1;
  display:flex;
  flex-direction:column;
  border-left:1px solid $border;
  .side-button{
    flex-grow:0;
    text-align:center;
    cursor:pointer;
    border-width:1px 0 1px;
    border-style:solid;
    border-color:$border;
    background:transparent;
    border-radius:0;
    padding:10px 6px;
    width:70px;
    color:$link;
    outline:0;
    transition:background-color 500ms ease, color 500ms ease;
    &::-moz-focus-inner{
      border-style: none;
      padding: 0;
    }
    &:hover{
      background-color:$grey-lightest;
      color:$link-hover;
    }
    &.is-active,&:active{
      background-color:$grey-lighter;
      color:$primary;
      outline:none;
    }
    &.is-focused,&:focus{
      outline:none;
    }
    &.is-saved{
      color:$orange;
    }
    &.has-note{
      //color:$primary;
      //color:$turquoise;
    }
    &:first-child {
      border-top:0;
    }
    &:not(:last-child) {
      border-bottom:0;
    }
    .button-icon{
      width:100%;
      font-size:1rem;
      margin:0 auto;
    }
    &.result-add-note .fa-edit{
      margin-left:5px;
    }
    &.result-favorite{
    }
    .button-text{
      font-weight:500;
    }
  }
}
.result-notes-section {
  flex-grow:1;
}
</style>
