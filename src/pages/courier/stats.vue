<template>
  <view class="p-6">
    <view class="bg-white rounded-2xl p-6 shadow-sm mb-4">
      <view class="flex items-center justify-between">
        <view class="text-16 font-semibold">画像数据</view>
        <text class="text-xs px-3 py-1 rounded-full bg-primary bg-opacity-10 text-primary">代取员</text>
      </view>
      <view class="text-xs text-gray-500 mt-2">用于辅助优化接单偏好（示例：以价格均值作为匹配得分）</view>
      <view class="mt-5 flex items-center justify-between">
        <view class="text-gray-600">平均匹配得分</view>
        <view class="text-22 font-bold text-primary">{{ fmt(info.avgMatchScore) }}</view>
      </view>
    </view>

    <view class="bg-white rounded-2xl p-6 shadow-sm">
      <view class="text-15 font-semibold mb-4">高价值订单记录</view>
      <view v-if="(info.highValueOrders || []).length" class="space-y-3">
        <view class="p-4 rounded-xl bg-gray-50" v-for="o in info.highValueOrders" :key="o.pkId">
          <view class="text-14 text-gray-800 line-clamp-2">{{ o.content }}</view>
          <view class="flex items-center justify-between mt-3">
            <text class="text-xs text-gray-500">订单 #{{ o.pkId }}</text>
            <text class="text-16 font-bold text-primary">¥{{ o.price || 0 }}</text>
          </view>
        </view>
      </view>
      <view class="list-empty" v-else>暂无记录</view>
    </view>
  </view>
</template>
<script>
import { getCourierStats } from '@/api/courier'
export default {
  data() {
    return { info: {} }
  },
  async onShow() {
    const { data } = await getCourierStats()
    this.info = data || {}
  },
  methods: {
    fmt(v) {
      const n = Number(v)
      if (!Number.isFinite(n)) return '0'
      return n.toFixed(2)
    },
  },
}
</script>
<style></style>
