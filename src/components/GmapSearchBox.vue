<template>
  <input type="text" :value="value" :placeholder="placeholder" ref="gsearchbox" />
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
      searchBox.addListener('places_changed', function () {
        let places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }

        console.log(places);
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

