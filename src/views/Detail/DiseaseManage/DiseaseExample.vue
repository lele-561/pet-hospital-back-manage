<template>
  <!-- TODO: 视频上传未尝试，多选文件上传 -->
  <div>
    <!-- 收集表单 -->
    <el-dialog ref="dialog" :title="operateType === 'add' ? '新增病例' : '病例信息'" :visible.sync="isShow">
      <!-- <common-form ref="form" :formData="operateFormData" :formLabel="operateFormLabel" :inline="false">
      </common-form> -->
      <el-form ref="operateFormData" :model="operateFormData" :rules="rules" label-width="90px" :inline="false">
        <el-form-item label="病例名" prop="disease_name">
          <el-input v-model="operateFormData.disease_name" placeholder='请输入病例名'
            :maxlength='200' show-word-limit>
          </el-input>
        </el-form-item>

        <el-form-item label="病例大类" prop="disease_type_name">
          <el-select v-model="operateFormData.disease_type_name" clearable placeholder="请选择病类" ref="selector" @change="handleChange">
            <el-option
              v-for="item in big_diseases"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="基本情况" prop="symptom">
          <el-input v-model="operateFormData.symptom" type="textarea" autosize></el-input>
        </el-form-item>

        <el-form-item label="病例检查" prop="examination">
          <el-select v-model="operateFormData.examination" multiple clearable placeholder="请选择检查项目" @change="handleExaminationChange">
            <el-option
              v-for="item in examinations"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="诊断结果" prop="diagnosis">
          <el-input v-model="operateFormData.diagnosis" type="textarea" autosize></el-input>
        </el-form-item>

        <el-form-item label="诊疗方案" prop="treatment">
          <el-select v-model="operateFormData.treatment" multiple clearable placeholder="请选择诊疗药品" @change="handleTreatmentChange">
            <el-option
              v-for="item in medicines"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="影像资料">
          <div v-if="fileList.length === 0" style="color: darkgray;">
            <span>暂无影像资料，可点击上传。</span>
          </div>
          <el-row :gutter="10">
            <el-col :span="8" v-for="(file, index) in fileList" :key="index" style="padding-bottom: 10px;" >
              <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <div class="image" v-if="file.type === 'image'">
                  <el-image  :src="file.url" ></el-image>
                </div>
                <div class="video" v-else-if="file.type === 'video'">
                  <video controls style="max-width: 100%;" :src="file.url"></video>
                </div>
                <div style="padding: 10px;">
                  <div>
                    <el-input prefix-icon="el-icon-info" size="medium" v-model="file.description"></el-input>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="上传文件">
          <el-upload
            action="https://pethospitalresources.blob.core.windows.net/pethospicalfiles/"
            list-type="text"
            :on-remove="handleRemove"
            :headers="{ 'content-type': 'multipart/form-data' }"
            :on-success="handleUploadSuccess"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            :file-list="fileList"
            :auto-upload="true"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" v-if="operateType === 'edit'" @click="delDisease('operateFormData')">删除此条病例</el-button>
        <el-button type="" @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm('operateFormData')">确定</el-button>
      </div>
    </el-dialog>

    <!-- 搜索框 -->
    <el-form :inline="true" style="margin-top:12px">
      <el-form-item>
        <el-select v-model="value" clearable placeholder="请选择病类" ref="selectorSearch" @change="handleSearchChange">
          <el-option
            v-for="item in big_diseases"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="input" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="success" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="addDisease">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <div>
      <el-row class="rowClass" v-for="(colArr, index) in rowData" :key="index" :gutter="24">
        <el-col v-for="(btn, index) in colArr" :key="btn.disease_type_id" :span="4">
          <el-button class="buttonClass" plain @click="editDisease" :id="btn.disease_type_id">{{ btn.disease_name }}</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {getFormData, postFormData} from "@/utils/api";

import CommonTableOperator from "@/components/CommonTableOperator.vue"

export default {
  name: "DiseaseInfo",
  components: {
    CommonTableOperator
  },
  data() {
    return {
      operateType: "add",
      isShow: false,
      // isFullScreen: true,
      input: "",

      // videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
      big_diseases: [],
      examinations: [],
      medicines: [],
      value: "",
      disease_type: "", //用于搜索，因为大病没有id
      fileList: [],
      
      operateFormData: {
        disease_type_id: -1,
        disease_type_name: '',
        disease_name: "",
        symptom: "",
        examination: [],
        diagnosis: "",
        treatment: [],
        file_info: [],
      },

      rules: {
        disease_type_name: [
          {required: true, message: '请选择疾病所属类型', trigger: 'change'},
          {min: 2, message: '名称不得少于2个字', trigger: 'blur'},
          {max: 20, message: '名称不得多于20个字', trigger: 'blur'}
        ],
        disease_name: [
          {required: true, message: '请填写疾病名称', trigger: 'blur'},
          {min: 2, message: '名称不得少于2个字', trigger: 'blur'},
          {max: 20, message: '名称不得多于20个字', trigger: 'blur'}
        ],
        symptom: [
          {required: true, message: '请填写病例基本情况', trigger: 'blur'},
          {min: 2, message: '基本情况不得少于2个字', trigger: 'blur'},
          {max: 500, message: '基本情况不得多于500个字', trigger: 'blur'}
        ],
        examination: [
          {required: true, message: '请选择病例相关检查项目', trigger: 'change'}
        ],
        diagnosis: [
          {required: true, message: '请填写病例诊断结果', trigger: 'blur'},
          {min: 2, message: '诊断结果不得少于2个字', trigger: 'blur'},
          {max: 500, message: '诊断结果不得多于500个字', trigger: 'blur'}
        ],
        treatment: [
          {required: true, message: '请选择病例相关诊疗方案', trigger: 'change'}
        ],
      },

      // 表格配置
      tableData: [],
      rowData: [],
      colData: [],
    };
  },
  methods: {
    handleSearchChange(value) {
      let obj = {}
      obj = this.big_diseases.find((item) => {
        return item.value === value
      }
      )
      this.disease_type = obj.label
      this.search()
    },
    handleChange(value) {
      this.operateFormData.disease_type_name = value
    },
    handleExaminationChange(value) {
    },
    handleTreatmentChange(value) {
    },
    beforeUpload(file) {
    },
    handleUploadSuccess(response, file) {
      const fileItem = {
        name: file.name,
        url: 'https://picsum.photos/300/300',
        type: 'image',
        description: ""
      };
      this.fileList.push(fileItem);
      console.log(this.fileList)
    },
    beforeRemove(file, fileList) {
        return this.$confirm(`确定移除文件“${ file.name }”吗？`,'提示');
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      if (index !== -1) {
        this.fileList.splice(index, 1);
      }
    },
    getOneDisease(e) {
      let id = e.currentTarget.getAttribute("id")
      getFormData('/diseaseManage/getOneDisease', {disease_type_id: id}).then((resp) => {
        this.operateFormData = JSON.parse(JSON.stringify(resp.data.result.disease_info))
        this.fileList = this.operateFormData.file_info
      })
    },
    loadAllData() {
      this.loadBigDiseases()
      this.loadExaminations()
      this.loadMedicines()
    },
    loadBigDiseases() { 
      getFormData('/diseaseManage/getBigDisease').then((resp) => {
        var old_resp = resp.data.result.big_disease
        for(let i = 0; i < old_resp.length; i++) {
          var temp_info = {
            value: old_resp[i], 
            label: old_resp[i]
          }
          this.big_diseases.push(temp_info)
        }
      })
    },
    loadExaminations() { 
      getFormData('/checkup/getAllCheckups', {content: '', currentPage: 0}).then((resp) => {
        this.examinations = resp.data.result.checkups
      })
      console.log(this.examinations)
    },
    loadMedicines() { 
      getFormData('/medicine/getAllMedicines', {content: '', currentPage: 0}).then((resp) => {
        this.medicines = resp.data.result.medicines
      })
      console.log(this.medicines)
    },
    search() {
      postFormData('/diseaseManage/searchDisease', {disease_type: this.disease_type, search_text: this.input, currentPage: -1}).then((resp) => {
        this.tableData = resp.data.result.infos
        this.rowData = []
        this.colData = []
        if(this.tableData.length <= 6) {
          this.rowData.push(this.tableData)
        }
        else {
          this.tableData.forEach((item, index, cols) => {
            this.colData.push(item)
            if((index + 1) % 6 === 0) {
              this.rowData.push(this.colData)
              this.colData = []
            }
          })
        }
      })
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        var file_urls = []
        var file_descriptions = []
        for(let i = 0; i < this.fileList.length; i++) {
          if(this.fileList[i].description === '') {
            this.$alert('影像资料描述不能为空！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: '已取消提交'
              });
            }
          });
          break
          }
          else {
            file_urls.push(this.fileList[i].url)
            file_descriptions.push(this.fileList[i].description)
          }
        }
        console.log(file_urls)
        console.log(file_descriptions)
        if (valid) {
          var returnExamination = this.operateFormData.examination.join(',')
          var returnTreatment = this.operateFormData.treatment.join(',')
          var returnForm = {
          disease_type_id: this.operateFormData.disease_type_id,
          disease_type_name: this.operateFormData.disease_type_name,
          disease_name: this.operateFormData.disease_name,
          symptom: this.operateFormData.symptom,
          examination: returnExamination,
          diagnosis: this.operateFormData.diagnosis,
          treatment: returnTreatment,
          file_urls: file_urls,
          file_descriptions: file_descriptions
        }
          if (this.operateType === 'add') {
            delete returnForm.disease_type_id
            console.log("add")
            console.log(returnForm)
            postFormData('/diseaseManage/addOneDisease', returnForm).then((resp) => {
              if (resp.data.code === 0) {
                this.$message({type: 'success', message: resp.data.message});
                // this.$refs.operateFormData.resetFields();
                this.isShow = false;
                this.search()
              } else this.$message({type: 'warning', message: resp.data.message});
            })
          } else if (this.operateType === 'edit') {
            // console.log(this.post_exam_info)
            console.log("edit")
            console.log(returnForm)
            postFormData('/diseaseManage/modifyOneDisease', returnForm).then((resp) => {
              if (resp.data.code === 0) {
                this.$message({type: 'success', message: resp.data.message});
                this.isShow = false;
                // this.$refs.operateFormData.resetFields();
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
    addDisease() {
      this.operateType = 'add';
      this.isShow = true;
      this.$refs.dialog.$emit('open');
      if(this.$refs.operateFormData !== undefined)
        this.$refs.operateFormData.resetFields();// 在这里重置表单校验状态
      this.operateFormData = {}
      this.fileList = []
    },
    delDisease() {
      var id = this.operateFormData.disease_type_id
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isShow = false
        console.log(id)
        getFormData('/diseaseManage/deleteOneDisease', {disease_type_id: id}).then((resp) => {
          if (resp.data.code === 0) {
            this.$message({type: 'success', message: resp.data.message});
            this.search()
          } else this.$message({type: 'warning', message: resp.data.message});
        })
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    },
    editDisease(e) {
      this.operateType = 'edit';
      this.isShow = true;
      this.$refs.dialog.$emit('open');
      if(this.$refs.operateFormData !== undefined)
        this.$refs.operateFormData.resetFields();// 在这里重置表单校验状态
      this.getOneDisease(e)

    },
  },
  mounted() {
    this.search()
    this.loadAllData()
  },
}
</script>

<style scoped>
.buttonClass {
  width : 100%;
}
.rowClass {
  padding-bottom: 10px;
}

.image {
  max-width: 100%;
  display: block;
}

.video {
  display: flex; 
  justify-content: center;
}

</style>