// 用户表模型设置
let mongoose = require('mongoose')

let Schema = mongoose.Schema

let rightSchema = new Schema({
    // 权限名
    authName: {
        type: String,
        required: true
    },
    // 层级
    level: {
        type: Number,
        required: true
    },
    // 路径名
    path: {
        type: String,
        required: true
    },
    // 路径 id
    pid: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Right', rightSchema)
