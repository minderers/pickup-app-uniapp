<template>
  <view class="min-h-screen bg-gray-50 pb-20">
    <view class="p-6 space-y-6">
      <view class="bg-gradient-to-r from-primary to-purple-600 text-white rounded-3xl p-6 shadow-lg">
        <view class="text-sm opacity-80">平均匹配得分</view>
        <view class="flex items-end justify-between mt-3">
          <view class="flex items-baseline gap-2">
            <view class="text-52 font-bold leading-none">{{ fmt(info.avgMatchScore) }}</view>
            <view class="text-sm opacity-80">/100</view>
          </view>
          <view
            class="px-3 py-1 rounded-full text-xs border border-white border-opacity-25"
            style="background-color: rgba(255, 255, 255, 0.18);"
          >
            画像总览
          </view>
        </view>

        <view class="grid grid-cols-2 gap-3 mt-6">
          <view
            class="rounded-2xl p-4 border border-white border-opacity-20"
            style="background-color: rgba(255, 255, 255, 0.14);"
          >
            <view class="text-xs opacity-75">已完成订单</view>
            <view class="text-2xl font-bold mt-2">{{ info.totalOrders || 0 }}</view>
          </view>
          <view
            class="rounded-2xl p-4 border border-white border-opacity-20"
            style="background-color: rgba(255, 255, 255, 0.14);"
          >
            <view class="text-xs opacity-75">平均报酬</view>
            <view class="text-2xl font-bold mt-2">¥{{ fmt(info.avgPrice) }}</view>
          </view>
        </view>
      </view>

      <view v-if="(info.tags || []).length" class="bg-white rounded-3xl p-6 shadow-sm">
        <view class="text-18 font-bold text-gray-800 mb-4">画像标签</view>
        <view class="flex flex-wrap gap-3">
          <text
            v-for="t in info.tags"
            :key="t"
            :class="['px-3', 'py-1.5', 'text-xs', 'rounded-full', tagCls(t)]"
          >
            {{ t }}
          </text>
        </view>
      </view>

      <view class="bg-white rounded-3xl p-6 shadow-sm">
        <view class="text-18 font-bold text-gray-800 mb-5">接单统计</view>
        <view class="space-y-4">
          <view class="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
            <view>
              <view class="text-sm text-gray-500">总接单数</view>
              <view class="text-base font-semibold text-gray-800 mt-1">累计完成订单</view>
            </view>
            <view class="text-2xl font-bold text-primary">{{ info.totalOrders || 0 }}</view>
          </view>

          <view class="grid grid-cols-2 gap-3">
            <view class="p-4 rounded-2xl bg-green-50 border border-green-100">
              <view class="text-sm text-green-700">完成率</view>
              <view class="text-2xl font-bold text-green-600 mt-2">
                {{ Math.round(info.completionRate || 0) }}%
              </view>
              <view class="text-xs text-green-500 mt-1">订单完成比例</view>
            </view>
            <view class="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <view class="text-sm text-amber-700">好评率</view>
              <view class="text-2xl font-bold text-amber-600 mt-2">
                {{ Math.round(info.rating || 0) }}%
              </view>
              <view class="text-xs text-amber-500 mt-1">用户满意度</view>
            </view>
          </view>
        </view>
      </view>

      <view class="bg-white rounded-3xl p-6 shadow-sm">
        <view class="flex items-center justify-between mb-5">
          <view class="text-18 font-bold text-gray-800">高价值订单记录</view>
          <view class="text-xs text-gray-400">按金额排序</view>
        </view>

        <view v-if="(info.highValueOrders || []).length" class="space-y-3">
          <view
            v-for="(o, idx) in info.highValueOrders"
            :key="o.pkId"
            class="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100"
          >
            <view class="flex items-start justify-between gap-3">
              <view class="flex-1 min-w-0">
                <view class="text-sm font-semibold text-gray-800 line-clamp-2">
                  {{ o.orderType || '订单记录' }}
                </view>
                <view class="text-xs text-gray-500 mt-2 line-clamp-2">{{ o.content }}</view>
              </view>
              <view class="text-right shrink-0">
                <view class="text-lg font-bold text-primary">¥{{ o.price || 0 }}</view>
                <view class="text-[10px] text-amber-600 mt-1">排名 #{{ idx + 1 }}</view>
              </view>
            </view>
            <view class="mt-3 pt-3 border-t border-amber-100 text-xs text-gray-400">
              订单 #{{ o.pkId }}
            </view>
          </view>
        </view>
        <view v-else class="list-empty">暂无记录</view>
      </view>

      <view class="bg-white rounded-3xl p-6 shadow-sm">
        <view class="text-18 font-bold text-gray-800 mb-4">接单偏好优化建议</view>
        <view class="space-y-3">
          <view class="p-4 rounded-2xl bg-blue-50 border border-blue-100">
            <view class="text-sm font-medium text-blue-900 mb-1">报酬建议</view>
            <view class="text-xs leading-6 text-blue-700">
              您的平均报酬为 ¥{{ fmt(info.avgPrice) }}，建议优先关注
              ¥{{ Math.round((Number(info.avgPrice) || 0) * 0.8) }} -
              ¥{{ Math.round((Number(info.avgPrice) || 0) * 1.2) }} 区间的订单。
            </view>
          </view>
          <view class="p-4 rounded-2xl bg-green-50 border border-green-100">
            <view class="text-sm font-medium text-green-900 mb-1">服务优势</view>
            <view class="text-xs leading-6 text-green-700">
              当前完成率 {{ Math.round(info.completionRate || 0) }}%，好评率
              {{ Math.round(info.rating || 0) }}%，保持稳定服务有助于获得更多优质推荐。
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
    fmt(v) {
      const n = Number(v)
      if (!Number.isFinite(n)) return '0.00'
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
  },
}
</script>

<style></style>
