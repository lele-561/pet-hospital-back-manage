<template>
  <div>
    <el-button class="header-button" type="primary" @click="postPaper">发布论文</el-button>
    <!-- 收集表单 -->
    <el-form :inline="true" class="search">
      <el-form-item label="">
        <el-radio-group v-model="form.searchType">
          <el-radio label="title">按标题搜索</el-radio>
          <el-radio label="tag">按标签搜索</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-autocomplete v-model="form.input" :fetch-suggestions="querySearchAsync" placeholder="请输入内容"
                         @select="handleSelect"></el-autocomplete>
        <el-form-item label="">
          <el-button style="margin-left: 5px" type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
    <!-- 展示列表 -->
    <div>
      <common-table-paper :papers="papers"></common-table-paper>
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
import CommonTablePaper from '@/components/CommonTablePaper.vue'

import {postRequest} from '@/utils/api'

export default {
  name: 'PaperList',
  mounted() {
    this.search();
  },
  activated() {
    this.search();
  },
  data() {
    return {
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      papers: [],
      form: {
        searchType: 'title',
        input: ''
      },
      loading: false,
      timeout: null
    }
  },
  components: {
    CommonTablePaper
  },
  methods: {
    search: function () {
      postRequest('/paper/getPaperList', {
        searchType: this.form.searchType,
        input: this.form.input,
        currentPage: this.currentPage
      }, this.form.searchType, this.form.input, this.currentPage).then((resp) => {
        // paper改变
        this.papers = resp.data.content;
        this.totalPages = resp.data.totalPages;
        this.currentPage = resp.data.currentPage;
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search()
    },
    postPaper: function () {
      this.$router.push({name: 'postPaper', query: {isCreate: true}})
    },
    querySearchAsync(queryString, cb) {
      var results = []
      if (queryString === '') {
        cb(results);
      } else {
        postRequest('/paper/remoteSearch', this.form).then((resp) => {
          results = resp.data;
        })
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    handleSelect(item) {
    }
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