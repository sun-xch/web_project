<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-card shadow="hover">
          <el-tree
            :data="menuData"
            :props="props"
            node-key="uuid"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
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
        </el-card>
      </el-col>
      <el-col :span="12">
          <el-card shadow="hover">
            <el-form ref="menuForm" :model="menuForm" label-width="80px" size="mini">
            <el-form-item label="菜单名称">
                <el-input v-model="menuForm.menuName"></el-input>
            </el-form-item>
            <el-form-item label="菜单代码">
                <el-input v-model="menuForm.code"></el-input>
            </el-form-item>
            <el-form-item label="路径资源">
                <el-input v-model="menuForm.url"></el-input>
            </el-form-item>
            <el-form-item label="资源类型">
                <el-input v-model="menuForm.type"></el-input>
            </el-form-item>
            <el-form-item label="父级菜单">
                <el-select v-model="menuForm.menuPid" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图标">
                <el-input v-model="menuForm.icon"></el-input>
            </el-form-item>
            <el-form-item label="排序">
                <el-input v-model="menuForm.sort"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="menuForm.description"></el-input>
            </el-form-item>
            </el-form>
            </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAuthMenu, getMenu } from '@/api/menu'
export default {
  data() {
    return {
      props: {
        label: 'menuName',
        children: 'childMenu'
      },
      menuData: [],
      menuForm:{}
    }
  },
  created() {
    this.getAuthMenu()
    this.getMenu()
  },
  methods: {
    getAuthMenu() {
      getAuthMenu().then(response => {
        this.menuData = JSON.parse(JSON.stringify(response.data.items))
      })
    },
    append(data) {
      const newChild = { menuPid:data.uuid, menuName: '', childMenu: [] }
      data.childMenu.push(newChild);
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.childMenu || parent.data;
      const index = children.findIndex(d => d.uuid === data.uuid);
      children.splice(index, 1);
    },
    handleNodeClick(data) {
        this.menuForm = data
    },
    getMenu(){
       getMenu({}).then(response => {
        console.log(response)
      }) 
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
