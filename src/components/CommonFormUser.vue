<template>
  <el-form ref="formData" :inline="inline" label-width="100px">
    <el-form-item v-for="item in formLabel" :key="item.label" :label="item.label">
      <el-input v-if="item.type === 'input'" v-model="formData[item.model]" :placeholder="'请输入' + item.label">
      </el-input>
      <el-switch v-if="item.type === 'switch'" v-model="formData[item.model]"></el-switch>
      <el-date-picker v-if="item.type === 'date'" v-model="formData[item.model]" placeholder="选择日期" type="date"
                      value-format="yyyy-MM-dd"></el-date-picker>
      <el-select clearable v-if="item.type === 'select'" v-model="formData[item.model]" placeholder="请选择" style="margin-top: 10px">
        <el-option v-for="item in item.opts" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <slot></slot>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CommonForm',
  props: {
    formLabel: Array,       // 表单配置
    formData: Object,       // 表单信息
    inline: Boolean
  },
  data() {
    return {}
  },
}
</script>

<style>
</style>