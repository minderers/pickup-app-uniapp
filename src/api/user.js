import { http } from '@/utils/http'

export const getProfile = () => http({ url: 'user/profile', method: 'GET' })
export const updateProfile = (data) => http({ url: 'user/profile', method: 'PUT', data })
export const getPortrait = () => http({ url: 'user/portrait', method: 'GET' })
export const getPreference = () => http({ url: 'user/preference', method: 'GET' })
export const savePreference = (data) => http({ url: 'user/preference', method: 'PUT', data })
export const getRole = (silentToast = false) =>
  http({ url: 'user/role', method: 'GET', silentToast })
export const switchRole = (role) => http({ url: `user/role/switch?role=${role}`, method: 'POST' })
export const getUserStats = () => http({ url: 'user/stats', method: 'GET' })
