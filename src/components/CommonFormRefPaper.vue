<template>
  <el-form ref="formData" :inline="inline" label-width="100px">
    <el-form-item label="引用文献">
      <el-autocomplete v-model="formData.refTitle" :fetch-suggestions="querySearchAsync" placeholder="请输入内容"
                       @select="handleSelect"></el-autocomplete>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="formData.refNote" placeholder="请输入备注" type="textarea"></el-input>
    </el-form-item>
    <el-form-item>
      <slot></slot>
    </el-form-item>
  </el-form>
</template>

<script>
import {postRequest} from '@/utils/api'

export default {
  name: 'CommonForm',
  props: {
    formData: Object,       // 表单信息
    inline: Boolean
  },
  data() {
    return {}
  },
  methods: {
    querySearchAsync(queryString, cb) {
      var results = []
      if (queryString === '') {
        cb(results);
      } else {
        postRequest('/paper/remoteSearch',
          {
            searchType: 'title',
            input: queryString
          }
        ).then((resp) => {
          // 把标题提取出来，paper先不变
          results = resp.data;
        })
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    handleSelect(item) {
      this.formData.refId = item.label;
    },
  },
}
</script>

<style>
</style>