<template>
  <div>
    <h3>论文发布</h3>
    <el-form ref="paperForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="论文标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="会议" prop="meeting">
        <el-select v-model="form.meeting" placeholder="请选择会议">
          <el-option v-for="item in meetingData" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布年份" prop="year">
        <el-date-picker v-model="form.year" placeholder="选择发布年份" style="width: 100%" type="year"
                        value-format="yyyy"></el-date-picker>
      </el-form-item>
      <el-form-item label="设置标签">
        <el-tag v-for="tag in form.tags" :key="tag" :disable-transitions="false" closable
                @close="handleClose(tag, '标签')">
          {{ tag }}
        </el-tag>
        <el-input v-if="inputTagVisible" ref="saveTagInput" v-model="inputTagValue"
                  class="input-new-tag" size="small" @blur="handleInputConfirm('标签')"
                  @keyup.enter.native="handleInputConfirm('标签')">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput('标签')">+ 新标签</el-button>
      </el-form-item>
      <el-form-item label="添加数据集">
        <el-tag v-for="dataset in form.datasets" :key="dataset" :disable-transitions="false" closable
                @close="handleClose(dataset, '数据集')">
          {{ dataset }}
        </el-tag>
        <el-input v-if="inputDatasetVisible" ref="saveDatasetInput" v-model="inputDatasetValue"
                  class="input-new-tag" size="small" @blur="handleInputConfirm('数据集')"
                  @keyup.enter.native="handleInputConfirm('数据集')">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput('数据集')">+ 数据集</el-button>
      </el-form-item>
      <el-form-item label="论文类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio label="实验" name="type"></el-radio>
          <el-radio label="综述" name="type"></el-radio>
          <el-radio label="数据集" name="type"></el-radio>
          <el-radio label="工具" name="type"></el-radio>
          <el-radio label="理论" name="type"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="论文链接" prop="pdfLink">
        <el-input v-model="form.pdfLink" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="Github链接">
        <el-input v-model="form.githubLink" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="Bibtex引用">
        <el-input v-model="form.bib" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="添加引用文献">
        <el-dialog :title="operateType === 'add' ? '新增' : '更新'" :visible.sync="isShow">
          <common-form-ref-paper ref="form" :formData="operateFormData" :inline="true">
          </common-form-ref-paper>
          <div slot="footer" class="dialog-footer">
            <el-button type="" @click="isShow = false">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
          </div>
        </el-dialog>
        <el-button size="small" type="primary" @click="addRefPaper">新增</el-button>
        <!-- 表格部分 -->
        <div>
          <common-table-user :tableData="tableData" :tableLabel="tableLabel" @del="delRefPaper"
                             @edit="editRefPaper">
          </common-table-user>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">{{ isCreate ? '立即创建' : '确认修改' }}</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CommonFormRefPaper from '@/components/CommonFormRefPaper'
import CommonTableUser from '../../components/CommonTableUser.vue';
import {postRequest} from '@/utils/api'

export default {
  name: 'PostPaper',
  components: {
    CommonFormRefPaper, CommonTableUser
  },
  data() {
    return {
      isCreate: true,
      searchInput: "",
      operateType: "add",
      isShow: false,
      form: {
        id: "",
        title: "",
        author: "",
        publishUser: {
          id: "",
          name: ""
        },
        meeting: "",
        year: "",
        type: "实验",
        bib: "",
        githubLink: "",
        pdfLink: "",
        tags: [],
        datasets: []
      },
      inputTagVisible: false,
      inputTagValue: "",
      inputDatasetVisible: false,
      inputDatasetValue: "",
      inputRefPaperVisible: false,
      inputRefPaperValue: "",
      // 表单配置
      operateFormData:
          {
            refId: "",
            refTitle: "",
            refNote: "",
          },
      tableData: [
        //     {
        //   refId: 123,
        //   refTitle: "aa",
        //   refNote: "1123",
        // }
      ],
      tableLabel: [{
        prop: "refTitle",
        label: '论文标题'
      },
        {
          prop: "refNote",
          label: '引用备注'
        }
      ],
      rules: {
        title: [{required: true, message: "请输入论文标题", trigger: "blur"}],
        meeting: [{required: true, message: "请选择会议", trigger: "blur"}],
        year: [{required: true, message: "请选择会议", trigger: "change"}],
        type: [{required: true, message: "请设置论文类型", trigger: "blur"}],
        pdfLink: [{required: true, message: "请设置论文链接", trigger: "blur"}],
      },
      meetingData: [
        {
          label: 'ACL',
          value: 'ACL'
        },
        {
          label: 'EMNLP',
          value: 'EMNLP'
        }, {
          label: 'NAACL',
          value: 'NAACL'
        }, {
          label: 'NeurIPS',
          value: 'NeurIPS',
        },
        {
          label: 'AAAI',
          value: 'AAAI',
        }, {
          label: 'EACL',
          value: 'EACL',
        }, {
          label: 'ICML',
          value: 'ICML',
        }, {
          label: 'IJCAI',
          value: 'IJCAI',
        },
        {
          label: 'COLING',
          value: 'COLING',
        },
        {
          label: 'CoNLL',
          value: 'CoNLL',
        }, {
          label: 'ICLR',
          value: 'ICLR',
        },
        {
          label: '其它',
          value: 'OTHER',
        }
      ]
    };
  },
  activated() {
    this.isCreate = this.$route.query.isCreate;
    if (!this.isCreate) {
      this.form = this.$route.query.paperInfo;
      this.operateType = 'edit';
    } else {
      this.clear();
      this.form.publishUser.id = this.$store.state.user.token
      this.form.publishUser.name = this.$store.state.user.userName
    }
  },
  methods: {
    handleCancel() {
      this.$confirm("此操作将不会保存, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$router.push({path: "/paperList"});
      });
    },
    onSubmit() {
      this.$nextTick(() => {
        this.$refs.paperForm.validate((valid) => {
          if (valid) {
            postRequest("/paper/updatePaper", {
              paperInfo: this.form,
              refPapers: this.tableData,
              isCreate: this.isCreate
            }).then((resp) => {
              this.$confirm("成功上传，继续编辑还是查看论文列表？", "提示", {
                confirmButtonText: "继续编辑",
                cancelButtonText: "查看论文列表",
                type: "success",
              })
                  .then(() => {
                  })
                  .catch(() => {
                    this.$router.push("/paperList")
                  });
            });
          } else {
            return false;
          }
        });
      });

    },
    clear() {
      this.form = {
        id: "",
        title: "",
        author: "",
        publishUser: {
          id: "",
          name: ""
        },
        meeting: "",
        year: "",
        type: "实验",
        bib: "",
        githubLink: "",
        pdfLink: "",
        tags: [],
        datasets: [],
      };
      this.tableData = []
    },
    handleClose(type, typeName) {
      if (typeName === "标签")
        this.form.tags.splice(this.form.tags.indexOf(type), 1);
      else if (typeName === "数据集")
        this.form.datasets.splice(this.form.datasets.indexOf(type), 1);
      else if (typeName === "引用文献")
        this.form.refPapers.splice(this.form.refPapers.indexOf(type), 1);
    },
    handleInputConfirm(typeName) {
      if (typeName === "标签") {
        let inputValue = this.inputTagValue;
        if (inputValue) {
          this.form.tags.push(inputValue);
        }
        this.inputTagVisible = false;
        this.inputTagValue = "";
      } else if (typeName === "数据集") {
        let inputValue = this.inputDatasetValue;
        if (inputValue) {
          this.form.datasets.push(inputValue);
        }
        this.inputDatasetVisible = false;
        this.inputDatasetValue = "";
      } else if (typeName === "引用文献") {
        let inputValue = this.inputRefPaperValue;
        if (inputValue) {
          this.form.refPapers.push(inputValue);
        }
        this.inputRefPaperVisible = false;
        this.inputRefPaperValue = "";
      }
    },
    showInput(typeName) {
      if (typeName === "标签") {
        this.inputTagVisible = true;
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      } else if (typeName === "数据集") {
        this.inputDatasetVisible = true;
        this.$nextTick((_) => {
          this.$refs.saveDatasetInput.$refs.input.focus();
        });
      } else if (typeName === "引用文献") {
        this.inputRefPaperVisible = true;
        this.$nextTick((_) => {
          this.$refs.saveRefPaperInput.$refs.input.focus();
        });
      }
    },
    // 表单操作
    confirm() {
      if (this.operateType === 'add') {
        this.tableData.push({
          refId: this.operateFormData.refId,
          refTitle: this.operateFormData.refTitle,
          refNote: this.operateFormData.refNote
        })
      }
      this.isShow = false;
    },
    addRefPaper() {
      this.isShow = true;
      this.operateType = 'add';
      this.operateFormData = {
        refId: "",
        refTitle: "",
        refNote: "",
      }
    },
    editRefPaper(row) {
      this.operateType = 'edit';
      this.isShow = true;
      this.operateFormData = row
    },
    delRefPaper(row) {
      this.tableData = this.tableData.filter(item => item.refId !== row.refId)
    }
  }
}
</script>

<style>
</style>