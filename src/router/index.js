import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/login/login.vue'
import Register from '../pages/register/register.vue'
import Home from '../pages/home/home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'register',
      path: '/register',
      component: Register
    },
    {
      name: 'home',
      path: '/home',
      component: Home
    }
  ]
})
