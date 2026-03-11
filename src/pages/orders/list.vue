<template>
  <view class="pb-24">
    <view class="bg-white shadow-sm p-4 sticky top-0 z-10">
      <view class="flex items-center justify-between">
        <view class="text-lg font-semibold text-gray-800">我的订单</view>
        <button class="text-gray-600" @tap="toWaiting">
          <text class="text-sm text-primary">待接订单</text>
        </button>
      </view>
      <!-- 订单状态标签（对齐设计稿：底部边框高亮） -->
      <view class="flex gap-6 mt-4">
        <button :class="segCls(filterKey==='all')" @tap="setFilter('all')">全部</button>
        <button :class="segCls(filterKey==='doing')" @tap="setFilter('doing')">进行中</button>
        <button :class="segCls(filterKey==='done')" @tap="setFilter('done')">已完成</button>
        <button :class="segCls(filterKey==='cancel')" @tap="setFilter('cancel')">已取消</button>
      </view>
    </view>

    <view class="p-4 pb-20">
      <view v-if="displayList.length" class="space-y-4">
        <view class="bg-white rounded-xl p-4 shadow-sm" v-for="o in displayList" :key="o.pkId">
          <view class="flex items-center justify-between mb-3">
            <view class="flex items-center gap-2">
              <text class="text-xs text-gray-500">订单编号：{{ orderNo(o) }}</text>
            </view>
            <text class="text-xs px-2 py-1 rounded-full" :class="chipCls(o.status)">{{ statusText(o.status) }}</text>
          </view>
          <view class="flex items-start gap-3">
            <view class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/package.svg" />
            </view>
            <view class="flex-1">
              <view class="font-medium text-gray-800">{{ guessType(o.content) }}</view>
              <view class="text-xs text-gray-600 mt-1">取件地点：{{ pickFrom(o.content) }}</view>
              <view class="text-xs text-gray-600">送达地点：{{ deliverTo(o.content) }}</view>
            </view>
            <view class="text-right">
              <view class="text-lg font-bold text-primary">¥{{ o.price || 0 }}</view>
            </view>
          </view>
          <view class="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
            <button class="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs rounded-lg" @tap="toDetail(o.pkId)">查看详情</button>
            <button
              v-if="Number(o.status) === 0"
              class="px-3 py-1.5 bg-primary text-white text-xs rounded-lg"
              @tap="pay(o.pkId)"
              >去支付</button
            >
            <button v-else class="px-3 py-1.5 bg-primary text-white text-xs rounded-lg" @tap="contact">联系代取员</button>
          </view>
        </view>
      </view>
      <view class="list-empty" v-else>暂无订单</view>
    </view>

    <view class="fixed left-0 right-0 bottom-0 pb-8 pt-4 bg-white/80" style="backdrop-filter: blur(10px)">
      <view class="flex items-center justify-between px-6">
        <view class="text-xs text-gray-500">共 {{ total }} 条</view>
        <button class="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center" @tap="toCreate">
          <text class="text-[26px] leading-none">+</text>
        </button>
        <view class="w-10"></view>
      </view>
    </view>
  </view>
</template>
<script>
import { getOrderList, payOrder } from '@/api/order'
import { orderStatusText, orderStatusChipClass } from '@/utils/order'
export default {
  data() {
    return { filterKey: 'all', list: [], total: 0 }
  },
  async onShow() {
    await this.load()
  },
  computed: {
    displayList() {
      if (this.filterKey === 'cancel') return []
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
        ? 'text-sm font-medium text-primary border-b-2 border-primary pb-2'
        : 'text-sm font-medium text-gray-500 pb-2'
    },
    toDetail(id) {
      uni.navigateTo({ url: '/pages/orders/detail?id=' + id })
    },
    toCreate() {
      uni.switchTab({ url: '/pages/publish/index' })
    },
    toWaiting() {
      uni.navigateTo({ url: '/pages/courier/waiting' })
    },
    statusText(s) {
      return orderStatusText(s)
    },
    chipCls(s) {
      return orderStatusChipClass(s) + ' text-xs'
    },
    etaText(d) {
      const n = Number(d)
      if (!Number.isFinite(n) || n <= 0) return '尽快送达'
      return `${n}分钟内`
    },
    guessType(content) {
      const c = String(content || '')
      if (c.includes('外卖')) return '外卖代取'
      if (c.includes('超市') || c.includes('代购')) return '超市代购'
      return '快递代取'
    },
    pickFrom(content) {
      const c = String(content || '')
      const m = c.match(/取件地点[:：]\s*([^|]+)/)
      return (m?.[1] || '—').trim()
    },
    deliverTo(content) {
      const c = String(content || '')
      const m = c.match(/送达地点[:：]\s*([^|]+)/)
      return (m?.[1] || '—').trim()
    },
    orderNo(o) {
      // 设计稿里是 20240520001 这种；这里用 pkId + 日期模拟
      const id = Number(o?.pkId || 0)
      const d = new Date()
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}${m}${day}${String(id).padStart(3, '0')}`
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
