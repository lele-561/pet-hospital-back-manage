<template>
  <div>
    <el-button type="primary" @click="downloadThis">点击这个下载</el-button>
  </div>
</template>

<script>
import {postRequestJSON} from "../utils/api";
export default {
  name: 'Home',
  data() {
    return {
      barChartData: {
        title: ['测试柱图1', '测试柱图2', '测试柱图3', '测试柱图4', '测试柱图5'],//标题列表
        dimensions: ['sample', 's1', 's2', 's3'],
        source: [
          {sample: 'meihui', 's1': 43.3, 's2': 85.8, 's3': 93.7},
          {sample: 'turang', 's1': 83.1, 's2': 73.4, 's3': 55.1},
          {sample: 'weiqi', 's1': 86.4, 's2': 65.2, 's3': 82.5},
        ],
      }
    }
  },
  methods: {
    downloadThis(){
      postRequestJSON('/chart/csv').then((resp=>{
        let data = resp.data;  //csv数据
        let filename = '试试' + ".csv";   //导出的文件名
        let type = "";                      //头部数据类型
        let file = new Blob(["\ufeff" + data], { type: type });
        if (window.navigator.msSaveOrOpenBlob)
            // IE10+
          window.navigator.msSaveOrOpenBlob(file, filename);
        else {
          // Others
          let a = document.createElement("a"),
              url = URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }
      }))

    },

  },
  mounted() {
  }
}

</script>

<style lang="less" scoped>

</style>