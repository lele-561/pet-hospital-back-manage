<template>
  <!--颗粒态分析-->
  <div>
    <div class="div">
      <el-select clearable v-model="batchInfo.batchId" placeholder="请选择批次" style="margin-top: 10px">
        <el-option v-for="item in batchListStandard" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 5px" @click="getBatchInfo">确认</el-button>
    </div>
    <div class="div">
      <el-select clearable v-model="particle.sampleType" placeholder="请选择样品类型">
        <el-option v-for="item in options" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <common-table-single style="margin-top: 10px"
                           :table-data="particle.sampleList"
                           :table-label="particle.sampleLabel"
                           function="particle"></common-table-single>
      <el-button style="margin-top: 15px" type="primary" @click="runParticle()">确认执行分析</el-button>
    </div>
  </div>
</template>

<script>
import {postRequestJSON} from "../../../utils/api";
import CommonTableSingle from "../../../components/CommonTableSingle";

export default {
  components: {CommonTableSingle},
  name: "Particle",
  data() {
    return {
      batchListStandard: [],
      batchInfo: {
        batchId: "",
        sampleList: {}
      },
      particle: {
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
        ],
        config: [
          {prop: "sampleName", label: '样品名'},
          {prop: "substanceMass", label: '煤灰 土壤 尾气（单位：mg）'},
          {prop: "fileName", label: '样品文件名'},
          {prop: "type", label: '样品类型'},
        ],
      }
    }
  },
  mounted() {
    this.$bus.$on('returnSampleId', (data) => {
      if (data.function === 'particle') {
        this.particle.sampleId = data.sample.id;
        this.particle.selectRow = data.sample;
      }
    })
  },
  async activated() {
    await postRequestJSON('/batch/getBatchListStandard').then((resp) => {
      this.batchListStandard = resp.data.result.batchList
    })
  },
  watch: {
    'particle.sampleType': {
      handler() {
        if (this.particle.sampleType === "PureSample") {
          this.particle.sampleList = this.batchInfo.sampleList.pureSampleList;
          this.particle.sampleLabel = this.tableLabel.normal;
        } else if (this.particle.sampleType === "StandardSample") {
          this.particle.sampleList = this.batchInfo.sampleList.standardSampleList;
          this.particle.sampleLabel = this.tableLabel.normal;
        } else if (this.particle.sampleType === "TrueSample") {
          this.particle.sampleList = this.batchInfo.sampleList.trueSampleList;
          this.particle.sampleLabel = this.tableLabel.normal;
        } else if (this.particle.sampleType === "ConfigSample") {
          this.particle.sampleList = this.batchInfo.sampleList.configSampleList;
          this.particle.sampleLabel = this.tableLabel.config;
        }
      }
    },
    'batchInfo.batchId': {
      handler() {
        this.particle.sampleList = [];
        this.particle.sampleLabel = [];
        this.particle.sampleType = "";
      }
    }
  },
  methods: {
    // 获取某一批次信息
    getBatchInfo() {
      postRequestJSON('/batch/getBatchInfo', {batchId: this.batchInfo.batchId}).then((resp) => {
        if (resp.data.code === 0) {
          this.batchInfo.sampleList = resp.data.result.sampleList;
          this.$message.success(resp.data.message)
        } else {
          this.$message.warning(resp.data.message)
        }
      });
    },
    runParticle() {
      postRequestJSON('/analysis/particle', {
        sampleId: this.particle.sampleId,
        sampleType: this.particle.sampleType,
      }).then((resp) => {
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
        } else if (resp.data.code === 1)
          this.$message.info(resp.data.message)
        else this.$message.error(resp.data.message)
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