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
          v-model="searchKeyword"
          class="w-full h-18 rounded-full bg-gray-100 pl-12 pr-6 text-sm"
          placeholder="搜索订单、服务..."
          @confirm="onSearch"
        />
      </view>
      <view
        class="relative w-18 h-18 rounded-full bg-gray-100 flex items-center justify-center"
        @tap="goMessages"
      >
        <image
          class="svg"
          mode="aspectFit"
          src="https://unpkg.com/lucide-static@latest/icons/bell.svg"
        />
        <!-- 红点通知 -->
        <view
          v-if="unreadCount > 0"
          class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"
        />
      </view>
    </view>

    <view class="px-6">
      <!-- 已移除首页画像偏好卡片 -->

      <!-- 快捷服务 -->
      <view class="grid grid-cols-4 gap-4 mt-8 mb-8">
        <view class="flex flex-col items-center" @tap="goPublish('快递代取')">
          <view class="w-18 h-18 rounded-2xl bg-blue-50 flex items-center justify-center mb-2">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/package.svg"
            />
          </view>
          <text class="text-xs text-gray-600">快递代取</text>
        </view>
        <view class="flex flex-col items-center" @tap="goPublish('外卖代取')">
          <view class="w-18 h-18 rounded-2xl bg-green-50 flex items-center justify-center mb-2">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/coffee.svg"
            />
          </view>
          <text class="text-xs text-gray-600">外卖代取</text>
        </view>
        <view class="flex flex-col items-center" @tap="goPublish('超市代购')">
          <view class="w-18 h-18 rounded-2xl bg-yellow-50 flex items-center justify-center mb-2">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg"
            />
          </view>
          <text class="text-xs text-gray-600">超市代购</text>
        </view>
        <view class="flex flex-col items-center" @tap="goPublish('其他服务')">
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

      <!-- 公告资讯 -->
      <view class="flex items-center justify-between mt-8 mb-4">
        <view class="text-18 font-bold text-gray-800">公告资讯</view>
        <view class="text-sm text-gray-400" @tap="go('/pages/news/list')">查看更多</view>
      </view>
      <view v-if="news && news.length" class="space-y-3 mb-8">
        <view
          class="bg-white rounded-2xl p-4 flex items-start justify-between shadow-sm"
          v-for="n in news"
          :key="n.pkId"
          @tap="toNewsDetail(n.pkId)"
        >
          <view class="flex-1 pr-3">
            <view class="text-[15px] font-bold text-gray-800 line-clamp-1">{{ n.title }}</view>
            <view class="text-[12px] text-gray-400 mt-1">{{ dateText(n.createTime) }}</view>
          </view>
          <view class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/megaphone.svg"
            />
          </view>
        </view>
      </view>
      <view v-else class="text-center text-gray-400 text-sm mb-8">暂无公告</view>

      <!-- 推荐订单（仅代取员展示） -->
      <view v-if="isCourier" class="flex items-center justify-between mb-4">
        <view class="text-18 font-bold text-gray-800">推荐订单</view>
        <view class="text-sm text-gray-400" @tap="toMyOrders">查看更多</view>
      </view>

      <view v-if="isCourier && recommend.length" class="space-y-4">
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
              <view class="text-[10px] text-gray-400 mt-1">30钟内</view>
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
              <image class="svg rounded-full bg-gray-100" :src="publisherAvatar(item)" />
              <text class="text-xs text-gray-500">{{ publisherName(item) }}</text>
            </view>
            <button
              class="bg-primary text-white text-xs px-6 py-1.5 rounded-full m-0"
              v-if="isCourier"
              @tap="accept(item.pkId)"
            >
              接取
            </button>
          </view>
        </view>
      </view>
      <view v-if="isCourier && !recommend.length" class="list-empty">暂无推荐订单</view>
    </view>
  </view>
</template>

<script>
import { getRecommend } from '@/api/order'
import { acceptOrder } from '@/api/courier'
import { getProfile } from '@/api/user'
import { getNewsList } from '@/api/news'

export default {
  data() {
    return {
      recommend: [],
      isCourier: false,
      searchKeyword: '',
      unreadCount: 0,
      news: [],
    }
  },
  async onShow() {
    try {
      const p = await getProfile()
      this.isCourier = (p.data?.role ?? 0) === 1
    } catch (e) {
      this.isCourier = false
    }
    // 只有代取员才加载推荐订单
    if (this.isCourier) {
      await this.loadRecommendOrders()
    } else {
      this.recommend = []
    }
    try {
      const params = { page: 1, size: 5, order: 'desc' }
      if (this.searchKeyword && String(this.searchKeyword).trim().length > 0) {
        params.keyword = String(this.searchKeyword).trim()
      }
      const { data: nl } = await getNewsList(params)
      this.news = Array.isArray(nl?.list) ? nl.list.slice(0, 3) : []
    } catch (e) {
      this.news = []
    }
  },
  methods: {
    async loadRecommendOrders() {
      try {
        console.log('Loading recommend orders with type: collaborative')
        const { data: rec } = await getRecommend('collaborative') // 始终调用协同过滤推荐接口
        const all = Array.isArray(rec) ? rec : rec?.list || []
        this.recommend = all.slice(0, 5) // 仍然只显示前5个
        console.log('Loaded recommendations:', this.recommend)
      } catch (e) {
        this.recommend = []
        console.error('加载推荐订单失败', e)
      }
    },
    async onSearch() {
      try {
        const params = { page: 1, size: 5, order: 'desc' }
        if (this.searchKeyword && String(this.searchKeyword).trim().length > 0) {
          params.keyword = String(this.searchKeyword).trim()
        }
        const { data: nl } = await getNewsList(params)
        this.news = Array.isArray(nl?.list) ? nl.list.slice(0, 3) : []
      } catch (e) {
        this.news = []
      }
    },
    goMessages() {
      this.go('/pages/news/list')
    },
    toNewsDetail(id) {
      this.go('/pages/news/detail?id=' + id)
    },
    dateText(v) {
      if (!v) return ''
      return String(v).slice(0, 10)
    },
    go(url) {
      if (
        url === '/pages/index/index' ||
        url === '/pages/orders/list' ||
        url === '/pages/profile/profile' ||
        url === '/pages/publish/index' // publish 页面现在也是 tabbar 页面
      ) {
        uni.switchTab({ url })
      } else {
        uni.navigateTo({ url })
      }
    },
    goPublish(type) {
      uni.switchTab({ url: `/pages/publish/index?type=${type}` })
    },
    toMyOrders() {
      uni.navigateTo({
        url: '/pages/orders/list', // 跳转到所有待接订单列表页
      })
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
    publisherAvatar(order) {
      return order?.publisherAvatar || 'https://unpkg.com/lucide-static@latest/icons/user.svg'
    },
    publisherName(order) {
      return order?.publisherNickname || '发布者'
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
