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
        v-if="selectedPlace && selectedPlace.geometry"
        v-bind:position="selectedPlace.geometry.location"
        v-bind:opened="infoWindow.open"
        v-on:closeclick="infoWindow.open = false"
      >
        <span class="infowindow-saved"
          v-bind:class="[ selectedPlace.saved?'is-saved':'' ]"
        ><font-awesome-icon icon="bookmark"></font-awesome-icon></span>
        <star-rating
          v-if="selectedPlace.stars"
          v-bind:stars="selectedPlace.stars"
          v-bind:readonly="true"
        ></star-rating>
        <h3 class="infowindow-name">{{ selectedPlace.name }}</h3>
        <div class="infowindow-address">{{ selectedPlace.vicinity || selectedPlace.formatted_address }}</div>
        <p class="infowindow-notes" v-if="selectedPlace.notes">{{ selectedPlace.notes }}</p>
        <template v-if="!(selectedPlace.stars || selectedPlace.notes)">
          <a href="">Add a Note</a>
        </template>
      </gmap-info-window>
      <gmap-marker
        v-if="selectedPlace && selectedPlace.geometry"
        v-bind:position="selectedPlace.geometry.location"
        v-on:click="infoWindow.open = true"
      ></gmap-marker>
    </gmap-map>
  </section>
</template>

<script>
import StarRating from './StarRating.vue'
import GmapCitySearch from './GmapCitySearch.vue'

export default {
    name: 'GoogleMap',
    props: {
      selectedPlace: Object,
      reviews: Array
    },
    components: {
      StarRating,
      GmapCitySearch
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
          open: true
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
    },
    methods: {
      initMapObject: function () {
        this.mapObject = this.$refs.mapRef.$mapObject;
        this.gPlacesService = new google.maps.places.PlacesService(this.mapObject);

        let mapControlSearch = document.getElementById("city-search-container");
        this.mapObject.controls[google.maps.ControlPosition.TOP_RIGHT].push(mapControlSearch);
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
        this.infoWindow.open = !this.infoWindow.open;
      },
      setInfoWindowVisibility: function (open) {
        this.infoWindow.open = open;
      },
      getPlaceDetails: function (place_id) {
        if(this.gPlacesService){
          this.gPlacesService.getDetails({placeId: place_id}, (place,status) => {
            if(status === google.maps.places.PlacesServiceStatus.OK) {
              let updatedPlaceOb = this.getReviewForPlace(place);
              this.$emit('click-map-point',updatedPlaceOb);
              this.setInfoWindowVisibility(true);
            }
          });
        }
      },
      getReviewForPlace: function (place) {
        let matchedReviewIndex = _.findIndex(this.reviews, { place_id:place.place_id });
        console.log(place.place_id);
        if (matchedReviewIndex >= 0) {
          // if it exists, combine add the review to the saved place
          place = Object.assign({}, place, {
            stars: this.reviews[matchedReviewIndex].stars,
            notes: this.reviews[matchedReviewIndex].notes,
          });
        }
        return place;
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
        let mapBounds = this.mapObject.getBounds();
        if(this.selectedPlace && this.selectedPlace.geometry && mapBounds.contains(this.selectedPlace.geometry.location)){
          console.log("inside bounds")
        }else{
          console.log("outside bounds")
          this.getLocalPlaces(newCenter);
        }
        this.$emit('map-bounds-changed', { bounds: mapBounds })
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
  #google-map-container {
    flex-grow:1;
  }
  #map-search-field{
    width:500px;
    margin:0 auto;
  }
  #google-map{
    width:100%;
    height:100%;
    @media (max-width: 769px) {
      height:250px;
    }
  }
  .infowindow-name{
    font-size:1rem;
    font-weight:500;
    color:#4a4a4a;
    line-height:1.25;
  }
  .infowindow-address{
    font-size:0.8rem;
    font-weight:400;
  }
  .infowindow-notes{
    font-style:italic;
    font-weight:400;
  }
  .infowindow-saved{
    float:right;
    &.is-saved{
      color:yellow;
    }
  }
</style>


