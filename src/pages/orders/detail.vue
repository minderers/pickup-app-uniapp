<template>
  <view class="pb-20">
    <!-- 顶部状态区（主色） -->
    <view class="bg-primary text-white p-6">
      <view class="text-18 font-semibold mb-3">{{ guessType(info.content) }}</view>
      <view class="flex items-center gap-2">
        <text class="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">{{
          statusText(info.status)
        }}</text>
        <text class="text-sm opacity-90">{{ etaHint(info.duration, info.status) }}</text>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="p-6 space-y-4">
      <view class="bg-white rounded-2xl p-5 shadow-sm">
        <view class="text-sm font-medium text-gray-500 mb-4">订单信息</view>
        <view class="space-y-3">
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">订单编号</text>
            <text class="text-sm text-gray-800">#{{ info.pkId || '-' }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">发布时间</text>
            <text class="text-sm text-gray-800">{{ info.createTime || '-' }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">取件时间</text>
            <text class="text-sm text-gray-800">{{ pickupTime(info.content) }}</text>
          </view>
        </view>
      </view>

      <view class="bg-white rounded-2xl p-5 shadow-sm">
        <view class="text-sm font-medium text-gray-500 mb-4">服务信息</view>
        <view class="space-y-3">
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">取件地点</text>
            <text class="text-sm text-gray-800">{{ pickFrom(info.content) }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">送达地点</text>
            <text class="text-sm text-gray-800">{{ deliverTo(info.content) }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">报酬金额</text>
            <text class="text-sm font-bold text-primary">¥{{ info.price || 0 }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">备注信息</text>
            <text class="text-sm text-gray-800">{{ remark(info.content) }}</text>
          </view>
        </view>
      </view>

      <view class="bg-white rounded-2xl p-5 shadow-sm">
        <view class="text-sm font-medium text-gray-500 mb-4">接取人信息</view>
        <view class="flex items-center gap-3">
          <image class="w-12 h-12 rounded-full bg-gray-100" :src="pickerAvatar(info.pickerId)" />
          <view>
            <view class="font-medium text-gray-800">{{ pickerName(info.pickerId) }}</view>
            <view class="text-xs text-gray-500"
              >已完成{{ pickerDone(info.pickerId) }}单，好评率{{ pickerRate(info.pickerId) }}%</view
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { getOrderDetail } from '@/api/order'
import { orderStatusText, orderStatusChipClass } from '@/utils/order'
export default {
  data() {
    return { info: {}, step: 0 }
  },
  async onLoad(q) {
    const { data } = await getOrderDetail(q.id)
    this.info = data || {}
    this.step = Number(this.info.status || 0)
  },
  methods: {
    statusText(s) {
      return orderStatusText(s)
    },
    chipCls(s) {
      return orderStatusChipClass(s)
    },
    guessType(content) {
      const c = String(content || '')
      if (c.includes('外卖')) return '外卖代取'
      if (c.includes('超市') || c.includes('代购')) return '超市代购'
      return '快递代取'
    },
    pickFrom(content) {
      const c = String(content || '')
      const m = c.match(/取件地点[:：]\s*([^|]+)/)
      return (m?.[1] || '—').trim()
    },
    deliverTo(content) {
      const c = String(content || '')
      const m = c.match(/送达地点[:：]\s*([^|]+)/)
      return (m?.[1] || '—').trim()
    },
    pickupTime(content) {
      const c = String(content || '')
      const m = c.match(/取件时间[:：]\s*([^|]+)/)
      return (m?.[1] || '—').trim()
    },
    remark(content) {
      const c = String(content || '')
      const m = c.match(/备注[:：]\s*([^|]+)/)
      return (m?.[1] || '—').trim()
    },
    etaHint(duration, status) {
      const s = Number(status)
      if (s === 3) return '订单已完成'
      if (s === 0) return '待支付后可进入接单流程'
      const n = Number(duration)
      if (Number.isFinite(n) && n > 0) return `预计${n}分钟内送达`
      return '预计尽快送达'
    },
    pickerAvatar(pid) {
      const p = Number(pid || 0)
      if (!p) return 'https://unpkg.com/lucide-static@latest/icons/user.svg'
      return p % 2 === 0
        ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    },
    pickerName(pid) {
      const p = Number(pid || 0)
      if (!p) return '等待接单'
      const list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      return `同学${list[p % list.length]}`
    },
    pickerDone(pid) {
      const p = Number(pid || 0)
      if (!p) return 0
      return (p % 20) + 5
    },
    pickerRate(pid) {
      const p = Number(pid || 0)
      if (!p) return 0
      return 90 + (p % 9)
    },
  },
}
</script>
<style></style>
