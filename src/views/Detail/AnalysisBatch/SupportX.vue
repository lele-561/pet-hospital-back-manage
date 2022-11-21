<template>
  <div>
    <div class="div">
      <el-select v-model="batchInfo.batchId" clearable placeholder="请选择批次">
        <el-option v-for="item in batchListStandard" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 5px" type="primary" @click="getBatchInfo">确认</el-button>
    </div>
    <h3>已经产生的指纹文件</h3>
    <el-select v-model="supportX.sampleType" clearable placeholder="请选择样品类型">
      <el-option v-for="item in options" :key="item.value" :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <common-table v-if="isReloadData" :table-data="supportX.xSampleList"
                  :table-label="supportX.xSampleLabel"></common-table>
    <h3>生成指纹文件</h3>
    <el-select v-model="supportX.sampleType" clearable placeholder="请选择样品类型">
      <el-option v-for="item in options" :key="item.value" :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <common-table-single :table-data="supportX.sampleList"
                         :table-label="supportX.sampleLabel"
                         function="supportX"></common-table-single>
    <el-form ref="logBaseForm" :inline="true" :model="supportX" :rules="rules" label-width="80px"
             style="margin-top: 10px">
      <el-form-item label="支持度" prop="x">
        <el-input v-model="supportX.x" placeholder="请输入支持度x" style="width: 200px"></el-input>
      </el-form-item>
      <el-button type="primary" @click="runSupportX()">生成文件</el-button>
    </el-form>
  </div>
</template>

<script>
import CommonTableSingle from "../../../components/CommonTableSingle";
import CommonTable from "../../../components/CommonTable";
import {postRequestJSON} from "../../../utils/api";

export default {
  name: "SupportX",
  components: {CommonTableSingle, CommonTable},
  data() {
    //包含小数的数字
    let valiNumDotPass = (rule, value, callback) => {
      let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (value === '') {
        callback(new Error('请输入内容'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入数字'));
      } else {
        if (this.supportX.sampleType === "PureSample") {
          if (value < 0.001 || value > 0.009) {
            callback(new Error('源样品请输入范围[0.001, 0.009]内数字'))
          } else {
            callback();
          }
        } else if (this.supportX.sampleType !== "") {
          if (value < 0.01 || value > 0.01) {     // 关于为啥不能直接判断!===，我也不知道，哈哈
            callback(new Error('非源样品默认为0.01'))
          } else {
            callback();
          }
        }
      }
    };
    return {
      isReloadData: true,
      batchListStandard: [],
      batchInfo: {
        batchId: "",
        sampleList: {},
        xSampleList: {}
      },
      supportX: {
        x: "",
        sampleType: "",
        xSampleList: [],
        sampleList: [],
        xSampleLabel: [],
        sampleLabel: [],
        sampleId: "",   // 选中的样品id
        selectRow: ""
      },
      rules: {
        x: [{required: true, validator: valiNumDotPass, trigger: "blur"}]
      },
      placeHolder: "",
      options: [
        {value: 'PureSample', label: '源样品'},
        {value: 'TrueSample', label: '样品'},
        {value: 'ConfigSample', label: '配置样品'},
      ],
      tableLabel: {
        normal: [
          {prop: "sampleName", label: '样品名'},
          {prop: "fileName", label: '样品文件名'},
          {prop: "type", label: '样品类型'},
          {prop: "Vf", label: '定容体积Vf(ml)'},
          {prop: "Df", label: '稀释倍数Df'},
          {prop: "m", label: '称样质量m(mg)'},
        ],
        config: [
          {prop: "sampleName", label: '样品名'},
          {prop: "substanceMass", label: '配置样品物质及质量'},
          {prop: "fileName", label: '样品文件名'},
          {prop: "type", label: '样品类型'},
          {prop: "Vf", label: '定容体积Vf(ml)'},
          {prop: "Df", label: '稀释倍数Df'},
          {prop: "m", label: '称样质量m(mg)'},
        ],
        supportX_normal: [
          {prop: "sampleName", label: '样品名'},
          {prop: "type", label: '样品类型'},
          {prop: "support", label: '支持度 x'},
          {prop: "fileName", label: '支持度文件名'},
          {prop: "Vf", label: '定容体积Vf(ml)'},
          {prop: "Df", label: '稀释倍数Df'},
          {prop: "m", label: '称样质量m(mg)'},
        ],
        supportX_config: [
          {prop: "sampleName", label: '样品名'},
          {prop: "type", label: '样品类型'},
          {prop: "support", label: '支持度 x'},
          {prop: "substanceMass", label: '配置样品物质及质量'},
          {prop: "fileName", label: '支持度文件名'},
          {prop: "Vf", label: '定容体积Vf(ml)'},
          {prop: "Df", label: '稀释倍数Df'},
          {prop: "m", label: '称样质量m(mg)'},
        ],
      }
    }
  },
  mounted() {
    this.$bus.$on('returnSampleId', (data) => {
      if (data.function === 'supportX') {
        this.supportX.sampleId = data.sample.id;
        this.supportX.selectRow = data.sample;
      }
    })
  },
  async activated() {
    await postRequestJSON('/batch/getBatchListStandard').then((resp) => {
      this.batchListStandard = resp.data.result.batchList
    })
  },
  watch: {
    'supportX.sampleType': {
      handler() {
        this.supportX.sampleId = ""
        this.supportX.selectRow = ""
        if (this.supportX.sampleType === "PureSample") {
          this.supportX.xSampleList = this.batchInfo.xSampleList.pureSampleList;
          this.supportX.sampleList = this.batchInfo.sampleList.pureSampleList;
          this.supportX.xSampleLabel = this.tableLabel.supportX_normal;
          this.supportX.sampleLabel = this.tableLabel.normal;
        } else if (this.supportX.sampleType === "TrueSample") {
          this.supportX.xSampleList = this.batchInfo.xSampleList.trueSampleList;
          this.supportX.sampleList = this.batchInfo.sampleList.trueSampleList;
          this.supportX.xSampleLabel = this.tableLabel.supportX_normal;
          this.supportX.sampleLabel = this.tableLabel.normal;
        } else if (this.supportX.sampleType === "ConfigSample") {
          this.supportX.xSampleList = this.batchInfo.xSampleList.configSampleList;
          this.supportX.sampleList = this.batchInfo.sampleList.configSampleList;
          this.supportX.xSampleLabel = this.tableLabel.supportX_config;
          this.supportX.sampleLabel = this.tableLabel.config;
        }
      }
    },
    "batchInfo.xSampleList": {
      handler() {
        if (this.supportX.sampleType === "PureSample") {
          this.supportX.xSampleList = this.batchInfo.xSampleList.pureSampleList;
          this.supportX.sampleList = this.batchInfo.sampleList.pureSampleList;
          this.supportX.xSampleLabel = this.tableLabel.supportX_normal;
          this.supportX.sampleLabel = this.tableLabel.normal;
        } else if (this.supportX.sampleType === "TrueSample") {
          this.supportX.xSampleList = this.batchInfo.xSampleList.trueSampleList;
          this.supportX.sampleList = this.batchInfo.sampleList.trueSampleList;
          this.supportX.xSampleLabel = this.tableLabel.supportX_normal;
          this.supportX.sampleLabel = this.tableLabel.normal;
        } else if (this.supportX.sampleType === "ConfigSample") {
          this.supportX.xSampleList = this.batchInfo.xSampleList.configSampleList;
          this.supportX.sampleList = this.batchInfo.sampleList.configSampleList;
          this.supportX.xSampleLabel = this.tableLabel.supportX_config;
          this.supportX.sampleLabel = this.tableLabel.config;
        }
      }
    },
    'batchInfo.batchId': {
      handler() {
        this.supportX.sampleId = ""
        this.supportX.selectRow = ""
        this.supportX.sampleList = [];
        this.supportX.sampleLabel = []
        this.supportX.xSampleList = [];
        this.supportX.xSampleLabel = [];
        this.supportX.sampleType = ""
      }
    }
  },
  methods: {
    // 局部刷新当前页面
    reloadPart() {
      this.isReloadData = false;
      this.$nextTick(() => {
        this.isReloadData = true
      })
    },
    // 获取某一批次信息
    async getBatchInfo() {
      if (this.batchInfo.batchId === "") {
        this.$message.error("请选择批次")
        return
      }
      await postRequestJSON('/batch/getBatchInfo', {batchId: this.batchInfo.batchId}).then((resp) => {
        if (resp.data.code === 0) {
          this.batchInfo.sampleList = resp.data.result.sampleList;
          this.$message.success(resp.data.message)
        } else {
          this.$message.warning(resp.data.message)
        }
      });
      this.getSupportXList()
    },
    // 获取该批次下已经使用x生成的频繁项文件
    getSupportXList() {
      postRequestJSON('/batch/getSupportXList', {
        batchId: this.batchInfo.batchId
      }).then((resp) => {
        this.batchInfo.xSampleList = resp.data.result.sampleList;
      });
    },
    // 生成支持度x文件
    runSupportX() {
      if (this.supportX.sampleId === "" || this.supportX.sampleType === "") {
        this.$message.error("请选择信息")
        return
      }
      this.$refs.logBaseForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '执行中，请等一会儿~',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          postRequestJSON('/analysis/generateSupportXFile', {
            sampleId: this.supportX.sampleId,
            sampleType: this.supportX.sampleType,
            support: this.supportX.x,
          }).then((resp) => {
            loading.close();
            if (resp.data.code === 0) {
              // 全局事件总线，更新内容
              this.$confirm(resp.data.message, '提示', {
                confirmButtonText: '确定',
                type: 'success'
              }).then(() => {
                // this.batchInfo.batchId=""
                this.getSupportXList();   // 如果更新不好使则将id置空
              })
            } else if (resp.data.code === 1) {
              this.$confirm(resp.data.message, '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              })
            } else {
              this.$confirm(resp.data.message, '提示', {
                confirmButtonText: '确定',
                type: 'error'
              })
            }
          });
        } else return false
      })
    },
  },
}
</script>

<style lang="less" scoped>
.div {
  margin-top: 10px;
}
</style>