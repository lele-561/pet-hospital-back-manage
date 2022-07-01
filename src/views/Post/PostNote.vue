<template>
  <!-- 评论 -->
  <div>
    <el-descriptions :column="1" border class="margin-top" title="">
      <el-descriptions-item>
        <el-input v-model="noteInfo.noteTitle" placeholder=""></el-input>
        <template slot="label">
          <i class="el-icon-date"></i>
          笔记标题
        </template>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-reading"></i>
          论文标题
        </template>
        {{ noteInfo.paperTitle }}
      </el-descriptions-item>
    </el-descriptions>
    <mavon-editor v-model="noteInfo.content" :navigation="true" style="margin-top: 20px" @save="save"/>
    <div style="margin-top: 10px;float: right">
      <el-button type="" @click="back">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import {postRequest} from '../../utils/api';

export default {
  name: 'PostNote',
  data() {
    return {
      isCreate: "",
      noteInfo: {
        paperId: "",
        paperTitle: "",
        noteId: "",
        noteTitle: "",
        content: "",
        userId: "",
        releaseTime: "",
        updateTime: "",
      }
    }
  },
  activated() {
    this.isCreate = this.$route.query.isCreate;
    if (!this.isCreate) {
      this.noteInfo = this.$route.query.noteInfo;
    } else {
      this.noteInfo.paperId = this.$route.query.paperId;
      this.noteInfo.paperTitle = this.$route.query.paperTitle;
      this.noteInfo.userId = this.$store.state.user.token;
    }
  },
  methods: {
    back() {
      this.$confirm("此操作将不会保存, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$router.back()
      });
    },
    save() {
      postRequest("/note/updateNote", {
        isCreate: this.isCreate,
        noteInfo: {
          paperId: this.noteInfo.paperId,
          noteId: this.noteInfo.noteId,
          noteTitle: this.noteInfo.noteTitle,
          content: this.noteInfo.content,
          userId:this.noteInfo.userId
        }
      }).then((resp) => {
        this.$confirm("成功上传，继续编辑还是返回论文详情页？", "提示", {
          confirmButtonText: "继续编辑",
          cancelButtonText: "返回论文详情页",
          type: "success",
        })
            .then(() => {
            })
            .catch(() => {
              this.$router.back()
            });
      })
    },
  }
}
</script>

<style>
</style>