<template>
  <div id="User">
    <div>
      <div style="display: flex; justify-content: center;">
        <el-avatar :size="75" :src="circleUrl" class="Avatar"></el-avatar>
      </div>
      <h1 style="text-align: center;margin-bottom: 50px;">用户名</h1>
      <el-menu class="el-menu-vertical-demo" @select="handleSelect">
        <el-menu-item index="1">
          <i class="el-icon-setting"></i>
          <span title="UserInformation">账号信息</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-setting"></i>
          <span title="Collect">我的收藏</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-setting"></i>
          <span title="RecentPractice">最近练习</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span title="Settings">阅读设置</span>
        </el-menu-item>
      </el-menu>
      <div style="display: flex; justify-content: center;">
        <el-button type="danger" round class="logout">退出登录</el-button>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
    }
  },
  methods: {
    handleSelect(key) {
      console.log(key);
      this.$router.push({ name: 'collect', })
    }
  }
}
</script>

<style>
.Avatar {
  margin: 50px auto 0;
}

.el-menu-item {
  font-size: 2em;
  font-weight: bolder;
  padding-left: 50px;
  height: 80px;
  line-height: 80px;
  margin-bottom: 20px;
}

.el-menu-item:hover {
  color: #409EFF;
}

.el-menu-item span {
  margin-left: 50px;
}

.el-menu-item [class^=el-icon-] {
  font-size: 24px;
  margin-left: 80px;
}

.logout {
  font-size: 38px;
  margin-top: 10%;
}

.el-button.is-round {
  padding: 20px 60px;
}
</style>
