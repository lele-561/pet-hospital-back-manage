<template>
  <el-table
      ref="multipleTable"
      :data="papers"
      :stripe="true"
      max-height="100%"
      style="width: 100%; overflow-x: hidden; overflow-y: hidden"
      tooltip-effect="dark"
  >
    <el-table-column align="left" label="标题" prop="title" width="400">
      <template slot-scope="scope"
      ><span
          style="color: #409eff; cursor: pointer"
          @click="itemClick(scope.row)"
      >{{ scope.row.title }}</span
      >
      </template>
    </el-table-column>
    <el-table-column align="left" label="会议" prop="meeting" width="140">
      <template slot-scope="scope">
        {{ scope.row.meeting + scope.row.year }}
      </template>
    </el-table-column>
    <el-table-column align="left" label="标签" prop="tags" width="300">
      <template slot-scope="scope">
        <el-tag v-for="tag in scope.row.tags" :key="tag">{{ tag }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="left" label="链接" prop="link" width="300">
      <template slot-scope="scope">
        <el-link
            :href="scope.row.pdfLink"
            style="color: #409eff; cursor: pointer"
        >{{ scope.row.pdfLink }}
        </el-link
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'CommonTable',
  data() {
    return {}
  },
  methods: {
    itemClick(row) {
      this.$router.push({path: "/paperDetail", query: {paperInfo: row}});
    },
  },
  props: ["papers"],
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