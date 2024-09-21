<template>
  <div id="ExercisesCatalog" style="height: 75vh;">
    <el-row>
      <el-col :span="12" v-for="item in items" :key="item.id" class="card">
        <el-card :body-style="{ padding: '0px' }" @click.native="Read(item)">
          <div class="image">图片</div>
          <div class="text">{{ item.title }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'ExercisesCatalog',
  data() {
    return {
      items: [
        {
          id: "1",
          title: "Band 1, Einheit 5, Text 2"
        },
        {
          id: "2",
          title: "文本名称"
        },
        {
          id: "3",
          title: "文本名称"
        },
        {
          id: "4",
          title: "文本名称"
        }]
    }
  },
  methods: {
    Read(item) {
      this.$router.push({
        name: 'article',
        params: { articleId: item.id, }
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
  font-size: 14px;
  text-align: center;
  padding: 0 14px 10px;
  height: 30px;
}

.card {
  padding: 15px 25px;
  cursor: pointer;
}
</style>