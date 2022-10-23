<template>
  <div>
    <div class="div">
      <el-select v-model="batchInfo.batchId" clearable placeholder="请选择批次" style="margin-top: 10px">
        <el-option v-for="item in batchListStandard" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 5px" type="primary" @click="getBatchInfo">确认</el-button>
    </div>
    <div>
      <el-select v-model="isotopeCount.sampleType" clearable placeholder="请选择样品类型" style="margin-top: 10px">
        <el-option v-for="item in options" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <common-table-single :table-data="isotopeCount.sampleList"
                           :table-label="isotopeCount.sampleLabel"
                           function="isotopeCount"></common-table-single>
      <el-button style="margin-top: 15px" type="primary" @click="runIsotopeCount()">确认执行分析并下载文件number.csv
      </el-button>
    </div>
  </div>
</template>

<script>
import CommonTableSingle from "../../../components/CommonTableSingle";
import {downloadCSV, postRequestJSON} from "../../../utils/api";

export default {
  name: "IsotopeCount",
  components: {CommonTableSingle},
  data() {
    return {
      batchListStandard: [],
      batchInfo: {
        batchId: "",
        sampleList: {}
      },
      isotopeCount: {
        sampleType: "",
        sampleList: [],
        sampleLabel: [],
        sampleId: "",   // 选中的样品id
        selectRow: ""
      },
      options: [
        {value: 'PureSample', label: '纯样品'},
        {value: 'TrueSample', label: '真实样品'},
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
      }
    }
  },
  mounted() {
    this.$bus.$on('returnSampleId', (data) => {
      if (data.function === 'isotopeCount') {
        this.isotopeCount.sampleId = data.sample.id;
        this.isotopeCount.selectRow = data.sample;
      }
    })
  },
  async activated() {
    await postRequestJSON('/batch/getBatchListStandard').then((resp) => {
      this.batchListStandard = resp.data.result.batchList
    })
  },
  watch: {
    'isotopeCount.sampleType': {
      handler() {
        this.isotopeCount.sampleId = ""
        this.isotopeCount.selectRow = ""
        if (this.isotopeCount.sampleType === "PureSample") {
          this.isotopeCount.sampleList = this.batchInfo.sampleList.pureSampleList;
          this.isotopeCount.sampleLabel = this.tableLabel.normal;
        } else if (this.isotopeCount.sampleType === "TrueSample") {
          this.isotopeCount.sampleList = this.batchInfo.sampleList.trueSampleList;
          this.isotopeCount.sampleLabel = this.tableLabel.normal;
        } else if (this.isotopeCount.sampleType === "ConfigSample") {
          this.isotopeCount.sampleList = this.batchInfo.sampleList.configSampleList;
          this.isotopeCount.sampleLabel = this.tableLabel.config;
        }
      }
    },
    'batchInfo.batchId': {
      handler() {
        this.isotopeCount.sampleList = [];
        this.isotopeCount.sampleLabel = [];
        this.isotopeCount.sampleType = ""
        this.isotopeCount.sampleId = ""
        this.isotopeCount.selectRow = ""
      }
    }
  },
  methods: {
    // 获取某一批次信息
    getBatchInfo() {
      if (this.batchInfo.batchId === "") {
        this.$message.error("请选择批次")
        return
      }
      postRequestJSON('/batch/getBatchInfo', {batchId: this.batchInfo.batchId}).then((resp) => {
        if (resp.data.code === 0) {
          this.batchInfo.sampleList = resp.data.result.sampleList;
          this.$message.success(resp.data.message)
        } else {
          this.$message.warning(resp.data.message)
        }
      });
    },
    runIsotopeCount() {
      if (this.isotopeCount.sampleId === "" || this.isotopeCount.sampleType === "") {
        this.$message.error("请选择信息")
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '执行中，请等一会儿~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      postRequestJSON('/fileExist/isotopeCount', {
        sampleId: this.isotopeCount.sampleId,
        sampleType: this.isotopeCount.sampleType
      }).then((resp) => {
        loading.close();
        if (resp.data.code === 0) {
          this.$alert(resp.data.result.string, 'number.csv文件内容', {
            confirmButtonText: '确定',
          });
          postRequestJSON('/download/isotopeCount', {
            sampleId: this.isotopeCount.sampleId,
            sampleType: this.isotopeCount.sampleType
          }).then((resp) => {
            downloadCSV(resp,
                "number-" +
                this.batchInfo.batchId + "_" +
                this.isotopeCount.sampleType + "_" +
                this.isotopeCount.selectRow.sampleName)
          });
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
    },
  }
}
</script>

<style lang="less" scoped>
.div {
  margin-top: 10px;
}
</style>