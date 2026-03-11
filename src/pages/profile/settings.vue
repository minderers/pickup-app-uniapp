<template>
  <view class="p-6">
    <view class="bg-white rounded-2xl overflow-hidden shadow-sm">
      <view class="p-5 border-b border-gray-100 flex items-center justify-between" @tap="go('/pages/profile/edit')">
        <text class="text-gray-800">个人资料</text>
        <image class="w-5 h-5 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" />
      </view>
      <view class="p-5 border-b border-gray-100 flex items-center justify-between">
        <text class="text-gray-800">账号安全</text>
        <image class="w-5 h-5 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" />
      </view>
      <view class="p-5 border-b border-gray-100 flex items-center justify-between">
        <text class="text-gray-800">消息通知</text>
        <switch :checked="notify" @change="(e) => (notify = e.detail.value)" />
      </view>
      <view class="p-5 border-b border-gray-100 flex items-center justify-between">
        <text class="text-gray-800">语言设置</text>
        <view class="flex items-center gap-2">
          <text class="text-sm text-gray-500">简体中文</text>
          <image class="w-5 h-5 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" />
        </view>
      </view>
      <view class="p-5 flex items-center justify-between">
        <text class="text-gray-800">夜间模式</text>
        <switch :checked="dark" @change="(e) => (dark = e.detail.value)" />
      </view>
    </view>

    <view class="bg-white rounded-2xl overflow-hidden shadow-sm mt-4">
      <view class="p-5 border-b border-gray-100 flex items-center justify-between" @tap="clearCache">
        <text class="text-gray-800">清除缓存</text>
        <text class="text-sm text-gray-500">{{ cacheSize }}</text>
      </view>
      <view class="p-5 flex items-center justify-between">
        <text class="text-gray-800">关于我们</text>
        <view class="flex items-center gap-2">
          <text class="text-sm text-gray-500">v1.0.0</text>
          <image class="w-5 h-5 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg" />
        </view>
      </view>
    </view>

    <button class="w-full py-4 bg-white text-red-500 rounded-2xl mt-4 font-medium" @tap="onLogout">
      退出登录
    </button>
  </view>
</template>

<script>
import { logout } from '@/api/auth'
import { useUserStore } from '@/stores/user'

export default {
  data() {
    return { notify: true, dark: false, cacheSize: '—' }
  },
  onShow() {
    // 简化：用 storage 体积模拟
    try {
      const info = uni.getStorageInfoSync()
      this.cacheSize = `${Math.round((info.currentSize || 0) * 10) / 10}KB`
    } catch {
      this.cacheSize = '—'
    }
  },
  methods: {
    go(url) {
      uni.navigateTo({ url })
    },
    clearCache() {
      uni.clearStorageSync()
      uni.showToast({ title: '已清除' })
      this.cacheSize = '0KB'
    },
    async onLogout() {
      await logout()
      const s = useUserStore()
      s.clearUserInfo()
      uni.reLaunch({ url: '/pages/login/login' })
    },
  },
}
</script>

<style></style>

