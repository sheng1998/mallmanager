// 用户表模型设置
let mongoose = require('mongoose')

let Schema = mongoose.Schema

let userSchema = new Schema({
    // 用户名
    username: {
        type: String,
        required: true
    },
    // 密码
    password: {
        type: String,
        required: true
    },
    // 电话
    telephone: {
        type: String,
        required: true
    },
    // 邮箱
    email: {
        type: String,
        required: true
    },
    // 权限
    limit: {
        type: Boolean,
        default: false
    },
    // 角色id
    // 普通用户: 18
    // 主管: 28
    // 项目经理: 58
    // 产品经理: 68
    // 超级管理员: 168
    role_id: {
        type: Number,
        default: 18,
        enum: [18, 28, 58, 68, 168]
    },
    // 创建时间
    created_time: {
        type: Date,
        default: Date.now
    },
    // 是否已经删除该用户，默认为未删除，此做法为了防止数据丢失，可以随时恢复
    isDelete: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('User', userSchema)
