module.exports = {
  pages: {
    index: {
      //入口
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    login: {
      entry: 'src/pages/login/login.js',
      template: 'src/pages/login/login.html'
    }
  },
  lintOnSave: false, //关闭语法检查
  devServer: {

  }
}