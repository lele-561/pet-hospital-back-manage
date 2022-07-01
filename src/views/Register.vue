<template>
  <el-form ref="form" :model="form" :rules="rules" class="login-container" label-width="100px" status-icon>
    <h3 class="login-title">系统注册</h3>
    <el-form-item class="username" label="用户名" label-width="80px" prop="username">
      <el-input v-model="form.username" auto-complete="off" placeholder="请输入用户名" type="input"></el-input>
    </el-form-item>
    <el-form-item label="密码" label-width="80px" prop="password">
      <el-input v-model="form.password" auto-complete="off" placeholder="请输入密码" type="password"></el-input>
    </el-form-item>
    <div style="text-align: center;margin-bottom: 20px">
      <el-button class="login-submit" type="primary" @click="back">返回登录</el-button>
      <el-button class="login-submit" type="primary" @click="register" style="margin-left: 30px">注册</el-button>
    </div>
  </el-form>
</template>

<script>
import {postRequest} from '@/utils/api.js'

export default {
  name: 'Login',
  data() {
    return {
      form: {},
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 3,
            message: "用户名长度不能小于3位",
            trigger: "blur"
          },
          {
            max: 10,
            message: "用户名长度不能大于10位",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 3,
            message: "密码长度不能小于3位",
            trigger: "blur"
          }
        ]
      }
    }
  },
  methods: {
    register: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          postRequest('/user/register', {
            username: this.form.username,
            password: this.$md5(this.form.password)
          }).then((resp) => {
            // 传到后端，如果ok则继续回到登陆页面登陆
            if (resp.data.success) {
              this.$confirm("成功注册，返回登录", "提示", {
                confirmButtonText: "返回",
                cancelButtonText: "取消",
                type: "success",
              })
                  .then(() => {
                    this.$router.push("/login")
                  })
                  .catch(() => {
                  });
              alert(resp.data.message)
              this.$router.replace('/login')
            } else {
              alert(resp.data.message)
            }
          })
        } else {
          return false;
        }
      });
    },
    back(){
      this.$router.push({name:'login'})
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
}

.login-title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.login-submit {
  margin: 10px auto 0 auto;
}
</style>