import { http } from '@/utils/http'

export const getWaitingOrders = (params) =>
  http({ url: 'courier/orders/waiting', method: 'GET', data: params })
export const acceptOrder = (id) => http({ url: `courier/orders/${id}/accept`, method: 'POST' })
export const getMyCourierOrders = (params) =>
  http({ url: 'courier/orders/list', method: 'GET', data: params })
export const getCourierStats = () => http({ url: 'courier/profile/stats', method: 'GET' })
export const applyCourier = () => http({ url: 'courier/apply', method: 'POST' })
export const getApplyStatus = () => http({ url: 'courier/apply/status', method: 'GET' })
