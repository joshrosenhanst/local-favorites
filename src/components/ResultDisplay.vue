<template>
  <div class="result-display"
    v-bind:class="[ selectedPlace.place_id === result.place_id ? 'selected' : '' ]"
    v-on:click="$emit('select-result',result)"
  >
    <h3 class="result-name">{{ result.name }}</h3>
    <p class="result-info">
      <span class="result-address">{{ result.vicinity || result.formatted_address }}</span>
      <!--<a class="result-map"  v-if="result.url" v-bind:href="result.url" title="Open in Google Maps"><font-awesome-icon icon="map-marked-alt"></font-awesome-icon></a>
      <a class="result-link" v-if="result.website" v-bind:href="result.website" title="Open Website"><font-awesome-icon icon="external-link-alt"></font-awesome-icon></a>-->
    </p>

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
}
</script>

<style>

</style>
