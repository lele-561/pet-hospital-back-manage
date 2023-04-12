<template>
  <div>
    <!-- 收集表单 -->
    <el-dialog ref='dialog' :title='operateType === "add" ? "新增检查项目" : "检查项目信息"' :visible.sync='isShow'>
      <common-form ref='form' :formData='formData' :formLabel='formLabel' :inline='false'>
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
        <el-button icon='el-icon-edit' type='primary' @click='addCheckup'>新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <div>
      <common-table-operator :tableData='tableData' :tableLabel='tableLabel'
                             @changePage='search' @del='delCheckup' @edit='editCheckup'></common-table-operator>
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
  name: 'CheckupManage',
  components: {
    CommonForm, CommonTableOperator
  },
  data() {
    let valiNumMoneyPass = (rule, value, callback) => {
      let reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;
      if (value === '') callback(new Error('请输入内容'));
      else if (!reg.test(value)) callback(new Error('请输入正确金额'));
      else callback();
    };
    return {
      operateType: 'add',
      isShow: false,
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      content: '',
      formValid: '',
      // 表单配置，显示在页面的所有内容
      formLabel: [
        {
          model: 'name', label: '项目名称', type: 'input', prop: 'name',
          rules: [
            {required: true, message: '请填写项目名称', trigger: 'blur'},
            {min: 2, message: '项目名称不得少于2个字', trigger: 'blur'},
            {max: 20, message: '项目名称不得多于20个字', trigger: 'blur'}
          ],
        },
        {
          model: 'introduction', label: '介绍', type: 'textarea', prop: 'introduction',
          rules: [
            {required: true, message: '请填写项目介绍', trigger: 'blur'},
            {min: 10, message: '项目介绍不得少于10个字', trigger: 'blur'},
            {max: 200, message: '项目介绍不得多于200个字', trigger: 'blur'}
          ],
        },
        {
          model: 'price', label: '价格', type: 'input', prop: 'price',
          rules: [{required: true, validator: valiNumMoneyPass, trigger: 'blur'},]
        },
      ],
      // 表单数据，不一定都显示，但会传回后端
      formData: {
        id: '',
        name: '',
        introduction: '',
        price: '',
        quantity: '',
      },
      // 表格配置
      tableData: [],
      tableLabel: [
        {prop: 'name', label: '项目名称'},
        {prop: 'introduction', label: '介绍'},
        {prop: 'price', label: '价格'},
      ]
    };
  },
  methods: {
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      console.log(this.content)
      this.search(this.content, this.currentPage)
    },
    search: function (content, page) {
      console.log(content, page)
      getFormData('/checkup/getAllCheckups', {content: content, currentPage: page}).then((resp) => {
        this.tableData = resp.data.result.checkups
        this.totalPages = resp.data.result.totalPages
        this.currentPage = resp.data.result.currentPage
      })
    },
    async confirm() {
      this.formValid = false
      await this.$bus.$emit('toFormValid', 'Checkup')
      if (this.formValid) {
        if (this.operateType === 'add') {
          delete this.formData.id
          postFormData('/checkup/addOneCheckup', this.formData).then((resp) => {
            if (resp.data.code === 0) {
              this.$message({type: 'success', message: resp.data.message});
              this.isShow = false;
              this.currentPage = 1
              this.search('', this.currentPage)
            } else this.$message({type: 'warning', message: resp.data.message});
          })
        } else if (this.operateType === 'edit') {
          postFormData('/checkup/updateOneCheckup', this.formData).then((resp) => {
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
    addCheckup() {
      this.operateType = 'add';
      this.isShow = true;
      this.$refs.dialog.$emit('open')
      this.$refs.form.resetForm()
      this.formData = {}
    },
    editCheckup(row) {
      this.operateType = 'edit';
      this.isShow = true;
      this.formData = JSON.parse(JSON.stringify(row))  // 新对象，防止修改原值
    },
    delCheckup(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postFormData('/checkup/deleteOneCheckup', {id: row.id}).then((resp) => {
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
  mounted() {
    this.currentPage = 1
    this.search('', this.currentPage)
    this.$bus.$on('returnFormValidCheckup', (data) => {
      this.formValid = data
    })
  },
  beforeDestroy() {
    this.$bus.$off('returnFormValidCheckup')
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