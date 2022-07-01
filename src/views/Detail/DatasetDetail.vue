<template>
  <div>
    <div class="header">
      <div class="header-h3">
        <h3>数据集详情</h3>
      </div>
      <div class="header-button">
        <el-button :style="{ display: isShow }" circle icon="el-icon-edit" type="primary" @click="edit">
        </el-button>
        <el-button :style="{ display: isShow }" circle icon="el-icon-delete" type="danger" @click="del">
        </el-button>
      </div>
    </div>
    <el-descriptions :column="1" border class="margin-top" title="">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-document"></i>
          名称
        </template>
        {{ datasetInfo.title }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-reading"></i>
          发布用户
        </template>
        {{ datasetInfo.publishUser.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-reading"></i>
          类型
        </template>
        {{ datasetInfo.type }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-date"></i>
          描述
        </template>
        {{ datasetInfo.description }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-discover"></i>
          获取链接
        </template>
        <el-link :href="datasetInfo.link" type="primary">{{ datasetInfo.link }}</el-link>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location"></i>
          Github链接
        </template>
        <el-link :href="datasetInfo.github" type="primary">{{ datasetInfo.githubLink }}</el-link>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import {postRequest} from '../../utils/api'

export default {
  name: 'DatasetDetail',
  data() {
    return {
      isShow: "none",
      datasetInfo: {
        id: "",
        title: "",
        publishUser: {
          id: "",
          name: ""
        },
        type: "",
        description: "",
        link: "",
        githubLink: "",
      }
    }
  },
  activated() {
    postRequest('/dataset/getDatasetInfo', {id: this.$route.query.datasetId}).then((resp) => {
      this.datasetInfo = resp.data
    });
    if (this.$store.state.user.roleName === 'admin' || this.datasetInfo.publishUser.id === this.$store.state.user.token) {
      this.isShow = "";
    }
  },

  methods: {
    back() {
      this.$router.back()
    },
    edit() {
      this.$router.push({path: "/postDataset", query: {isCreate: false, datasetInfo: this.datasetInfo}})
    },
    del() {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postRequest('/dataset/deleteDataset', {id: this.datasetInfo.id}).then((resp) => {
          this.$message({
            message: "删除成功",
            type: "success"
          })
          this.$router.replace({name: 'datasetList'})
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  text-align: center;

  .header-h3 {
    display: inline;
    float: left;
  }

  .header-button {
    display: inline;
    float: right;
    margin-top: 12px;
  }
}
</style>