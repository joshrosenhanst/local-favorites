<template>
  <div class="field">
    <div class="control has-icons-left">
      <input type="text" class="input" :value="value" placeholder="Search locations by name, address, or type..." ref="gsearchbox" />
      <span class="icon is-small is-left">
        <font-awesome-icon icon="search"></font-awesome-icon>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GmapSearchBox',
  props: {
    value: String,
    placeholder: String
  },
  mounted: function () {
    // utilizes vue2-google-maps $gmapApiPromiseLazy functionality to only access the api once it is fully loaded. Otherwise new google.maps.places will throw an error
    this.$gmapApiPromiseLazy().then(() => {
      this.initSearchbox();
    })
  },
  methods: {
    initSearchbox: function () {
      let searchBox = new google.maps.places.SearchBox(this.$refs.gsearchbox);
      console.log("searchbox places_changed");
      searchBox.addListener('places_changed', function () {
        let places = searchBox.getPlaces();
        console.log(places);
        if (places.length == 0) {
          return;
        }

      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

