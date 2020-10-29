<template>
  <div class="app-container">
    <el-row type="flex" justify="end">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="append()">新增角色</el-button>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="index" />
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="角色代码">
        <template slot-scope="scope">
          {{ scope.row.roleCode }}
        </template>
      </el-table-column>
      <el-table-column label="角色描述">
        <template slot-scope="scope">
          {{ scope.row.roleDesc }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="edit(scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            size="small"
            @click="remove(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑角色 -->
    <el-dialog :visible.sync="editRoleDialog" :title="dialog.title" :close-on-click-modal="false">
      <sysRoleEdit v-if="editRoleDialog" :pdata="pdata" @hideDialog="hideDialog" />
    </el-dialog>
  </div>
</template>

<script>
import sysRoleEdit from '@/views/system/components/sysRoleEdit.vue'
import { getRoleList, deleteRole } from '@/api/role'
export default {
  components: {
    sysRoleEdit
  },
  data() {
    return {
      tableData: null,
      listLoading: true,
      dialog: {
        title: ''
      },
      editRoleDialog: false,
      pdata: {}
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      this.listLoading = true
      getRoleList({}).then(response => {
        this.tableData = response.data.items
        this.listLoading = false
      })
    },
    append() {
      this.pdata = {}
      this.dialog.title = '新增角色'
      this.editRoleDialog = true
    },
    edit(data) {
      this.pdata = data
      this.dialog.title = '编辑角色'
      this.editRoleDialog = true
    },
    remove(data){
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteRole(data).then(response => {
          this.getRoleList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })   
      }).catch(() => {
      })
    },
    hideDialog(data) {
      if (data) {
        this.getRoleList()
      }
      this.editRoleDialog = false
    }
  }
}
</script>
