<template>
  <view class="min-h-screen bg-gray-50 pb-32">
    <!-- 顶部个人信息（渐变） -->
    <view class="bg-gradient-to-r from-primary to-purple-600 text-white p-6 pt-12 pb-12">
      <view class="flex items-center gap-4">
        <image
          class="w-18 h-18 rounded-full border-2 border-white bg-white bg-opacity-20 shadow-lg"
          mode="aspectFill"
          :src="user.avatar || def"
        />
        <view>
          <view class="text-xl font-bold">{{ user.nickname || '同学A' }}</view>
          <view class="text-sm opacity-80 mt-1">{{
            status.isVip === 1 ? '高级会员' : '普通会员'
          }}</view>
        </view>
      </view>

      <!-- 会员专区卡片 -->
      <view
        class="mt-8 bg-white bg-opacity-10 rounded-3xl p-6 shadow-sm"
        style="backdrop-filter: blur(10px)"
      >
        <view class="flex justify-between items-center mb-6">
          <view class="text-16 font-bold">会员专区</view>
          <button
            class="text-14 bg-white bg-opacity-20 px-2 py-1 rounded-full text-white m-0 border-none"
            @tap="go('/pages/vip/index')"
          >
            {{ status.isVip === 1 ? '续费会员' : '升级会员' }}
          </button>
        </view>
        <view class="flex justify-between px-2">
          <view class="text-center">
            <view class="text-20 font-bold">{{ points || 0 }}</view>
            <view class="text-[10px] opacity-80 mt-1">积分</view>
          </view>
          <view class="text-center" @tap="go('/pages/vip/coupons')">
            <view class="text-20 font-bold">{{ couponCount || 0 }}</view>
            <view class="text-[10px] opacity-80 mt-1">优惠券</view>
          </view>
          <view class="text-center">
            <view class="text-20 font-bold">¥{{ balance || 0 }}</view>
            <view class="text-[10px] opacity-80 mt-1">余额</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 我的画像 -->
    <view class="px-6 py-6 bg-white flex items-center justify-between">
      <view class="text-18 font-bold text-gray-800">我的画像</view>
      <view v-if="userRole === 1" class="text-sm text-primary" @tap="go('/pages/courier/stats')"
        >查看画像数据</view
      >
    </view>
    <view class="px-6 pb-6 bg-white flex flex-wrap gap-3">
      <text
        v-for="tag in displayTags"
        :key="tag"
        :class="['px-4', 'py-1', 'text-xs', 'rounded-full', tagCls(tag)]"
        >{{ tag }}</text
      >
      <text v-if="!displayTags.length" class="text-xs text-gray-400">暂无标签</text>
    </view>
    <view v-if="userRole === 1 && courierStats" class="px-6 pb-6 bg-white">
      <view class="grid grid-cols-3 gap-3">
        <view class="p-4 rounded-2xl bg-purple-50 text-purple-700 text-center">
          <view class="text-xs opacity-70 mb-1">平均匹配得分</view>
          <view class="text-20 font-bold">{{ Math.round(courierStats.avgMatchScore || 0) }}</view>
        </view>
        <view class="p-4 rounded-2xl bg-green-50 text-green-700 text-center">
          <view class="text-xs opacity-70 mb-1">完成率</view>
          <view class="text-20 font-bold">{{ Math.round(courierStats.completionRate || 0) }}%</view>
        </view>
        <view class="p-4 rounded-2xl bg-amber-50 text-amber-700 text-center">
          <view class="text-xs opacity-70 mb-1">高价值记录</view>
          <view class="text-20 font-bold">{{ (courierStats.highValueOrders || []).length }}</view>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="p-6 space-y-6">
      <view class="bg-white rounded-3xl overflow-hidden shadow-sm">
        <view
          class="p-5 border-b border-gray-50 flex items-center justify-between"
          @tap="go('/pages/profile/edit')"
        >
          <view class="flex items-center gap-4">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/user.svg"
            />
            <text class="text-15 text-gray-800">个人资料</text>
          </view>
          <image
            class="svg opacity-30"
            mode="aspectFit"
            src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg"
          />
        </view>

        <view
          class="p-5 border-b border-gray-50 flex items-center justify-between"
          @tap="go('/pages/vip/coupons')"
        >
          <view class="flex items-center gap-4">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/ticket.svg"
            />
            <text class="text-15 text-gray-800">优惠券</text>
          </view>
          <view class="flex items-center gap-2">
            <text class="text-xs text-gray-400">{{ couponCount }}张可用</text>
            <image
              class="svg opacity-30"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg"
            />
          </view>
        </view>

        <view
          class="p-5 border-b border-gray-50 flex items-center justify-between"
          @tap="go('/pages/address/list')"
        >
          <view class="flex items-center gap-4">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/map-pin.svg"
            />
            <text class="text-15 text-gray-800">地址管理</text>
          </view>
          <image
            class="svg opacity-30"
            mode="aspectFit"
            src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg"
          />
        </view>

        <view
          v-if="userRole === 0"
          class="p-5 border-b border-gray-50 flex items-center justify-between"
          @tap="go('/pages/courier/apply')"
        >
          <view class="flex items-center gap-4">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/briefcase.svg"
            />
            <text class="text-15 text-gray-800">申请成为代取员</text>
          </view>
          <image
            class="svg opacity-30"
            mode="aspectFit"
            src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg"
          />
        </view>

        <view
          v-if="userRole === 1"
          class="p-5 border-b border-gray-50 flex items-center justify-between"
          @tap="go('/pages/courier/stats')"
        >
          <view class="flex items-center gap-4">
            <image
              class="svg"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/bar-chart-2.svg"
            />
            <text class="text-15 text-gray-800">画像数据</text>
          </view>
          <image
            class="svg opacity-30"
            mode="aspectFit"
            src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg"
          />
        </view>

        <!-- 画像偏好设置入口取消：由后端算法生成画像，前端仅展示 -->
      </view>

      <!-- 退出登录 -->
      <view
        class="bg-white rounded-3xl p-5 mt-6 shadow-sm flex-center text-red-500 font-medium active:opacity-60"
        @tap="logout"
      >
        退出登录
      </view>
    </view>
  </view>
</template>

<script>
import { getProfile, getPortrait, getRole } from '@/api/user'
import { getCourierStats } from '@/api/courier'
import { getVipStatus, getMyCoupons } from '@/api/vip'
import { logout as apiLogout } from '@/api/auth'

export default {
  data() {
    return {
      user: {},
      portrait: {},
      tags: [],
      def: '/static/logo.png',
      status: {},
      couponCount: 0,
      points: 0,
      balance: 0,
      userRole: 0,
      courierStats: null,
    }
  },
  computed: {
    displayTags() {
      if (this.userRole === 1) {
        return this.courierStats && this.courierStats.tags ? this.courierStats.tags : []
      }
      return this.portrait && this.portrait.tags ? this.portrait.tags : []
    },
  },
  async onShow() {
    try {
      const a = await getProfile()
      this.user = a.data || {}

      const b = await getPortrait()
      this.portrait = b.data || {}
      this.tags = b.data?.tags || []

      const s = await getVipStatus()
      this.status = s.data || {}

      const c = await getMyCoupons()
      this.couponCount = (c.data || []).filter((x) => x.status === 0).length

      // 某些后端环境可能没有 user/role 接口：不应影响个人页渲染
      try {
        const r = await getRole(true)
        this.userRole = r.data?.role ?? 0
        if (this.userRole === 1) {
          try {
            const { data } = await getCourierStats()
            this.courierStats = data || null
          } catch (e) {
            this.courierStats = null
          }
        } else {
          this.courierStats = null
        }
      } catch (e) {
        this.userRole = 0
        this.courierStats = null
      }

      // 从用户数据中获取积分和余额（如果后端支持）
      this.points = this.user.points || 0
      this.balance = this.user.balance || 0
    } catch (e) {
      console.error('加载个人信息失败', e)
    }
  },
  methods: {
    go(url) {
      uni.navigateTo({ url })
    },
    tagCls(t) {
      const s = String(t || '')
      if (s.includes('会员')) return 'bg-purple-50 text-purple-600'
      if (s.includes('高匹配')) return 'bg-purple-50 text-purple-600'
      if (s.includes('价格')) return 'bg-amber-50 text-amber-600'
      if (s.includes('完成率')) return 'bg-green-50 text-green-600'
      if (s.includes('新手')) return 'bg-gray-100 text-gray-700'
      if (s.includes('高价值')) return 'bg-orange-50 text-orange-600'
      if (s.includes('节省')) return 'bg-blue-50 text-blue-600'
      if (s.includes('快递')) return 'bg-blue-50 text-blue-500'
      if (s.includes('外卖')) return 'bg-green-50 text-green-500'
      if (s.includes('¥') || s.includes('以下')) return 'bg-yellow-50 text-yellow-500'
      return 'bg-gray-100 text-gray-700'
    },
    async logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await apiLogout()
            } catch (e) {}
            uni.removeStorageSync('token')
            uni.reLaunch({ url: '/pages/login/login' })
          }
        },
      })
    },
  },
}
</script>

<style></style>
