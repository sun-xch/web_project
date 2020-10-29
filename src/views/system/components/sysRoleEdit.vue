<template>
  <div>
    <el-form ref="roleForm" :model="roleForm" :rules="roleFormRules" label-width="80px" size="mini">
      <el-form-item label="角色代码" prop="roleCode">
        <el-input v-model.trim="roleForm.roleCode" />
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model.trim="roleForm.roleName" />
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model.trim="roleForm.roleDesc" />
      </el-form-item>
      <el-form-item label="授权">
        <el-tree
          ref="treeList"
          :data="menuData"
          show-checkbox
          :props="props"
          node-key="uuid"
          :highlight-current="true"
        >
          <span slot-scope="{ node }" class="custom-tree-node">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </el-form-item>
      <el-form-item right>
        <el-button type="primary" @click="onSubmit('roleForm')">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMenuAndBindRole } from '@/api/menu'
import { saveRole } from '@/api/role'
export default {
  props: {
    // 获取父页面的参数
    pdata: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      props: {
        label: 'menuName',
        children: 'childMenu'
      },
      menuData: [],
      roleForm: {},
      roleFormRules: {
        roleCode: [
          { required: true, message: '请输入角色代码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function() {
    this.loadForm()
    this.getMenuAndBindRole()
  },
  methods: {
    loadForm() {
      this.roleForm = Object.assign({}, this.pdata)
    },
    getMenuAndBindRole() {
      const param = {}
      param.roleId = this.pdata.uuid
      getMenuAndBindRole(param).then(response => {
        this.menuData = JSON.parse(JSON.stringify(response.data.items))
        const checkArr = []
        this.menuListToTree(this.menuData,checkArr)
        this.$refs.treeList.setCheckedKeys(checkArr)
      })
    },
    menuListToTree(menuList,checkArr){
      if(menuList.length > 0){
        menuList.forEach(item => {
          if (item.roleMenuId) {
            checkArr.push(item.uuid)
          }
          if (item.childMenu.length > 0) {
            this.menuListToTree(item.childMenu,checkArr)
          }
        })
      }
    },
    onSubmit(formName) {
      this.roleForm.menuIds = this.$refs.treeList.getCheckedKeys()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveRole(this.roleForm).then(response => {
            if (response.code === 200) {
              this.$emit('hideDialog', true)
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }
          })
        }
      })
    },
    cancel() {
      this.$emit('hideDialog',false)
    }
  }
}
</script>
