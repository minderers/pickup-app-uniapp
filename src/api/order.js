import { http } from '@/utils/http'

export const createOrder = (data) => http({ url: 'order/create', method: 'POST', data })
export const payOrder = (id) => http({ url: `order/pay/${id}`, method: 'POST' })
export const getOrderList = (params) => http({ url: 'order/list', method: 'GET', data: params })
export const getOrderDetail = (id) => http({ url: `order/${id}`, method: 'GET' })
export const getRecommend = (type) =>
  http({ url: 'order/recommend', method: 'GET', data: { type } })
export const getOrderProgress = (id) => http({ url: `order/progress/${id}`, method: 'GET' })
export const cancelOrder = (id) => http({ url: `order/cancel/${id}`, method: 'PUT' })
export const acceptOrder = (id) => http({ url: `order/${id}/accept`, method: 'POST' })
export const getAvailableOrders = (params) =>
  http({ url: 'order/available', method: 'GET', data: params })
export const getMyPublishedOrders = (params) =>
  http({ url: 'order/my-published', method: 'GET', data: params })
export const getMyAcceptedOrders = (params) =>
  http({ url: 'order/my-accepted', method: 'GET', data: params })
export const completeOrder = (id) => http({ url: `order/complete/${id}`, method: 'PUT' })
export const reviewOrder = (id, data) => http({ url: `order/${id}/review`, method: 'POST', data })
export const getOrderStats = () => http({ url: 'order/stats', method: 'GET' })
export const getMyCoupons = () => http({ url: 'vip/my-coupons', method: 'GET' })
export const getCouponDetail = (id) => http({ url: `vip/coupon/${id}`, method: 'GET' })
export const getVipProducts = () => http({ url: 'vip/products', method: 'GET' })
export const getVipStatus = () => http({ url: 'vip/status', method: 'GET' })
export const openVip = (vipId) =>
  http({ url: `vip/open?vipId=${encodeURIComponent(vipId)}`, method: 'POST' })
export const getInterestDetail = (id) => http({ url: `vip/interest/${id}`, method: 'GET' })
