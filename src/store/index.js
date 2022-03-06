/*
 * @Descripttion: 
 * @version: X3版本
 * @Author: GaoFei
 * @Date: 2020-02-19 23:22:10
 * @LastEditors: GaoFei
 * @LastEditTime: 2021-06-21 16:32:11
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 创建一个store仓库
// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

let hasLogin = localStorage.getItem("hasLogin")
let initState = {
  token: localStorage.getItem("token") ||'',
  permission: localStorage.getItem("permissionSelf") || [],
  userName: localStorage.getItem("userName") || ''
};

 


const store = new Vuex.Store({
  //state用来存放数据的对象
  state: {
    //初始值、存放的东西
    token: initState.token,
    // permission: initState.permission,
    userName: initState.userName,
    golbleImage: 'http://test.onecar.static.dp20.cn/',//下载图片路径  失效不用了，图片直接放在阿里云的oss上面
    uploadImage: 'https://app.onecar.fun/api/v1.0/'  //上传图片路径    失效不用了，图片直接放在阿里云的oss上面
  },
  //定义取数据
  getters: {
    // title:function(state){
    //     return state.title;
    // }
    token: state => state.token,
    // permission: state => state.permission,
    userName: state => state.userName,
    golbleImage: state => state.golbleImage,
    uploadImage: state => state.uploadImage
  },
  mutations: {

    //set方法

    token(state, value) {
    //   console.log(state,'store里面set')
      if (!state.token) {  //清空缓存再登录的时候，localstorage里的token还未给这里的token赋值，就跳转页面了，存在异步问题，所以这里要判断
        state.token = value
      }
    },
    // permission(state, pValue) {

    //   state.permission = pValue

    // },
    userName(state, uValue) {

      state.userName = uValue

    },

    golbleImage(state, img) {

      state.golbleImage = img

    },
    uploadImage(state, image) {

      state.uploadImage = image

    }
  },
  modules

})

export default store;
