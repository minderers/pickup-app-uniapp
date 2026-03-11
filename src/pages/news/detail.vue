<template>
  <view class="p-6">
    <view class="text-18 font-semibold">{{ info.title }}</view>
    <image class="w-full h-90 rounded-xl my-4 bg-gray-100" :src="info.cover" />
    <view class="leading-relaxed">{{ info.content }}</view>
  </view>
</template>
<script>
import { getNewsDetail } from '@/api/news'
export default {
  data() {
    return { info: {} }
  },
  async onLoad(q) {
    const { data } = await getNewsDetail(q.id)
    this.info = data || {}
  },
}
</script>
<style></style>
