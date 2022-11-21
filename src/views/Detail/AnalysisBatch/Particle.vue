<template>
  <!--颗粒态分析-->
  <div>
    <div class="div">
      <el-select v-model="batchInfo.batchId" clearable placeholder="请选择批次" style="margin-top: 10px">
        <el-option v-for="item in batchListStandard" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 5px" type="primary" @click="getBatchInfo">确认</el-button>
    </div>
    <div class="div">
      <el-select v-model="particle.sampleType" clearable placeholder="请选择样品类型">
        <el-option v-for="item in options" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <common-table-single :table-data="particle.sampleList"
                           :table-label="particle.sampleLabel"
                           function="particle"
                           style="margin-top: 10px"
                           @change="resolveBug"></common-table-single>
      <el-button style="margin-top: 15px" type="primary" @click="runParticle()">确认执行分析</el-button>
      <el-button style="margin-top: 15px" type="primary" @click="downloadParticleCSV()">下载particle.csv文件</el-button>
    </div>
  </div>
</template>

<script>
import {downloadCSV, postRequestJSON} from "../../../utils/api";
import CommonTableSingle from "../../../components/CommonTableSingle";

export default {
  components: {CommonTableSingle},
  name: "Particle",
  data() {
    return {
      batchListStandard: [],
      batchInfo: {
        batchId: "",
        sampleList: {},
      },
      particle: {
        sampleType: "",
        sampleList: [],
        sampleLabel: [],
        sampleId: "",   // 选中的样品id
        selectRow: ""
      },
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
        this.particle.sampleId = ""
        this.particle.selectRow = ""
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
        this.particle.sampleId = ""
        this.particle.selectRow = ""
        this.particle.sampleList = [];
        this.particle.sampleLabel = [];
        this.particle.sampleType = "";
        this.batchInfo.sampleList = []
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
    runParticle() {
      if (this.particle.sampleId === "" || this.particle.sampleType === "") {
        this.$message.error("请选择信息")
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '执行中，请等一会儿~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      postRequestJSON('/analysis/particle', {
        sampleId: this.particle.sampleId,
        sampleType: this.particle.sampleType,
      }).then((resp) => {
        loading.close();
        if (resp.data.code === 0) {
          this.$confirm(resp.data.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          })
        } else if (resp.data.code === 1) {
          this.$confirm(resp.data.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        } else {
          this.$confirm(resp.data.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          })
        }
      });
    },
    downloadParticleCSV() {
      if (this.particle.sampleId === "" || this.particle.sampleType === "") {
        this.$message.error("请选择信息")
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '执行中，请等一会儿~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      postRequestJSON('/fileExist/particleCSV', {
        sampleId: this.particle.sampleId,
        sampleType: this.particle.sampleType
      }).then((resp) => {
        loading.close();
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
          postRequestJSON('/download/particleCSV', {
            sampleId: this.particle.sampleId,
            sampleType: this.particle.sampleType
          }).then((resp) => {
            downloadCSV(resp,
                "particle-" +
                this.batchInfo.batchId + "_" +
                this.particle.sampleType + "_" +
                this.particle.selectRow.sampleName)
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
    resolveBug() {
      this.$forceUpdate();
    }
  }
}
</script>

<style lang="less" scoped>
.div {
  margin-top: 10px;
}
</style>