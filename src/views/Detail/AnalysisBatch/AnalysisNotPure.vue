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
    <el-select v-model="notPure_fp.sampleType" clearable placeholder="请选择样品类型" style="margin-top: 10px">
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
    <el-form ref="logBaseForm" :inline="true" :model="notPure_fp" :rules="rules" label-width="55px"
             style="margin-top: 10px">
      <el-form-item label="底数" prop="logBase">
        <el-input v-model="notPure_fp.logBase" class="input-box" placeholder="请输入log的底数，默认为10"></el-input>
      </el-form-item>
    </el-form>
    <el-descriptions :column="2" border title="">
      <el-descriptions-item>
        <template slot="label">频繁项信息文件（测试集）</template>
        <el-button plain size="mini" type="primary" @click="generateTestCSV">生成文件</el-button>
        <el-button plain size="mini" type="primary" @click="downloadTestCSV">下载test.csv</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">热力图</template>
        <el-button plain size="mini" style="margin-left: 10px" type="primary" @click="generateHeatMap">
          生成热力图
        </el-button>
        <el-button plain size="mini" style="margin-left: 10px" type="primary" @click="downloadHeatMapData">
          下载热力图数据文件
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">溯源样品</template>
        <div>当前全批次最优模型为{{ notPure_fp.bestModel.label }}，默认选择最优模型分析</div>
        <div style="display: flex; margin-top: 5px">
          <el-select v-model="notPure_fp.selectModel" clearable placeholder="请选择模型" size="mini">
            <el-option v-for="item in notPure_fp.modelList" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-button plain size="mini" style="margin-left: 5px" type="primary" @click="downloadTraceResult">
            生成并下载溯源结果文件
          </el-button>
          <el-button plain size="mini" style="margin-left: 5px" type="primary" @click="generateBarChart">
            生成柱状图
          </el-button>
          <el-button plain size="mini" style="margin-left: 5px" type="primary" @click="updateBestModel">
            更新其为最优模型
          </el-button>
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <el-tabs v-model="tabActiveName" style="margin-top: 20px" type="border-card">
      <el-tab-pane label="热力图" name="HeatMap">
        <HeatMapNotPure :heat-map-info="heatMapInfo" heat-map-id="heatMapNotPure"></HeatMapNotPure>
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
          {prop: "Vf", label: '定容体积Vf(ml)'},
          {prop: "Df", label: '稀释倍数Df'},
          {prop: "m", label: '称样质量m(mg)'},
        ],
        supportX_config: [
          {prop: "sampleName", label: '样品名'},
          {prop: "type", label: '样品类型'},
          {prop: "support", label: '支持度 x'},
          {prop: "substanceMass", label: '配置样品物质及质量'},
          {prop: "fileName", label: '样品文件名'},
          {prop: "Vf", label: '定容体积Vf(ml)'},
          {prop: "Df", label: '稀释倍数Df'},
          {prop: "m", label: '称样质量m(mg)'},
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
        console.log(this.notPure_fp.selectRow)
      }
    })
  },
  async activated() {
    await postRequestJSON('/batch/getBatchListStandard').then((resp) => {
      this.batchListStandard = resp.data.result.batchList
    })
  },
  watch: {
    'notPure_fp.sampleType': {
      handler() {
        this.notPure_fp.fileId = "";
        this.notPure_fp.selectRow = "";
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
        this.notPure_fp.fileId = "";
        this.notPure_fp.selectRow = "";
        if (this.batchInfo.batchId !== "") {
          this.getModelList()
        }
      }
    }
  },
  methods: {
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
    // 非纯物质，在该x下生成并下载test.csv文件
    async generateTestCSV() {
      if (this.notPure_fp.fileId === "") {
        this.$message.error("请选择样品")
        return
      }
      await this.$refs.logBaseForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '执行中，请等一会儿~',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          postRequestJSON('/analysis/generateTestCSV', {
            fileId: this.notPure_fp.fileId,
            sampleType: this.notPure_fp.sampleType,
            logBase: this.notPure_fp.logBase,
          }).then((resp) => {
            loading.close();
            if (resp.data.code === 0) {
              this.$message.success(resp.data.message)
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
        } else {
          return false
        }
      })
    },
    downloadTestCSV() {
      if (this.notPure_fp.fileId === "") {
        this.$message.error("请选择样品")
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
          postRequestJSON('/fileExist/testCSV', {
            fileId: this.notPure_fp.fileId,
            sampleType: this.notPure_fp.sampleType,
            logBase: this.notPure_fp.logBase,
          }).then((resp) => {
            loading.close();
            if (resp.data.code === 0) {
              this.$message.success(resp.data.message)
              postRequestJSON('/download/testCSV', {
                fileId: this.notPure_fp.fileId,
                sampleType: this.notPure_fp.sampleType,
                logBase: this.notPure_fp.logBase,
              }).then((resp) => {
                downloadCSV(resp,
                    "test-" +
                    this.batchInfo.batchId + "_" +
                    this.notPure_fp.sampleType + "_" +
                    this.notPure_fp.selectRow.sampleName + "_" +
                    this.notPure_fp.selectRow.support +
                    this.notPure_fp.logBase)
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
        } else return false;
      })
    },
    // 获取模型列表
    getModelList() {
      postRequestJSON('/batch/getModelList', {
        batchId: this.batchInfo.batchId,
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
      const loading = this.$loading({
        lock: true,
        text: '执行中，请等一会儿~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      postRequestJSON('/analysis/updateBestModel', {
        groupId: this.notPure_fp.selectModel
      }).then((resp) => {
        loading.close();
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
      if (this.notPure_fp.fileId === "") {
        this.$message.error("请选择样品")
        return
      }
      this.$refs.logBaseForm.validate((valid) => {
        if (valid) {
          this.tabActiveName = "HeatMap"
          this.heatMapInfo = {
            type: 'notPure',
            groupId: "",
            fileId: this.notPure_fp.fileId,
            heatMapType: "",
            logBase: this.notPure_fp.logBase
          }
        } else return false;
      })
    },
    // 下载热力图数据文件
    downloadHeatMapData() {
      if (this.notPure_fp.fileId === "") {
        this.$message.error("请选择样品")
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
          postRequestJSON('/fileExist/heatMapDataCSV', {
            id: this.notPure_fp.fileId,
            sampleType: "notPure",
            substanceType: "",
            logBase: this.notPure_fp.logBase
          }).then((resp) => {
            loading.close();
            if (resp.data.code === 0) {
              this.$message.success(resp.data.message)
              postRequestJSON('/download/heatMapDataCSV', {
                id: this.notPure_fp.fileId,
                sampleType: "notPure",
                substanceType: "",
                logBase: this.notPure_fp.logBase
              }).then((resp) => {
                downloadCSV(resp,
                    "HeatMapData-" +
                    this.batchInfo.batchId + "_" +
                    this.notPure_fp.sampleType + "_" +
                    this.notPure_fp.logBase)
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

        } else return false;
      })
    },
    // 生成柱状图
    generateBarChart() {
      if (this.notPure_fp.fileId === "") {
        this.$message.error("请选择样品")
        return
      }
      if (this.notPure_fp.bestModel === "") {
        this.$message.warning("最优模型为空，请选择一个模型并更新其为最优模型")
        return
      }
      this.$refs.logBaseForm.validate((valid) => {
        if (valid) {
          this.tabActiveName = "BarChart"
          this.$bus.$emit("drawBarChart", {groupId: this.notPure_fp.selectModel, batchId: this.batchInfo.batchId})
        }
      })
    },
    // 下载溯源文件
    downloadTraceResult() {
      if (this.notPure_fp.fileId === "") {
        this.$message.error("请选择样品")
        return
      }
      if (this.notPure_fp.bestModel === "") {
        this.$message.warning("最优模型为空，请选择一个模型并更新其为最优模型")
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
          postRequestJSON('/fileExist/traceResultCSV', {
            groupId: this.notPure_fp.selectModel,
            batchId: this.batchInfo.batchId,
          }).then((resp) => {
            loading.close();
            if (resp.data.code === 0) {
              this.$message.success(resp.data.message)
              postRequestJSON('/download/traceResultCSV', {
                groupId: this.notPure_fp.selectModel,
                batchId: this.batchInfo.batchId,
              }).then((resp) => {
                downloadCSV(resp,
                    "trace_result-" +
                    this.batchInfo.batchId + "_" +
                    this.notPure_fp.selectModel)
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
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.div {
  margin-top: 10px;
}
</style>