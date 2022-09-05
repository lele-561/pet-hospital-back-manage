<template>
  <el-container style="background-color:#eef2f5;height:100%">
    <el-aside width="auto">
      <common-aside></common-aside>
    </el-aside>
    <el-container style="height:100%">
      <el-header>
        <common-header></common-header>
      </el-header>
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import CommonAside from '../components/CommonAside.vue'
import CommonHeader from '../components/CommonHeader.vue'

export default {
  name: 'Main',
  components: {
    CommonAside,
    CommonHeader
  },
  data() {
    return {}
  },
}
</script>

<style lang="less" scoped>
.el-header {
  background-image: linear-gradient(to left, #3ab5b0 0%, #3d99be 31%, #56317a 100%);
}


.el-main {
  padding-top: 0;
}

</style>