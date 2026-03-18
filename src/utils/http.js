import { useUserStore } from '@/stores/user'
// 这里也可以根据实际情况修改成线上接口地址
const baseURL = 'http://localhost:8088/pickup-app-api/'

export const http = (options) => {
  // 定义统一的登出跳转逻辑
  const handleAuthError = () => {
    const userStore = useUserStore()
    userStore.clearUserInfo()
    uni.reLaunch({ url: '/pages/login/login' })
  }

  // 1. 返回 Promise 对象
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      // 响应成功
      success(res) {
        // 1. 业务级 401 拦截 (当 HTTP 状态码为 200 时)
        if (res.data && (res.data.code === 401 || res.data.code === 1001)) {
          handleAuthError()
          return reject(res)
        }

        // 2. 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.code !== 0) {
            // 根据后端错误信息轻提示
            uni.showToast({
              icon: 'error',
              title: res.data.msg || '请求错误',
            })
            reject(res)
          } else {
            // 提取核心数据 res.data
            resolve(res.data)
          }
        } else if (res.statusCode === 401) {
          // 3. HTTP 级 401 拦截
          handleAuthError()
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: res.data.msg || '请求错误',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

const httpInterceptor = {
  invoke(options) {
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    options.timeout = 10000
    options.header = {
      ...options.header,
    }
    const token = uni.getStorageSync('token')
    if (token && typeof token === 'string' && token.length > 0) {
      options.header.Authorization = token
    }
  },
}

// 拦截 request 请求
uni.addInterceptor('request', httpInterceptor)
// 拦截 uploadFile 文件上传
uni.addInterceptor('uploadFile', httpInterceptor)
