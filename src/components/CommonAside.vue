<template>
  <!-- 左侧菜单 -->
  <el-menu
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      alive-text-color="#C5A553"
      class="el-menu-vertical-demo"
      text-color="#fff">
    <h3>虚拟宠物医院后台管理</h3>
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
      <el-menu-item-group v-for="subItem in item.children" :key="subItem.path"
                          class="el-menu-vertical-demo">
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
          path: '/userManage',
          name: 'userManage',
          label: '用户管理',
          icon: 's-grid',
          url: 'userManage/userManage'
        },
        {
          path: '/basicInfo',
          name: 'basicInfo',
          label: '基本管理',
          icon: 's-grid',
          children: [
            {
              path: 'basicManage/department',
              name: 'basicManage_department',
              label: '科室管理',
              icon: 'collection-tag',
              url: 'department/department'
            },
            {
              path: 'basicManage/peronnel',
              name: 'basicManage_peronnel',
              label: '人员管理',
              icon: 'collection-tag',
              url: 'peronnel/peronnel'
            },
            {
              path: 'basicManage/drug',
              name: 'basicManage_drug',
              label: '药品管理',
              icon: 'collection-tag',
              url: 'drug/drug'
            },
            {
              path: 'basicManage/inspection',
              name: 'basicManage_inspection',
              label: '检查项目管理',
              icon: 'collection-tag',
              url: 'inspection/inspection'
            }
          ]
        },
        {
          path: '/diseaseManage',
          label: '疾病管理',
          icon: 'data-board',
          children: [
            {
              path: 'diseaseManage/diseaseExample',
              name: 'diseaseManage_diseaseExample',
              label: '病例信息',
              icon: 'collection-tag',
              url: 'diseaseExample/diseaseExample'
            },
            {
              path: 'diseaseManage/diseaseReal',
              name: 'diseaseManage_diseaseReal',
              label: '真实案例',
              icon: 'collection-tag',
              url: 'diseaseReal/diseaseReal'
            }
          ]
        },
        {
          path: '/testManage',
          label: '测试管理',
          icon: 'data-board',
          children: [
            {
              path: 'testManage/exam',
              name: 'testManage_exam',
              label: '考试管理',
              icon: 'collection-tag',
              url: 'exam/exam'
            },
            {
              path: 'testManage/paper',
              name: 'testManage_paper',
              label: '试卷管理',
              icon: 'collection-tag',
              url: 'paper/paper'
            },
            {
              path: 'function/question',
              name: 'testManage_question',
              label: '试题管理',
              icon: 'collection-tag',
              url: 'question/question'
            },
          ]
        }],
    };
  },
  methods: {
    clickMenu(item) {
      this.$router.push({name: item.name});
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
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


<style lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 8px;
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

