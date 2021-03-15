// 引入 express 包
let express = require('express')
//  引入 mongoose 包
let mongoose = require('mongoose')
// 引入 MD5 加密包
let md5 = require('blueimp-md5') // 加载 blueimp-md5 模块(用于密码加密)
// 引入 jsonwebtoken 包
let jwt = require('jsonwebtoken') // 用于登陆检测

// 连接 MongoDB 数据库
mongoose.connect('mongodb://localhost:27018/mallmanager')
let User = require('../models/user')

// 创建路由容器
let router = express.Router()

router.all('*', function (req, res, next) {
  // 设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*')
  // 允许的header类型
  res.header('Access-Control-Allow-Headers', 'content-type, Authorization')
  // 跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  next()
})

// 处理登录请求
router.post('/login', (request, response) => {
  let username = request.body.username
  let password = md5(md5(request.body.password + 'qwe123ABC') + 'p0o9@123.c%')
  User.findOne({
    username
  })
    .then(data => {
      if (data) {
        return User.findOne({
          username,
          password
        })
      } else {
        response.json({
          status: 200,
          code: 101,
          message: '该用户未注册！'
        })
        throw new Error('该用户未注册！')
      }
    })
    .then(data => {
      if (data) {
        let token = { username, password }
        token = jwt.sign(token, 'z.2021@sheng_1998', { expiresIn: 86400 })
        response.json({
          status: 200,
          code: 200,
          token: token,
          message: '登陆成功！'
        })
      } else {
        response.json({
          status: 200,
          code: 102,
          message: '密码错误！'
        })
      }
    })
    .catch(err => {
      if (err) {
        response.json({
          status: 500,
          message: 'Server Error!'
        })
      }
    })
})

// 处理注册请求
router.post('/register', (request, response) => {
  let data = request.body
  let password = md5(md5(data.password + 'qwe123ABC') + 'p0o9@123.c%')
  User.findOne({
    username: data.username
  }).then(res => {
    if (res) {
      response.json({
        status: 200,
        code: 202,
        message: '用户名已经被注册！'
      })
      throw new Error('用户名已经被注册！')
    } else {
      let user = new User({
        username: data.username,
        password: password,
        telephone: data.telephone,
        email: data.email
      })
      user.save().then(
        () => {
          console.log('保存成功！')
          response.json({
            status: 200,
            code: 200,
            message: '注册成功！'
          })
        },
        err => {
          console.log(err.errors)
          response.json({
            status: 200,
            code: 201,
            message: '注册失败！'
          })
        }
      )
    }
  })
})

// 获取用户列表
router.get('/users', (req, response) => {
  let token = req.headers.authorization
  let { query, pagenum, pagesize } = req.query

  jwt.verify(token, 'z.2021@sheng_1998', (err, decoded) => {
    if (err) {
      console.log(err)
      response.json({
        status: 200,
        code: 301,
        message: '获取用户列表失败，token已经过期或者未提供正确的token！'
      })
    } else if (decoded) {
      const reg = new RegExp(query, 'i')
      User.count({ $or: [{ username: { $regex: reg } }] }).then(num => {
        User.find({
          $or: [{ username: { $regex: reg } }]
        })
          .skip(parseInt((pagenum - 1) * pagesize))
          .limit(parseInt(pagesize))
          .sort({'created_time': -1})
          .exec()
          .then(data => {
            if (data) {
              let list = []
              data.forEach(item => {
                list.push({
                  created_time: item.created_time,
                  email: item.email,
                  limit: item.limit,
                  telephone: item.telephone,
                  username: item.username,
                  role_name: item.role_name,
                  id: item._id
                })
              })
              response.json({
                status: 200,
                code: 200,
                message: '获取用户列表成功！',
                data: list,
                total: num
              })
            }
          })
      })
    }
  })
})

// 导出路由模块
module.exports = router
