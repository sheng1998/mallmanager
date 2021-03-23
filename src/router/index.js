import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/login/login.vue'
import Home from '../pages/home/home.vue'
import Users from '../pages/users/users.vue'
import Right from '../pages/right/rights.vue'
import Role from '../pages/role/roles.vue'
import Goodslist from '../pages/goods/goodslist.vue'
import GoodsAdd from '../pages/goods/goodsadd.vue'
import GoodsEdit from '../pages/goods/goodsedit.vue'
import CateParams from '../pages/goods/cateparams.vue'
import GoodsCate from '../pages/goods/goodscate.vue'
import Order from '../pages/orders/orders.vue'
import Report from '../pages/reports/reports.vue'

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
          path: '/users',
          component: Users
        }, {
          name: 'rights',
          path: '/rights',
          component: Right
        }, {
          name: 'roles',
          path: '/roles',
          component: Role
        }, {
          name: 'goodslist',
          path: '/goods',
          component: Goodslist
        }, {
          name: 'goodsadd',
          path: '/goodsadd',
          component: GoodsAdd
        }, {
          name: 'goodsedit',
          path: '/goodsedit',
          component: GoodsEdit
        }, {
          name: 'cateparams',
          path: '/params',
          component: CateParams
        }, {
          name: 'goodscate',
          path: '/categories',
          component: GoodsCate
        }, {
          name: 'orders',
          path: '/orders',
          component: Order
        }, {
          name: 'reports',
          path: '/reports',
          component: Report
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
