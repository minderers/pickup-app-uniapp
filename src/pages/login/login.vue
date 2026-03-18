<template>
  <view class="min-h-screen bg-white">
    <!-- 顶部导航 -->
    <view class="px-6 pt-12 pb-4 flex items-center">
      <view class="p-2 -ml-2" @tap="back" v-if="canBack">
        <image class="svg" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />
      </view>
    </view>

    <view class="px-8 pt-8">
      <!-- 欢迎语 -->
      <view class="mb-12">
        <view class="text-3xl font-bold text-gray-900">欢迎回来</view>
        <view class="text-gray-400 mt-3 text-16">验证码登录，未注册手机号将自动注册</view>
      </view>

      <!-- 登录表单 -->
      <view class="space-y-8">
        <!-- 手机号 -->
        <view class="border-b border-gray-100 pb-2">
          <view class="text-xs text-gray-400 mb-1">手机号码</view>
          <view class="flex items-center">
            <text class="text-18 font-medium mr-4">+86</text>
            <input
              class="flex-1 h-12 text-18 font-medium"
              v-model="phone"
              type="number"
              maxlength="11"
              placeholder="请输入手机号"
              placeholder-class="text-gray-200"
            />
            <view v-if="phone" class="p-2" @tap="phone = ''">
              <image class="w-4 h-4 opacity-20" src="https://unpkg.com/lucide-static@latest/icons/x-circle.svg" />
            </view>
          </view>
        </view>

        <!-- 验证码 -->
        <view class="border-b border-gray-100 pb-2">
          <view class="text-xs text-gray-400 mb-1">验证码</view>
          <view class="flex items-center">
            <input
              class="flex-1 h-12 text-18 font-medium"
              v-model="code"
              type="number"
              maxlength="6"
              placeholder="请输入验证码"
              placeholder-class="text-gray-200"
            />
            <view 
              class="text-primary font-medium text-sm px-4 py-2 bg-indigo-50 rounded-full active:opacity-60"
              :class="countdown > 0 ? 'opacity-50 pointer-events-none' : ''"
              @tap="onSend"
            >
              {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
            </view>
          </view>
        </view>

        <!-- 登录按钮 -->
        <view class="pt-4">
          <view
            class="h-14 rounded-full flex-center font-bold text-lg transition-all shadow-lg shadow-indigo-100"
            :class="canLogin ? 'bg-primary text-white' : 'bg-gray-100 text-gray-300'"
            @tap="onLogin"
          >
            立即登录
          </view>
        </view>
      </view>

      <!-- 协议 -->
      <view class="mt-8 flex items-center justify-center gap-2">
        <checkbox 
          :checked="agreed" 
          @tap="agreed = !agreed" 
          color="#4F46E5" 
          style="transform: scale(0.6)" 
        />
        <view class="text-xs text-gray-400">
          我已阅读并同意
          <text class="text-primary" @tap="goProtocol('user')">《用户协议》</text>
          和
          <text class="text-primary" @tap="goProtocol('privacy')">《隐私政策》</text>
        </view>
      </view>

      <!-- 其他登录方式 (占位) -->
      <view class="mt-24">
        <view class="flex items-center gap-4 px-12 mb-8">
          <view class="h-px bg-gray-100 flex-1"></view>
          <text class="text-xs text-gray-300">其他方式登录</text>
          <view class="h-px bg-gray-100 flex-1"></view>
        </view>
        <view class="flex justify-center gap-12">
          <view class="w-12 h-12 rounded-full border border-gray-100 flex-center active:bg-gray-50">
            <image class="w-6 h-6" src="https://unpkg.com/lucide-static@latest/icons/message-circle.svg" />
          </view>
          <view class="w-12 h-12 rounded-full border border-gray-100 flex-center active:bg-gray-50">
            <image class="w-6 h-6" src="https://unpkg.com/lucide-static@latest/icons/apple.svg" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { sendSms, loginByPhone } from '@/api/auth'
import { getProfile } from '@/api/user'
import { useUserStore } from '@/stores/user'

export default {
  data() {
    return {
      phone: '',
      code: '',
      countdown: 0,
      timer: null,
      agreed: false,
      canBack: false
    }
  },
  computed: {
    canLogin() {
      return this.phone.length === 11 && this.code.length >= 4 && this.agreed
    }
  },
  onLoad() {
    const pages = getCurrentPages()
    this.canBack = pages.length > 1
  },
  onUnload() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    async onSend() {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        return uni.showToast({ title: '请输入正确手机号', icon: 'none' })
      }
      uni.showLoading({ title: '发送中...' })
      try {
        await sendSms(this.phone)
        uni.showToast({ title: '验证码已发送' })
        this.countdown = 60
        this.timer = setInterval(() => {
          if (this.countdown <= 0) {
            clearInterval(this.timer)
            return
          }
          this.countdown--
        }, 1000)
      } catch (e) {
        console.error(e)
      } finally {
        uni.hideLoading()
      }
    },
    async onLogin() {
      if (!this.canLogin) {
        if (!this.agreed) {
          return uni.showToast({ title: '请阅读并同意协议', icon: 'none' })
        }
        return
      }
      
      uni.showLoading({ title: '登录中...' })
      try {
        const { data } = await loginByPhone(this.phone, this.code)
        const store = useUserStore()
        store.setToken(data.accessToken)
        
        // 补全用户信息
        const p = await getProfile()
        store.setUserInfo(p.data || data)
        
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          uni.switchTab({ url: '/pages/index/index' })
        }, 1500)
      } catch (e) {
        console.error(e)
      } finally {
        uni.hideLoading()
      }
    },
    goProtocol(type) {
      uni.showToast({ title: '协议内容建设中', icon: 'none' })
    }
  }
}
</script>

<style scoped>
/* 可以在这里添加一些微调样式 */
</style>
