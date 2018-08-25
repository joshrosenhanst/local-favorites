<template>
  <div id="google-map-container">
    <b-field id="map-search-field">
      <div class="control is-expanded">
        <!--<gmap-autocomplete
          v-on:place_changed="setPlace"
          class="input"
        >
        </gmap-autocomplete>-->
        <gmap-search-box class="input"  placeholder="Searchbox;.."></gmap-search-box>
      </div>
    </b-field>
    <button class="button" v-on:click="idleMapUpdate">Get Local Places</button>
    <hr>
    <gmap-map
      v-bind:center="center"
      v-bind:zoom="zoom"
      v-bind:options="mapOptions"
      v-on:idle="idleMapUpdate"
      ref="mapRef"
      id="google-map"
    >
      <gmap-marker
        v-bind:key="index"
        v-for="(m, index) in markers"
        v-bind:position="m.position"
        v-on:click="center=m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
import GmapSearchBox from './GmapSearchBox.vue'

export default {
    name: 'GoogleMap',
    components: {
      GmapSearchBox
    },
    data: function () {
      return {
        center: {lat:40.415932, lng:-74.25753},
        zoom: 15,
        markers: [],
        places: [],
        currentPlace: null,
        mapOptions: {
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false
        }
      }
    },
    mounted: function () {
      this.geolocate();
    },
    methods: {
      setPlace: function (place) {
        this.currentPlace = place;
      },
      getCenterGeo: function () { 
        if (this.center) {
          return {
            lat: this.center.lat,
            lng: this.center.lng
          };
        }
      },
      addMarker: function () {
        if (this.currentPlace) {
          const marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          };
          this.markers.push({ position:marker });
          this.places.push(this.currentPlace);
          this.center = marker;
          this.currentPlace = null;
        }
      },
      geolocate: function () {
        console.log("geolocate");
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        });
      },
      idleMapUpdate: function () {
        let newCenter = this.$refs.mapRef.$mapObject.getCenter();
        this.getLocalPlaces(newCenter);
      },
      getLocalPlaces: function (center) {
        console.log("get local")
        if(center){
          let service = new google.maps.places.PlacesService(this.$refs.mapRef.$mapObject);
          service.nearbySearch({
            /*location: center,
            radius: 500,*/
            bounds: this.$refs.mapRef.$mapObject.getBounds(),
            type: ['point_of_interest']
          }, this.emitLocalPlaces);
        }
      },
      emitLocalPlaces: function (results,status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.$emit('get-local-places', { results: results });
        }
      },
      addLocalPlacesMarkers: function (results,status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(results);
          this.markers = [];
          for(var i=0;i<results.length;i++){
            this.markers.push({
              position:{
                lat: results[i].geometry.location.lat(),
                lng: results[i].geometry.location.lng()
              }
            });
          }
        }
      },
      logLocalPlaces: function (results,status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(results);
        }
      }
    },
    computed: {
      //google: gmapApi
    }
}
</script>

<style lang="scss" scoped>
  #map-search-field{
    width:500px;
    margin:0 auto;
  }
  #google-map{
    width:100%;
    height:500px;
  }
</style>


