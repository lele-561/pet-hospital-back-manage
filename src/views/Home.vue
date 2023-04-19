<template>
  <div>
    <el-row>
      <el-col :span=24>
        <el-card class='card'>
          <h2>虚拟宠物医院后台管理系统 v1.0</h2>
          <h3>
            本系统是虚拟宠物医院系统的后台管理系统，包含用户管理、基本信息管理、病例管理和测试管理四个模块。
          </h3>
          <h3>⭐用户管理：管理使用虚拟宠物学习系统的所有用户。</h3>
          <h3>⭐基本信息管理：管理宠物医院中的一些基本信息，包括科室管理、人员管理、药品管理和检查项目管理。</h3>
          <h3>⭐用户管理：管理虚拟宠物医院学习系统中的学习案例，病例信息模块介绍疾病内容供用户学习，真实案例模块给出疾病在现实中的具体案例。</h3>
          <h3>⭐测试管理：管理虚拟宠物医院学习系统中的测试信息，包括考试管理、试卷管理和试题管理。</h3>
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

<style lang='less' scoped>
.card {
  margin-top: 10px;
  height: 500px;

}
</style>