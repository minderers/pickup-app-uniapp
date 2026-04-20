<template>
  <view class="min-h-screen bg-gray-50 pb-32">
    <view class="p-6">
      <view v-if="list.length" class="space-y-6">
        <view class="bg-white rounded-3xl p-6 shadow-sm" v-for="o in list" :key="o.pkId">
          <view class="flex justify-between items-start mb-6">
              <view class="flex items-center gap-3">
              <view class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <image class="svg" mode="aspectFit" :src="guessIcon(o.orderType)" />
              </view>
              <view class="text-16 font-bold text-gray-800">{{ o.orderType || '快递代取' }}</view>
              <text class="text-[10px] px-2 py-0.5 rounded ml-1" :class="matchChipCls(o)">{{ o.matchScore || 0 }}分</text>
            </view>
            <view class="text-right">
              <view class="text-18 font-bold text-primary">¥{{ o.price || 0 }}</view>
              <view class="text-[10px] text-gray-400 mt-1">{{ etaText(o.duration) }}</view>
            </view>
          </view>

          <view class="space-y-2 mb-6">
            <view class="text-xs text-gray-500 flex">
              <text class="shrink-0">取件地点：</text>
              <text class="text-gray-700">{{ pickFrom(o.content) }}</text>
            </view>
            <view class="text-xs text-gray-500 flex">
              <text class="shrink-0">送达地点：</text>
              <text class="text-gray-700">{{ deliverTo(o.content) }}</text>
            </view>
          </view>

          <view class="mb-6">
            <view class="text-xs text-gray-400 leading-relaxed">
              <text>推荐理由：</text>
              <text>{{ o.recommendationReason || '' }}</text>
            </view>
          </view>

          <view class="flex justify-between items-center pt-4 border-t border-gray-50">
            <view class="flex items-center gap-2">
              <image class="svg rounded-full bg-gray-100" mode="aspectFill" :src="publisherAvatar(o)" />
              <text class="text-xs text-gray-500">{{ publisherName(o) }}</text>
            </view>
            <button
              class="bg-primary text-white text-xs px-8 py-2 rounded-full m-0"
              @tap="accept(o.pkId)"
            >
              接取
            </button>
          </view>
        </view>
      </view>
      <view class="list-empty" v-else>暂无待接订单</view>
    </view>
  </view>
</template>

<script>
import { getWaitingOrders, acceptOrder } from '@/api/courier'

export default {
  data() {
    return {
      list: [],
    }
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
    guessIcon(orderType) {
      const t = String(orderType || '')
      if (t.includes('外卖')) return 'https://unpkg.com/lucide-static@latest/icons/coffee.svg'
      if (t.includes('超市') || t.includes('代购')) return 'https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg'
      return 'https://unpkg.com/lucide-static@latest/icons/package.svg'
    },
    etaText(d) {
      const n = Number(d)
      if (!Number.isFinite(n) || n <= 0) return '30分钟内'
      return `${n}分钟内`
    },
    matchChipText(o) {
      const p = Number(o?.price || 0)
      return p >= 5 ? '类型匹配' : '距离匹配'
    },
    matchChipCls(o) {
      const s = Number(o?.matchScore || 0)
      return s >= 80 ? 'text-purple-500 bg-purple-50' : 'text-green-500 bg-green-50'
    },
    pickFrom(content) {
      const c = String(content || '')
      const m = c.match(/取件地点[:：]\s*([^|]+)/)
      return (m?.[1] || '校门口快递柜').trim()
    },
    deliverTo(content) {
      const c = String(content || '')
      const m = c.match(/送达地点[:：]\s*([^|]+)/)
      return (m?.[1] || '学生宿舍3栋').trim()
    },
    publisherAvatar(order) {
      return order?.publisherAvatar || 'https://unpkg.com/lucide-static@latest/icons/user.svg'
    },
    publisherName(order) {
      return order?.publisherNickname || '发布者'
    },
  },
}
</script>

<style></style>
