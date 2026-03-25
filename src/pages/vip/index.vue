<template>
  <view class="min-h-screen bg-gray-50 pb-24">
    <view class="bg-white px-6 py-5 flex items-center justify-between sticky top-0 z-50">
      <view class="text-18 font-bold text-gray-800">会员中心</view>
      <view class="text-xs text-gray-400" v-if="status">
        <text v-if="status.isVip === 1">到期：{{ String(status.vipTime || '').slice(0, 10) }}</text>
        <text v-else>未开通</text>
      </view>
    </view>

    <view class="px-6 mt-4">
      <view class="bg-white rounded-2xl p-5 shadow-sm">
        <view class="text-sm text-gray-500 mb-3 font-medium">会员权益</view>
        <view class="flex flex-wrap gap-2">
          <text class="px-3 py-1 rounded-full bg-purple-50 text-purple-500 text-xs"
            >每月小额优惠券礼包</text
          >
          <text class="px-3 py-1 rounded-full bg-blue-50 text-blue-500 text-xs">下单支持抵扣</text>
          <text class="px-3 py-1 rounded-full bg-green-50 text-green-500 text-xs"
            >券有效期1个月</text
          >
        </view>
      </view>
    </view>

    <view class="px-6 mt-4">
      <view class="text-18 font-bold text-gray-800 mb-3">可开通套餐</view>
      <view v-if="products.length" class="space-y-4">
        <view class="bg-white rounded-2xl p-5 shadow-sm" v-for="p in products" :key="p.pkId">
          <view class="flex items-start justify-between mb-3">
            <view>
              <view class="text-[16px] font-bold text-gray-800">{{ p.name }}</view>
              <view class="text-xs text-gray-500 mt-1">有效期：{{ p.duration }}天</view>
            </view>
            <view class="text-right">
              <view class="text-18 font-bold text-primary">¥{{ p.price }}</view>
              <view class="text-[10px] text-gray-400 mt-1">购买后自动发券</view>
            </view>
          </view>

          <view v-if="(p._interestDisplay || []).length" class="space-y-2 mb-4">
            <view class="text-sm text-gray-500 font-medium">本次发放</view>
            <view class="flex flex-wrap gap-2">
              <view
                v-for="txt in p._interestDisplay"
                :key="txt"
                class="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
              >
                {{ txt }}
              </view>
            </view>
          </view>

          <view class="flex items-center justify-between pt-4 border-t border-gray-50">
            <button
              class="bg-primary text-white text-xs px-3 py-2 rounded-full"
              @tap="open(p.pkId)"
            >
              立即开通
            </button>
          </view>
        </view>
      </view>
      <view v-else class="text-center text-gray-400 text-sm">暂无可开通套餐</view>
    </view>
  </view>
</template>
<script>
import { getVipProducts, getVipStatus, openVip, getInterestDetail } from '@/api/order'
export default {
  data() {
    return { products: [], status: null, loading: false }
  },
  async onShow() {
    await this.loadStatus()
    await this.loadProducts()
  },
  methods: {
    async loadStatus() {
      try {
        const { data } = await getVipStatus()
        this.status = data || null
      } catch (e) {
        this.status = null
      }
    },
    async loadProducts() {
      try {
        const { data } = await getVipProducts()
        const list = Array.isArray(data) ? data : []
        // enrich interest with price for display: "¥price × amount张"
        for (const p of list) {
          let entries = []
          try {
            entries = JSON.parse(String(p.interest || '[]'))
          } catch (e) {
            entries = []
          }
          const details = await Promise.all(
            entries.map((x) =>
              getInterestDetail(x.id)
                .then((res) => res.data)
                .catch(() => null),
            ),
          )
          p._interestDisplay = entries.map((x, i) => {
            const d = details[i]
            const price = d?.price != null ? Number(d.price) : 0
            const amount = Number(x.amount || 1)
            const name = d?.name || '优惠券'
            return `${name} ¥${price} × ${amount}张`
          })
        }
        this.products = list
      } catch (e) {
        this.products = []
      }
    },
    async open(vipId) {
      if (this.loading) return
      this.loading = true
      try {
        await openVip(vipId)
        uni.showToast({ title: '开通成功', icon: 'success' })
        await this.loadStatus()
      } catch (e) {
        uni.showToast({ title: '开通失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<style></style>
