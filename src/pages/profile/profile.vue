<template>
  <view class="pb-24">
    <!-- 顶部个人信息（渐变） -->
    <view class="bg-gradient-to-r from-primary to-purple-600 text-white p-6">
      <view class="flex items-center gap-4">
        <image class="w-16 h-16 rounded-full border-2 border-white bg-white/20" :src="user.avatar || def" />
        <view>
          <view class="text-xl font-bold">{{ user.nickname || '未登录' }}</view>
          <view class="text-sm opacity-80">{{ status.isVip === 1 ? '会员' : '普通会员' }}</view>
        </view>
        <button class="ml-auto" @tap="go('/pages/profile/settings')">
          <image class="w-6 h-6" src="https://unpkg.com/lucide-static@latest/icons/settings.svg" />
        </button>
      </view>

      <!-- 会员专区卡片 -->
      <view class="mt-6 bg-white/10 rounded-xl p-4" style="backdrop-filter: blur(10px)">
        <view class="flex justify-between items-center mb-3">
          <view class="font-semibold">会员专区</view>
          <button class="text-xs bg-white/20 px-3 py-1 rounded-full" @tap="go('/pages/vip/index')">
            {{ status.isVip === 1 ? '续费会员' : '升级会员' }}
          </button>
        </view>
        <view class="flex justify-around">
          <view class="text-center">
            <view class="text-lg font-bold">{{ points }}</view>
            <view class="text-xs opacity-80">积分</view>
          </view>
          <view class="text-center" @tap="go('/pages/vip/coupons')">
            <view class="text-lg font-bold">{{ couponCount }}</view>
            <view class="text-xs opacity-80">优惠券</view>
          </view>
          <view class="text-center">
            <view class="text-lg font-bold">¥{{ balance }}</view>
            <view class="text-xs opacity-80">余额</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 画像标签 -->
    <view class="p-4 bg-white">
      <view class="flex justify-between items-center mb-3">
        <view class="font-semibold text-gray-800">我的画像</view>
        <button class="text-sm text-primary" @tap="go('/pages/profile/preference')">编辑</button>
      </view>
      <view class="flex flex-wrap gap-2">
        <text v-for="t in tags" :key="t" class="px-3 py-1 text-xs rounded-full" :class="tagCls(t)">{{ t }}</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="p-4 pb-24">
      <view class="bg-white rounded-xl overflow-hidden shadow-sm">
        <view class="p-4 border-b border-gray-100 flex items-center justify-between" @tap="go('/pages/profile/edit')">
          <view class="flex items-center gap-3">
            <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/user.svg" />
            <text class="text-gray-800">个人资料</text>
          </view>
          <image class="w-5 h-5 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" />
        </view>

        <view class="p-4 border-b border-gray-100 flex items-center justify-between" @tap="go('/pages/vip/coupons')">
          <view class="flex items-center gap-3">
            <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/ticket.svg" />
            <text class="text-gray-800">优惠券</text>
          </view>
          <view class="flex items-center gap-2">
            <text class="text-xs text-gray-500">{{ couponCount }}张可用</text>
            <image class="w-5 h-5 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" />
          </view>
        </view>

        <view class="p-4 border-b border-gray-100 flex items-center justify-between" @tap="go('/pages/address/list')">
          <view class="flex items-center gap-3">
            <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/map-pin.svg" />
            <text class="text-gray-800">地址管理</text>
          </view>
          <image class="w-5 h-5 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" />
        </view>

        <view
          class="p-4 border-b border-gray-100 flex items-center justify-between"
          v-if="(user.role ?? 0) !== 1"
          @tap="go('/pages/courier/apply')"
        >
          <view class="flex items-center gap-3">
            <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/briefcase.svg" />
            <text class="text-gray-800">申请成为代取员</text>
          </view>
          <image class="w-5 h-5 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" />
        </view>

        <view
          class="p-4 border-b border-gray-100 flex items-center justify-between"
          v-if="(user.role ?? 0) === 1"
          @tap="go('/pages/courier/stats')"
        >
          <view class="flex items-center gap-3">
            <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/activity.svg" />
            <text class="text-gray-800">画像数据</text>
          </view>
          <image class="w-5 h-5 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" />
        </view>

        <view class="p-4 flex items-center justify-between" @tap="go('/pages/profile/preference')">
          <view class="flex items-center gap-3">
            <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/sliders.svg" />
            <text class="text-gray-800">画像偏好设置</text>
          </view>
          <image class="w-5 h-5 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" />
        </view>
      </view>

      <view class="bg-white rounded-xl overflow-hidden shadow-sm mt-4">
        <view class="p-4 border-b border-gray-100 flex items-center justify-between">
          <view class="flex items-center gap-3">
            <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/help-circle.svg" />
            <text class="text-gray-800">帮助中心</text>
          </view>
          <image class="w-5 h-5 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" />
        </view>
        <view class="p-4 flex items-center justify-between">
          <view class="flex items-center gap-3">
            <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/message-circle.svg" />
            <text class="text-gray-800">意见反馈</text>
          </view>
          <image class="w-5 h-5 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" />
        </view>
      </view>

      <!-- 画像数据快速摘要（对齐设计稿信息区） -->
      <view class="bg-white rounded-xl p-6 shadow-sm mt-4">
        <view class="flex justify-between my-2">
          <text class="text-gray-600">订单均价</text>
          <text class="text-gray-800">{{ portrait.avgOrderPrice || 0 }}</text>
        </view>
        <view class="flex justify-between my-2">
          <text class="text-gray-600">订单数</text>
          <text class="text-gray-800">{{ portrait.orderCount || 0 }}</text>
        </view>
        <view class="text-xs text-gray-400 mt-2">{{ user.phone || '' }}</view>
      </view>
    </view>
  </view>
</template>
<script>
import { getProfile, getPortrait } from '@/api/user'
import { getVipStatus, getMyCoupons } from '@/api/vip'
export default {
  data() {
    return {
      user: {},
      portrait: {},
      tags: [],
      def: '/static/logo.png',
      status: {},
      couponCount: 0,
      points: 12,
      balance: 50,
    }
  },
  async onShow() {
    const a = await getProfile()
    this.user = a.data || {}
    const b = await getPortrait()
    this.portrait = b.data || {}
    this.tags = b.data?.tags || []
    const s = await getVipStatus()
    this.status = s.data || {}
    const c = await getMyCoupons()
    this.couponCount = (c.data || []).filter((x) => x.status === 0).length
  },
  methods: {
    go(url) {
      uni.navigateTo({ url })
    },
    tagCls(t) {
      const s = String(t || '')
      if (s.includes('会员')) return 'bg-purple-100 text-purple-600'
      if (s.includes('快递')) return 'bg-primary/10 text-primary'
      if (s.includes('外卖')) return 'bg-secondary/10 text-secondary'
      if (s.includes('¥') || s.includes('以下')) return 'bg-accent/10 text-accent'
      if (s.includes('活跃') || s.includes('新')) return 'bg-gray-100 text-gray-700'
      return 'bg-gray-100 text-gray-700'
    },
  },
}
</script>
<style></style>
