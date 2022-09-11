<template>
  <div>
    <!-- 批次详情 -->
    <div class="header-h3"><h3>批次详情</h3></div>
    <div class="header-button">
      <el-button icon="el-icon-upload" type="primary" @click="postSample">上传样品文件</el-button>
    </div>
    <el-descriptions :column="4" border title="">
      <el-descriptions-item>
        <template slot="label"><i class="el-icon-document"></i>批次名</template>
        {{ batchInfo.batchName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"><i class="el-icon-reading"></i>采样位置</template>
        {{ batchInfo.position }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"><i class="el-icon-reading"></i>样品总数</template>
        {{ batchInfo.sampleNum }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"><i class="el-icon-reading"></i>分析类型</template>
        {{ batchInfo.analysisType }}
      </el-descriptions-item>
      <!--      实验参数-->
      <el-descriptions-item>
        <template slot="label">数浓度 C<sub>p</sub></template>
        {{ batchInfo.parameters.Cp }} 个/L
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">流速 V</template>
        {{ batchInfo.parameters.V }} ml/min
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">测试时间 T</template>
        {{ batchInfo.parameters.T }} s
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">进样体积 V<sub>i</sub></template>
        {{ batchInfo.parameters.Vi }} ml
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">定容体积 V<sub>f</sub></template>
        {{ batchInfo.parameters.Vf }} ml
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">稀释倍数 D<sub>f</sub></template>
        {{ batchInfo.parameters.Df }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">称样质量 m</template>
        {{ batchInfo.parameters.m }} mg
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">传输效率 TE</template>
        {{ batchInfo.parameters.TE }}
      </el-descriptions-item>
<!--      <el-descriptions-item>-->
<!--        <template slot="label"><i class="el-icon-paperclip"></i>同位素单位强度文件</template>-->
<!--        <el-button type="primary" plain size="mini">下载文件</el-button>-->
<!--      </el-descriptions-item>-->
    </el-descriptions>
    <!-- Tab -->
    <el-tabs v-model="tabActiveName" type="border-card" style="margin-top: 20px">
      <!-- Tab-样品列表 -->
      <el-tab-pane label="样品列表" name="SampleList">
        <h4>标准样品</h4>
        <common-table :table-data="sampleList.standardSampleList" :table-label="tableLabel.normal"></common-table>
        <h4>纯样品（煤灰、土壤、尾气的一种）</h4>
        <common-table :table-data="sampleList.pureSampleList" :table-label="tableLabel.normal"></common-table>
        <h4>真实样品（煤灰、土壤、尾气的混合物，比例未知）</h4>
        <common-table :table-data="sampleList.trueSampleList" :table-label="tableLabel.normal"></common-table>
        <h4>配置样品（煤灰、土壤、尾气的混合物，比例已知）</h4>
        <common-table :table-data="sampleList.configSampleList" :table-label="tableLabel.config"></common-table>
      </el-tab-pane>
      <!-- Tab-功能信息 -->
      <el-tab-pane label="功能执行" name="RunFunction">
        <el-collapse>
          <!--          v-model="activeNames" @change="handleChange"-->
          <el-collapse-item title="颗粒态分析" name="1">
            <Particle :sample-list="sampleList"></Particle>
          </el-collapse-item>
          <el-collapse-item title="计算TE" name="2">
            <TE :sample-id="sampleList.standardSampleList"></TE>
          </el-collapse-item>
          <el-collapse-item title="同位素计数" name="3">
            <IsotopeCount :sample-list="sampleList"></IsotopeCount>
          </el-collapse-item>
          <el-collapse-item title="x约束的频繁项" name="4">
            <SupportX :sample-list="sampleList" :x-sample-list="xSampleList"></SupportX>
          </el-collapse-item>
          <el-collapse-item title="👉 纯物质分析（分组）" name="5">
            <AnalysisPure :batch-id="batchInfo.id"></AnalysisPure>
          </el-collapse-item>
          <el-collapse-item title="👉 非纯物质分析" name="6">
            <AnalysisNotPure :x-sample-list="xSampleList"></AnalysisNotPure>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CommonTable from "../../components/CommonTable";
import Particle from "./AnalysisBatch/Particle";
import TE from "./AnalysisBatch/TE";
import IsotopeCount from "./AnalysisBatch/IsotopeCount";
import SupportX from "./AnalysisBatch/SupportX";
import AnalysisPure from "./AnalysisBatch/AnalysisPure";
import AnalysisNotPure from "./AnalysisBatch/AnalysisNotPure";
import {postRequestJSON} from "../../utils/api";

export default {
  components: {CommonTable, Particle, TE, IsotopeCount, SupportX, AnalysisPure, AnalysisNotPure},
  name: 'DetailBatch',
  data() {
    return {
      // 总信息
      tabActiveName: "RunFunction",
      batchInfo: {
        id: this.$route.query.id,
        batchName: "",
        experimentTime: "",
        position: "",
        sampleNum: "",
        analysisType: "",
        parameters: {Cp: "", V: "", T: "", Vi: "", Vf: "", Df: "", m: "", TE: ""}
      },
      // 其他信息
      perUnitMassParticleNum: "",
      /* tab-样品列表 */
      // 列表表头
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
      },
      // 4种样品列表
      xSampleList: "",
      sampleList: {
        pureSampleList: [],
        standardSampleList: [],
        configSampleList: [],
        trueSampleList: [],
      }
    };
  },
  mounted() {
    this.$bus.$on("updateSupportXList", this.getSupportXList)
  },
  async activated() {
    await this.getBatchInfo();
    await this.getSupportXList();
  },
  methods: {
    // 获取某一批次信息
    getBatchInfo() {
      postRequestJSON('/batch/getBatchInfo', {batchId: this.$route.query.id}).then((resp) => {
        this.batchInfo = resp.data.result.batchInfo;
        this.sampleList = resp.data.result.sampleList;
      });
    },
    // 获取该批次下已经使用x生成的频繁项文件
    getSupportXList() {
      postRequestJSON('/batch/getSupportXList', {
        batchId: this.$route.query.id
      }).then((resp) => {
        this.xSampleList = resp.data.result.sampleList;
      });
    },
    /* 普通页面函数 */
    back() {
      this.$router.back()
    },
    edit() {
      // this.$router.push({name: "postBatch", query: {batchInfo: this.batchInfo}})
    },
    // 上传新的样品
    postSample() {
      this.$router.push({
        name: "postSample",
        query: {
          batchId: this.batchInfo.id,
          batchName: this.batchInfo.batchName
        }
      });
    },
  }
}

</script>

<style lang="less" scoped>
.header-h3 {
  display: inline;
  float: left;
}

.header-button {
  display: inline;
  float: right;
  margin-top: 12px;
}

/deep/ .el-collapse-item__header {
  font-size: 18px;
  font-weight: bolder;
  color: #1B63AD;
}

</style>