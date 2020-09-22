<template>
  <div class="app-container">
    <el-tree
      :data="menuData"
      :props="props"
      node-key="uuid"
      default-expand-all
      :expand-on-click-node="false"
      :highlight-current="true"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => edit(data)"
          >
            Edit
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)"
          >
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>
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
      props: {
        label: 'menuName',
        children: 'childMenu'
      },
      menuData: [],
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
        this.menuData = JSON.parse(JSON.stringify(response.data.items))
      })
    },
    edit(data) {
      this.pdata = data
      this.dialog.title = '编辑菜单'
      this.editSysMenuDialog = true
    },
    append(data) {
      // const newChild = { menuPid: data.uuid, menuName: '', childMenu: [] }
      // data.childMenu.push(newChild)
      const param = {}
      param.menuPid = data.uuid
      param.level = parseInt(data.level) + 1
      if (data.uuid === '0') {
        param.isLeaf = '0'
      } else {
        param.isLeaf = '1'
      }
      this.pdata = param
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
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
  }
</style>
