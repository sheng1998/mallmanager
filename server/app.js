// 引入 node 自带模块 path
let path = require('path')
// 引入 express 包
let express = require('express')
// 引入 body-parser 包，处理 post 请求的数据
let bodyParser = require('body-parser')

// 引入路由模块
let router = require('./routes/index') 

// 创建 express 的实例
let app = express()

// 公开静态资源目录 public
app.use('/public/', express.static(path.join(__dirname, './public/')))

// 配置 body-parser 中间件，专门处理解析表单 post 请求体
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// 把路由模块挂载到 app 服务中
app.use(router)

// 监听服务器端口
app.listen(3000, () => {
    console.log('running...')
})
