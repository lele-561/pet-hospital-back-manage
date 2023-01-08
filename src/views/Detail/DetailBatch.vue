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
        <template slot="label"><i class="el-icon-reading"></i>分析类型</template>
        {{ batchInfo.analysisType }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label"><i class="el-icon-reading"></i>样品状态</template>
        {{ batchInfo.sampleState }}
      </el-descriptions-item>
      <!--      实验参数-->
      <el-descriptions-item>
        <template slot="label">传输效率 TE</template>
        {{ batchInfo.parameters.TE }}
      </el-descriptions-item>
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
    </el-descriptions>
    <h4>标准样品</h4>
    <common-table :table-data="sampleList.standardSampleList"
                  :table-label="batchInfo.sampleState==='solid'?tableLabel.solid_normal:tableLabel.liquid_normal"></common-table>
    <h4>源样品</h4>
    <common-table :table-data="sampleList.pureSampleList"
                  :table-label="batchInfo.sampleState==='solid'?tableLabel.solid_normal:tableLabel.liquid_normal"></common-table>
    <h4>样品</h4>
    <common-table :table-data="sampleList.trueSampleList"
                  :table-label="batchInfo.sampleState==='solid'?tableLabel.solid_normal:tableLabel.liquid_normal"></common-table>
    <h4>配置样品</h4>
    <common-table :table-data="sampleList.configSampleList"
                  :table-label="batchInfo.sampleState==='solid'?tableLabel.solid_config:tableLabel.liquid_config"></common-table>
  </div>
</template>

<script>
import CommonTable from "../../components/CommonTable";
import {postRequestJSON} from "../../utils/api";

export default {
  components: {CommonTable},
  name: 'DetailBatch',
  data() {
    return {
      // 总信息
      tabActiveName: "RunFunction",
      batchInfo: {
        id: this.$route.query.id,
        batchName: "",
        sampleState: "",
        analysisType: "",
        parameters: {Cp: "", V: "", T: "", Vi: "", TE: ""},
        modelList: [],
      },
      // 其他信息
      perUnitMassParticleNum: "",
      /* tab-样品列表 */
      // 列表表头
      tableLabel: {
        // 固体
        solid_normal: [
          {prop: "sampleName", label: '样品名称'},
          {prop: "Vf", label: '定容体积Vf(ml)'},
          {prop: "Df", label: '稀释倍数Df'},
          {prop: "m", label: '称样质量m(mg)'},
          {prop: "time", label: '采样时间'},
          {prop: "position", label: '采样位置'},
        ],
        solid_config: [
          {prop: "sampleName", label: '样品名称'},
          {prop: "substanceMass", label: '配置样品物质及质量'},
          {prop: "Vf", label: '定容体积Vf(ml)'},
          {prop: "Df", label: '稀释倍数Df'},
          {prop: "m", label: '称样质量m(mg)'},
          {prop: "time", label: '采样时间'},
          {prop: "position", label: '采样位置'},
        ],
        // 液体
        liquid_normal: [
          {prop: "sampleName", label: '样品名称'},
          {prop: "Df", label: '稀释倍数Df'},
          {prop: "time", label: '采样时间'},
          {prop: "position", label: '采样位置'},
        ],
        liquid_config: [
          {prop: "sampleName", label: '样品名称'},
          {prop: "substanceMass", label: '配置样品物质及质量'},
          {prop: "Df", label: '稀释倍数Df'},
          {prop: "time", label: '采样时间'},
          {prop: "position", label: '采样位置'},
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
  created() {
    this.getBatchInfo();
  },
  mounted() {
  },
  methods: {
    // 获取某一批次信息
    getBatchInfo() {
      postRequestJSON('/batch/getBatchInfo', {batchId: this.$route.query.id}).then((resp) => {
        this.batchInfo = resp.data.result.batchInfo;
        this.sampleList = resp.data.result.sampleList;
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