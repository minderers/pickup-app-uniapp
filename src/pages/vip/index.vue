<template>
  <view class="p-6">
    <view class="bg-white rounded-xl p-6 shadow-sm mb-4">
      <view class="flex justify-between my-2"><view>会员状态</view><view>{{ status.isVip === 1 ? '已开通' : '未开通' }}</view></view>
      <view class="flex justify-between my-2"><view>有效期</view><view>{{ status.vipTime ? status.vipTime : '' }}</view></view>
    </view>
    <view class="font-semibold my-3">会员产品</view>
    <view class="space-y-3">
      <view class="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between" v-for="v in products" :key="v.pkId">
        <view>
          <view class="text-[30rpx]">{{ v.name }}</view>
          <view class="text-gray-500 text-xs">￥{{ v.price }}/{{ v.duration }}天</view>
        </view>
        <button size="mini" @tap="open(v.pkId)">开通/续费</button>
      </view>
    </view>
  </view>
</template>
<script>
import { getVipProducts, getVipStatus, openVip } from '@/api/vip'
export default {
  data() {
    return { products: [], status: {} }
  },
  async onShow() {
    const a = await getVipStatus()
    this.status = a.data || {}
    const b = await getVipProducts()
    this.products = b.data || []
  },
  methods: {
    async open(id) {
      await openVip(id)
      const a = await getVipStatus()
      this.status = a.data || {}
      uni.showToast({ title: '操作成功' })
    },
  },
}
</script>
<style></style>
