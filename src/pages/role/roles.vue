<template>
  <div class="roles">
    <el-card class="box-card">
      <!-- 面包屑 -->
      <my-el-breadcrumb level1="权限管理" level2="角色列表"></my-el-breadcrumb>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-button class="addroles" @click="showAddRoleDia()"
          >添加角色</el-button
        >
      </el-row>

      <!-- 角色列表表格 -->
      <el-table
        class="rolelist-table"
        :data="rolelist"
        style="width: 100%"
        :height="tableHeight"
      >
        <el-table-column type="expand">
          <template slot-scope="rolelist">
            <el-row
              v-for="(item1, index1) in rolelist.row.children"
              :key="index1"
              class="my-row-lg"
            >
              <el-col :span="4">
                <el-tag
                  closable
                  @close="deleteRoleRight(rolelist.row, item1.id)"
                >
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="index2"
                  class="my-row"
                >
                  <el-col :span="4">
                    <el-tag
                      closable
                      type="success"
                      @close="deleteRoleRight(rolelist.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      v-for="(item3, index3) in item2.children"
                      :key="index3"
                      closable
                      type="warning"
                      class="my-tag"
                      @close="deleteRoleRight(rolelist.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- 未分配权限 -->
            <div v-if="rolelist.row.children.length === 0">未分配权限</div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="200">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="400">
        </el-table-column>
        <!-- 角色列表 --》 操作 -->
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-row>
              <!-- 编辑角色 -->
              <el-button
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditRoleDialogVisible(scope.row)"
              ></el-button>
              <!-- 删除角色 -->
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteRole(scope.row.id)"
              ></el-button>
              <!-- 分配角色权限 -->
              <el-button
                size="mini"
                plain
                type="success"
                icon="el-icon-check"
                circle
                @click="showSetRightDia(scope.row)"
              ></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible">
        <el-form :model="addRoleForm">
          <el-form-item label="角色名称" label-width="100px">
            <el-input
              v-model="addRoleForm.roleName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" label-width="100px">
            <el-input
              v-model="addRoleForm.roleDesc"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole()">添加</el-button>
        </div>
      </el-dialog>

      <!-- 修改权限对话框 -->
      <el-dialog title="修改权限" :visible.sync="setRightDialogVisible">
        <el-tree
          ref="tree"
          :data="rightTreeData"
          show-checkbox
          node-key="id"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :props="defaultProps"
        >
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRoleRight()">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑角色话框 -->
      <el-dialog title="编辑角色信息" :visible.sync="editRoleDialogVisible">
        <el-form :model="currentRoles">
          <el-form-item label="角色名称" label-width="100px">
            <el-input
              v-model="currentRoles.roleName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" label-width="100px">
            <el-input
              v-model="currentRoles.roleDesc"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="alterRole()">保存</el-button>
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
      rolelist: [], // 角色列表
      addRoleDialogVisible: false, // 添加角色对话框显示与否
      setRightDialogVisible: false, // 修改角色权限对话框显示与否
      editRoleDialogVisible: false, // 编辑角色对话框显示与否
      currentRoles: {}, // 当前编辑/选中角色
      rightTreeData: [], // 权限树的数据
      defaultExpandedKeys: [], // 默认展开的节点 id
      defaultCheckedKeys: [], // 默认选中的节点的 id
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      addRoleForm: {}
    }
  },

  created () {
    this.tableHeight = window.innerHeight - 250
    this.getRoleList()
  },

  methods: {
    // 获取角色列表
    getRoleList () {
      // 查询所有角色列表
      this.$axios.get('roles').then(res => {
        let {
          data,
          meta: { status }
        } = res.data
        if (status === 200) {
          this.rolelist = data
        } else {
          this.$message.error('获取角色列表失败！')
        }
      })
    },

    // 取消角色权限
    deleteRoleRight (role, rightId) {
      this.$axios.delete(`roles/${role.id}/rights/${rightId}`).then(res => {
        let {
          data,
          meta: { status }
        } = res.data
        if (status === 200) {
          this.$message.success('取消角色权限成功！')
          role.children = data
        }
      })
    },

    // 显示角色权限列表
    showSetRightDia (role) {
      this.$axios.get('rights/tree').then(res => {
        let {
          data,
          meta: { status }
        } = res.data
        if (status === 200) {
          this.rightTreeData = data
          let defaultCheckedKeys = []
          let defaultExpandedKeys = []
          role.children.forEach(item => {
            defaultExpandedKeys.push(item.id)
            item.children.forEach(item => {
              defaultExpandedKeys.push(item.id)
              item.children.forEach(item => {
                defaultCheckedKeys.push(item.id)
              })
            })
          })
          this.defaultCheckedKeys = defaultCheckedKeys
          this.defaultExpandedKeys = defaultExpandedKeys
          this.setRightDialogVisible = true
          this.currentRoles = role
        }
      })
    },

    // 显示编辑角色对话框
    showEditRoleDialogVisible (role) {
      this.currentRoles = role
      this.editRoleDialogVisible = true
    },

    // 编辑角色
    alterRole () {
      this.$axios
        .put(`roles/${this.currentRoles.id}`, this.currentRoles)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message.success('编辑角色成功！')
            this.editRoleDialogVisible = false
          }
        })
    },

    // 删除角色
    deleteRole (id) {
      this.$confirm('是否删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.delete(`roles/${id}`).then(res => {
            let status = res.data.meta.status
            if (status === 200) {
              this.getRoleList()
              this.$message.success('删除角色成功！')
            } else {
              this.$message.error('删除失败！')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 更新角色权限
    setRoleRight () {
      let list = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys())
      this.$axios
        .post(`roles/${this.currentRoles.id}/rights`, {
          rids: list.join(',')
        })
        .then(res => {
          if (res.data.meta.status === 200) {
            this.getRoleList()
            this.$message.success('操作角色权限成功！')
            this.setRightDialogVisible = false
          }
        })
    },

    // 显示添加角色对话框
    showAddRoleDia () {
      this.addRoleDialogVisible = true
    },

    // 添加角色
    addRole () {
      if (!this.addRoleForm.roleName) {
        this.$message.warning('角色名称不能为空！')
      } else if (!this.addRoleForm.roleDesc) {
        this.$message.warning('角色描述不能为空！')
      } else {
        let isExit = false
        for (let index = 0; index < this.rolelist.length; index++) {
          if (this.rolelist[index].roleName === this.addRoleForm.roleName) {
            isExit = true
            this.$message.error('角色名称已存在！')
            break
          }
        }
        if (!isExit) {
          this.$axios.post('roles', this.addRoleForm).then(res => {
            let status = res.data.meta.status
            if (status === 201) {
              this.$message.success('角色添加成功！')
              this.addRoleForm = {}
              this.getRoleList()
              this.addRoleDialogVisible = false
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.roles {
  .rolelist-table {
    margin-top: 10px;

    .my-row-lg {
      margin-bottom: 8px;
    }
    .my-row {
      margin-bottom: 2px;
    }
    .my-tag {
      margin-right: 10px;
      margin-bottom: 1px;
    }
  }
}
</style>
