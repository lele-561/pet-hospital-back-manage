<template>
  <div>
    <el-button class="header-button" type="primary" @click="postBatch">新建批次</el-button>
    <!-- 收集表单 -->
    <el-form :inline="true" class="search">
      <el-form-item label="">
        <el-select v-model="form.searchType" clearable placeholder="请选择搜索方式">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.input" placeholder="请输入搜索内容" style="width: 200px"></el-input>
        <el-button style="margin-left: 5px" type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 展示列表 -->
    <div>
      <common-table-batch :batches="batches"></common-table-batch>
    </div>
    <!-- 底部跳转 -->
    <div style="text-align: center;margin-top: 10px">
      <el-pagination :page-count="totalPages" :page-size="pageSize" :pager-count="7" background
                     layout="prev, pager, next, jumper" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import CommonTableBatch from '@/components/CommonTableBatch.vue'
import {postRequestJSON} from "../../utils/api";

export default {
  name: 'BatchList',
  mounted() {
    this.search();
  },
  data() {
    return {
      options: [
        {
          value: 'batch',
          label: '按批次名'
        },
        {
          value: 'time',
          label: '按实验时间'
        }],
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      batches: [],
      form: {
        searchType: '',
        input: ''
      },
      loading: false,
      timeout: null
    }
  },
  components: {
    CommonTableBatch
  },
  methods: {
    search: function () {
      postRequestJSON('/batch/getBatchList', {
        searchType: this.form.searchType,
        input: this.form.input,
        currentPage: this.currentPage
      }).then((resp) => {
        this.batches = resp.data.result.batchList;
        this.totalPages = resp.data.result.totalPages;
        this.currentPage = resp.data.result.currentPage;
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search()
    },
    postBatch: function () {
      this.$router.push({name: 'postBatch', query: {isCreate: true}})
    },
  },
}

</script>

<style lang="less" scoped>
.header-button {
  display: inline;
  float: left;
  margin-top: 2%;
}

.search {
  display: inline;
  margin-top: 2%;
  float: right;
}
</style>