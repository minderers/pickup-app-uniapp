<template>
  <view class="p-6">
    <view class="bg-white rounded-2xl p-4 shadow-sm mb-6 flex items-center justify-between">
      <view class="relative flex-1">
        <image
          class="w-7 h-7 absolute left-4 top-1/2"
          style="transform: translateY(-50%)"
          src="https://unpkg.com/lucide-static@latest/icons/search.svg"
        />
        <input
          class="w-full h-18 rounded-full bg-gray-100 pl-14 pr-6"
          placeholder="搜索订单、服务..."
        />
      </view>
      <button
        class="ml-4 w-18 h-18 rounded-full bg-gray-100 flex items-center justify-center"
        @tap="go('/pages/news/list')"
      >
        <image class="w-7 h-7" src="https://unpkg.com/lucide-static@latest/icons/bell.svg" />
      </button>
    </view>

    <view class="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-5 text-white mb-6">
      <view class="flex items-center justify-between">
        <view>
          <view class="text-base font-semibold">为你推荐</view>
          <view class="text-xs opacity-80 mt-1">根据你的画像与偏好智能展示</view>
        </view>
        <button
          class="btn-ghost !bg-white/15 !border-white/30 !text-white"
          size="mini"
          @tap="toPref"
        >
          调整偏好
        </button>
      </view>
      <view class="flex flex-wrap gap-2 mt-4">
        <text class="px-3 py-1 bg-white/15 rounded-full text-xs" v-for="t in prefTags" :key="t">{{
          t
        }}</text>
      </view>
    </view>

    <view class="section-title">快捷服务</view>
    <view class="grid grid-cols-4 gap-4 mb-4">
      <view class="flex flex-col items-center" @tap="go('/pages/orders/create')">
        <view class="w-22 h-22 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
          <image class="w-12 h-12" src="https://unpkg.com/lucide-static@latest/icons/package.svg" />
        </view>
        <text class="text-xs text-gray-700">快递代取</text>
      </view>
      <view class="flex flex-col items-center" @tap="go('/pages/orders/create')">
        <view class="w-22 h-22 rounded-2xl bg-secondary/10 flex items-center justify-center mb-2">
          <image class="w-12 h-12" src="https://unpkg.com/lucide-static@latest/icons/coffee.svg" />
        </view>
        <text class="text-xs text-gray-700">外卖代取</text>
      </view>
      <view class="flex flex-col items-center" @tap="go('/pages/orders/create')">
        <view class="w-22 h-22 rounded-2xl bg-accent/10 flex items-center justify-center mb-2">
          <image
            class="w-12 h-12"
            src="https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg"
          />
        </view>
        <text class="text-xs text-gray-700">超市代购</text>
      </view>
      <view class="flex flex-col items-center" @tap="go('/pages/orders/create')">
        <view class="w-22 h-22 rounded-2xl bg-purple-100 flex items-center justify-center mb-2">
          <image
            class="w-12 h-12"
            src="https://unpkg.com/lucide-static@latest/icons/more-horizontal.svg"
          />
        </view>
        <text class="text-xs text-gray-700">其他服务</text>
      </view>
    </view>

    <view class="section-title">{{ isCourier ? '推荐待接订单' : '我的最近订单' }}</view>
    <view v-if="recommend.length" class="space-y-3">
      <view class="bg-white rounded-xl p-4 shadow-sm" v-for="item in recommend" :key="item.pkId">
        <view class="flex justify-between items-start">
          <view class="flex-1 pr-3">
            <view class="text-15 font-medium">{{ item.content || '-' }}</view>
            <view class="text-xs text-gray-500 mt-2">
              ￥{{ item.price || 0 }}
              <text v-if="item.createTime"> · {{ item.createTime }}</text>
            </view>
          </view>
          <button
            v-if="isCourier"
            class="btn-primary !rounded-full !px-4 !py-1.5"
            size="mini"
            @tap="accept(item.pkId)"
          >
            接取
          </button>
          <button
            v-else
            class="btn-ghost !rounded-full !px-4 !py-1.5"
            size="mini"
            @tap="toMyOrders"
          >
            查看
          </button>
        </view>
      </view>
    </view>
    <view class="list-empty" v-else>暂无数据</view>

    <view class="flex flex-wrap gap-4 mt-6">
      <button
        class="flex-1 bg-primary text-white rounded-xl py-3"
        @tap="go('/pages/orders/create')"
      >
        发起代取
      </button>
      <button
        class="flex-1 bg-primary text-white rounded-xl py-3"
        @tap="go('/pages/courier/waiting')"
      >
        待接订单
      </button>
      <button class="flex-1 bg-primary text-white rounded-xl py-3" @tap="go('/pages/news/list')">
        公告资讯
      </button>
      <button class="flex-1 bg-primary text-white rounded-xl py-3" @tap="go('/pages/vip/index')">
        会员中心
      </button>
    </view>
  </view>
</template>
<script>
import { getRecommend, getOrderList } from '@/api/order'
import { acceptOrder } from '@/api/courier'
import { getProfile } from '@/api/user'
import { usePreferenceStore } from '@/stores/preference'
export default {
  data() {
    return { recommend: [], isCourier: false, pref: null }
  },
  async onShow() {
    this.pref = usePreferenceStore()
    const p = await getProfile()
    this.isCourier = (p.data?.role ?? 0) === 1
    if (this.isCourier) {
      const { data } = await getRecommend('picker')
      this.recommend = data || []
    } else {
      const { data } = await getOrderList({ page: 1, size: 5 })
      this.recommend = data.list || []
    }
  },
  computed: {
    prefTags() {
      const s = this.pref
      if (!s) return []
      const tags = []
      for (const t of s.serviceTypes || []) tags.push(t)
      if (s.nearOnly) tags.push('1公里内')
      if (s.maxPrice) tags.push(`¥${s.maxPrice}以下`)
      return tags.slice(0, 6)
    },
  },
  methods: {
    go(url) {
      uni.navigateTo({ url })
    },
    toPref() {
      uni.navigateTo({ url: '/pages/profile/preference' })
    },
    toMyOrders() {
      uni.switchTab({ url: '/pages/orders/list' })
    },
    async accept(id) {
      await acceptOrder(id)
      uni.showToast({ title: '接单成功' })
      const { data } = await getRecommend('picker')
      this.recommend = data || []
    },
  },
}
</script>
<style></style>
