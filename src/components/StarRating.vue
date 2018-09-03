<template>
    <div class="star-rating">
        <span class="star-rating-icon star"
            v-for="n in 5"
            v-bind:key="'star_'+n"
            v-bind:class="[stars >= n ? 'full' : 'empty', (currentHover >= n && !readonly) ? 'is-hovered':'', readonly ? 'readonly' : 'is-editable']"
            v-on:click="setStars(n)"
            v-on:mouseenter="currentHover = n"
            v-on:mouseleave="currentHover = 0"
            v-bind:title="readonly? (n+' stars'):(`Rate ${n} stars`)"
        >
            <font-awesome-icon v-bind:icon="[((stars >= n)||(currentHover >= n && !readonly))?'fas':'far','star']" class="star-icon"></font-awesome-icon>
        </span>
        <span class="star-rating-icon ban-icon" title="Remove Star Rating"
            v-if="stars && !readonly"
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
            if(!this.readonly){
                this.$emit('set-stars', { value: value });
            }
        }
    }
}
</script>


<style lang="scss" scoped>
    .star{
        font-size:1rem;
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
        display:inline-block;
        margin-right:5px;
        &:hover{
            color:red;
        }
        &.is-editable{
            font-size:1.5rem;
            cursor: pointer;
        }
    }
    .ban-icon{
        margin-left:5px;
        vertical-align: -1px;
    }
</style>

