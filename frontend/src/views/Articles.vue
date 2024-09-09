<template>
  <div id="Articles">
    <div class="top">
      <div class="TopLeft">
        <span class="ArticleName">文本名称</span>
        <el-tag effect="dark" class="tag">主题</el-tag>
        <el-tag type="danger" effect="dark" class="tag">难度</el-tag>
      </div>
      <el-button type="success" icon="el-icon-star-off" circle class="collect"></el-button>
    </div>
    <div class="text">
      {{ text }}
    </div>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
export default {
  name: 'Articles',
  components: {
    Footer
  },
  data() {
    return {
      ArticleId: "1",
      text: "1234"
    }
  },
  methods: {
    GetOriginalText() {
      const ArticleInformation = { id: this.ArticleId, text: this.text }
      this.$store.dispatch('GetOriginalText', ArticleInformation)
    }
  },
  mounted() {
    this.GetOriginalText()
  }
}
</script>

<style>
.top {
  height: 75px;
  text-align: center;
}

.TopLeft {
  display: inline-block;
  height: 100%;
  width: 70%;
  line-height: 75px;
}

.ArticleName {
  display: inline-block;
  width: 40%;
  text-align: center;
  font-size: 36px;
  margin-right: 40px;
}

.tag {
  font-size: 20px;
  margin: 0 10px;
}

.collect {
  float: right;
  margin: 20px 50px;
  font-size: 22px;
}

.text {
  font-size: 24px;
  line-height: 50px;
}
</style>