<template>
  <view class="pb-20">
    <!-- 顶部状态区（主色） -->
    <view class="bg-primary text-white p-6">
      <view class="text-18 font-semibold mb-3">{{ guessType(info.content) }}</view>
      <view class="flex items-center gap-2">
        <text class="px-2 py-1 bg-white bg-opacity-20 rounded-full text-xs">{{
          statusText(info.status)
        }}</text>
        <text class="text-sm opacity-90">{{
          progress.message || etaHint(info.duration, info.status)
        }}</text>
      </view>

      <!-- 底部操作按钮 -->
      <view
        v-if="info.status === 0 || info.status === 1 || info.status === 2"
        class="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex gap-3"
      >
        <button
          v-if="info.status === 0"
          class="flex-1 py-3 rounded-xl bg-primary text-white font-bold"
          @tap="payOrderAction"
        >
          立即支付
        </button>
        <button
          v-if="info.status === 0 || info.status === 1"
          class="flex-1 py-3 rounded-xl bg-gray-200 text-gray-800 font-bold"
          @tap="cancelOrderAction"
        >
          取消订单
        </button>
      </view>
    </view>

    <!-- 进度条 -->
    <view class="px-6 py-8">
      <view class="flex items-center justify-between mb-6">
        <view class="flex flex-col items-center flex-1">
          <view
            class="w-10 h-10 rounded-full bg-primary text-white flex-center text-sm font-bold mb-2"
            >✓</view
          >
          <text class="text-xs text-gray-600">已发布</text>
        </view>
        <view
          class="flex-1 h-1 bg-gray-200 mx-2"
          :class="Number(info.status) >= 2 ? 'bg-primary' : ''"
        ></view>
        <view class="flex flex-col items-center flex-1">
          <view
            :class="[
              'w-10 h-10 rounded-full flex-center text-sm font-bold mb-2',
              Number(info.status) >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400',
            ]"
            >✓</view
          >
          <text class="text-xs text-gray-600">已接单</text>
        </view>
        <view
          class="flex-1 h-1 bg-gray-200 mx-2"
          :class="Number(info.status) >= 3 ? 'bg-primary' : ''"
        ></view>
        <view class="flex flex-col items-center flex-1">
          <view
            :class="[
              'w-10 h-10 rounded-full flex-center text-sm font-bold mb-2',
              Number(info.status) >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400',
            ]"
            >✓</view
          >
          <text class="text-xs text-gray-600">已完成</text>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="p-6 space-y-4">
      <view class="bg-white rounded-2xl p-5 shadow-sm">
        <view class="text-sm font-medium text-gray-500 mb-4">订单信息</view>
        <view class="space-y-3">
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">订单编号</text>
            <text class="text-sm text-gray-800">#{{ info.pkId || '-' }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">发布时间</text>
            <text class="text-sm text-gray-800">{{ formatTime(info.createTime) }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">取件时间</text>
            <text class="text-sm text-gray-800">{{ pickupTime(info.content) }}</text>
          </view>
        </view>
      </view>

      <view class="bg-white rounded-2xl p-5 shadow-sm">
        <view class="text-sm font-medium text-gray-500 mb-4">服务信息</view>
        <view class="space-y-3">
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">取件地点</text>
            <text class="text-sm text-gray-800">{{ pickFrom(info.content) }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">送达地点</text>
            <text class="text-sm text-gray-800">{{ deliverTo(info.content) }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">报酬金额</text>
            <text class="text-sm font-bold text-primary">¥{{ info.price || 0 }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">备注信息</text>
            <text class="text-sm text-gray-800">{{ remark(info.content) }}</text>
          </view>
        </view>
      </view>

      <!-- 价格明细 -->
      <view class="bg-white rounded-2xl p-5 shadow-sm">
        <view class="text-sm font-medium text-gray-500 mb-4">价格明细</view>
        <view class="space-y-3">
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">商品原价</text>
            <text class="text-sm text-gray-800">¥{{ originalAmount() }}</text>
          </view>
          <view v-if="coupon" class="flex justify-between items-center">
            <view class="flex items-center gap-2">
              <text class="text-sm text-gray-600">优惠券</text>
              <text class="px-2 py-0.5 bg-purple-50 text-purple-500 text-[10px] rounded-md">
                {{ coupon.name }}
              </text>
            </view>
            <text class="text-sm text-green-600">-¥{{ discountAmount().toFixed(2) }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-sm text-gray-600">实付金额</text>
            <text class="text-sm font-bold text-primary"
              >¥{{ Number(info.price || 0).toFixed(2) }}</text
            >
          </view>
          <view v-if="coupon" class="flex justify-between">
            <text class="text-xs text-gray-400">券有效期</text>
            <text class="text-xs text-gray-600">{{
              String(coupon.endTime || '').slice(0, 10)
            }}</text>
          </view>
        </view>
      </view>

      <view v-if="Number(info.status) >= 2 && Number(info.pickerId) > 0" class="bg-white rounded-2xl p-5 shadow-sm">
        <view class="text-sm font-medium text-gray-500 mb-4">接取人信息</view>
        <view class="flex items-center gap-3">
          <image
            class="w-12 h-12 rounded-full bg-gray-100"
            :src="courierInfo.avatar || pickerAvatar(info.pickerId)"
          />
          <view>
            <view class="font-medium text-gray-800">{{
              courierInfo.nickname || pickerName(info.pickerId)
            }}</view>
            <view class="text-xs text-gray-500"
              >已完成{{ courierInfo.completedOrders || pickerDone(info.pickerId) }}单，好评率{{
                courierInfo.rating || pickerRate(info.pickerId)
              }}%</view
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import {
  getOrderDetail,
  getOrderProgress,
  payOrder,
  cancelOrder,
  getCouponDetail,
} from '@/api/order'
import { getCourierInfo } from '@/api/courier'
import { orderStatusText, orderStatusChipClass } from '@/utils/order'
export default {
  data() {
    return { info: {}, step: 0, progress: {}, courierInfo: {}, orderId: null, coupon: null }
  },
  async onLoad(q) {
    this.orderId = q.id
    console.log('Requesting order detail for pkId:', this.orderId) // 添加这一行
    await this.loadOrderDetail()
  },
  onShow() {
    // 页面显示时，如果订单ID已存在，则刷新订单详情
    if (this.orderId) {
      this.loadOrderDetail()
    }
  },
  methods: {
    async loadOrderDetail() {
      const { data } = await getOrderDetail(this.orderId)
      this.info = data || {}
      this.step = Number(this.info.status || 0)
      if (Number(this.info.couponId || 0) > 0) {
        try {
          const { data: c } = await getCouponDetail(this.info.couponId)
          this.coupon = c || null
        } catch (e) {
          this.coupon = null
        }
      } else {
        this.coupon = null
      }
      await this.loadProgress()
      await this.loadCourierInfo()
    },
    async loadProgress() {
      try {
        const { data } = await getOrderProgress(this.info.pkId)
        this.progress = data.data || {}
      } catch (e) {
        console.error('加载进度失败', e)
      }
    },
    async loadCourierInfo() {
      const status = Number(this.info.status || 0)
      const pid = Number(this.info.pickerId || 0)
      if (status < 2 || !pid) {
        this.courierInfo = {}
        return
      }
      try {
        const { data } = await getCourierInfo(pid)
        this.courierInfo = data || {}
      } catch (e) {
        // 未接单或代取员信息缺失时，不影响订单详情展示
        this.courierInfo = {}
      }
    },
    async payOrderAction() {
      uni.showModal({
        title: '确认支付',
        content: `是否立即支付订单 ¥${this.info.price}？`,
        success: async (res) => {
          if (res.confirm) {
            await payOrder(this.orderId)
            uni.showToast({ title: '支付成功', icon: 'success' })
            await this.loadOrderDetail() // 刷新订单详情
          }
        },
      })
    },
    async cancelOrderAction() {
      uni.showModal({
        title: '确认取消',
        content: '确定要取消该订单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await cancelOrder(this.orderId)
              uni.showToast({ title: '订单已取消', icon: 'success' })
              await this.loadOrderDetail() // 刷新订单详情
            } catch (e) {
              console.error('取消订单失败', e)
            }
          }
        },
      })
    },
    formatTime(t) {
      if (!t) return '-'
      return String(t).slice(0, 16)
    },
    statusText(s) {
      return orderStatusText(s)
    },
    chipCls(s) {
      return orderStatusChipClass(s)
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
    pickupTime(content) {
      const c = String(content || '')
      const m = c.match(/取件时间[:：]\s*([^|]+)/)
      return (m?.[1] || '—').trim()
    },
    remark(content) {
      const c = String(content || '')
      const m = c.match(/备注[:：]\s*([^|]+)/)
      return (m?.[1] || '—').trim()
    },
    etaHint(duration, status) {
      const s = Number(status)
      if (s === 3) return '订单已完成'
      if (s === 0) return '待支付后可进入接单流程'
      const n = Number(duration)
      if (Number.isFinite(n) && n > 0) return `预计${n}分钟内送达`
      return '预计尽快送达'
    },
    pickerAvatar(pid) {
      const p = Number(pid || 0)
      if (!p) return 'https://unpkg.com/lucide-static@latest/icons/user.svg'
      return p % 2 === 0
        ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
    },
    pickerName(pid) {
      const p = Number(pid || 0)
      if (!p) return '等待接单'
      const list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      return `同学${list[p % list.length]}`
    },
    pickerDone(pid) {
      const p = Number(pid || 0)
      if (!p) return 0
      return (p % 20) + 5
    },
    pickerRate(pid) {
      const p = Number(pid || 0)
      if (!p) return 0
      return 90 + (p % 9)
    },
    // 价格明细
    discountAmount() {
      const d = this.coupon?.discount
      return Number(d || 0)
    },
    originalAmount() {
      const p = Number(this.info.price || 0)
      return (p + this.discountAmount()).toFixed(2)
    },
  },
}
</script>
<style></style>
