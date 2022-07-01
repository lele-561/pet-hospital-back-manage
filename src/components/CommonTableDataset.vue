<template>
  <el-table
      ref="multipleTable"
      :data="datasets"
      :stripe="true"
      max-height="100%"
      style="width: 100%; overflow-x: hidden; overflow-y: hidden"
      tooltip-effect="dark"
  >
    <el-table-column align="left" label="名称" min-width="50%" prop="title">
      <template slot-scope="scope"
      ><span
          style="color: #409eff; cursor: pointer"
          @click="itemClick(scope.row)"
      >{{ scope.row.title }}</span
      >
      </template>
    </el-table-column>
    <el-table-column align="left" label="类型" min-width="20%" prop="type">
      <template slot-scope="scope">
        {{ scope.row.type }}
      </template>
    </el-table-column>
    <el-table-column align="left" label="链接" min-width="30%" prop="link">
      <template slot-scope="scope">
        <el-link
            :href="scope.row.link"
            style="color: #409eff; cursor: pointer"
        >{{ scope.row.link }}
        </el-link>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'CommonTableDataset',
  data() {
    return {}
  },
  methods: {
    itemClick(row) {
      this.$router.push({name: 'datasetDetail', query: {datasetId: row.id}});
    },
  },
  props: ["datasets"],
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

;
}
</style>