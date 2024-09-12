<template>
  <div id="login" class="w">
    <div class="logo">Logo</div>

    <!-- 表单绑定 LoginForm 数据，并且应用校验规则 -->
    <el-form :model="LoginForm" :rules="rules" ref="LoginForm" class="demo-ruleForm">
      <el-form-item prop="PhoneNumber">
        <el-input placeholder="请输入手机号" v-model="LoginForm.PhoneNumber"></el-input>
      </el-form-item>
      <el-form-item prop="Code">
        <el-input placeholder="请输入验证码" v-model="LoginForm.Code"></el-input>
      </el-form-item>
    </el-form>

    <!-- 按钮，点击时触发 UserLogin 并执行校验 -->
    <el-button type="primary" round @click="validateForm('LoginForm')">获取验证码</el-button>
    <p style="text-align: center;">新用户将自动为您注册后登录</p>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      // 表单数据对象
      LoginForm: {
        PhoneNumber: '', // 手机号
        Code: '' // 验证码
      },
      // 校验规则
      rules: {
        PhoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        Code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 用户点击登录，验证手机号和验证码的输入
    validateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证通过后，执行登录逻辑
          this.UserLogin();
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
    UserLogin() {
      // 执行登录逻辑
      location.href = "index.html";
    }
  }
}
</script>

<style>
html,
body {
  height: 100%;
}

.logo {
  width: 100%;
  height: 200px;
  font-size: 5em;
  text-align: center;
  line-height: 200px;
  margin-top: 90px;
  margin-bottom: 50px;
}

.w {
  width: 680px;
  height: 100%;
  margin: 0 auto;
  border: 1px solid black;
}

.el-input {
  margin: 25px auto;
  text-align: center;
}

.el-input input {
  font-size: 24px;
  text-align: center;
  margin: 0 auto;
  width: 70%;
  height: 50px;
  background-color: rgb(217, 217, 217);
  color: rgb(134, 134, 134);
}

.el-input input::-webkit-input-placeholder {
  color: rgb(134, 134, 134);
}

.el-button {
  display: block;
  margin: 90px auto 35px;
  font-size: 28px;
}

.el-button.is-round {
  padding: 20px 45px;
}
</style>
