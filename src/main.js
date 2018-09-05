import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import * as VueGoogleMaps from 'vue2-google-maps'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt, faMapMarkedAlt, faStar, faBan, faCommentAlt, faCheck, faStickyNote, faSearch, faBookmark, faEdit, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { faBookmark as farBookmark, faStar as farStar, faStickyNote as farStickyNote, faEdit as farEdit } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './registerServiceWorker'
import './scss/app.scss'
// import 'buefy/lib/buefy.css'

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_MAP_API,
    libraries: 'places'
  }
})
library.add(faExternalLinkAlt, faMapMarkedAlt, faStar, faBan, faCommentAlt, faCheck, faStickyNote, faSearch, faBookmark, farBookmark, farStar, farStickyNote, faEdit, farEdit, faMapMarkerAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
