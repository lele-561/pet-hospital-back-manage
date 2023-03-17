<template>
  <div>
    <!-- 收集表单 -->
    <el-dialog :title="operateType === 'add' ? '新增科室' : '科室信息'" :visible.sync="isShow">
      <common-form ref="form" :formData="operateFormData" :formLabel="operateFormLabel" :inline="false">
      </common-form>
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
        <el-button type="success" icon="el-icon-search" @click="search(input)">搜索</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="addDepartment">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <div>
      <common-table-operator :tableData="tableData" :tableLabel="tableLabel" @changePage="search" @del="delDepartment"
                             @edit="editDepartment"></common-table-operator>
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
import CommonForm from "@/components/CommonForm.vue";
import CommonTableOperator from "@/components/CommonTableOperator.vue"

export default {
  name: "DepartmentManage",
  components: {
    CommonForm, CommonTableOperator
  },
  data() {
    return {
      operateType: "add",
      isShow: false,
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      input: "",
      // 表单配置，显示在页面的所有内容
      operateFormLabel: [
        {model: "name", label: "科室名称", type: "input"},
        {model: "functions", label: "科室功能", type: "textarea"},
        {model: "phoneNumber", label: "电话号码", type: "input"},
        {model: "directorId", label: "主管人id", type: "input"},
        {model: "directorName", label: "主管人姓名", type: "input"},
      ],
      // 表单数据，不一定都显示，但会传回后端
      operateFormData: {
        id: "",
        name: "",
        functions: "",
        phoneNumber: "",
        directorId: "",
        directorName: "",
      },
      // 表格配置
      tableData: [],
      tableLabel: [
        {prop: "name", label: '科室名称'},
        {prop: "phoneNumber", label: '电话号码'},
        {prop: "directorName", label: '主管人'},
      ]
    };
  },
  methods: {
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search(this.content)
    },
    search: function (content) {
      getFormData('/department/getAllDepartments', {content: content, currentPage: this.currentPage}).then((resp) => {
        this.tableData = resp.data.result.departments
        this.totalPages = resp.data.result.totalPages
        this.currentPage = resp.data.result.currentPage
      })
    },
    confirm() {
      if (this.operateType === 'add') {
        console.log(this.operateFormData)
        postFormData('/department/addOneDepartment', this.operateFormData).then((resp) => {
          if (resp.data.code === 0) {
            this.$message({type: 'success', message: resp.data.message});
            this.isShow = false;
            this.search("")
          } else this.$message({type: 'warning', message: resp.data.message});
        })
      } else if (this.operateType === 'edit') {
        postFormData('/department/updateOneDepartment', this.operateFormData).then((resp) => {
          if (resp.data.code === 0) {
            this.$message({type: 'success', message: resp.data.message});
            this.isShow = false;
            this.search("")
          } else this.$message({type: 'warning', message: resp.data.message});
        })
      }
    },
    addDepartment() {
      this.operateType = 'add';
      this.isShow = true;
      this.operateFormData = {}
    },
    editDepartment(row) {
      this.operateType = 'edit';
      this.isShow = true;
      this.operateFormData = row
    },
    delDepartment(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postFormData('/department/deleteOneDepartment', {id: row.id}).then((resp) => {
          if (resp.data.code === 0) {
            this.$message({type: 'success', message: resp.data.message});
            this.search("")
          } else this.$message({type: 'warning', message: resp.data.message});
        })
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    }
  },
  mounted() {
    this.currentPage = 1
    this.search('');
  }
};
</script>

<style lang="less" scoped>
.header-button {
  display: inline;
  float: right;
  margin-top: 2%;
}

.search {
  display: inline;
  margin-top: 2%;
  float: right;
}
</style>