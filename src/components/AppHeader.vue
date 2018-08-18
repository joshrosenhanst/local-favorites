<template>
    <header class="app-header">
        <h1>Local Reviews</h1>
        <h2>So you can always remember the good {{ current_type }} {{ current_place }}</h2>
        <input type="text" placeholder="Search by type">
        <input type="text" placeholder="Search by location">
    </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data: function () {
    return {
      food_types: [
        'pizza', 'pasta', 'chinese', 'thai'
      ],
      place_types: [
        'place', 'joint', 'spot'
      ]
    }
  },
  computed: {
    current_type: function () {
      return this.food_types[Math.floor(Math.random() * this.food_types.length)]
    },
    current_place: function () {
      return this.place_types[Math.floor(Math.random() * this.place_types.length)]
    }
  }
}
</script>

<style lang="scss" scoped>
header.app-header {
    text-align:center;
}
</style>
