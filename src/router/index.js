import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/login/login.vue'
import Home from '../pages/home/home.vue'
import Users from '../pages/users/users.vue'
import Right from '../pages/right/rights.vue'
import Role from '../pages/role/roles.vue'

import { Message } from 'element-ui'

Vue.use(Router)

let router = new Router({
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
        }, {
          name: 'rights',
          path: 'rights',
          component: Right
        }, {
          name: 'roles',
          path: 'roles',
          component: Role
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || from.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      Message.warning('用户未登录或登录信息过期，返回登陆页面！')
      router.push({ name: 'login' })
      return
    }
    next()
  }
})

export default router
