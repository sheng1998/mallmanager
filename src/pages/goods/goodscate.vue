<template>
  <div class="goodscate">
    <el-card class="box-card">
      <!-- 面包屑 -->
      <my-el-breadcrumb level1="商品管理" level2="商品分类"></my-el-breadcrumb>

      <!-- 添加分类按钮 -->
      <el-button type="success" @click="showAddCateDia">添加分类</el-button>

      <!-- 分类表格 -->
      <el-table
        v-loading="loading"
        class="my-el-table"
        :data="cateList"
        height="480px"
        style="margin-bottom: 20px;"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="cat_name" label="分类名称" min-width="180px">
        </el-table-column>
        <el-table-column prop="cat_level" label="级别" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.cat_level === 0">一级</span>
            <span v-if="scope.row.cat_level === 1">二级</span>
            <span v-if="scope.row.cat_level === 2">三级</span>
          </template>
        </el-table-column>
        <el-table-column label="是否有效" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.cat_deleted === false">有效</span>
            <span v-else>无效</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-row>
              <!-- 编辑分类 -->
              <el-button
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditCate(scope.row)"
              ></el-button>
              <!-- 删除分类 -->
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteCate(scope.row.cat_id)"
              ></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addCateDia">
        <el-form :model="addCateForm" label-width="100px">
          <el-form-item label="分类名称">
            <el-input
              v-model="addCateForm.cat_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-cascader
              v-model="currentCate"
              :options="categories"
              :props="defaultProps"
              clearable
              filterable
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCateDia = false">取 消</el-button>
          <el-button type="primary" @click="addCate()">添加</el-button>
        </div>
      </el-dialog>

      <!-- 编辑分类对话框 -->
      <el-dialog title="编辑分类" :visible.sync="editCateDia">
        <el-form :model="editCateForm" label-width="100px">
          <el-form-item label="分类名称">
            <el-input
              v-model="editCateForm.cat_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCateDia = false">取 消</el-button>
          <el-button type="primary" @click="editCate()">添加</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true, // 加载中
      cateList: [], // 分类数据
      addCateForm: {
        cat_name: '',
        cat_level: 0,
        cat_pid: 0
      }, // 添加分类表单
      addCateDia: false, // 添加分类对话框显示与否

      // 编辑分类相关数据
      editCateDia: false, // 编辑分类对话框显示与否
      editCateForm: {
        cat_name: '',
        cat_id: null
      }, // 编辑分类表单

      // 级联选择器相关数据
      categories: [], // 分类数据
      currentCate: [], // 当前选择分类
      defaultProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      } // 级联选择器的默认配置信息
    }
  },

  created () {
    this.getCateList()
  },

  methods: {
    // 获取分类数据
    getCateList () {
      this.$axios.get('categories', { params: { type: 3 } }).then(res => {
        let {
          data,
          meta: { status }
        } = res.data
        if (status === 200) {
          this.cateList = data
          this.loading = false
        }
      })
    },

    // 显示添加分类对话框
    showAddCateDia () {
      this.addCateDia = true
      this.loading = true
      this.$axios.get('categories', { params: { type: 2 } }).then(res => {
        let {
          data,
          meta: { status }
        } = res.data
        if (status === 200) {
          this.categories = data
          this.loading = false
        }
      })
    },

    // 级联选择器发生改变
    handleChange () {
      let catLevel = this.currentCate.length
      this.addCateForm.cat_level = catLevel
      this.addCateForm.cat_pid = this.currentCate[catLevel - 1] || 0
    },

    // 添加分类
    addCate () {
      this.$axios.post('categories', this.addCateForm).then(res => {
        if (res.data.meta.status === 201) {
          this.$message.success('添加分类成功！')
          this.getCateList()
          this.addCateDia = false
          this.addCateForm = {
            cat_name: '',
            cat_level: 0,
            cat_pid: 0
          }
          this.currentCate = []
        } else {
          this.$message.error(res.data.meta.msg)
        }
      })
    },

    // 显示编辑分类对话框
    showEditCate (cate) {
      this.editCateDia = true
      this.editCateForm.cat_id = cate.cat_id
      this.editCateForm.cat_name = cate.cat_name
    },

    // 编辑分类
    editCate () {
      console.log(this.editCateForm)
      this.$axios
        .put(`categories/${this.editCateForm.cat_id}`, {
          cat_name: this.editCateForm.cat_name
        })
        .then(res => {
          console.log(res)
          let {
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.$message.success(msg)
          } else if (status === 401) {
            this.$message.warning('应该是后台接口出问题了！')
          } else {
            this.$message.error(msg)
          }
        })
    },

    // 删除分类
    deleteCate (id) {
      this.$confirm('是否删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.delete(`categories/${id}`).then(res => {
            let {
              meta: { msg, status }
            } = res.data
            if (status === 200) {
              this.$message.success(msg)
              this.getCateList()
            } else {
              this.$message.error(msg)
            }
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.my-el-table {
  margin-top: 20px;
}
</style>
