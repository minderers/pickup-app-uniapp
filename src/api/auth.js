import { http } from '@/utils/http'

export const sendSms = (phone) => http({ url: `common/sendSms?phone=${encodeURIComponent(phone)}`, method: 'POST' })
export const loginByPhone = (phone, code) =>
  http({ url: `auth/login?phone=${encodeURIComponent(phone)}&code=${encodeURIComponent(code)}`, method: 'POST' })
export const logout = () => http({ url: 'auth/logout', method: 'POST' })
