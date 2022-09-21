<template>
  <div>
    <div class="div">
      <el-select clearable v-model="batchInfo.batchId" placeholder="请选择批次">
        <el-option v-for="item in batchListStandard" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 5px" @click="getSupportXList">确认</el-button>
    </div>
    <el-select clearable v-model="supportX.sampleType" placeholder="请选择样品类型" style="margin-top: 5px">
      <el-option v-for="item in options" :key="item.value" :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <common-table-delete :table-data="supportX.xSampleList"
                         :table-label="supportX.xSampleLabel"
                         function="supportX"></common-table-delete>
  </div>
</template>

<script>
import {postRequestJSON} from "../../../utils/api";
import CommonTableDelete from "../../../components/CommonTableDelete";

export default {
  name: "SupportXFile",
  components: {CommonTableDelete},
  data() {
    return {
      batchListStandard: [],
      batchInfo: {
        batchId: "",
        xSampleList: {}
      },
      supportX: {
        x: "",
        sampleType: "",
        xSampleList: [],
        xSampleLabel: [],
        sampleId: "",   // 选中的样品id
        selectRow: ""
      },
      options: [
        {value: 'PureSample', label: '纯样品'},
        {value: 'TrueSample', label: '真实样品'},
        {value: 'ConfigSample', label: '配置样品'},
      ],
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
  async activated() {
    await postRequestJSON('/batch/getBatchListStandard').then((resp) => {
      this.batchListStandard = resp.data.result.batchList
    })
  },
  mounted() {
    this.$bus.$on('deleteFile', (data) => {
      if (data.function === 'supportX') {
        this.deleteSupportXFile(data.file);
      }
    })
    this.$emit("")
  },
  watch: {
    'supportX.sampleType': {
      handler() {
        if (this.supportX.sampleType === "PureSample") {
          this.supportX.xSampleList = this.batchInfo.xSampleList.pureSampleList;
          this.supportX.xSampleLabel = this.tableLabel.supportX_normal;
        } else if (this.supportX.sampleType === "TrueSample") {
          this.supportX.xSampleList = this.batchInfo.xSampleList.trueSampleList;
          this.supportX.xSampleLabel = this.tableLabel.supportX_normal;
        } else if (this.supportX.sampleType === "ConfigSample") {
          this.supportX.xSampleList = this.batchInfo.xSampleList.configSampleList;
          this.supportX.xSampleLabel = this.tableLabel.supportX_config;
        }
      }
    },
    "batchInfo.xSampleList":{
      handler() {
        if (this.supportX.sampleType === "PureSample") {
          this.supportX.xSampleList = this.batchInfo.xSampleList.pureSampleList;
          this.supportX.xSampleLabel = this.tableLabel.supportX_normal;
        } else if (this.supportX.sampleType === "TrueSample") {
          this.supportX.xSampleList = this.batchInfo.xSampleList.trueSampleList;
          this.supportX.xSampleLabel = this.tableLabel.supportX_normal;
        } else if (this.supportX.sampleType === "ConfigSample") {
          this.supportX.xSampleList = this.batchInfo.xSampleList.configSampleList;
          this.supportX.xSampleLabel = this.tableLabel.supportX_config;
        }
      }
    },
    'batchInfo.batchId': {
      handler() {
        this.supportX.xSampleList = [];
        this.supportX.xSampleLabel = [];
        this.supportX.sampleType = ""
      }
    }
  },
  methods: {
    // 获取该批次下已经使用x生成的频繁项文件
    async getSupportXList() {
      await postRequestJSON('/batch/getSupportXList', {
        batchId: this.batchInfo.batchId
      }).then((resp) => {
        this.batchInfo.xSampleList = resp.data.result.sampleList;
        this.$message.success(resp.data.message)
      });
    },
    deleteSupportXFile(data) {
      this.$confirm('此操作将永久删除该样本该支持度下所有文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postRequestJSON('/delete/supportXFile', {
          fileId: data.fileId,
          sampleType: data.type,
          support: data.support
        }).then((resp) => {
          if (resp.data.code === 0) {
            this.$message.success(resp.data.message)
            this.getSupportXList();
          } else {
            this.$message.error(resp.data.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
}
</script>

<style scoped>
.div {
  margin-top: 10px;
}
</style>