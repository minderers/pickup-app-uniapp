<template>
  <view class="min-h-screen bg-gray-50 pb-20">
    <view class="p-6">
      <view class="bg-white rounded-3xl p-6 shadow-sm">
        <!-- 标题 -->
        <view class="text-22 font-bold text-gray-900 mb-4">{{ info.title }}</view>

        <!-- 元信息 -->
        <view class="flex items-center gap-4 pb-6 border-b border-gray-100">
          <view class="flex items-center gap-2">
            <image
              class="w-6 h-6 rounded-full bg-gray-200"
              src="https://unpkg.com/lucide-static@latest/icons/calendar.svg"
            />
            <text class="text-xs text-gray-500">{{ formatDate(info.createTime) }}</text>
          </view>
          <view class="flex items-center gap-2">
            <image
              class="w-6 h-6 rounded-full bg-gray-200"
              src="https://unpkg.com/lucide-static@latest/icons/eye.svg"
            />
            <text class="text-xs text-gray-500">{{ views }}次浏览</text>
          </view>
        </view>

        <!-- 封面图 -->
        <image
          v-if="info.cover"
          class="w-full h-80 rounded-2xl my-6 bg-gray-100 object-cover"
          :src="info.cover"
          mode="aspectFill"
        />

        <!-- 内容 -->
        <view class="text-16 leading-relaxed text-gray-700 mb-8">
          {{ info.content }}
        </view>

        <!-- 标签 -->
        <view v-if="info.tags" class="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
          <text
            v-for="tag in (info.tags || '').split(',')"
            :key="tag"
            class="px-3 py-1 bg-primary bg-opacity-10 text-primary text-xs rounded-full"
          >
            {{ tag }}
          </text>
        </view>
      </view>

      <!-- 相关推荐 -->
      <view class="mt-8">
        <view class="text-18 font-bold text-gray-800 mb-4">相关推荐</view>
        <view class="space-y-3">
          <view
            class="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3"
            v-for="n in relatedNews"
            :key="n.pkId"
            @tap="toDetail(n.pkId)"
          >
            <image
              v-if="n.cover"
              class="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 object-cover"
              :src="n.cover"
              mode="aspectFill"
            />
            <view class="flex-1 min-w-0">
              <view class="text-sm font-medium text-gray-800 line-clamp-2">{{ n.title }}</view>
              <view class="text-xs text-gray-400 mt-2">{{ formatDate(n.createTime) }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { getNewsDetail, getNewsList } from '@/api/news'
export default {
  data() {
    return { info: {}, relatedNews: [], views: 0 }
  },
  async onLoad(q) {
    const { data } = await getNewsDetail(q.id)
    this.info = data || {}
    this.views = Math.floor(Math.random() * 1000) + 100
    
    // 加载相关推荐
    const { data: list } = await getNewsList({ page: 1, size: 3 })
    this.relatedNews = (list.list || []).filter(n => n.pkId !== q.id).slice(0, 3)
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    formatDate(t) {
      if (!t) return '-'
      return String(t).slice(0, 10)
    },
    toDetail(id) {
      uni.navigateTo({ url: '/pages/news/detail?id=' + id })
    },
  },
}
</script>

<style></style>
