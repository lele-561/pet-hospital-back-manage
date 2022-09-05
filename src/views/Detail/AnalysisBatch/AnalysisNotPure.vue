<template>
  <div>
    <el-select v-model="notPure_fp.sampleType" placeholder="请选择样品类型">
      <el-option v-for="item in sampleTypeOptions" :key="item.value" :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <common-table-single :table-data="notPure_fp.xSampleList"
                         :table-label="notPure_fp.xSampleLabel"
                         function="notPure"></common-table-single>
    <h3>您当前选择的样品类型是：
      {{ notPure_fp.selectRow.type + "，x为" + notPure_fp.selectRow.support }}
    </h3>

    <el-descriptions :column="2" border title="">
      <el-descriptions-item>
        <template slot="label">频繁项信息文件（测试集）</template>
        <el-form :inline="true" ref="groupForm" :model="notPure_fp" label-width="55px" style="margin-top: 10px"
                 :rules="rules">
          <el-form-item label="底数" prop="logBase">
            <el-input class="input-box" v-model="notPure_fp.logBase" placeholder="请输入log的底数"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="generateTestCSV">生成文件</el-button>
            <el-button type="primary" size="mini" plain @click="downloadTestCSV">下载test.csv</el-button>
          </el-form-item>
        </el-form>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">热力图</template>
        <el-button style="margin-left: 10px" type="primary" size="mini" @click="generateHeatMap">
          生成热力图
        </el-button>
        <el-button style="margin-left: 10px" type="primary" size="mini" plain @click="downloadHeatMapData">
          下载热力图数据文件
        </el-button>
      </el-descriptions-item>
    </el-descriptions>
    <HeatMapNotPure heat-map-id="heatMapNotPure" :heat-map-info="HeatMapInfo"></HeatMapNotPure>
  </div>
</template>

<script>
import CommonTableSingle from "../../../components/CommonTableSingle";
import HeatMapNotPure from "../Chart/HeatMap";
import {downloadCSV, postRequestJSON} from "../../../utils/api";

export default {
  name: "AnalysisNotPure",
  components: {CommonTableSingle, HeatMapNotPure},
  props: ["xSampleList"],
  data() {
    return {
      HeatMapInfo: "",
      notPure_fp: {
        logBase: "",
        sampleType: "",
        xSampleList: [],
        xSampleLabel: [],
        fileId: "",   // 选中的supportX文件id
        selectRow: ""
      },
      sampleTypeOptions: [
        {value: 'TrueSample', label: '真实样品'},
        {value: 'ConfigSample', label: '配置样品'},
      ],
      rules: {
        logBase: [{required: true, message: "请输入log底数", trigger: "blur"}],
      },
      tableLabel: {
        supportX_normal: [
          {prop: "sampleName", label: '样品名'},
          {prop: "type", label: '样品类型'},
          {prop: "support", label: '支持度 x'},
          {prop: "fileName", label: '样品文件名'},
        ],
        supportX_config: [
          {prop: "sampleName", label: '样品名'},
          {prop: "type", label: '样品类型'},
          {prop: "support", label: '支持度 x'},
          {prop: "substanceMass", label: '煤灰 土壤 尾气（单位：mg）'},
          {prop: "fileName", label: '样品文件名'},
        ],
      }
    }
  },
  mounted() {
    this.$bus.$on('returnSampleId', (data) => {
      if (data.function === 'notPure') {
        this.notPure_fp.fileId = data.sample.id;
        this.notPure_fp.selectRow = data.sample;
      }
    })
  },
  async activated() {
  },
  watch: {
    'notPure_fp.sampleType': {
      handler() {
        if (this.notPure_fp.sampleType === "TrueSample") {
          this.notPure_fp.xSampleList = this.xSampleList.trueSampleList;
          this.notPure_fp.xSampleLabel = this.tableLabel.supportX_normal;
        } else if (this.notPure_fp.sampleType === "ConfigSample") {
          this.notPure_fp.xSampleList = this.xSampleList.configSampleList;
          this.notPure_fp.xSampleLabel = this.tableLabel.supportX_config;
        }
      }
    }
  },
  methods: {
    // 非纯物质，在该x下生成并下载test.csv文件
    generateTestCSV() {
      postRequestJSON('/analysis/generateTestCSV', {
        fileId: this.notPure_fp.fileId,
        sampleType: this.notPure_fp.sampleType,
        logBase: this.notPure_fp.logBase,
      }).then((resp) => {
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
        } else if (resp.data.code === 1)
          this.$message.info(resp.data.message)
        else this.$message.error(resp.data.message)
      });
    },
    downloadTestCSV() {
      postRequestJSON('/download/testCSV', {
        fileId: this.notPure_fp.fileId,
        sampleType: this.notPure_fp.sampleType,
        logBase: this.notPure_fp.logBase,
      }).then((resp) => {
        downloadCSV("test")
      });
    },
    // 生成热力图
    generateHeatMap() {
      this.HeatMapInfo = {
        type: 'notPure',
        groupId: "",
        fileId: this.notPure_fp.fileId,
        heatMapType: ""
      }
    },
    // 下载热力图数据文件
    downloadHeatMapData() {
      postRequestJSON('/download/heatMapDataCSV', {
        id: this.notPure_fp.fileId,
        sampleType: "notPure",
        substanceType: ""
      }).then((resp) => {
        downloadCSV(resp, "HeatMap_" + this.heatMapType)
      });
    },
  }
}
</script>

<style lang="less" scoped>

</style>