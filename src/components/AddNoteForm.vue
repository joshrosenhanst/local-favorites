<template>
<section class="add-note-form">
  <b-collapse v-bind:open="isOpen">
    <form v-on:submit.prevent="submitReview" class="box note-box">
      <h4 class="title">Add a Note and a Star Rating for this location</h4>
      <h5 class="subtitle">Your star ratings and notes are only visible to you.</h5>
        <StarRating
          v-bind:stars="formStars"
          v-on:set-stars="setStars"
        ></StarRating>
      <b-field message="">
        <b-input type="textarea" placeholder="Add a note..." size="is-small"
          v-model="formNotes"
        ></b-input>
      </b-field>
      <b-field grouped position="is-centered">
        <div class="control">
          <button class="button is-success is-small" type="submit">
            <span class="icon"><font-awesome-icon icon="check"></font-awesome-icon></span>
            <span>Save Note</span>
          </button>
        </div>
        <div class="control">
          <button class="button is-danger is-small" type="button"
            v-on:click.prevent="cancelReview"
          >
            <span class="icon"><font-awesome-icon icon="ban"></font-awesome-icon></span>
            <span>Cancel</span>
          </button>
        </div>
      </b-field>
    </form>
  </b-collapse>
</section>
</template>

<script>
import StarRating from './StarRating.vue'
export default {
  name: 'AddNoteForm',
  props: {
    stars: Number,
    notes: String,
    saved: Boolean,
    isOpen: Boolean
  },
  components: {
    StarRating
  },
  data: function () {
    return {
      formStars: this.stars,
      formNotes: this.notes
    }
  },
  methods: {
    submitReview: function () {
      this.$emit('submit-note', { stars: this.formStars, notes: this.formNotes, saved: this.saved });
    },
    cancelReview: function () {
      this.formStars = this.stars || 0;
      this.formNotes = this.notes || null;
      this.$emit('close-note-form');
    },
    setStars: function (event) {
      this.formStars = event.value;
    }
  },
  watch: {
    stars: function () {
      this.formStars = this.stars;
    },
    notes: function () {
      this.formNotes = this.notes;
    }
  }
}
</script>

<style lang="scss" scoped>
.note-box{
  text-align:center;
  margin:0 auto 5px auto;
  border-radius:0;
  padding:10px;
  .title{
    font-size:0.9rem;
    color:$primary;
    font-weight:500;
  }
  .subtitle{
    font-size:0.8rem;
    margin-bottom:5px;
  }
  .textarea{
  }
}
</style>
