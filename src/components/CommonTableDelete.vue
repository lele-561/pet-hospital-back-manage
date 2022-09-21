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
      <el-table-column label="操作" min-width="25%">
        <template slot-scope="scope">
<!--          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>-->
          <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "CommonTableDelete",
  props: {
    tableData: Array,
    tableLabel: Array,
    function: String,
  },
  methods:{
    handleDelete(row) {
      this.$bus.$emit('deleteFile', {"function": this.function, "file": row});
    },
  }
}
</script>

<style scoped>
.common-table{
  margin-top: 10px;
}
</style>