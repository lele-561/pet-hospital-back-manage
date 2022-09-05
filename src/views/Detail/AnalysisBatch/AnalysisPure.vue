<template>
  <div>
    <h3>创建分组并生成相应文件</h3>
    <el-form :inline="true" ref="groupForm" :model="pure_fp.input" label-width="55px" style="margin-top: 10px"
             :rules="rules">
      <el-form-item label="煤灰" prop="meihui_x">
        <el-input class="input-box" v-model="pure_fp.input.meihui" placeholder="请输入x"></el-input>
      </el-form-item>
      <el-form-item label="土壤" prop="turang_x">
        <el-input class="input-box" v-model="pure_fp.input.turang" placeholder="请输入x"></el-input>
      </el-form-item>
      <el-form-item label="尾气" prop="weiqi_x">
        <el-input class="input-box" v-model="pure_fp.input.weiqi" placeholder="请输入x"></el-input>
      </el-form-item>
      <el-form-item label="底数" prop="logBase">
        <el-input class="input-box" v-model="pure_fp.input.logBase" placeholder="请输入log的底数"></el-input>
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
    <h4>您当前选择的分组是： {{
        "煤灰 " + pure_fp.selectRow.meihui + " " +
        "土壤 " + pure_fp.selectRow.turang + " " +
        "尾气 " + pure_fp.selectRow.weiqi
      }}
    </h4>
    <el-descriptions :column="4" border title="">
      <el-descriptions-item>
        <template slot="label">指纹文件fp.csv</template>
        <el-button type="primary" @click="downloadFp" size="mini" plain>下载文件</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">训练集train.csv</template>
        <el-button type="primary" @click="downloadTrain" size="mini" plain>下载文件</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">每种物质单位质量颗粒数</template>
        <el-button type="primary" @click="downloadMassDensity" size="mini" plain>下载文件</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">配置样品物质数量比</template>
        <el-button type="primary" @click="downloadConfigSamplesLabel" size="mini" plain>下载文件</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">热力图</template>
        <el-select v-model="pure_fp.heatMapType" placeholder="请选择样品类型">
          <el-option v-for="item in sampleTypeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <div style="display: flex;margin-top: 5px">
          <el-button type="primary" size="mini" @click="generateHeatMap()">生成热力图</el-button>
          <el-button style="margin-left: 5px" type="primary" size="mini" plain @click="downloadHeatMapData('pure')">
            下载热力图数据文件
          </el-button>
        </div>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">生成模型</template>
        <el-button type="primary" @click="generateModel" size="mini" plain>下载文件</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">溯源样品</template>
        <div style="display: flex;margin-top: 5px">
          <el-button type="primary" @click="generateBarChart" size="mini">生成柱状图</el-button>
          <el-button type="primary" style="margin-left: 5px" @click="downloadTraceResult" size="mini" plain>下载溯源结果文件
          </el-button>
        </div>
      </el-descriptions-item>
    </el-descriptions>
    <!--绘图区-->
    <el-tabs v-model="tabActiveName" type="border-card" style="margin-top: 20px">
      <el-tab-pane label="热力图" name="HeatMap">
        <HeatMapPure heat-map-id="heatMapPure" :heat-map-info="HeatMapInfo"></HeatMapPure>
      </el-tab-pane>
      <el-tab-pane label="柱状图" name="BarChart">
        <BarChart></BarChart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CommonTableSingle from "../../../components/CommonTableSingle";
import HeatMapPure from "../Chart/HeatMap";
import BarChart from "../Chart/BarChart";
import {downloadCSV, postRequestJSON} from "../../../utils/api";

export default {
  name: "AnalysisPure",
  components: {BarChart, CommonTableSingle, HeatMapPure},
  props: ["batchId",],
  data() {
    return {
      tabActiveName: "HeatMap",
      HeatMapInfo: "",
      pure_fp: {
        input: {
          meihui: "",
          turang: "",
          weiqi: "",
          logBase: "",
        },
        groupList: [],
        groupId: "",    // 选中的组id
        heatMapType: "",
        selectRow: ""
      },
      rules: {
        meihui_x: [{required: true, message: "请输入x", trigger: "blur"}],
        turang_x: [{required: true, message: "请输入x", trigger: "blur"}],
        weiqi_x: [{required: true, message: "请输入x", trigger: "blur"}],
        logBase: [{required: true, message: "请输入log底数", trigger: "blur"}],
      },
      tableLabel: {
        group: [
          {prop: "meihui", label: '煤灰'},
          {prop: "turang", label: '土壤'},
          {prop: "weiqi", label: '尾气'},
          {prop: "logBase", label: 'log底数'},
          {prop: "isModel", label: '是否已经生成模型'},
        ]
      },
      sampleTypeOptions: [
        {value: 'meihui', label: '煤灰'},
        {value: 'turang', label: '土壤'},
        {value: 'weiqi', label: '尾气'},
      ],
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
    await this.getPureGroupList();
  },
  methods: {
    // 获取纯物质分组列表
    getPureGroupList() {
      postRequestJSON('/batch/getPureGroupList', {
        batchId: this.batchId
      }).then((resp) => {
        this.pure_fp.groupList = resp.data.result.groupList;
      });
    },
    // 生成纯物质分组
    async generatePureGroup() {
      await this.$refs.groupForm.validate((valid) => {
        if (valid) {
          postRequestJSON('/analysis/generatePureGroup', {
            batchId: this.batchInfo.id,
            meihui: this.pure_fp.input.meihui,
            turang: this.pure_fp.input.turang,
            weiqi: this.pure_fp.input.weiqi,
            logBase: this.pure_fp.input.logBase
          }).then((resp) => {
            if (resp.data.code === 0) {
              this.$message.success(resp.data.message)
              this.getPureGroupList();
            } else if (resp.data.code === 1)
              this.$message.info(resp.data.message)
            else this.$message.error(resp.data.message)
          });
        } else {
          return false
        }
      })
    },
    // 下载三种物质的fp文件
    downloadFp() {
      // 每种物质单位质量颗粒数(列表)
      postRequestJSON('/download/fpCSV', {
        groupId: this.pure_fp.groupId,
        substanceType: "meihui"
      }).then((resp) => {
        downloadCSV(resp, "meihui_fp")
      });
      postRequestJSON('/download/fpCSV', {
        groupId: this.pure_fp.groupId,
        substanceType: "turang"
      }).then((resp) => {
        downloadCSV(resp, "turang_fp")
      });
      postRequestJSON('/download/fpCSV', {
        groupId: this.pure_fp.groupId,
        substanceType: "weiqi"
      }).then((resp) => {
        downloadCSV(resp, "weiqi_fp")
      });
    },
    // 下载每种物质单位质量颗粒数
    downloadMassDensity() {
      postRequestJSON('/download/massDensityCSV', {
        groupId: this.pure_fp.groupId,
      }).then((resp) => {
        downloadCSV(resp, "mass_density")
      });
    },
    // 下载纯物质某分组的train.csv
    downloadTrain() {
      postRequestJSON('/download/trainCSV', {
        groupId: this.pure_fp.groupId,
      }).then((resp) => {
        downloadCSV(resp, "train")
      });
    },
    // 下载配置样品中物质数量比
    downloadConfigSamplesLabel() {
      postRequestJSON('/download/configSamplesLabelCSV', {
        groupId: this.pure_fp.groupId,
      }).then((resp) => {
        downloadCSV(resp, "configuration_samples_label")
      });
    },
    // 生成热力图
    generateHeatMap() {
      this.tabActiveName = "HeatMap"
      this.HeatMapInfo = {
        type: 'pure',
        groupId: this.pure_fp.groupId,
        fileId: "",
        heatMapType: this.pure_fp.heatMapType
      }
    },
    // 下载热力图数据文件
    downloadHeatMapData() {
      postRequestJSON('/download/heatMapDataCSV', {
        id: this.pure_fp.groupId,
        sampleType: "pure",
        substanceType: this.heatMapType
      }).then((resp) => {
        downloadCSV(resp, "HeatMap_" + this.heatMapType)
      });
    },
    // 生成模型
    generateModel() {
      postRequestJSON('/analysis/model', {
        groupId: this.pure_fp.groupId,
      }).then((resp) => {
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
          this.getPureGroupList();
        } else if (resp.data.code === 1)
          this.$message.info(resp.data.message)
        else this.$message.error(resp.data.message)
      });
    },
    // 生成柱状图
    generateBarChart() {
      this.tabActiveName = "BarChart"
      this.$bus.$emit("drawBarChart", {groupId: this.pure_fp.groupId})
    },
    // 下载溯源文件
    downloadTraceResult() {
      postRequestJSON('/download/traceResultCSV', {
        groupId: this.pure_fp.groupId,
      }).then((resp) => {
        downloadCSV(resp, "trace_result")
      });
    },
  }
}
</script>

<style lang="less" scoped>
</style>