<template>
  <div style='margin-top: 20px'>
    <h3>宠物真实病例</h3>
    <el-form ref='form' :model='petProfile' :rules='rules' label-width='80px'>
      <el-row>
        <el-col :span=8>
          <el-form-item label='宠物名' prop='name'>
            <el-input v-model='petProfile.name' placeholder='请输入宠物名'>{{ petProfile.name }}</el-input>
          </el-form-item>
        </el-col>
        <el-col :span=8>
          <el-form-item label='种类' prop='type'>
            <el-input v-model='petProfile.type' placeholder='请输入种类'>{{ petProfile.type }}</el-input>
          </el-form-item>
        </el-col>
        <el-col :span=8>
          <el-form-item label='性别' prop='gender'>
            <el-select v-model='petProfile.gender' clearable placeholder='请选择性别'>
              <el-option v-for='item in genderOptions'
                         :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span=8>
          <el-form-item label='重量' prop='weight'>
            <el-input v-model='petProfile.weight' placeholder='请输入重量（单位：kg）'>{{ petProfile.weight }}</el-input>
          </el-form-item>
        </el-col>
        <el-col :span=8>
          <el-form-item label='生日' prop='birthday'>
            <el-date-picker v-model="petProfile.birthday" placeholder="请选择生日" type="date"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span=8>
          <el-form-item label='年龄' prop='age'>{{ petProfile.age }} 岁</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label='所患疾病'>
        <el-tag v-for='tag in petProfile.diseases' :key='tag[id]'
                :disable-transitions='false' closable type='warning'
                @close='handleClose(tag, "disease")'>{{ tag['name'] }}
        </el-tag>
        <el-autocomplete v-if='inputDiseaseVisible' ref='saveDiseaseTagInput' v-model='inputDiseaseValue'
                         :fetch-suggestions='querySearchAsyncDisease' class='input-new-tag'
                         placeholder='请输入内容'
                         size='small'
                         @select='handleSelectDisease'
        ></el-autocomplete>
        <el-button v-else class='button-new-tag' plain size='small' type='warning'
                   @click='showInput("disease")'>+ 新疾病
        </el-button>
      </el-form-item>
      <el-form-item label='用药记录'>
        <el-tag v-for='tag in petProfile.medicines' :key='tag[id]'
                :disable-transitions='false' closable type='success'
                @close='handleClose(tag, "medicine")'>{{ tag['name'] }}
        </el-tag>
        <el-autocomplete v-if='inputMedicineVisible' ref='saveMedicineTagInput' v-model='inputMedicineValue'
                         :fetch-suggestions='querySearchAsyncMedicine' class='input-new-tag'
                         placeholder='请输入内容'
                         size='small'
                         @select='handleSelectMedicine'
        ></el-autocomplete>
        <el-button v-else class='button-new-tag' plain size='small' type='success'
                   @click='showInput("medicine")'>+ 新药品
        </el-button>
      </el-form-item>
      <el-form-item label='检查项目'>
        <el-tag v-for='tag in petProfile.checkups' :key='tag[id]'
                :disable-transitions='false' closable type='primary'
                @close='handleClose(tag, "checkup")'>{{ tag['name'] }}
        </el-tag>
        <el-autocomplete v-if='inputCheckupVisible' ref='saveCheckupTagInput' v-model='inputCheckupValue'
                         :fetch-suggestions='querySearchAsyncCheckup' class='input-new-tag'
                         placeholder='请输入内容'
                         size='small'
                         @select='handleSelectCheckup'></el-autocomplete>
        <el-button v-else class='button-new-tag' plain size='small' type='primary'
                   @click='showInput("checkup")'>+ 新检查
        </el-button>
      </el-form-item>
      <el-form-item label='病情表述' prop='description'>
        <el-input v-model='petProfile.description' autosize placeholder='请输入病情表述' type='textarea'></el-input>
      </el-form-item>
    </el-form>
    <el-button icon='el-icon-check'
               style='margin-left:10px; float: right' type='success' @click='confirm'>保存
    </el-button>
    <el-button icon='el-icon-back' style='float: right' type='info' @click='back'>返回</el-button>
  </div>
</template>

<script>
import {getFormData, postFormData} from '@/utils/api';

export default {
  name: 'PetProfile',
  components: {},
  data() {
    let valiBirthdayPass = (rule, value, callback) => {
      this.petProfile.age < 0 ? callback(new Error('生日选择错误')) : callback()
    };
    let valiWeightPass = (rule, value, callback) => {
      let reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;
      if (value === '') callback(new Error('请输入内容'));
      else if (!reg.test(value)) callback(new Error('请输入正确数值，限小数点后2位'));
      else callback();
    };
    return {
      timeout: null,
      petProfile: {
        id: this.$route.query.id,
        name: '',
        type: '',
        gender: '',
        birthday: '',
        age: '',
        weight: '',
        description: '',
        diseases: [],
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
      genderOptions: [{value: '母', label: '母'}, {value: '公', label: '公'},],
      rules: {
        name: [{required: true, message: '请填写宠物名', trigger: 'blur'},
          {min: 1, message: '宠物名不得少于1个字', trigger: 'blur'},
          {max: 20, message: '宠物名不得多于20个字', trigger: 'blur'}],
        type: [{required: true, message: '请填写宠物种类', trigger: 'blur'},
          {min: 1, message: '种类不得少于1个字', trigger: 'blur'},
          {max: 10, message: '种类不得多于10个字', trigger: 'blur'}],
        gender: [{
          required: true, message: '请选择性别', trigger: 'blur'
        }],
        birthday: [{
          required: true, validator: valiBirthdayPass, trigger: 'blur'
        }],
        age: [{
          required: true, message: '请计算年龄', trigger: 'blur'
        }],
        weight: [{required: true, validator: valiWeightPass, trigger: 'blur'},],
        description: [{required: true, message: '请填写病情描述', trigger: 'blur'},
          {min: 10, message: '病情描述不得少于10个字', trigger: 'blur'},
          {max: 200, message: '病情描述不得多于200个字', trigger: 'blur'}],
      }
    }
  },
  watch: {
    'petProfile.birthday': {
      deep: true,
      handler() {
        // 动态修改宠物年龄
        var date = new Date();
        this.petProfile.age = date.getFullYear() - this.petProfile.birthday.getFullYear()
      }
    },
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
      console.log('调用啦')
      // 获取所有已知数据
      getFormData('/diseaseManage/getDiseaseTypes').then((resp) => {
        for (let i in resp.data.result.disease_types) {
          for (let j in resp.data.result.disease_types[i].children) {
            this.diseaseOptions.push({
              id: resp.data.result.disease_types[i].children[j].disease_type_id,
              value: resp.data.result.disease_types[i].children[j].disease_type_name
            })
          }
        }
        console.log(this.diseaseOptions)
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
      if (typeName === 'disease')
        this.petProfile.diseases.splice(this.petProfile.diseases.indexOf(type), 1)
      else if (typeName === 'medicine')
        this.petProfile.medicines.splice(this.petProfile.medicines.indexOf(type), 1)
      else if (typeName === 'checkup')
        this.petProfile.checkups.splice(this.petProfile.checkups.indexOf(type), 1)
    },
    showInput(typeName) {
      if (typeName === 'disease') {
        this.inputDiseaseVisible = true
        this.$nextTick(() => {
          this.$refs.saveDiseaseTagInput.$refs.input.focus()
        })
      } else if (typeName === 'medicine') {
        this.inputMedicineVisible = true
        this.$nextTick(() => {
          this.$refs.saveMedicineTagInput.$refs.input.focus()
        })
      } else if (typeName === 'checkup') {
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
      this.inputDiseaseValue = ''
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
      this.petProfile.medicines.push({id: item.id, name: item.value})
      this.inputMedicineVisible = false
      this.inputMedicineValue = ''
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
      this.inputCheckupValue = ''
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    confirm() {
      this.$nextTick(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.petProfile.diseases.length === 0 || this.petProfile.medicines.length === 0 || this.petProfile.checkups.length === 0) {
              this.$message.error('未填写全部信息')
              return
            }
            // disease, medicine, checkup删除name，只剩id
            let disease_ids = []
            let medicine_ids = []
            let checkup_ids = []
            for (let i in this.petProfile.diseases)
              disease_ids.push(this.petProfile.diseases[i].id)
            for (let i in this.petProfile.medicines)
              medicine_ids.push(this.petProfile.medicines[i].id)
            for (let i in this.petProfile.checkups)
              checkup_ids.push(this.petProfile.checkups[i].id)
            delete this.petProfile.diseases
            delete this.petProfile.medicines
            delete this.petProfile.checkups
            this.petProfile['diseases'] = disease_ids
            this.petProfile['medicines'] = medicine_ids
            this.petProfile['checkups'] = checkup_ids
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
              postFormData('/petProfile/addOnePetProfile', this.petProfile).then((resp) => {
                this.petProfile = resp.data.result
                this.totalPages = resp.data.result.totalPages
                this.currentPage = resp.data.result.currentPage
              })
            }
            this.back()
          }
        });
      });

    },
    back() {
      this.clear()
      this.$router.push({name: 'diseaseManage_diseaseReal'});
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
  async mounted() {
    this.petProfile.id = this.$route.query.id
    await this.getData()
    if (this.$route.query.id !== '') {
      this.getPetProfile()
    }
  }

}
</script>

<style scoped>

</style>
