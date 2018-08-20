<template>
    <header class="app-header">
      <section class="hero is-medium">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">Local Reviews</h1>
            <h2 class="subtitle">Your neighborhood, your reviews. So you can <span id="random-predicate" v-on:click="updateRandomPredicate">{{ random_predicate }}</span></h2>
          </div>
        </div>
      </section>
        <input type="text" placeholder="Search by type">
        <input type="text" placeholder="Search by location">
    </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data: function () {
    return {
      predicates: [
        'find the good pizza place.', 'remember which sub show uses too much mayo.', 'stop at the right barber shop.', 'find the really spicy thai restaurant again.', 'get to the cheap burger stop.', 'remember which theater has the comfy seats.', 'remember the name of that one BBQ place (something about happy pigs...)', 'avoid that bar with re-heated hot pockets.', 'find that dive bar that had the PokeStop outside it.'
      ],
      random_predicate: 'find the good pizza place.'
    }
  },
  created: function () {
    this.random_predicate = this.getRandomPredicate();
  },
  methods: {
    updateRandomPredicate: function () {
      let last_predicate = this.random_predicate;
      let new_predicate = this.getRandomPredicate();
      while(last_predicate === new_predicate){
        new_predicate = this.getRandomPredicate();
      }
      this.random_predicate = new_predicate;
    },
    getRandomPredicate: function () {
      return this.predicates[Math.floor(Math.random() * this.predicates.length)];
    }
  }
}
</script>

<style lang="scss" scoped>
header.app-header {
  //text-align:center;
}
#random-predicate {
  background-color:#f5f5f5;
  padding:.25em .5em .25em;
  font-size:0.875em;
}
</style>
