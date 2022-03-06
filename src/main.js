/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: GaoFei
 * @Date: 2020-02-19 23:22:10
 * @LastEditors: GaoFei
 * @LastEditTime: 2022-02-13 12:13:32
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/styles/reset.css'
import ElementUI from 'element-ui'
import store from './store/index'
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
import { resetRouter } from '@/router/index'
import Throttle  from '@/libs/common.js'
import Blob from './excel/Blob'
import Export2Excel from './excel/Export2Excel.js'
import 'default-passive-events'
//import * as api from './api'
//import './mock/index.js'   //上线要注释掉
Vue.prototype.bus = new Vue()
Vue.use(ElementUI)
Vue.config.productionTip = false

let hasLogin = localStorage.getItem("hasLogin");
if (hasLogin === 'true') {
  resetRouter()
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
Vue.component("Throttle", Throttle)