<template>
  <div id="Footer">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" :stretch="true">
      <el-tab-pane label="首页" name="Index"></el-tab-pane>
      <el-tab-pane label="我的" name="My"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      activeName: 'Index'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(this.activeName)
      this.$emit('FooterTab', this.activeName)
    }
  }
}
</script>

<style>
#tab-Index,
#tab-My {
  height: 100px;
  width: 339px;
  font-size: 30px;
}
</style>