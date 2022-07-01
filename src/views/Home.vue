<template>
  <el-row :gutter="20" class="home">
    <el-col :span="9" style="margin-top:20px">
      <el-card>
        <div class="user">
          <div class="userPic">
            <img :src="userImg" style="width:100px;height:100px;border-radius:100%"/>
          </div>
          <div class="userInfo">
            <div class="userName">{{ userName }}</div>
            <div class="roleName">{{ roleName }}</div>
            <div class="userId">id: {{ userId }}</div>
          </div>
        </div>
      </el-card>
      <el-card style="margin-top:15px;height:460px">
        <div style="font-weight:bold">我的发布</div>
        <el-table :data="tableData" style="margin-bottom: 15px" max-height="440px">
          <el-table-column align="left" label="名称" min-width="70%" prop="title">
            <template slot-scope="scope">
              <span style="color: #409eff; cursor: pointer" @click="itemClick(scope.row)">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column :filter-method="filterHandler" :filters="typeFilters" align="left" label="类型" min-width="30%"
                           prop="type">
            <template slot-scope="scope">
              {{ scope.row.type }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="15">
      <div class="num" style="margin-top:20px">
        <el-card style="height:310px">
          <div style="font-weight:bold">论文沿时间线统计</div>
          <div id="paperWithTimeline" style="width:780px;height:260px;"></div>
        </el-card>
      </div>
      <div class="num" style="margin-top:15px">
        <el-col :span="12">
          <el-card style="height:290px">
            <div style="font-weight:bold">每个标签下论文数量统计</div>
            <div id="paperWithTag" style="width:350px;height:270px;text-align: center"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card style="height:290px">
            <div style="font-weight:bold">每个数据集下论文数量统计</div>
            <div id="paperWithDataset" style="width:350px;height:270px;text-align: center"></div>
          </el-card>
        </el-col>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {postRequest} from '../utils/api.js';

export default {
  name: 'Home',
  data() {
    return {
      userName: this.$store.state.user.userName,
      userId: this.$store.state.user.token,
      roleName: this.$store.state.user.roleName === "admin" ? "系统管理员" : "普通用户",
      userImg: require('../assets/logo.jpg'),
      tableData: [],
      tableLabel: {
        title: '名称',
        type: '类型',
      },
      dataTimeline: [],
      dataTag: [],
      dataDataset: [],
      typeFilters: [
        {
          text: '论文',
          value: '论文'
        },
        {
          text: '数据集',
          value: '数据集'
        }, {
          text: '笔记',
          value: '笔记'
        }]
    }
  },
  methods: {
    itemClick(row) {
      if (row.type === "论文") {
        this.$router.push({name: "paperDetail", query: {paperId: row.id}})
      } else if (row.type === "数据集") {
        this.$router.push({name: "datasetDetail", query: {datasetId: row.id}})
      } else if (row.type === "笔记") {
        this.$router.push({name: "noteDetail", query: {noteId: row.id}})
      }
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    async drawChart() {
      await postRequest('/chart/getPaperTimeline').then((resp) => {
        this.dataTimeline = resp.data;
      });
      await postRequest('/chart/getPaperWithTag').then((resp) => {
        this.dataTag = resp.data;
      });
      await postRequest('/chart/getPaperWithDataset').then((resp) => {
        this.dataDataset = resp.data;
      });
      let chartTimeline = this.$echarts.init(document.getElementById('paperWithTimeline'));
      let chartTag = this.$echarts.init(document.getElementById('paperWithTag'));
      let chartDataset = this.$echarts.init(document.getElementById('paperWithDataset'));

      var tempSeries = []
      for (var i = 0; i < this.dataTimeline.meetingInfo.length; i++) {
        tempSeries.push({
          name: this.dataTimeline.meetingInfo[i].name,
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: this.dataTimeline.meetingInfo[i].paperCnt
        })
      }

      chartTimeline.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '2%',
          right: '5%',
          top: '10%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: this.dataTimeline.year
        },
        series: tempSeries
      });
      chartTag.setOption({
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '标签',
            type: 'pie',
            radius: '50%',
            data: this.dataTag,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
      chartDataset.setOption({
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '标签',
            type: 'pie',
            radius: '50%',
            data: this.dataDataset,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  },
  mounted() {
    postRequest('/user/getMyPublish', {id: this.$store.state.user.token}).then((resp) => {
      this.tableData = resp.data;
    });
    this.drawChart()
  }
}
</script>

<style lang="less" scoped>

.home {
  margin-top: 0px;
}

.user {
  // display: inline-block;
  display: flex;
  align-items: center;

  .userPic {
    float: left;
    width: 100px;
    height: 100px;
    margin-left: 20px;

  }

  .userInfo {
    float: right;
    align-content: center;
    margin-left: 80px;
    line-height: 35px;

    .userName {
      font-size: 35px;
    }

    .roleName {
      font-size: 15px;
      line-height: normal;
      margin-top: 10px;
      color: gray;
    }

    .userId {
      font-size: 13px;
      line-height: normal;
      margin-top: 3px;
      color: gray;
    }
  }
}
</style>