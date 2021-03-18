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
let Role = require('../models/role')
let Right = require('../models/rights')

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
          password,
          limit: true
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
          message: '密码错误或登录权限不足！'
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

// 获取侧边导航栏数据
router.get('/menus', (req, res) => {
  let token = req.headers.authorization

  jwt.verify(token, 'z.2021@sheng_1998', (err, decoded) => {
    if (err) {
      res.json({
        status: 200,
        code: 301,
        message: '获取菜单列表失败，token已经过期或者未提供正确的token！'
      })
    } else if (decoded) {
      let {username, password} = decoded
      User.findOne({username, password})
        .then(data => {
          let rid = data.role_id
          return Role.findOne({rid})
        })
        .then(data => {
          res.json({
            status: 200,
            code: 200,
            data: data.children
          })
        })
        .catch(err => {
          if (err) {
            res.json({
              status: 500,
              code: 500,
              message: '服务器错误！'
            })
          }
        })
    }
  })
})

/* *************************************************** */
/** 用户管理相关 start */

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
      User.count({
        $or: [{ username: { $regex: reg } }],
        isDelete: false
      }).then(num => {
        User.find({
          $or: [{ username: { $regex: reg } }],
          isDelete: false
        })
          .skip(parseInt((pagenum - 1) * pagesize))
          .limit(parseInt(pagesize))
          .sort({ created_time: 1 })
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

// 添加用户
router.post('/add/users', (request, response) => {
  let data = request.body
  let password = md5(md5(data.password + 'qwe123ABC') + 'p0o9@123.c%')
  User.findOne({
    username: data.username
  }).then(res => {
    if (res) {
      response.json({
        status: 200,
        code: 202,
        message: '该用户名已添加！'
      })
      throw new Error('用户名已添加！')
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
            message: '添加用户成功！'
          })
        },
        err => {
          console.log(err.errors)
          response.json({
            status: 200,
            code: 201,
            message: '添加用户失败！'
          })
        }
      )
    }
  })
})

// 删除用户
router.get('/delete/users/:id', (req, res) => {
  User.findByIdAndUpdate(req.query.id, { isDelete: true }).then(
    data => {
      res.json({
        status: 200,
        code: 200,
        message: '删除成功！'
      })
    },
    err => {
      if (err) {
        res.json({
          status: 200,
          code: 400,
          message: '删除失败！'
        })
      }
    }
  )
})

// 修改用户状态
router.get('/alter/users/:id/status', (req, res) => {
  let id = req.params.id
  let { status } = req.query
  User.findByIdAndUpdate(id, { limit: status }).then(
    data => {
      res.json({
        status: 200,
        code: 200,
        message: '用户状态修改成功！'
      })
    },
    err => {
      if (err) {
        res.json({
          status: 200,
          code: 500,
          message: '用户状态修改失败！'
        })
      }
    }
  )
})

// 修改用户数据
router.get('/edit/users/:id', (req, res) => {
  let id = req.params.id
  let { telephone, email } = req.query
  User.findByIdAndUpdate(id, { telephone, email }).then(
    data => {
      res.json({
        status: 200,
        code: 200,
        message: '修改用户信息保存成功！'
      })
    },
    err => {
      if (err) {
        res.json({
          status: 200,
          code: 400,
          message: '修改用户信息保存失败！'
        })
      }
    }
  )
})

// 获取用户信息
router.get('/get/users/:id/message', (req, res) => {
  let id = req.params.id
  User.findById(id).then(
    data => {
      if (data) {
        let usermessage = {}
        usermessage.rid = data.role_id
        usermessage.email = data.email
        usermessage.id = data._id
        usermessage.username = data.username
        usermessage.telephone = data.telephone
        usermessage.role_name = data.role_name
        res.json({
          status: 200,
          code: 200,
          usermessage: usermessage,
          message: '获取用户信息成功！'
        })
      }
    },
    err => {
      if (err) {
        res.json({
          status: 200,
          code: 600,
          message: '获取用户信息失败！'
        })
      }
    }
  )
})

// 修改用户角色
router.get('/alter/users/:uid/role/:rid', (req, res) => {
  let { uid, rid } = req.params
  User.findByIdAndUpdate(uid, { role_id: rid }).then(
    data => {
      res.json({
        status: 200,
        code: 200,
        message: '用户角色修改成功！'
      })
    },
    err => {
      if (err) {
        res.json({
          status: 200,
          code: 500,
          message: '用户角色修改失败！'
        })
      }
    }
  )
})

/** 用户管理相关 end */
/* *************************************************** */

/* #################################################### */
/** 权限管理相关 start */

// 获取角色列表
router.get('/roles', (req, res) => {
  let token = req.headers.authorization

  jwt.verify(token, 'z.2021@sheng_1998', (err, decoded) => {
    if (err) {
      res.json({
        status: 200,
        code: 301,
        message: '获取角色列表失败，token已经过期或者未提供正确的token！'
      })
    } else if (decoded) {
      Role.find({}).then(data => {
        if (data) {
          res.json({
            status: 200,
            code: 200,
            rolelist: data,
            message: '获取角色列表成功！'
          })
        }
      })
    }
  })
})

// 添加角色
router.post('/add/role', (req, res) => {
  let { roleName, roleDesc, children } = req.body.data
  let rightlist = req.body.rightlist
  let list = children.sort((a, b) => a - b)
  let arr = []

  Role.findOne({
    roleName
  })
    .then(
      data => {
        if (data) {
          res.json({
            status: 200,
            code: 100,
            message: '角色名已存在！'
          })
          throw new Error('角色名已存在！')
        } else {
          return Role.find().sort({ rid: -1 })
        }
      },
      err => {
        if (err) {
          res.json({
            status: 500,
            code: 500,
            message: '服务器错误！'
          })
        }
      }
    )
    .then(
      data => {
        if (data) {
          let rid = data[0].rid + 1
          list.forEach(item => {
            rightlist.forEach((item2, index2) => {
              if (item2.id === item) {
                arr.push({
                  id: item2.id,
                  authName: item2.authName,
                  path: item2.path,
                  children: []
                })
              }
              rightlist[index2].children.forEach((item3, index3) => {
                if (item3.id === item) {
                  arr.forEach((item4, index4) => {
                    if (item4.id === Math.floor(item3.id / 10)) {
                      arr[index4].children.push({
                        id: item3.id,
                        authName: item3.authName,
                        path: item3.path,
                        children: []
                      })
                    }
                  })
                }
                rightlist[index2].children[index3].children.forEach(
                  (item5, index5) => {
                    if (item5.id === item) {
                      arr.forEach((item6, index6) => {
                        if (item6.id === Math.floor(item5.id / 100)) {
                          arr[index6].children.forEach((item7, index7) => {
                            if (item7.id === Math.floor(item5.id / 10)) {
                              arr[index6].children[index7].children.push({
                                id: item5.id,
                                authName: item5.authName,
                                path: item5.path,
                                children: []
                              })
                            }
                          })
                        }
                      })
                    }
                  }
                )
              })
            })
          })
          let role = new Role({ rid, roleName, roleDesc, children: arr })
          role.save().then(data => {
            res.json({
              status: 200,
              code: 200,
              message: '添加角色成功！'
            })
          })
        }
      },
      err => {
        if (err) {
          res.json({
            status: 500,
            code: 500,
            message: '服务器错误！'
          })
        }
      }
    )
})

// 删除角色
router.get('/delete/role/:rid', (req, res) => {
  let rid = req.params.rid
  Role.findByIdAndDelete(rid).then(data => {
    res.json({
      status: 200,
      code: 200,
      message: '角色删除成功！'
    })
  })
})

// 更新角色信息
router.post('/alter/role/:rid', (req, res) => {
  let rid = req.params.rid
  let { roleName, roleDes } = req.body
  Role.findByIdAndUpdate(rid, {
    roleName,
    roleDes
  }).then(data => {
    res.json({
      status: 200,
      code: 200,
      message: '角色编辑成功！'
    })
  })
})

// 取消角色授权
router.get('/delete/roles/:roleId/rights/:rightId', (req, res) => {
  let { roleId, rightId } = req.params
  roleId = Number(roleId)
  rightId = Number(rightId)
  Role.findOne({ rid: roleId }).then(data => {
    if (rightId < 10) {
      alterRight(data.children)
    } else if (rightId >= 10 && rightId < 100) {
      let index = Math.floor(rightId / 10)
      data.children.forEach((item, i) => {
        if (item.id === index) {
          alterRight(data.children[i].children)
        }
      })
    } else if (rightId >= 100) {
      let index1 = Math.floor(rightId / 100)
      let index2 = Math.floor(rightId / 10)
      data.children.forEach((item1, i) => {
        if (item1.id === index1) {
          data.children[i].children.forEach((item2, j) => {
            if (item2.id === index2) {
              alterRight(data.children[i].children[j].children)
            }
          })
        }
      })
    }
    Role.findOneAndUpdate(
      { rid: roleId },
      {
        children: data.children
      }
    ).then(result => {
      if (result) {
        res.json({
          status: 200,
          code: 200,
          data: data.children,
          message: '删除用户权限成功！'
        })
      }
    })

    function alterRight (role) {
      role.forEach((item, index) => {
        if (item.id === rightId) {
          role.splice(index, 1)
        }
      })
    }
  })
})

// 更新角色权限
router.post('/update/roles/:roleId/rights', (req, res) => {
  let roleId = Number(req.params.roleId)
  let { rightlist, list } = req.body
  let arr = []
  list = list.sort((a, b) => a - b)
  list.forEach(item => {
    rightlist.forEach((item2, index2) => {
      if (item2.id === item) {
        arr.push({
          id: item2.id,
          authName: item2.authName,
          path: item2.path,
          children: []
        })
      }
      rightlist[index2].children.forEach((item3, index3) => {
        if (item3.id === item) {
          arr.forEach((item4, index4) => {
            if (item4.id === Math.floor(item3.id / 10)) {
              arr[index4].children.push({
                id: item3.id,
                authName: item3.authName,
                path: item3.path,
                children: []
              })
            }
          })
        }
        rightlist[index2].children[index3].children.forEach((item5, index5) => {
          if (item5.id === item) {
            arr.forEach((item6, index6) => {
              if (item6.id === Math.floor(item5.id / 100)) {
                arr[index6].children.forEach((item7, index7) => {
                  if (item7.id === Math.floor(item5.id / 10)) {
                    arr[index6].children[index7].children.push({
                      id: item5.id,
                      authName: item5.authName,
                      path: item5.path,
                      children: []
                    })
                  }
                })
              }
            })
          }
        })
      })
    })
  })

  Role.findOneAndUpdate(
    { rid: roleId },
    {
      children: arr
    }
  ).then(data => {
    if (data) {
      res.json({
        status: 200,
        code: 200,
        data: arr,
        message: '修改角色权限成功！'
      })
    }
  })
})

// 获取权限列表
router.get('/right/list', (req, res) => {
  let token = req.headers.authorization

  jwt.verify(token, 'z.2021@sheng_1998', (err, decoded) => {
    if (err) {
      res.json({
        status: 200,
        code: 301,
        message: '获取角色列表失败，token已经过期或者未提供正确的token！'
      })
    } else if (decoded) {
      Right.find({}).then(data => {
        if (data) {
          res.json({
            status: 200,
            code: 200,
            rightlist: data,
            message: '获取权限列表成功！'
          })
        }
      })
    }
  })
})

// 获取树形结构的权限列表
router.get('/right/tree', (req, res) => {
  Right.find({})
    .sort({ pid: 1 })
    .then(data => {
      let result = []
      data.forEach(item => {
        if (item.pid < 10) {
          result.push({
            id: item.pid,
            authName: item.authName,
            path: item.path,
            children: []
          })
        } else if (item.pid >= 10 && item.pid < 100) {
          let index = Math.floor(item.pid / 10) - 1
          result[index].children.push({
            id: item.pid,
            authName: item.authName,
            path: item.path,
            children: []
          })
        } else if (item.pid >= 100) {
          let index1 = Math.floor(item.pid / 100) - 1
          let index2 = Math.floor(item.pid / 10) - 1 - 10 * (index1 + 1)
          result[index1].children[index2].children.push({
            id: item.pid,
            authName: item.authName,
            path: item.path,
            children: []
          })
        }
      })

      res.json({
        status: 200,
        code: 200,
        data: result
      })
    })
})

/** 权限管理相关 end */
/* #################################################### */

// 导出路由模块
module.exports = router

// 用户角色删除后显示未分配角色
