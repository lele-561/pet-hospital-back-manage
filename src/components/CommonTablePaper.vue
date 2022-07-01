<template>
  <div>
    <el-table ref="multipleTable" :data="papers" :stripe="true" max-height="600"
              style="width: 100%; overflow-x: hidden; overflow-y: hidden" tooltip-effect="dark">
      <el-table-column align="left" label="标题" min-width="38%" prop="title">
        <template slot-scope="scope"><span style="color: #409eff; cursor: pointer" @click="itemClick(scope.row)">{{
            scope.row.title
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :filter-method="filterHandler" :filters="meetingFilters" align="left" label="会议" min-width="10%"
                       prop="meeting">
        <template slot-scope="scope">
          {{ scope.row.meeting + " " + scope.row.year }}
        </template>
      </el-table-column>
      <el-table-column :filter-method="filterHandler" :filters="typeFilters" align="left" label="类型" min-width="7%"
                       prop="type">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="标签" min-width="15%" prop="tags">
        <template slot-scope="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" label="发布时间" min-width="15%" prop="publishTime" sortable>
        <template slot-scope="scope">{{ scope.row.publishTime }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="更新时间" min-width="15%" prop="updateTime" sortable>
        <template slot-scope="scope">{{ scope.row.updateTime }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CommonTablePaper',
  data() {
    return {
      meetingFilters: [
        {
          text: 'ACL',
          value: 'ACL'
        },
        {
          text: 'EMNLP',
          value: 'EMNLP'
        }, {
          text: 'NAACL',
          value: 'NAACL'
        }, {
          text: 'NeurIPS',
          value: 'NeurIPS',
        },
        {
          text: 'AAAI',
          value: 'AAAI',
        }, {
          text: 'EACL',
          value: 'EACL',
        }, {
          text: 'ICML',
          value: 'ICML',
        }, {
          text: 'IJCAI',
          value: 'IJCAI',
        },
        {
          text: 'COLING',
          value: 'COLING',
        },
        {
          text: 'CoNLL',
          value: 'CoNLL',
        },
        {
          text: 'ICLR',
          value: 'ICLR',
        },
        {
          text: '其它',
          value: 'OTHER',
        }
      ],
      typeFilters: [{
        text: '实验',
        value: '实验'
      }, {
        text: '综述',
        value: '综述'
      }, {
        text: '数据集',
        value: '数据集'
      }, {
        text: '工具',
        value: '工具'
      }, {
        text: '理论',
        value: '理论'
      },
      ]

    }
  },
  methods: {
    itemClick(row) {
      this.$router.push({name: "paperDetail", query: {paperId: row.id}});
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  },
  props: ["papers"],
}
</script>

<style lang="less" scoped>
.common-table {
  height: calc(100% - 62px);
  background-color: #fff;
  position: relative;

  .pager {
    position: absolute;
    bottom: 0;
    right: 20px;
  }

;
}
</style>