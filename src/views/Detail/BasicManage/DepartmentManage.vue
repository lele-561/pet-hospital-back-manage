<template>
  <div>
    <!-- 收集表单 -->
    <el-dialog ref='dialog' :title='operateType === "add" ? "新增科室" : "科室信息"' :visible.sync='isShow'>
      <common-form ref='form' :formData='formData'
                   :formLabel='formLabel' :inline='false' :selectOptions='personnelOptions'>
      </common-form>
      <div slot='footer' class='dialog-footer'>
        <el-button type='' @click='isShow = false'>取消</el-button>
        <el-button type='primary' @click='confirm'>确定</el-button>
      </div>
    </el-dialog>
    <el-form :inline='true' style='margin-top:12px'>
      <el-form-item label=''>
        <el-input v-model='input' placeholder='请输入'></el-input>
      </el-form-item>
      <el-form-item label=''>
        <el-button icon='el-icon-search' type='success' @click='search(input,currentPage)'>搜索</el-button>
        <el-button icon='el-icon-edit' type='primary' @click='addDepartment'>新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <div>
      <common-table-operator :tableData='tableData' :tableLabel='tableLabel' @changePage='search' @del='delDepartment'
                             @edit='editDepartment'></common-table-operator>
      <div style='text-align: center; margin-top: 10px'>
        <el-pagination :page-count='totalPages' :page-size='pageSize' :pager-count='7' background
                       layout='prev, pager, next, jumper' @current-change='handleCurrentChange'>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {getFormData, postFormData} from '@/utils/api';
import CommonForm from '@/components/CommonForm.vue';
import CommonTableOperator from '@/components/CommonTableOperator.vue'

export default {
  name: 'DepartmentManage',
  components: {
    CommonForm, CommonTableOperator
  },
  data() {
    let valiPhoneNumberPass = (rule, value, callback) => {
      let reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      if (value === '') callback(new Error('请输入电话号码'));
      else if (!reg.test(value)) callback(new Error('请输入正确的电话号码'));
      else callback();
    };
    return {
      operateType: 'add',
      isShow: false,
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      input: '',
      formValid: '',
      personnelOptions: [],
      // 表单配置，显示在页面的所有内容
      formLabel: [
        {
          model: 'name', label: '科室名称', type: 'input', prop: 'name',
          rules: [
            {required: true, message: '请填写科室名称', trigger: 'blur'},
            {min: 2, message: '科室名称不得少于2个字', trigger: 'blur'},
            {max: 20, message: '科室名称不得多于20个字', trigger: 'blur'}
          ],
        },
        {
          model: 'functions', label: '科室功能', type: 'textarea', prop: 'functions',
          rules: [
            {required: true, message: '请填写科室功能', trigger: 'blur'},
            {min: 10, message: '科室功能不得少于10个字', trigger: 'blur'},
            {max: 200, message: '科室功能不得多于200个字', trigger: 'blur'}
          ],
        },
        {
          model: 'phoneNumber', label: '电话号码', type: 'input', prop: 'phoneNumber',
          rules: [{required: true, validator: valiPhoneNumberPass, trigger: 'blur'},]
        },
        {
          model: 'directorName', label: '主管人', type: 'selectDynamic', prop: 'directorName',
          rules: [{required: true, message: '请选择主管人', trigger: 'blur'}]
        },
      ],
      // 表单数据，不一定都显示，但会传回后端
      formData: {
        id: '',
        name: '',
        functions: '',
        phoneNumber: '',
        directorId: '',
        directorName: ''
      },
      // 表格配置
      tableData: [],
      tableLabel: [
        {prop: 'name', label: '科室名称'},
        {prop: 'phoneNumber', label: '电话号码'},
        {prop: 'directorName', label: '主管人'},
      ]
    };
  },
  methods: {
    getData() {
      getFormData('/personnel/getAllPersonnels', {content: '', currentPage: 0}).then((resp) => {
        for (let i in resp.data.result.personnels) {
          this.personnelOptions.push({
            value: resp.data.result.personnels[i].id,
            label: resp.data.result.personnels[i].name
          })
        }
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search(this.content, this.currentPage)
    },
    search: function (content, page) {
      getFormData('/department/getAllDepartments', {content: content, currentPage: page}).then((resp) => {
        this.tableData = resp.data.result.departments
        this.totalPages = resp.data.result.totalPages
        this.currentPage = resp.data.result.currentPage
      })
    },
    async confirm() {
      this.formValid = false
      await this.$bus.$emit('toFormValid', 'Department')
      if (this.formValid) {
        // 点击select更换主管人后，id会存储在传入的name字段，因此在这里改一下数据
        this.formData.directorId = this.formData.directorName
        delete this.formData.directorName
        if (this.operateType === 'add') {
          delete this.formData.id
          postFormData('/department/addOneDepartment', this.formData).then((resp) => {
            if (resp.data.code === 0) {
              this.$message({type: 'success', message: resp.data.message});
              this.isShow = false;
              this.currentPage = 1
              this.search('', this.currentPage)
            } else this.$message({type: 'warning', message: resp.data.message});
          })
        } else if (this.operateType === 'edit') {
          postFormData('/department/updateOneDepartment', this.formData).then((resp) => {
            if (resp.data.code === 0) {
              this.$message({type: 'success', message: resp.data.message});
              this.isShow = false;
              this.currentPage = 1
              this.search('', this.currentPage)
            } else this.$message({type: 'warning', message: resp.data.message});
          })
        }
      }
    },
    addDepartment() {
      this.operateType = 'add';
      this.isShow = true;
      this.$refs.dialog.$emit('open')
      this.$refs.form.resetForm()
      this.formData = {}
    },
    editDepartment(row) {
      this.operateType = 'edit';
      this.isShow = true;
      this.formData = JSON.parse(JSON.stringify(row))  // 新对象，防止修改原值
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
            this.currentPage = 1
            this.search('', this.currentPage)
          } else this.$message({type: 'warning', message: resp.data.message});
        })
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    }
  },
  async mounted() {
    await this.getData()
    this.currentPage = 1
    this.search('', this.currentPage)
    this.$bus.$on('returnFormValidDepartment', (data) => {
      this.formValid = data
    })
  },
  beforeDestroy() {
    this.$bus.$off('returnFormValidDepartment')
  }
};
</script>

<style lang='less' scoped>
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