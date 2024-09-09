<template>
  <div id="login" class="w">
    <div class="logo">Logo</div>
    <el-input placeholder="手机号" v-model="PhoneNumber">
    </el-input>
    <el-input placeholder="验证码" v-model="Code">
    </el-input>
    <el-button type="primary" round @click.native="UserLogin">
      获取验证码
    </el-button>
    <p style="text-align: center;">新用户将自动为您注册后登录</p>
  </div>
</template>

<script>
export default {
  name: 'login',
  components: {

  },
  data() {
    return {
      PhoneNumber: '',
      Code: ''
    }
  },
  methods: {
    UserLogin() {
      location.href = "index.html"
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
  font-size: 40px;
  text-align: center;
  line-height: 350px;
  margin-bottom: 25px;
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
  font-size: 28px;
  text-align: center;
  margin: 0 auto;
  width: 70%;
  background-color: rgb(217, 217, 217);
  color: rgb(134, 134, 134);
}

.el-input input::-webkit-input-placeholder {
  color: rgb(134, 134, 134);
}

.el-button {
  display: block;
  margin: 50px auto;
  font-size: 28px;
}
</style>
