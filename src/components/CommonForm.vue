<template>
  <el-form ref="form" :model="formData" :inline="inline" label-width="110px">
    <el-form-item v-for="item in formLabel" :key="item.label" :label="item.label" :prop="item.prop" :rules="item.rules">
      <el-input v-if="item.type === 'input'" v-model="formData[item.model]" :placeholder="'请输入' + item.label"
                :maxlength='item.maxlength' show-word-limit>
      </el-input>
      <el-switch v-if="item.type === 'switch'" v-model="formData[item.model]"></el-switch>
      <el-date-picker v-if="item.type === 'date'" v-model="formData[item.model]" placeholder="选择日期" type="date"
                      value-format="yyyy-MM-dd"></el-date-picker>
      <el-time-picker 
        is-range 
        v-if="item.type === 'time'"
        v-model="formData[item.model]"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围">
      </el-time-picker>
      <el-select v-if="item.type === 'selectStatic'" v-model="formData[item.model]" clearable placeholder="请选择">
        <el-option v-for="item in item.opts" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-if="item.type === 'selectDynamic'" v-model="formData[item.model]" clearable placeholder="请选择">
        <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input v-if="item.type === 'textarea'" type="textarea" autosize v-model="formData[item.model]"
                :placeholder="'请输入' + item.label"></el-input>
      <el-radio-group v-if="item.type === 'radio-group'" v-model="formData[item.model]">
        <el-radio label="A">A</el-radio>
        <el-radio label="B">B</el-radio>
        <el-radio label="C">C</el-radio>
        <el-radio label="D">D</el-radio>
      </el-radio-group>
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
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
    }
  }, 
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