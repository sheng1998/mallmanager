// 用户表模型设置
let mongoose = require('mongoose')

let Schema = mongoose.Schema

let roleSchema = new Schema({
    // 角色 id
    rid: {
        type: Number,
        required: true
    },
    // 角色名
    roleName: {
        type: String,
        required: true
    },
    // 角色描述
    roleDesc: {
        type: String,
        required: true
    },
    // 被管理用户
    children: {
        type: Object,
        default: {}
    }
})

module.exports = mongoose.model('Role', roleSchema)
