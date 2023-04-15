<template>
  <!-- TODO: Cascader数据不更新问题，selected数据显示 -->
  <div>
    <!-- 收集表单 -->
    <el-dialog ref="dialog" :title="operateType === 'add' ? '新增试卷' : '试卷信息'" :visible.sync="isShow" :fullscreen="isFullScreen" @close="clearSearch">
      <!-- <common-form ref="form" :formData="operateFormData" :formLabel="operateFormLabel" :inline="false">
      </common-form> -->
      <el-form ref="operateFormData" :model="operateFormData" :rules="rules" label-width="90px" :inline="false">
        <el-row>
          <el-form-item  label="试卷名" prop="name">
            <el-input v-model="operateFormData.name" placeholder='请输入试卷名'
              :maxlength='200' show-word-limit>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row v-if='showAddCascader()' >
          <el-form-item label="疾病类型" prop="disease_type_id">
            <cascader
              :url="url"
              @change="handleAddPaperChange"
            ></cascader>
            </el-form-item>
        </el-row>

        <!-- 搜索部分 -->
        <el-row justify="start" v-if="operateType === 'add' || operateType === 'edit'">
          <el-col :span="5">
            <el-form-item label="筛选试题"  >
              <cascader
                :url="url"
                @change="handleQuestionChange"
              ></cascader>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  >
              <el-input v-model="questionInput" placeholder="请输入搜索内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item label="" >
              <el-button type="success" icon="el-icon-search" @click="searchQuestion">搜索</el-button>
              <!-- <el-button type="primary" icon="el-icon-edit" @click="addQuestion">新增</el-button> -->
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item >
          <el-transfer
            ref="transfer"
            style="text-align: left; display: inline-block"
            v-model="selectedQuestions"
            :titles="['所有试题', '本试卷所用试题']"
            :button-texts="['取消', '添加']"
            :right-default-checked="selectedQuestions"
            :props="{
              key: 'question_id',
              label: 'title'
            }"
            @change="handleTransferChange"
            :data="questionData"
            :render-content="renderFunc">
            <!-- <span slot-scope="{ paperData }">{{ paperData.paper_id }} - {{ paperData.name }}</span> -->
          </el-transfer>
        </el-form-item>
        <el-form-item label="每题分值" prop="question_score">
          <el-input style="width: auto;" v-model="operateFormData.question_score" placeholder="请选择每题分值"></el-input>
          <!-- <el-select v-model="operateFormData.question_score" placeholder="请选择每题分值">
            <el-option v-for="item in opts"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
          </el-select> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm('operateFormData')">确定</el-button>
      </div>
    </el-dialog>
    <el-form :inline="true" style="margin-top:12px">
      <el-form-item label="">
        <cascader
          :url="url"
          @change="handlePaperChange"
        ></cascader>
        </el-form-item>
      <el-form-item>
        <el-input v-model="input" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="success" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="addPaper">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <div>
      <common-table-operator :tableData="tableData" :tableLabel="tableLabel" @changePage="search" @del="delPaper"
                             @edit="editPaper"></common-table-operator>
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
  name: "PaperManage",
  components: {
    CommonForm, CommonTableOperator, Cascader
  },
  data() {
    return {
      url: '/diseaseManage/getDiseaseTypes',
      operateType: "add",
      isShow: false,
      isFullScreen: true,
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,

      input: "",
      questionInput: "",
      formKey: Date.now(),

      disease_type_id_paper: -1,
      disease_type_id_question: -1,
      disease_type_id_add_paper: -1,

      // transfer所需数据
      selectedQuestions: [],
      questionData: [],
      // questionScore: 0,


      // 表单数据，不一定都显示，但会传回后端
      operateFormData: {
        paper_id: -1,
        questions: [],
        disease_type_name: '',
        disease_type_id: 0,
        name: '',
        question_score: 0,
        score: 0,
        question_num: 0,
      },
      // 表单配置，显示在页面的所有内容
      // opts: [{label: '1', value: '1'}, {label: '2', value: '2'},{label: '3', value: '3'},{label: '4', value: '4'},{label: '5', value: '5'},{label: '10', value: '10'},
      //     {label: '20', value: '20'}],
      rules: {
        name: [{ required: true, message: '请输入试卷名', trigger: 'blur' },
          { min: 1, max: 200, message: '最多不超过200个字符', trigger: 'blur' }],
        question_score: [{ required: true, message: '请输入每题分值', trigger: 'blur' },
          {  pattern: /^[1-9][0-9]?$/, message: '分值为1-100之间的整数', trigger: 'blur' },],
        disease_type_id: [{ required: true, message: '请选择试卷所属疾病类型', trigger: 'blur' }],
      },

      // 表格配置
      tableData: [],
      tableLabel: [
        {prop: 'paper_id', label: '试卷编号'},
        {prop: 'disease_type_name', label: '疾病类型'},
        {prop: 'name', label: '试卷名称'},
        {prop: 'score', label: '试卷总分'},
        {prop: 'question_num', label: '试题数量'},
      ]
    };
  },
  methods: {
    // handleOpen() {
    //   this.$nextTick(() => {
    //     this.$refs.form.validate()
    //   })
    // },
    clearSearch() {
      this.disease_type_id_question = -1
      this.questionInput = ''
      this.handleQuestionChange([-1,-1])
      this.formKey++
    },
    isSelected(option) {
      // 检查数据是否被选中
      return this.selectedQuestions.some(item => item.question_id === option.question_id);
    },
    renderFunc(h, option) {
      if (this.isSelected(option)) {
        // 如果数据被选中，为其生成相应的DOM节点
        return <span class="selected">{ option.question_id } - { option.title }</span>;
      } else {
        // 如果数据未被选中，为其生成普通的DOM节点
        return <span>{ option.question_id } - { option.title }</span>;
      }
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search()
    },
    handlePaperChange(value) {
      console.log(value)
      this.disease_type_id_paper = value[1]
    },
    handleQuestionChange(value) {
      console.log(value)
      this.disease_type_id_question = value[1]
    },
    handleAddPaperChange(value) {
      console.log(value)
      this.operateFormData.disease_type_id = value[1]
    },
    handleTransferChange(data) {
      // const selectedData = this.$refs.transfer.getSelected();
      // this.selectedQuestions = selectedData
      // console.log(list)
      console.log(this.selectedQuestions)
    },
    searchQuestion() {
      if(typeof this.disease_type_id_question == "undefined") {
        this.disease_type_id_question = -1
      }
      console.log(this.disease_type_id_question+" "+this.questionInput)
      // TODO: 解决cascader显示不更新的问题
      postFormData('/examManage/searchQuestion', {disease_type_id: this.disease_type_id_question, search_text: this.questionInput, currentPage: -1}).then((resp) => {
        this.questionData = resp.data.result.infos
      })
      console.log("update!")
      console.log(this.questionData)
      console.log(this.selectedQuestions)
    },
    showAddCascader: function() {
      // console.log(this.operateType === 'add')
      return this.operateType === 'add'
    },
    getOnePaper(row) {
      this.selectedQuestions.length = 0
      getFormData('/examManage/getOnePaper', {paper_id: row.paper_id}).then((resp) => {
        // this.questionScore = resp.data.result.paper_info.questions[0].question_score
        this.operateFormData = resp.data.result.paper_info
        // this.operateFormData.question_score = this.questionScore
        for(let i = 0; i < this.operateFormData.questions.length; i++) {
          this.selectedQuestions.push(this.operateFormData.questions[i].question_id)
        }
        // console.log(this.selectedQuestions)
        // console.log(this.operateFormData)
        // console.log(this.disease_type_id_question)
        // TODO: 需要getOneExam中的数据为所有paperdata的子集才能正确显示
      })
    },
    search() {
      console.log(this.disease_type_id_paper+" "+this.input)
      postFormData('/examManage/searchPaper', {disease_type_id: this.disease_type_id_paper, search_text: this.input, currentPage: this.currentPage}).then((resp) => {
        console.log(resp.data.result.infos)
        this.tableData = resp.data.result.infos
        this.totalPages = resp.data.result.totalPages
        this.currentPage = resp.data.result.currentPage
        // console.log(this.tableData)
      })
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        var question_ids = ''
        for(let i = 0; i < this.selectedQuestions.length; i++) {
          question_ids = question_ids + this.selectedQuestions[i] + ','
        }
        console.log(this.question_ids)
        // console.log(this.operateFormData)
          if (valid) {
            if (this.operateType === 'add') {
              var temp_info = {
                disease_type_id: this.operateFormData.disease_type_id,
                question_ids: question_ids,
                question_point: this.operateFormData.question_score,
                name: this.operateFormData.name,
                question_num: this.selectedQuestions.length,
              }
              console.log(temp_info)
              postFormData('/examManage/addOnePaper', temp_info).then((resp) => {
                if (resp.data.code === 0) {
                  this.$message({type: 'success', message: resp.data.message});
                  this.isShow = false;
                  this.search()
                } else this.$message({type: 'warning', message: resp.data.message});
              })
            } else if (this.operateType === 'edit') {
              var temp_info = {
                // disease_type_id: this.operateFormData.disease_type_id,
                question_ids: question_ids,
                question_point: this.operateFormData.question_score,
                name: this.operateFormData.name,
                question_num: this.selectedQuestions.length,
                paper_id: this.operateFormData.paper_id
              }
              postFormData('/examManage/modifyOnePaper', temp_info).then((resp) => {
                if (resp.data.code === 0) {
                  this.$message({type: 'success', message: resp.data.message});
                  this.isShow = false;
                  this.search()
                } else this.$message({type: 'warning', message: resp.data.message});
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    addPaper() {
      this.operateType = 'add';
      this.isShow = true;
      this.selectedQuestions = []
      this.searchQuestion()
      this.$refs.dialog.$emit('open');
      if(this.$refs.operateFormData !== undefined)
        this.$refs.operateFormData.resetFields();// 在这里重置表单校验状态
      this.operateFormData = {}

    },
    editPaper(row) {
      this.operateType = 'edit';
      this.isShow = true;
      console.log(this.disease_type_id_question)
      this.searchQuestion()
      this.getOnePaper(row)
      this.$refs.dialog.$emit('open');
      if(this.$refs.operateFormData !== undefined)
        this.$refs.operateFormData.resetFields();// 在这里重置表单校验状态
    },
    delPaper(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getFormData('/examManage/deleteOneExam', {exam_id: row.exam_id}).then((resp) => {
          if (resp.data.code === 0) {
            this.$message({type: 'success', message: resp.data.message});
            this.search()
          } else this.$message({type: 'warning', message: resp.data.message});
        })
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    }
  },
  mounted() {
    this.currentPage = 1
    this.search()
    // this.$bus.$on('returnFormValidExam', (data) => {
    //   this.formValid = data
    // })
  },
  // beforeDestroy() {
  //   this.$bus.$off('returnFormValidExam')
  // }
}

</script>

<style scoped>
</style>