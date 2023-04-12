<template>
  <div>
    <el-form :inline='true' style='margin-top:12px'>
      <el-form-item label=''>
        <el-input v-model='content' placeholder='请输入'></el-input>
      </el-form-item>
      <el-form-item label=''>
        <el-button icon='el-icon-search' type='success' @click='search(content,currentPage)'>搜索</el-button>
        <el-button icon='el-icon-edit' type='primary' @click='addPetProfile'>新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <div>
      <common-table-pet-profile
          :tableData='tableData'
          :tableLabel='tableLabel'
          @changePage='search'
          @del='delPetProfile'></common-table-pet-profile>
      <div style='text-align: center; margin-top: 10px'>
        <el-pagination :page-count='totalPages' :page-size='pageSize' :pager-count='7' background
                       layout='prev, pager, next, jumper' @current-change='handleCurrentChange'>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {getFormData, postFormData} from '@/utils/api';
import CommonTablePetProfile from '@/components/CommonTablePetProfile.vue'

export default {
  name: 'DiseaseReal',
  components: {
    CommonTablePetProfile
  },
  data() {
    return {
      isShow: false,
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
      content: '',
      // 表格配置
      petProfiles: '',
      tableData: [],
      tableLabel: [
        {prop: 'name', label: '宠物名'},
        {prop: 'type', label: '种类'},
        {prop: 'gender', label: '性别'},
        {prop: 'age', label: '年龄'},
        {prop: 'diseases', label: '疾病'},
      ]
    };
  },
  methods: {
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.search(this.content, this.currentPage)
    },
    search: function (content, page) {
      getFormData('/petProfile/getAllPetProfiles', {content: content, currentPage: page}).then((resp) => {
        this.tableData = resp.data.result.petProfiles
        this.totalPages = resp.data.result.totalPages
        this.currentPage = resp.data.result.currentPage
      })
    },
    addPetProfile() {
      this.$router.push({name: 'diseaseManage_petProfile', query: {id: ''}});
    },
    delPetProfile(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postFormData('/petProfile/deleteOnePetProfile', {id: row.id}).then((resp) => {
          if (resp.data.code === 0) {
            this.$message({type: 'success', message: resp.data.message});
            this.currentPage = 1
            this.search('', this.currentPage)
          } else this.$message({type: 'warning', message: resp.data.message});
        })
      }).catch(() => {
        this.$message({type: 'info', message: '已取消删除'});
      });
    }
  },
  mounted() {
    this.currentPage = 1
    this.search('', this.currentPage);
  }
};
</script>

<style lang='less' scoped>
.header-button {
  display: inline;
  float: right;
  margin-top: 2%;
}

.search {
  display: inline;
  margin-top: 2%;
  float: right;
}
</style>