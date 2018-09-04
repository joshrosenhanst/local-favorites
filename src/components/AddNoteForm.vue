<template>
<section class="add-note-form">
  <b-collapse v-bind:open.sync="isOpen">
    <div class="box note-box">
      <h4 class="title">Add a Note and a Star Rating for this location</h4>
      <h5 class="subtitle">Your star ratings and notes are only visible to you.</h5>
        <StarRating
          v-bind:stars="reviewStars"
          v-on:set-stars="reviewStars = $event.value"
        ></StarRating>
      <b-field message="">
        <b-input type="textarea" placeholder="Add a note..." size="is-small"
          v-model="reviewNotes"
        ></b-input>
      </b-field>
      <b-field grouped position="is-centered">
        <div class="control">
          <button class="button is-success is-small"
            v-on:click="submitReview"
          >
            <span class="icon"><font-awesome-icon icon="check"></font-awesome-icon></span>
            <span>Save Note</span>
          </button>
        </div>
        <div class="control">
          <button class="button is-danger is-small"
            v-on:click="cancelReview"
          >
            <span class="icon"><font-awesome-icon icon="ban"></font-awesome-icon></span>
            <span>Cancel</span>
          </button>
        </div>
      </b-field>
    </div>
  </b-collapse>
</section>
</template>

<script>
import StarRating from './StarRating.vue'
export default {
  name: 'AddNoteForm',
  props: {
    result: Object
  },
  components: {
    StarRating
  },
  data: function () {
    return {
      reviewStars: 0,
      reviewNotes: null
    }
  },
  created: function () {
    this.reviewStars = this.result.stars;
    this.reviewNotes = this.result.notes;
  },
  methods: {
    submitReview: function () {
      this.$emit('submit-note', { stars: this.reviewStars, notes: this.reviewNotes, saved: this.result.saved });
      //this.isOpen = false;
    },
    cancelReview: function () {
      this.reviewStars = this.result.stars || 0;
      this.reviewNotes = this.result.notes || null;
      this.$emit('close-note-form');
      //this.isOpen = false;
    }
  },
  computed: {
    isOpen: function () {
      return this.result.hasOwnProperty('isNoteFormOpen') && this.result.isNoteFormOpen;
    }
  }
}
</script>

<style lang="scss" scoped>
.note-box{
  text-align:center;
  margin:0 auto 5px auto;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding:10px;
  .title{
    font-size:0.9rem;
  }
  .subtitle{
    font-size:0.8rem;
    margin-bottom:5px;
  }
  .textarea{
  }
}
</style>
