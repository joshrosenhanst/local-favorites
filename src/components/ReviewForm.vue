<template>
<section class="review-form">
    <button class="button" v-on:click="isOpen = !isOpen" v-bind:class="[ isOpen ? 'is-active' : '' ]">
        <span class="icon is-small"><font-awesome-icon icon="comment-alt"></font-awesome-icon></span>
        <slot name="buttonText"></slot>
    </button>
    <b-collapse v-bind:open.sync="isOpen">
        <div class="box review-box">
            <h4 class="title is-6">Rate and review this location</h4>
            <h5 class="subtitle">Your star ratings and reviews are only visible to you.</h5>
            <b-field>
                <StarRating
                    v-bind:stars="reviewStars"
                    v-on:set-stars="reviewStars = $event.value"
                ></StarRating>
            </b-field>
            <b-field message="">
                <b-input type="textarea" placeholder="Leave a review..." 
                    v-model="reviewNotes"
                ></b-input>
            </b-field>
            <b-field grouped position="is-centered">
                <div class="control">
                <button class="button is-success"
                    v-on:click="submitReview"
                >
                    <span class="icon"><font-awesome-icon icon="check"></font-awesome-icon></span>
                    <span>Save Review</span>
                </button>
                </div>
                <div class="control">
                <button class="button is-danger"
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
    name: 'ReviewForm',
    props: {
        result: Object
    },
    components: {
        StarRating
    },
    data: function () {
        return {
            isOpen: false,
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
            this.$emit('submit-review', { stars: this.reviewStars, notes: this.reviewNotes });
            this.isOpen = false;
        },
        cancelReview: function () {
            this.reviewStars = 0;
            this.reviewNotes = null;
            this.isOpen = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.review-box{
  text-align:center;
  margin:0 auto;
  .title{
    font-size:1rem;
  }
  .subtitle{
    font-size:0.9rem;
    margin-bottom:10px;
  }
}
</style>
