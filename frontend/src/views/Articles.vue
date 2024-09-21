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
        <!-- 全文切换按钮，点击后切换原文/译文 -->
        <el-button type="primary" @click="toggleAllContent">
          {{ globalShowAllOriginal ? '显示译文' : '显示原文' }}
        </el-button>
      </div>
    </div>

    <!-- 显示内容区域，添加滚动效果 -->
    <div class="text-wrapper">
      <!-- 遍历段落 -->
      <div v-for="(paragraph, index) in paragraphs" :key="paragraph.paragraphId" class="paragraph">
        <transition name="fade">
          <!-- 根据全局状态或段落单独状态决定显示内容 -->
          <div class="text-content" :ref="'textContent' + index"
            v-html="paragraph.showOriginal !== null ? (paragraph.showOriginal ? paragraph.paragraphContent : paragraph.paragraphTranslation) : (globalShowAllOriginal ? paragraph.paragraphContent : paragraph.paragraphTranslation)">
          </div>
        </transition>
        <!-- 每个段落的单独切换按钮 -->
        <el-button size="mini" @click="toggleParagraphContent(index)" style="margin-top: 10px;">
          {{ paragraph.showOriginal !== null ? (paragraph.showOriginal ? '显示译文' : '显示原文') : (globalShowAllOriginal ?
            '显示译文' : '显示原文') }}
        </el-button>
      </div>
      <div style="width: 100%;margin-top: 20px;text-align: center;">
        <el-button type="primary" @click="GoToExercise" style="width: 75%;">
          去练习
        </el-button>
      </div>
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
      globalShowAllOriginal: true, // 全文的原文/译文切换状态
      article: {}, // 文章内容
      paragraphs: [] // 段落数组
    }
  },
  methods: {
    // 全文切换原文/译文，优先级最高
    toggleAllContent() {
      this.globalShowAllOriginal = !this.globalShowAllOriginal;
      // 点击全文切换时，重置所有段落的单独状态，使其跟随全局状态
      this.paragraphs.forEach((paragraph, index) => {
        this.$set(this.paragraphs[index], 'showOriginal', null); // 重置段落状态
      });
    },
    // 单个段落切换原文/译文
    toggleParagraphContent(index) {
      // 如果全局切换后，段落状态为 null 时，根据当前全局状态初始化段落状态
      if (this.paragraphs[index].showOriginal === null) {
        this.$set(this.paragraphs[index], 'showOriginal', this.globalShowAllOriginal);
      }
      this.$set(this.paragraphs[index], 'showOriginal', !this.paragraphs[index].showOriginal);
    },
    // 获取文章内容
    async getOriginalText() {
      try {
        const res = await getOriginalTexts(this.$route.params.articleId);
        if (res) {
          this.article = res.data.data;
          this.paragraphs = this.article.paragraphs.map(paragraph => ({
            ...paragraph,
            showOriginal: null // 段落的原文/译文状态，初始化为 null 表示跟随全局
          }));
          this.getClick();
        } else {
          throw new Error('未收到有效响应数据');
        }
      } catch (error) {
        console.error(error);
      }
    },
    getClick() {
      this.$nextTick(() => {
        this.paragraphs.forEach((paragraph, index) => {
          const textElement = this.$refs['textContent' + index];
          // 检查 textElement 是否是数组，如果是，取第一个元素
          const actualElement = Array.isArray(textElement) ? textElement[0] : textElement;
          if (actualElement) {
            actualElement.addEventListener('click', (event) => {
              const clickedText = event.target;
              if (clickedText.nodeType === Node.ELEMENT_NODE) {
                const word = this.getSelectedWord();
                console.log(word); // 显示段落和提取的单词
              }
            });
          }
        });
      });
    },
    getSelectedWord() {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      // 获取被点击的完整句子或段落
      const fullText = range.startContainer.textContent;

      // 获取点击的字符位置
      const clickOffset = range.startOffset;

      // 从点击的位置向前和向后查找完整单词
      const wordStart = fullText.slice(0, clickOffset).search(/\b\w+\b$/); // 向前找
      const wordEnd = fullText.slice(clickOffset).search(/\b\W/); // 向后找

      // 提取出完整单词
      const word = fullText.slice(
        wordStart,
        clickOffset + (wordEnd > -1 ? wordEnd : fullText.length)
      );
      return word.trim();
    },
    GoToExercise() {
      this.$router.push({
        name: 'Exercise',
        params:
        {
          articleId: this.article.articleId,
          title: this.article.title
        }
      })
    }
  },
  mounted() {
    this.getOriginalText();
  },
}
</script>

<style>
#Articles {
  padding: 0 10px;
}

.article-header {
  display: flex;
  text-align: center;
  /* 使用 Flexbox 布局 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中（可选） */
  width: 100%;
  height: 76px;
}

.ArticleName {
  font-size: 26px;
  font-weight: bold;
}

.article-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 20px;
}

.tags {
  display: flex;
  align-items: center;
}

.tag {
  font-size: 14px;
  margin-right: 10px;
}

.toggle-buttons {
  display: flex;
  gap: 10px;
}

/* 滚动文本部分 */
.text-wrapper {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px 20px 5px;
  border-radius: 10px;

  /* 启用移动端惯性滚动 */
  -webkit-overflow-scrolling: touch;

  /* 启用平滑滚动 */
  scroll-behavior: smooth;
}

.text-wrapper::-webkit-scrollbar {
  display: none;
  /* 针对 Chrome, Safari 以及 Edge */
}

.text-content {
  font-size: 14px;
  line-height: 1.6;
  text-align: justify;
}

.paragraph {
  margin-bottom: 15px;
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
</style>
