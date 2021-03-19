<template>
  <div class="goods">
    <el-card class="box-card">
      <!-- 面包屑 -->
      <my-el-breadcrumb level1="商品管理" level2="商品列表"></my-el-breadcrumb>

      <!-- 搜索框和添加商品按钮 -->
      <el-row class="searchRow">
        <el-col>
          <el-input
            placeholder="请输入内容"
            v-model="searchVal"
            clearable
            class="input-with-select inputSearch"
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoods()"
            ></el-button>
          </el-input>
          <el-button type="success" @click="addGoodsDia = true"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <!-- 商品列表表格 -->
      <el-table
        :data="goodslist"
        border
        style="width: 100%"
        :height="tableHeight"
      >
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="150">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量(g)"
          width="150"
        ></el-table-column>
        <el-table-column prop="addTime" label="创建日期" width="150">
          <template slot-scope="scope">
            {{ scope.row.add_time | fmtdata }}
          </template>
        </el-table-column>
        <!-- 商品列表 --》 操作 -->
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-row>
              <!-- 编辑商品 -->
              <el-button
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditGoodsDia(scope.row)"
              ></el-button>
              <!-- 删除商品 -->
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteGoods(scope.row.goods_id)"
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

      <!-- 添加商品对话框 -->
      <el-dialog title="添加商品" :visible.sync="addGoodsDia">
        <el-form :model="addGoodsForm">
          <el-form-item label="商品名称" label-width="100px">
            <el-input
              v-model="addGoodsForm.goods_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品价格(元)" label-width="100px">
            <el-input
              v-model="addGoodsForm.goods_price"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品重量(g)" label-width="100px">
            <el-input
              v-model="addGoodsForm.goods_weight"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addGoodsDia = false">取 消</el-button>
          <el-button type="primary" @click="addGoods()">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑商品对话框 -->
      <el-dialog title="编辑用户信息" :visible.sync="editGoodsDia">
        <el-form :model="editGoodsForm">
          <el-form-item label="商品名称" label-width="100px">
            <el-input
              v-model="editGoodsForm.goods_name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品价格(元)" label-width="100px">
            <el-input
              v-model="editGoodsForm.goods_price"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品重量(g)" label-width="100px">
            <el-input
              v-model="editGoodsForm.goods_weight"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editGoodsDia = false">取 消</el-button>
          <el-button type="primary" @click="editGoods()">保存</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableHeight: 500, // 角色列表表格的高度
      searchVal: '', // 搜索内容
      addGoodsDia: false, // 添加商品对话框显示与否
      editGoodsDia: false, // 编辑商品对话框显示与否
      addGoodsForm: {}, // 添加商品表单
      editGoodsForm: {}, // 编辑商品表单
      goodslist: [],
      // 分页相关数据
      pagenum: 1, // 页码
      pagesize: 10, // 每页显示的用户数据条数
      total: 0, // 总数据条数
      pageSizes: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100, 200, 500, 1000], // 每页显示条数数组
      currentPage: 1 // 前往第几页
    }
  },

  created () {
    this.tableHeight = window.innerHeight - 280
    this.getGoodsList()
  },

  methods: {
    // 获取商品列表
    getGoodsList () {
      this.$axios
        .get(
          `goods?query=${this.searchVal}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
        )
        .then(res => {
          let {
            data,
            meta: { status }
          } = res.data
          if (status) {
            this.goodslist = data.goods
            console.log(this.goodslist)
            this.total = data.total
            this.$message.success('获取商品列表成功！')
          } else {
            this.$message.error('获取数据失败！')
          }
        })
    },

    // 搜索商品列表
    searchGoods () {
      if (this.searchVal.trim()) {
        this.getGoodsList()
      }
    },

    // 改变每页显示条数触发该事件
    handleSizeChange (val) {
      this.pagesize = val
      this.getGoodsList()
    },

    // 该条页数跳转时触发该事件
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodsList()
    },

    // 添加商品
    addGoods () {
      this.$axios.post('add/goods', this.addGoodsForm).then(res => {
        console.log(res.data)
        if (res.data.code === 200) {
          this.$message.success('添加商品成功！')
          this.getGoodsList()
          this.addGoodsDia = false
          this.addGoodsForm = {}
        } else if (res.data.code === 100) {
          this.$message.error('添加商品失败，该商品已存在！')
        }
      })
    },

    // 删除商品
    deleteGoods (id) {
      this.$confirm('是否删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.delete(`goods/${id}`).then(res => {
            if (res.data.meta.status === 200) {
              this.getGoodsList()
              this.$message.success('删除成功!')
            } else {
              this.$message.error('删除失败！')
            }
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },

    // 显示编辑商品对话框
    showEditGoodsDia (goods) {
      this.editGoodsForm = goods
      this.editGoodsDia = true
    },

    // 编辑商品
    editGoods () {
      let { gid, goodsName, goodsPrice, goodsWeight } = this.editGoodsForm
      this.$axios
        .get(`edit/goods/${gid}`, {
          params: { goodsName, goodsPrice, goodsWeight }
        })
        .then(
          res => {
            this.$message.success('修改商品信息成功！')
            this.editGoodsDia = false
            this.getGoodsList()
          },
          err => {
            if (err) {
              this.$message.error('修改商品信息失败！')
            }
          }
        )
    }
  }
}
</script>

<style lang="less" scoped>
.goods {
  .searchRow {
    margin-bottom: 20px;
    .inputSearch {
      width: 300px;
    }
  }
}
</style>
