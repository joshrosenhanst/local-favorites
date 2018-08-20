import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import './registerServiceWorker'
import 'buefy/lib/buefy.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
