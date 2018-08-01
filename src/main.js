import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import axios from 'axios'
//my message 引入
import Message from './components/Message/Message.export.js'
import { router } from './router'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueRouter)

//my message 全局注册
Vue.prototype.$MyMessage = Message

Vue.prototype.$ajax = axios

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
