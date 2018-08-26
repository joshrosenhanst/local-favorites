import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import * as VueGoogleMaps from 'vue2-google-maps'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt, faMapMarkedAlt, faStar, faBan, faCommentAlt, faCheck, faStickyNote, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './registerServiceWorker'
import 'buefy/lib/buefy.css'

Vue.use(Buefy, {
  defaultIconPack: 'fas'
})
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_MAP_API,
    libraries: 'places'
  }
})
library.add(faExternalLinkAlt, faMapMarkedAlt, faStar, faBan, faCommentAlt, faCheck, faStickyNote, faSearch)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
