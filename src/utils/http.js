import { useUserStore } from '@/stores/user'
// 这里也可以根据实际情况修改成线上接口地址
const baseURL = 'http://localhost:8088/pickup-app-api/'
let isHandlingAuthError = false

const joinURL = (base, url) => {
  if (typeof url !== 'string' || url.length === 0) return base
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  // 避免 baseURL 末尾 / 和 url 开头 / 造成的双斜杠问题
  const b = String(base || '').replace(/\/+$/, '')
  const u = String(url).replace(/^\/+/, '')
  return `${b}/${u}`
}

export const http = (options) => {
  const normalizedOptions = {
    ...options,
    // uni.request/unqi.addInterceptor 内部对 header 有时不会自动兜底
    header: { ...(options?.header || {}) },
    silentToast: Boolean(options?.silentToast),
  }

  // 1) 统一补齐 url/timeout/header，避免依赖拦截器时机导致“刷新后首个请求拿不到 token”
  normalizedOptions.url = joinURL(baseURL, normalizedOptions.url)
  normalizedOptions.timeout = normalizedOptions.timeout || 10000

  const token = uni.getStorageSync('token')
  if (typeof token === 'string' && token.length > 0) {
    normalizedOptions.header.Authorization = token
  }

  // 定义统一的登出跳转逻辑
  const handleAuthError = () => {
    if (isHandlingAuthError) return
    isHandlingAuthError = true

    const userStore = useUserStore()
    userStore.clearUserInfo()

    uni.showToast({
      icon: 'none',
      title: '登录已过期，请重新登录',
      duration: 1500,
    })

    setTimeout(() => {
      uni.reLaunch({ url: '/pages/login/login' })
      isHandlingAuthError = false
    }, 1500)
  }

  // 1. 返回 Promise 对象
  return new Promise((resolve, reject) => {
    const { silentToast, ...requestOptions } = normalizedOptions
    // Debug：定位后端路由是否命中
    // eslint-disable-next-line no-console
    console.log('[http] request', requestOptions.method || 'GET', requestOptions.url)
    uni.request({
      ...requestOptions,
      // 响应成功
      success(res) {
        const shouldToast = !silentToast
        // 1. 业务级 401 拦截 (当 HTTP 状态码为 200 时)
        if (res.data && (res.data.code === 401 || res.data.code === 1001)) {
          handleAuthError()
          return reject(res)
        }

        // 2. 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.code !== 0) {
            // 根据后端错误信息轻提示
            if (shouldToast) {
              uni.showToast({
                icon: 'error',
                title: res.data.msg || '请求错误',
              })
            }
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
          if (shouldToast) {
            uni.showToast({
              icon: 'none',
              title: res.data?.msg || '请求错误',
            })
          }
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        if (!silentToast) {
          uni.showToast({
            icon: 'none',
            title: '网络错误，换个网络试试',
          })
        }
        reject(err)
      },
    })
  })
}
