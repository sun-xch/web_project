<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <el-card shadow="hover">
          <el-table
            v-loading="listLoading"
            :data="list"
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
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-tree
            ref="treeList"
            :data="menuData"
            show-checkbox
            :props="props"
            node-key="uuid"
            default-expand-all
            :expand-on-click-node="false"
            :highlight-current="true"
          >
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRoleList } from '@/api/role'
import { getMenuAndBindRole } from '@/api/menu'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      props: {
        label: 'menuName',
        children: 'childMenu'
      },
      menuData: []
    }
  },
  created() {
    this.getRoleList()
    this.getMenuAndBindRole()
  },
  methods: {
    getRoleList() {
      this.listLoading = true
      getRoleList({}).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    getMenuAndBindRole() {
      const param = {}
      param.roleId = '1'
      getMenuAndBindRole(param).then(response => {
        this.menuData = JSON.parse(JSON.stringify(response.data.items))
        const checkArr = []
        this.menuData.forEach(function(item, index) {
          if (item.childMenu.length > 0) {
            item.childMenu.forEach(function(itemChild, index) {
              if (itemChild.roleMenuId) {
                checkArr.push(itemChild.uuid)
              }
            })
          }
          if (item.roleMenuId) {
            checkArr.push(item.uuid)
          }
        })
        this.$refs.treeList.setCheckedKeys(checkArr)
      })
    }
  }
}
</script>
