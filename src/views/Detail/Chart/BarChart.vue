<template>
  <div class="Home">
    <div class="content">
      <!-- v-for 遍历父级div-->
      <div v-for="(item,index) in barChartData.title" :key="index" class="main">
        <!--自定义宽高的dom，用于放置图表-->
        <div class="bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {postRequestJSON} from "../../../utils/api";

export default {
  name: "BarChart",
  data() {
    return {
      barChartData: {
        // title: ['测试柱图1', '测试柱图2', '测试柱图3'],//标题列表
        // dimensions: {
        //   0: ['sample', 's1/001002003', 's1'],
        //   1: ['sample', 's2/001002003', 's2'],
        //   2: ['sample', 's3/001002003', 's3'],
        // },
        // source: {
        //   0: [
        //     {sample: 'meihui', 's1/001002003': 43.3, 's1': 85.8},
        //     {sample: 'turang', 's1/001002003': 83.1, 's1': 73.4},
        //     {sample: 'weiqi', 's1/001002003': 86.4, 's1': 65.2},
        //   ],
        //   1: [
        //     {sample: 'meihui', 's2/001002003': 43.3, 's2': 85.8},
        //     {sample: 'turang', 's2/001002003': 83.1, 's2': 73.4},
        //     {sample: 'weiqi', 's2/001002003': 86.4, 's2': 65.2},
        //   ],
        //   2: [
        //     {sample: 'meihui', 's3/001002003': 43.3, 's3': 85.8},
        //     {sample: 'turang', 's3/001002003': 83.1, 's3': 73.4},
        //     {sample: 'weiqi', 's3/001002003': 86.4, 's3': 65.2},
        //   ],
        // }
      },
    }
  },
  mounted() {
    this.$bus.$on("drawBarChart", this.drawBarChart)
  },
  beforeDestroy() {
    this.$bus.$off('drawBarChart')
  },
  methods: {
    async getBarChartInfo(data) {
      const loading = this.$loading({
        lock: true,
        text: '执行中，请等一会儿~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await postRequestJSON('/chart/getBarChartInfo', {
        groupId: data.groupId,
        modelType: data.modelType,
        batchId:data.batchId
      }).then((resp) => {
        loading.close();
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
          this.barChartData = resp.data.result.raw_data;
        } else if (resp.data.code === 1) {
          this.$confirm(resp.data.message, '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        } else {
          this.$confirm(resp.data.message, '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
      });
    },
    async drawBarChart(data) {
      await this.getBarChartInfo(data);
      var myEchart = document.getElementsByClassName('bar'); //获取类名
      // 此处for循环多次初始化 echarts 实例
      for (var i = 0; i < myEchart.length; i++) {
        var myChart = this.$echarts.init(myEchart[i], null, {renderer: 'svg'}); //初始化echarts实例要在for循环内
        let option = {
          title: {
            text: this.barChartData.title[i],
            left: '50%',
            top: '5%',
            textAlign: 'center'
          },
          grid: {top: "35%", left: "15%", right: "10%", bottom: "15%"},
          legend: {top: '20%', right: 'center'},
          tooltip: {},
          dataset: {
            dimensions: this.barChartData.dimensions[i],
            source: this.barChartData.source[i]
          },
          xAxis: {type: 'category'},
          yAxis: {},
          series: [{
            type: 'bar',
            label: {normal: {show: true, position: 'top'}}
          },
            {
              type: 'bar',
              label: {normal: {show: true, position: 'top'}}
            }],
          toolbox: {
            show: true,
            feature: {
              dataView: {show: true},
              saveAsImage: {show: true, name: this.heatMapName}
            }
          },
        }
        //使用刚指定的配置项和数据显示图表
        myChart.setOption(option);
      }
    },
  },
}
</script>

<style lang="less" scoped>
// 柱状图
.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.main {
  width: 300px;
  margin-top: 20px;
  height: 200px;
  margin-left: 20px;
  background-color: #FFFFFF;

  .bar {
    width: 100%;
    height: 100%;
  }
}
</style>