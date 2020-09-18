<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-card shadow="hover">
          <el-tree
            ref="treeList"
            :data="menuData"
            :props="props"
            node-key="uuid"
            default-expand-all
            :expand-on-click-node="false"
            :highlight-current="true"
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
          <el-form ref="menuForm" :model="menuForm" :rules="menuFormRules" label-width="80px" size="mini">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model.trim="menuForm.menuName" />
            </el-form-item>
            <el-form-item label="菜单代码" prop="code">
              <el-input v-model.trim="menuForm.code" />
            </el-form-item>
            <el-form-item label="路径资源" prop="url">
              <el-input v-model.trim="menuForm.url" />
            </el-form-item>
            <el-form-item label="父级菜单" prop="menuPid">
              <el-select v-model="menuForm.menuPid" filterable clearable placeholder="请选择父级菜单" style="width: 100%;">
                <el-option
                  v-for="item in pidList"
                  :key="item.uuid"
                  :label="item.menuName"
                  :value="item.uuid"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-input v-model.trim="menuForm.icon" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="menuForm.sort" :min="1" :max="1000" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model.trim="menuForm.description" />
            </el-form-item>
            <el-form-item right>
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <el-button>取消</el-button>
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
      menuForm: {},
      menuFormRules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入菜单代码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入资源路径', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        menuPid: [
          { required: true, message: '请选择父级菜单', trigger: 'blur' }
        ],
        icon: [
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        description: [
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ]
      },
      pidList: []
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
      const newChild = { menuPid: data.uuid, menuName: '', childMenu: [] }
      data.childMenu.push(newChild)
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.childMenu || parent.data
      const index = children.findIndex(d => d.uuid === data.uuid)
      children.splice(index, 1)
    },
    handleNodeClick(data) {
      this.menuForm = data
      console.log(this.$refs.treeList.getCurrentKey())
    },
    getMenu() {
      getMenu({}).then(response => {
        this.pidList = response.data.items
      })
    },
    onSubmit() {

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
