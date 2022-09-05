<template>
  <!-- 评论 -->
  <div>
    <div class="header">
      <div class="header-h3">
        <h3>样品详情</h3>
      </div>
      <!--      <div class="header-button">-->
      <!--        <el-button :style="{ display: isShow }" circle icon="el-icon-edit" type="primary" @click="edit"></el-button>-->
      <!--        <el-button :style="{ display: isShow }" circle icon="el-icon-delete" type="danger" @click="del"></el-button>-->
      <!--      </div>-->
    </div>
    <el-descriptions :column="2" border class="margin-top" title="">
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-reading"></i>
          样品名
        </template>
        {{ sampleInfo.sampleName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-reading"></i>
          批次
        </template>
        {{ sampleInfo.batchName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-reading"></i>
          样品类型
        </template>
        {{ sampleInfo.type }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-date"></i>
          文件
        </template>
        <el-button type="primary" plain size="mini" @click="downloadSampleFile">下载文件</el-button>
      </el-descriptions-item>
    </el-descriptions>

    <div>
      <h3>分析功能</h3>
      <el-row :gutter="10" class="home" style="height:250px">
        <el-col :span="8" style="height:240px">
          <el-card style="height:75px">
            <b>颗粒态分析-迭代法</b>
            <el-button style="float: right" type="primary" size="small" @click="runParticleAnalysisIteration()">运行
            </el-button>
          </el-card>
          <el-card style="height:75px;margin-top: 5px">
            <b>颗粒态分析-泊松法</b>
            <el-button style="float: right" type="primary" size="small" @click="runParticleAnalysisPoisson()">运行
            </el-button>
          </el-card>
          <el-card style="height:75px;margin-top: 5px">
            <b>计算颗粒数浓度</b>
            <el-button style="float: right" type="primary" size="small" @click="runParticleConcentration()">运行
            </el-button>
          </el-card>
        </el-col>
        <el-col :span="16" style="height:250px">
          <el-card style="height:240px">
            <div style="font-weight:bold">提取频繁项（组件渲染有延迟，参数个数如果有误请尝试刷新，正在解决中）</div>
            <el-form :inline="true" ref="paperForm" :model="form" :rules="rules" label-width="30px">
              <el-form-item size="mini" label="x1" prop="x1">
                <el-input class="input-box" v-model="form.x1"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="y1" prop="y1">
                <el-input class="input-box" v-model="form.y1"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="z1" prop="z1">
                <el-input class="input-box" v-model="form.z1"></el-input>
              </el-form-item>
            </el-form>
            <el-form :style="{ display: xyzShow }" :inline="true" ref="paperForm" :model="form" :rules="rules"
                     label-width="30px">
              <el-form-item size="mini" label="x2" prop="x2">
                <el-input class="input-box" v-model="form.x2"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="y2" prop="y2">
                <el-input class="input-box" v-model="form.y2"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="z2" prop="z2">
                <el-input class="input-box" v-model="form.z2"></el-input>
              </el-form-item>
            </el-form>
            <el-form :style="{ display: xyzShow }" :inline="true" ref="paperForm" :model="form" :rules="rules"
                     label-width="30px">
              <el-form-item size="mini" label="x3" prop="x3">
                <el-input class="input-box" v-model="form.x3"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="y3" prop="y3">
                <el-input class="input-box" v-model="form.y3"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="z3" prop="z3">
                <el-input class="input-box" v-model="form.z3"></el-input>
              </el-form-item>
            </el-form>
            <el-button type="primary" size="small" @click="runExtractFrequentItems()">运行</el-button>
            <el-button size="small" @click="clear">清空</el-button>
            <el-button type="primary" size="small" style="float: right" @click="drawHeatMap">生成热力图</el-button>
            <el-button plain type="primary" size="small" style="float: right" @click="downloadFi_analysis()">
              下载fi_analysis.csv
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div>
      <h4>热力图</h4>
      <div id="HeatMap" :style="{width: divWidth + 'px', height: divHeight + 'px'}"></div>
    </div>
  </div>
</template>

<script>
import {postRequestJSON} from '../../utils/api';

export default {
  name: 'DetailSample',
  data() {
    return {
      xyzShow: "",
      sampleInfo: {
        id: this.$route.query.id,
        sampleName: this.$route.query.sampleName,
        batchName: this.$route.query.batchName,
        type: this.$route.query.type
      },
      form: {
        x1: "",
        y1: "",
        z1: "",
        x2: "",
        x3: "",
      },
      rules: {
        x1: [{required: true, message: "请输入x", trigger: "blur"}],
        y1: [{required: true, message: "请输入y", trigger: "blur"}],
        z1: [{required: true, message: "请输入z", trigger: "blur"}],
        x2: [{required: true, message: "请输入x", trigger: "blur"}],
        y2: [{required: true, message: "请输入y", trigger: "blur"}],
        z2: [{required: true, message: "请输入z", trigger: "blur"}],
        x3: [{required: true, message: "请输入x", trigger: "blur"}],
        y3: [{required: true, message: "请输入y", trigger: "blur"}],
        z3: [{required: true, message: "请输入z", trigger: "blur"}],
      },
      // 热力图数据
      PM_name: [],            // 纵坐标：颗粒物名称
      chemical_element: [],   // 横坐标：元素名称
      unitData: [],           // 单元格数据：元素含量
      raw_data: [],           // 热力图原始数据
      divWidth: '',           // 热力图宽度
      divHeight: '',          // 热力图高度
      heatMapColor: [          // 后端传过来
        '#000085',
        '#002cff',
        '#009bff',
        '#00e5ff',
        '#8dff72',
        '#fffe00',
        '#ff8900',
        '#ff3700',
        '#830000',
      ]
    }
  },
  computed: {
    heatMapName: {
      get() {
        if (this.sampleInfo.type === "纯物质") {
          return 'batchName-' + this.sampleInfo.batchName + '_' +
              'sampleName-' + this.sampleInfo.sampleName + '_' +
              'x1y1z1-' + this.form.x1 + '-' + this.form.y1 + '-' + this.form.z1 + '_' +
              'x2y2z2-' + this.form.x2 + '-' + this.form.y2 + '-' + this.form.z2 + '_' +
              'x3y3z3-' + this.form.x3 + '-' + this.form.y3 + '-' + this.form.z3
        } else {
          return 'batchName-' + this.sampleInfo.batchName + '_' +
              'sampleName-' + this.sampleInfo.sampleName + '_' +
              'x1y1z1-' + this.form.x1 + '-' + this.form.y1 + '-' + this.form.z1
        }
      }
    }
  },
  async activated() {
    await this.init();
    this.sampleInfo = {
      id: this.$route.query.id,
      sampleName: this.$route.query.sampleName,
      batchName: this.$route.query.batchName,
      type: this.$route.query.type
    }
    console.log(this.xyzShow)
  },
  components: {},
  methods: {
    // edit() {
    //   this.$router.push({name: 'postSample', query: {isCreate: false, noteInfo: this.noteInfo}})
    // },
    init() {
      if (this.$route.query.type !== "纯物质") {
        this.xyzShow = "none"
      }
    },
    // del() {
    //   this.$confirm('确认删除吗？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     postRequestJSON('/note/deleteNote', {id: this.noteInfo.noteId}).then((resp) => {
    //       this.$message({
    //         message: "删除成功",
    //         type: "success"
    //       })
    //       this.$router.back()
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     });
    //   });
    // },
    clear() {
      this.form = {
        x1: "",
        y1: "",
        z1: "",
        x2: "",
        y2: "",
        z2: "",
        x3: "",
        y3: "",
        z3: "",
      }
    },
    // 执行功能
    runParticleAnalysisIteration() {
      postRequestJSON('/analysis/particleAnalysisIteration', {id: this.sampleInfo.id}).then(resp => {
        // 正常处理
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
        }
        // 文件已存在，无需重复处理
        else if (resp.data.code === 1) {
          this.$message.info(resp.data.message)
        }
        // 无法处理
        else {
          this.$message.error(resp.data.message)
        }
      })
    },
    runParticleAnalysisPoisson() {
      postRequestJSON('/analysis/particleAnalysisPoisson', {id: this.sampleInfo.id}).then(resp => {
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
        }
        // 文件已存在，无需重复处理
        else if (resp.data.code === 1) {
          this.$message.info(resp.data.message)
        }
        // 无法处理
        else {
          this.$message.error(resp.data.message)
        }
      })
    },
    runParticleConcentration() {
      postRequestJSON('/analysis/particleConcentration', {id: this.sampleInfo.id}).then(resp => {
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
        }
        // 文件已存在，无需重复处理
        else if (resp.data.code === 1) {
          this.$message.info(resp.data.message)
        }
        // 无法处理
        else {
          this.$message.error(resp.data.message)
        }
      })
    },
    runExtractFrequentItems() {
      postRequestJSON('/analysis/extractFrequentItems', {id: this.sampleInfo.id, xyz: this.form}).then(resp => {
        if (resp.data.code === 0) {
          this.$message.success(resp.data.message)
        }
        // 文件已存在，无需重复处理
        else if (resp.data.code === 1) {
          this.$message.info(resp.data.message)
        }
        // 无法处理
        else {
          this.$message.error(resp.data.message)
        }
      })
    },
    // 下载文件
    downloadFi_analysis() {

    },
    downloadSampleFile() {

    },
    // 热力图相关
    async getHeatMapInfo() {
      this.PM_name = []
      this.chemical_element = []
      this.unitData = []
      this.raw_data = []
      this.divWidth = ''
      this.divHeight = ''
      await postRequestJSON('/chart/getHeatMapInfo').then((resp) => {
        this.raw_data = resp.data;
      });
      // 横坐标：元素名
      for (let key in this.raw_data[0])
        this.chemical_element.push(key)
      this.chemical_element.pop()

      // 数据：元素含量
      for (var x = 0; x < this.raw_data.length; x++) {
        var y = 0;
        for (var key in this.raw_data[x]) {
          // 纵坐标：颗粒名称
          let tmpArray = ""
          if (key === "components") this.PM_name.push(this.raw_data[x][key])
          else tmpArray = [y, x, this.raw_data[x][key]]
          this.unitData.push(tmpArray);
          y++;
        }
      }
      this.divWidth = this.chemical_element.length * 65;
      this.divHeight = this.PM_name.length * 20;
    },
    async drawHeatMap() {
      this.tabActiveName2 = "HeatMap"
      await this.getHeatMapInfo();
      let heatMap = this.$echarts.init(document.getElementById('HeatMap'), null, {renderer: 'svg'});
      heatMap.setOption({
        tooltip: {
          trigger: 'item',
          // formatter: function (params) {
          //   // console.log(params)
          //   return chemical_element[params['unitData'][1]] + ' : ' + params['data'][2]
          // },
        },
        xAxis: {
          type: 'category',
          data: this.chemical_element,
          splitLine: {
            show: false,
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: '#000085'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: this.PM_name,
          splitLine: {
            show: false,
          }
        },
        visualMap: {
          min: 0,
          max: 6,
          calculable: true,
          realtime: false,
          inRange: {
            color: this.heatMapColor
          }
        },
        series: [
          {
            type: 'heatMap',
            data: this.unitData,
            emphasis: {
              itemStyle: {
                borderColor: '#ffffff',
                borderWidth: 2
              }
            },
            progressive: 1000,
            animation: false,
          }
        ],
        toolbox: {
          show: true,
          feature: {
            dataView: {
              show: true
            },
            restore: {
              show: true
            },
            dataZoom: {
              show: true
            },
            saveAsImage: {
              show: true,
              name: this.heatMapName
            }
          }
        },
        grid: {
          left: '4%',
          right: '0%',
          bottom: '0%',
          top: '0%',
          containLabel: true,
        },
      });
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  margin-top: 0px;
}

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

.input-box {
  margin-top: 5px;
  width: 100px;
  height: 20px;
  line-height: 15px;
}
</style>