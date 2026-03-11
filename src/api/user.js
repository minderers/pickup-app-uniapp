import { http } from '@/utils/http'

export const getProfile = () => http({ url: 'user/profile', method: 'GET' })
export const updateProfile = (data) => http({ url: 'user/profile', method: 'PUT', data })
export const getPortrait = () => http({ url: 'user/portrait', method: 'GET' })
