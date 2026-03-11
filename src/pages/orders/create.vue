<template>
  <view class="pb-20">
    <!-- 顶部导航（对齐设计稿：发布按钮在右侧） -->
    <view class="bg-white shadow-sm p-4 sticky top-0 z-10">
      <view class="flex items-center justify-between">
        <button class="text-gray-600" @tap="back">
          <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />
        </button>
        <view class="text-lg font-semibold text-gray-800">发布订单</view>
        <button class="text-primary font-medium" @tap="onSubmit">发布</button>
      </view>
    </view>

    <!-- 订单类型选择 -->
    <view class="p-4 bg-white mt-2">
      <view class="text-sm font-medium text-gray-500 mb-3">订单类型</view>
      <view class="grid grid-cols-4 gap-3">
        <view class="flex flex-col items-center" @tap="setType('快递代取')">
          <view :class="typeIconWrap('快递代取')">
            <image
              class="w-6 h-6"
              :class="typeIconCls('快递代取')"
              src="https://unpkg.com/lucide-static@latest/icons/package.svg"
            />
          </view>
          <text :class="typeTextCls('快递代取')">快递代取</text>
        </view>
        <view class="flex flex-col items-center" @tap="setType('外卖代取')">
          <view :class="typeIconWrap('外卖代取')">
            <image
              class="w-6 h-6"
              :class="typeIconCls('外卖代取')"
              src="https://unpkg.com/lucide-static@latest/icons/coffee.svg"
            />
          </view>
          <text :class="typeTextCls('外卖代取')">外卖代取</text>
        </view>
        <view class="flex flex-col items-center" @tap="setType('超市代购')">
          <view :class="typeIconWrap('超市代购')">
            <image
              class="w-6 h-6"
              :class="typeIconCls('超市代购')"
              src="https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg"
            />
          </view>
          <text :class="typeTextCls('超市代购')">超市代购</text>
        </view>
        <view class="flex flex-col items-center" @tap="setType('其他服务')">
          <view :class="typeIconWrap('其他服务')">
            <image
              class="w-6 h-6"
              :class="typeIconCls('其他服务')"
              src="https://unpkg.com/lucide-static@latest/icons/more-horizontal.svg"
            />
          </view>
          <text :class="typeTextCls('其他服务')">其他服务</text>
        </view>
      </view>
    </view>

    <!-- 订单信息填写 -->
    <view class="p-6">
      <view class="bg-white rounded-xl p-5 space-y-4 shadow-sm">
        <view>
          <view class="text-sm font-medium text-gray-500 mb-2">取件地点</view>
          <input
            class="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-200"
            v-model="pickupFrom"
            placeholder="请输入取件地点"
          />
        </view>

        <view>
          <view class="text-sm font-medium text-gray-500 mb-2">送达地点</view>
          <input
            class="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-200"
            v-model="deliverTo"
            placeholder="请输入送达地点"
          />
        </view>

        <view>
          <view class="text-sm font-medium text-gray-500 mb-2">取件时间</view>
          <input
            class="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-200"
            v-model="pickupTime"
            placeholder="请选择取件时间（如：今天 12:00）"
          />
        </view>

        <view>
          <view class="text-sm font-medium text-gray-500 mb-2">报酬金额</view>
          <input
            class="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-200"
            v-model.number="form.price"
            type="number"
            placeholder="请输入报酬金额"
          />
        </view>

        <view>
          <view class="text-sm font-medium text-gray-500 mb-2">备注信息</view>
          <textarea
            class="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-200"
            v-model="remark"
            placeholder="请输入备注信息"
            :maxlength="200"
            style="height: 180rpx"
          />
        </view>
      </view>

      <!-- 推荐（对齐需求：下单推荐取件点/代取员） -->
      <view class="bg-white rounded-xl p-5 shadow-sm mt-4">
        <view class="font-semibold mb-3">推荐</view>
        <view class="text-sm text-gray-600 mb-2">推荐取件点</view>
        <view class="flex flex-wrap gap-2">
          <text
            v-for="p in pickupPoints"
            :key="p.id"
            class="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >{{ p.name || '暂无' }}</text
          >
        </view>
        <view class="text-sm text-gray-600 mt-4 mb-2">推荐代取员</view>
        <view class="flex flex-wrap gap-2">
          <text
            v-for="u in pickers"
            :key="u.pkId || u.id"
            class="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >{{ u.nickname || '同学' }}</text
          >
        </view>
      </view>

      <button class="w-full py-4 bg-primary text-white rounded-lg font-medium mt-6" @tap="onSubmit">
        确认发布
      </button>
    </view>
  </view>
</template>
<script>
import { createOrder, getRecommend, payOrder } from '@/api/order'
import { listAddress } from '@/api/address'
export default {
  data() {
    return {
      form: { content: '', price: 0, duration: 30 },
      pickupPoints: [],
      pickers: [],
      addresses: [],
      selectedAddress: null,
      type: '',
      pickupFrom: '',
      deliverTo: '',
      pickupTime: '',
      remark: '',
    }
  },
  onLoad(q) {
    if (q?.type) {
      this.type = String(q.type)
    }
  },
  async onShow() {
    const a = await getRecommend('pickup-point')
    this.pickupPoints = a.data || []
    const b = await getRecommend('picker')
    this.pickers = b.data || []
    const c = await listAddress()
    this.addresses = c.data || []
    this.selectedAddress =
      this.addresses.find((x) => x.isDefault === 1) || this.addresses[0] || null
    if (this.selectedAddress) {
      const a = this.selectedAddress
      const addrText = `${a.region || ''}${a.detail ? ' ' + a.detail : ''}`.trim()
      if (!this.deliverTo && addrText) this.deliverTo = addrText
    }
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    setType(t) {
      this.type = t
    },
    typeIconWrap(t) {
      const active = this.type === t || (!this.type && t === '快递代取')
      return [
        'w-12 h-12 rounded-full flex items-center justify-center mb-1',
        active ? 'bg-primary/10' : 'bg-gray-100',
      ]
    },
    typeIconCls(t) {
      const active = this.type === t || (!this.type && t === '快递代取')
      return active ? '' : 'opacity-50'
    },
    typeTextCls(t) {
      const active = this.type === t || (!this.type && t === '快递代取')
      return active ? 'text-xs text-gray-700' : 'text-xs text-gray-500'
    },
    async onSubmit() {
      const t = this.type || '快递代取'
      const parts = [
        `${t}`,
        `取件地点：${this.pickupFrom || '—'}`,
        `送达地点：${this.deliverTo || '—'}`,
        `取件时间：${this.pickupTime || '—'}`,
        `备注：${this.remark || '—'}`,
      ]
      const payload = { ...this.form, content: parts.join(' | ') }
      const { data } = await createOrder(payload)
      await payOrder(data.pkId)
      uni.showToast({ title: '已支付' })
      uni.navigateTo({ url: '/pages/orders/detail?id=' + data.pkId })
    },
  },
}
</script>
<style></style>
