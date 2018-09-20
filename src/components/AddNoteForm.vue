<template>
<section class="add-note-form">
  <div class="collapse">
    <transition name="slide-down">
      <div class="collapse-content" v-show="isOpen">
        <form v-on:submit.prevent="submitReview" class="note-box">
          <h4 class="title">Add a Note and a Star Rating for this location</h4>
          <h5 class="subtitle">Your star ratings and notes are only visible to you.</h5>
            <StarRating
              v-bind:stars="formStars"
              v-on:set-stars="setStars"
            ></StarRating>
          <div class="field">
            <textarea class="textarea is-small" placeholder="Add a note..." v-model="formNotes"></textarea>
          </div>
          <div class="field is-grouped-centered is-grouped">
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
          </div>
        </form>
      </div>
    </transition>
  </div>
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
  color:#4a4a4a;
  background-color: #ffffff;
  text-align:center;
  margin:0 auto 5px auto;
  padding:10px;
  border-top:1px solid $border;
  .title{
    font-size:0.9rem;
    color:$primary;
    font-weight:500;
    line-height:1.125;
  }
  .subtitle{
    font-size:0.8rem;
    margin-bottom:5px;
  }
  .textarea{
  }
  .button:focus,.button.is-focused{
    outline:1px solid $focus-outline-color;
    outline-offset:1px;
  }
}
</style>
