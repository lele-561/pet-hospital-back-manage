<template>
  <header>
    <div class="l-content">
      <el-button icon="el-icon-back" plain round size="mini" type="info" @click="back"></el-button>
    </div>
    <div class="r-content">
      <el-dropdown size="mini" trigger="click">
        <span>
          <img :src="userImg" class="user"/>
        </span>
        <el-dropdown-menu>
          <el-dropdown-item common="b" @click.native="logOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
export default {
  name: 'CommonHeader',
  data() {
    return {
      userImg: require('../assets/logo.png')
    }
  },
  methods: {
    logOut() {
      this.$store.commit('clearToken')
      this.$router.push({name: 'login'})
    },
    back() {
      this.$router.back()
    }
  },
  components: {}
}
</script>

<style lang="less" scoped>
header {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}

.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }
}

.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>