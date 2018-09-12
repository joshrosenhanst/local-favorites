<template>
    <header id="app-header">
      <section class="hero">
        <div class="hero-body">
          <div class="container">
            <h1 class="title"><font-awesome-icon class="title-icon" v-bind:icon="['fas','map-marker-alt']"></font-awesome-icon>Local Favorites</h1>
            <h2 class="subtitle">Save and review your favorite local places, so you can <span id="random-predicate" v-on:click="updateRandomPredicate">{{ random_predicate }}</span></h2>
          </div>
        </div>
      </section>
    </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data: function () {
    return {
      predicates: [
        'find the good pizza place.', 'remember which sub shop uses too much mayo.', 'stop at the good barber shop for your haircut.', 'find the really spicy thai restaurant again.', 'get to that cheap burger place.', 'remember which theater has the comfy seats.', 'remember the name of that one BBQ place (something about happy pigs...)', 'find that dive bar that had the PokeStop outside it.'
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
#app-header {
  //@media (min-width: 769px) {
    text-align:center;
  //}
}
#random-predicate {
  background-color:#f5f5f5;
  padding:.25em .5em .25em;
  font-size:0.875em;
  font-weight:500;
  color:$primary;
  -webkit-touch-callout: none;
  user-select: none;
}
h1.title{
  font-size:1.5rem;
  color:$primary;
  font-weight:300;
  margin-bottom:0;
  @media (min-width: 426px) and (max-width:769px) {
    font-size:2rem;
    margin-bottom:1.5rem;
  }
  @media (min-width: 769px) {
    font-size:2.5rem;
    margin-bottom:1.5rem;
  }
  .title-icon{
    margin-right:5px;
  }
}
h2.subtitle{
  font-size:1rem;
  display:none;
  margin-top:0;
  @media (min-width: 426px) and (max-width:769px) {
    display:block;
  }
  @media (min-width: 769px) {
    font-size:1.25rem;
    display:block;
  }
}
.hero-body{
  padding:15px;
  @media (min-width: 769px) {
    padding:1.5rem;
  }
}
</style>
