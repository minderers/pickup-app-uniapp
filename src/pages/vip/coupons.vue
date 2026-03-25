<template>
  <view class="pb-20">
    <view class="bg-white p-6 shadow-sm sticky top-0 z-10">
      <view class="text-18 font-semibold text-gray-800">优惠券</view>
      <view class="flex gap-6 mt-4 border-b border-gray-100">
        <view :class="tabCls(tab==='usable')" @tap="setTab('usable')">可用</view>
        <view :class="tabCls(tab==='used')" @tap="setTab('used')">已使用</view>
        <view :class="tabCls(tab==='expired')" @tap="setTab('expired')">已过期</view>
      </view>
    </view>

    <view class="p-6 space-y-4">
      <view v-for="c in displayList" :key="c.pkId" class="rounded-2xl p-6 text-white shadow-lg" :class="couponBg(c)">
        <view class="flex justify-between items-start mb-4">
          <view>
            <view class="text-24 font-bold">权益券</view>
            <view class="text-sm opacity-80 mt-1">#{{ c.interestId }}</view>
          </view>
          <text class="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">{{ badgeText(c) }}</text>
        </view>

        <view class="bg-white bg-opacity-10 rounded-xl p-4 mb-4">
          <view class="text-sm opacity-90 mb-2">权益描述</view>
          <view class="text-xs opacity-80">享受平台专属优惠和权益</view>
        </view>

        <view class="flex justify-between items-end">
          <view class="text-xs opacity-80">有效期至：{{ formatDate(c.endTime) }}</view>
          <button
            v-if="tab === 'usable'"
            class="bg-white text-primary px-4 py-2 rounded-full text-xs font-medium m-0"
            @tap="useCoupon(c.pkId)"
          >
            立即使用
          </button>
        </view>
      </view>

      <button
        v-if="tab === 'usable'"
        class="w-full py-4 border border-dashed border-gray-300 text-gray-500 rounded-lg mt-6"
        @tap="claim"
      >
        + 领取优惠券
      </button>

      <view class="list-empty" v-if="!displayList.length">暂无优惠券</view>
    </view>
  </view>
</template>
<script>
import { getMyCoupons } from '@/api/vip'
export default {
  data() {
    return { list: [], tab: 'usable' }
  },
  async onShow() {
    const { data } = await getMyCoupons()
    this.list = data || []
  },
  computed: {
    displayList() {
      const l = this.list || []
      if (this.tab === 'usable') return l.filter((x) => x.status === 0)
      if (this.tab === 'used') return l.filter((x) => x.status === 1)
      if (this.tab === 'expired') return l.filter((x) => x.status === 2)
      return l
    },
  },
  methods: {
    setTab(t) {
      this.tab = t
    },
    tabCls(active) {
      return [
        'text-sm font-medium pb-3',
        active ? 'text-primary border-b-2 border-primary' : 'text-gray-500',
      ]
    },
    couponBg(c) {
      const id = Number(c?.interestId || 0)
      if (id % 3 === 1) return 'bg-gradient-to-r from-primary to-purple-600'
      if (id % 3 === 2) return 'bg-gradient-to-r from-green-400 to-emerald-500'
      return 'bg-gradient-to-r from-orange-400 to-red-500'
    },
    badgeText(c) {
      if (this.tab === 'usable') return '可用'
      if (this.tab === 'used') return '已使用'
      if (this.tab === 'expired') return '已过期'
      return c.status === 0 ? '可用' : '不可用'
    },
    formatDate(t) {
      if (!t) return '-'
      return String(t).slice(0, 10)
    },
    useCoupon(id) {
      uni.showToast({ title: '优惠券已应用到订单', icon: 'success' })
      // 实际应用中可以保存到本地或发送到后端
    },
    claim() {
      uni.showToast({ icon: 'none', title: '暂无可领取的优惠券' })
    },
  },
}
</script>
<style></style>
