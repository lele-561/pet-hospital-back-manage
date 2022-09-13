<template>
  <div>
    <h3>上传样品文件</h3>
    <el-form ref="sampleForm" :model="sampleInfo" :rules="rules" label-width="100px">
      <el-form-item label="批次名" prop="batch">
        {{ sampleInfo.batchName }}
      </el-form-item>
      <el-form-item label="样品类型" prop="type">
        <el-select v-model="sampleInfo.type" clearable placeholder="请选择样品类型">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!--      表单校验：prop和v-model的值要相同-->
      <el-form-item :style="{ display: configShow }" label="煤灰" prop="substanceMass_meihui">
        <el-input v-model="sampleInfo.substanceMass_meihui" placeholder="请输入煤灰质量（单位：mg）"></el-input>
      </el-form-item>
      <el-form-item :style="{ display: configShow }" label="土壤" prop="substanceMass_turang">
        <el-input v-model="sampleInfo.substanceMass_turang" placeholder="请输入土壤质量（单位：mg）"></el-input>
      </el-form-item>
      <el-form-item :style="{ display: configShow }" label="尾气" prop="substanceMass_weiqi">
        <el-input v-model="sampleInfo.substanceMass_weiqi" placeholder="请输入尾气质量（单位：mg）"></el-input>
      </el-form-item>
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
import {postRequestFormData} from '../../utils/api';

export default {
  name: 'PostSample',
  data() {
    return {
      configShow: "none",
      sampleInfo: {
        batchId: "",
        batchName: "",
        sampleName: "",
        type: "",
        substanceMass_meihui: "",
        substanceMass_turang: "",
        substanceMass_weiqi: ""
      },
      fileList: [],
      options: [
        {value: 'StandardSample', label: '标准样品'},
        {value: 'PureSample', label: '纯样品'},
        {value: 'ConfigSample', label: '配置样品'},
        {value: 'TrueSample', label: '真实样品'},
      ],
      rules: {},
      rules1: {
        sampleName: [{required: true, message: "请输入样品名", trigger: "blur"}],
        type: [{required: true, message: "请选择样品类型", trigger: "blur"}],
      },
      rules2: {
        sampleName: [{required: true, message: "请输入样品名", trigger: "blur"}],
        substanceMass_meihui: [{required: true, message: "请输入煤灰质量", trigger: "blur"}],
        substanceMass_turang: [{required: true, message: "请输入土壤质量", trigger: "blur"}],
        substanceMass_weiqi: [{required: true, message: "请输入尾气质量", trigger: "blur"}],
        type: [{required: true, message: "请选择样品类型", trigger: "blur"}],
      },
    }
  },
  watch: {
    'sampleInfo.type': {
      handler() {
        if (this.sampleInfo.type === "ConfigSample") {
          this.configShow = "";
          this.rules = this.rules2;
        } else {
          this.configShow = "none";
          this.rules = this.rules1;
        }
      }
    },
  },
  activated() {
    this.sampleInfo.batchId = this.$route.query.batchId;
    this.sampleInfo.batchName = this.$route.query.batchName;
  },
  methods: {
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
          uploadData.append('substanceMass_meihui', this.sampleInfo.substanceMass_meihui)
          uploadData.append('substanceMass_turang', this.sampleInfo.substanceMass_turang)
          uploadData.append('substanceMass_weiqi', this.sampleInfo.substanceMass_weiqi)
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
      this.fileList = []
      this.uploadData = ""
      this.sampleInfo = {
        batchId: "",
        batchName: "",
        sampleName: "",
        type: "",
        substanceMass: {
          meihui: "",
          turang: "",
          weiqi: ""
        },
      }
    }
  }
}
</script>

<style>
</style>