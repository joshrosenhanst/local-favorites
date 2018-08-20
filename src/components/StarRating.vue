<template>
    <div class="star-rating">
        <!--<span class="star" v-bind:class="[currentStars > 0 ? 'full' : 'empty']" v-on:click="setStars(1)"></span>
        <span class="star" v-bind:class="[currentStars > 1 ? 'full' : 'empty']" v-on:click="setStars(2)"></span>
        <span class="star" v-bind:class="[currentStars > 2 ? 'full' : 'empty']" v-on:click="setStars(3)"></span>
        <span class="star" v-bind:class="[currentStars > 3 ? 'full' : 'empty']" v-on:click="setStars(4)"></span>
        <span class="star" v-bind:class="[currentStars > 4 ? 'full' : 'empty']" v-on:click="setStars(5)"></span>-->
        <StarFullIcon class="star empty"></StarFullIcon>
    </div>
</template>

<script>
import StarEmptyIcon from '../assets/star-empty.svg'
import StarFullIcon from '../assets/star-full.svg'
export default {
    name: 'StarRating',
    props: {
        stars: Number
    },
    components: {
        StarEmptyIcon,
        StarFullIcon
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
        display:inline-block;
        &.empty {
            color:grey;
            fill:grey;
            //background-image:url(../assets/star-empty.svg);
        }
        &.full {
            color:blue;
            fill:blue;
            //background-image:url(../assets/star-full.svg);
        }
        &:hover {
            color:green;
            //background-color:green;
            fill:green;
        }
    }
</style>

