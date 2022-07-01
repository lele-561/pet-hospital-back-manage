<template>
  <!-- 评论 -->
  <div>
    <div class="header">
      <div class="header-h3">
        <h3>笔记详情</h3>
      </div>
      <div class="header-button">
        <el-button :style="{ display: isShow }" circle icon="el-icon-edit" type="primary" @click="edit"></el-button>
        <el-button :style="{ display: isShow }" circle icon="el-icon-delete" type="danger" @click="del"></el-button>
      </div>
    </div>
    <el-descriptions :column="1" border class="margin-top" title="">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-reading"></i>
          笔记标题
        </template>
        {{ noteInfo.noteTitle }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-reading"></i>
          论文标题
        </template>
        {{ noteInfo.paperTitle }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-date"></i>
          笔记作者
        </template>
        {{ noteInfo.publishUser.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-paperclip"></i>
          笔记发布时间
        </template>
        {{ noteInfo.releaseTime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-collection"></i>
          笔记更新时间
        </template>
        {{ noteInfo.updateTime }}
      </el-descriptions-item>
    </el-descriptions>
    <mavon-editor v-model="noteInfo.content" :defaultOpen="'preview'" :editable="false" :navigation="true"
                  :subfield="false" :toolbarsFlag="false" style="margin-top: 20px"/>
    <h3>写评论</h3>
    <common-comment :noteId="noteInfo.noteId"></common-comment>
  </div>
</template>

<script>
import CommonComment from '@/components/CommonComment'
import {postRequest} from '../../utils/api';

export default {
  name: 'NoteDetail',
  data() {
    return {
      isShow: "none",
      noteInfo: {
        paperId: "",
        paperTitle: "",
        noteId: "",
        noteTitle: "",
        content: "",
        publishUser: {
          id: "",
          name: ""
        },
        releaseTime: "",
        updateTime: "",
      }
    }
  },
  activated() {
    postRequest('/note/getNoteInfo', {id: this.$route.query.noteId}).then((resp) => {
      this.noteInfo = resp.data;
      console.log(this.noteInfo)
    })
    if (this.$store.state.user.roleName === 'admin' || this.noteInfo.publishUser.id === this.$store.state.user.token) {
      this.isShow = "";
    }
  },
  components: {
    CommonComment
  },
  methods: {
    back() {
      this.$router.back()
    },
    edit() {
      this.$router.push({name: 'postNote', query: {isCreate: false, noteInfo: this.noteInfo}})
    },
    del() {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postRequest('/note/deleteNote', {id: this.noteInfo.noteId}).then((resp) => {
          this.$message({
            message:"删除成功",
            type:"success"
          })
          this.$router.back()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
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