<template>
    <div class="star-rating">
        <span class="star-rating-icon star"
            v-for="n in 5"
            v-bind:key="'star_'+n"
            v-bind:class="[currentStars >= n ? 'full' : 'empty', currentHover >= n ? 'is-hovered':'']"
            v-on:click="setStars(n)"
            v-on:mouseenter="currentHover = n"
            v-on:mouseleave="currentHover = 0"
            v-bind:title="'Rate '+n+' stars'"
        >
            <font-awesome-icon icon="star" class="star-icon"></font-awesome-icon>
        </span>
        <span class="star-rating-icon ban-icon" title="Remove Star Rating"
            v-if="currentStars"
            v-on:click="setStars(0)"
        >
            <font-awesome-icon icon="ban"></font-awesome-icon>
        </span>
    </div>
</template>

<script>
export default {
    name: 'StarRating',
    props: {
        stars: Number
    },
    data: function () {
        return {
            currentStars: 0,
            currentHover: 0
        }
    },
    created: function () {
        this.currentStars = this.stars;
    },
    methods: {
        setStars: function (value) {
            this.currentStars = value;
            this.$emit('set-stars', { value: this.currentStars });
        }
    }
}
</script>


<style lang="scss" scoped>
    .star{
        &.empty>.star-icon {
            color:grey;
        }
        &.full>.star-icon {
            color:blue;
        }
        &.is-hovered>.star-icon {
            color:green;
        }
    }
    .star-rating-icon{
        cursor: pointer;
        display:inline-block;
        margin-right:5px;
        &:hover{
            color:red;
        }
    }
    .ban-icon{
        margin-left:5px;
        vertical-align: -1px;
    }
</style>

