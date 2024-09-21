// src/mock.js
import Mock from 'mockjs'

// 正则匹配 URL，捕获 articleId
const submitExerciseRegex = /^\/api\/reading\/(\w+)\/submit-exercise$/

// 定义 Mock 拦截 POST 请求
Mock.mock(submitExerciseRegex, 'post', (options) => {
  // 从 URL 中提取 articleId
  const match = options.url.match(submitExerciseRegex)
  const articleId = match ? match[1] : 'unknown'

  // 解析请求体
  let body = {}
  try {
    body = JSON.parse(options.body)
  } catch (e) {
    console.error('无法解析请求体:', e)
    return {
      status: 400,
      msg: "请求体格式错误",
      data: null
    }
  }

  const exercises = body.submission.exercises
  if (!Array.isArray(exercises)) {
    console.error('exercises 应该是一个数组')
    return {
      status: 400,
      msg: "exercises 应该是一个数组",
      data: null
    }
  }

  console.log('提交的练习题:', exercises)

  // 动态生成 correctAnswers
  const correctAnswers = exercises.reduce((answers, exercise) => {
    const { exerciseId, exerciseType } = exercise

    // 动态生成不同类型题目的正确答案
    if (exerciseType === 'MultipleChoice') {
      answers[exerciseId] = Math.floor(Math.random() * 4) + 1 // 生成 1 到 4 之间的随机整数作为选择题答案
    } else if (exerciseType === 'TrueFalse') {
      answers[exerciseId] = Math.random() > 0.5 ? 1 : 0 // 生成 0 或 1 作为判断题答案
    } else if (exerciseType === 'FillInTheBlank') {
      answers[exerciseId] = ['Berlin', 'Paris'] // 填空题答案可以是一个数组
    }

    return answers
  }, {})

  // 生成结果
  const results = exercises.map(exercise => {
    const { exerciseId, exerciseType, answer } = exercise
    let userAnswer = answer
    let correctAnswer = correctAnswers[exerciseId]
    let isCorrect = false

    if (exerciseType === 'MultipleChoice' || exerciseType === 'TrueFalse') {
      isCorrect = userAnswer === correctAnswer
    } else if (exerciseType === 'FillInTheBlank') {
      isCorrect = Array.isArray(userAnswer) && Array.isArray(correctAnswer) &&
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((ans, idx) => ans.trim().toLowerCase() === correctAnswer[idx].trim().toLowerCase())
    }

    return {
      exerciseId,
      userAnswer,
      correctAnswer,
      isCorrect
    }
  })

  // 构建响应体
  const response = {
    status: 100,
    msg: "操作成功",
    data: {
      success: true,
      results
    }
  }

  console.log('Mock响应:', response)

  return response
})



import axios from 'axios'
export function postExercise(submission) {
  return axios({
    method: 'POST',
    url: `/api/reading/${submission.articleId}/submit-exercise`,
    data: { submission }
  })
}