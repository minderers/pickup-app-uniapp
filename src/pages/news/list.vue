<template>
  <view class="pb-20">
    <!-- 顶部导航（与设计稿一致：仅标题） -->
    <view class="bg-white shadow-sm p-4 sticky top-0 z-10">
      <view class="flex items-center justify-between">
        <button class="text-gray-600" @tap="back">
          <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />
        </button>
        <view class="text-lg font-semibold text-gray-800">公告咨询</view>
        <view class="w-5"></view>
      </view>
    </view>

    <view class="p-6">
      <view class="flex gap-3 mb-4">
        <input
          class="flex-1 py-3 px-4 rounded-lg bg-gray-100 text-sm"
          v-model="keyword"
          placeholder="搜索公告"
        />
        <button class="px-4 py-2.5 bg-primary text-white text-sm rounded-lg" @tap="onSearch">搜索</button>
      </view>

      <view class="bg-white rounded-xl overflow-hidden" v-if="list.length">
        <view
          class="p-5 border-b border-gray-100"
          v-for="n in list"
          :key="n.pkId"
          @tap="toDetail(n.pkId)"
        >
          <view class="flex justify-between items-start">
            <view class="font-medium text-gray-800">{{ n.title }}</view>
            <text class="text-xs text-gray-500">{{ dateText(n.createTime) }}</text>
          </view>
          <view class="text-sm text-gray-600 mt-2 line-clamp-2">{{ n.content }}</view>
        </view>
      </view>

      <view class="list-empty" v-else>暂无公告</view>
    </view>
  </view>
</template>
<script>
import { getNewsList } from '@/api/news'
export default {
  data() {
    return { keyword: '', list: [] }
  },
  async onShow() {
    await this.load()
  },
  methods: {
    async load() {
      const { data } = await getNewsList({ page: 1, size: 20, keyword: this.keyword })
      this.list = data.list || []
    },
    async onSearch() {
      await this.load()
    },
    back() {
      uni.navigateBack()
    },
    dateText(v) {
      if (!v) return ''
      return String(v).slice(0, 10)
    },
    toDetail(id) {
      uni.navigateTo({ url: '/pages/news/detail?id=' + id })
    },
  },
}
</script>
<style></style>
