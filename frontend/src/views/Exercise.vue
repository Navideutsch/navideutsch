<template>
  <div class="exercise-container">
    <!-- 显示提交结果 -->
    <div v-if="submitted" class="result">
      <h2>提交结果</h2>
      <p>您的得分: {{ score }}%</p>

      <div v-for="result in detailedResults" :key="result.exerciseId" class="result-item">
        <div class="question">{{ result.sequence }}. {{ result.questionText }}</div>

        <!-- Multiple Choice 和 True/False 显示选项 -->
        <div v-if="result.exerciseType === 'MultipleChoice' || result.exerciseType === 'TrueFalse'" class="answers">
          <p>您的答案:
            <span :class="{ 'correct-answer': result.isCorrect, 'incorrect-answer': !result.isCorrect }">
              {{ formatUserAnswer(result) }}
            </span>
          </p>
          <p>正确答案:
            <span style="font-weight: bold;">
              {{ formatCorrectAnswer(result) }}
            </span>
          </p>
        </div>

        <!-- Fill in the Blank 显示答案数组 -->
        <div v-else-if="result.exerciseType === 'FillInTheBlank'" class="answers">
          <p>您的答案:
            <span :class="{ 'correct-answer': result.isCorrect, 'incorrect-answer': !result.isCorrect }">
              {{ formatUserAnswer(result) }}
            </span>
          </p>
          <p>正确答案:
            <span style="font-weight: bold;">
              {{ formatCorrectAnswer(result) }}
            </span>
          </p>
        </div>

        <!-- 显示是否正确 -->
        <p :class="getResultClass(result)">
          {{ getResultText(result) }}
        </p>
      </div>
    </div>

    <!-- 显示标题和练习题 -->
    <div v-else>
      <div class="title">{{ this.$route.params.title }}</div>

      <div class="exercise-list">
        <div v-for="exercise in exercises" :key="exercise.exerciseId" class="exercise-item card">
          <div class="question">
            <span class="sequence">{{ exercise.sequence }}. </span>
            <span v-html="formatQuestionText(exercise)"></span>
          </div>

          <!-- Multiple Choice -->
          <div v-if="exercise.exerciseType === 'MultipleChoice'" class="multiple-choice">
            <div v-for="option in exercise.multipleChoiceOptions" :key="option.optionId" class="option">
              <label class="option-label">
                <input type="radio" :name="'exercise_' + exercise.exerciseId" :value="option.optionId"
                  v-model="userAnswers[exercise.exerciseId]" required />
                <span class="custom-radio"></span>
                {{ option.optionText }}
              </label>
            </div>
          </div>

          <!-- True/False -->
          <div v-else-if="exercise.exerciseType === 'TrueFalse'" class="true-false">
            <label class="option-label">
              <input type="radio" :name="'exercise_' + exercise.exerciseId" :value="1"
                v-model="userAnswers[exercise.exerciseId]" required />
              <span class="custom-radio"></span>
              True
            </label>
            <label class="option-label">
              <input type="radio" :name="'exercise_' + exercise.exerciseId" :value="0"
                v-model="userAnswers[exercise.exerciseId]" required />
              <span class="custom-radio"></span>
              False
            </label>
          </div>

          <!-- Fill in the Blank -->
          <div v-else-if="exercise.exerciseType === 'FillInTheBlank'" class="fill-in-the-blank">
            <div v-for="blank in exercise.fillInTheBlankAnswers" :key="blank.blankId" class="blank">
              <input type="text" v-model="userAnswers[`${exercise.exerciseId}_${blank.blankId}`]"
                :placeholder="`空格 ${blank.blankPosition}`" required />
            </div>
          </div>
        </div>
        <button @click="submitAnswers" class="submit-button" v-show="!(isSubmitting || submitted)">
          {{ isSubmitting ? '提交中...' : '提交答案' }}
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <p>还有题目未解答，是否提交？</p>
        <div class="modal-buttons">
          <button @click="confirmSubmission" class="modal-button confirm">是</button>
          <button @click="cancelSubmission" class="modal-button cancel">否</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getExercise } from '@/api/GetExercise'
import { postExercise } from '@/api/PostExercise'

export default {
  name: 'Exercise',
  data() {
    return {
      exercises: [],
      userAnswers: {}, // 存储用户的答案
      submitted: false, // 标识是否已经提交
      correctAnswers: {}, // 存储正确答案
      score: 0, // 用户得分
      showModal: false, // 是否显示弹窗
      isSubmitting: false, // 标识是否正在提交
      articleId: this.$route.params.articleId, // 存储 articleId
      submissionPayload: null, // 存储提交的数据
      submissionResults: [] // 存储提交的结果
    }
  },
  computed: {
    detailedResults() {
      return this.submissionResults.map(result => {
        const exercise = this.exercises.find(ex => ex.exerciseId === result.exerciseId)
        return {
          ...result,
          questionText: exercise ? exercise.questionText : '未知题目',
          sequence: exercise ? exercise.sequence : '',
          exerciseType: exercise ? exercise.exerciseType : 'Unknown',
          fillInTheBlankAnswers: exercise && exercise.exerciseType === 'FillInTheBlank' ? exercise.fillInTheBlankAnswers : []
        }
      })
    }
  },
  methods: {
    async GetExercises() {
      try {
        const res = await getExercise(this.articleId)
        if (res && res.data && res.data.data) {
          this.exercises = res.data.data.exercises
          // 假设正确答案在数据中
          this.exercises.forEach(exercise => {
            if (exercise.exerciseType === 'MultipleChoice') {
              const correctOption = exercise.multipleChoiceOptions.find(option => option.isCorrect)
              if (correctOption) {
                this.correctAnswers[exercise.exerciseId] = correctOption.optionId
              }
            } else if (exercise.exerciseType === 'TrueFalse') {
              this.correctAnswers[exercise.exerciseId] = exercise.trueFalseAnswer.isCorrect
            } else if (exercise.exerciseType === 'FillInTheBlank') {
              exercise.fillInTheBlankAnswers.forEach(blank => {
                this.correctAnswers[`${exercise.exerciseId}_${blank.blankId}`] = blank.correctAnswer
              })
            }
          })
          console.log('Exercises:', this.exercises)
          console.log('Correct Answers:', this.correctAnswers)
        } else {
          throw new Error('未收到有效响应数据')
        }
      } catch (error) {
        console.error(error)
      }
    },
    // 格式化填空题的 questionText
    formatQuestionText(exercise) {
      if (exercise.exerciseType === 'FillInTheBlank') {
        // 将 __ 替换为视觉上的占位符
        return exercise.questionText.replace(/__/g, '___')
      }
      return exercise.questionText
    },
    // 提交答案
    submitAnswers() {
      const unanswered = this.exercises.some(exercise => {
        if (exercise.exerciseType === 'MultipleChoice' || exercise.exerciseType === 'TrueFalse') {
          return this.userAnswers[exercise.exerciseId] == null
        } else if (exercise.exerciseType === 'FillInTheBlank') {
          return exercise.fillInTheBlankAnswers.some(blank => {
            return this.userAnswers[`${exercise.exerciseId}_${blank.blankId}`] == null
          })
        }
        return false
      })

      if (unanswered) {
        this.showModal = true
      } else {
        this.processSubmission()
      }
    },
    // 处理提交
    async processSubmission() {
      this.isSubmitting = true
      // 构建提交的 payload
      const submission = {
        articleId: this.articleId,
        exercises: this.exercises.map(exercise => {
          if (exercise.exerciseType === 'MultipleChoice' || exercise.exerciseType === 'TrueFalse') {
            return {
              exerciseId: exercise.exerciseId,
              exerciseType: exercise.exerciseType,
              answer: this.userAnswers[exercise.exerciseId] !== null ? Number(this.userAnswers[exercise.exerciseId]) : null
            }
          } else if (exercise.exerciseType === 'FillInTheBlank') {
            return {
              exerciseId: exercise.exerciseId,
              exerciseType: exercise.exerciseType,
              answer: exercise.fillInTheBlankAnswers.map(blank => {
                const key = `${exercise.exerciseId}_${blank.blankId}`
                return this.userAnswers[key] ? this.userAnswers[key].trim() : ''
              })
            }
          }
        })
      }
      this.submissionPayload = submission
      console.log('Submission Payload:', this.submissionPayload)
      try {
        // 发送提交数据到服务器
        const res = await postExercise(submission)
        console.log('Response:', res)
        if (res && res.data.status === 100) { // 根据 Mock.js 返回的 status 修改判断
          this.calculateScore(res.data.data.results)
          this.submissionResults = res.data.data.results
          this.submitted = true
          console.log('提交成功:', res)
        } else {
          throw new Error('提交失败')
        }
      } catch (error) {
        console.error('提交出错:', error)
      } finally {
        this.isSubmitting = false
      }
    },
    // 计算得分
    calculateScore(results) {
      let total = 0
      let correct = 0

      results.forEach(result => {
        const { isCorrect } = result
        total += 1
        if (isCorrect) {
          correct += 1
        }
      })

      this.score = ((correct / total) * 100).toFixed(2)
      console.log(`得分: ${this.score}%`)
    },
    // 确认提交（点击“是”）
    confirmSubmission() {
      // 填补未回答的题目为空
      this.exercises.forEach(exercise => {
        if (exercise.exerciseType === 'MultipleChoice' || exercise.exerciseType === 'TrueFalse') {
          if (this.userAnswers[exercise.exerciseId] == null) {
            this.userAnswers[exercise.exerciseId] = null
          }
        } else if (exercise.exerciseType === 'FillInTheBlank') {
          exercise.fillInTheBlankAnswers.forEach(blank => {
            const key = `${exercise.exerciseId}_${blank.blankId}`
            if (this.userAnswers[key] == null) {
              this.userAnswers[key] = ''
            }
          })
        }
      })
      this.showModal = false
      this.processSubmission()
    },
    // 取消提交（点击“否”）
    cancelSubmission() {
      this.showModal = false
    },
    // 格式化用户答案
    formatUserAnswer(result) {
      const { userAnswer, exerciseType } = result

      // 检查是否未作答
      const isUnanswered = (() => {
        if (exerciseType === 'MultipleChoice' || exerciseType === 'TrueFalse') {
          return userAnswer == null
        } else if (exerciseType === 'FillInTheBlank') {
          return Array.isArray(userAnswer) ? userAnswer.some(ans => !ans.trim()) : true
        }
        return false
      })()

      if (isUnanswered) {
        return '未作答'
      }

      // 已回答的情况
      if (exerciseType === 'FillInTheBlank') {
        return userAnswer.join(', ')
      }
      if (exerciseType === 'TrueFalse') {
        return userAnswer === 1 ? 'True' : 'False'
      }
      if (exerciseType === 'MultipleChoice') {
        const exercise = this.exercises.find(ex => ex.exerciseId === result.exerciseId)
        const option = exercise && exercise.multipleChoiceOptions.find(opt => opt.optionId === userAnswer)
        return option ? option.optionText : '未选择'
      }
      return userAnswer
    },
    // 格式化正确答案
    formatCorrectAnswer(result) {
      console.log(6545, result)
      if (result.exerciseType === 'FillInTheBlank') {
        return result.correctAnswer.join(', ')
      }
      if (result.exerciseType === 'TrueFalse') {
        return result.correctAnswer === 1 ? 'True' : 'False'
      }
      if (result.exerciseType === 'MultipleChoice') {
        const exercise = this.exercises.find(ex => ex.exerciseId === result.exerciseId)
        const option = exercise && exercise.multipleChoiceOptions.find(opt => opt.optionId === result.correctAnswer)
        return option ? option.optionText : '未选择'
      }
      return result.correctAnswer
    },
    getResultClass(result) {
      const { userAnswer, isCorrect } = result
      if (userAnswer === null || (Array.isArray(userAnswer) && userAnswer.every(ans => !ans.trim()))) {
        return 'unanswered'
      }
      return isCorrect ? 'correct' : 'incorrect'
    },

    // 获取结果的显示文本
    getResultText(result) {
      const { userAnswer, isCorrect } = result
      if (userAnswer === null || (Array.isArray(userAnswer) && userAnswer.every(ans => !ans.trim()))) {
        return '未作答'
      }
      return isCorrect ? '正确' : '错误'
    },
  },
  mounted() {
    this.GetExercises()
  }
}
</script>

<style scoped>
.exercise-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  font-family: 'Arial', sans-serif;
}

.title {
  display: flex;
  /* 使用 Flexbox 布局 */
  /* 使用 Flexbox 布局 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中（可选） */
  width: 100%;
  height: 88px;
  font-size: 26px;
  font-weight: bold;
  color: #333;
}

.exercise-list {
  max-height: 64vh;
  overflow-y: auto;

  /* 启用移动端惯性滚动 */
  -webkit-overflow-scrolling: touch;

  /* 启用平滑滚动 */
  scroll-behavior: smooth;
}

.exercise-list::-webkit-scrollbar {
  display: none;
  /* 针对 Chrome, Safari 以及 Edge */
}

.exercise-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.exercise-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.question {
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 16px;
  color: #555;
}

.sequence {
  color: #007BFF;
}

.multiple-choice .option,
.true-false label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
}

.option-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.option-label input {
  opacity: 0;
  position: absolute;
  left: 0;
  height: 0;
  width: 0;
}

.custom-radio {
  height: 18px;
  width: 18px;
  background-color: #fff;
  border: 2px solid #007BFF;
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
  transition: background-color 0.2s, border-color 0.2s;
}

.option-label input:checked~.custom-radio {
  background-color: #007BFF;
}

.custom-radio::after {
  content: "";
  position: absolute;
  display: none;
}

.option-label input:checked~.custom-radio::after {
  display: block;
}

.option-label .custom-radio::after {
  top: 4px;
  left: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.fill-in-the-blank .blank {
  margin-bottom: 10px;
}

.fill-in-the-blank input {
  width: 100%;
  max-width: 300px;
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s, box-shadow 0.3s;
  font-size: 14px;
}

.fill-in-the-blank input:focus {
  border-color: #007BFF;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

.submit-button {
  display: block;
  width: 100%;
  max-width: 200px;
  margin: 30px auto 0;
  padding: 12px 20px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: scale(1.05);
}

.submit-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.result {
  max-height: 64vh;
  overflow-y: auto;
  /* 启用移动端惯性滚动 */
  -webkit-overflow-scrolling: touch;
  /* 启用平滑滚动 */
  scroll-behavior: smooth;
  padding: 0 20px;
  margin-bottom: 10px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.result::-webkit-scrollbar {
  display: none;
  /* 针对 Chrome, Safari 以及 Edge */
}

.result-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.result-item .question {
  font-size: 18px;
  margin-bottom: 10px;
}

.answers p {
  margin: 5px 0;
  font-size: 16px;
}

.correct-answer {
  color: green;
  font-weight: bold;
}

.incorrect-answer {
  color: red;
  font-weight: bold;
}

.unanswered {
  color: gray;
  font-weight: bold;
}

/* 确保已存在正确和错误的样式 */
.correct {
  color: green;
  font-weight: bold;
}

.incorrect {
  color: red;
  font-weight: bold;
}

.result p {
  font-size: 16px;
  color: #555;
}

.result pre {
  background-color: #fff;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow-x: auto;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.3s;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

.modal-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.modal-button.confirm {
  background-color: #28a745;
  color: #fff;
  transition: background-color 0.3s;
}

.modal-button.confirm:hover {
  background-color: #218838;
}

.modal-button.cancel {
  background-color: #dc3545;
  color: #fff;
  transition: background-color 0.3s;
}

.modal-button.cancel:hover {
  background-color: #c82333;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
  }

  to {
    transform: translateY(0);
  }
}
</style>
