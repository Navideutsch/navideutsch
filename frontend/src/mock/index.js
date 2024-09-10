const Mock = require("mockjs");

// 自定义生成德语文章和翻译的函数
const Random = Mock.Random;
Random.extend({
  // 随机生成一个德语句子
  germanSentence: function () {
    const sentences = [
      "Sebastian liebt es, in den Park zu gehen und die Vögel zu beobachten.",
      "In Deutschland gibt es viele schöne Städte, die einen Besuch wert sind.",
      "Die Sonne scheint heute und das Wetter ist angenehm.",
      "Das Konzert war großartig, und die Musiker spielten mit viel Leidenschaft.",
      "Das Buch, das ich gelesen habe, war sehr interessant und lehrreich.",
      "Meine Großmutter backt die besten Kuchen, die ich je gegessen habe."
    ];
    return this.pick(sentences);
  },

  // 随机生成一个中文翻译
  chineseTranslation: function () {
    const translations = [
      "塞巴斯蒂安喜欢去公园观察鸟类。",
      "在德国有许多美丽的城市，值得一游。",
      "今天阳光明媚，天气宜人。",
      "音乐会很棒，音乐家们充满激情地演奏。",
      "我读的那本书非常有趣且富有教育意义。",
      "我的祖母烤的蛋糕是我吃过的最好吃的。"
    ];
    return this.pick(translations);
  },

  // 随机生成一个德语文章标题
  germanTitle: function () {
    const titles = [
      "Ein Tag im Park",
      "Schöne Städte in Deutschland",
      "Sonniges Wetter",
      "Ein großartiges Konzert",
      "Ein interessantes Buch",
      "Die besten Kuchen"
    ];
    return this.pick(titles);
  },

  // 随机生成德语文章内容（多句）
  germanContent: function () {
    let content = '';
    for (let i = 0; i < 3; i++) {  // 生成3个随机德语句子作为文章内容
      content += `<p>${this.germanSentence()}</p>`;
    }
    return content;
  },

  // 生成中文翻译内容（与德语文章对应）
  chineseContent: function () {
    let translation = '';
    for (let i = 0; i < 3; i++) {  // 生成3个随机中文句子作为翻译
      translation += `<p>${this.chineseTranslation()}</p>`;
    }
    return translation;
  }
});

// 生成随机文章数据
Mock.mock(/\/api\/reading\/article\/\d+\/original/, 'get', (options) => {
  const articleId = options.url.match(/\/api\/reading\/article\/(\d+)\/original/)[1];

  // 随机生成标题、德语内容和中文翻译
  const title = Random.germanTitle();
  const content = Random.germanContent();
  const translation = Random.chineseContent();

  return {
    code: 200,
    message: "success",
    data: {
      articleId: articleId,
      title: title,
      content: content,
      translation: translation
    }
  };
});
