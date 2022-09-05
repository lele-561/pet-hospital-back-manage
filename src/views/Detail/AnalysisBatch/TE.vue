<template>
  <div>
    <el-button style="margin-top: 15px" type="primary" @click="runTE()">确认执行分析</el-button>
  </div>
</template>

<script>
import {postRequestJSON} from "../../../utils/api";

export default {
  name: "TE",
  props: ["batchId"],
  data() {
    return {}
  },
  mounted() {
    console.log("TE的id")
    console.log(this.batchId)

  },
  watch: {},
  methods: {
    runTE() {
      postRequestJSON('/analysis/TE', {batchId: this.batchId}).then((resp) => {
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

</style>