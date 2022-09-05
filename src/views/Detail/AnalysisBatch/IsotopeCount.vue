<template>
  <div>
    <el-select v-model="isotopeCount.sampleType" placeholder="请选择样品类型">
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
</template>

<script>
import CommonTableSingle from "../../../components/CommonTableSingle";
import {downloadCSV, postRequestJSON} from "../../../utils/api";

export default {
  name: "IsotopeCount",
  components: {CommonTableSingle},
  props: ["sampleList"],
  data() {
    return {
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
      if (data.function === 'isotopeCount') {
        this.isotopeCount.sampleId = data.sample.id;
        this.isotopeCount.selectRow = data.sample;
      }
    })
  },
  watch: {
    'isotopeCount.sampleType': {
      handler() {
        if (this.isotopeCount.sampleType === "PureSample") {
          this.isotopeCount.sampleList = this.sampleList.pureSampleList;
          this.isotopeCount.sampleLabel = this.tableLabel.normal;
        } else if (this.isotopeCount.sampleType === "TrueSample") {
          this.isotopeCount.sampleList = this.sampleList.trueSampleList;
          this.isotopeCount.sampleLabel = this.tableLabel.normal;
        } else if (this.isotopeCount.sampleType === "ConfigSample") {
          this.isotopeCount.sampleList = this.sampleList.configSampleList;
          this.isotopeCount.sampleLabel = this.tableLabel.config;
        }
      }
    },
  },
  methods: {
    runIsotopeCount() {
      postRequestJSON('/download/isotopeCount', {
        sampleId: this.isotopeCount.sampleId,
        sampleType: this.isotopeCount.sampleType
      }).then((resp) => {
        downloadCSV(resp, "number")
      });
    },
  }
}
</script>

<style  lang="less" scoped>

</style>