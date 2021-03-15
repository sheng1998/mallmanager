<template>
  <div class="login">
    <div class="center">
      <h2>用户登录</h2>
      <el-form
        label-position="top"
        label-width="80px"
        :model="formLoginMessage"
      >
        <el-form-item label="用户名">
          <el-input required v-model="formLoginMessage.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            required
            type="password"
            v-model="formLoginMessage.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button type="success" @click="handleLogin()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formLoginMessage: {
        username: 'admit',
        password: '123456'
      }
    }
  },
  methods: {
    // 发送登录请求
    handleLogin () {
      if (!this.formLoginMessage.username.trim()) {
        this.$message.warning('请输入用户名！')
      } else if (!this.formLoginMessage.password.trim()) {
        this.$message.warning('请输入密码！')
      } else {
        this.$axios.post('login', this.formLoginMessage).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.$message.success('登陆成功！')
            this.$router.push({ name: 'home' })
            window.localStorage.token = data.token
          } else {
            this.$message.error('登陆失败，' + data.message)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url('../../../static/image/bg-login.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;

  &:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: inherit;
    filter: blur(2px); /*为了模糊更明显，调高模糊度*/
    z-index: 2;
  }

  .center {
    width: 500px;
    padding: 30px 50px;
    box-sizing: border-box;
    background-color: rgb(243, 241, 241);
    border-radius: 10px;
    z-index: 3;

    h2 {
      font-size: 30px;
      font-weight: bold;
    }

    .form-btn {
      display: flex;
      justify-content: center;
      align-items: center;

      button {
        width: 200px;

        a {
          color: white;
        }
      }
    }
  }
}
</style>
