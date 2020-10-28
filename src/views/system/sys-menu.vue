<template>
  <div class="app-container">

    <el-row type="flex" justify="end">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="append()">新增菜单</el-button>
    </el-row>
    <el-table
      :data="tableData"
      row-key="uuid"
      border
      default-expand-all
      :tree-props="{children: 'childMenu'}"
    >
      <el-table-column
        prop="menuName"
        label="名称"
      />
      <el-table-column
        prop="icon"
        label="图标"
      >
        <template slot-scope="scope">
          <i :class="scope.row.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.type === '0'"
            size="small"
          >目录</el-tag>
          <el-tag
            v-else-if="scope.row.type === '1'"
            size="small"
            type="success"
          >菜单</el-tag>
          <el-tag
            v-else-if="scope.row.type === '2'"
            size="small"
            type="info"
          >按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序号"
      />
      <el-table-column
        prop="url"
        label="路径"
      />
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
    <!-- 编辑菜单 -->
    <el-dialog :visible.sync="editSysMenuDialog" :title="dialog.title" :close-on-click-modal="false">
      <sysMenuEdit v-if="editSysMenuDialog" :pdata="pdata" @hideDialog="hideDialog" />
    </el-dialog>
  </div>
</template>

<script>
import sysMenuEdit from '@/views/system/components/sysMenuEdit.vue'
import { getAuthMenu } from '@/api/menu'
export default {
  components: {
    sysMenuEdit
  },
  data() {
    return {
      tableData: [],
      dialog: {
        title: ''
      },
      editSysMenuDialog: false,
      pdata: {}
    }
  },
  created() {
    this.getAuthMenu()
  },
  methods: {
    getAuthMenu() {
      getAuthMenu().then(response => {
        this.tableData = JSON.parse(JSON.stringify(response.data.items))
      })
    },
    edit(data) {
      this.pdata = data
      this.dialog.title = '编辑菜单'
      this.editSysMenuDialog = true
    },
    append() {
      this.pdata = {}
      this.dialog.title = '新增菜单'
      this.editSysMenuDialog = true
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.childMenu || parent.data
      const index = children.findIndex(d => d.uuid === data.uuid)
      children.splice(index, 1)
    },
    hideDialog() {
      this.editSysMenuDialog = false
    }
  }
}
</script>
