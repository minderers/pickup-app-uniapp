<template>
  <view class="min-h-screen bg-gray-50 pb-32">
    <!-- 顶部导航栏 -->
    <view
      class="bg-white px-6 pt-12 pb-4 sticky top-0 z-50 flex items-center justify-between shadow-sm"
    >
      <view class="flex items-center gap-4" @tap="back">
        <image class="svg" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />
      </view>
      <view class="text-18 font-bold text-gray-800">待接订单</view>
      <view @tap="onFilter">
        <image class="svg" src="https://unpkg.com/lucide-static@latest/icons/filter.svg" />
      </view>
    </view>

    <view class="p-6">
      <view v-if="list.length" class="space-y-6">
        <view class="bg-white rounded-3xl p-6 shadow-sm" v-for="o in list" :key="o.pkId">
          <view class="flex justify-between items-start mb-6">
            <view class="flex items-center gap-3">
              <view class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <image class="svg" mode="aspectFit" :src="guessIcon(o.content)" />
              </view>
              <view class="text-16 font-bold text-gray-800">{{ guessType(o.content) }}</view>
              <text class="text-[10px] px-2 py-0.5 rounded ml-1" :class="matchChipCls(o)">{{
                matchChipText(o)
              }}</text>
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
              <text>{{ reasonText(o) }}</text>
            </view>
          </view>

          <view class="flex justify-between items-center pt-4 border-t border-gray-50">
            <view class="flex items-center gap-2">
              <image
                class="svg rounded-full bg-gray-100"
                mode="aspectFill"
                :src="avatarFallback(o.userId)"
              />
              <text class="text-xs text-gray-500">同学{{ alpha(o.userId) }}</text>
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
    back() {
      uni.navigateBack()
    },
    async accept(id) {
      await acceptOrder(id)
      uni.showToast({ title: '接单成功' })
      const { data } = await getWaitingOrders({ page: 1, size: 20 })
      this.list = data.list || []
    },
    onFilter() {
      uni.showToast({ icon: 'none', title: '展示筛选功能' })
    },
    guessType(content) {
      const c = String(content || '')
      if (c.includes('外卖')) return '外卖代取'
      if (c.includes('超市') || c.includes('代购')) return '超市代购'
      return '快递代取'
    },
    guessIcon(content) {
      const t = this.guessType(content)
      if (t === '外卖代取') return 'https://unpkg.com/lucide-static@latest/icons/coffee.svg'
      if (t === '超市代购') return 'https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg'
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
      const p = Number(o?.price || 0)
      return p >= 5 ? 'text-purple-500 bg-purple-50' : 'text-green-500 bg-green-50'
    },
    reasonText(o) {
      const p = Number(o?.price || 0)
      if (p >= 5) return '您历史接单中80%为外卖代取，经验丰富'
      return '距离您当前位置500米，符合您的接单偏好'
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
