<template>
  <div>
    <el-row>
      <el-col :span=24>
        <el-card class="card">
          <h2>虚拟宠物医院后台管理系统 v1.0</h2>
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