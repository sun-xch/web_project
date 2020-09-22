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
        <el-select v-model="menuForm.menuPid" filterable clearable placeholder="请选择父级菜单" style="width: 100%;">
          <el-option
            v-for="item in pidList"
            :key="item.uuid"
            :label="item.menuName"
            :value="item.uuid"
            @click.native="resetParentMenu(item)"
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
import { getMenu, saveMenu } from '@/api/menu'
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
      pidList: [],
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
      }
    }
  },
  mounted: function() {
    this.getMenu()
    this.loadForm()
  },
  methods: {
    loadForm() {
      this.menuForm = this.pdata
    },
    getMenu() {
      getMenu({}).then(response => {
        this.pidList = response.data.items
      })
    },
    resetParentMenu(item) {
      // 重新选择了父级菜单 所以要重置 父级菜单id 及 菜单级别
      this.menuForm.menuPid = item.uuid
      this.menuForm.level = parseInt(item.level) + 1
      if (item.uuid === '0') {
        this.menuForm.isLeaf = '0'
      } else {
        this.menuForm.isLeaf = '1'
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 默认都是菜单类型
          this.menuForm.type = '1'
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
