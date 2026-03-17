<template>
  <view class="min-h-screen bg-gray-50 pb-20">
    <!-- 订单类型选择 -->
    <view class="bg-white py-8">
      <view class="px-6 text-sm text-gray-500 mb-6 font-medium">订单类型</view>
      <view class="grid grid-cols-4 gap-4 px-4">
        <view class="flex flex-col items-center" @tap="setType('快递代取')">
          <view :class="typeIconWrap('快递代取')">
            <image
              class="w-8 h-8"
              :class="typeIconCls('快递代取')"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/package.svg"
            />
          </view>
          <text :class="typeTextCls('快递代取')">快递代取</text>
        </view>
        <view class="flex flex-col items-center" @tap="setType('外卖代取')">
          <view :class="typeIconWrap('外卖代取')">
            <image
              class="w-8 h-8"
              :class="typeIconCls('外卖代取')"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/coffee.svg"
            />
          </view>
          <text :class="typeTextCls('外卖代取')">外卖代取</text>
        </view>
        <view class="flex flex-col items-center" @tap="setType('超市代购')">
          <view :class="typeIconWrap('超市代购')">
            <image
              class="w-8 h-8"
              :class="typeIconCls('超市代购')"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg"
            />
          </view>
          <text :class="typeTextCls('超市代购')">超市代购</text>
        </view>
        <view class="flex flex-col items-center" @tap="setType('其他服务')">
          <view :class="typeIconWrap('其他服务')">
            <image
              class="w-8 h-8"
              :class="typeIconCls('其他服务')"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/more-horizontal.svg"
            />
          </view>
          <text :class="typeTextCls('其他服务')">其他服务</text>
        </view>
      </view>
    </view>

    <!-- 订单信息填写 -->
    <view class="p-4 mt-2">
      <view class="bg-white rounded-2xl p-6 space-y-6 shadow-sm">
        <view>
          <view class="text-sm text-gray-500 mb-3 font-medium">取件地点</view>
          <input
            class="w-full h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm"
            v-model="pickupFrom"
            placeholder="请输入取件地点"
            placeholder-class="text-gray-300"
          />
        </view>

        <view>
          <view class="text-sm text-gray-500 mb-3 font-medium">送达地点</view>
          <input
            class="w-full h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm"
            v-model="deliverTo"
            placeholder="请输入送达地点"
            placeholder-class="text-gray-300"
          />
        </view>

        <view>
          <view class="text-sm text-gray-500 mb-3 font-medium">取件时间</view>
          <input
            class="w-full h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm"
            v-model="pickupTime"
            placeholder="请选择取件时间"
            placeholder-class="text-gray-300"
          />
        </view>

        <view>
          <view class="text-sm text-gray-500 mb-3 font-medium">报酬金额</view>
          <input
            class="w-full h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm"
            v-model.number="form.price"
            type="number"
            placeholder="请输入报酬金额"
            placeholder-class="text-gray-300"
          />
        </view>

        <view>
          <view class="text-sm text-gray-500 mb-3 font-medium">备注信息</view>
          <textarea
            class="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm"
            v-model="remark"
            placeholder="请输入备注信息"
            placeholder-class="text-gray-300"
            :maxlength="200"
            style="height: 240rpx"
          />
        </view>

        <button
          class="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary bg-opacity-10 mt-8"
          @tap="onSubmit"
        >
          确认发布
        </button>
      </view>
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
        'w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all',
        active ? 'bg-primary bg-opacity-10 scale-110 shadow-sm' : 'bg-gray-100',
      ]
    },
    typeIconCls(t) {
      const active = this.type === t || (!this.type && t === '快递代取')
      return active ? '' : 'opacity-40'
    },
    typeTextCls(t) {
      const active = this.type === t || (!this.type && t === '快递代取')
      return active ? 'text-xs text-gray-800 font-bold' : 'text-xs text-gray-400'
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
