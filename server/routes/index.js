// 引入 express 包
let express = require('express')
//  引入 mongoose 包
let mongoose = require('mongoose')
// 引入 MD5 加密包
let md5 = require('blueimp-md5'); // 加载 blueimp-md5 模块(用于密码加密)
// 引入 jsonwebtoken 包
let jwt = require('jsonwebtoken'); // 用于登陆检测
// 引入 multer 包，处理图片上传请求
let multer = require('multer')

// 引入 path 模块
let path = require('path')
// 引入 fs 模块
let fs = require('fs');

// 连接 MongoDB 数据库
mongoose.connect('mongodb://localhost:27018/mallmanager')
let User = require('../models/user')
let Good = require('../models/goods')

// 创建路由容器
let router = express.Router()

// 记录当前登录用户的ID
let userID = ''
// 记录保存的文件名
let fileName = ''

// 配置文件信息
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let filePath = `./public/img/goods/${userID}`
        fs.mkdir(filePath, {recursive: true}, err => {
            if(err) {
                throw err
            } else {
                cb(null, filePath); // 指定文件保存的路径
            }
        })
    },
    filename: function (req, file, cb) {
        let ext = path.parse(file.originalname).ext
        fileName = ((new Date()).getTime()).toString() + ext
        cb(null, fileName); // 指定文件保存的文件名
    }
})
let upload = multer({ storage: storage })

router.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    next();
})

// 处理登录请求
router.post('/login', (request, response) => {
    let username = request.body.username
    let password = md5(md5(request.body.password + 'qwe123ABC') + 'p0o9@123.c%')
    User.findOne({
        username
    }).then(data => {
        if (data) {
            return User.findOne({
                username, password
            })
        } else {
            response.json({
                status: 200,
                code: 101,
                message: '该用户未注册！'
            })
            throw new Error('该用户未注册！')
        }
    }).then(data => {
        if (data) {
            let token = {username, password}
            token = jwt.sign(token, 'z.2021@sheng_1998', {expiresIn: 30000})
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
    }).catch(err => {
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
    let user = new User({
        username: data.username,
        password: password,
        telephone: data.telephone,
        email: data.email
    })
    user.save().then(() => {
        console.log('保存成功！')
        response.json({
            status: 200,
            code: 200,
            message: '注册成功！'
        })
    }, err => {
        console.log(err.errors)
        response.json({
            status: 200,
            code: 201,
            message: '注册失败！'
        })
    })
})

// 处理注册请求
router.post('/register2', (request, response) => {
    User.findOne({
        username: request.body.username
    }).then(data => {
        if (data) {
            response.json({
                status: 200,
                err_code: 1,
                message: '用户名已经被注册！'
            })
            throw new Error('用户名已经被注册！')
        } else {
            return User.findOne({
                telephone: request.body.telephone
            })
        }
    }).then(data => {
        if (data) {
            response.json({
                status: 200,
                err_code: 2,
                message: '电话已经被注册！'
            })
            throw new Error('电话已经被注册！')
        } else {
            let password = request.body.password
            let reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*.])[\da-zA-Z~!@#$%^&*.]{8,}$/g
            if (reg.test(password)) {
                password = md5(md5(password + 'qwe123ABC') + 'p0o9@123.c%')
                let user = new User({
                    username: request.body.username,
                    password: password,
                    telephone: request.body.telephone
                })
                user.save().then(() => {
                    console.log('保存成功！')
                }, err => {
                    console.log(err.errors)
                })
                response.json({
                    status: 200,
                    err_code: 0,
                    message: '注册成功！'
                })
            } else {
                response.json({
                    status: 200,
                    err_code: 3,
                    message: '密码太过于简单！'
                })
            }
        }
    }).catch(err => {
        if (err) {
            response.json({
                status: 500,
                err_code: 500,
                message: 'Server Error!'
            })
        }
    })
})

// 处理登录请求
router.post('/login1', (request, response) => {
    let password = request.body.password
    password = md5(md5(password + 'qwe123ABC') + 'p0o9@123.c%')
    User.findOne({
        telephone: request.body.telephone
    }).then(data => {
        if (data) {
            return User.findOne({
                telephone: request.body.telephone,
                password: password
            })
        } else {
            response.json({
                status: 200,
                err_code: -2,
                message: '该电话号码未注册！'
            })
            throw new Error('该电话号码未注册！')
        }
    }).then(data => {
        if (data) {
            request.session.user = data
            userID = data._id
            response.json({
                status: 200,
                err_code: 0,
                message: '登陆成功！'
            })
        } else {
            response.json({
                status: 200,
                err_code: -3,
                message: '密码错误！'
            })
        }
    }).catch(err => {
        if (err) {
            response.json({
                status: 500,
                err_code: 500,
                message: 'Server Error!'
            })
        }
    })
})

// 处理退出请求
router.get('/logout', (request, response) => {
    request.session.user = ''
    response.redirect('/login')
})

// 渲染商品管理页面
router.get('/goods/commodity-management', (request, response) => {
    myRedirect(request, response, function () {
        Good.find().then(data => {
            response.render('./goods/commodity-management.html', {
                user: request.session.user,
                goods: data
            })
        }).catch(err => {
            if (err) {
                response.json({
                    status: 500,
                    err_code: 500,
                    message: 'Server Error!'
                })
            }
        })
    })
})

// 渲染添加商品页面
router.get('/goods/add', (request, response) => {
    myRedirect(request, response, function () {
        response.render('./goods/add.html', {
            user: request.session.user
        })
    })
})

// 处理添加商品请求
router.post('/goods/add', upload.single('image'), (request, response) => {
    let good = new Good({
        user_id: request.body.user_id,
        good_name: request.body.name,
        good_price: request.body.price,
        good_img: `../public/img/goods/${userID}/${fileName}`,
        good_type: request.body.type,
        classification1: request.body.classification1,
        classification2: request.body.classification2
    })
    good.save().then(() => {
        response.statusCode = 301
        response.setHeader('Location', '/goods/commodity-management')
        response.end()
    }).catch(err => {
        if (err) {
            response.json({
                status: 500,
                err_code: 500,
                message: 'Server Error!'
            })
        }
    })
})

// 处理删除商品请求
router.get('/goods/remove', (request, response) => {
    myRedirect(request, response, function () {
        Good.findByIdAndDelete(request.query.id).then(() => {
            response.json({
                status: 200,
                err_code: 0,
                message: '删除成功！'
            })
        }).catch(err => {
            if (err) {
                response.json({
                    status: 500,
                    err_code: 500,
                    message: 'Server Error!'
                })
            }
        })
    })
})

// 渲染分类管理页面
router.get('/goods/lassified-management', (request, response) => {
    myRedirect(request, response, function () {
        response.render('./goods/lassified-management.html', {
            user: request.session.user
        })
    })
})

// 渲染商品评价页面
router.get('/goods/commodity-evaluation', (request, response) => {
    myRedirect(request, response, function () {
        response.render('./goods/commodity-evaluation.html', {
            user: request.session.user
        })
    })
})

// 渲染热销商品页面
router.get('/goods/hot-goods', (request, response) => {
    myRedirect(request, response, function () {
        response.render('./goods/hot-goods.html', {
            user: request.session.user
        })
    })
})

// 渲染库存预警页面
router.get('/goods/inventory-warning', (request, response) => {
    myRedirect(request, response, function () {
        response.render('./goods/inventory-warning.html', {
            user: request.session.user
        })
    })
})

// 渲染订单管理页面
router.get('/order/order-management', (request, response) => {
    myRedirect(request, response, function () {
        response.render('./order/order-management.html', {
            user: request.session.user
        })
    })
})

// 渲染发货信息管理页面
router.get('/order/delivery-information-management', (request, response) => {
    myRedirect(request, response, function () {
        response.render('./order/delivery-information-management.html', {
            user: request.session.user
        })
    })
})

// 渲染订单管理页面
router.get('/order/refund-order', (request, response) => {
    myRedirect(request, response, function () {
        response.render('./order/refund-order.html', {
            user: request.session.user
        })
    })
})

// 渲染 404 页面
router.get('/404', (request, response) => {
    response.send('404')
})

// 未登陆就重定向至首页
function myRedirect(request, response, fun) {
    if(request.session.user){
        fun()
    } else {
        response.redirect('/login')
    }
}

// 导出路由模块
module.exports = router