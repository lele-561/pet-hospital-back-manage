<template>
  <div>
    <!-- 收集表单 -->
    <el-dialog :title="operateType === 'add' ? '新增试题' : '试题信息'" :visible.sync="isShow">
      <common-form ref="form" :formData="operateFormData" :formLabel="operateFormLabel" :inline="false">
      </common-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
    <el-form :inline="true" style="margin-top:12px">
      <el-form-item label="">
        <cascader
          :url="url"
          @change="handleChange"
        ></cascader>
        </el-form-item>
      <el-form-item>
        <el-input v-model="input" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="success" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="addQuestion">新增</el-button>
      </el-form-item>
      
    </el-form>
    <!-- 表格部分 -->
    <div>
      <common-table-operator :tableData="tableData" :tableLabel="tableLabel" @changePage="search" @del="delQuestion"
                             @edit="editQuestion"></common-table-operator>
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
import Cascader from "@/components/CommonCascader.vue"

export default {
  name: "QuestionManage",
  components: {
    CommonForm, CommonTableOperator, Cascader
  },
  data() {
    return {
      url: '/diseaseManage/getDiseaseTypes',
      disease_type_id: -1,
      operateType: "add",
      isShow: false,
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      input: "",
      // 表单配置，显示在页面的所有内容
      operateFormLabel: [
        {model: "disease_type_name", label: "疾病名", type: "textarea", 
          rules:[{ required: true, message: '请选择疾病分类', trigger: 'change' }]},
        {model: "title", label: "题干", type: "input", 
          rules:[{ required: true, message: '请输入题干', trigger: 'blur' },
          { min: 1, max: 500, message: '最多不超过500个字符', trigger: 'blur' }]},
        {model: "optionA", label: "A选项", type: "input",
          rules:[{ required: true, message: '请输入选项', trigger: 'blur' },
          { min: 1, max: 200, message: '最多不超过200个字符', trigger: 'blur' }]},
        {model: "optionB", label: "B选项", type: "input", 
          rules:[{ required: true, message: '请输入选项', trigger: 'blur' },
          { min: 1, max: 200, message: '最多不超过200个字符', trigger: 'blur' }]},
        {model: "optionC", label: "C选项", type: "input", 
          rules:[{ required: true, message: '请输入选项', trigger: 'blur' },
          { min: 1, max: 200, message: '最多不超过200个字符', trigger: 'blur' }]},
        {model: "optionD", label: "D选项", type: "input", 
          rules:[{ required: true, message: '请输入选项', trigger: 'blur' },
          { min: 1, max: 200, message: '最多不超过200个字符', trigger: 'blur' }]},
        {model: "answer", label: "正确答案", type: "radio-group",
          rules:[{ required: true, message: '请选择正确答案', trigger: 'change' },]}
      ],
      // 表单数据，不一定都显示，但会传回后端
      operateFormData: {
        question_id: "",
        disease_type_name: "",
        title: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        answer: ""
      },
      // 表格配置
      tableData: [],
      tableLabel: [
        {prop: "question_id", label: 'ID'},
        {prop: "disease_type_name", label: '疾病名'},
        {prop: "title", label: '题干'},
      ]
    };
  },
  methods: {
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search(this.content)
    },
    handleChange(value) {
      console.log(value)
      this.disease_type_id = value[1]
    },
    getAllQuestions() {
      getFormData('/examManage/getAllQuestions', {}).then((resp) => {
        this.tableData = resp.data.result.questionInfos
        // this.totalPages = resp.data.result.totalPages
        // this.currentPage = resp.data.result.currentPage
      })
    },
    getOneQuetion(row) {
      console
      getFormData('/examManage/getOneQuestion', {}).then((resp) => {
        this.operateFormData = resp.data.result.questionInfo
        // this.totalPages = resp.data.result.totalPages
        // this.currentPage = resp.data.result.currentPage
      })
    },
    search() {
      postFormData('/examManage/searchQuestion', {disease_type_id: this.disease_type_id, search_text: this.input}).then((resp) => {
        this.tableData = resp.data.result.questionInfos
        // this.totalPages = resp.data.result.totalPages
        // this.currentPage = resp.data.result.currentPage
      })
    },
    confirm() {
      if (this.operateType === 'add') {
        postFormData('/examManage/addOneQuestion', this.operateFormData).then((resp) => {
          if (resp.data.code === 0) {
            this.$message({type: 'success', message: resp.data.message});
            this.isShow = false;
            this.getAllQuestions()
          } else this.$message({type: 'warning', message: resp.data.message});
        })
      } else if (this.operateType === 'edit') {
        postFormData('/examManage/modifyOneQuestion', this.operateFormData).then((resp) => {
          if (resp.data.code === 0) {
            this.$message({type: 'success', message: resp.data.message});
            this.isShow = false;
            this.getAllQuestions()
          } else this.$message({type: 'warning', message: resp.data.message});
        })
      }
    },
    addQuestion() {
      this.operateType = 'add';
      this.isShow = true;
      this.operateFormData = {}
    },
    editQuestion(row) {
      this.operateType = 'edit';
      this.isShow = true;
      this.getOneQuetion(row.question_id)
    },
    delQuestion(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getFormData('/examManage/deleteOneQuestion', {questionId: row.question_id}).then((resp) => {
          if (resp.data.code === 0) {
            this.$message({type: 'success', message: resp.data.message});
            this.getAllQuestions()
          } else this.$message({type: 'warning', message: resp.data.message});
        })
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    }
  },
  mounted() {
    this.currentPage = 1
    this.getAllQuestions()
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