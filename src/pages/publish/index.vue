<template>
  <view class="p-6 pb-24">
    <view class="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-6 text-white mb-6">
      <view class="text-[18px] font-semibold">发布代取</view>
      <view class="text-xs opacity-80 mt-2">选择服务类型，填写取件与送达信息</view>
      <view class="flex flex-wrap gap-2 mt-4">
        <text class="px-3 py-1 bg-white/15 rounded-full text-xs">推荐取件点</text>
        <text class="px-3 py-1 bg-white/15 rounded-full text-xs">推荐代取员</text>
        <text class="px-3 py-1 bg-white/15 rounded-full text-xs">快速支付</text>
      </view>
    </view>

    <view class="section-title">选择服务</view>
    <view class="grid grid-cols-4 gap-4 mb-6">
      <view class="flex flex-col items-center" @tap="setType('快递代取')">
        <view :class="['w-[88px] h-[88px] rounded-2xl flex items-center justify-center mb-2', type==='快递代取'?'bg-primary/20':'bg-primary/10']">
          <image class="w-12 h-12" src="https://unpkg.com/lucide-static@latest/icons/package.svg" />
        </view>
        <text class="text-xs text-gray-700">快递代取</text>
      </view>
      <view class="flex flex-col items-center" @tap="setType('外卖代取')">
        <view :class="['w-[88px] h-[88px] rounded-2xl flex items-center justify-center mb-2', type==='外卖代取'?'bg-secondary/20':'bg-secondary/10']">
          <image class="w-12 h-12" src="https://unpkg.com/lucide-static@latest/icons/coffee.svg" />
        </view>
        <text class="text-xs text-gray-700">外卖代取</text>
      </view>
      <view class="flex flex-col items-center" @tap="setType('超市代购')">
        <view :class="['w-[88px] h-[88px] rounded-2xl flex items-center justify-center mb-2', type==='超市代购'?'bg-accent/20':'bg-accent/10']">
          <image class="w-12 h-12" src="https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg" />
        </view>
        <text class="text-xs text-gray-700">超市代购</text>
      </view>
      <view class="flex flex-col items-center" @tap="setType('其他服务')">
        <view :class="['w-[88px] h-[88px] rounded-2xl flex items-center justify-center mb-2', type==='其他服务'?'bg-purple-200':'bg-purple-100']">
          <image class="w-12 h-12" src="https://unpkg.com/lucide-static@latest/icons/more-horizontal.svg" />
        </view>
        <text class="text-xs text-gray-700">其他服务</text>
      </view>
    </view>

    <view class="bg-white rounded-2xl p-6 shadow-sm">
      <view class="text-[15px] font-semibold mb-3">快速发布</view>
      <view class="text-xs text-gray-500 mb-4">会跳转到下单页继续完善信息</view>
      <button class="bg-primary text-white rounded-xl py-3" @tap="goCreate">去填写订单</button>
    </view>

    <view class="fixed left-0 right-0 bottom-0 px-6 pb-8 pt-3 bg-white/80" style="backdrop-filter: blur(10px)">
      <button class="bg-primary text-white rounded-full py-4 text-[16px]" @tap="goCreate">
        + 立即发布
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return { type: '快递代取' }
  },
  methods: {
    setType(t) {
      this.type = t
    },
    goCreate() {
      uni.navigateTo({ url: '/pages/orders/create?type=' + encodeURIComponent(this.type) })
    },
  },
}
</script>

<style></style>

