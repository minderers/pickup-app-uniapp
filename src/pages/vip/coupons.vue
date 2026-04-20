<template>
  <view class="pb-20">
    <view class="bg-white p-6 shadow-sm sticky top-0 z-10">
      <view class="text-18 font-semibold text-gray-800">优惠券</view>
      <view class="flex gap-6 mt-4 border-b border-gray-100">
        <view :class="tabCls(tab === 'usable')" @tap="setTab('usable')">可用</view>
        <view :class="tabCls(tab === 'used')" @tap="setTab('used')">已使用</view>
        <view :class="tabCls(tab === 'expired')" @tap="setTab('expired')">已过期</view>
      </view>
    </view>

    <view class="p-6 space-y-4">
      <view
        v-for="c in displayList"
        :key="c.pkId"
        class="rounded-2xl p-6 text-white shadow-lg"
        :class="couponBg(c)"
      >
        <view class="flex justify-between items-start mb-4">
          <view>
            <view class="text-24 font-bold">{{ c.name }}</view>
            <view class="text-sm opacity-80 mt-1"
              >面额：¥{{ Number(c.discount || 0).toFixed(2) }}</view
            >
          </view>
          <text class="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">{{
            badgeText(c)
          }}</text>
        </view>

        <view class="bg-white bg-opacity-10 rounded-xl p-4 mb-4">
          <view class="text-sm opacity-90 mb-2">使用说明</view>
          <view class="text-xs opacity-80"
            >本券为抵扣券，实付金额自动按面额抵扣。有效期{{ c.duration || 0 }}天。</view
          >
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

      <!-- 领取按钮已移除：改由会员页开通获得 -->

      <view class="list-empty" v-if="!displayList.length">暂无优惠券</view>
    </view>
  </view>
</template>
<script>
import { getMyCoupons, getInterestDetail } from '@/api/order'
export default {
  data() {
    return { list: [], tab: 'usable' }
  },
  async onShow() {
    try {
      const { data } = await getMyCoupons()
      const raw = Array.isArray(data) ? data : []
      const details = await Promise.all(
        raw.map((x) =>
          getInterestDetail(x.interestId)
            .then((res) => res.data)
            .catch(() => null),
        ),
      )
      this.list = raw.map((x, i) => {
        const d = details[i]
        return {
          pkId: x.pkId,
          interestId: x.interestId,
          endTime: x.endTime,
          status: x.status,
          name: d?.name || '—',
          discount: d?.price != null ? Number(d.price) : 0,
          duration: d?.duration || 0,
        }
      })
    } catch (e) {
      this.list = []
    }
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
      const amt = Number(c?.discount || 0)
      if (c.status === 2) return 'bg-gradient-to-r from-gray-400 to-gray-500'
      if (amt >= 5) return 'bg-gradient-to-r from-green-400 to-emerald-500'
      if (amt >= 2) return 'bg-gradient-to-r from-primary to-purple-600'
      return 'bg-gradient-to-r from-blue-400 to-indigo-500'
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
    },
  },
}
</script>
<style></style>
