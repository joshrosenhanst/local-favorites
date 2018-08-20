<template>
    <div class="star-rating">
        <span class="star" v-bind:class="[currentStars > 0 ? 'full' : 'empty']" v-on:click="setStars(1)">X</span>
        <span class="star" v-bind:class="[currentStars > 1 ? 'full' : 'empty']" v-on:click="setStars(2)">X</span>
        <span class="star" v-bind:class="[currentStars > 2 ? 'full' : 'empty']" v-on:click="setStars(3)">X</span>
        <span class="star" v-bind:class="[currentStars > 3 ? 'full' : 'empty']" v-on:click="setStars(4)">X</span>
        <span class="star" v-bind:class="[currentStars > 4 ? 'full' : 'empty']" v-on:click="setStars(5)">X</span>
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
            currentStars: 0
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
    .star {
        cursor: pointer;
        font-weight:bold;
        &.empty {
            color:grey;
        }
        &.full {
            color:blue;
        }
        &:hover {
            color:green;
        }
    }
</style>

