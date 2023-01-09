<template>
  <div>
    <h3>上传样品文件</h3>
    <el-form ref="sampleForm" :model="sampleInfo" :rules="rules" label-width="100px">
      <el-form-item label="批次名称" prop="batch">
        {{ sampleInfo.batchName }}
      </el-form-item>
      <el-form-item label="样品状态" prop="batch">
        {{ sampleInfo.sampleState === "solid" ? "固态" : "液态" }}
      </el-form-item>
      <el-row>
        <el-col :span=6>
          <el-form-item label="采样时间" label-width="100px" prop="experimentTime">
            <el-input v-model="sampleInfo.experimentTime"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=6>
          <el-form-item label="采样位置" label-width="100px" prop="position">
            <el-input v-model="sampleInfo.position"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="样品类型" prop="sampleType">
        <el-select v-model="sampleInfo.sampleType" clearable placeholder="请选择样品类型">
          <el-option
              v-for="item in sampleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :style="{display: substanceTypeShow}" label="物质类型" prop="substanceType">
        <el-select v-model="sampleInfo.substanceType" clearable placeholder="请选择物质类型" @change="resolveBug">
          <el-option
              v-for="item in sampleInfo.substanceList"
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
          <el-input v-model="item.substanceMass" :placeholder="placeHolder"></el-input>
        </el-form-item>
      </div>
      <el-row>
        <el-col :span=8>
          <el-form-item label="定容体积 Vf" label-width="100px" prop="Vf" :style="{display: VfShow}">
            <el-input style="width: 80%" v-model="sampleInfo.Vf" placeholder="单位：ml"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=8>
          <el-form-item label="稀释倍数 Df" label-width="100px" prop="Df" :style="{display: DfShow}">
            <el-input style="width: 80%" v-model="sampleInfo.Df"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=8>
          <el-form-item label="称样质量 m" label-width="100px" prop="m" :style="{display: mShow}">
            <el-input style="width: 80%" v-model="sampleInfo.m" placeholder="单位：mg"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="样品文件" prop="file">
        <el-upload
            ref="upload"
            :auto-upload="false"
            :file-list="fileList"
            :http-request="httpRequest"
            :limit="2"
            :multiple="false"
            :on-change="handleChange"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            accept="text/csv"
            action=""
            class="upload-demo">
          <el-button slot="trigger" plain size="small" type="primary">选取文件</el-button>
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
      placeHolder: "",
      configShow: "none",
      substanceTypeShow: "none",
      VfShow: "none",
      DfShow: "none",
      mShow: "none",
      sampleInfo: {
        batchId: "",
        batchName: "",
        sampleState: "",
        experimentTime: "",
        position: "",
        sampleType: "",
        substanceType: "",
        dynamicItem: [],
        substanceList: [],
        Vf: "", Df: "", m: ""
      },
      fileList: [],
      sampleOptions: [
        {value: 'StandardSample', label: '标准样品'},
        {value: 'PureSample', label: '源样品'},
        {value: 'ConfigSample', label: '配置样品'},
        {value: 'TrueSample', label: '样品'},
      ],
      rules: {
        experimentTime: [{required: true, message: "请输入采样时间", trigger: "blur"}],
        position: [{required: true, message: "请输入采样位置", trigger: "blur"}],
        sampleType: [{required: true, message: "请选择样品类型", trigger: "blur"}],
        substanceType: [{required: true, message: "请选择物质类型", trigger: "blur"}],
        Vf: [{required: true, message: "请输入内容", trigger: "blur"}],
        Df: [{required: true, message: "请输入内容", trigger: "blur"}],
        m: [{required: true, message: "请输入内容", trigger: "blur"}],
      },
      vali: valiNumDotPass
    }
  },
  watch: {
    'sampleInfo.sampleState': {
      handler() {
        if (this.sampleInfo.sampleState === 'solid')
          this.placeHolder = '请输入质量（单位：mg）'
        else if (this.sampleInfo.sampleState === 'liquid')
          this.placeHolder = '请输入体积（单位：ml）'
      }
    },
    'sampleInfo.sampleType': {
      handler() {
        this.fileList = []
        if (this.sampleInfo.sampleType === "ConfigSample") {
          this.configShow = ""
          this.substanceTypeShow = "none"
          if (this.sampleInfo.sampleState === 'solid') {
            this.VfShow = ""
            this.DfShow = ""
            this.mShow = ""
            this.sampleInfo.Vf = ""
            this.sampleInfo.Df = ""
            this.sampleInfo.m = ""
          } else {
            this.VfShow = "none"
            this.DfShow = ""
            this.mShow = "none"
            this.sampleInfo.Vf = "temp"
            this.sampleInfo.Df = ""
            this.sampleInfo.m = "temp"
          }
          this.sampleInfo.substanceType = "temp"
          this.sampleInfo.dynamicItem = [];
          for (let i = 0; i < this.sampleInfo.substanceList.length; i++) {
            this.sampleInfo.dynamicItem.push({
              substanceName: this.sampleInfo.substanceList[i].label,
              substanceMass: "",
            })
          }
        } else if (this.sampleInfo.sampleType === "PureSample") {
          this.configShow = "none"
          this.substanceTypeShow = ""
          if (this.sampleInfo.sampleState === 'solid') {
            this.VfShow = ""
            this.DfShow = ""
            this.mShow = ""
            this.sampleInfo.Vf = ""
            this.sampleInfo.Df = ""
            this.sampleInfo.m = ""
          } else {
            this.VfShow = "none"
            this.DfShow = ""
            this.mShow = "none"
            this.sampleInfo.Vf = "temp"
            this.sampleInfo.Df = ""
            this.sampleInfo.m = "temp"
          }
          this.sampleInfo.substanceType = ""
          this.sampleInfo.dynamicItem = []
          this.sampleInfo.dynamicItem.push({
            substanceName: "temp",
            substanceMass: 123
          })
        } else if (this.sampleInfo.sampleType === "StandardSample") {
          this.configShow = "none"
          this.substanceTypeShow = "none"
          this.VfShow = "none"
          this.DfShow = "none"
          this.mShow = "none"
          this.sampleInfo.substanceType = "temp"
          this.sampleInfo.dynamicItem = []
          this.sampleInfo.dynamicItem.push({
            substanceName: "temp",
            substanceMass: 123
          })
          this.sampleInfo.Vf = "temp"
          this.sampleInfo.Df = "temp"
          this.sampleInfo.m = "temp"
        } else {
          this.configShow = "none"
          this.substanceTypeShow = "none"
          if (this.sampleInfo.sampleState === 'solid') {
            this.VfShow = ""
            this.DfShow = ""
            this.mShow = ""
            this.sampleInfo.Vf = ""
            this.sampleInfo.Df = ""
            this.sampleInfo.m = ""
          } else {
            this.VfShow = "none"
            this.DfShow = ""
            this.mShow = "none"
            this.sampleInfo.Vf = "temp"
            this.sampleInfo.Df = ""
            this.sampleInfo.m = "temp"
          }
          this.sampleInfo.substanceType = "temp"
          this.sampleInfo.dynamicItem = []
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
    this.sampleInfo.sampleState = this.$route.query.sampleState;
    await this.getBatchInfo();
  },
  methods: {
    async getBatchInfo() {
      await postRequestJSON('/batch/getBatchInfo', {batchId: this.$route.query.batchId}).then((resp) => {
        if (resp.data.code === 0) {
          this.sampleInfo.experimentTime = resp.data.result.batchInfo.experimentTime
          this.sampleInfo.position = resp.data.result.batchInfo.position
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
          uploadData.append('sampleState', this.sampleInfo.sampleState)
          uploadData.append('sampleType', this.sampleInfo.sampleType)
          uploadData.append('substanceType', this.sampleInfo.substanceType)
          uploadData.append('substanceList', JSON.stringify(this.sampleInfo.dynamicItem))
          uploadData.append('Vf', this.sampleInfo.Vf)
          uploadData.append('Df', this.sampleInfo.Df)
          uploadData.append('m', this.sampleInfo.m)

          // for (let [a, b] of uploadData.entries()) {
          //   console.log(a, b, '--------------');
          // }

          const loading = this.$loading({
            lock: true,
            text: '执行中，请等一会儿~',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          postRequestFormData('/sample/postSampleInfo', uploadData).then((resp) => {
            loading.close();
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
        sampleType: "warning",
      }).then(() => {
        this.$router.back();
      });
    },
    clear() {
      this.configShow = "none"
      this.sampleInfo = {
        batchId: "",
        batchName: "",
        sampleState: "",
        sampleType: "",
        substanceType: "",
        dynamicItem: [],
        substanceList: [],
        Vf: "", Df: "", m: ""
      }
      this.fileList = []
    },
    resolveBug() {
      this.$forceUpdate();
    }
  }
}
</script>

<style>
</style>