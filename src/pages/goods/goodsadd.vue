<template>
  <div class="goodsadd">
    <el-card class="box-card">
      <!-- 面包屑 -->
      <my-el-breadcrumb level1="商品管理" level2="商品添加"></my-el-breadcrumb>

      <!-- 文字提示 -->
      <el-alert
        class="alert"
        title="添加商品信息"
        type="success"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="1 * active - 1"
        finish-status="success"
        align-center
        style="margin-top: 20px"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>

      <el-form
        label-position="right"
        label-width="110px"
        :model="goodsForm"
        style="height: 450px; overflow: auto;"
      >
        <!-- 标签页 -->
        <el-tabs
          v-model="active"
          tab-position="left"
          style="margin-top: 30px"
          @tab-click="tabChange()"
        >
          <!-- 添加商品 —— 基本信息 -->
          <el-tab-pane name="1" label="基本信息">
            <el-form-item label="商品名称">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="goodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="goodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="goodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="goodsForm.goods_cat"
                :options="categories"
                :props="defaultProps"
                clearable
                filterable
                @change="handleChange"
                style="width: 280px"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 添加商品 —— 商品参数 -->
          <el-tab-pane name="2" label="商品参数">
            <el-form-item
              v-for="(item, i) in arrDyParams"
              :key="i"
              :label="item.attr_name + '：'"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(item2, index2) in item.attr_vals"
                  :key="index2"
                  :label="item2"
                  :name="item2"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 添加商品 —— 商品属性 -->
          <el-tab-pane name="3" label="商品属性">
            <el-form-item
              v-for="(item, index) in arrStaticParams"
              :key="index"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- 添加商品 —— 商品图片 -->
          <el-tab-pane name="4" label="商品图片">
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              accept="image/jpg, image/jpeg, image/png"
            >
              <el-button size="medium" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>

          <!-- 添加商品 —— 商品内容 -->
          <el-tab-pane name="5" label="商品内容">
            <el-button type="primary" @click="addGoods">添加商品</el-button>
            <quill-editor
              class="my-quill-editor"
              v-model="goodsForm.goods_introduce"
            ></quill-editor>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入富文本编辑器样式文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入富文本编辑器组件
import { quillEditor } from 'vue-quill-editor'
export default {
  data () {
    return {
      active: '1', // 标签页序号
      goodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        attrs: [],
        goods_introduce: ''
      }, // 添加商品的表单
      //   级联选择器相关数据
      categories: [], // 商品分类数据
      defaultProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }, // 级联选择器的默认配置信息
      //   商品参数页面相关数据
      arrDyParams: [], // 动态参数数据
      arrStaticParams: [], // 静态参数数据
      hasStaticParams: false, // 是否已经获取静态参数
      headers: {
        Authorization: localStorage.getItem('token')
      } // 上传图片请求头部
    }
  },
  components: {
    quillEditor
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

    // 添加商品的级联选择器改变时触发该事件
    handleChange () {
      this.hasStaticParams = false
    },

    // 标签页标签发生改变时触发
    tabChange () {
      if (typeof this.goodsForm.goods_cat === 'string') {
        this.goodsForm.goods_cat = this.goodsForm.goods_cat
          .split(',')
          .map(item => {
            return Number(item)
          })
      }
      if (this.active === '2') {
        // 获取并处理商品参数
        if (this.goodsForm.goods_cat.length === 0) {
          return this.$message.error('请先选择商品分类（基本信息->商品分类）')
        } else {
          let goodsCat = this.goodsForm.goods_cat
          let cid = goodsCat[goodsCat.length - 1]
          this.$axios
            .get(`categories/${cid}/attributes`, { params: { sel: 'many' } })
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
                })
                this.arrDyParams = data
              }
            })
        }
      } else if (this.active === '3') {
        // 获取并处理商品属性
        if (this.goodsForm.goods_cat.length === 0) {
          return this.$message.error('请先选择商品分类（基本信息->商品分类）')
        } else if (this.hasStaticParams === false) {
          let goodsCat = this.goodsForm.goods_cat
          let cid = goodsCat[goodsCat.length - 1]
          this.$axios
            .get(`categories/${cid}/attributes`, { params: { sel: 'only' } })
            .then(res => {
              let {
                data,
                meta: { status }
              } = res.data
              if (status === 200) {
                this.hasStaticParams = true
                this.arrStaticParams = data
              }
            })
        }
      }
    },

    // 图片移除时触发该方法
    handleRemove (file, filelist) {
      let index = this.goodsForm.pics.findIndex(item => {
        return item.pic === file.response.tmp_path
      })
      this.goodsForm.pics.splice(index, 1)
    },

    // 图片上传成功时触发该事件
    handleSuccess (file) {
      this.goodsForm.pics.push({
        pic: file.data.tmp_path
      })
    },

    // 添加商品请求
    addGoods () {
      let arr1 = this.arrDyParams.map(item => {
        return {
          attr_id: item.attr_id,
          attr_vals: item.attr_vals
        }
      })
      let arr2 = this.arrStaticParams.map(item => {
        return {
          attr_id: item.attr_id,
          attr_vals: item.attr_vals
        }
      })
      this.goodsForm.attrs = [...arr1, ...arr2]

      if (typeof this.goodsForm.goods_cat === 'string') {
        this.goodsForm.goods_cat = this.goodsForm.goods_cat
          .split(',')
          .map(item => {
            return Number(item)
          })
      }
      if (!this.goodsForm.goods_name) {
        this.$message.warning('请填写商品名称（基本信息 -> 商品名称）')
      } else if (!this.goodsForm.goods_price) {
        this.$message.warning('请填写商品价格（基本信息 -> 商品价格')
      } else if (!this.goodsForm.goods_weight) {
        this.$message.warning('请填写商品重量（基本信息 -> 商品重量')
      } else if (!this.goodsForm.goods_number) {
        this.$message.warning('请填写商品数量（基本信息 -> 商品数量）')
      } else if (this.goodsForm.goods_cat.length === 0) {
        this.$message.warning('请选择商品分类（基本信息 -> 商品分类）')
      } else {
        this.goodsForm.goods_cat = this.goodsForm.goods_cat.join(',')
        this.$axios.post('goods', this.goodsForm).then(res => {
          let {
            meta: { msg, status }
          } = res.data
          console.log(res)
          if (status === 201) {
            this.$message.success(msg)
            this.$router.push({ name: 'goodslist' })
          } else {
            this.goodsForm.goods_cat = this.goodsForm.goods_cat
              .split(',')
              .map(item => {
                return Number(item)
              })
            this.$message.error(msg)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.goodsadd {
  .el-checkbox {
    margin-right: 10px;

    &.is-bordered + .el-checkbox.is-bordered {
      margin-left: 0;
      margin-right: 10px;
    }
  }

  .el-upload__tip {
    padding: 5px 0;
  }

  .my-quill-editor {
    margin-top: 10px;
    height: 350px;
    border-bottom: 1px solid #cccccc;
  }
}
</style>
