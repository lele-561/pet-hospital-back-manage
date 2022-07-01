<template>
  <div>
    <el-button class="header-button" type="primary" @click="postDataset">发布数据集</el-button>
    <el-form :inline="true" class="search">
      <el-form-item label="">
        <el-input v-model="form.input" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <div>
      <common-table-dataset :datasets="datasets" :pageSize="pageSize" :totalPages="totalPages"></common-table-dataset>
    </div>
    <div style="text-align: center;margin-top: 10px">
      <el-pagination :page-count="totalPages" :page-size="pageSize" :pager-count="7" background
                     layout="prev, pager, next, jumper" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

  </div>

</template>

<script>
import CommonTableDataset from '../../components/CommonTableDataset.vue'
import {postRequest} from '../../utils/api'

export default {
  name: 'PaperList',
  activated: function () {
    this.search();
  },
  data() {
    return {
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      datasets: [],
      form: {
        input: ''
      }
    }
  },
  components: {
    CommonTableDataset
  },
  methods: {
    search: function () {
      postRequest('/dataset/getDatasetList', {input:this.form.input,currentPage:this.currentPage}).then((resp) => {
        console.log(resp.data)
        this.datasets = resp.data.content;
        this.totalPages = resp.data.totalPages;
        this.currentPage= resp.data.currentPage;
      })
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search()
    },
    postDataset: function () {
      this.$router.push({name: 'postDataset', query: {isCreate: true}})
    }
  }
}
</script>

<style>
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