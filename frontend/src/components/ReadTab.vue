<template>
  <div id="ReadTab">
    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
      <el-tab-pane label="同步练习" name="exercises"></el-tab-pane>
      <el-tab-pane label="主题一" name="topic_one"></el-tab-pane>
      <el-tab-pane label="主题二" name="topic_two"></el-tab-pane>
      <el-tab-pane label="主题三" name="topic_three"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>

</template>

<script>
export default {
  name: 'ReadTab',
  data() {
    return {
      activeName: 'exercises'
    };
  },
  methods: {
    handleClick() {
      if (this.activeName === 'exercises') {
        this.$router.push({ name: 'exercises' })
      }
    },
  },
  mounted() {
    this.$router.push({ name: 'exercises' })
  }
}
</script>

<style>
.el-tabs__item {
  font-size: 24px;
  line-height: 100px;
}

.el-tabs__nav {
  height: 100px;
}

.el-tabs__active-bar {
  height: 5px;
}
</style>