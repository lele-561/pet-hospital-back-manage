<template>
  <div>
    <!-- 收集表单 -->
    <el-dialog :visible.sync='isShow' title='用户信息'>
      <common-form ref='form' :formData='formData' :formLabel='formLabel' :inline='true'>
      </common-form>
      <div slot='footer' class='dialog-footer'>
        <el-button type='' @click='isShow = false'>取消</el-button>
        <el-button type='primary' @click='confirm'>确定</el-button>
      </div>
    </el-dialog>
    <el-form :inline='true' style='margin-top:12px'>
      <el-form-item label=''>
        <el-input v-model='content' placeholder='请输入'></el-input>
      </el-form-item>
      <el-form-item label=''>
        <el-button icon='el-icon-search' type='success' @click='search(content,currentPage)'>搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <div>
      <common-table-operator :tableData='tableData' :tableLabel='tableLabel' @changePage='search' @del='delUser'
                             @edit='editUser'></common-table-operator>
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
  name: 'UserManage',
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
    let valiLevelPass = (rule, value, callback) => {
      let reg = /^[+]{0,1}(\d+)$/g;
      if (value === '') callback(new Error('请输入内容'));
      else if (!reg.test(value)) callback(new Error('请输入整数'));
      else if (value < 1 || value > 5) callback(new Error('请输入1~5之间的数字'));
      else callback();
    };
    return {
      isShow: false,
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      content: '',
      formValid: '',
      // 表单配置
      formLabel: [
        {
          model: 'name', label: '用户名', type: 'input', prop: 'name',
          rules: [
            {required: true, message: '请填写用户名', trigger: 'blur'},
            {min: 1, message: '用户名不得少于1个字', trigger: 'blur'},
            {max: 20, message: '用户名不得多于20个字', trigger: 'blur'}
          ],
        },
        {
          model: 'role',
          label: '权限',
          type: 'selectStatic',
          opts: [{label: '管理员', value: true}, {label: '普通用户', value: false},],
          rules: [{required: true, message: '请选择权限', trigger: 'blur'}]
        },
        {
          model: 'level', label: '学习等级', type: 'input', prop: 'level',
          rules: [{required: true, validator: valiLevelPass, trigger: 'blur'},]
        },
        {
          model: 'phoneNumber', label: '电话号码', type: 'input', prop: 'phoneNumber',
          rules: [{required: true, validator: valiPhoneNumberPass, trigger: 'blur'},]
        },
      ],
      formData: {
        id: '',
        name: '',
        phoneNumber: '',
        role: '',
      },
      // 表格配置
      tableData: [],
      tableLabel: [
        {prop: 'name', label: '用户名'},
        {prop: 'phoneNumber', label: '电话号码'},
        {prop: 'role', label: '权限'},
        {prop: 'level', label: '学习等级'},
      ]
    };
  },
  methods: {
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search(this.content, this.currentPage)
    },
    search: function (content, page) {
      getFormData('/user/getAllUsers', {content: content, currentPage: page}).then((resp) => {
        this.tableData = resp.data.result.users
        for (let i in this.tableData) {
          if (this.tableData[i].role === true) this.tableData[i].role = '管理员'
          else this.tableData[i].role = '普通用户'
        }
        this.totalPages = resp.data.result.totalPages
        this.currentPage = resp.data.result.currentPage
      })
    },
    async confirm() {
      this.formValid = false
      await this.$bus.$emit('toFormValid', 'User')
      if (this.formValid) {
        var realFormData = JSON.parse(JSON.stringify(this.formData))  // 新对象，防止修改原值
        if (this.formData.role === '管理员')
          realFormData.role = true
        // 点击select更换主管人后，id会存储在传入的name字段，因此在这里改一下数据
        else if (this.formData.role === '普通用户')
          realFormData.role = false
        console.log(realFormData)
        postFormData('/user/updateOneUser', realFormData).then((resp) => {
          if (resp.data.code === 0) {
            this.$message({type: 'success', message: resp.data.message});
            this.isShow = false;
            this.currentPage = 1
            this.search('', this.currentPage)
          } else this.$message({type: 'warning', message: resp.data.message});
        })
      }
    },
    editUser(row) {
      this.isShow = true;
      this.formData = JSON.parse(JSON.stringify(row))  // 新对象，防止修改原值
    },
    delUser(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postFormData('/user/deleteOneUser', {id: row.id}).then((resp) => {
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
    this.currentPage = 1
    this.search('', this.currentPage)
    this.$bus.$on('returnFormValidUser', (data) => {
      this.formValid = data
    })
  },
  beforeDestroy() {
    this.$bus.$off('returnFormValidUser')
  }
};
</script>

<style lang='less' scoped>
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