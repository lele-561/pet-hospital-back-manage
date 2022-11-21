<template>
  <div>
    <el-row>
      <el-col :span=24>
        <el-card class="card">
          <h2>颗粒物分析系统 v1.0</h2>
          <h3>⭐批次列表：查看每一个批次的相关样品信息</h3>
          <h3>⭐分析功能：针对每一批样品，进行不同的分析计算</h3>
          <h3>⭐生成信息管理：对每个批次在分析时生成的中间文件及数据进行管理，目前仅提供删除非源样品的不同支持度x及相关文件的操作</h3>
          <h3>⭐样品命名规范</h3>
          <h4>标准样品：Au.csv</h4>
          <h4>样品：Ax.csv（x为数字，从1开始，如A1.csv）</h4>
          <h4>源样品：meihui.csv（样品名称拼音）</h4>
          <h4>配置样品：Sx.csv（x为数字，从1开始，如S1.csv）</h4>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      items: []
    }
  },
  methods: {},
  mounted() {
  }
}

</script>

<style lang="less" scoped>
.card {
  margin-top: 10px;
  height: 500px;

}
</style>