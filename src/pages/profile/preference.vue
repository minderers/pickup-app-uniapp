<template>
  <view class="min-h-screen bg-gray-50 pb-32">
    <!-- 顶部导航栏 -->
    <view
      class="bg-white px-6 pt-12 pb-4 sticky top-0 z-50 flex items-center justify-between shadow-sm"
    >
      <view class="flex items-center gap-4" @tap="back">
        <image class="svg" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />
      </view>
      <view class="text-18 font-bold text-gray-800">画像偏好设置</view>
      <view class="text-primary font-medium" @tap="done">保存</view>
    </view>

    <view class="p-6 space-y-6">
      <!-- 下单偏好 -->
      <view class="bg-white rounded-3xl p-6 shadow-sm">
        <view class="text-18 font-bold text-gray-800 mb-6">下单偏好</view>

        <view class="mb-6">
          <view class="text-sm text-gray-400 mb-4">服务类型</view>
          <view class="flex flex-wrap gap-x-6 gap-y-4">
            <label class="flex items-center gap-2" v-for="t in allTypes" :key="t">
              <checkbox
                :checked="selTypes.includes(t)"
                @click="toggle(t)"
                color="#4F46E5"
                style="transform: scale(0.8)"
              />
              <text class="text-sm text-gray-600">{{ t }}</text>
            </label>
          </view>
        </view>

        <view class="mb-6">
          <view class="text-sm text-gray-400 mb-4">最大取件距离</view>
          <radio-group @change="onDistance">
            <view class="flex flex-wrap gap-x-6 gap-y-4">
              <label class="flex items-center gap-2" v-for="d in distances" :key="d.value">
                <radio
                  :value="String(d.value)"
                  :checked="distance === d.value"
                  color="#4F46E5"
                  style="transform: scale(0.8)"
                />
                <text class="text-sm text-gray-600">{{ d.label }}</text>
              </label>
            </view>
          </radio-group>
        </view>

        <view>
          <view class="text-sm text-gray-400 mb-4">期望价格范围</view>
          <radio-group @change="onPriceRadio">
            <view class="flex flex-wrap gap-x-6 gap-y-4">
              <label class="flex items-center gap-2" v-for="p in prices" :key="p.value">
                <radio
                  :value="String(p.value)"
                  :checked="maxPrice === p.value"
                  color="#4F46E5"
                  style="transform: scale(0.8)"
                />
                <text class="text-sm text-gray-600">{{ p.label }}</text>
              </label>
            </view>
          </radio-group>
        </view>
      </view>

      <!-- 代取员接单偏好 -->
      <view class="bg-white rounded-3xl p-6 shadow-sm">
        <view class="text-18 font-bold text-gray-800 mb-6">代取员接单偏好</view>

        <view class="mb-6">
          <view class="text-sm text-gray-400 mb-4">接单类型</view>
          <view class="flex flex-wrap gap-x-6 gap-y-4">
            <label class="flex items-center gap-2">
              <checkbox checked color="#4F46E5" style="transform: scale(0.8)" />
              <text class="text-sm text-gray-600">快递代取</text>
            </label>
            <label class="flex items-center gap-2">
              <checkbox checked color="#4F46E5" style="transform: scale(0.8)" />
              <text class="text-sm text-gray-600">外卖代取</text>
            </label>
          </view>
        </view>

        <view class="mb-6">
          <view class="text-sm text-gray-400 mb-4">最大接单距离</view>
          <radio-group>
            <view class="flex flex-wrap gap-x-6 gap-y-4">
              <label class="flex items-center gap-2">
                <radio value="500" checked color="#4F46E5" style="transform: scale(0.8)" />
                <text class="text-sm text-gray-600">500米内</text>
              </label>
              <label class="flex items-center gap-2">
                <radio value="1000" color="#4F46E5" style="transform: scale(0.8)" />
                <text class="text-sm text-gray-600">1公里内</text>
              </label>
            </view>
          </radio-group>
        </view>

        <view>
          <view class="text-sm text-gray-400 mb-4">最低接单价格</view>
          <radio-group>
            <view class="flex flex-wrap gap-x-6 gap-y-4">
              <label class="flex items-center gap-2">
                <radio value="3" checked color="#4F46E5" style="transform: scale(0.8)" />
                <text class="text-sm text-gray-600">¥3以上</text>
              </label>
              <label class="flex items-center gap-2">
                <radio value="5" color="#4F46E5" style="transform: scale(0.8)" />
                <text class="text-sm text-gray-600">¥5以上</text>
              </label>
            </view>
          </radio-group>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { usePreferenceStore } from '@/stores/preference'
import { getPreference, savePreference } from '@/api/user'

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
  async onShow() {
    // 从后端回填，确保展示与数据库一致
    try {
      const res = await getPreference()
      const data = res?.data || {}

      const serviceTypes = Array.isArray(data.serviceTypes) ? data.serviceTypes : []
      if (serviceTypes.length) this.s.setServiceTypes(serviceTypes)

      if (data.maxPrice !== undefined && data.maxPrice !== null) this.s.setMaxPrice(data.maxPrice)
      if (data.nearOnly !== undefined && data.nearOnly !== null) this.s.setNearOnly(data.nearOnly)
    } catch (e) {
      // 保底：使用 store 默认值
      console.error('获取偏好失败', e)
    } finally {
      this.distance = this.nearOnly ? 1000 : 2000
      if (!this.maxPrice) this.s.setMaxPrice(5)
      if (!(this.selTypes || []).length) this.s.setServiceTypes(['快递代取', '外卖代取'])
    }
  },
  methods: {
    back() {
      uni.navigateBack()
    },
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
    async done() {
      uni.showLoading({ title: '保存中...' })
      try {
        const preference = {
          serviceTypes: this.selTypes,
          maxPrice: this.maxPrice,
          nearOnly: this.nearOnly,
        }
        await savePreference(preference)
        uni.showToast({ title: '保存成功' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      } catch (e) {
        console.error('保存失败', e)
        uni.showToast({ title: '保存失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
  },
}
</script>

<style></style>
