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
### 服务器相关
```bash
# 进到 server 目录之下
cd ./server

# 安装服务器所需第三方包
npm install

# 启动数据库
npm run startdb

# 启动服务器
npm run start
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
.                           // 项目根目录
├── build                   // webpack 相关配置文件夹
├── config                  // webpack 相关配置文件夹
    ├── index.js            // 指定的后台服务的端口号和静态资源文件夹
├── node_modules            // 第三方包下载目录
├── src                     // 源码文件夹
    ├── api                 // 与后台交互模块文件夹
    ├── common              // 通用资源文件夹，如fonts/img/stylus
    ├── components          // 非路由组件文件夹
    ├── filters             // 自定义过滤器模块文件夹
    ├── pages               // 路由组件文件夹
    ├── plugin              // 自定义插件文件夹
    ├── router              // 路由器文件夹
    ├── store               // vuex相关模块文件夹
    ├── App.vue             // 应用组件
    ├── main.js             // 项目入口 js
├── static                  // 静态资源文件夹
├── .babelrc                // babel 的配置文件
├── .editorconfig           // 通过编辑器的编码/格式进行一定的配置
├── .eslintignore           // eslint检查忽略的配置
├── .eslintrc.js            // eslint检查的配置
├── .gitigore               // git版本管制忽略的配置
├── index.html              // 主页面文
├── package-lock.json       // 第三方包版本锁定文件
├── package.json            // 包描述文件
├── README.md               // 项目说明书
```

## 路由设计
| 路径        | 方法 | GET 参数 | POST 参数 | 备注         |
| ----------- | ---- | -------- | --------- | ------------ |
| /#/login    | GET  |          |           | 渲染登录页面 |
| /#/register | GET  |          |           | 渲染注册页面 |

