<template>
  <div class="result-display"
    v-bind:class="[ isSelected ? 'selected' : '' ]"
    v-on:click="$emit('select-result',result)"
  >
    <b-field class="result-buttons">
      <div class="control">
        <button class="button is-small result-add-note is-rounded" 
          v-bind:title="noteButtonText"
          v-bind:class="[ isOpen ? 'is-active' : '' ]"
          v-on:click.stop="toggleNoteForm(result)" 
        >
          <span class="icon is-small"><font-awesome-icon icon="sticky-note"></font-awesome-icon></span>
          <span class="buttonText">{{ noteButtonText }}</span>
        </button>
      </div>
      <div class="control">
        <button class="button is-small result-favorite is-rounded"
          v-bind:title="saveButtonText"
          v-bind:class="[ result.saved?'is-saved':'' ]"
          v-on:click="toggleSaveStatus(result)"
        >
          <span class="icon is-small"><font-awesome-icon icon="bookmark"></font-awesome-icon></span>
        </button>
      </div>
    </b-field>
    <star-rating
      v-if="result.stars"
      v-bind:stars="result.stars"
      v-bind:readonly="true"
    ></star-rating>
    <h3 class="result-name">{{ result.name }}</h3>
    <p class="result-info">
      <span class="result-address">{{ result.vicinity || result.formatted_address }}</span>
      <!--<a class="result-map"  v-if="result.url" v-bind:href="result.url" title="Open in Google Maps"><font-awesome-icon icon="map-marked-alt"></font-awesome-icon></a>
      <a class="result-link" v-if="result.website" v-bind:href="result.website" title="Open Website"><font-awesome-icon icon="external-link-alt"></font-awesome-icon></a>-->
    </p>

    <template v-if="result.notes || result.stars">
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
  </div>
</template>

<script>
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
    selectedPlace: Object
  },
  methods: {
    submitReview: function (result,event) {
      this.$emit('set-review', { place_id: result.place_id, stars: event.stars, notes: event.notes, saved: event.saved })
    },
    toggleNoteForm: function (result) {
      //event.stopPropogation();
      if(this.selectedPlace.place_id === result.place_id) {
        this.$emit('toggle-note-form');
      }else{
        this.$emit('open-different-note-form', result);
      }
    },
    toggleSaveStatus: function (result) {
      this.submitReview(result, { place_id: result.place_id, stars: result.stars, notes: result.notes, saved: !result.saved })
    }
  },
  computed: {
    isSelected: function () {
      return this.selectedPlace.place_id === this.result.place_id;
    },
    isOpen: function () {
      return this.isSelected && this.selectedPlace.hasOwnProperty('isNoteFormOpen') && this.selectedPlace.isNoteFormOpen;
    },
    noteButtonText: function () {
      return (this.result.notes || this.result.stars)?"Edit Note":"Add Note";
    },
    saveButtonText: function () {
      return this.result.saved?"Unsave Location":"Unsave Location";
    }
  }
}
</script>

<style lang="scss" scoped>
.result-display{
  position:relative;
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
.result-notes{
  font-style:italic;
  border-left:3px solid #cacaca;
  padding-left:5px;
}
.result-buttons{
  float:right;
  margin:0 0 4px 4px;
}
.result-favorite.is-saved{
  color:yellow;
}
</style>
