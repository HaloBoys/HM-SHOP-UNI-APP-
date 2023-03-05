import App from './App'
import store from './store/store.js'

import { $http } from '@escook/request-miniprogram'
// 注意下面这行代码要放在uni.$http挂载$http的前面
// $http.baseUrl = 'https://api-hmugo-web.itheima.net'
$http.baseUrl = 'https://www.uinav.com'

uni.$http = $http
// 配置请求根路径

// 请求开始之前做一些事情（请求拦截器）
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
}

// 请求完成之后做一些事情（响应拦截器）
$http.afterRequest = function () {
  uni.hideLoading()
}

// 封装的展示消息提示的方法
// 默认值：title = '数据加载失败！', duration = 1500
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
    store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif