<template>
  <view class="min-h-screen bg-gray-50 p-6">
    <view class="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-6 text-white mb-6">
      <view class="text-[20px] font-bold">校园代取</view>
      <view class="text-sm opacity-80 mt-2">验证码登录（未注册手机号将自动创建账号）</view>
    </view>

    <view class="bg-white rounded-2xl p-6 shadow-sm">
      <view class="text-[18px] font-semibold text-gray-800 mb-5">手机号登录</view>
      <view class="space-y-4">
        <input
          class="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-200"
          v-model="phone"
          type="number"
          placeholder="请输入手机号"
        />
        <view class="flex gap-3">
          <input
            class="flex-1 py-3 px-4 rounded-lg bg-gray-50 border border-gray-200"
            v-model="code"
            type="number"
            placeholder="验证码"
          />
          <button
            class="px-4 py-2.5 rounded-lg text-sm"
            :class="countdown > 0 ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white'"
            @tap="onSend"
            :disabled="countdown > 0"
          >
            {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
          </button>
        </view>
        <button class="w-full py-3 bg-primary text-white rounded-lg font-medium" @tap="onLogin">登录</button>
      </view>
    </view>

    <view class="text-xs text-gray-400 mt-4 text-center">
      登录即表示同意《用户协议》和《隐私政策》
    </view>
  </view>
</template>
<script>
import { sendSms, loginByPhone } from '@/api/auth'
import { getProfile } from '@/api/user'
import { useUserStore } from '@/stores/user'
export default {
  data() {
    return { phone: '', code: '', countdown: 0, timer: null }
  },
  methods: {
    async onSend() {
      if (!this.phone) return
      await sendSms(this.phone)
      this.countdown = 60
      this.timer = setInterval(() => {
        if (this.countdown <= 0) {
          clearInterval(this.timer)
          return
        }
        this.countdown--
      }, 1000)
    },
    async onLogin() {
      if (!this.phone || !this.code) return
      const { data } = await loginByPhone(this.phone, this.code)
      const store = useUserStore()
      store.setToken(data.accessToken)
      // 登录 VO 只包含 token/phone，补拉一次 profile 才能拿到 role/avatar/nickname
      const p = await getProfile()
      store.setUserInfo(p.data || data)
      uni.switchTab({ url: '/pages/index/index' })
    },
  },
}
</script>
<style></style>
