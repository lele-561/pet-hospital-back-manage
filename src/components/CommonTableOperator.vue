<template>
  <div class="common-table">
    <el-table :data="tableData">
      <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :label="item.label"
          min-width="25%"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{
              item.prop === "role" ? scope.row[item.prop] === "true" ? "管理员" : "普通用户" : scope.row[item.prop]
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="25%">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">查看并编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CommonTable',
  props: {
    tableData: Array,
    tableLabel: Array,
    config: Object,
  },
  data() {
    return {}
  },
  methods: {
    // 给子组件绑定事件
    handleEdit(row) {
      this.$emit('edit', row)
    },
    handleDelete(row) {
      this.$emit('del', row)
    },
  },
}
</script>

<style lang="less" scoped>
.common-table {
  margin-top: 10px;
}
</style>