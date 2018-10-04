<template>
  <span class="star-rating"
    v-bind:title="stars?(`Rated ${stars} stars`):null"
  >
    <template v-if="readonly">
      <span class="star-rating-icon star" v-if="readonly"
        v-for="n in 5"
        v-bind:key="'star_'+n"
        v-bind:class="[stars >= n ? 'full' : 'empty', 'readonly']"
      >
        <font-awesome-icon v-bind:icon="[ (stars >= n) ? 'fas':'far','star' ]" class="star-icon"></font-awesome-icon>
      </span>
    </template>
    <template v-else>
      <button class="star-rating-icon star control-button" type="button"
        v-for="k in 5"
        v-bind:key="'star_'+k"
        v-bind:class="[stars >= k ? 'full' : 'empty', (currentHover >= k) ? 'is-hovered':'', 'is-editable']"
        v-on:click="setStars(k)"
        v-on:keydown.enter.self.prevent="setStars(k)"
        v-on:keyup.space.self.prevent="setStars(k)"
        v-on:mouseenter="currentHover = k"
        v-on:mouseleave="currentHover = 0"
        v-on:focus="currentHover = k"
        v-on:blur="currentHover = 0"
        v-bind:title="`Rate ${k} stars`"
      >
        <font-awesome-icon v-bind:icon="[ (stars >= k||currentHover >= k) ? 'fas':'far','star' ]" class="star-icon"></font-awesome-icon>
      </button>
      <button class="star-rating-icon ban-icon control-button" title="Remove Star Rating" type="button"
        v-if="stars"
        v-on:click="setStars(0)"
        v-on:keydown.enter.self.prevent="setStars(0)"
        v-on:keyup.space.self.prevent="setStars(0)"
      >
        <font-awesome-icon icon="ban"></font-awesome-icon>
      </button>
    </template>
  </span>
</template>

<script>
export default {
  name: 'StarRating',
  props: {
    stars: Number,
    readonly: Boolean
  },
  data: function () {
    return {
      currentHover: 0
    }
  },
  methods: {
    setStars: function (value) {
      if (!this.readonly) {
        this.$emit('set-stars', { value: value })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .star{
    font-size:1rem;
    &.empty>.star-icon {
      color:$grey-light;
    }
    &.full>.star-icon {
      color:$primary;
    }
    &.is-hovered>.star-icon {
      color:$link;
    }
  }
  .star-rating-icon{
    display:inline-block;
    margin-right:5px;
    &:hover,&.is-hovered,&:focus,&.is-focused{
      color:$red;
    }
    &.is-editable{
      font-size:1.3rem;
      //cursor: pointer;
    }
  }
  .control-button{
    background-color:transparent;
    border:0;
    padding:0;
    cursor: pointer;
    &:focus,&.is-focused{
      outline:1px solid $focus-outline-color;
      outline-offset:-1px;
    }
  }
  .ban-icon{
    font-size:1.2rem;
    margin-left:5px;
    vertical-align: 0;
  }

  .result-display.selected .result-info-header{
    .star{
      &.empty>.star-icon {
        color:$grey-lighter;
      }
      &.full>.star-icon {
        color:white;
      }
    }
  }
</style>
