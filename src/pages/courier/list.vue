<template>
  <view class="min-h-screen bg-gray-50 pb-32">
    <!-- 顶部导航栏 -->
    <view
      class="bg-white px-6 pt-12 pb-4 sticky top-0 z-50 flex items-center justify-between shadow-sm"
    >
      <view class="flex items-center gap-4" @tap="back">
        <image class="svg" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />
      </view>
      <view class="text-18 font-bold text-gray-800">我的接单</view>
      <view class="w-10"></view>
    </view>

    <!-- 状态筛选 -->
    <view class="bg-white px-6 py-4 sticky top-20 z-40 shadow-sm">
      <view class="flex gap-3 overflow-x-auto">
        <view
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
            status === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600',
          ]"
          @tap="setStatus(null)"
        >
          全部
        </view>
        <view
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
            status === 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600',
          ]"
          @tap="setStatus(2)"
        >
          进行中
        </view>
        <view
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
            status === 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600',
          ]"
          @tap="setStatus(3)"
        >
          已完成
        </view>
      </view>
    </view>

    <view class="p-6 space-y-6">
      <view v-if="list.length" class="space-y-6">
        <view class="bg-white rounded-3xl p-6 shadow-sm" v-for="o in list" :key="o.pkId">
          <view class="flex items-center justify-between mb-6">
            <text class="text-xs text-gray-400">订单编号：{{ orderNo(o) }}</text>
            <text class="text-xs px-3 py-1 rounded-lg" :class="chipCls(o.status)">{{
              statusText(o.status)
            }}</text>
          </view>

          <view class="flex items-start gap-4 mb-6">
            <view class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <image class="svg" mode="aspectFit" :src="guessIcon(o.orderType)" />
            </view>
            <view class="flex-1">
              <view class="flex justify-between items-center mb-2">
                <view class="text-16 font-bold text-gray-800">{{ o.orderType || '' }}</view>
                <view class="text-18 font-bold text-primary">¥{{ o.price || 0 }}</view>
              </view>
              <view class="space-y-1">
                <view class="text-xs text-gray-400 flex">
                  <text class="shrink-0">取件地点：</text>
                  <text class="text-gray-600 line-clamp-1">{{ pickFrom(o.content) }}</text>
                </view>
                <view class="text-xs text-gray-400 flex">
                  <text class="shrink-0">送达地点：</text>
                  <text class="text-gray-600 line-clamp-1">{{ deliverTo(o.content) }}</text>
                </view>
              </view>
            </view>
          </view>

          <view class="flex justify-between items-center pt-4 border-t border-gray-50">
            <view class="flex items-center gap-2">
              <image class="svg rounded-full bg-gray-100" mode="aspectFill" :src="publisherAvatar(o)" />
              <text class="text-xs text-gray-500">{{ publisherName(o) }}</text>
            </view>
            <button
              class="bg-primary text-white text-xs px-8 py-2 rounded-full m-0"
              @tap="toDetail(o.pkId)"
            >
              查看详情
            </button>
          </view>
        </view>
      </view>
      <view class="list-empty" v-else>暂无接单</view>
    </view>
  </view>
</template>
<script>
import { getMyCourierOrders } from '@/api/courier'

export default {
  data() {
    return { status: null, list: [] }
  },
  async onShow() {
    await this.load()
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    async load() {
      const p = { page: 1, size: 20 }
      if (this.status !== null) p.status = this.status
      const { data } = await getMyCourierOrders(p)
      this.list = data.list || []
    },
    async setStatus(s) {
      this.status = s
      await this.load()
    },
    toDetail(id) {
      uni.navigateTo({ url: '/pages/orders/detail?id=' + id })
    },
    statusText(s) {
      const status = Number(s)
      if (status === 2) return '进行中'
      if (status === 3) return '已完成'
      return '未知'
    },
    chipCls(s) {
      const status = Number(s)
      if (status === 2) return 'bg-purple-50 text-purple-500'
      if (status === 3) return 'bg-green-50 text-green-500'
      return 'bg-gray-50 text-gray-400'
    },
    guessIcon(orderType) {
      const t = String(orderType || '')
      if (t.includes('外卖')) return 'https://unpkg.com/lucide-static@latest/icons/coffee.svg'
      if (t.includes('超市') || t.includes('代购')) return 'https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg'
      return 'https://unpkg.com/lucide-static@latest/icons/package.svg'
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
    orderNo(o) {
      const id = Number(o?.pkId || 0)
      return `202405${String(id).padStart(5, '0')}`
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
