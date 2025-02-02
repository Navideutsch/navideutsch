import Vue from 'vue'
import App from './App.vue'
//引入elm组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入store
import store from './store'
//引入VueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from './router'
//引入axios
import axios from 'axios'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

Vue.use(ElementUI);
// 防止连续跳转同一路由时的错误
let push = VueRouter.prototype.push;
let replace = VueRouter.prototype.replace;
VueRouter.prototype.push = function (location) {
  push.call(this, location, () => { }, () => { });
}
VueRouter.prototype.replace = function (location) {
  replace.apply(this, [location, () => { }, () => { }]);
}
Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  store,
  router,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')