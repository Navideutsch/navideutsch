const Mock = require("mockjs");

// 自定义生成题目类型和选项的函数
const Random = Mock.Random;
Random.extend({
  // 随机生成题目类型
  exerciseType: function () {
    const types = ["MultipleChoice", "TrueFalse", "FillInTheBlank"];
    return this.pick(types);
  },

  // 生成随机选项
  multipleChoiceOptions: function (exerciseId) {
    const options = [
      { optionText: "选项 A", isCorrect: 0 },
      { optionText: "选项 B", isCorrect: 0 },
      { optionText: "选项 C", isCorrect: 0 },
      { optionText: "选项 D", isCorrect: 0 },
    ];
    // 随机选择一个正确答案
    const correctIndex = this.integer(0, options.length - 1);
    options[correctIndex].isCorrect = 1;

    // 赋予唯一的 optionId
    return options.map((option, index) => ({
      optionId: index + 1,
      exerciseId: exerciseId,
      optionText: option.optionText,
      isCorrect: option.isCorrect
    }));
  },

  // 生成填空题答案
  fillInTheBlankAnswers: function (exerciseId, blankCount) {
    const answers = [];
    for (let i = 1; i <= blankCount; i++) {
      answers.push({
        blankId: i,
        exerciseId: exerciseId,
        blankPosition: `${i}`,
        correctAnswer: this.word(3, 7)
      });
    }
    return answers;
  }
});

// 定义 Mock API
Mock.mock(/\/api\/reading\/\w+\/exercises/, 'get', (options) => {
  // 从 URL 中提取 articleId
  const match = options.url.match(/\/api\/reading\/(\w+)\/exercises/);
  const articleId = match ? match[1] : 'unknown';

  const exerciseCount = 5; // 生成5道题目
  const exercises = [];

  for (let i = 1; i <= exerciseCount; i++) {
    const type = Random.exerciseType();
    const exercise = {
      exerciseId: i,
      exerciseType: type,
      questionText: "",
      sequence: i,
      multipleChoiceOptions: null,
      trueFalseAnswer: null,
      fillInTheBlankAnswers: null
    };

    switch (type) {
      case "MultipleChoice":
        exercise.questionText = `这是第${i}道选择题的题目内容。`;
        exercise.multipleChoiceOptions = Random.multipleChoiceOptions(i);
        break;
      case "TrueFalse":
        exercise.questionText = `这是第${i}道判断题的题目内容。`;
        exercise.trueFalseAnswer = {
          answerId: 1,
          exerciseId: i,
          isCorrect: Random.integer(0, 1)
        };
        break;
      case "FillInTheBlank":
        const blankCount = Random.integer(1, 3); // 生成1到3个填空
        exercise.questionText = Array.from({ length: blankCount }, () => "__").join(" 是答案。 ");
        exercise.fillInTheBlankAnswers = Random.fillInTheBlankAnswers(i, blankCount);
        break;
      default:
        break;
    }

    exercises.push(exercise);
  }

  return {
    code: 200,
    message: "获取题目数据成功。",
    data: {
      exercises: exercises,
      articleId: articleId
    }
  };
});


import axios from 'axios'
export function getExercise(articleId) {
  return axios({
    method: 'GET',
    url: `/api/reading/${articleId}/exercises`,
  })
}