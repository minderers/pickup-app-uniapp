export function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return ''
  const date = new Date(dateTimeStr)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function formatOrderStatus(status) {
  switch (status) {
    case 0:
      return '待支付'
    case 1:
      return '已发布'
    case 2:
      return '已截单'
    case 3:
      return '已完成'
    case 4:
      return '已取消'
    default:
      return '未知状态'
  }
}
