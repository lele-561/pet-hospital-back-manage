<template>
  <div>
    <!-- 收集表单 -->
    <el-dialog title="用户信息" :visible.sync="isShow">
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
        <el-button type="primary" @click="search(input)">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <div>
      <common-table-user :tableData="tableData" :tableLabel="tableLabel" @changePage="search" @del="delUser"
                         @edit="editUser"></common-table-user>
      <div style="text-align: center; margin-top: 10px">
        <el-pagination :page-count="totalPages" :page-size="pageSize" :pager-count='7' background
                       layout="prev, pager, next, jumper" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {getFormData, postFormData} from "@/utils/api";
import CommonFormUser from "@/components/CommonForm.vue";
import CommonTableUser from "@/components/CommonTableOperator.vue"

export default {
  name: "UserManage",
  components: {
    CommonFormUser, CommonTableUser
  },
  data() {
    return {
      isShow: false,
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      input: "",
      // 表单配置
      operateFormLabel: [
        {model: "name", label: "用户名", type: "input"},
        {
          model: "role",
          label: "权限",
          type: "select",
          opts: [{label: '系统管理员', value: 'true'}, {label: '普通用户', value: 'false'},
          ]
        },
        {model: "level", label: "学习等级", type: "input"},
        {model: "phoneNumber", label: "电话号码", type: "input"},
      ],
      operateFormData: {
        id: "",
        name: "",
        phoneNumber: "",
        role: "",
      },
      // 表格配置
      tableData: [],
      tableLabel: [
        {prop: "name", label: '用户名'},
        {prop: "phoneNumber", label: '电话号码'},
        {prop: "role", label: '权限'},
        {prop: "level", label: '学习等级'},
      ]
    };
  },
  methods: {
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search(this.content)
    },
    search: function (content) {
      console.log(this.currentPage)
      getFormData('/user/getAllUsers', {content: content}).then((resp) => {
        console.log(resp.data)
        this.tableData = resp.data.result.users
        this.totalPages = resp.data.result.totalPages
      })
    },
    confirm() {
      postFormData('/user/updateOneUser', this.operateFormData).then((resp) => {
        this.isShow = false;
      })
    },
    editUser(row) {
      this.isShow = true;
      this.operateFormData = row
    },
    delUser(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row.id)
        postFormData('/user/deleteOneUser', {id: row.id}).then((resp) => {
          if (resp.data.code === 0) {
            this.$message({
              type: 'success',
              message: resp.data.msg
            });
            this.search("")
          } else {
            this.$message({
              type: 'warning',
              message: resp.data.msg
            });
          }
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
    this.currentPage=1
    this.search('');
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