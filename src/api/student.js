import { http } from '@/utils/http'

export const getPublishRecommendations = (params) => {
  return http({
    url: '/student/publish-recommendations',
    method: 'GET',
    data: params,
  })
}
