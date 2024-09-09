import axios from 'axios'
export default {
  //开启命名空间
  namespace: true,
  //准备actions对象——响应组件中用户的动作
  actions: {
    GetOriginalText(context, value) {
      axios({
        method: 'GET',
        url: `/api/reading/article`,
      }).then(res => {
        console.log(res.data);
      }, err => {
        console.log(err);
      })
    }
  },
  //准备mutations对象——修改state中的数据
  mutations: {},
  //准备state对象——保存具体的数据
  state: {
    OriginalText: ""
  }
}