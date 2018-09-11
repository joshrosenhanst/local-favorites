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
        v-bind:options="{ pixelOffset: { width: 0, height: -35 }, maxWidth:400 }"
        v-if="selectedPlace && selectedPlace.geometry"
        v-bind:position="selectedPlace.geometry.location"
        v-bind:opened="infoWindow.open"
        v-on:closeclick="infoWindow.open = false"
      >
        <span class="infowindow-saved is-saved"
          v-if="selectedPlace.saved"
        ><font-awesome-icon v-bind:icon="['fas','bookmark']"></font-awesome-icon></span>
        <star-rating
          v-if="selectedPlace.stars"
          v-bind:stars="selectedPlace.stars"
          v-bind:readonly="true"
        ></star-rating>
        <h3 class="infowindow-name">{{ selectedPlace.name }}</h3>
        <div class="infowindow-address">
          <span class="infowindow-address-text">{{ selectedPlace.vicinity || selectedPlace.formatted_address }}</span>
        </div>
        <p class="infowindow-notes" v-if="selectedPlace.notes">{{ selectedPlace.notes }}</p>
        <div class="infowindow-external-link">
          <a class="infowindow-external-link-icon" v-bind:href="mapLinkURL" title="Open in Google Maps" target="_blank" rel="noopener noreferrer" ><font-awesome-icon icon="map-marked-alt"></font-awesome-icon> Open in Google Maps</a>
        </div>
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
        zoom: 17,
        markers: [],
        marker: {},
        places: [],
        currentPlace: null,
        keepSelected: false,
        mapOptions: {
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false
        },
        markerOptions: {
          animation: 2,
          size: {
            width:25,
            height:25
          },
          scale: {
            width:25,
            height:25
          }
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
          if(event.placeId){
            event.stop();
            this.getPlaceDetails(event.placeId);
          }
        });
      },
      initAutoComplete: function () {
        let autocomplete_input = document.getElementById('gmap-autocomplete');
        if(autocomplete_input){
          let autocomplete = new google.maps.places.Autocomplete(autocomplete_input);

          autocomplete.addListener('place_changed', () => {
            let place = autocomplete.getPlace();
            if(place.geometry){
              if(place.types.includes('point_of_interest')){
                this.getReviewThenEmitPlace(place);
                this.keepSelected = true;
              }
              this.mapObject.panTo(place.geometry.location);
              this.mapObject.setZoom(17);
            }else{
              autocomplete_input.placeholder = 'Find places near...';
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
      getReviewThenEmitPlace: function (place){
        let updatedPlaceOb = this.getReviewForPlace(place);
        this.$emit('click-map-point',updatedPlaceOb);
        this.setInfoWindowVisibility(true);
      },
      getPlaceDetails: function (place_id) {
        if(this.gPlacesService){
          this.gPlacesService.getDetails({placeId: place_id}, (place,status) => {
            if(status === google.maps.places.PlacesServiceStatus.OK) {
              this.getReviewThenEmitPlace(place);
            }
          });
        }
      },
      getReviewForPlace: function (place) {
        let matchedReviewIndex = _.findIndex(this.reviews, { place_id:place.place_id });
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
        // check if the selectedPlace is inside the bounds of the map after the move/zoom.
        // if it is, keep it as the selectedPlace when we update the resultsList
        if(this.selectedPlace && this.selectedPlace.geometry){
          if(mapBounds.contains(this.selectedPlace.geometry.location)){
            this.keepSelected = true;
          }
        }
        this.getLocalPlaces(newCenter);
        this.$emit('map-bounds-changed', { bounds: mapBounds })
      },
      getLocalPlaces: function (center) {
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
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.$emit('get-local-places', { results: results, keepSelected: this.keepSelected });
          this.keepSelected = false;
        }
        if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          this.$emit('get-local-places', { results: null, keepSelected: this.keepSelected });
          this.keepSelected = false;
        }
      },
      addLocalPlacesMarkers: function (results,status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
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
      },
      getLatLangURL: function (locObject) {
        let lng = (typeof locObject.lng === 'function'?locObject.lng():locObject.lng);
        let lat = (typeof locObject.lat === 'function'?locObject.lat():locObject.lat);
        return lat.toFixed(6)+","+lng.toFixed(6);
      }
    },
    computed: {
      mapLinkURL: function () {
        let query = this.selectedPlace.geometry?this.getLatLangURL(this.selectedPlace.geometry.location):this.selectedPlace.name;
        return process.env.VUE_APP_MAP_SEARCH_URL + encodeURI("query=" + query + "&query_place_id=" + this.selectedPlace.place_id);
      }
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
  .infowindow-external-link{
    font-size:0.8rem;
    font-weight:400;
  }
  .infowindow-notes{
    font-style:italic;
    font-weight:400;
    font-size:0.85rem;
    border-left:2px solid $turquoise;
    color:$turquoise-dark;
    padding-left:5px;
    margin:5px 0;
  }
  .infowindow-saved{
    float:right;
    &.is-saved{
      color:$orange;
    }
  }
</style>


