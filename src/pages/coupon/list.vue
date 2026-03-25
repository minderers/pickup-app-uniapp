<template>
  <view class="min-h-screen bg-gray-50 pb-24">
    <view class="bg-white px-6 py-5 flex items-center justify-between sticky top-0 z-50">
      <view class="text-18 font-bold text-gray-800">我的优惠券</view>
      <view class="flex items-center gap-3">
        <view class="text-xs text-gray-400">{{
          coupons.length ? coupons.length + '张' : '暂无'
        }}</view>
        <button class="bg-primary text-white text-xs px-3 py-1.5 rounded-full m-0" @tap="toVip">
          领取优惠券
        </button>
      </view>
    </view>

    <view class="px-6 mt-4">
      <view v-if="coupons.length" class="space-y-4">
        <view
          v-for="c in coupons"
          :key="c.id"
          class="rounded-2xl p-5 shadow-sm"
          :class="cardCls(c.discount, c.status)"
        >
          <view class="flex items-start justify-between">
            <view class="flex-1">
              <view class="text-[16px] font-bold" :class="titleCls(c.status)">{{ c.name }}</view>
              <view class="text-xs mt-1" :class="subCls(c.status)"
                >有效期至：{{ String(c.endTime || '').slice(0, 10) }}</view
              >
              <view class="text-xs mt-1" :class="subCls(c.status)"
                >状态：{{ statusText(c.status) }}</view
              >
            </view>
            <view class="text-right">
              <view class="text-24 font-extrabold" :class="amountCls(c.status)"
                >¥{{ Number(c.discount || 0).toFixed(0) }}</view
              >
              <view class="text-[10px] mt-1" :class="subCls(c.status)"
                >面额：¥{{ Number(c.discount || 0).toFixed(2) }}</view
              >
            </view>
          </view>
        </view>
      </view>
      <view v-else class="text-center text-gray-400 text-sm">暂无优惠券</view>
    </view>
  </view>
</template>
<script>
import { getMyCoupons, getInterestDetail } from '@/api/order'
export default {
  data() {
    return { coupons: [] }
  },
  async onShow() {
    await this.loadCoupons()
  },
  methods: {
    async loadCoupons() {
      try {
        const { data } = await getMyCoupons()
        const list = Array.isArray(data) ? data : []
        const details = await Promise.all(
          list.map((x) =>
            getInterestDetail(x.interestId)
              .then((res) => res.data)
              .catch(() => null),
          ),
        )
        this.coupons = list.map((x, i) => {
          const d = details[i]
          return {
            id: x.pkId,
            name: d?.name || '优惠券',
            discount: d?.price || 0,
            endTime: x.endTime,
            status: x.status,
          }
        })
      } catch (e) {
        this.coupons = []
      }
    },
    toVip() {
      uni.navigateTo({ url: '/pages/vip/index' })
    },
    statusText(s) {
      if (s === 1) return '已使用'
      if (s === 2) return '已过期'
      return '未使用'
    },
    cardCls(amount, status) {
      const base = 'bg-white'
      if (status === 2) return base + ' opacity-60'
      if (amount >= 5) return 'bg-green-50'
      if (amount >= 2) return 'bg-purple-50'
      return 'bg-blue-50'
    },
    titleCls(status) {
      return status === 2 ? 'text-gray-500' : 'text-gray-800'
    },
    subCls(status) {
      return status === 2 ? 'text-gray-400' : 'text-gray-500'
    },
    amountCls(status) {
      return status === 2 ? 'text-gray-500' : 'text-primary'
    },
  },
}
</script>
<style></style>
