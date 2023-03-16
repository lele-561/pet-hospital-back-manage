<template>
  <div class="login-background">
    <el-form ref="form" :model="form" :rules="rules" class="login-container" label-width="100px" status-icon>
      <h3 class="login-title">虚拟宠物医院后台管理系统 登录</h3>
      <el-form-item class="username" label="电话号码" label-width="80px" prop="phoneNumber">
        <el-input v-model="form.phoneNumber" auto-complete="off" placeholder="请输入电话号码" type="input"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="80px" prop="password">
        <el-input v-model="form.password" auto-complete="off" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <div style="text-align: center;margin-bottom: 20px">
        <el-button class="login-submit" type="primary" @click="login">登录</el-button>
        <el-button class="login-submit" style="margin-left: 30px" type="primary" @click="register">注册</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {postFormData} from "../utils/api";

export default {
  name: 'Login',
  data() {
    let valiPhoneNumberPass = (rule, value, callback) => {
      let reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      if (value === '') callback(new Error('请输入电话号码'));
      else if (!reg.test(value)) callback(new Error('请输入正确的电话号码'));
      else callback();
    };
    return {
      form: {},
      rules: {
        phoneNumber: [{required: true, validator: valiPhoneNumberPass, trigger: "blur"},],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 3, message: "密码长度不能小于3位", trigger: "blur"},
          {max: 20, message: "密码长度不能大于20位", trigger: "blur"}
        ],
      }
    }
  },
  methods: {
    login: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          postFormData("/user/login", {
            phoneNumber: this.form.phoneNumber,
            password: this.$md5(this.form.password)
          }).then((resp) => {
            if (resp.data.code === 0) {
              this.$message({
                message: resp.data.message,
                type: 'success'
              })
              this.$router.push({name: 'home'})
              //   this.$store.commit('setToken', resp.data.userId)
              //   this.$store.commit('setRoleName', resp.data.roleName)
              //   this.$store.commit('setUserName', resp.data.userName)
            } else if (resp.data.code === 1) {
              this.$confirm('该用户不存在，是否前往注册？', "提示", {
                confirmButtonText: "确定",
                type: "error",
              }).then(() => {
                this.$router.push("/register")
              }).catch(() => {
              });
            } else if (resp.data.code === 2) {
              this.$confirm('密码错误', "提示", {
                confirmButtonText: "返回",
                type: "error",
              }).then(() => {
              }).catch(() => {
              });
            } else {
              this.$confirm('该用户无权限', "提示", {
                confirmButtonText: "返回",
                type: "warning",
              }).then(() => {
              }).catch(() => {
              });
            }
          })
        } else return false;
      });
    },
    register: function () {
      this.$router.replace({name: 'register'})
    }
  },
}
</script>

<style lang="less" scoped>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background-color: #fff;
  left: 50%;
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