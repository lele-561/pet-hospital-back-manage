<template>
  <div class='login-background'>
    <el-form ref='form' :model='form' :rules='rules' class='login-container' label-width='100px' status-icon>
      <h3 class='login-title'>虚拟宠物医院后台管理系统 注册</h3>
      <el-form-item class='name' label='手机号码' label-width='80px' prop='phoneNumber'>
        <el-input v-model='form.phoneNumber' auto-complete='off' placeholder='请输入手机号码' type='input'></el-input>
      </el-form-item>
      <el-form-item class='name' label='用户名' label-width='80px' prop='name'>
        <el-input v-model='form.name' auto-complete='off' placeholder='请输入用户名' type='input'></el-input>
      </el-form-item>
      <el-form-item label='密码' label-width='80px' prop='password'>
        <el-input v-model='form.password' auto-complete='off' placeholder='请输入密码' type='password'></el-input>
      </el-form-item>
      <el-form-item label='确认密码' label-width='80px' prop='passwordConfirm'>
        <el-input v-model='form.passwordConfirm' auto-complete='off' placeholder='请确认密码' type='password'></el-input>
      </el-form-item>
      <div style='text-align: center;margin-bottom: 20px'>
        <el-button class='login-submit' type='primary' @click='register'>注册</el-button>
        <el-button class='login-submit' style='margin-left: 30px' type='primary' @click='back'>返回登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {postRequestJSON} from '../utils/api';

export default {
  name: 'Register',
  data() {
    let valiPhoneNumberPass = (rule, value, callback) => {
      let reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      if (value === '') callback(new Error('请输入电话号码'));
      else if (!reg.test(value)) callback(new Error('请输入正确的电话号码'));
      else callback();
    };
    let valiPasswordConfirm = (rule, value, callback) => {
      if (value === undefined || value === '') callback(new Error('密码不得为空'));
      else if (value !== this.form.password) callback(new Error('密码不符'));
      else callback();
    };
    return {
      form: {},
      rules: {
        phoneNumber: [{required: true, validator: valiPhoneNumberPass, trigger: 'blur'},],
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 1, message: '用户名不得少于1个字', trigger: 'blur'},
          {max: 20, message: '用户名不得多于20个字', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, message: '密码长度不得少于3位', trigger: 'blur'},
          {max: 20, message: '密码长度不得多于20位', trigger: 'blur'}
        ],
        passwordConfirm: [
          {required: true, validator: valiPasswordConfirm, trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    register: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          postRequestJSON('/user/register', {
            phoneNumber: this.form.phoneNumber,
            name: this.form.name,
            password: this.$md5(this.form.password)
          }).then((resp) => {
            if (resp.data.code === 0) {
              this.$confirm('注册成功，是否返回登录？', '提示', {
                confirmButtonText: '返回',
                type: 'success',
              }).then(() => {
                this.$router.push('/login')
              }).catch(() => {
              });
            } else if (resp.data.code === 1) {
              this.$message.error(resp.data.message)
              this.form = {}
            }
          })
        } else return false
      });
    },
    back() {
      this.$router.push({name: 'login'})
    }
  },
}
</script>

<style lang='less' scoped>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background-color: #fff;
  left: 50%
}

.login-title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.login-submit {
  margin: 10px auto 0 auto;
}

.login-background {
  background-image: linear-gradient(to right, #3ab5b0 0%, #3d99be 31%, #56317a 100%);
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}
</style>