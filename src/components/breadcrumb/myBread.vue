<template>
  <!-- 面包屑 -->
  <el-breadcrumb class="my-bread" separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level1 }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level2 }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'my-el-breadcrumb',
  props: ['level1', 'level2']
}
</script>

<style lang="less" scoped>
.my-bread {
  padding-bottom: 15px;
}
</style>
