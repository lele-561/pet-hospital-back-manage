<template>
  <div>
    <el-table
        ref="multipleTable"
        :data="batches"
        :stripe="true"
        max-height="100%"
        style="width: 100%; overflow-x: hidden; overflow-y: hidden"
        tooltip-effect="dark">
      <el-table-column align="left" label="批次" min-width="15%" prop="batch" sortable>
        <template slot-scope="scope"><span style="color: #409eff; cursor: pointer" @click="itemClick(scope.row)">{{
            scope.row.batchName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="采样位置" min-width="25%" prop="position">
        <template slot-scope="scope">
          {{ scope.row.position }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="样品总数" min-width="10%" prop="sampleNum">
        <template slot-scope="scope">
          {{ scope.row.sampleNum }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="实验时间" min-width="25%" prop="experimentTime" sortable>
        <template slot-scope="scope">
          {{ scope.row.experimentTime }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="最近一次使用时间" min-width="25%" prop="experimentTime">
        <template slot-scope="scope">
          {{ scope.row.lastUseTime }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CommonTableBatch',
  data() {
    return {}
  },
  methods: {
    itemClick(row) {
      this.$router.push({name: "detailBatch", query: {id: row.id}});
    },
  },
  props: ["batches"],
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