import { http } from '@/utils/http'

export const getNewsList = (params) => http({ url: 'news/list', method: 'GET', data: params })
export const getNewsDetail = (id) => http({ url: `news/${id}`, method: 'GET' })
