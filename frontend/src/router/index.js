// 该文件专门用于创建整个应用的路由器
import VueRouter from 'vue-router'
import Article from '@/views/Articles'
import User from '@/views/User.vue'
import ReadTab from '@/components/ReadTab.vue'
import Exercises from '@/views/Exercises.vue'
import Collect from '@/views/Collect.vue'
//创建并暴露一个路由器
export default new VueRouter({
  mode:'hash',
  routes: [
    {
      name: 'user',
      path: '/user',
      component: User
    },
    {
      name: 'collect',
      path: '/collect',
      component: Collect,
    },
    {
      name: 'readTab',
      path: '/readTab',
      component: ReadTab,
      children: [
        {
          name: 'exercises',
          path: 'exercises',
          component: Exercises
        },
        {
          name: 'article',
          path: 'article/:articleId',
          component: Article
        }
      ]
    },
  ],
})

//全局前置路由守卫————初始化的时候被调用、每次路由切换之前被调用
//一般用于鉴权
// router.beforeEach((to, from, next) => {
  
// })

//全局后置路由守卫————初始化的时候被调用、每次路由切换之后被调用
//一般用于跳转后修改页面标题
// router.afterEach((to, from) => {

// })