<template>
  <div>
    <el-table
        ref="multipleTable"
        :data="tableData"
        :stripe="true"
        style="width: 100%; overflow-x: hidden; overflow-y: hidden"
        tooltip-effect="dark">
      <el-table-column align="left" label="宠物名" min-width="20%" prop="name">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="left" label="种类" min-width="20%" prop="type">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column align="left" label="性别" min-width="5%" prop="gender">
        <template slot-scope="scope">{{ scope.row.gender }}</template>
      </el-table-column>
      <el-table-column align="left" label="年龄" min-width="5%" prop="age">
        <template slot-scope="scope">{{ scope.row.age }}</template>
      </el-table-column>
      <el-table-column align="left" label="疾病" min-width="35%" prop="diseases">
        <template slot-scope="scope">
          <el-tag type="warning" v-for="disease in scope.row.diseases" :key="disease">{{ disease }}</el-tag>
        </template>
      </el-table-column>
      <!--      操作按钮-->
      <el-table-column label="操作" min-width="15%">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">查看并编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" plain @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CommonTablePetProfile',
  props: ["tableData"],
  data() {
    return {}
  },
  methods: {
    handleEdit(row) {
      this.$router.push({name: "diseaseManage_petProfile", query: {id: row.id}});
    },
    handleDelete(row) {
      this.$emit('del', row)
    },
  },
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