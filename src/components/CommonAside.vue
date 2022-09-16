<template>
  <!-- 左侧菜单 -->
  <el-menu
      :collapse="isCollapse"
      alive-text-color="#C5A553"
      class="el-menu-vertical-demo"
      text-color="#fff">
    <h3>颗粒物分析系统</h3>
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
      <el-menu-item-group class="el-menu-vertical-demo" v-for="subItem in item.children" :key="subItem.path"
                          :index="subItem.path">
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
          path: '/batchList',
          name: 'batchList',
          label: '批次列表',
          icon: 's-grid',
          url: 'batchList/batchList'
        },
        {
          path: '/function',
          label: '分析功能',
          icon: 'setting',
          children: [
            {
              path: 'function/particle',
              name: 'function_particle',
              label: '颗粒态分析',
              icon: 'collection-tag',
              url: 'particle/particle'
            },
            {
              path: 'function/TE',
              name: 'function_TE',
              label: '计算TE',
              icon: 'collection-tag',
              url: 'TE/TE'
            },
            {
              path: 'function/isotopeCount',
              name: 'function_isotopeCount',
              label: '同位素计数',
              icon: 'collection-tag',
              url: 'isotopeCount/isotopeCount'
            },
            {
              path: 'function/supportX',
              name: 'function_supportX',
              label: '频繁项提取',
              icon: 'collection-tag',
              url: 'supportX/supportX'
            },
            {
              path: 'function/analysisPure',
              name: 'function_analysisPure',
              label: '纯物质分析',
              icon: 'collection-tag',
              url: 'analysisPure/analysisPure'
            },
            {
              path: 'function/analysisNotPure',
              name: 'function_analysisNotPure',
              label: '非纯物质分析',
              icon: 'collection-tag',
              url: 'analysisNotPure/analysisNotPure'
            },
          ]
        },
      ]
    };
  },
  methods: {
    clickMenu(item) {
      this.$router.push({name: item.name});
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
  min-height: 20px;
  background-color: #1e2d40;
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

