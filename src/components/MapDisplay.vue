<template>
    <div id="map-display">
        <gmap-map
          :center="{lat:40.415932, lng:-74.257530}"
          :zoom="15"
          id="google-map"
        >
        </gmap-map>
    </div>
</template>

<script>
export default {
    name: 'MapDisplay',
    components: { 
    },
    props: {
      type: String,
      location: String
    },
    data: function () {
      return {

      }
    }
}
</script>

<style lang="scss" scoped>
#map-display {
  text-align:center;
}
#leaflet-map {
  height:500px;
  width:100%;
}
#google-map {
  height:500px;
  width:100%;
}
</style>

