<template>
  <div>
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
        <el-select v-model="menuForm.menuPid" ref="selectMenu" placeholder="请选择父级菜单" style="width: 100%;">
          <el-option :value="menuForm.menuPid" :label="parentMenuName" style="height:200px;overflow: auto;background-color:#fff">
            <el-tree
              ref="menuTree"
              node-key="uuid"
              :data="pidList"
              :props="defaultProps"
              :expand-on-click-node="false"
              :highlight-current="true"
              :default-expanded-keys="defaultExpandedKeys"
              @node-click="handleNodeClick"
            />
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="menuForm.type" filterable placeholder="请选择菜单类型" style="width: 100%;">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
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
        <el-button type="primary" @click="onSubmit('menuForm')">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAuthAllMenu, saveMenu } from '@/api/menu'
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
      menuForm: {},
      parentMenuName: '',
      defaultProps: {
        label: 'menuName',
        children: 'childMenu'
      },
      defaultExpandedKeys: [],
      pidList: [],
      typeList: [
        {
          id: '0',
          label: '目录'
        }, {
          id: '1',
          label: '菜单'
        }, {
          id: '2',
          label: '按钮'
        }
      ],
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
          { required: true, message: '请选择父级菜单', trigger: ['blur', 'change'] }
        ],
        type: [
          { required: true, message: '请选择菜单类型', trigger: 'change' }
        ],
        icon: [
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        description: [
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function() {
    this.getAuthAllMenu()
    this.loadForm()
  },
  methods: {
    loadForm() {
      this.menuForm = Object.assign({}, this.pdata)
      // 设置父级菜单下拉选选中项默认展开
      this.defaultExpandedKeys.push(this.menuForm.menuPid)
    },
    getAuthAllMenu() {
      getAuthAllMenu().then(response => {
        this.pidList = JSON.parse(JSON.stringify(response.data.items))
        // 设置父级菜单默认选中
        if (this.menuForm.menuPid) {
          this.$nextTick(() => {
            this.$refs.menuTree.setCurrentKey(this.menuForm.menuPid)// 获取已经设置的资源后渲染
            const obj = this.$refs.menuTree.getCurrentNode()
            this.parentMenuName = obj.menuName
          })
        }
      })
    },
    handleNodeClick: function(node) {
      // 重新选择了父级菜单 所以要重置 父级菜单id 及 菜单级别
      this.parentMenuName = node.menuName
      this.menuForm.menuPid = node.uuid
      this.menuForm.level = parseInt(node.level) + 1
      this.menuForm.isLeaf = '1'
      this.$refs.selectMenu.blur()
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveMenu(this.menuForm).then(response => {
            if (response.code === 200) {
              this.$emit('hideDialog')
              this.$message({
                message: '操作成功，请绑定角色',
                type: 'success'
              })
            }
          })
        }
      })
    },
    cancel() {
      this.$emit('hideDialog')
    }
  }
}
</script>
