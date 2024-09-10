<template>
  <div id="Articles">
    <!-- 标题部分 -->
    <div class="article-header">
      <span class="ArticleName">{{ article.title }}</span>
    </div>

    <!-- 主题标签和译文切换按钮部分 -->
    <div class="article-controls">
      <div class="tags">
        <el-tag effect="dark" class="tag">主题</el-tag>
        <el-tag type="danger" effect="dark" class="tag">难度</el-tag>
      </div>
      <div class="toggle-buttons">
        <!-- 单个切换按钮，点击后切换原文/译文 -->
        <el-button type="primary" @click="toggleContent">
          {{ showOriginal ? '显示译文' : '显示原文' }}
        </el-button>
      </div>
    </div>

    <!-- 显示内容区域，添加滚动效果 -->
    <div class="text-wrapper">
      <transition name="fade">
        <div v-if="showOriginal" class="text-content" v-html="article.content"></div>
        <div v-else class="text-content" v-html="article.translation"></div>
      </transition>
    </div>
  </div>
</template>



<script>
import Footer from '@/components/Footer.vue'
import { getOriginalTexts } from '@/api/GetTexts'
export default {
  name: 'Articles',
  components: {
    Footer
  },
  data() {
    return {
      showOriginal: true, // 控制原文/译文的显示
      article: {}

    }
  },
  methods: {
    toggleContent() {
      this.showOriginal = !this.showOriginal;
    },
    async getOriginalText() {
      console.log(this.$route.params.articleId)
      try {
        const res = await getOriginalTexts(this.$route.params.articleId);
        if (res) {
          console.log(res)
          this.article = res.data.data
        } else {
          throw new Error('未收到有效响应数据');
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.getOriginalText()
  }
}
</script>

<style>
#Articles {
  padding: 10px;
}

.article-header {
  text-align: center;
  margin-bottom: 20px;
}

.ArticleName {
  font-size: 36px;
  font-weight: bold;
}

.article-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.tags {
  display: flex;
  align-items: center;
}

.tag {
  font-size: 20px;
  margin-right: 10px;
}

.toggle-buttons {
  display: flex;
  gap: 10px;
}

/* 滚动文本部分 */
.text-wrapper {
  max-height: 52vh;
  overflow-y: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.text-content {
  font-size: 24px;
  line-height: 1.6;
  text-align: justify;
}

/* 淡入淡出动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 自定义滚动条样式 */
.text-wrapper::-webkit-scrollbar {
  width: 8px;
}

.text-wrapper::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.text-wrapper::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
</style>