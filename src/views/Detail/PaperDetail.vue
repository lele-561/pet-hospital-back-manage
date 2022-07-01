<template>
  <div>
    <div>
      <!-- 论文详情 -->
      <div class="header">
        <div class="header-h3">
          <h3>论文详情</h3>
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
            论文名
          </template>
          {{ paperInfo.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-reading"></i>
            作者
          </template>
          {{ paperInfo.author }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-reading"></i>
            发布用户
          </template>
          {{ paperInfo.publishUser.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-reading"></i>
            会议
          </template>
          {{ paperInfo.meeting }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-date"></i>
            发表年份
          </template>
          {{ paperInfo.year }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-paperclip"></i>
            论文类型
          </template>
          {{ paperInfo.type }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-collection-tag"></i>
            标签
          </template>
          <el-tag v-for="(tag, index) in paperInfo.tags" :key="index" size="small">{{ tag }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-data-analysis"></i>
            数据集
          </template>
          <el-tag v-for="(tag, index) in paperInfo.datasets" :key="index" size="small">{{ tag }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-discover"></i>
            Github链接
          </template>
          <el-link :href="paperInfo.githubLink" type="primary">{{ paperInfo.githubLink }}</el-link>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location"></i>
            论文链接
          </template>
          <el-link :href="paperInfo.pdfLink" type="primary">{{ paperInfo.pdfLink }}</el-link>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-collection"></i>
            Bibtex引用
          </template>
          <el-input v-model="paperInfo.bib" :disabled="true" autosize type="textarea">
          </el-input>
          <el-button circle icon="el-icon-s-release" size="medium" type="info" @click="fixBib"></el-button>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-collection"></i>
            引用文献
          </template>
          <!-- 引用文献表格 -->
          <div>
            <el-table :data="tableData">
              <el-table-column label="论文标题" min-width="50%">
                <template slot-scope="scope">
                  <span style="margin-left:10px">
                    <el-link hover="" type="primary" @click="gotoRefPaper(scope.row)">{{
                        scope.row.refTitle
                      }}</el-link>
                  </span></template>
              </el-table-column>
              <el-table-column label="备注" min-width="50%">
                <template slot-scope="scope"><span style="margin-left:10px">
                                        {{ scope.row.refNote }}
                                    </span></template>
              </el-table-column>
            </el-table>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 相关笔记 -->
    <div>
      <div class="header">
        <div class="header-h3">
          <h3>相关笔记</h3>
        </div>
        <div class="header-button">
          <el-button circle icon="el-icon-edit" type="primary" @click="addNote">写笔记</el-button>
        </div>
      </div>
      <common-table-note :currentPage="currentPage" :notes="notes" :paperId="paperInfo.id"></common-table-note>
      <!-- 底部跳转 -->
      <div style="text-align: center;margin-top: 10px">
        <el-pagination :page-count="totalPages" :page-size="pageSize" :pager-count="7" background
                       layout="prev, pager, next, jumper" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import CommonTableNote from '@/components/CommonTableNote.vue'

import {postRequest} from '../../utils/api';

export default {
  components: {CommonTableNote},
  name: 'PaperDetail',
  data() {
    return {
      isShow: "none",
      paperInfo: {
        id: "",
        title: "title",
        author: "",
        publishUser: {
          id: "",
          name: ""
        },
        meeting: "meeting",
        year: "year",
        type: "type",
        tags: ["标签一", "标签2"],
        datasets: [],
        bib: "this is bib",
        githubLink: "https://github.com",
        pdfLink: "https://www.baidu.com"
      },
      notes: [],
      tableData: [],
      tableLabel: [{
        prop: "refTitle",
        label: '论文标题'
      }, {
        prop: "refNote",
        label: '备注'
      },
      ],
      pageSize: 10,
      totalPages: 1,
      currentPage: 1,
    };
  },
  activated() {
    postRequest('/paper/getPaperInfo', {id: this.$route.query.paperId}).then((resp) => {
      this.paperInfo = resp.data.paperInfo;
      this.tableData = resp.data.refPapers;
    });
    this.search();
    if (this.$store.state.user.roleName === 'admin' || this.paperInfo.publishUser.id === this.$store.state.user.token) {
      this.isShow = "";
    }
  },
  methods: {
    search() {
      postRequest('/note/getNoteList', {
        paperId: this.$route.query.paperId,
        currentPage: this.currentPage
      }).then((resp) => {
        this.notes = resp.data.content;
        this.totalPages = resp.data.totalPages;
        this.currentPage = resp.data.currentPage;
      });
    },
    back() {
      this.$router.back()
    },
    edit() {
      this.$router.push({name: "postPaper", query: {isCreate: false, paperInfo: this.paperInfo}})
    },
    del() {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postRequest('/paper/deletePaper', {id: this.paperInfo.id}).then((resp) => {
          this.$message({
            message: "删除成功",
            type: "success"
          })
          this.$router.replace({name: 'paperList'})
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      this.search()
    },
    fixBib() {
      getRequest("/paper/fixBib", {
        bib: this.paperInfo.bib,
        title: this.paperInfo.title
      }).then((resp) => {
        this.paperInfo.bib = resp.data
      });
    },
    addNote() {
      this.$router.push({
        name: "postNote", query: {
          isCreate: true,
          paperId: this.paperInfo.id,
          paperTitle: this.paperInfo.title
        }
      });
    },
    gotoRefPaper(row) {
      this.$router.push({name: "paperDetail", query: {paperId: row.id}})
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