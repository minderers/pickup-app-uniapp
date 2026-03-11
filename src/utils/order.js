export function orderStatusText(status) {
  const s = Number(status)
  if (s === 0) return '待支付'
  if (s === 1) return '待接单'
  if (s === 2) return '进行中'
  if (s === 3) return '已完成'
  return '未知'
}

export function orderStatusChipClass(status) {
  const s = Number(status)
  if (s === 0) return 'bg-gray-100 text-gray-600'
  if (s === 1) return 'bg-amber-50 text-amber-600'
  if (s === 2) return 'bg-primary/10 text-primary'
  if (s === 3) return 'bg-green-50 text-green-600'
  return 'bg-gray-100 text-gray-600'
}

