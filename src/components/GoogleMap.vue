<template>
  <section id="google-map-container">
    <gmap-map
      v-bind:center="center"
      v-bind:zoom="zoom"
      v-bind:options="mapOptions"
      ref="mapRef"
      id="google-map"
    >
      <gmap-info-window
        v-bind:options="{ pixelOffset: { width: 0, height: -35 } }"
        v-bind:position="infoWindow.position"
        v-bind:opened="infoWindow.open"
        v-on:closeclick="infoWindow.open = false"
      >
        <label>Name</label> {{ infoWindow.place.name }}<br>
        <label>Address</label> {{ infoWindow.place.formatted_address }}<br>
        <label>Another label</label>
      </gmap-info-window>
      <gmap-marker
        v-if="marker"
        v-bind:position="marker.position"
        v-on:click="toggleInfoWindow"
      ></gmap-marker>
    </gmap-map>
  </section>
</template>

<script>

export default {
    name: 'GoogleMap',
    props: {
      clickedPlace: String
    },
    data: function () {
      return {
        center: {lat:40.415932, lng:-74.25753},
        zoom: 15,
        markers: [],
        marker: {},
        places: [],
        currentPlace: null,
        mapOptions: {
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false
        },
        infoWindow: {
          place: {},
          position: null,
          open: false
        },
        gPlacesService: null,
        mapObject: null
      }
    },
    mounted: function () {
      this.$gmapApiPromiseLazy().then(() => {
        this.initMapObject();
        this.initInfoWindow();
        this.initAutoComplete();
        this.geolocate();
      })
    },
    watch: {
      clickedPlace: function (place_id) {
        this.$gmapApiPromiseLazy().then(() => {
          //let mapObject = this.$refs.mapRef.$mapObject;
        });
      }
    },
    methods: {
      initMapObject: function () {
        this.mapObject = this.$refs.mapRef.$mapObject;
        this.gPlacesService = new google.maps.places.PlacesService(this.mapObject);

        this.mapObject.addListener('idle', this.idleMapUpdate);
      },
      initInfoWindow: function () {
        this.mapObject.addListener('click', (event) => {
          console.log("click map");
          let place_id = "xyz";
          //let position = {};
          if(event.placeId){
            console.log("icon click");
            event.stop();
            this.getPlaceDetails(event.placeId);
          }
        });
      },
      initAutoComplete: function () {
        let autocomplete_input = document.getElementById('gmap-autocomplete');
        if(autocomplete_input){
          console.log("init autocomplete");
          let autocomplete = new google.maps.places.Autocomplete(autocomplete_input, {
            types: ['(cities)']
          });

          autocomplete.addListener('place_changed', () => {
            let place = autocomplete.getPlace();
            if(place.geometry){
              this.mapObject.panTo(place.geometry.location);
              this.mapObject.setZoom(15);
            }else{
              autocomplete_input.placeholder = 'Enter a city...';
            }
          });
        }
      },
      toggleInfoWindow: function () {
        this.infoWindow.position = this.marker.position;
        this.infoWindow.place = this.marker.place;
        this.infoWindow.open = !this.infoWindow.open;
      },
      setInfoWindowVisibility: function (open) {
        this.infoWindow.position = this.marker.position;
        this.infoWindow.place = this.marker.place;
        this.infoWindow.open = open;
      },
      getPlaceDetails: function (place_id) {
        if(this.gPlacesService){
          this.gPlacesService.getDetails({placeId: place_id}, (place,status) => {
            if(status === google.maps.places.PlacesServiceStatus.OK) {
              this.marker = {
                position: place.geometry.location,
                place: place
              };
              this.setInfoWindowVisibility(true);
              console.log(place);
            }
          });
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
      idleMapUpdate: function (event) {
        let newCenter = this.mapObject.getCenter();
        this.getLocalPlaces(newCenter);
        this.$emit('map-bounds-changed', { bounds: this.mapObject.getBounds() })
      },
      getLocalPlaces: function (center) {
        console.log("get local")
        this.$emit('start-nearby-search');
        if(center){
          let service = new google.maps.places.PlacesService(this.mapObject);
          service.nearbySearch({
            /*location: center,
            radius: 500,*/
            bounds: this.mapObject.getBounds(),
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


