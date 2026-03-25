<template>
  <view class="min-h-screen bg-gray-50 pb-20">
    <!-- 顶部导航 -->
    <view
      class="bg-white px-6 pt-12 pb-4 sticky top-0 z-50 flex items-center justify-between shadow-sm"
    >
      <view class="flex items-center gap-4" @tap="back">
        <image class="svg" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />

        <view class="text-18 font-bold text-gray-800">画像数据</view>
        <view class="w-10"></view>
      </view>

      <view class="p-6 space-y-6">
        <!-- 匹配得分卡片 -->
        <view
          class="bg-gradient-to-r from-primary to-purple-600 text-white rounded-3xl p-8 shadow-lg"
        >
          <view class="text-sm opacity-80 mb-2">平均匹配得分</view>
          <view class="flex items-baseline gap-2 mb-6">
            <view class="text-56 font-bold">{{ fmt(info.avgMatchScore) }}</view>
            <view class="text-sm opacity-80">/100</view>
          </view>
          <view class="flex items-center justify-between">
            <view>
              <view class="text-sm opacity-80">已完成订单</view>
              <view class="text-24 font-bold mt-1">{{ info.totalOrders || 0 }}</view>
            </view>
            <view>
              <view class="text-sm opacity-80">平均报酬</view>
              <view class="text-24 font-bold mt-1">¥{{ fmt(info.avgPrice) }}</view>
            </view>
          </view>
          <!-- 画像标签 -->
          <view class="bg-white rounded-3xl p-6 shadow-sm" v-if="(info.tags || []).length">
            <view class="text-18 font-bold text-gray-800 mb-4">画像标签</view>
            <view class="flex flex-wrap gap-3">
              <text
                v-for="t in info.tags"
                :key="t"
                :class="['px-3', 'py-1', 'text-xs', 'rounded-full', tagCls(t)]"
                >{{ t }}</text
              >
            </view>
          </view>
          <!-- 统计信息 -->
          <view class="bg-white rounded-3xl p-6 shadow-sm">
            <view class="text-18 font-bold text-gray-800 mb-6">接单统计</view>
            <view class="flex items-center gap-3">
              <view class="w-10 h-10 rounded-full bg-blue-50 flex-center">
                <image
                  class="w-5 h-5"
                  src="https://unpkg.com/lucide-static@latest/icons/package.svg"
                />
              </view>
              <view>
                <view class="text-sm text-gray-600">总接单数</view>
                <view class="text-xs text-gray-400 mt-1">本月数据</view>
              </view>
            </view>
            <view class="text-20 font-bold text-primary">{{ info.totalOrders || 0 }}</view>
          </view>
          <view class="flex items-center justify-between pb-4 border-b border-gray-100">
            <view class="flex items-center gap-3">
              <view class="w-10 h-10 rounded-full bg-green-50 flex-center">
                <image
                  class="w-5 h-5"
                  src="https://unpkg.com/lucide-static@latest/icons/check-circle.svg"
                />
              </view>
              <view>
                <view class="text-sm text-gray-600">完成率</view>
                <view class="text-xs text-gray-400 mt-1">订单完成比例</view>
              </view>
            </view>
            <view class="text-20 font-bold text-green-500"
              >{{ Math.round(info.completionRate || 0) }}%</view
            >
          </view>
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-3">
              <view class="w-10 h-10 rounded-full bg-yellow-50 flex-center">
                <image
                  class="w-5 h-5"
                  src="https://unpkg.com/lucide-static@latest/icons/star.svg"
                />
              </view>
              <view>
                <view class="text-sm text-gray-600">好评率</view>
                <view class="text-xs text-gray-400 mt-1">用户满意度</view>
              </view>
            </view>
            <view class="text-20 font-bold text-yellow-500"
              >{{ Math.round(info.rating || 0) }}%</view
            >
          </view>
        </view>
      </view>

      <!-- 高价值订单 -->
      <view class="bg-white rounded-3xl p-6 shadow-sm">
        <view class="text-18 font-bold text-gray-800 mb-6">高价值订单记录</view>
        <view v-if="(info.highValueOrders || []).length" class="space-y-3">
          <view
            class="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100"
            v-for="(o, idx) in info.highValueOrders"
            :key="o.pkId"
          >
            <view class="flex items-start justify-between mb-2">
              <view class="text-sm font-medium text-gray-800 line-clamp-2">{{
                o.orderType || ''
              }}</view>
              <view class="text-18 font-bold text-primary">¥{{ o.price || 0 }}</view>
            </view>
            <view class="text-xs text-gray-500 line-clamp-1">{{ o.content }}</view>
            <view class="flex items-center justify-between mt-3 pt-3 border-t border-amber-100">
              <text class="text-xs text-gray-400">订单 #{{ o.pkId }}</text>
              <text class="text-xs text-amber-600">排名 #{{ idx + 1 }}</text>
            </view>
          </view>
        </view>
        <view class="list-empty" v-else>暂无记录</view>
      </view>

      <!-- 优化建议 -->
      <view class="bg-white rounded-3xl p-6 shadow-sm">
        <view class="text-18 font-bold text-gray-800 mb-4">接单偏好优化建议</view>
        <view class="space-y-3">
          <view class="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <view class="text-sm font-medium text-blue-900 mb-1">💡 提示</view>
            <view class="text-xs text-blue-700"
              >您的平均报酬为 ¥{{ fmt(info.avgPrice) }}，建议关注价格在 ¥{{
                Math.round(info.avgPrice * 0.8)
              }}-¥{{ Math.round(info.avgPrice * 1.2) }} 的订单</view
            >
          </view>
          <view class="p-4 rounded-xl bg-green-50 border border-green-100">
            <view class="text-sm font-medium text-green-900 mb-1">✨ 优势</view>
            <view class="text-xs text-green-700">
              您的完成率为 {{ Math.round(info.completionRate || 0) }}%，好评率为
              {{ Math.round(info.rating || 0) }}%，继续保持优质服务
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { getCourierStats } from '@/api/courier'
import { getRole } from '@/api/user'
export default {
  data() {
    return { info: {} }
  },
  async onShow() {
    try {
      const { data: roleData } = await getRole(true)
      const role = roleData?.role ?? 0
      if (role !== 1) {
        uni.navigateTo({ url: '/pages/courier/apply' })
        return
      }
    } catch (e) {
      uni.navigateTo({ url: '/pages/courier/apply' })
      return
    }
    const { data } = await getCourierStats()
    this.info = data || {}
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    fmt(v) {
      const n = Number(v)
      if (!Number.isFinite(n)) return '0'
      return n.toFixed(2)
    },
    tagCls(t) {
      const s = String(t || '')
      if (s.includes('高匹配')) return 'bg-purple-50 text-purple-600'
      if (s.includes('价格')) return 'bg-amber-50 text-amber-600'
      if (s.includes('完成率')) return 'bg-green-50 text-green-600'
      if (s.includes('新手')) return 'bg-gray-100 text-gray-700'
      if (s.includes('高价值')) return 'bg-orange-50 text-orange-600'
      if (s.includes('节省')) return 'bg-blue-50 text-blue-600'
      return 'bg-gray-100 text-gray-700'
    },
    guessType(content) {
      const c = String(content || '')
      if (c.includes('外卖')) return '外卖代取'
      if (c.includes('超市') || c.includes('代购')) return '超市代购'
      return '快递代取'
    },
  },
}
</script>

<style></style>
