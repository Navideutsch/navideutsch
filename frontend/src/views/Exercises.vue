<template>
  <div id="Exercises" style="height: 670px;">
    <el-row v-show=Flag>
      <el-col :span="12" v-for="item in items" :key="item.id" class="card">
        <el-card :body-style="{ padding: '0px' }" @click.native="Read(item)">
          <div class="image">图片</div>
          <div class="text">{{ item.title }}</div>
        </el-card>
      </el-col>
    </el-row>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'Exercises',
  data() {
    return {
      Flag: true,
      items: [
        {
          id: "001",
          title: "文本名称"
        },
        {
          id: "002",
          title: "文本名称"
        },
        {
          id: "003",
          title: "文本名称"
        },
        {
          id: "004",
          title: "文本名称"
        }]
    }
  },
  methods: {
    Read(item) {
      this.Flag = false
      this.$router.push({
        name: 'article',
        query: {
          id: item.id,
          title: item.title
        }
      })
    }
  }
}
</script>

<style scoped>
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  text-align: center;
  line-height: 100px;
  font-size: 30px;
  width: 100%;
  height: 100px;
  display: block;
}

.text {
  font-size: 20px;
  text-align: center;
  padding: 14px;
}

.card {
  padding: 30px 50px;
}
</style>