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
      postRequestJSON('/analysis/TE', {sampleId: this.batchInfo.sampleList.standardSampleList[0].id}).then(
          (resp) => {
            if (resp.data.code === 0) {
              this.$message.success(resp.data.message)
            } else if (resp.data.code === 1)
              this.$message.info(resp.data.message)
            else this.$message.error(resp.data.message)
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