<template>
  <view class="min-h-screen bg-gray-50 pb-32">
    <!-- 顶部搜索栏 -->
    <view class="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <view class="relative flex-1 mr-4">
        <image
          class="svg absolute left-4"
          style="top: 50%; transform: translateY(-50%)"
          mode="aspectFit"
          src="https://unpkg.com/lucide-static@latest/icons/search.svg"
        />
        <input
          class="w-full h-18 rounded-full bg-gray-100 pl-12 pr-6 text-sm"
          placeholder="搜索订单、服务..."
        />
      </view>
      <view class="relative w-18 h-18 rounded-full bg-gray-100 flex items-center justify-center">
        <image
          class="svg"
          mode="aspectFit"
          src="https://unpkg.com/lucide-static@latest/icons/bell.svg"
        />
        <!-- 红点通知 -->
        <view class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
      </view>
    </view>

    <view class="px-6">
      <!-- 为你推荐 -->
      <view class="flex items-center justify-between mt-6 mb-4">
        <view class="text-18 font-bold text-gray-800">为你推荐</view>
        <view class="text-sm text-primary" @tap="toPref">调整偏好</view>
      </view>

      <view
        class="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg"
      >
        <view class="flex items-center gap-4">
          <view class="p-2 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/sparkles.svg"
            />
          </view>
          <view>
            <view class="text-16 font-bold">个性化推荐</view>
            <view class="text-xs opacity-80 mt-1">根据您的偏好智能匹配</view>
          </view>
        </view>
        <view class="flex flex-wrap gap-2 mt-6">
          <text
            class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs"
            v-for="t in prefTags"
            :key="t"
            >{{ t }}</text
          >
        </view>
      </view>

      <!-- 快捷服务 -->
      <view class="grid grid-cols-4 gap-4 mt-8 mb-8">
        <view class="flex flex-col items-center" @tap="go('/pages/orders/create')">
          <view class="w-18 h-18 rounded-2xl bg-blue-50 flex items-center justify-center mb-2">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/package.svg"
            />
          </view>
          <text class="text-xs text-gray-600">快递代取</text>
        </view>
        <view class="flex flex-col items-center" @tap="go('/pages/orders/create')">
          <view class="w-18 h-18 rounded-2xl bg-green-50 flex items-center justify-center mb-2">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/coffee.svg"
            />
          </view>
          <text class="text-xs text-gray-600">外卖代取</text>
        </view>
        <view class="flex flex-col items-center" @tap="go('/pages/orders/create')">
          <view class="w-18 h-18 rounded-2xl bg-yellow-50 flex items-center justify-center mb-2">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg"
            />
          </view>
          <text class="text-xs text-gray-600">超市代购</text>
        </view>
        <view class="flex flex-col items-center" @tap="go('/pages/orders/create')">
          <view class="w-18 h-18 rounded-2xl bg-purple-50 flex items-center justify-center mb-2">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/more-horizontal.svg"
            />
          </view>
          <text class="text-xs text-gray-600">其他服务</text>
        </view>
      </view>

      <!-- 推荐订单 -->
      <view class="flex items-center justify-between mb-4">
        <view class="text-18 font-bold text-gray-800">推荐订单</view>
        <view class="text-sm text-gray-400" @tap="toMyOrders">查看更多</view>
      </view>

      <view v-if="recommend.length" class="space-y-4">
        <view class="bg-white rounded-3xl p-5 shadow-sm" v-for="item in recommend" :key="item.pkId">
          <view class="flex justify-between items-start mb-4">
            <view class="flex items-center gap-2">
              <view class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <image class="svg" mode="aspectFit" :src="guessIcon(item.content)" />
              </view>
              <view class="text-15 font-bold text-gray-800">{{ guessType(item.content) }}</view>
              <view class="px-2 py-0.5 bg-blue-50 text-blue-500 text-[10px] rounded-md">推荐</view>
            </view>
            <view class="text-right">
              <view class="text-18 font-bold text-primary">¥{{ item.price || 0 }}</view>
              <view class="text-[10px] text-gray-400 mt-1">30分钟内</view>
            </view>
          </view>

          <view class="space-y-2 mb-4">
            <view class="flex items-center gap-2 text-xs text-gray-500">
              <text>取件地点：</text>
              <text class="text-gray-700">{{ pickFrom(item.content) }}</text>
            </view>
            <view class="flex items-center gap-2 text-xs text-gray-500">
              <text>送达地点：</text>
              <text class="text-gray-700">{{ deliverTo(item.content) }}</text>
            </view>
          </view>

          <view class="flex gap-2 mb-6">
            <view class="px-2 py-0.5 bg-green-50 text-green-500 text-[10px] rounded">距离匹配</view>
            <view class="px-2 py-0.5 bg-purple-50 text-purple-500 text-[10px] rounded"
              >价格匹配</view
            >
          </view>

          <view class="flex items-center justify-between pt-4 border-t border-gray-50">
            <view class="flex items-center gap-2">
              <image
                class="svg rounded-full bg-gray-100"
                src="https://unpkg.com/lucide-static@latest/icons/user.svg"
              />
              <text class="text-xs text-gray-500">同学{{ alpha(item.pkId) }}</text>
            </view>
            <button
              class="bg-primary text-white text-xs px-6 py-1.5 rounded-full m-0"
              @tap="accept(item.pkId)"
            >
              接取
            </button>
          </view>
        </view>
      </view>
      <view class="list-empty" v-else>暂无推荐订单</view>
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
    return {
      recommend: [],
      isCourier: false,
      pref: null,
    }
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
      if (!s) return ['快递代取', '1公里内', '¥5以下']
      const tags = []
      for (const t of s.serviceTypes || []) tags.push(t)
      if (s.nearOnly) tags.push('1公里内')
      if (s.maxPrice) tags.push(`¥${s.maxPrice}以下`)
      return tags.length ? tags.slice(0, 6) : ['快递代取', '1公里内', '¥5以下']
    },
  },
  methods: {
    go(url) {
      if (
        url === '/pages/index/index' ||
        url === '/pages/orders/list' ||
        url === '/pages/profile/profile'
      ) {
        uni.switchTab({ url })
      } else {
        uni.navigateTo({ url })
      }
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
    alpha(id) {
      const chars = 'ABCDEFGH'
      return chars[id % chars.length] || 'A'
    },
  },
}
</script>
<style>
/* 增加选择器权重以覆盖 uni-app 默认 button 样式 */
button.btn-round-sm {
  border-radius: 999rpx;
  padding-left: 32rpx;
  padding-right: 32rpx;
  padding-top: 12rpx;
  padding-bottom: 12rpx;
  line-height: 1.5;
}
</style>
