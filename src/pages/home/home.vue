<template>
  <div class="home">
    <el-container class="container">
      <!-- 顶部状态栏 -->
      <el-header class="header">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <img class="logo" src="../../../static/image/logo/logo.png" alt="">
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
          <el-menu :unique-opened="true" :router="true" default-active="users">
            <!-- 侧边导航栏 --》 用户管理 -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="users">
                <i class="el-icon-menu"></i>
                <span>用户列表</span>
              </el-menu-item>
            </el-submenu>
            <!-- 侧边导航栏 --》 权限管理 -->
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="2-1">
                <i class="el-icon-menu"></i>
                <span>角色列表</span>
              </el-menu-item>
              <el-menu-item index="2-2">
                <i class="el-icon-menu"></i>
                <span>权限列表</span>
              </el-menu-item>
            </el-submenu>
            <!-- 侧边导航栏 --》 商品管理 -->
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="3-1">
                <i class="el-icon-menu"></i>
                <span>商品列表</span>
              </el-menu-item>
              <el-menu-item index="3-1">
                <i class="el-icon-menu"></i>
                <span>分类参数</span>
              </el-menu-item>
              <el-menu-item index="3-1">
                <i class="el-icon-menu"></i>
                <span>商品分类</span>
              </el-menu-item>
            </el-submenu>
            <!-- 侧边导航栏 --》 订单管理 -->
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item index="4-1">
                <i class="el-icon-menu"></i>
                <span>订单列表</span>
              </el-menu-item>
            </el-submenu>
            <!-- 侧边导航栏 --》 数据统计 -->
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item index="5-1">
                <i class="el-icon-menu"></i>
                <span>数据报表</span>
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
  beforeCreate () {
    const token = localStorage.getItem('token')
    if (!token) {
      this.$router.push({name: 'login'})
    }
  },

  methods: {
    toLogout () {
      window.localStorage.clear()
      this.$message.success('退出成功！')
      this.$router.push({path: '/login'})
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
