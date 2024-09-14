<template>
  <div id="login" class="w">
    <div class="logo">Logo</div>
    <div style="display: flex;width: 100%;justify-content: center;">
      <!-- 表单绑定 LoginForm 数据，并且应用校验规则 -->
      <el-form :model="LoginForm" :rules="rules" ref="LoginForm" class="demo-ruleForm">
        <el-form-item prop="PhoneNumber">
          <el-input placeholder="请输入手机号" v-model="LoginForm.PhoneNumber" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item prop="Code">
          <el-input placeholder="请输入验证码" v-model="LoginForm.Code" style="width: 65%;float: left;"></el-input>
          <!-- 获取验证码按钮，只有手机号有效时才可点击 -->
          <el-button type="primary" plain @click="getVerificationCode" :disabled="!isPhoneValid || isCountingDown"
            style="float: right;font-size: 18px;padding: 15px;margin-top: 25px;">
            {{ isCountingDown ? countdown + 's后重试' : '获取验证码' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 登录按钮，只有手机号和验证码都有效时才可点击 -->
    <el-button type="primary" round @click="validateForm('LoginForm')" :disabled="!isFormValid"
      style=" margin: 75px auto 25px;font-size: 28px;padding: 15px 65px;">登录</el-button>
    <p style="text-align: center;">新用户将自动为您注册后登录</p>
  </div>
</template>

<script>
import { getCode } from '@/api/GetCode'
export default {
  name: 'login',
  data() {
    return {
      // 表单数据对象
      LoginForm: {
        PhoneNumber: '', // 手机号
        Code: '' // 验证码
      },
      SendCode: '',
      // 倒计时相关数据
      countdown: 60,
      isCountingDown: false, // 标识是否正在倒计时
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
  computed: {
    // 计算手机号是否有效
    isPhoneValid() {
      const phonePattern = /^1[3-9]\d{9}$/;
      return phonePattern.test(this.LoginForm.PhoneNumber);
    },
    // 计算表单是否完整有效
    isFormValid() {
      return this.isPhoneValid && this.LoginForm.Code !== '';
    }
  },
  methods: {
    // 验证表单数据
    validateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 如果表单验证通过，执行登录逻辑
          this.UserLogin();
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
    // 获取验证码逻辑
    async getVerificationCode() {
      try {
        const res = await getCode(this.LoginForm.PhoneNumber);
        if (res) {
          console.log(res.data.data.verificationCode)
          this.SendCode = res.data.data.verificationCode
          this.startCountdown();
        } else {
          throw new Error('未收到有效响应数据');
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 开始倒计时
    startCountdown() {
      this.isCountingDown = true;
      this.countdown = 60;
      const interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(interval);
          this.isCountingDown = false;
        }
      }, 1000);
    },
    // 用户登录逻辑
    UserLogin() {
      // 执行登录逻辑
      console.log('登录中...');
      location.href = "index.html";
    }
  }
}
</script>

<style>
.logo {
  width: 100%;
  height: 200px;
  font-size: 5em;
  text-align: center;
  line-height: 200px;
  margin-top: 75px;
  margin-bottom: 50px;
}

.w {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.el-input {
  margin: 25px auto;
  text-align: center;
}

.el-input input {
  font-size: 24px;
  text-align: center;
  margin: 0 auto;
  height: 50px;
  background-color: rgb(217, 217, 217);
  color: #000;
}

.el-input input::-webkit-input-placeholder {
  color: rgb(134, 134, 134);
}

.el-button {
  display: block;
}
</style>
