import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import './common/common'
import './common/config'
import router from './router'

import './styles/np.css'
import '@/styles/index.scss' // global css
import api from './api'
import comp from './components'

import store from './store'

Vue.use(comp);
Vue.prototype.$api = api;

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');


