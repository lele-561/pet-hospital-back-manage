<template>
  <div>
    <h3>上传样品文件</h3>
    <el-form ref="sampleForm" :model="sampleInfo" :rules="rules" label-width="100px">
      <el-form-item label="批次名" prop="batch">
        {{ sampleInfo.batchName }}
      </el-form-item>
      <el-form-item label="样品类型" prop="type">
        <el-select clearable v-model="sampleInfo.type" placeholder="请选择样品类型">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!--      表单校验：prop和v-model的值要相同-->
      <div v-for="(item,index) in sampleInfo.dynamicItem" :key="index" style="display: flex">
        <el-form-item :label="item.substanceName"
                      :prop="'dynamicItem.'+index+'.substanceMass'"
                      :rules="{required:true, validator:vali, trigger:'blur'}"
                      :style="{ display: configShow}">
          <el-input v-model="item.substanceMass" placeholder="请输入质量（单位：mg）"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="样品名" prop="sampleName">
        <el-input v-model="sampleInfo.sampleName"></el-input>
      </el-form-item>
      <el-form-item label="样品文件" prop="file">
        <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :limit="2"
            :multiple="false"
            accept="text/csv"
            :http-request="httpRequest"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="fileList"
            :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUpload">{{ "上传" }}</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {postRequestFormData, postRequestJSON} from '../../utils/api';

export default {
  name: 'PostSample',
  data() {
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
      configShow: "none",
      sampleInfo: {
        batchId: "",
        batchName: "",
        sampleName: "",
        type: "",
        dynamicItem: [],
        substanceList: []
      },
      fileList: [],
      options: [
        {value: 'StandardSample', label: '标准样品'},
        {value: 'PureSample', label: '纯样品'},
        {value: 'ConfigSample', label: '配置样品'},
        {value: 'TrueSample', label: '真实样品'},
      ],
      rules: {
        sampleName: [{required: true, message: "请输入样品名", trigger: "blur"}],
        type: [{required: true, message: "请选择样品类型", trigger: "blur"}],
      },
      vali: valiNumDotPass
    }
  },
  watch: {
    'sampleInfo.type': {
      handler() {
        this.sampleInfo.sampleName = ""
        this.fileList = []
        if (this.sampleInfo.type === "ConfigSample") {
          this.configShow = "";
          this.sampleInfo.dynamicItem = [];
          for (let i = 0; i < this.sampleInfo.substanceList.length; i++) {
            this.sampleInfo.dynamicItem.push({
              substanceName: this.sampleInfo.substanceList[i].label,
              substanceMass: "",
            })
          }
        } else {
          this.configShow = "none";
          this.sampleInfo.dynamicItem = [];
          this.sampleInfo.dynamicItem.push({
            substanceName: "temp",
            substanceMass: 123
          })
        }
      }
    },
  },
  async activated() {
    this.clear()
    this.sampleInfo.batchId = this.$route.query.batchId;
    this.sampleInfo.batchName = this.$route.query.batchName;
    await this.getBatchInfo();
  },
  methods: {
    async getBatchInfo() {
      await postRequestJSON('/batch/getBatchInfo', {batchId: this.$route.query.batchId}).then((resp) => {
        if (resp.data.code === 0) {
          this.sampleInfo.dynamicItem = []
          this.sampleInfo.substanceList = resp.data.result.batchInfo.substanceList
          for (let i = 0; i < resp.data.result.batchInfo.substanceList.length; i++) {
            this.sampleInfo.dynamicItem.push({
              substanceName: resp.data.result.batchInfo.substanceList[i].label,
              substanceMass: "",
            })
          }
        } else {
          this.$message.warning(resp.data.message)
        }
      });
    },
    // 文件上传
    httpRequest(param) { // submitUpload重复调用httpRequest，达到效果
    },
    handleBeforeUpload(file) {
      if (this.fileList.length !== 1)
        this.$message.error(`只允许上传1个文件`);
    },
    handleSuccess(res, file) {
    },
    handleChange(file, fileList) {
      if (this.$refs.upload.uploadFiles.length > 1)
        this.$refs.upload.uploadFiles.shift()
      if (this.$refs.upload.uploadFiles.length > 0)
        this.fileList = this.$refs.upload.uploadFiles
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      console.log(this.fileList)
    },
    handlePreview(file) {
    },
    handleExceed() {
      this.$message.error(`只允许上传1个文件`);
    },
    async submitUpload() {
      if (this.fileList.length !== 1) {
        this.$message.error("请选择文件！！")
        return
      }
      await this.$refs.sampleForm.validate((valid) => {
        if (valid) {
          let uploadData = new FormData(); // 用FormData存放上传文件
          this.fileList.forEach(file => {
            uploadData.append('sampleFile', file.raw)
          })
          uploadData.append('batchId', this.sampleInfo.batchId)
          uploadData.append('sampleName', this.sampleInfo.sampleName)
          uploadData.append('substanceList', JSON.stringify(this.sampleInfo.dynamicItem))
          uploadData.append('type', this.sampleInfo.type)

          for (let [a, b] of uploadData.entries()) {
            console.log(a, b, '--------------');
          }

          postRequestFormData('/sample/postSampleInfo', uploadData).then((resp) => {
            if (resp.data.code === 0) {
              this.$message.success(resp.data.message)
              this.$router.back();
            } else {
              this.$message.error(resp.data.message)
              this.$router.back();
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
        this.$router.back();
      });
    },
    clear() {
      this.configShow = "none"
      this.sampleInfo = {
        batchId: "",
        batchName: "",
        sampleName: "",
        type: "",
        dynamicItem: [],
        substanceList: []
      }
      this.fileList = []

    }
  }
}
</script>

<style>
</style>