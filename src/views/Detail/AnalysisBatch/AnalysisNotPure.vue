<template>
  <div>
    <div class="div">
      <el-select clearable v-model="batchInfo.batchId" placeholder="请选择批次" style="margin-top: 10px">
        <el-option v-for="item in batchListStandard" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 5px" @click="getBatchInfo">确认</el-button>
    </div>
    <el-select clearable v-model="notPure_fp.sampleType" placeholder="请选择样品类型" style="margin-top: 10px">
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
    <el-form :inline="true" ref="logBaseForm" :model="notPure_fp" label-width="55px" style="margin-top: 10px"
             :rules="rules">
      <el-form-item label="底数" prop="logBase">
        <el-input class="input-box" v-model="notPure_fp.logBase" placeholder="请输入log的底数"></el-input>
      </el-form-item>
    </el-form>
    <el-descriptions :column="2" border title="">
      <el-descriptions-item>
        <template slot="label">频繁项信息文件（测试集）</template>
        <el-button type="primary" size="mini" plain @click="generateTestCSV">生成文件</el-button>
        <el-button type="primary" size="mini" plain @click="downloadTestCSV">下载test.csv</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">热力图</template>
        <el-button style="margin-left: 10px" type="primary" size="mini" plain @click="generateHeatMap">
          生成热力图
        </el-button>
        <el-button style="margin-left: 10px" type="primary" size="mini" plain @click="downloadHeatMapData">
          下载热力图数据文件
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">溯源样品</template>
        <div>当前最优模型为{{ notPure_fp.bestModel.label }}，默认选择最优模型分析</div>
        <div style="display: flex; margin-top: 5px">
          <el-select clearable v-model="notPure_fp.selectModel" placeholder="请选择模型" size="mini">
            <el-option v-for="item in notPure_fp.modelList" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" style="margin-left: 5px" @click="generateBarChart" size="mini" plain>
            生成柱状图
          </el-button>
          <el-button type="primary" style="margin-left: 5px" @click="downloadTraceResult" size="mini" plain>
            下载溯源结果文件
          </el-button>
          <el-button type="primary" style="margin-left: 5px" @click="updateBestModel" size="mini" plain>
            更新其为最优模型
          </el-button>
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <el-tabs v-model="tabActiveName" type="border-card" style="margin-top: 20px">
      <el-tab-pane label="热力图" name="HeatMap">
        <HeatMapNotPure heat-map-id="heatMapNotPure" :heat-map-info="heatMapInfo"></HeatMapNotPure>
      </el-tab-pane>
      <el-tab-pane label="柱状图" name="BarChart">
        <BarChart></BarChart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CommonTableSingle from "../../../components/CommonTableSingle";
import HeatMapNotPure from "../Chart/HeatMap";
import BarChart from "../Chart/BarChart";
import {downloadCSV, postRequestJSON} from "../../../utils/api";

export default {
  name: "AnalysisNotPure",
  components: {CommonTableSingle, HeatMapNotPure, BarChart},
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
    //正整数
    var valiNumPositivePass = (rule, value, callback) => {
      let reg = /^[+]{0,1}(\d+)$/g;
      if (value === '') {
        callback(new Error('请输入内容'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入0及0以上的整数'));
      } else {
        callback();
      }
    };
    return {
      batchListStandard: [],
      batchInfo: {
        batchId: "",
        sampleList: {},
        xSampleList: {}
      },
      tabActiveName: "HeatMap",
      heatMapInfo: "",
      notPure_fp: {
        logBase: "",
        sampleType: "",
        xSampleList: [],
        xSampleLabel: [],
        fileId: "",   // 选中的supportX文件id
        selectRow: "",
        selectModel: "",
        modelList: [],
        bestModel: ""
      },
      sampleTypeOptions: [
        {value: 'TrueSample', label: '真实样品'},
        {value: 'ConfigSample', label: '配置样品'},
      ],
      rules: {
        logBase: [{required: true, validator: valiNumDotPass, trigger: "blur"}],
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
          {prop: "substanceMass", label: '配置样品物质及质量'},
          {prop: "fileName", label: '样品文件名'},
        ],
      }
    }
  },
  mounted() {
    this.$bus.$on("updateModelList", this.getModelList)
    this.$bus.$on('returnSampleId', (data) => {
      if (data.function === 'notPure') {
        this.notPure_fp.fileId = data.sample.fileId;
        this.notPure_fp.selectRow = data.sample;
      }
    })
  },
  async activated() {
    await postRequestJSON('/batch/getBatchListStandard').then((resp) => {
      this.batchListStandard = resp.data.result.batchList
    })
    this.getModelList()
  },
  watch: {
    'notPure_fp.sampleType': {
      handler() {
        if (this.notPure_fp.sampleType === "TrueSample") {
          this.notPure_fp.xSampleList = this.batchInfo.xSampleList.trueSampleList;
          this.notPure_fp.xSampleLabel = this.tableLabel.supportX_normal;
        } else if (this.notPure_fp.sampleType === "ConfigSample") {
          this.notPure_fp.xSampleList = this.batchInfo.xSampleList.configSampleList;
          this.notPure_fp.xSampleLabel = this.tableLabel.supportX_config;
        }
      }
    },
    'batchInfo.batchId': {
      handler() {
        this.notPure_fp.sampleList = [];
        this.notPure_fp.sampleLabel = []
        this.notPure_fp.xSampleList = [];
        this.notPure_fp.xSampleLabel = [];
        this.notPure_fp.sampleType = "";
      }
    }
  },
  methods: {
    // 获取某一批次信息
    async getBatchInfo() {
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
    // 非纯物质，在该x下生成并下载test.csv文件
    async generateTestCSV() {
      await this.$refs.logBaseForm.validate((valid) => {
        if (valid) {
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
        } else {
          return false
        }
      })
    },
    downloadTestCSV() {
      postRequestJSON('/download/testCSV', {
        fileId: this.notPure_fp.fileId,
        sampleType: this.notPure_fp.sampleType,
        logBase: this.notPure_fp.logBase,
      }).then((resp) => {
        downloadCSV(resp, "test")
      });
    },
    // 获取模型列表
    getModelList() {
      postRequestJSON('/batch/getModelList', {
        batchId: this.batchId,
      }).then((resp) => {
        this.notPure_fp.modelList = resp.data.result.modelList;
        this.notPure_fp.bestModel = resp.data.result.bestModel;
      });
    },
    // 更新最优模型
    updateBestModel() {
      if (this.notPure_fp.selectModel === "") {
        this.$message.warning("未选择模型，无法更新")
        return
      }
      postRequestJSON('/analysis/updateBestModel', {
        batchId: this.batchId,
        modelId: this.notPure_fp.selectModel
      }).then((resp) => {
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
          this.getModelList()
        } else {
          this.$message.error(resp.data.message)
        }
      });
    },
    // 生成热力图
    generateHeatMap() {
      this.tabActiveName = "HeatMap"
      this.heatMapInfo = {
        type: 'notPure',
        modelId: "",
        fileId: this.notPure_fp.fileId,
        heatMapType: "",
        logBase: this.notPure_fp.logBase
      }
    },
    // 下载热力图数据文件
    downloadHeatMapData() {
      postRequestJSON('/download/heatMapDataCSV', {
        id: this.notPure_fp.fileId,
        sampleType: "notPure",
        substanceType: "",
        logBase: this.notPure_fp.logBase
      }).then((resp) => {
        downloadCSV(resp, "HeatMap_" + this.heatMapType)
      });
    },
    // 生成柱状图
    generateBarChart() {
      this.tabActiveName = "BarChart"
      this.$bus.$emit("drawBarChart", {modelId: this.notPure_fp.selectModel, batchId: this.batchId})
    },
    // 下载溯源文件
    downloadTraceResult() {
      postRequestJSON('/download/traceResultCSV', {
        modelId: this.notPure_fp.selectModel,
        batchId: this.batchId,
      }).then((resp) => {
        downloadCSV(resp, "trace_result")
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