<template>
  <div>
    <el-table ref="singleTable"
              :data="sampleList"
              highlight-current-row
              @current-change="handleCurrentChange"
              style="width: 100%">
      <el-table-column property="sampleName" label="样品名" min-width="20%">
        <template slot-scope="scope">{{ scope.row.sampleName }}</template>
      </el-table-column>
      <el-table-column property="fileName" label="文件名" min-width="30%">
        <template slot-scope="scope">{{ scope.row.fileName }}</template>
      </el-table-column>
      <el-table-column property="type" label="样品类型" min-width="15%">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="setCurrent()">取消选择</el-button>
      <el-button type="primary" @click="setCurrent()">确认执行分析</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonTableSampleSingle',
  data() {
    return {}
  },
  methods: {
    itemClick(row) {
      this.$router.push({
        name: 'DetailSample',
        query: {
          id: row.id,
          type: row.type,
          sampleName:row.name,
          batchName: this.batchName,
        }});
    },
    // 单选列表
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  },
  props: ["sampleList","batchName","url"],
}
</script>

<style lang="less" scoped>
.common-table {
  height: calc(100% - 62px);
  background-color: #fff;
  position: relative;

  .pager {
    position: absolute;
    bottom: 0;
    right: 20px;
  }
}
</style>