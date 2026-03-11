<template>
  <view class="p-6">
    <view class="bg-white rounded-xl p-5 mb-4 shadow-sm">
      <view class="flex items-center justify-between mb-2">
        <view class="text-[16px] font-semibold text-gray-800">画像偏好设置</view>
        <button class="text-sm text-primary" size="mini" @tap="done">保存</button>
      </view>
      <view class="text-xs text-gray-500">对齐设计稿：checkbox + radio 的偏好配置</view>
    </view>

    <view class="bg-white rounded-xl p-5 mb-4 shadow-sm">
      <view class="font-medium text-gray-800 mb-4">下单偏好</view>

      <view class="mb-4">
        <view class="text-sm text-gray-500 mb-2">服务类型</view>
        <view class="flex flex-wrap gap-4">
          <label class="flex items-center gap-2" v-for="t in allTypes" :key="t">
            <checkbox :checked="selTypes.includes(t)" @click="toggle(t)" color="#4F46E5" style="transform: scale(0.9)" />
            <text class="text-sm text-gray-700">{{ t }}</text>
          </label>
        </view>
      </view>

      <view class="mb-4">
        <view class="text-sm text-gray-500 mb-2">最大取件距离</view>
        <radio-group @change="onDistance">
          <view class="flex gap-6 flex-wrap">
            <label class="flex items-center gap-2" v-for="d in distances" :key="d.value">
              <radio :value="String(d.value)" :checked="distance === d.value" color="#4F46E5" style="transform: scale(0.9)" />
              <text class="text-sm text-gray-700">{{ d.label }}</text>
            </label>
          </view>
        </radio-group>
      </view>

      <view>
        <view class="text-sm text-gray-500 mb-2">期望价格范围</view>
        <radio-group @change="onPriceRadio">
          <view class="flex gap-6 flex-wrap">
            <label class="flex items-center gap-2" v-for="p in prices" :key="p.value">
              <radio :value="String(p.value)" :checked="maxPrice === p.value" color="#4F46E5" style="transform: scale(0.9)" />
              <text class="text-sm text-gray-700">{{ p.label }}</text>
            </label>
          </view>
        </radio-group>
      </view>
    </view>

    <view class="bg-white rounded-xl p-5 shadow-sm">
      <view class="font-medium text-gray-800 mb-4">代取员接单偏好</view>
      <view class="flex items-center justify-between">
        <text class="text-sm text-gray-700">仅展示“附近”</text>
        <switch :checked="nearOnly" @change="(e) => setNearOnly(e.detail.value)" />
      </view>
      <view class="text-xs text-gray-500 mt-3">当前后端未提供距离/类型匹配配置接口，本页用于前端展示与本地偏好保存。</view>
    </view>
  </view>
</template>

<script>
import { usePreferenceStore } from '@/stores/preference'

export default {
  data() {
    const s = usePreferenceStore()
    return {
      s,
      allTypes: ['快递代取', '外卖代取', '超市代购'],
      distances: [
        { value: 500, label: '500米内' },
        { value: 1000, label: '1公里内' },
        { value: 2000, label: '2公里内' },
      ],
      prices: [
        { value: 5, label: '¥5以下' },
        { value: 10, label: '¥10以下' },
        { value: 20, label: '¥20以下' },
      ],
      distance: 1000,
    }
  },
  computed: {
    selTypes() {
      return this.s.serviceTypes || []
    },
    maxPrice() {
      return this.s.maxPrice || 0
    },
    nearOnly() {
      return !!this.s.nearOnly
    },
  },
  onShow() {
    this.distance = this.nearOnly ? 1000 : 2000
    if (!this.maxPrice) this.s.setMaxPrice(5)
    if (!(this.selTypes || []).length) this.s.setServiceTypes(['快递代取', '外卖代取'])
  },
  methods: {
    toggle(t) {
      this.s.toggleServiceType(t)
    },
    onDistance(e) {
      const v = Number(e.detail.value)
      this.distance = v
      this.s.setNearOnly(v <= 1000)
    },
    onPriceRadio(e) {
      this.s.setMaxPrice(Number(e.detail.value))
    },
    setNearOnly(v) {
      this.s.setNearOnly(v)
    },
    done() {
      uni.navigateBack()
    },
  },
}
</script>

<style></style>

