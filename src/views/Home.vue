<template>
  <div>
    <el-row>
      <el-col :span=24>
        <el-card class="card">

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
  methods: {
  },
  mounted() {
  }
}

</script>

<style lang="less" scoped>
.card{
  margin-top: 10px;
  height: 500px;

}
</style>