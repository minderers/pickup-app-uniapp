<template>
  <view class="p-6 pb-24">
    <view class="bg-white rounded-2xl p-4 shadow-sm mb-4 flex items-center justify-between">
      <view class="text-[18px] font-semibold text-gray-800">待接订单</view>
      <button class="text-gray-600" size="mini" @tap="onFilter">
        <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/filter.svg" />
      </button>
    </view>

    <view v-if="list.length" class="space-y-4">
      <view class="bg-white rounded-2xl p-5 shadow-sm" v-for="o in list" :key="o.pkId">
        <view class="flex items-start justify-between">
          <view class="flex-1 pr-3">
            <view class="flex items-center gap-2 mb-2">
              <view class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <image class="w-4 h-4" src="https://unpkg.com/lucide-static@latest/icons/package.svg" />
              </view>
              <view class="font-medium text-gray-800">{{ guessType(o.content) }}</view>
              <text class="text-xs px-2 py-0.5 rounded" :class="matchChipCls(o)">{{ matchChipText(o) }}</text>
            </view>
            <view class="text-xs text-gray-600 mb-1 line-clamp-1">取件地点：{{ pickFrom(o.content) }}</view>
            <view class="text-xs text-gray-600 mb-1 line-clamp-1">送达地点：{{ deliverTo(o.content) }}</view>
            <view class="mt-2">
              <text class="text-xs text-gray-500"
                >推荐理由：{{ reasonText(o) }}</text
              >
            </view>
          </view>
          <view class="text-right">
            <view class="text-lg font-bold text-primary">¥{{ o.price || 0 }}</view>
            <view class="text-xs text-gray-500 mt-1">{{ etaText(o.duration) }}</view>
          </view>
        </view>

        <view class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <view class="flex items-center gap-2">
            <image class="w-5 h-5 rounded-full bg-gray-100" :src="avatarFallback(o.userId)" />
            <text class="text-xs text-gray-500">同学{{ alpha(o.userId) }}</text>
          </view>
          <button class="px-4 py-1.5 bg-primary text-white text-xs rounded-full" @tap="accept(o.pkId)">接取</button>
        </view>
      </view>
    </view>
    <view class="list-empty" v-else>暂无待接订单</view>
  </view>
</template>
<script>
import { getWaitingOrders, acceptOrder } from '@/api/courier'
export default {
  data() {
    return { list: [] }
  },
  async onShow() {
    const { data } = await getWaitingOrders({ page: 1, size: 20 })
    this.list = data.list || []
  },
  methods: {
    async accept(id) {
      await acceptOrder(id)
      uni.showToast({ title: '接单成功' })
      const { data } = await getWaitingOrders({ page: 1, size: 20 })
      this.list = data.list || []
    },
    onFilter() {
      uni.showToast({ icon: 'none', title: '设计稿占位：可扩展筛选条件' })
    },
    guessType(content) {
      const c = String(content || '')
      if (c.includes('外卖')) return '外卖代取'
      if (c.includes('超市') || c.includes('代购')) return '超市代购'
      return '快递代取'
    },
    etaText(d) {
      const n = Number(d)
      if (!Number.isFinite(n) || n <= 0) return '尽快送达'
      if (n <= 180) return `${n}分钟内`
      return `${n}分钟内`
    },
    matchChipText(o) {
      const p = Number(o?.price || 0)
      return p >= 5 ? '价格匹配' : '距离匹配'
    },
    matchChipCls(o) {
      const p = Number(o?.price || 0)
      return p >= 5 ? 'text-purple-500 bg-purple-50' : 'text-green-500 bg-green-50'
    },
    reasonText(o) {
      const p = Number(o?.price || 0)
      if (p >= 5) return '符合您的接单偏好，预估收益较高'
      return '距离您当前位置较近，取送更高效'
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
    avatarFallback(uid) {
      const u = Number(uid || 0)
      return u % 2 === 0
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    },
    alpha(uid) {
      const u = Number(uid || 0)
      const list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      return list[(u || 1) % list.length]
    },
  },
}
</script>
<style></style>
