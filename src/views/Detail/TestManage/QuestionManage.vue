<template>
  <div>
    <!-- 收集表单 -->
    <el-dialog ref="dialog" :title="operateType === 'add' ? '新增试题' : '试题信息'" :visible.sync="isShow">
      <!-- <common-form ref="operateFormData" :formData="operateFormData" :formLabel="operateFormLabel" :inline="false">
      </common-form> -->
      <el-form ref="operateFormData" :model="operateFormData" :rules="rules" label-width="110px" :inline="false">
        <el-row>
          <el-form-item  label="题干" prop="title">
            <el-input type="" v-model="operateFormData.title" placeholder='请输入试题题干'>
            </el-input>
          </el-form-item>
        </el-row>
        <!-- <el-row>
          <el-form-item v-show="operateType === 'edit'" label="疾病类型" prop="disease_type_name">
            {{ operateFormData.disease_type_name }}
          </el-form-item>
        </el-row> -->
        <el-row>
          <el-form-item label="疾病类型" prop="disease_type_id">
            <el-cascader
              v-model="selectedValues"
              :options="options"
              :show-all-levels="false"
              :props="{ expandTrigger: 'hover' }"
              @change="handleAddQuestionChange"
              placeholder="请选择疾病分类"
              clearable
            ></el-cascader>
            <!-- <cascader
              :url="url"
              @change="handleAddQuestionChange"
            ></cascader> -->
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item  label="A选项" prop="optionA">
            <el-input v-model="operateFormData.optionA" placeholder='请输入选项'>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item  label="B选项" prop="optionB">
            <el-input v-model="operateFormData.optionB" placeholder='请输入选项'>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item  label="C选项" prop="optionC">
            <el-input v-model="operateFormData.optionC" placeholder='请输入选项'>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item  label="D选项" prop="optionD">
            <el-input v-model="operateFormData.optionD" placeholder='请输入选项'>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item  label="正确答案" prop="answer">
            <el-radio-group v-model="operateFormData.answer">
              <el-radio label="1">A</el-radio>
              <el-radio label="2">B</el-radio>
              <el-radio label="3">C</el-radio>
              <el-radio label="4">D</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
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
          @change="handleChange"
          @clear="handleClear"
        ></cascader>
        </el-form-item>
      <el-form-item>
        <el-input v-model="input" placeholder="请输入" maxlength="20" show-word-limit></el-input>
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
      // formValid: true,
      input: "",
      selectedValues: [],
      options: [
            {
                value: "", // 第一级别选项的值为空
                label: "", // 第一级别选项的标签为空
                children: [] // 第一级别选项没有子选项
            }
        ],
      // 表单配置，显示在页面的所有内容
      rules: {
        // {model: "disease_type_name", label: "疾病名", type: "textarea", 
        //   rules:[{ required: true, message: '请选择疾病分类', trigger: 'change' }]},
        disease_type_id: [{required: true, message: '请选择疾病类型', trigger: 'change'}],
        title: [{ required: true, message: '请输入题干', trigger: 'blur' },
          { min: 2, max: 500, message: '题干最少2个字符，最多500个字符', trigger: 'blur' }],
        optionA:[{ required: true, message: '请输入选项', trigger: 'blur' },
          { min: 1, max: 200, message: '最多不超过200个字符', trigger: 'blur' }],
        optionB:[{ required: true, message: '请输入选项', trigger: 'blur' },
          { min: 1, max: 200, message: '最多不超过200个字符', trigger: 'blur' }],
        optionC:[{ required: true, message: '请输入选项', trigger: 'blur' },
          { min: 1, max: 200, message: '最多不超过200个字符', trigger: 'blur' }],
        optionD:[{ required: true, message: '请输入选项', trigger: 'blur' },
          { min: 1, max: 200, message: '最多不超过200个字符', trigger: 'blur' }],
        answer:[{ required: true, message: '请选择正确答案', trigger: 'change' },]
      },
      // 表单数据，不一定都显示，但会传回后端
      operateFormData: {
        question_id: "",
        disease_type_name: "",
        disease_type_id: 0,
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
        {prop: "question_id", label: '试题编号'},
        {prop: "disease_type_name", label: '疾病类型'},
        {prop: "title", label: '题干'},
      ]
    };
  },
  methods: {
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search()
    },
    handleChange(value) {
      console.log(value)
      this.disease_type_id = value[1]
      this.search()
    },
    handleClear(value) {
      this.disease_type_id = -1
      this.search()
    },
    handleAddQuestionChange(value) {
      this.selectedValues = value
      console.log(this.selectedValues)
      this.operateFormData.disease_type_id = value[1]
    },
    loadOptions() {
      this.selectedValues = []
      getFormData(this.url,{}).then((resp) => {
          // console.log(resp.data.data)
          this.options = []
          this.updateCascaderData(resp.data.result.disease_types)
          console.log("default: "+this.operateFormData.disease_type_id)
          if(this.operateFormData.disease_type_id !== -1 && this.operateFormData.disease_type_id !== undefined) {
              const matchedOption = this.findOptionByValue(this.operateFormData.disease_type_id)
              console.log(matchedOption)
              if(matchedOption) {
                  this.selectedValues = matchedOption
              }
          }
      })
    },
    updateCascaderData(response) {
      const diseaseTypes = response;
      diseaseTypes.forEach(type => {
          const typeObj = {
              value: type.disease_id,
              label: type.disease_type,
              children: []
          };
          type.children.forEach(child => {
              typeObj.children.push({
              value: child.disease_type_id,
              label: child.disease_type_name
              });
          });
          
          this.options.push(typeObj);
          // console.log(typeObj)
      });
    },
    findOptionByValue(value) {
        let path = []
        for(let i = 0; i < this.options.length; i++) {
          var option = this.options[i]
          var children = option.children
          for(let j = 0; j < children.length; j++) {
            if(children[j].value === value) {
              path.push(i)
              path.push(children[j].value)
              return path
            }
          }
        }
        return path
    },
    getOneQuetion(row) {
      console.log(row.question_id)
      getFormData('/examManage/getOneQuestion', {question_id: row.question_id}).then((resp) => {
        console.log(resp.data.result.question_info)
        this.operateFormData = resp.data.result.question_info
      })
    },
    search() {
      console.log(this.disease_type_id+" "+this.input)
      if(this.disease_type_id === undefined) {
        this.disease_type_id = -1
      }
      postFormData('/examManage/searchQuestion', {disease_type_id: this.disease_type_id, search_text: this.input, currentPage: this.currentPage}).then((resp) => {
        this.tableData = resp.data.result.infos
        this.totalPages = resp.data.result.totalPages
        this.currentPage = resp.data.result.currentPage
      })
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          if (this.operateType === 'add') {
          delete this.operateFormData.question_id
          postFormData('/examManage/addOneQuestion', this.operateFormData).then((resp) => {
            if (resp.data.code === 0) {
              this.$message({type: 'success', message: resp.data.message});
              this.isShow = false;
              this.search()
            } else this.$message({type: 'warning', message: resp.data.message});
          })
          } else if (this.operateType === 'edit') {
            postFormData('/examManage/modifyOneQuestion', this.operateFormData).then((resp) => {
              if (resp.data.code === 0) {
                this.$message({type: 'success', message: resp.data.message});
                this.isShow = false;
                this.search()
              } else this.$message({type: 'warning', message: resp.data.message});
            })
          }
        }
      });
    },
    addQuestion() {
      this.operateType = 'add';
      this.isShow = true;
      this.$refs.dialog.$emit('open');
      if(this.$refs.operateFormData !== undefined)
        this.$refs.operateFormData.resetFields();// 在这里重置表单校验状态
      this.operateFormData = {}
      this.loadOptions()
    },
    editQuestion(row) {
      this.operateType = 'edit';
      this.isShow = true;
      this.loadOptions()
      this.$refs.dialog.$emit('open');
      if(this.$refs.operateFormData !== undefined)
        this.$refs.operateFormData.resetFields();// 在这里重置表单校验状态
      this.getOneQuetion(row)
      this.loadOptions()
      // console.log(this.operateFormData)
    },
    delQuestion(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getFormData('/examManage/deleteOneQuestion', {question_id: row.question_id}).then((resp) => {
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
    // this.$bus.$on('returnFormValidQuestion', (data) => {
    //   this.formValid = data
    // })
  },
  // beforeDestroy() {
  //   this.$bus.$off('returnFormValidQuestion')
  // }
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