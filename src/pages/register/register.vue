<template>
  <div class="login">
    <div class="center">
      <h2>用户注册</h2>
      <el-form label-position="top" label-width="80px" :model="formRegisterMessage">
        <el-form-item label="用户名">
          <el-input required v-model="formRegisterMessage.username"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input required v-model="formRegisterMessage.telephone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input required v-model="formRegisterMessage.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input required type="password" v-model="formRegisterMessage.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input required type="password" v-model="formRegisterMessage.password2"></el-input>
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button type="primary" @click="handleRegister()">注册</el-button>
          <el-button type="success" @click="toLoginPage()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formRegisterMessage: {
        username: '',
        telephone: '',
        email: '',
        password: '',
        password2: ''
      }
    }
  },
  methods: {
    // 处理注册请求
    handleRegister () {
      if (
        this.formRegisterMessage.username.trim() &&
        this.formRegisterMessage.telephone.trim() &&
        this.formRegisterMessage.email.trim() &&
        this.formRegisterMessage.password.trim() &&
        this.formRegisterMessage.password === this.formRegisterMessage.password2
      ) {
        this.$axios.post('register', this.formRegisterMessage).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              dangerouslyUseHTMLString: true,
              message: '注册成功，自动跳转至<a href="#/login">登录页面</a>！',
              type: 'success',
              duration: 500,
              onClose: () => {
                this.$router.push('/login')
              }
            })
          }
        })
      } else {
        window.alert('请正确填写各项信息！')
      }
    },

    // 跳转至登录页面
    toRegisterPage () {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url('../../../static/image/bg-login.jpg');
  background-repeat:no-repeat;
  background-size:100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;

  &:after{
    content: "";
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    background: inherit;
    filter: blur(2px);/*为了模糊更明显，调高模糊度*/
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
        width: 100px;

        a {
          color: white;
        }
      }
    }
  }
}
</style>
