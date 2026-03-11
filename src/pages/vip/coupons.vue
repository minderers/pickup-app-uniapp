<template>
  <view class="pb-20">
    <view class="bg-white p-6 shadow-sm">
      <view class="text-[18px] font-semibold text-gray-800">优惠券</view>
      <view class="flex gap-6 mt-4 border-b border-gray-100">
        <view :class="tabCls(tab==='usable')" @tap="setTab('usable')">可用</view>
        <view :class="tabCls(tab==='used')" @tap="setTab('used')">已使用</view>
        <view :class="tabCls(tab==='expired')" @tap="setTab('expired')">已过期</view>
      </view>
    </view>

    <view class="p-6 space-y-4">
      <view v-for="c in displayList" :key="c.pkId" class="rounded-xl p-5 text-white" :class="couponBg(c)">
        <view class="flex justify-between items-start">
          <view>
            <view class="text-2xl font-bold">权益券</view>
            <view class="text-sm opacity-80 mt-1">#{{ c.interestId }}</view>
          </view>
          <text class="text-xs bg-white/20 px-3 py-1 rounded-full">{{ badgeText(c) }}</text>
        </view>
        <view class="mt-4 pt-4 border-t border-white/20">
          <view class="text-xs opacity-80">有效期至：{{ c.endTime || '-' }}</view>
        </view>
      </view>

      <button class="w-full py-4 border border-dashed border-gray-300 text-gray-500 rounded-lg" @tap="claim">
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
      if (id % 3 === 2) return 'bg-gradient-to-r from-secondary to-green-400'
      return 'bg-gradient-to-r from-accent to-orange-400'
    },
    badgeText(c) {
      if (this.tab === 'usable') return '可用'
      if (this.tab === 'used') return '已使用'
      if (this.tab === 'expired') return '已过期'
      return c.status === 0 ? '可用' : '不可用'
    },
    claim() {
      uni.showToast({ icon: 'none', title: '设计稿占位：领取优惠券待后端接口' })
    },
  },
}
</script>
<style></style>
