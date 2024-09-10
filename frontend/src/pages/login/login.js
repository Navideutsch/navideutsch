import Vue from 'vue'
import login from './login.vue'
//引入elm组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入VueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from '@/router'
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueRouter)

new Vue({
  render: h => h(login),
  router,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#login')