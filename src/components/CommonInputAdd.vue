<template>
  <div>


    <div v-for="(item,index) in dynamicItem" :key="index" style="display: flex">
      <el-form-item label="物质名"
                    :prop="'dynamicItem.'+index+'.substanceName'"
                    :rules="{ required:true, message:'物质名不能为空',trigger:'blur'}">
        <el-input v-model="item.substanceName"></el-input>
      </el-form-item>
      <el-form-item label="物质质量"
                    :prop="'dynamicItem.'+index+'.substanceMass'"
                    :rules="{ required:true, validator:vali, trigger:'blur'}"
                    :style="{ display: configShow}">
        <el-input v-model="item.substanceMass"></el-input>
      </el-form-item>
      <el-form-item :style="{ display: configShow}">
        <el-button v-if="index+1===dynamicItem.length" @click="addItem" type="primary" plain>增加
        </el-button>
        <el-button v-if="index!==0" @click="deleteItem(item,index)" type="danger" plain>删除</el-button>
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonInputAdd",
  data(){
    return{
      dynamicItem: [],
    }
  },
  methods:{
    // 增加物质条目
    addItem() {
      this.sampleInfo.dynamicItem.push({substanceName: "", substanceMass: ""})
    },
    deleteItem(item, index) {
      this.sampleInfo.dynamicItem.splice(index, 1)
      console.log(this.sampleInfo.dynamicItem, "删除")
    },
  }
}
</script>

<style scoped>

</style>