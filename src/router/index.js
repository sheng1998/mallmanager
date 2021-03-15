import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/login/login.vue'
import Home from '../pages/home/home.vue'
import Users from '../pages/users/users.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    }, {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: 'users',
          component: Users
        }
      ]
    }
  ]
})
