import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt, faMapMarkedAlt, faStar, faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './registerServiceWorker'
import 'buefy/lib/buefy.css'

Vue.use(Buefy)
library.add(faExternalLinkAlt, faMapMarkedAlt, faStar, faBan)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
