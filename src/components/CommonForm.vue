<template>
  <el-form ref="formData" :inline="inline" label-width="100px">
    <el-form-item v-for="item in formLabel" :key="item.label" :label="item.label">
      <el-input v-if="item.type === 'input'" v-model="formData[item.model]" :placeholder="'请输入' + item.label">
      </el-input>
      <el-switch v-if="item.type === 'switch'" v-model="formData[item.model]"></el-switch>
      <el-date-picker v-if="item.type === 'date'" v-model="formData[item.model]" placeholder="选择日期" type="date"
                      value-format="yyyy-MM-dd"></el-date-picker>
      <el-select v-if="item.type === 'select'" v-model="formData[item.model]" clearable placeholder="请选择">
        <el-option v-for="item in item.opts" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input v-if="item.type === 'textarea'" type="textarea" autosize v-model="formData[item.model]"
                :placeholder="'请输入' + item.label"></el-input>
      <el-autocomplete v-if="item.type==='remoteSearch'"
                       v-model="formData[item.model]"
                       :fetch-suggestions="querySearchAsync(formData[item.model])"
                       placeholder="请输入内容"
                       @select="handleSelect(formData[item.model])"
      ></el-autocomplete>
    </el-form-item>
    <el-form-item>
      <slot></slot>
    </el-form-item>
  </el-form>
</template>

<script>
import {postFormData} from "../utils/api";

export default {
  name: 'CommonForm',
  props: {
    formLabel: Array,       // 表单配置
    formData: Object,       // 表单信息
    inline: Boolean
  },
  methods: {
    handleSelect(item) {
      console.log(item);
    },
    querySearchAsync(queryString, cb) {
      var res = []
      if (queryString) {
        postFormData('/test/remoteSearch', '').then((resp) => {
          res = resp.data.result.data
          var results = queryString ? res.filter(this.createStateFilter(queryString)) : res;

          console.log(res)
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results);
          }, 3000 * Math.random());
          // (resp.data.code === 0) {
          //   this.$message({
          //     type: 'success',
          //     message: resp.data.message
          //   });
          //   this.isShow = false;
          //   this.search('')
          // } else {
          //   this.$message({
          //     type: 'warning',
          //     message: resp.data.message
          //   });
          // }
        })
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
  },

  data() {
    return {}
  }
}
</script>

<style>
</style>