import { http } from '@/utils/http'

export const getVipProducts = () => http({ url: 'vip/products', method: 'GET' })
export const getVipStatus = () => http({ url: 'vip/status', method: 'GET' })
export const openVip = (vipId) => http({ url: `vip/open?vipId=${vipId}`, method: 'POST' })
export const getMyCoupons = () => http({ url: 'vip/my-coupons', method: 'GET' })
export const useCoupon = (id) => http({ url: `vip/coupon/${id}/use`, method: 'POST' })
export const getCouponDetail = (id) => http({ url: `vip/coupon/${id}`, method: 'GET' })
