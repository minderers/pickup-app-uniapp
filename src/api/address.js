import { http } from '@/utils/http'
export const listAddress = () => http({ url: 'address/list', method: 'GET' })
export const addAddress = (data) => http({ url: 'address', method: 'POST', data })
export const updateAddress = (id, data) => http({ url: `address/${id}`, method: 'PUT', data })
export const removeAddress = (id) => http({ url: `address/${id}`, method: 'DELETE' })
export const getAddress = async (id) => {
  const { data } = await listAddress()
  return (data || []).find((x) => x.pkId === id)
}
