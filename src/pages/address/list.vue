<template>
  <view class="pb-20">
    <view class="bg-white shadow-sm p-4 sticky top-0 z-10">
      <view class="flex items-center justify-between">
        <button class="text-gray-600" @tap="back">
          <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />
        </button>
        <view class="text-lg font-semibold text-gray-800">地址管理</view>
        <button class="text-primary font-medium" @tap="add">添加</button>
      </view>
    </view>

    <view class="p-6">
      <view v-if="list.length" class="space-y-4">
        <view class="bg-white rounded-xl p-5 shadow-sm" v-for="a in list" :key="a.pkId">
          <view class="flex items-start justify-between">
            <view>
              <view class="flex items-center gap-2 mb-2">
                <text class="font-medium text-gray-800">{{ a.name || '—' }}</text>
                <text class="text-xs text-gray-500">{{ a.phone || '' }}</text>
                <text v-if="a.isDefault === 1" class="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full"
                  >默认</text
                >
              </view>
              <view class="text-sm text-gray-600">{{ a.region || '' }} {{ a.detail || '' }}</view>
            </view>
            <view class="flex gap-2">
              <button class="p-2" @tap.stop="edit(a.pkId)">
                <image class="w-4 h-4 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/edit-2.svg" />
              </button>
              <button class="p-2" @tap.stop="del(a.pkId)">
                <image class="w-4 h-4 opacity-50" src="https://unpkg.com/lucide-static@latest/icons/trash-2.svg" />
              </button>
            </view>
          </view>
        </view>
      </view>
      <view class="list-empty" v-else>暂无地址</view>
    </view>
  </view>
</template>
<script>
import { listAddress, removeAddress } from '@/api/address'
export default {
  data() {
    return { list: [] }
  },
  async onShow() {
    const { data } = await listAddress()
    this.list = data || []
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    add() {
      uni.navigateTo({ url: '/pages/address/edit' })
    },
    edit(id) {
      uni.navigateTo({ url: '/pages/address/edit?id=' + id })
    },
    async del(id) {
      await removeAddress(id)
      const { data } = await listAddress()
      this.list = data || []
    },
  },
}
</script>
<style></style>
