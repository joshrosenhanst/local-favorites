<template>
    <div id="map-display">
        <h3>Simple map</h3>
Marker is placed at {{ marker.lat }}, {{ marker.lng }}
        <l-map id="leaflet-map" :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="marker"></l-marker>
        </l-map>  
    </div>
</template>

<script>
import Vue from 'vue'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
    name: 'MapDisplay',
    components: { 
        LMap, 
        LTileLayer, 
        LMarker 
    },
    props: {
        type: String,
        location: String
    },
    data: function () {
        return {
            zoom:13,
            center: L.latLng(40.415930, -74.257530),
            url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            marker: L.latLng(40.415930, -74.257530),
        }
    }
}
</script>

<style lang="scss" scoped>
.leaflet-fake-icon-image-2x {
  background-image: url(../../node_modules/leaflet/dist/images/marker-icon-2x.png);
}
.leaflet-fake-icon-shadow {
  background-image: url(../../node_modules/leaflet/dist/images/marker-shadow.png);
}
@import "../../node_modules/leaflet/dist/leaflet.css";
#map-display{
    text-align:center;
}
#leaflet-map{
    height:500px;
    width:100%;
}
</style>

