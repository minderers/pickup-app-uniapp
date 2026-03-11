<template>
  <view class="p-6">
    <view class="flex flex-wrap gap-4 mb-4">
      <view
        :class="[
          'px-3 py-2 rounded-full bg-gray-100',
          status === null ? 'bg-primary text-white' : '',
        ]"
        @tap="setStatus(null)"
        >全部</view
      >
      <view
        :class="['px-3 py-2 rounded-full bg-gray-100', status === 2 ? 'bg-primary text-white' : '']"
        @tap="setStatus(2)"
        >已接单</view
      >
      <view
        :class="['px-3 py-2 rounded-full bg-gray-100', status === 3 ? 'bg-primary text-white' : '']"
        @tap="setStatus(3)"
        >已完成</view
      >
    </view>
    <view class="space-y-4">
      <view class="bg-white rounded-xl p-4 shadow-sm" v-for="o in list" :key="o.pkId">
        <view class="text-[15px]">{{ o.content }}</view>
        <view class="text-gray-500 mt-1">￥{{ o.price }} 状态{{ o.status }}</view>
      </view>
    </view>
  </view>
</template>
<script>
import { getMyCourierOrders } from '@/api/courier'
export default {
  data() {
    return { status: null, list: [] }
  },
  async onShow() {
    await this.load()
  },
  methods: {
    async load() {
      const p = { page: 1, size: 20 }
      if (this.status !== null) p.status = this.status
      const { data } = await getMyCourierOrders(p)
      this.list = data.list || []
    },
    async setStatus(s) {
      this.status = s
      await this.load()
    },
  },
}
</script>
<style></style>
