<template>
  <!--  热力图-->
  <!--  血泪教训：echart画图父子组件复用，如果是直接在子组件中处理的相同事件，请不要使用全局事件总线整事件谢谢！！！-->
  <!--  组件复用导致的数据覆盖，使用不同id进行区分，或使用ref进行初始化-->
  <div style="overflow:auto; margin-top: 10px">
    <div :id="HeatMapId"
         ref="Heat_Map"
         :style="{width: heatMapDivWidth + 'px', height: heatMapDivHeight + 'px'}"></div>
  </div>
</template>

<script>
import {postRequestJSON} from "../../../utils/api";

export default {
  name: "HeatMap",
  props: ["HeatMapId", "HeatMapInfo"],
  data() {
    return {
      heatMap: "",
      PM_name: [],            // 纵坐标：颗粒物名称
      chemical_element: [],   // 横坐标：元素名称
      unitData: [],           // 单元格数据：元素含量
      raw_data: [],           // 热力图原始数据
      maxValue: "",            // 最大值
      heatMapFileId: '',
      heatMapDivWidth: '',    // 热力图宽度
      heatMapDivHeight: '',   // 热力图高度
      heatMapColor: [         // 后端传过来
        '#000085',
        '#002cff',
        '#009bff',
        '#00e5ff',
        '#8dff72',
        '#fffe00',
        '#ff8900',
        '#ff3700',
        '#830000',
      ],
    }
  },
  watch: {
    'HeatMapInfo': {
      handler() {
        this.drawHeatMap(this.HeatMapInfo)
      }
    }
  },
  methods: {
    async getHeatMapInfo(data) {
      this.PM_name = []
      this.chemical_element = []
      this.unitData = []
      this.raw_data = []
      this.heatMapDivWidth = ''
      this.heatMapDivHeight = ''
      const loading = this.$loading({
        lock: true,
        text: '执行中，请等一会儿~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await postRequestJSON('/chart/getHeatMapInfo', {
        id: data.type === 'pure' ? data.groupId : data.fileId,
        sampleType: data.type,
        substanceType: data.heatMapType,
        logBase: data.logBase
      }).then((resp) => {
        loading.close();
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
          this.raw_data = resp.data.result.raw_data;
          this.maxValue = resp.data.result.maxValue;
          this.heatMapFileId = resp.data.result.fileId;
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

      // 横坐标：元素名
      for (let key in this.raw_data[0]) {
        if (key !== "component")
          this.chemical_element.push(key)
      }

      // 数据：元素含量
      for (var x = 0; x < this.raw_data.length; x++) {
        var y = 0;
        for (var key in this.raw_data[x]) {
          // 纵坐标：颗粒名称
          if (key === "component") this.PM_name.push(this.raw_data[x][key])
          else {
            this.unitData.push([y, x, this.raw_data[x][key]]);
            y++;
          }
        }
      }
      this.heatMapDivWidth = this.chemical_element.length * 40 + 50;
      this.heatMapDivHeight = this.PM_name.length * 20 + 50;
    },
    async drawHeatMap(data) {
      await this.getHeatMapInfo(data);
      if (this.heatMap !== null && this.heatMap !== "" && this.heatMap !== undefined)
        this.heatMap.dispose();//销毁

      this.heatMap = this.$echarts.init(document.getElementById(this.HeatMapId), null, {renderer: 'svg'});
      // let heatMap = this.$echarts.init(this.$refs.Heat_Map, null, {renderer: 'svg'});
      this.heatMap.setOption({
        tooltip: {
          trigger: 'item',
        },
        xAxis: {
          type: 'category',
          data: this.chemical_element,
          splitLine: {show: false,},
          splitArea: {
            show: true,
            areaStyle: {color: '#000085'}
          }
        },
        yAxis: {
          type: 'category',
          data: this.PM_name,
          splitLine: {show: false,}
        },
        visualMap: {
          min: 0,
          max: this.maxValue,    // 这里要确定范围
          calculable: true,
          realtime: false,
          inRange: {color: this.heatMapColor}
        },
        series: [
          {
            type: 'heatmap',
            data: this.unitData,
            emphasis: {itemStyle: {borderColor: '#ffffff', borderWidth: 2}},
            progressive: 1000,
            animation: false,
          }
        ],
        toolbox: {
          show: true,
          feature: {
            dataView: {show: true},
            restore: {show: true},
            dataZoom: {show: true},
            saveAsImage: {show: true, name: this.heatMapName}
          }
        },
        grid: {
          left: '4%', right: '0%', bottom: '2%', top: '2%', containLabel: true,
        },
      });
    }
  }
}
</script>

<style lang="less" scoped>

</style>