<template>
  <div>
    <h3>新建批次</h3>
    <el-form ref="batchForm" :model="batchInfo" :rules="rules" label-width="100px">
      <h4 style="margin-left:10px">基本信息</h4>
      <el-row>
        <el-col :span=6>
          <el-form-item label="批次名" prop="batchName">
            <el-input v-model="batchInfo.batchName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=6>
          <el-form-item label="实验时间" prop="experimentTime">
            <el-date-picker
                v-model="batchInfo.experimentTime"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span=6>
          <el-form-item label="采样位置" prop="position">
            <el-input v-model="batchInfo.position"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=6>
          <el-form-item label="分析类型" prop="analysisType">
            <el-select clearable v-model="batchInfo.analysisType"  placeholder="请选择分析类型">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <h4 style="margin-left:10px">实验参数</h4>
      <el-row>
        <el-col :span=6>
          <el-form-item label="数浓度 Cp" prop="Cp">
            <el-input v-model="batchInfo.Cp" placeholder="单位：个/L"></el-input>
          </el-form-item>
          <el-form-item label="流速 V" prop="V">
            <el-input v-model="batchInfo.V" placeholder="单位：ml/min"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=6>
          <el-form-item label="测试时间 T" prop="T">
            <el-input v-model="batchInfo.T" placeholder="单位：s"></el-input>
          </el-form-item>
          <el-form-item label="进样体积 Vi" prop="Vi">
            <el-input v-model="batchInfo.Vi" placeholder="单位：ml"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=6>
          <el-form-item label="定容体积 Vf" prop="Vf">
            <el-input v-model="batchInfo.Vf" placeholder="单位：ml"></el-input>
          </el-form-item>
          <el-form-item label="稀释倍数 Df" prop="Df">
            <el-input v-model="batchInfo.Df"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=6>
          <el-form-item label="称样质量 m" prop="m">
            <el-input v-model="batchInfo.m" placeholder="单位：mg"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <h4 style="margin-left:10px">上传文件</h4>
      <el-row>
        <el-col :span=24>
          <el-form-item label="同位素单位强度" prop="file">
            <el-upload
                class="upload-demo"
                ref="upload1"
                action=""
                :limit="2"
                :multiple="false"
                accept="text/csv"
                :http-request="httpRequest"
                :before-upload="handleBeforeUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove1"
                :on-change="handleChange1"
                :on-exceed="handleExceed1"
                :file-list="fileList1"
                :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传csv文件，mass_factor.csv</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="配置样品质量配比" prop="file">
            <el-upload
                class="upload-demo"
                ref="upload2"
                action=""
                :limit="2"
                :multiple="false"
                accept="text/csv"
                :http-request="httpRequest"
                :before-upload="handleBeforeUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove2"
                :on-change="handleChange2"
                :on-exceed="handleExceed2"
                :file-list="fileList2"
                :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传csv文件，configuration_samples_mass.csv</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitUpload()">{{ '新建' }}</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {postRequestFormData} from "../../utils/api";

export default {
  name: 'PostBatch',
  components: {},
  data() {
    //包含小数的数字
    let valiNumDotPass = (rule, value, callback) => {
      let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (value === '') {
        callback(new Error('请输入内容'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入数字'));
      } else {
        callback();
      }
    };
    return {
      fileList1: [],
      fileList2: [],
      uploadData: "",
      batchInfo: {
        batchName: "",
        experimentTime: "",
        position: "",
        analysisType: "",
        Cp: "", V: "", T: "", Vi: "", Vf: "", Df: "", m: "",
      },
      rules: {
        batchName: [{required: true, message: "请输入批次", trigger: "blur"}],
        experimentTime: [{required: true, message: "请输入实验时间", trigger: "blur"}],
        position: [{required: true, message: "请输入采样位置", trigger: "blur"}],
        Cp: [{required: true, validator: valiNumDotPass, trigger: "blur"}],
        V: [{required: true, validator: valiNumDotPass, trigger: "blur"}],
        T: [{required: true, validator: valiNumDotPass, trigger: "blur"}],
        Vi: [{required: true, validator: valiNumDotPass, trigger: "blur"}],
        Vf: [{required: true, validator: valiNumDotPass, trigger: "blur"}],
        Df: [{required: true, validator: valiNumDotPass, trigger: "blur"}],
        m: [{required: true, validator: valiNumDotPass, trigger: "blur"}],
        analysisType: [{required: true, message: "请选择分析类型", trigger: "blur"}],
      },
      options: [{label: '迭代法', value: 'iteration'},
        {label: '泊松法', value: 'poisson'}],
    };
  },
  activated() {
    this.clear();
  },
  methods: {
    // 文件上传
    httpRequest(param) { // submitUpload重复调用httpRequest，达到效果
    },
    handleBeforeUpload(file) {
      if (this.fileList1.length !== 1)
        this.$message.error(`只允许上传1个文件`);
      if (this.fileList2.length !== 1)
        this.$message.error(`只允许上传1个文件`);
    },
    handleSuccess(res, file) {
    },
    handleChange1(file, fileList) {
      if (this.$refs.upload1.uploadFiles.length > 1)
        this.$refs.upload1.uploadFiles.shift()
      if (this.$refs.upload1.uploadFiles.length > 0)
        this.fileList1 = this.$refs.upload1.uploadFiles
    },
    handleChange2(file, fileList) {
      if (this.$refs.upload2.uploadFiles.length > 1)
        this.$refs.upload2.uploadFiles.shift()
      if (this.$refs.upload2.uploadFiles.length > 0)
        this.fileList2 = this.$refs.upload2.uploadFiles
    },
    handleRemove1(file, fileList) {
      this.fileList1 = fileList;
    },
    handleRemove2(file, fileList) {
      this.fileList2 = fileList;
    },
    handlePreview(file) {
    },
    handleExceed1() {
      this.$message.error('只允许上传1个文件');
    },
    handleExceed2() {
      this.$message.error('只允许上传1个文件');
    },
    async submitUpload() {
      if (this.fileList1.length !== 1 && this.fileList2.length !== 1) {
        this.$message.error("请选择文件！！")
        return
      }
      await this.$refs.batchForm.validate((valid) => {
        if (valid) {
          let uploadData = new FormData(); // 用FormData存放上传文件
          this.fileList1.forEach(file => {
            uploadData.append('mass_factor', file.raw)
          })
          this.fileList2.forEach(file => {
            uploadData.append('configuration_samples_mass', file.raw)
          })
          uploadData.append('batchName', this.batchInfo.batchName)
          uploadData.append('experimentTime', this.batchInfo.experimentTime)
          uploadData.append('position', this.batchInfo.position)
          uploadData.append('analysisType', this.batchInfo.analysisType)
          uploadData.append('Cp', this.batchInfo.Cp)
          uploadData.append('V', this.batchInfo.V)
          uploadData.append('T', this.batchInfo.T)
          uploadData.append('Vi', this.batchInfo.Vi)
          uploadData.append('Vf', this.batchInfo.Vf)
          uploadData.append('Df', this.batchInfo.Df)
          uploadData.append('m', this.batchInfo.m)
          for (let [a, b] of uploadData.entries()) {
            console.log(a, b, '--------------');
          }

          postRequestFormData('/batch/postBatchInfo', uploadData).then((resp) => {
            if (resp.data.code === 0) {
              this.$message.success(resp.data.message)
              this.$router.push({path: "/batchList"});
            } else {
              this.$message.error(resp.data.message)
              this.$router.push({path: "/batchList"});
            }
          })
        } else {
          return false;
        }
      });
    },
    // 界面相关
    cancel() {
      this.$confirm("此操作将不会保存, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$router.push({path: "/batchList"});
      });
    },
    clear() {
      this.fileList1 = []
      this.fileList2 = []
      this.uploadData = ""
      this.batchInfo = {
        batchName: "",
        experimentTime: "",
        position: "",
        analysisType: "",
        Cp: "", V: "", T: "", Vi: "", Vf: "", Df: "", m: "",
      }
    },
  }
}
</script>

<style lang="less" scoped>
</style>