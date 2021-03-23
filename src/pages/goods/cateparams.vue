<template>
  <div class="cateparams">
    <el-card class="box-card">
      <!-- 面包屑 -->
      <my-el-breadcrumb level1="商品管理" level2="分类参数"></my-el-breadcrumb>

      <!-- 文字提示 -->
      <el-alert
        class="alert"
        title="只允许为第三级分类设置参数"
        type="error"
        :closable="false"
      >
      </el-alert>

      <el-form class="my-form" label-position="right">
        <el-form-item label="商品分类">
          <el-cascader
            v-model="selectedoptions"
            :options="categories"
            :props="defaultProps"
            :show-all-levels="false"
            clearable
            filterable
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <!-- 标签页 -->
      <el-tabs v-model="tabActiveName" type="card" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="dynamic">
          <el-button type="danger" @click="showAddDyParams"
            >添加动态参数</el-button
          >
          <!-- 参数表格 -->
          <el-table :data="arrDyParams" height="350px">
            <el-table-column label="#" type="expand" width="80">
              <template slot-scope="scope">
                <el-tag
                  :key="i"
                  v-for="(tag, i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(scope.row, tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 属性名称 -->
            <el-table-column label="属性名称" prop="attr_name" width="300">
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-row>
                  <!-- 编辑参数 -->
                  <el-button
                    size="mini"
                    plain
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="showEditDyParamsDia(scope.row)"
                  ></el-button>

                  <!-- 删除参数 -->
                  <el-button
                    size="mini"
                    plain
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="deleteDyParams(scope.row)"
                  ></el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态参数 -->
        <el-tab-pane label="动态参数" name="static">
          <el-button type="danger" @click="showAddStaticParams"
            >添加静态参数</el-button
          >
          <!-- 参数表格 -->
          <el-table :data="arrStaticParams" height="350px">
            <!-- # -->
            <el-table-column label="#" type="index" width="80">
            </el-table-column>
            <!-- 属性名称 -->
            <el-table-column label="属性名称" prop="attr_name" width="300">
            </el-table-column>
            <!-- 属性值 -->
            <el-table-column label="属性值" prop="attr_vals" width="300">
            </el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-row>
                  <!-- 编辑参数 -->
                  <el-button
                    size="mini"
                    plain
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="showEditStaticParamsDia(scope.row)"
                  ></el-button>

                  <!-- 删除参数 -->
                  <el-button
                    size="mini"
                    plain
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="deleteStaticParams(scope.row)"
                  ></el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加动态参数对话框 -->
      <el-dialog title="添加动态参数" :visible.sync="addDyParamsDia">
        <el-form :model="dyParamsForm" label-width="100px">
          <el-form-item label="参数名称">
            <el-input
              v-model="dyParamsForm.attr_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="参数值">
            <el-input
              v-model="dyParamsForm.attr_vals"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-alert
            class="alert"
            title="设置多个参数值时，需要用英文半角逗号隔开。"
            type="error"
            center
            :closable="false"
          >
          </el-alert>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDyParamsDia = false">取 消</el-button>
          <el-button type="primary" @click="addDyParams()">添加</el-button>
        </div>
      </el-dialog>

      <!-- 添加静态参数对话框 -->
      <el-dialog title="添加属性" :visible.sync="addStaticParamsDia">
        <el-form :model="staticParamsForm" label-width="100px">
          <el-form-item label="属性名称">
            <el-input
              v-model="staticParamsForm.attr_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="属性值">
            <el-input
              v-model="staticParamsForm.attr_vals"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addStaticParamsDia = false">取 消</el-button>
          <el-button type="primary" @click="addStaticParams()">添加</el-button>
        </div>
      </el-dialog>

      <!-- 编辑动态参数对话框 -->
      <el-dialog title="编辑动态参数" :visible.sync="editDyParamsDia">
        <el-form :model="currentParams" label-width="100px">
          <el-form-item label="参数名称">
            <el-input
              v-model="currentParams.attr_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="参数值">
            <el-input
              v-model="currentParams.attr_vals"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-alert
            class="alert"
            title="设置多个参数值时，需要用英文半角逗号隔开。"
            type="error"
            center
            :closable="false"
          >
          </el-alert>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDyParamsDia = false">取 消</el-button>
          <el-button type="primary" @click="editDyParams()">保存</el-button>
        </div>
      </el-dialog>

      <!-- 编辑静态参数对话框 -->
      <el-dialog title="编辑属性" :visible.sync="editStaticParamsDia">
        <el-form :model="currentParams" label-width="100px">
          <el-form-item label="属性名称">
            <el-input
              v-model="currentParams.attr_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="属性值">
            <el-input
              v-model="currentParams.attr_vals"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editStaticParamsDia = false">取 消</el-button>
          <el-button type="primary" @click="editStaticParams()">保存</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 级联选择器相关数据
      selectedoptions: [], // 级联选择器的值
      categories: [], // 商品分类数据
      defaultProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }, // 级联选择器的默认配置信息

      arrDyParams: [], // 动态参数数据
      arrStaticParams: [], // 静态参数数据
      addDyParamsDia: false, // 添加动态参数对话框显示与否
      addStaticParamsDia: false, // 添加静态参数对话框显示与否
      dyParamsForm: {}, // 添加动态参数表单
      staticParamsForm: {}, // 添加静态参数表单
      editDyParamsDia: false, // 编辑动态参数对话框显示与否
      editStaticParamsDia: false, // 编辑静态参数对话框显示与否
      currentParams: {
        attr_vals: '',
        attr_name: ''
      }, // 当前编辑参数

      // 便签页面相关数据
      tabActiveName: 'dynamic'
    }
  },

  created () {
    this.getCategories()
  },

  methods: {
    // 获取商品分类列表数据
    getCategories () {
      this.$axios.get('categories', { params: { type: 3 } }).then(res => {
        let {
          data,
          meta: { status }
        } = res.data
        if (status === 200) {
          this.categories = data
        }
      })
    },

    // 级联选择器改变 ——> 获取动态参数
    handleChange () {
      if (this.tabActiveName === 'dynamic') {
        this.getDyParams()
      } else if (this.tabActiveName === 'static') {
        this.getStaticParams()
      }
    },

    // tab 切换时触发该方法
    handleClick () {
      if (this.tabActiveName === 'dynamic') {
        this.getDyParams()
      } else if (this.tabActiveName === 'static') {
        this.getStaticParams()
      }
    },

    // 删除参数标签
    handleClose (params, tag) {
      params.attr_vals.splice(params.attr_vals.indexOf(tag), 1)
      this.$axios
        .put(`categories/${params.cat_id}/attributes/${params.attr_id}`, {
          attr_name: params.attr_name,
          attr_sel: 'many',
          attr_vals: params.attr_vals.join(',')
        })
        .then(res => {
          let status = res.data.meta.status
          if (status === 200) {
            console.log('success')
          } else if (status === 401) {
            this.$message.warning(
              '初步判断是后台接口出现问题了！导致' + res.data.meta.msg
            )
          } else {
            this.$message.warning(res.data.meta.msg)
          }
        })
    },

    // 获取动态参数
    getDyParams () {
      if (this.selectedoptions.length === 3) {
        this.$axios
          .get(`categories/${this.selectedoptions[2]}/attributes`, {
            params: { sel: 'many' }
          })
          .then(res => {
            let {
              data,
              meta: { status }
            } = res.data
            if (status === 200) {
              data.forEach(item => {
                item.attr_vals =
                  item.attr_vals.length === 0
                    ? []
                    : item.attr_vals.trim().split(',')
                item.inputVisible = false
                item.inputValue = ''
              })
              this.arrDyParams = data
            }
          })
      } else if (this.selectedoptions.length === 0) {
        this.arrDyParams = []
        this.$message.error('请先选择三级分类！')
      }
    },

    // 获取静态参数
    getStaticParams () {
      if (this.selectedoptions.length === 3) {
        this.$axios
          .get(`categories/${this.selectedoptions[2]}/attributes`, {
            params: { sel: 'only' }
          })
          .then(res => {
            let {
              data,
              meta: { status }
            } = res.data
            if (status === 200) {
              data.forEach(item => {
                item.inputVisible = false
                item.inputValue = ''
              })
              this.arrStaticParams = data
            }
          })
      } else if (this.selectedoptions.length === 0) {
        this.arrStaticParams = []
        this.$message.error('请先选择三级分类！')
      }
    },

    // 显示输入标签输入框
    showInput (params) {
      params.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 添加标签触发该事件（在标签输入框回车或输入框失去焦点）
    handleInputConfirm (params) {
      let inputValue = params.inputValue
      if (inputValue) {
        params.attr_vals.push(inputValue)
        this.$axios
          .put(`categories/${params.cat_id}/attributes/${params.attr_id}`, {
            attr_name: params.attr_name,
            attr_sel: 'many',
            attr_vals: params.attr_vals.join(',')
          })
          .then(res => {
            let status = res.data.meta.status
            if (status === 200) {
              console.log('success')
            } else if (status === 401) {
              this.$message.warning(
                '初步判断是后台接口出现问题了！导致' + res.data.meta.msg
              )
            } else {
              this.$message.warning(res.data.meta.msg)
            }
          })
      }
      params.inputVisible = false
      params.inputValue = ''
    },

    // 提交编辑动态参数
    editDyParams () {
      this.editDyParamsDia = false
      this.$axios
        .put(
          `categories/${this.currentParams.cat_id}/attributes/${this.currentParams.attr_id}`,
          {
            attr_name: this.currentParams.attr_name,
            attr_sel: 'many',
            attr_vals: this.currentParams.attr_vals
          }
        )
        .then(res => {
          let status = res.data.meta.status
          if (status === 200) {
            console.log('success')
          } else if (status === 401) {
            this.arrDyParams.forEach(item => {
              if (item.attr_id === this.currentParams.attr_id) {
                item.attr_vals = this.currentParams.attr_vals.split(',')
                item.attr_name = this.currentParams.attr_name
              }
            })
            this.$message.warning(
              '初步判断是后台接口出现问题了！导致' + res.data.meta.msg
            )
          } else {
            this.$message.warning(res.data.meta.msg)
          }
        })
    },

    // 提交编辑静态参数
    editStaticParams () {
      this.editStaticParamsDia = false
      this.$axios
        .put(
          `categories/${this.currentParams.cat_id}/attributes/${this.currentParams.attr_id}`,
          {
            attr_name: this.currentParams.attr_name,
            attr_sel: 'only',
            attr_vals: this.currentParams.attr_vals
          }
        )
        .then(res => {
          let status = res.data.meta.status
          if (status === 200) {
            console.log('success')
          } else if (status === 401) {
            this.arrStaticParams.forEach(item => {
              if (item.attr_id === this.currentParams.attr_id) {
                item.attr_vals = this.currentParams.attr_vals
                item.attr_name = this.currentParams.attr_name
              }
            })
            this.$message.warning(
              '初步判断是后台接口出现问题了！导致' + res.data.meta.msg
            )
          } else {
            this.$message.warning(res.data.meta.msg)
          }
        })
    },

    // 显示编辑动态参数对话框
    showEditDyParamsDia (params) {
      this.currentParams.attr_id = params.attr_id
      this.currentParams.cat_id = params.cat_id
      this.currentParams.attr_name = params.attr_name
      this.currentParams.attr_vals = params.attr_vals.join(',')
      this.editDyParamsDia = true
    },

    // 显示编辑静态参数对话框
    showEditStaticParamsDia (params) {
      this.currentParams.attr_id = params.attr_id
      this.currentParams.cat_id = params.cat_id
      this.currentParams.attr_name = params.attr_name
      this.currentParams.attr_vals = params.attr_vals
      this.editStaticParamsDia = true
    },

    // 删除动态参数
    deleteDyParams (params) {
      this.$confirm('是否删除该参数?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .delete(`categories/${params.cat_id}/attributes/${params.attr_id}`)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message.success('删除成功!')
                let index = this.arrDyParams.findIndex(item => {
                  return item.attr_id === params.attr_id
                })
                this.arrDyParams.splice(index, 1)
              } else {
                this.$message.error('删除失败！')
              }
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },

    // 删除静态参数
    deleteStaticParams (params) {
      this.$confirm('是否删除该属性?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .delete(`categories/${params.cat_id}/attributes/${params.attr_id}`)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message.success('删除成功!')
                let index = this.arrStaticParams.findIndex(item => {
                  return item.attr_id === params.attr_id
                })
                this.arrStaticParams.splice(index, 1)
              } else {
                this.$message.error('删除失败！')
              }
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },

    // 显示添加动态参数对话框
    showAddDyParams () {
      if (this.selectedoptions.length !== 3) {
        this.$message.warning('请先选择三级分类！')
      } else {
        this.addDyParamsDia = true
      }
    },

    // 显示添加静态参数对话框
    showAddStaticParams () {
      if (this.selectedoptions.length !== 3) {
        this.$message.warning('请先选择三级分类！')
      } else {
        this.addStaticParamsDia = true
      }
    },

    // 添加动态参数
    addDyParams () {
      if (!this.dyParamsForm.attr_name) {
        this.$message.warning('请填写参数名称！')
      } else if (!this.dyParamsForm.attr_vals) {
        this.$message.warning('请填写参数值！')
      } else {
        let index = this.arrDyParams.findIndex(item => {
          return item.attr_name === this.dyParamsForm.attr_name
        })
        if (index >= 0) {
          this.$message.error('参数名已存在列表！')
        } else {
          let arr = []
          this.dyParamsForm.attr_vals.split(',').forEach(item => {
            if (item.trim() !== '') {
              arr.push(item.trim())
            }
          })
          this.dyParamsForm.attr_vals = arr.join(',')
          this.dyParamsForm.attr_sel = 'many'
          this.$axios
            .post(
              `categories/${this.selectedoptions[2]}/attributes`,
              this.dyParamsForm
            )
            .then(res => {
              let {
                meta: { status }
              } = res.data
              if (status === 201) {
                this.$message.success('添加动态参数成功！')
                this.dyParamsForm = {}
                this.addDyParamsDia = false
                this.getDyParams()
              }
            })
        }
      }
    },

    // 添加属性
    addStaticParams () {
      if (!this.staticParamsForm.attr_name) {
        this.$message.warning('请填写属性名称！')
      } else if (!this.staticParamsForm.attr_vals) {
        this.$message.warning('请填写属性值！')
      } else {
        let index = this.arrStaticParams.findIndex(item => {
          return item.attr_name === this.staticParamsForm.attr_name
        })
        if (index >= 0) {
          this.$message.error('属性名已存在列表！')
        } else {
          this.staticParamsForm.attr_sel = 'only'
          console.log(this.staticParamsForm)
          this.$axios
            .post(
              `categories/${this.selectedoptions[2]}/attributes`,
              this.staticParamsForm
            )
            .then(res => {
              let {
                meta: { msg, status }
              } = res.data
              if (status === 201) {
                this.$message.success('添加属性成功！')
                this.staticParamsForm = {}
                this.addStaticParamsDia = false
                this.getStaticParams()
              } else {
                this.$message.error(msg)
              }
            })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-form {
  margin-top: 20px;
}
.el-tag {
  margin-bottom: 5px;
  margin-right: 10px;
}
.el-tag + .el-tag {
  margin-right: 10px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
