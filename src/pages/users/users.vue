<template>
  <div class="users">
    <el-card class="box-card">
      <!-- 面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 搜索框和添加用户按钮 -->
      <el-row class="searchRow">
        <el-col>
          <el-input
            placeholder="请输入内容"
            v-model="searchVal"
            clearable
            class="input-with-select inputSearch"
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUser()"
            ></el-button>
          </el-input>
          <el-button type="success" @click="dialogFormVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 添加用户消息框 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
        <el-form :model="formRegisterMessage">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input
              v-model="formRegisterMessage.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth">
            <el-input
              v-model="formRegisterMessage.telephone"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input
              v-model="formRegisterMessage.email"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input
              v-model="formRegisterMessage.password"
              autocomplete="off"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth">
            <el-input
              v-model="formRegisterMessage.password2"
              autocomplete="off"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">添加</el-button>
        </div>
      </el-dialog>

      <!-- 用户表格 -->
      <el-table :data="userlist" style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="80">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="telephone" label="电话" width="150">
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" width="120">
          <template slot-scope="userlist">
            {{ userlist.row.created_time | fmtdata }}
          </template>
        </el-table-column>
        <el-table-column prop="limit" label="用户状态" width="100">
          <template slot-scope="userlist">
            <el-switch
              v-model="userlist.row.limit"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template>
            <el-row>
              <el-button
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
              <el-button
                size="mini"
                plain
                type="success"
                icon="el-icon-check"
                circle
              ></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchVal: '', // 查询字符串
      userlist: [], // 用户列表
      status: false, // 用户状态
      // 分页相关数据
      pagenum: 1, // 页码
      pagesize: 5, // 每页显示的用户数据条数
      total: 0, // 总数据条数
      pageSizes: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50], // 每页显示条数数组
      currentPage: 1, // 前往第几页
      // 添加用户消息框相关数据
      dialogFormVisible: false, // 是否显示消息框
      formRegisterMessage: {
        username: '',
        telephone: '',
        email: '',
        password: '',
        password2: ''
      },
      formLabelWidth: '120px'
    }
  },

  created () {
    this.getUserList()
  },

  methods: {
    // 获取用户列表数据
    getUserList () {
      const AUTH_TOKEN = window.localStorage.getItem('token')
      this.$axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
      this.$axios
        .get(
          `users?query=${this.searchVal}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
        )
        .then(res => {
          let resData = res.data
          if (resData.status === 200 && resData.code === 200) {
            this.userlist = resData.data
            this.total = resData.total
            this.$message.success('获取数据成功！')
          } else {
            this.$message.error('获取数据失败！')
          }
          console.log(res.data)
        })
    },
    // 搜索用户
    searchUser () {
      if (this.searchVal.trim()) {
        this.getUserList()
      }
    },
    // 发送添加用户请求
    addUser () {
      if (!this.formRegisterMessage.username.trim()) {
        this.$message.warning('请输入用户名！')
      } else if (!this.formRegisterMessage.telephone.trim()) {
        this.$message.warning('请输入电话！')
      } else if (!this.formRegisterMessage.email.trim()) {
        this.$message.warning('请输入邮箱！')
      } else if (!this.formRegisterMessage.password.trim()) {
        this.$message.warning('请输入密码！')
      } else if (!this.formRegisterMessage.password2.trim()) {
        this.$message.warning('请确认密码！')
      } else if (
        this.formRegisterMessage.password !== this.formRegisterMessage.password2
      ) {
        this.$message.warning('两次输入密码不一致！')
      } else {
        this.$axios.post('register', this.formRegisterMessage).then(res => {
          if (res.data.code === 200) {
            this.$message.success('添加用户成功！')
            this.getUserList()
            this.dialogFormVisible = false
            for (const key in this.formRegisterMessage) {
              if (this.formRegisterMessage.hasOwnProperty(key)) {
                this.formRegisterMessage[key] = ''
              }
            }
            this.formRegisterMessage.username = ''
            this.formRegisterMessage.telephone = ''
            this.formRegisterMessage.email = ''
            this.formRegisterMessage.password = ''
            this.formRegisterMessage.password2 = ''
          } else if (res.data.code === 202) {
            this.$message({
              message: '该用户名已经存在！',
              type: 'warning'
            })
          }
        })
      }
    },
    // 改变每页显示条数触发该事件
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },
    // 该条页数跳转时触发该事件
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
.users {
  height: 100%;

  .box-card {
    height: 100%;

    .searchRow {
      margin-top: 20px;

      .inputSearch {
        width: 300px;
      }
    }
  }
}
</style>
