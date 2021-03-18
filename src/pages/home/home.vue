<template>
  <div class="home">
    <el-container class="container">
      <!-- 顶部状态栏 -->
      <el-header class="header">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <img
                class="logo"
                src="../../../static/image/logo/logo.png"
                alt=""
              />
            </div>
          </el-col>
          <el-col :span="2" :offset="14">
            <div class="grid-content bg-purple logout">
              <a href="#" @click="toLogout()">退出</a>
            </div>
          </el-col>
        </el-row>
      </el-header>

      <el-container class="center-container">
        <!-- 左边侧边栏 -->
        <el-aside width="200px" class="aside">
          <el-menu :router="true">
            <el-submenu :index="'' + item.id" v-for="item in menu" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id">
                <i class="el-icon-menu"></i>
                <span>{{ item2.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 中间内容区域 -->
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menu: {} // 侧边栏菜单
    }
  },

  created () {
    this.getMenus()
  },

  methods: {
    // 获取侧边栏菜单
    getMenus () {
      this.$axios.get('menus').then(res => {
        if (res.data.code === 200) {
          this.menu = res.data.data
        }
      })
    },
    // 退出登录
    toLogout () {
      window.localStorage.clear()
      this.$message.success('退出成功！')
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;

  .container {
    height: 100%;

    .header {
      background-color: #b2bfd2;

      .logo {
        height: 60px;
      }

      .logout {
        height: 60px;
        line-height: 60px;
        text-align: center;

        a {
          color: black;
        }
      }
    }

    .aside {
      background-color: #fff;
    }

    .main {
      background-color: #e9eef5;
      height: 100%;
    }
  }
}
</style>
