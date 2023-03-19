<template>
  <el-form ref="form" :model="formData" :inline="inline" label-width="90px">
    <el-form-item v-for="item in formLabel" :key="item.label" :label="item.label" :prop="item.prop" :rules="item.rules">
      <el-input v-if="item.type === 'input'" v-model="formData[item.model]" :placeholder="'请输入' + item.label"
                :maxlength='item.maxlength' show-word-limit>
      </el-input>
      <el-switch v-if="item.type === 'switch'" v-model="formData[item.model]"></el-switch>
      <el-date-picker v-if="item.type === 'date'" v-model="formData[item.model]" placeholder="选择日期" type="date"
                      value-format="yyyy-MM-dd"></el-date-picker>
      <el-select v-if="item.type === 'selectStatic'" v-model="formData[item.model]" clearable placeholder="请选择">
        <el-option v-for="item in item.opts" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-if="item.type === 'selectDynamic'" v-model="formData[item.model]" clearable placeholder="请选择">
        <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input v-if="item.type === 'textarea'" type="textarea" autosize v-model="formData[item.model]"
                :placeholder="'请输入' + item.label"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CommonForm',
  props: {
    formLabel: Array,       // 表单配置
    formData: Object,       // 表单信息
    selectOptions: Array,   // 单选项信息
    inline: Boolean
  },
  methods: {},
  data() {
    return {}
  },
  mounted() {
    this.$bus.$on('toFormValid', (data) => {
      let event = 'returnFormValid' + data
      this.$nextTick(() => {
        this.$refs.form.validate((valid) => {
          this.$bus.$emit(event, valid)
        });
      });
    })
  },
  beforeDestroy() {
    this.$bus.$off('toFormValid')
  }
}
</script>

<style>
</style>