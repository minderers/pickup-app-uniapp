import { http } from '@/utils/http'

export const createOrder = (data) => http({ url: 'order/create', method: 'POST', data })
export const payOrder = (id) => http({ url: `order/pay/${id}`, method: 'POST' })
export const getOrderList = (params) => http({ url: 'order/list', method: 'GET', data: params })
export const getOrderDetail = (id) => http({ url: `order/${id}`, method: 'GET' })
export const getRecommend = (type) =>
  http({ url: 'order/recommend', method: 'GET', data: { type } })
