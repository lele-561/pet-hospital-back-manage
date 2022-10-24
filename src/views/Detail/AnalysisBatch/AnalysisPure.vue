<template>
  <div>
    <div class="div">
      <el-select v-model="batchInfo.batchId" clearable placeholder="请选择批次" style="margin-top: 10px">
        <el-option v-for="item in batchListStandard" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <!--      这里的getBatchInfo可改成getGroupList-->
      <el-button style="margin-left: 5px" type="primary" @click="getBatchInfo">确认</el-button>
    </div>
    <h3>创建分组并生成相应文件</h3>
    <el-form ref="groupForm" :inline="true" :model="pure_fp" label-width="60px" style="margin-top: 10px">
      <div v-for="(item,index) in pure_fp.dynamicItem" :key="index" style="display: flex">
        <el-form-item :label="item.substanceName"
                      :prop="'dynamicItem.'+index+'.substanceX'"
                      :rules="{required:true, validator:vali, trigger:'blur'}">
          <el-input v-model="item.substanceX" placeholder="请输入x"></el-input>
        </el-form-item>
      </div>
      <el-form-item :rules="{required:true, validator:vali, trigger:'blur'}" label="底数"
                    prop="input_logBase">
        <el-input v-model="pure_fp.input_logBase" class="input-box" placeholder="请输入log的底数，默认为10"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="generatePureGroup">生成</el-button>
      </el-form-item>
    </el-form>
    <!--            分组列表展示-->
    <h3>选择分组</h3>
    <common-table-single :table-data="pure_fp.groupList"
                         :table-label="tableLabel.group"
                         function="pure"></common-table-single>
    <h4>您当前选择的分组是：{{ show.groupString }}</h4>
    <el-descriptions :column="4" border title="">
      <el-descriptions-item>
        <template slot="label">指纹文件fp.csv</template>
        <el-button plain size="mini" type="primary" @click="downloadFp">下载文件</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">训练集train.csv</template>
        <el-button plain size="mini" type="primary" @click="downloadTrain">下载文件</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">每种物质单位质量颗粒数</template>
        <el-button plain size="mini" type="primary" @click="downloadMassDensity">显示内容</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">配置样品物质数量比</template>
        <el-button plain size="mini" type="primary" @click="downloadConfigSamplesLabel">下载文件</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">生成模型</template>
        <el-select v-model="pure_fp.modelType" clearable placeholder="请选择模型类型" size="mini" style="width: 150px">
          <el-option v-for="item in modelTypeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button plain size="mini" style="margin-left: 10px" type="primary" @click="generateModel">生成</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">热力图</template>
        <el-select v-model="pure_fp.heatMapType" clearable placeholder="请选择样品类型" size="mini">
          <el-option v-for="item in sampleTypeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!--        <div style="display: flex;margin-top: 5px">-->
        <el-button plain size="mini" style="margin-left: 10px" type="primary" @click="generateHeatMap()">生成热力图
        </el-button>
        <el-button plain size="mini" style="margin-left: 5px" type="primary" @click="downloadHeatMapData('pure')">
          下载热力图数据文件
        </el-button>
        <!--        </div>-->
      </el-descriptions-item>
    </el-descriptions>
    <!--绘图区-->
    <HeatMapPure :heat-map-info="heatMapInfo" heat-map-id="heatMapPure"></HeatMapPure>
  </div>
</template>

<script>
import CommonTableSingle from "../../../components/CommonTableSingle";
import HeatMapPure from "../Chart/HeatMap";
import {downloadCSV, postRequestJSON} from "../../../utils/api";

export default {
  name: "AnalysisPure",
  components: {CommonTableSingle, HeatMapPure},
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
    let valiNumPositivePass = (rule, value, callback) => {
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
      },
      heatMapInfo: "",
      pure_fp: {
        modelType: "",
        dynamicItem: [],
        input_logBase: "",
        groupList: [],
        groupId: "",    // 选中的组id
        heatMapType: "",
        selectRow: ""
      },
      rules: {
        input_logBase: [{required: true, message: "请输入log底数", trigger: "blur"}],
      },
      vali: valiNumDotPass,
      tableLabel: {
        group: [
          {prop: "substance", label: '物质类型及支持度'},
          {prop: "logBase", label: 'log底数'},
          {prop: "isModel", label: '是否已经生成模型'},
        ]
      },
      sampleTypeOptions: [],
      modelTypeOptions: [
        {label: "RF", value: "RFModel"},
        {label: "XGB", value: "XGBoostModel"},
        {label: "SVM", value: "SVMModel"},
        {label: "GaussianNB", value: "GaussianNBModel"}],
      show: {
        groupString: ""
      }
    }
  },
  mounted() {
    this.$bus.$on('returnSampleId', (data) => {
      if (data.function === 'pure') {
        this.pure_fp.groupId = data.sample.id;
        this.pure_fp.selectRow = data.sample;
      }
    })
  },
  async activated() {
    await postRequestJSON('/batch/getBatchListStandard').then((resp) => {
      this.batchListStandard = resp.data.result.batchList
    })
  },
  watch: {
    'batchInfo.batchId': {
      handler() {
        this.pure_fp.groupList = []
        this.pure_fp.dynamicItem = []
        this.pure_fp.groupId = ""
        this.pure_fp.selectRow = ""
        this.pure_fp.modelType = ""
        this.show.groupString = ""
      }
    },
    'pure_fp.selectRow': {
      handler() {
        this.show.groupString = this.pure_fp.selectRow.substance + "，log底数为" + this.pure_fp.selectRow.logBase;
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
          this.pure_fp.dynamicItem = []
          for (let i = 0; i < resp.data.result.batchInfo.substanceList.length; i++) {
            this.pure_fp.dynamicItem.push({
              substanceName: resp.data.result.batchInfo.substanceList[i].label,
              substanceX: "",
            })
          }
          this.sampleTypeOptions = resp.data.result.batchInfo.substanceList;
          this.getPureGroupList();
          this.$message.success(resp.data.message)
        } else {
          this.$message.warning(resp.data.message)
        }
      });
    },
    // 获取纯物质分组列表
    getPureGroupList() {
      postRequestJSON('/batch/getPureGroupList', {
        batchId: this.batchInfo.batchId
      }).then((resp) => {
        this.pure_fp.groupList = resp.data.result.groupList;
      });
    },
    // 生成纯物质分组
    async generatePureGroup() {
      if (this.batchInfo.batchId === "" || this.pure_fp.dynamicItem.length === 0) {
        this.$message.error("请选择信息")
        return
      }
      await this.$refs.groupForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '执行中，请等一会儿~',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          postRequestJSON('/analysis/generatePureGroup', {
            batchId: this.batchInfo.batchId,
            substanceList: this.pure_fp.dynamicItem,
            logBase: this.pure_fp.input_logBase
          }).then((resp) => {
            loading.close();
            if (resp.data.code === 0) {
              this.$confirm(resp.data.message, '提示', {
                confirmButtonText: '确定',
                type: 'success'
              })
              this.getPureGroupList();
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
    // 下载n种物质的fp文件
    downloadFp() {
      if (this.pure_fp.groupId === "") {
        this.$message.error("请选择分组")
        return
      }
      // 每种物质单位质量颗粒数(列表)
      for (let i = 0; i < this.pure_fp.dynamicItem.length; i++) {
        const loading = this.$loading({
          lock: true,
          text: '执行中，请等一会儿~',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        postRequestJSON('/fileExist/fpCSV', {
          groupId: this.pure_fp.groupId,
          substanceType: this.sampleTypeOptions[i].value
        }).then((resp) => {
          loading.close();
          if (resp.data.code === 0) {
            this.$message.success(resp.data.message)
            postRequestJSON('/download/fpCSV', {
              groupId: this.pure_fp.groupId,
              substanceType: this.sampleTypeOptions[i].value
            }).then((resp) => {
              downloadCSV(resp,
                  "fp-" +
                  this.sampleTypeOptions[i].value + "_" +
                  this.batchInfo.batchId + "_" +
                  this.pure_fp.selectRow.substance + "_" +
                  this.pure_fp.selectRow.logBase)
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
    },
    // 下载每种物质单位质量颗粒数
    downloadMassDensity() {
      if (this.pure_fp.groupId === "") {
        this.$message.error("请选择分组")
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '执行中，请等一会儿~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      postRequestJSON('/download/massDensityCSV', {
        groupId: this.pure_fp.groupId,
      }).then((resp) => {
        loading.close();
        this.$alert(resp.data.result.string, '每种物质单位质量颗粒数', {
          confirmButtonText: '确定',
        });
      });
    },
    // 下载纯物质某分组的train.csv
    downloadTrain() {
      if (this.pure_fp.groupId === "") {
        this.$message.error("请选择分组")
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '执行中，请等一会儿~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      postRequestJSON('/fileExist/trainCSV', {
        groupId: this.pure_fp.groupId,
      }).then((resp) => {
        loading.close();
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
          postRequestJSON('/download/trainCSV', {
            groupId: this.pure_fp.groupId,
          }).then((resp) => {
            downloadCSV(resp,
                "train-" +
                this.batchInfo.batchId + "_" +
                this.pure_fp.selectRow.substance + "_" +
                this.pure_fp.selectRow.logBase)
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
    // 下载配置样品中物质数量比
    downloadConfigSamplesLabel() {
      if (this.pure_fp.groupId === "") {
        this.$message.error("请选择分组")
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '执行中，请等一会儿~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      postRequestJSON('/fileExist/configSamplesLabelCSV', {
        groupId: this.pure_fp.groupId,
      }).then((resp) => {
        loading.close();
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
          postRequestJSON('/download/configSamplesLabelCSV', {
            groupId: this.pure_fp.groupId,
          }).then((resp) => {
            loading.close();
            downloadCSV(resp,
                "configuration_samples_label-" +
                this.batchInfo.batchId + "_" +
                this.pure_fp.selectRow.substance + "_" +
                this.pure_fp.selectRow.logBase)
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
    // 生成热力图
    generateHeatMap() {
      if (this.pure_fp.groupId === "") {
        this.$message.error("请选择分组")
        return
      }
      if (this.pure_fp.heatMapType === "") {
        this.$message.error("请选择物质类型")
        return
      }
      this.heatMapInfo = {
        type: 'pure',
        groupId: this.pure_fp.groupId,
        fileId: "",
        heatMapType: this.pure_fp.heatMapType,
        logBase: "",
      }
    },
    // 下载热力图数据文件
    downloadHeatMapData() {
      if (this.pure_fp.groupId === "") {
        this.$message.error("请选择分组")
        return
      }
      if (this.pure_fp.heatMapType === "") {
        this.$message.error("请选择物质类型")
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '执行中，请等一会儿~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      postRequestJSON('/fileExist/heatMapDataCSV', {
        id: this.pure_fp.groupId,
        sampleType: "pure",
        substanceType: this.pure_fp.heatMapType,
        logBase: "",
      }).then((resp) => {
        loading.close();
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
          postRequestJSON('/download/heatMapDataCSV', {
            id: this.pure_fp.groupId,
            sampleType: "pure",
            substanceType: this.pure_fp.heatMapType,
            logBase: "",
          }).then((resp) => {
            loading.close();
            downloadCSV(resp,
                "HeatMapData-" +
                "PureSample_" +
                this.batchInfo.batchId + "_" +
                this.pure_fp.heatMapType + "_" +
                this.pure_fp.selectRow.substance + "_" +
                this.pure_fp.selectRow.logBase)
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
    // 生成模型
    generateModel() {
      if (this.pure_fp.groupId === "") {
        this.$message.error("请选择分组")
        return
      }
      if (this.pure_fp.modelType === "") {
        this.$message.error("请选择模型类型")
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '执行中，请等一会儿~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      postRequestJSON('/analysis/model', {
        groupId: this.pure_fp.groupId,
        modelType: this.pure_fp.modelType
      }).then((resp) => {
        loading.close();
        if (resp.data.code === 0) {
          this.$confirm(resp.data.message, '提示', {
            confirmButtonText: '确定',
            type: 'success'
          }).then(() => {
          })
          this.getPureGroupList();
          this.show.groupString = ""
          this.$bus.$emit("updateModelList")
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