const Mock = require("mockjs");

// 自定义生成验证码和响应消息的函数
const Random = Mock.Random;
Random.extend({
  // 随机生成验证码（6位数字）
  verificationCode: function () {
    return this.string('number', 6); // 随机生成6位数字作为验证码
  },

  // 随机生成发送验证码的响应消息
  sendCodeMessage: function () {
    const messages = [
      "验证码已发送，请查收。",
      "您的验证码已发送到手机，请稍后查看。",
      "验证码已成功发送，请在5分钟内使用。",
      "系统繁忙，稍后再试。",
      "手机号码无效，请检查后重新输入。",
    ];
    return this.pick(messages);
  }
});

// Mock 数据生成
Mock.mock(/\/api\/auth\/send-code/, 'post', (options) => {
  const phoneNumber = options.body; // 从请求体中解析手机号
  // 检查手机号格式是否正确
  const phonePattern = /^1[3-9]\d{9}$/;
  if (!phonePattern.test(phoneNumber)) {
    return {
      code: 400,
      message: "手机号格式不正确，请输入有效的手机号。",
      data: null
    };
  }

  // 模拟成功发送验证码的响应
  return {
    code: 200,
    message: Random.sendCodeMessage(),
    data: {
      verificationCode: Random.verificationCode() // 生成随机验证码
    }
  };
});

import axios from 'axios'
export function getCode(phoneNumber) {
  return axios({
    method: 'post',
    url: `/api/auth/send-code`,
    data: phoneNumber,
  })
}