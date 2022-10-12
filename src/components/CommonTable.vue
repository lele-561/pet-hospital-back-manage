<template>
  <div class="common-table">
    <el-table :data="tableData">
      <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :label="item.label"
          min-width="25%"
          show-overflow-tooltip>
        <template slot-scope="scope"><span>{{ scope.row[item.prop] }}</span></template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "CommonTable",
  props: {
    tableData: Array,
    tableLabel: Array,
  },
  data() {
    return {}
  },
  methods: {}
}


</script>

<style lang="less" scoped>
.common-table {
  margin-top: 10px;
}
</style>