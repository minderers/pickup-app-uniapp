<template>
  <view class="min-h-screen bg-gray-50 pb-32">
    <!-- 顶部状态切换 -->
    <view class="bg-white px-6 py-4 sticky top-0 z-50 shadow-sm">
      <view class="flex justify-between items-center">
        <view class="flex gap-8">
          <view :class="segCls(filterKey === 'all')" @tap="setFilter('all')">全部</view>
          <view :class="segCls(filterKey === 'doing')" @tap="setFilter('doing')">进行中</view>
          <view :class="segCls(filterKey === 'done')" @tap="setFilter('done')">已完成</view>
          <view :class="segCls(filterKey === 'cancel')" @tap="setFilter('cancel')">已取消</view>
        </view>
        <view
          class="text-xs text-primary bg-primary bg-opacity-10 px-3 py-1 rounded-full"
          @tap="toWaiting"
          >待接订单</view
        >
      </view>
    </view>

    <view class="p-6 space-y-6">
      <view v-if="displayList.length" class="space-y-6">
        <view class="bg-white rounded-3xl p-6 shadow-sm" v-for="o in displayList" :key="o.pkId">
          <view class="flex items-center justify-between mb-6">
            <text class="text-xs text-gray-400">订单编号：{{ orderNo(o) }}</text>
            <text class="text-xs px-3 py-1 rounded-lg" :class="chipCls(o.status)">{{
              statusText(o.status)
            }}</text>
          </view>

          <view class="flex items-start gap-4 mb-6">
            <view class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <image class="svg" mode="aspectFit" :src="guessIcon(o.content)" />
            </view>
            <view class="flex-1">
              <view class="flex justify-between items-center mb-2">
                <view class="text-16 font-bold text-gray-800">{{ guessType(o.content) }}</view>
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

          <!-- 只有进行中显示时间 -->
          <view
            v-if="Number(o.status) === 1 || Number(o.status) === 2"
            class="flex justify-end mb-4"
          >
            <text class="text-[10px] text-gray-400">30分钟内</text>
          </view>

          <view class="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button
              class="px-6 py-2 border border-gray-200 text-gray-500 text-xs rounded-xl m-0 bg-white"
              @tap="toDetail(o.pkId)"
            >
              {{ Number(o.status) >= 3 ? '再次下单' : '查看详情' }}
            </button>
            <button
              v-if="Number(o.status) === 0"
              class="px-6 py-2 bg-primary text-white text-xs rounded-xl m-0"
              @tap="pay(o.pkId)"
            >
              去支付
            </button>
            <button
              v-else-if="Number(o.status) === 1 || Number(o.status) === 2"
              class="px-6 py-2 bg-primary text-white text-xs rounded-xl m-0"
              @tap="contact"
            >
              联系代取员
            </button>
            <button
              v-else-if="Number(o.status) === 3"
              class="px-6 py-2 bg-primary text-white text-xs rounded-xl m-0"
              @tap="contact"
            >
              评价
            </button>
          </view>
        </view>
      </view>
      <view class="list-empty" v-else>暂无订单</view>

      <!-- 订单接取通知 -->
      <view class="mt-12">
        <view class="flex justify-between items-center mb-4">
          <view class="text-16 font-bold text-gray-800">订单接取通知</view>
          <text class="text-xs text-gray-400">10:00</text>
        </view>
        <view class="text-sm text-gray-500 leading-relaxed">
          您的外卖代取订单已被同学C接取，预计15分钟内送达
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getOrderList, payOrder } from '@/api/order'
import { orderStatusText, orderStatusChipClass } from '@/utils/order'

export default {
  data() {
    return {
      filterKey: 'all',
      list: [],
      total: 0,
    }
  },
  async onShow() {
    await this.load()
  },
  computed: {
    displayList() {
      if (this.filterKey === 'cancel')
        return (this.list || []).filter((x) => Number(x.status) === 4)
      if (this.filterKey === 'done') return (this.list || []).filter((x) => Number(x.status) === 3)
      if (this.filterKey === 'doing')
        return (this.list || []).filter((x) => [1, 2].includes(Number(x.status)))
      return this.list || []
    },
  },
  methods: {
    async load() {
      const { data } = await getOrderList({ page: 1, size: 50 })
      this.list = data.list || []
      this.total = data.total || this.list.length
    },
    setFilter(k) {
      this.filterKey = k
    },
    segCls(active) {
      return active
        ? 'text-sm font-bold text-primary border-b-4 border-primary pb-2'
        : 'text-sm font-medium text-gray-400 pb-2'
    },
    toDetail(id) {
      uni.navigateTo({ url: '/pages/orders/detail?id=' + id })
    },
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
    toWaiting() {
      uni.navigateTo({ url: '/pages/courier/waiting' })
    },
    statusText(s) {
      return orderStatusText(s)
    },
    chipCls(s) {
      const status = Number(s)
      if (status === 1 || status === 2) return 'bg-purple-50 text-purple-500'
      if (status === 3) return 'bg-green-50 text-green-500'
      return 'bg-gray-50 text-gray-400'
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
    orderNo(o) {
      const id = Number(o?.pkId || 0)
      return `202405${String(id).padStart(5, '0')}`
    },
    async pay(id) {
      await payOrder(id)
      uni.showToast({ title: '支付成功' })
      await this.load()
    },
    contact() {
      uni.showToast({ icon: 'none', title: '示例：可扩展聊天/电话' })
    },
  },
}
</script>

<style></style>
