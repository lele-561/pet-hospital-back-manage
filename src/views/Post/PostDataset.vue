<template>
  <div>
    <h3>数据集发布</h3>
    <el-form ref="datasetInfo" :model="datasetInfo" label-width="120px" style="margin-top: 10px" :rules="rules">
      <el-form-item label="名称" prop="title">
        <el-input v-model="datasetInfo.title"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="datasetInfo.type" placeholder="请选择">
          <el-option v-for="item in options" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="datasetInfo.description"></el-input>
      </el-form-item>
      <el-form-item label="获取链接" prop="link">
        <el-input v-model="datasetInfo.link" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="github链接">
        <el-input v-model="datasetInfo.githubLink"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">{{ isCreate ? '立即创建' : '确认修改' }}</el-button>
        <el-button @click="back">取消</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
import {postRequest} from "@/utils/api";

export default {
  data() {
    return {
      isCreate: true,
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
      },
      options: ["关系抽取", "命名实体识别", "文本分类", "情感分析", "小样本学习", "知识问答", "阅读理解", "文本摘要", "文本生成", "其他"],
      rules: {
        title: [{required: true, message: "请输入数据集标题", trigger: "blur"}],
        type: [{required: true, message: "请设置数据集类型", trigger: ["blur","change"]}],
        link: [{required: true, message: "请设置获取链接", trigger: "blur"},],
      }
    };
  },
  activated() {
    this.isCreate = this.$route.query.isCreate;
    if (!this.isCreate) {
      this.datasetInfo = this.$route.query.datasetInfo;
    } else {
      this.clear();
      this.datasetInfo.publishUser.id = this.$store.state.user.token
      this.datasetInfo.publishUser.name = this.$store.state.user.userName
    }
  },
  methods: {
    onSubmit() {
      console.log(this.$refs)
      this.$refs.datasetInfo.validate((valid) => {
        if (valid) {
          postRequest("/dataset/updateDataset", {
            datasetInfo: this.datasetInfo,
            isCreate: this.isCreate
          }).then(resp => {
            this.$confirm("成功上传，继续编辑还是查看数据集列表？", "提示", {
              confirmButtonText: "继续编辑",
              cancelButtonText: "查看数据集列表",
              type: "success",
            })
                .then(() => {
                })
                .catch(() => {
                  this.$router.replace("/datasetList")
                });
          });
        } else {
          return false;
        }
      });
    },
    back() {
      this.$confirm("此操作将不会保存, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$router.back()
      });
    },
    clear() {
      this.datasetInfo = {
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
};
</script>