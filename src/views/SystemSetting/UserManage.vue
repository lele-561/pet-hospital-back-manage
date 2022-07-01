<template>
  <div>
    <!-- 收集表单 -->
    <el-dialog :title="operateType === 'add' ? '新增用户' : '更新用户'" :visible.sync="isShow">
      <common-form-user ref="form" :formData="operateFormData" :formLabel="operateFormLabel" :inline="true">
      </common-form-user>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>

    <el-form :inline="true" style="margin-top:12px">
      <el-form-item label="">
        <el-input v-model="input" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <div>
      <common-table-user :tableData="tableData" :tableLabel="tableLabel" @changePage="search" @del="delUser"
                         @edit="editUser"></common-table-user>
    </div>
    <!-- 底部跳转 -->
    <div style="text-align: center;margin-top: 10px">
      <el-pagination :page-count="totalPages" :page-size="pageSize" :pager-count="7" background
                     layout="prev, pager, next, jumper" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import {postRequest} from "@/utils/api";
import CommonFormUser from "@/components/CommonFormUser.vue";
import CommonTableUser from "@/components/CommonTableUser.vue"

export default {
  name: "UserManage",
  components: {
    CommonFormUser, CommonTableUser
  },
  data() {
    return {
      operateType: "add",
      isShow: false,
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      input: "",
      // 表单配置
      operateFormLabel: [
        {
          model: "userName", // 数据名
          label: "用户名",
          type: "input",
        },
        {
          model: "roleName",
          label: "权限",
          type: "select",
          opts: [{
            label: '系统管理员',
            value: 'admin'
          },
            {
              label: '普通用户',
              value: 'user'
            },
          ]
        },
      ],
      operateFormData: {
        userName: "",
        roleName: "",
      },
      // 表格配置
      tableData: [],
      tableLabel: [{
        prop: "userName",
        label: '用户名'
      },
        {
          prop: "userId",
          label: 'ID'
        }, {
          prop: "roleName",
          label: '权限'
        }
      ]
    };
  },
  methods: {
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search()
    },
    search: function () {
      postRequest('/user/getUserList', {input: this.input, currentPage: this.currentPage}).then((resp) => {
        // paper改变
        this.tableData = resp.data.content;
        this.totalPages = resp.data.totalPages;
        this.currentPage = resp.data.currentPage;
      })
    },
    confirm() {
      postRequest('/user/updateUser', this.operateFormData).then((resp) => {
        this.isShow = false;
      })
    },
    editUser(row) {
      this.operateType = 'edit';
      this.isShow = true;
      this.operateFormData = row
    },
    delUser(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postRequest('/user/deleteUser', {id: row.userId}).then((resp) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.search()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  mounted() {
    this.search();
  }
};
</script>

<style lang="less" scoped>
.header-button {
  display: inline;
  float: left;
  margin-top: 2%;
}

.search {
  // display: inline;
  margin-top: 2%;
  // float: right;
}
</style>