<template>
  <div class="login-background">
    <el-form ref="form" :model="form" :rules="rules" class="login-container" label-width="100px" status-icon>
      <h3 class="login-title">系统登录</h3>
      <el-form-item class="username" label="id" label-width="80px" prop="id">
        <el-input v-model="form.id" auto-complete="off" placeholder="请输入账号" type="input"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="80px" prop="password">
        <el-input v-model="form.password" auto-complete="off" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <div style="text-align: center;margin-bottom: 20px">
        <el-button class="login-submit" type="primary" @click="login">登录</el-button>
        <el-button class="login-submit" type="primary" @click="register" style="margin-left: 30px">注册</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {postRequest} from "../utils/api";

export default {
  name: 'Login',
  data() {
    return {
      form: {},
      rules: {
        id: [
          {
            required: true,
            message: "请输入账号id",
            trigger: "blur"
          },
          {
            min: 3,
            message: "id长度不能小于3位",
            trigger: "blur"
          },
          {
            max: 15,
            message: "id长度不能大于15位",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    }
  },
  methods: {
    login: function () {
      // 传送给后端校验，如果符合就跳转

      this.$refs.form.validate((valid) => {
        if (valid) {
          postRequest("/user/login", {
            id: this.form.id,
            password: this.$md5(this.form.password)
          }).then((resp) => {
            console.log(resp.data)
            // if (resp.status === 200) {
            if(resp.data.userId!=null){
              this.$store.commit('setToken', resp.data.userId)
              this.$store.commit('setRoleName', resp.data.roleName)
              this.$store.commit('setUserName', resp.data.userName)
              this.$message({
                message: resp.data.message,
                type: 'success'
              })
              this.$router.push({name: 'home'})
            }else{
              this.$message.error(resp.data.message);


            }
            // } else {
            //   this.$message.warning(resp.data.message)
            // }
          })
        } else {
          return false;
        }
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
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
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
  //background: url("../assets/background.jpg") no-repeat center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}
</style>