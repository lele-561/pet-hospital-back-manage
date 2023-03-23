<template>
  <div>
    <!-- 收集表单 -->
    <el-dialog :title="operateType === 'add' ? '新增考试' : '考试信息'" :visible.sync="isShow">
      <common-form ref="form" :formData="operateFormData" :formLabel="operateFormLabel" :inline="false">
      </common-form>
      <el-form >
        <el-form-item>
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="selectedPapers"
            filterable
            :filter-method="filterMethod"
            :titles="['所有试卷', '本考试所用试卷']"
            :button-texts="['取消添加', '添加试卷']"
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
        <el-button type="primary" @click="confirm">确定</el-button>
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
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      formValid: '',
      input: "",

      start_date: '',
      exam_info: {},
      oldResp: {},

      // transfer所需数据
      selectedPapers: [],
      // paper_info: {},
      paperData: [],


      // 表单配置，显示在页面的所有内容
      operateFormLabel: [
        {model: "name", label: "试卷名", type: "input", 
          rules:[{ required: true, message: '请输入试卷名', trigger: 'blur' }]},
        {model: "authority", label: "考生权限", type: "selectStatic", 
          prop: 'authority',
          rules:[{ required: true, message: '请选择考生权限', trigger: 'blur' }],
          opts: [{label: '1（最低）', value: '1'}, {label: '2', value: '2'},{label: '3', value: '3'},
          {label: '4', value: '4'},{label: '5（最高）', value: '5'}],
        },
        {model: "startDate", label: "考试开始日期", type:"date"},
        {model: "examTime", label: "考试时间", type: "time",
          rules:[{ required: true, message: '请输入考试时间', trigger: 'blur' }]},
        // {model: "endTime", label: "考试结束时间", type: "time", 
        //   rules:[{ required: true, message: '请输入考试结束时间', trigger: 'blur' }]},
      ],
      // 表单数据，不一定都显示，但会传回后端
      operateFormData: {
        // paperId: "",
        startDate: "",
        examTime: "",
        // startTime: "",
        // endTime: "",
        name: "",
        authority: "",
      },
      // 表格配置
      tableData: [],
      tableLabel: [
        {prop: "exam_id", label: 'ID'},
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
      // console.log("!1111111")
      // console.log(this.paperData)
    },
    filterMethod(query, item) {
      //TODO: 按名字和id都能搜索
      return item.name.indexOf(query) > -1
    },
    getOneExam(row) {
      console.log(row.exam_id)
      this.selectedPapers.length = 0
      getFormData('/examManage/getOneExam', {exam_id: row.exam_id}).then((resp) => {
        // console.log(resp.data.result.examInfo)
        this.oldResp = resp.data.result.examInfo
        this.exam_info = {
          paperInfo: this.oldResp.paper_info,
          authority: this.oldResp.authority,
          examId: this.oldResp.exam_id,
          name: this.oldResp.exam_name,
          startDate: this.oldResp.start_time.split(" ")[0],
          examTime: [this.oldResp.start_time.split(" ")[0]+" "+this.oldResp.start_time.split(" ")[1], this.oldResp.start_time.split(" ")[0]+" "+this.oldResp.end_time.split(" ")[1]]
        }
        console.log(this.exam_info)
        this.operateFormData = this.exam_info
        this.selectedPapers.push(this.exam_info.paperInfo.paper_id)
        console.log(this.selectedPapers)
        // TODO: 需要getOneExam中的数据为所有paperdata的子集才能正确显示
      })
    },
    search() {
      postFormData('/examManage/searchExam', {searchText: this.input, currentPage: this.currentPage}).then((resp) => {
        this.tableData = resp.data.result.infos
        this.totalPages = resp.data.result.totalPages
        this.currentPage = resp.data.result.currentPage
      })
    },
    async confirm() {
      this.formValid = false
      await this.$bus.$emit('toFormValid', 'Exam')
      if (this.formValid) {
        if (this.operateType === 'add') {
          console.log(this.operateFormData)
          delete this.operateFormData.exam_id
          postFormData('/examManage/addOneExam', this.operateFormData).then((resp) => {
            if (resp.data.code === 0) {
              this.$message({type: 'success', message: resp.data.message});
              this.isShow = false;
              this.search()
            } else this.$message({type: 'warning', message: resp.data.message});
          })
        } else if (this.operateType === 'edit') {
          postFormData('/examManage/modifyOneExam', this.operateFormData).then((resp) => {
            if (resp.data.code === 0) {
              this.$message({type: 'success', message: resp.data.message});
              this.isShow = false;
              this.search()
            } else this.$message({type: 'warning', message: resp.data.message});
          })
        }
      }
    },
    addExam() {
      this.operateType = 'add';
      this.isShow = true;
      this.operateFormData = {}
      this.selectedPapers = []
      this.loadPaperData()
    },
    editExam(row) {
      this.operateType = 'edit';
      this.isShow = true;
      this.loadPaperData()
      this.getOneExam(row)
    },
    delExam(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getFormData('/examManage/deleteOneExam', {examId: row.exam_id}).then((resp) => {
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
    this.$bus.$on('returnFormValidExam', (data) => {
      this.formValid = data
    })
  },
  beforeDestroy() {
    this.$bus.$off('returnFormValidExam')
  }
}

</script>

<style scoped>
</style>