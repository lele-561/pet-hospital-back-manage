<template>
  <div>
    <!-- TODO: selected数据显示问题 -->
    <!-- 收集表单 -->
    <el-dialog ref="dialog" :title="operateType === 'add' ? '新增考试' : '考试信息'" :visible.sync="isShow" :fullscreen="isFullScreen">
      <!-- <common-form ref="form" :formData="operateFormData" :formLabel="operateFormLabel" :inline="false">
      </common-form> -->
      <el-form ref="operateFormData" :model="operateFormData" :rules="rules" label-width="110px" :inline="false">
        <el-form-item label="考试名" prop="name">
          <el-input v-model="operateFormData.name" placeholder='请输入考试名'
            :maxlength='200' show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="考生权限" prop="authority">
          <el-select v-model="operateFormData.authority" placeholder="请选择考生权限">
            <el-option v-for="item in opts"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试日期" prop="start_date">
          <el-date-picker v-model="operateFormData.start_date" placeholder="请选择考试日期" type="date"
                      value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="考试时间" prop="examTime">
          <el-time-picker 
            is-range 
            v-model="operateFormData.examTime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择考试时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item >
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="selectedPapers"
            filterable
            :filter-method="filterMethod"
            :titles="['所有试卷', '本考试所用试卷']"
            :button-texts="['取消', '添加']"
            :right-default-checked="selectedPapers"
            :props="{
              key: 'paper_id',
              label: 'name'
            }"
            @change="handleTransferChange"
            :data="paperData"
            :render-content="renderFunc">
            <!-- <span slot-scope="{ paperData }">{{ paperData.paper_id }} - {{ paperData.name }}</span> -->
          </el-transfer>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm('operateFormData')">确定</el-button>
      </div>
    </el-dialog>
    <el-form :inline="true" style="margin-top:12px">
      <el-form-item>
        <el-input v-model="input" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="success" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="addExam">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <div>
      <common-table-operator :tableData="tableData" :tableLabel="tableLabel" @changePage="search" @del="delExam"
                             @edit="editExam"></common-table-operator>
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
  name: "ExamManage",
  components: {
    CommonForm, CommonTableOperator
  },
  data() {
    return {
      operateType: "add",
      isShow: false,
      isFullScreen: true,
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      input: "",

      start_date: '',
      exam_info: {},
      post_exam_info: {},
      oldResp: {},

      // transfer所需数据
      selectedPapers: [],
      // paper_info: {},
      paperData: [],

      // 表单数据，不一定都显示，但会传回后端
      operateFormData: {
        exam_id: -1,
        paper_info: {},
        name: "",
        authority: "",
        start_date: "",
        examTime: "",

        start_time: "",
        start_time: "",
      },
      // 表单配置，显示在页面的所有内容
      opts: [{label: '1（最低）', value: '1'}, {label: '2', value: '2'},{label: '3', value: '3'},
          {label: '4', value: '4'},{label: '5（最高）', value: '5'}],
      rules: {
        name: [{ required: true, message: '请输入试卷名', trigger: 'blur' },
          { min: 1, max: 200, message: '最多不超过200个字符', trigger: 'blur' }],
        authority: [{ required: true, message: '请选择考生权限', trigger: 'change' }],
        start_date: [{ required: true, message: '请选择考试日期', trigger: 'change' }],
        examTime: [{ required: true, message: '请选择考试时间', trigger: 'change' }]
      },

      // 表格配置
      tableData: [],
      tableLabel: [
        {prop: "exam_id", label: '考试编号'},
        {prop: "exam_name", label: '考试名'},
        {prop: "authority", label: '考生权限'},
        {prop: "start_time", label: '开始时间'},
        {prop: "end_time", label: '结束时间'},
      ]
    };
  },
  methods: {
    renderFunc(h, option) {
          return <span>{ option.paper_id } - { option.name }</span>;
      },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search()
    },
    handleTransferChange(value, direction, movedKeys) {
        // 如果已选中的数量超过 1，则取消当前选择
        if (this.selectedPapers.length > 1) {
          this.$alert(' 每场考试只能选择一套试卷！', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
          });
          this.selectedPapers.pop();
      }
    },
    loadPaperData() {
      postFormData('/examManage/searchPaper', {disease_type_id: -1, search_text: '', currentPage: -1}).then((resp) => {
        this.paperData = resp.data.result.infos
      })
    },
    filterMethod(query, item) {
      //TODO: 按名字和id都能搜索
      return item.name.indexOf(query) > -1
    },
    getOneExam(row) {
      this.selectedPapers.length = 0
      getFormData('/examManage/getOneExam', {exam_id: row.exam_id}).then((resp) => {
        this.oldResp = resp.data.result.exam_info
        this.exam_info = {
          paper_info: this.oldResp.paper_info,
          authority: this.oldResp.authority,
          exam_id: this.oldResp.exam_id,
          name: this.oldResp.exam_name,
          start_date: this.oldResp.start_time.split(" ")[0],
          examTime: [this.oldResp.start_time.split(" ")[0]+" "+this.oldResp.start_time.split(" ")[1], this.oldResp.start_time.split(" ")[0]+" "+this.oldResp.end_time.split(" ")[1]],
          start_time: this.oldResp.start_time.split(" ")[0]+" "+this.oldResp.start_time.split(" ")[1],
          start_time:this.oldResp.start_time.split(" ")[0]+" "+this.oldResp.end_time.split(" ")[1],
        }
        console.log(this.exam_info)
        this.operateFormData = this.exam_info
        this.selectedPapers.push(this.exam_info.paper_info.paper_id)
        console.log(this.selectedPapers)
        // TODO: 需要getOneExam中的数据为所有paperdata的子集才能正确显示
      })
    },
    search() {
      postFormData('/examManage/searchExam', {search_text: this.input, currentPage: this.currentPage}).then((resp) => {
        this.tableData = resp.data.result.infos
        this.totalPages = resp.data.result.totalPages
        this.currentPage = resp.data.result.currentPage
      })
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.operateType === 'add') {
              this.post_exam_info = {
                paper_id: this.operateFormData.paper_info.paper_id,
                start_time: this.operateFormData.examTime[0],
                start_time: this.operateFormData.examTime[1],
                name: this.operateFormData.name,
                authority: this.operateFormData.authority
              } 
              console.log(this.post_exam_info)
              // delete this.operateFormData.exam_id
              postFormData('/examManage/addOneExam', this.post_exam_info).then((resp) => {
                if (resp.data.code === 0) {
                  this.$message({type: 'success', message: resp.data.message});
                  this.isShow = false;
                  this.search()
                } else this.$message({type: 'warning', message: resp.data.message});
              })
            } else if (this.operateType === 'edit') {
              this.post_exam_info = {
                paper_id: this.operateFormData.paper_info.paper_id,
                start_time: this.operateFormData.examTime[0],
                end_time: this.operateFormData.examTime[1],
                exam_name: this.operateFormData.name,
                authority: this.operateFormData.authority,
                exam_id: this.operateFormData.exam_id
              } 
              console.log(this.post_exam_info)
              postFormData('/examManage/modifyOneExam', this.post_exam_info).then((resp) => {
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
    addExam() {
      this.operateType = 'add';
      this.isShow = true;
      this.$refs.dialog.$emit('open');
      this.$refs.operateFormData.resetFields();// 在这里重置表单校验状态
      this.operateFormData = {}
      this.selectedPapers = []
      this.loadPaperData()
    },
    editExam(row) {
      this.operateType = 'edit';
      this.isShow = true;
      this.$refs.dialog.$emit('open');
      this.$refs.operateFormData.resetFields();// 在这里重置表单校验状态
      this.loadPaperData()
      this.getOneExam(row)
    },
    delExam(row) {
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
  },

}

</script>

<style scoped>
</style>