<template>
  <div style="margin-top: 20px">
    <h3>宠物真实病例</h3>
    <el-descriptions :column="3" border>
      <el-descriptions-item>
        <template slot="label">宠物名</template>
        <el-input v-model="petProfile.name" placeholder="请输入宠物名"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">种类</template>
        <el-input v-model="petProfile.type" placeholder="请输入种类"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">性别</template>
        <el-input v-model="petProfile.gender" placeholder="请输入性别"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">生日</template>
        <el-input v-model="petProfile.birthday" placeholder="请输入生日"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">年龄</template>
        <el-input v-model="petProfile.age" placeholder="请输入年龄"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">重量</template>
        <el-input v-model="petProfile.weight" placeholder="请输入"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">疾病</template>
        <el-tag v-for="tag in petProfile.diseases" :key="tag[id]" :disable-transitions="false" closable type="warning"
                @close="handleClose(tag, 'disease')">{{ tag['name'] }}
        </el-tag>
        <el-autocomplete v-if="inputDiseaseVisible" ref="saveDiseaseTagInput" v-model="inputDiseaseValue"
                         class="input-new-tag" size="small"
                         :fetch-suggestions="querySearchAsyncDisease"
                         placeholder="请输入内容"
                         @select="handleSelectDisease"
        ></el-autocomplete>
        <el-button v-else class="button-new-tag" size="small" @click="showInput('disease')">+ 新疾病</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">用药记录</template>
        <el-tag v-for="tag in petProfile.medicines" :key="tag[id]" :disable-transitions="false" closable type="success"
                @close="handleClose(tag, 'medicine')">{{ tag['name'] }}
        </el-tag>
        <el-autocomplete v-if="inputMedicineVisible" ref="saveMedicineTagInput" v-model="inputMedicineValue"
                         class="input-new-tag" size="small"
                         :fetch-suggestions="querySearchAsyncMedicine"
                         placeholder="请输入内容"
                         @select="handleSelectMedicine"
        ></el-autocomplete>
        <el-button v-else class="button-new-tag" size="small" @click="showInput('medicine')">+ 新药品</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">检查项目</template>
        <el-tag v-for="tag in petProfile.checkups" :key="tag[id]" :disable-transitions="false" closable type="primary"
                @close="handleClose(tag, 'checkup')">{{ tag['name'] }}
        </el-tag>
        <el-autocomplete v-if="inputCheckupVisible" ref="saveCheckupTagInput" v-model="inputCheckupValue"
                         class="input-new-tag" size="small"
                         :fetch-suggestions="querySearchAsyncCheckup"
                         placeholder="请输入内容"
                         @select="handleSelectCheckup"
        ></el-autocomplete>
        <el-button v-else class="button-new-tag" size="small" @click="showInput('checkup')">+ 新检查</el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">病情表述</template>
        <el-input type="textarea" v-model="petProfile.description" placeholder="请输入病情表述"></el-input>
      </el-descriptions-item>
    </el-descriptions>
    <el-button style="margin-top: 20px;margin-left:10px;float: right" type="success" icon="el-icon-check" @click="save">
      保存
    </el-button>
    <el-button style="margin-top: 20px;float: right" type="info" icon="el-icon-back" @click="back">返回</el-button>
  </div>

</template>

<script>
import {getFormData, postFormData} from "@/utils/api";

export default {
  name: "PetProfile",
  components: {},
  data() {
    return {
      timeout: null,
      petProfile: {
        id: this.$route.query.id,
        diseases: [],
        name: '',
        type: '',
        gender: '',
        birthday: '',
        age: '',
        weight: '',
        description: '',
        medicines: [],
        checkups: []
      },
      medicineTag: [],
      checkupTag: [],
      inputDiseaseVisible: false,
      inputMedicineVisible: false,
      inputCheckupVisible: false,
      inputDiseaseValue: '',
      inputMedicineValue: '',
      inputCheckupValue: '',
      diseaseOptions: [],
      medicineOptions: [],
      checkupOptions: [],
    }
  },
  methods: {
    getPetProfile() {
      getFormData('/petProfile/getOnePetProfile', {id: this.$route.query.id}).then((resp) => {
        this.petProfile = resp.data.result
        this.totalPages = resp.data.result.totalPages
        this.currentPage = resp.data.result.currentPage
      })
    },
    getData() {
      // 获取所有已知数据
      getFormData('/diseaseManage/getDiseaseTypes').then((resp) => {
        for (let i in resp.data.data.disease_types) {
          for (let j in resp.data.data.disease_types[i].children) {
            this.diseaseOptions.push({
              id: resp.data.data.disease_types[i].children[j].disease_type_id,
              value: resp.data.data.disease_types[i].children[j].disease_type_name
            })
          }
        }
      })
      getFormData('/medicine/getAllMedicines').then((resp) => {
        for (let i in resp.data.result.medicines) {
          this.medicineOptions.push({
            id: resp.data.result.medicines[i].id,
            value: resp.data.result.medicines[i].name
          })
        }
      })
      getFormData('/checkup/getAllCheckups').then((resp) => {
        for (let i in resp.data.result.checkups) {
          this.checkupOptions.push({
            id: resp.data.result.checkups[i].id,
            value: resp.data.result.checkups[i].name
          })
        }
      })
    },
    handleClose(type, typeName) {
      if (typeName === "disease")
        this.petProfile.diseases.splice(this.petProfile.diseases.indexOf(type), 1)
      else if (typeName === "medicine")
        this.petProfile.medicines.splice(this.petProfile.medicines.indexOf(type), 1)
      else if (typeName === "checkup")
        this.petProfile.checkups.splice(this.petProfile.checkups.indexOf(type), 1)
    },
    showInput(typeName) {
      if (typeName === "disease") {
        this.inputDiseaseVisible = true
        this.$nextTick(() => {
          this.$refs.saveDiseaseTagInput.$refs.input.focus()
        })
      } else if (typeName === "medicine") {
        this.inputMedicineVisible = true
        this.$nextTick(() => {
          this.$refs.saveMedicineTagInput.$refs.input.focus()
        })
      } else if (typeName === "checkup") {
        this.inputCheckupVisible = true
        this.$nextTick(() => {
          this.$refs.saveCheckupTagInput.$refs.input.focus()
        })
      }
    },
    querySearchAsyncDisease(queryString, cb) {
      var options = this.diseaseOptions
      var results = queryString ? options.filter(this.createStateFilter(queryString)) : options
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 500)
    },
    handleSelectDisease(item) {
      this.petProfile.diseases.push({id: item.id, name: item.value})
      this.inputDiseaseVisible = false
      this.inputDiseaseValue = ""
    },
    querySearchAsyncMedicine(queryString, cb) {
      var options = this.medicineOptions
      var results = queryString ? options.filter(this.createStateFilter(queryString)) : options
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 500)
    },
    handleSelectMedicine(item) {
      this.petProfile.medicine.push({id: item.id, name: item.value})
      this.inputMedicineVisible = false
      this.inputMedicineValue = ""
    },
    querySearchAsyncCheckup(queryString, cb) {
      var options = this.checkupOptions
      var results = queryString ? options.filter(this.createStateFilter(queryString)) : options
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 500)
    },
    handleSelectCheckup(item) {
      this.petProfile.checkups.push({id: item.id, name: item.value})
      this.inputCheckupVisible = false
      this.inputCheckupValue = ""
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    save() {
      // 更新档案
      if (this.$route.query.id !== '') {
        postFormData('/petProfile/updateOnePetProfile', this.petProfile).then((resp) => {
          this.petProfile = resp.data.result
          this.totalPages = resp.data.result.totalPages
          this.currentPage = resp.data.result.currentPage
        })
      }
      // 新建档案
      else {
        delete this.petProfile.id
        console.log(this.petProfile)
        postFormData('/petProfile/addOnePetProfile', this.petProfile).then((resp) => {
          this.petProfile = resp.data.result
          this.totalPages = resp.data.result.totalPages
          this.currentPage = resp.data.result.currentPage
        })
      }
      this.back()
    },
    back() {
      this.clear()
      this.$router.push({name: "diseaseManage_diseaseReal"});
    },
    clear() {
      this.petProfile = {
        id: this.$route.query.id,
        diseases: [],
        name: '',
        type: '',
        gender: '',
        birthday: '',
        age: '',
        weight: '',
        description: '',
        medicines: [],
        checkups: []
      }
      this.medicineTag = []
      this.checkupTag = []
      this.inputDiseaseVisible = false
      this.inputMedicineVisible = false
      this.inputCheckupVisible = false
      this.inputDiseaseValue = ''
      this.inputMedicineValue = ''
      this.inputCheckupValue = ''
      this.diseaseOptions = []
      this.medicineOptions = []
      this.checkupOptions = []
    }
  },
  mounted() {
    this.petProfile.id = this.$route.query.id
    this.getData()
    if (this.$route.query.id !== '') {
      this.getPetProfile()
    }
  }
}
</script>

<style scoped>

</style>
