<template>
  <div class="rights">
    <el-card class="box-card">
      <!-- 面包屑 -->
      <my-el-breadcrumb level1="权限管理" level2="权限列表"></my-el-breadcrumb>

      <!-- 权限列表表格 -->
      <el-table :data="rightlist" border style="width: 100%" :height="tableHeight">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="200">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="300">
        </el-table-column>
        <el-table-column prop="level" label="层级">
          <template slot-scope="rightlist">
            <span v-if="rightlist.row.level === '0'">一级</span>
            <span v-if="rightlist.row.level === '1'">二级</span>
            <span v-if="rightlist.row.level === '2'">三级</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableHeight: 500,
      rightlist: []
    }
  },

  created () {
    this.tableHeight = window.innerHeight - 200
    this.getRightList()
  },

  methods: {
    // 获取权限列表
    getRightList () {
      this.$axios.get('rights/list').then(res => {
        if (res.data.meta.status === 200) {
          this.rightlist = res.data.data
          this.$message.success('获取权限列表成功！')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
