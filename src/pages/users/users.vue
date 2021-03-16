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

      <!-- 添加用户对话框 -->
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
              placeholder="请输入内容"
              v-model="formRegisterMessage.email"
              class="input-with-select"
            >
              <el-select
                v-model="currentEmailSuffix"
                slot="suffix"
                placeholder="请选择"
                class="email-select"
              >
                <el-option
                  v-for="(item, i) in emailSuffix"
                  :key="i"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-input>
            <!-- <el-input
              v-model="formRegisterMessage.email"
              autocomplete="off"
            ></el-input> -->
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

      <!-- 编辑用户对话框 -->
      <el-dialog title="编辑用户信息" :visible.sync="editUserDialogVisible">
        <el-form :model="editUserForm">
          <el-form-item label="用户名" :label-width="editUserLabelWidth">
            <el-input
              v-model="editUserForm.username"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="editUserLabelWidth">
            <el-input
              v-model="editUserForm.telephone"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="editUserLabelWidth">
            <el-input
              v-model="editUserForm.email"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser()">保存</el-button>
        </div>
      </el-dialog>

      <!-- 分配用户角色对话框 -->
      <el-dialog title="分配用户角色" :visible.sync="setUserRoleDia">
        <el-form :model="currentUser">
          <!-- 用户名 -->
          <el-form-item label="用户名" label-width="100px">
            {{ currentUser.username }}
          </el-form-item>
          <!-- 用户角色选择 -->
          <el-form-item label="角色" label-width="100px">
            <el-select
              filterable
              v-model="currentuserRoleId"
              placeholder="请选择用户角色"
            >
              <el-option
                v-for="(role, i) in userRoleList"
                :key="i"
                :label="role.roleName"
                :value="role.rid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setUserRoleDia = false">取 消</el-button>
          <el-button type="primary" @click="alterRole()">确定</el-button>
        </div>
      </el-dialog>

      <!-- 用户表格 -->
      <el-table :data="userlist" style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="80">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="220">
        </el-table-column>
        <el-table-column prop="telephone" label="电话" width="150">
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" width="120">
          <template slot-scope="userlist">
            {{ userlist.row.created_time | fmtdata }}
          </template>
        </el-table-column>
        <!-- 用户表格 --》 用户状态 -->
        <el-table-column prop="limit" label="用户状态" width="100">
          <template slot-scope="userlist">
            <el-switch
              v-model="userlist.row.limit"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserstatus(userlist.row.id, userlist.row.limit)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 用户列表 --》 操作 -->
        <el-table-column label="操作" width="180">
          <template slot-scope="userlist">
            <el-row>
              <!-- 编辑用户 -->
              <el-button
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditUserDialogVisible(userlist.row)"
              ></el-button>
              <!-- 删除用户 -->
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
                @click="showDeleteBox(userlist.row.id)"
              ></el-button>
              <!-- 分配用户角色 -->
              <el-button
                size="mini"
                plain
                type="success"
                icon="el-icon-check"
                circle
                @click="showSetUserRoleDia(userlist.row.id)"
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
      input3: '',
      select: '',
      searchVal: '', // 查询字符串
      userlist: [], // 用户列表
      status: false, // 用户状态
      // 分页相关数据
      pagenum: 1, // 页码
      pagesize: 5, // 每页显示的用户数据条数
      total: 0, // 总数据条数
      pageSizes: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50], // 每页显示条数数组
      currentPage: 1, // 前往第几页
      // 添加用户对话框相关数据
      dialogFormVisible: false, // 是否显示对话框
      formRegisterMessage: {
        username: '',
        telephone: '',
        email: '',
        password: '',
        password2: ''
      },
      formLabelWidth: '100px',
      // 编辑用户对话框相关信息
      editUserDialogVisible: false,
      editUserLabelWidth: '80px',
      editUserForm: {},
      // 分配用户角色对话框相关
      setUserRoleDia: false,
      currentuserRoleId: '',
      currentUser: {},
      userRoleList: [],
      // 邮箱后缀相关
      currentEmailSuffix: '@qq.com',
      emailSuffix: [
        { name: '@126.com', value: '@126.com' },
        { name: '@163.com', value: '@163.com' },
        { name: '@21cn.com', value: '@21cn.com' },
        { name: '@aliyun.com', value: '@aliyun.com' },
        { name: '@gmail.com', value: '@gmail.com' },
        { name: '@googlemail.com', value: '@googlemail.com' },
        { name: '@hotmail.com', value: '@hotmail.com' },
        { name: '@mail.com', value: '@mail.com' },
        { name: '@qq.com', value: '@qq.com' },
        { name: '@sina.com', value: '@sina.com' },
        { name: '@sohu.com', value: '@sohu.com' },
        { name: '@stu.gdou.edu.cn', value: '@stu.gdou.edu.cn' },
        { name: '@yahoo.com', value: '@yahoo.com' },
        { name: '其他邮箱后缀请在输入框中输入', value: '' }
      ]
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
      this.formRegisterMessage.email += this.currentEmailSuffix
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
    },
    // 修改用户状态
    changeUserstatus (id, status) {
      this.$axios.get('edit/status', { params: { id, status } }).then(res => {
        if (res.data.code === 200) {
          this.$message.success('用户状态修改成功！')
        } else {
          this.$message.error('用户状态修改失败！')
          this.getUserList()
        }
      })
    },
    // 删除提示框
    showDeleteBox (id) {
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.get('delete', { params: { id: id } }).then(res => {
            if (res.data.code === 200) {
              this.getUserList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message.error('删除失败！')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 显示编辑用户对话框
    showEditUserDialogVisible (userdata) {
      this.editUserForm = userdata
      this.editUserDialogVisible = true
    },
    // 编辑用户信息
    editUser () {
      let { id, telephone, email } = this.editUserForm
      this.$axios.get('edit', { params: { id, telephone, email } }).then(
        res => {
          this.$message.success('修改用户信息成功！')
          this.editUserDialogVisible = false
          this.getUserList()
        },
        err => {
          if (err) {
            this.$message.error('修改用户信息失败！')
          }
        }
      )
    },
    // 显示分配用户对话框
    showSetUserRoleDia (id) {
      // 查询所有角色列表
      this.$axios.get('getrolelist').then(res => {
        let rolelist = res.data.rolelist
        if (rolelist) {
          // 将查询结果赋值给 userRoleList
          this.userRoleList = rolelist
          // 根据用户 id 查询用户信息（角色信息）
          this.$axios.get('getusermessage', { params: { id } }).then(res => {
            let usermessage = res.data.usermessage
            if (usermessage) {
              // 将查询到的角色赋值给 currentUser
              this.currentUser = usermessage
              this.currentuserRoleId = usermessage.rid
              // 显示对话框
              this.setUserRoleDia = true
            }
          })
        }
      })
    },
    // 修改用户角色
    alterRole () {
      this.$axios
        .get('alterrole', {
          params: {
            id: this.currentUser.id,
            rid: this.currentuserRoleId
          }
        })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('用户角色修改成功！')
            this.setUserRoleDia = false
          }
        })
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

    .email-select {
      margin-right: -5px;
    }
  }
}
</style>
