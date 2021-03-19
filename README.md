# mallmanager

> 基于 vue2.0 + axios + elementUI 的商品后台管理系统

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 项目启动操作说明
### 运行环境
* Node.js
* MySQL

### 服务器相关
```bash
# 1. 在软件（Navicat Premium）中创建数据库 mallmanager
# 2. 找到文件 ./server/db/shop.sql
# 3. 将此文件导入本地 mysql 数据库内(导入刚创建的 mallmanager 数据库)
# 4. 找到文件 ./config/default.json, 并检查配置信息 database、 user、 password` 是否和本地数据库一致
# 5. 如果不一致，请修改，保证和本地数据库信息一致

# 6. 进到 server 目录之下
cd ./server

# 7. 先运行 npm install 安装依赖包
npm install

# 8. 启动服务器
node ./app.js
```

### 启动项目
``` bash
# 安装包
npm install

# 启动
npm run dev
```

## 目录结构描述
```
.                                   // 项目根目录
├── build                           // webpack 相关配置文件夹
├── config                          // webpack 相关配置文件夹
    ├── index.js                    // 指定的后台服务的端口号和静态资源文件夹
├── node_modules                    // 第三方包下载目录
├── server                          // 服务器相关代码及配置说明文件所在目录
    ├── config                      // 配置文件目录
        ├── default.json            // 默认配置文件（其中包含数据库配置，jwt配置）
    ├── dao                         // 数据访问层，存放对数据库的增删改查操作
        ├── DAO.js                  // 提供的公共访问数据库的方法
    ├── models                      // 存放具体数据库 ORM 模型文件
    ├── docs                        // 包含 sql 文件和 api 接口文档
        ├── shop.sql                // 本地数据库的 sql 文件
        ├── 接口api文档.md           // 关于服务器的所有接口文档
    ├── modules                     // 当前项目模块
        ├── authorization.js        // API权限验证模块
        ├── database.js             // 数据库模块（数据库加载基于 nodejs-orm2 库加载）
        ├── passport.js             // 基于 passport 模块的登录搭建
        ├── resextra.js             // API 统一返回结果接口
    ├── node_modules                // 项目依赖的第三方模块
    ├── routes                      // 统一路由
        ├── api                     // 提供 api 接口
        ├── mapp                    // 提供移动APP界面
        ├── mweb                    // 提供移动web站点
    ├── services                    // 服务层，业务逻辑代码在这一层编写，通过不同的接口获取的数据转换成统一的前端所需要的数据
    ├── app.js                      // 主项目入口文件
    ├── package.json                // 项目配置文件
├── src                             // 源码文件夹
    ├── api                         // 与后台交互模块文件夹
    ├── common                      // 通用资源文件夹，如fonts/img/stylus
    ├── components                  // 非路由组件文件夹
    ├── filters                     // 自定义过滤器模块文件夹
    ├── pages                       // 路由组件文件夹
    ├── plugin                      // 自定义插件文件夹
    ├── router                      // 路由器文件夹
    ├── store                       // vuex相关模块文件夹
    ├── App.vue                     // 应用组件
    ├── main.js                     // 项目入口 js
├── static                          // 静态资源文件夹
├── .babelrc                        // babel 的配置文件
├── .editorconfig                   // 通过编辑器的编码/格式进行一定的配置
├── .eslintignore                   // eslint检查忽略的配置
├── .eslintrc.js                    // eslint检查的配置
├── .gitigore                       // git版本管制忽略的配置
├── index.html                      // 主页面文
├── package-lock.json               // 第三方包版本锁定文件
├── package.json                    // 包描述文件 
├── README.md                       // 项目说明书
```

## 路由设计
| 路径      | 方法 | GET 参数 | POST 参数 | 备注             |
| --------- | ---- | -------- | --------- | ---------------- |
| /#/login  | GET  |          |           | 渲染登录页面     |
| /#/users  | GET  |          |           | 渲染用户列表页面 |
| /#/users  | GET  |          |           | 渲染用户列表页面 |
| /#/users  | GET  |          |           | 渲染用户列表页面 |
| /#/roles  | GET  |          |           | 渲染角色列表页面 |
| /#/rights | GET  |          |           | 渲染权限列表页面 |
| /#/goods  | GET  |          |           | 渲染商品列表页面 |

