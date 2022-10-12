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
    <div>
      <el-button style="margin-top: 15px" type="primary" @click="runTE()">确认执行分析</el-button>
    </div>
  </div>
</template>

<script>
import {postRequestJSON} from "../../../utils/api";

export default {
  name: "TE",
  props: ["sampleId"],
  data() {
    return {
      batchListStandard: [],
      batchInfo: {
        batchId: "",
        sampleList: {}
      },
    }
  },
  mounted() {
  },
  async activated() {
    await postRequestJSON('/batch/getBatchListStandard').then((resp) => {
      this.batchListStandard = resp.data.result.batchList;
    })
  },
  watch: {
    'batchInfo.batchId': {
      handler() {
        this.batchInfo.sampleList = [];
      }
    }
  },
  methods: {
    // 获取某一批次信息
    getBatchInfo() {
      postRequestJSON('/batch/getBatchInfo', {batchId: this.batchInfo.batchId}).then((resp) => {
        if (resp.data.code === 0) {
          this.batchInfo.sampleList = resp.data.result.sampleList;
          this.$message.success(resp.data.message)
        } else {
          this.$message.warning(resp.data.message)
        }
      });
    },
    runTE() {
      if (this.batchInfo.batchId === "") {
        this.$message.error("请选择批次")
        return
      }

      const loading = this.$loading({
        lock: true,
        text: '执行中，请等一会儿~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      postRequestJSON('/analysis/TE', {sampleId: this.batchInfo.sampleList.standardSampleList[0].id}).then(
          (resp) => {
            loading.close();
            if (resp.data.code === 0) {
              this.$confirm(resp.data.message, '提示', {
                confirmButtonText: '确定',
                type: 'success'
              })
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