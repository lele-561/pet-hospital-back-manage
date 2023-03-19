<template>
  <div style='margin-top: 20px'>
    <h3>宠物真实病例</h3>
    <el-form ref='form' :model='petProfile' :rules='rules' label-width='80px'>
      <el-row>
        <el-col :span=8>
          <el-form-item prop='name' label='宠物名'>
            <el-input v-model='petProfile.name' placeholder='请输入宠物名'>{{ petProfile.name }}</el-input>
          </el-form-item>
        </el-col>
        <el-col :span=8>
          <el-form-item prop='type' label='种类'>
            <el-input v-model='petProfile.type' placeholder='请输入种类'>{{ petProfile.type }}</el-input>
          </el-form-item>
        </el-col>
        <el-col :span=8>
          <el-form-item prop='gender' label='性别'>
            <el-select v-model='petProfile.gender' clearable placeholder='请选择性别'>
              <el-option v-for='item in genderOptions'
                         :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span=8>
          <el-form-item prop='weight' label='重量'>
            <el-input v-model='petProfile.weight' placeholder='请输入重量（单位：kg）'>{{ petProfile.weight }}</el-input>
          </el-form-item>
        </el-col>
        <el-col :span=8>
          <el-form-item prop='birthday' label='生日'>
            <el-date-picker v-model="petProfile.birthday" type="date" placeholder="请选择生日"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span=8>
          <el-form-item prop='age' label='年龄'>{{ petProfile.age }} 岁</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label='所患疾病'>
        <el-tag v-for='tag in petProfile.diseases' :key='tag[id]'
                :disable-transitions='false' closable type='warning'
                @close='handleClose(tag, "disease")'>{{ tag['name'] }}
        </el-tag>
        <el-autocomplete v-if='inputDiseaseVisible' ref='saveDiseaseTagInput' v-model='inputDiseaseValue'
                         class='input-new-tag' size='small'
                         :fetch-suggestions='querySearchAsyncDisease'
                         placeholder='请输入内容'
                         @select='handleSelectDisease'
        ></el-autocomplete>
        <el-button v-else class='button-new-tag' type='warning' plain size='small'
                   @click='showInput("disease")'>+ 新疾病
        </el-button>
      </el-form-item>
      <el-form-item label='用药记录'>
        <el-tag v-for='tag in petProfile.medicines' :key='tag[id]'
                :disable-transitions='false' closable type='success'
                @close='handleClose(tag, "medicine")'>{{ tag['name'] }}
        </el-tag>
        <el-autocomplete v-if='inputMedicineVisible' ref='saveMedicineTagInput' v-model='inputMedicineValue'
                         class='input-new-tag' size='small'
                         :fetch-suggestions='querySearchAsyncMedicine'
                         placeholder='请输入内容'
                         @select='handleSelectMedicine'
        ></el-autocomplete>
        <el-button v-else class='button-new-tag' type='success' plain size='small'
                   @click='showInput("medicine")'>+ 新药品
        </el-button>
      </el-form-item>
      <el-form-item label='检查项目'>
        <el-tag v-for='tag in petProfile.checkups' :key='tag[id]'
                :disable-transitions='false' closable type='primary'
                @close='handleClose(tag, "checkup")'>{{ tag['name'] }}
        </el-tag>
        <el-autocomplete v-if='inputCheckupVisible' ref='saveCheckupTagInput' v-model='inputCheckupValue'
                         class='input-new-tag' size='small'
                         :fetch-suggestions='querySearchAsyncCheckup'
                         placeholder='请输入内容'
                         @select='handleSelectCheckup'></el-autocomplete>
        <el-button v-else class='button-new-tag' type='primary' plain size='small'
                   @click='showInput("checkup")'>+ 新检查
        </el-button>
      </el-form-item>
      <el-form-item prop='description' label='病情表述'>
        <el-input type='textarea' v-model='petProfile.description' autosize placeholder='请输入病情表述'></el-input>
      </el-form-item>
    </el-form>
    <el-button style='margin-left:10px; float: right'
               type='success' icon='el-icon-check' @click='confirm'>保存
    </el-button>
    <el-button style='float: right' type='info' icon='el-icon-back' @click='back'>返回</el-button>
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
          {min: 2, message: '宠物名不得少于2个字', trigger: 'blur'},
          {max: 20, message: '宠物名不得多于20个字', trigger: 'blur'}],
        type: [{required: true, message: '请填写宠物种类', trigger: 'blur'},
          {min: 2, message: '种类不得少于2个字', trigger: 'blur'},
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
      this.petProfile.medicine.push({id: item.id, name: item.value})
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
