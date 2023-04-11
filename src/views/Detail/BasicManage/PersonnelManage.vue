<template>
  <div>
    <!-- 收集表单 -->
    <el-dialog ref='dialog' :title='operateType === "add" ? "新增人员" : "人员信息"' :visible.sync='isShow'>
      <common-form ref='form' :formData='formData'
                   :formLabel='formLabel' :inline='false' :selectOptions='departmentOptions'>
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
        <el-button icon='el-icon-edit' type='primary' @click='addPersonnel'>新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <div>
      <common-table-operator :tableData='tableData' :tableLabel='tableLabel' @changePage='search' @del='delPersonnel'
                             @edit='editPersonnel'></common-table-operator>
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
  name: 'PersonnelManage',
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
      departmentOptions: [],
      // 表单配置，显示在页面的所有内容
      formLabel: [
        {
          model: 'name', label: '姓名', type: 'input', prop: 'name',
          rules: [
            {required: true, message: '请填写姓名', trigger: 'blur'},
            {min: 2, message: '姓名不得少于2个字', trigger: 'blur'},
            {max: 20, message: '姓名不得多于20个字', trigger: 'blur'}
          ]
        },
        {
          model: 'gender',
          label: '性别',
          type: 'selectStatic',
          prop: 'gender',
          opts: [{label: '男', value: '男'}, {label: '女', value: '女'},],
          rules: [{required: true, message: '请选择性别', trigger: 'blur'}]
        },
        {
          model: 'duty', label: '职务', type: 'selectStatic', prop: 'duty',
          opts: [{label: '兽医', value: '兽医'}, {label: '医护', value: '医护'}, {label: '前台', value: '前台'}],
          rules: [{required: true, message: '请选择职务', trigger: 'blur'}]
        },
        {
          model: 'phoneNumber', label: '电话号码', type: 'input', prop: 'phoneNumber',
          rules: [{required: true, validator: valiPhoneNumberPass, trigger: 'blur'},]
        },
        {
          model: 'department', label: '所属科室', type: 'selectDynamic', prop: 'department',
          rules: [{required: true, message: '请选择主管人', trigger: 'blur'}]
        },
      ],
      // 表单数据，不一定都显示，但会传回后端
      formData: {
        id: '',
        name: '',
        gender: '',
        phoneNumber: '',
        duty: '',
        department: '',
      },
      // 表格配置
      tableData: [],
      tableLabel: [
        {prop: 'name', label: '姓名'},
        {prop: 'gender', label: '性别'},
        {prop: 'duty', label: '职务'},
        {prop: 'phoneNumber', label: '电话号码'},
        {prop: 'department', label: '所属科室'},
      ]
    };
  },
  methods: {
    getData() {
      getFormData('/department/getAllDepartments', {content: '', currentPage: 0}).then((resp) => {
        for (let i in resp.data.result) {
          this.departmentOptions.push({
            value: resp.data.result[i].name,
            label: resp.data.result[i].name
          })
        }
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search(this.content, this.currentPage)
    },
    search: function (content, page) {
      getFormData('/personnel/getAllPersonnels', {content: content, currentPage: page}).then((resp) => {
        this.tableData = resp.data.result.personnels
        this.totalPages = resp.data.result.totalPages
        this.currentPage = resp.data.result.currentPage
      })
    },
    async confirm() {
      this.formValid = false
      await this.$bus.$emit('toFormValid', 'Personnel')
      if (this.formValid) {
        if (this.operateType === 'add') {
          delete this.formData.id
          postFormData('/personnel/addOnePersonnel', this.formData).then((resp) => {
            if (resp.data.code === 0) {
              this.$message({type: 'success', message: resp.data.message});
              this.isShow = false;
              this.currentPage = 1
              this.search('', this.currentPage)
            } else this.$message({type: 'warning', message: resp.data.message});
          })
        } else if (this.operateType === 'edit') {
          postFormData('/personnel/updateOnePersonnel', this.formData).then((resp) => {
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
    addPersonnel() {
      this.operateType = 'add';
      this.isShow = true;
      this.$refs.dialog.$emit('open')
      this.$refs.form.resetForm()
      this.formData = {}
    },
    editPersonnel(row) {
      this.operateType = 'edit';
      this.isShow = true;
      this.formData = JSON.parse(JSON.stringify(row))  // 新对象，防止修改原值
    },
    delPersonnel(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postFormData('/personnel/deleteOnePersonnel', {id: row.id}).then((resp) => {
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
    this.$bus.$on('returnFormValidPersonnel', (data) => {
      this.formValid = data
    })
  },
  beforeDestroy() {
    this.$bus.$off('returnFormValidPersonnel')
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