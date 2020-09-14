<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="index">
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          {{ scope.row.sex }}
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.mail }}
        </template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            class="switchStyle"
            v-model="scope.row.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            active-text="启用"
            inactive-text="禁用">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUserList } from '@/api/user'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '可用',
        0: '禁用'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.listLoading = true
      getUserList({}).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
<style>
.switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
/* 关闭时文字位置设置 */
.switchStyle .el-switch__label--left {
  z-index: 1;
  left: 19px;
}
/* 打开时文字位置设置 */
.switchStyle .el-switch__label--right {
  z-index: 1;
  right: -3px;
}
/* 显示文字 */
.switchStyle .el-switch__label.is-active {
  display: block;
}
.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}
</style>
