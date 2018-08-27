<template>
  <section id="google-map-container">
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
  </section>
</template>

<script>

export default {
    name: 'GoogleMap',
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
      this.$gmapApiPromiseLazy().then(() => {
        this.geolocate();
        //this.initSearchbox();
        this.initAutoComplete();
      })
    },
    methods: {
      initSearchbox: function () {
        let searchbox_input = document.getElementById('gmap-search-box');
        if(searchbox_input){
          console.log("init searchbox");
          let searchBox = new google.maps.places.SearchBox(searchbox_input);
          let mapObject = this.$refs.mapRef.$mapObject;

          mapObject.addListener('bounds_changed', () => {
            console.log("bounds changed");
            searchBox.setBounds(mapObject.getBounds());
          });

          searchBox.addListener('places_changed', () => {
            console.log("searchbox places_changed");
            let places = searchBox.getPlaces();
            console.log(places);
            if (places.length == 0) {
              return;
            }

            this.$emit('get-local-places', { results: places });
            let bounds = new google.maps.LatLngBounds();
            places.forEach(place => {
              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            mapObject.fitBounds(bounds);

          });
        }
      },
      initAutoComplete: function () {
        let autocomplete_input = document.getElementById('gmap-autocomplete');
        console.log(autocomplete_input);
        if(autocomplete_input){
          console.log("init autocomplete");
          let mapObject = this.$refs.mapRef.$mapObject;
          let autocomplete = new google.maps.places.Autocomplete(autocomplete_input, {
            types: ['(cities)']
          });

          autocomplete.addListener('place_changed', () => {
            let place = autocomplete.getPlace();
            if(place.geometry){
              mapObject.panTo(place.geometry.location);
              mapObject.setZoom(15);
            }else{
              autocomplete_input.placeholder = 'Enter a city...';
            }
          })
        }
      },
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
        this.$emit('map-bounds-changed', { bounds: this.$refs.mapRef.$mapObject.getBounds() })
      },
      getLocalPlaces: function (center) {
        console.log("get local")
        this.$emit('start-nearby-search');
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
        console.log(status);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(results);
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


