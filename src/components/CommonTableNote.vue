<template>
  <div>
    <el-table ref="multipleTable" :data="notes" :stripe="true" max-height="600"
              style="width: 100%; overflow-x: hidden; overflow-y: hidden" tooltip-effect="dark">
      <el-table-column align="left" label="名称" prop="title" min-width="50%">
        <template slot-scope="scope"><span style="color: #409eff; cursor: pointer" @click="itemClick(scope.row)">{{
            scope.row.title
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="发布时间" prop="releaseTime" min-width="20%">
        <template slot-scope="scope">
          {{ scope.row.releaseTime }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="发布者" prop="publishUser" min-width="30%">
        <template slot-scope="scope">
          {{ scope.row.publishUser }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CommonTableNote',
  data() {
    return {

    }
  },
  methods: {
    itemClick(row) {
      this.$router.push({name: 'noteDetail', query: {noteId: row.id}});
    },
  },
  props: ["notes", "paperId"],
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