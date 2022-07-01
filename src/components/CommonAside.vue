<template>
  <!-- 左侧菜单 -->
  <el-menu :collapse="isCollapse" alive-text-color="#C5A553" class="el-menu-vertical-demo"
           text-color="#fff" @close="handleClose" @open="handleOpen">
    <h3>论文管理系统</h3>
    <!-- :index跳转路由使用 -->
    <el-menu-item v-for="item in noChildren" :key="item.path" :index="item.path" @click="clickMenu(item)">
      <i :class="'el-icon-' + item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <el-submenu v-for="item in hasChildren" :key="item.path" :index="item.path">
      <template slot="title">
        <i :class="'el-icon-' + item.icon"></i>
        <span slot="title">{{ item.label }}</span>
      </template>
      <!-- 二级菜单 -->
      <el-menu-item-group class="el-menu-vertical-demo"  v-for="subItem in item.children" :key="subItem.path" :index="subItem.path">
        <el-menu-item :index="subItem.path" @click="clickMenu(subItem)">{{ subItem.label }}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menu: [{
        path: '/',
        name: 'home',
        label: '首页',
        icon: 's-home',
        url: 'Home/Home'
      },
        {
          path: '/paperList',
          name: 'paperList',
          label: '论文列表',
          icon: 'document',
          url: 'MallManage/MallManage'
        }, {
          path: '/datasetList',
          name: 'datasetList',
          label: '数据集列表',
          icon: 's-grid',
          url: 'UserManage/UserManage'
        }, {
          path: '/systemSetting',
          label: '系统设置',
          icon: 'setting',
          children: [
            {
              path: 'systemSetting/userManage',
              name: 'systemSetting_userManage',
              label: '用户管理',
              icon: 'user',
              url: 'Other/PageTwo'
            }
          ]
        },

      ]
    };
  },
  methods: {
    handleOpen(key, keyPath) {
    },
    handleClose(key, keyPath) {
    },
    clickMenu(item) {
      if (this.$store.state.user.roleName === 'admin') {
        this.$router.push({
          name: item.name
        });
      } else {
        if (item.name !== 'systemSetting_userManage') {
          this.$router.push({
            name: item.name
          });
        }
      }
    }
  },
  computed: {
    noChildren() {
      return this.menu.filter(item => !item.children)
    },
    hasChildren() {
      return this.menu.filter(item => item.children)
    },
  }
}
</script>


<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  background-image: linear-gradient(to top, #3ab5b0 0%, #3d99be 31%, #56317a 100%);
}

.el-menu {
  height: 100%;
  border: none;

  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
  }
}


</style>

