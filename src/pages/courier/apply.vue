<template>
  <view class="pb-20">
    <view class="bg-white shadow-sm p-4 sticky top-0 z-10">
      <view class="flex items-center justify-between">
        <button class="text-gray-600" @tap="back">
          <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />
        </button>
        <view class="text-lg font-semibold text-gray-800">申请成为代取员</view>
        <button class="text-primary font-medium" @tap="submit">提交</button>
      </view>
    </view>

    <view class="p-6">
      <view class="bg-white rounded-xl p-5 space-y-4 shadow-sm">
        <view class="flex items-center justify-between">
          <text class="text-sm text-gray-600">当前状态</text>
          <text class="text-sm text-gray-800">{{ statusText(status) }}</text>
        </view>

        <view>
          <view class="text-sm font-medium text-gray-500 mb-2">真实姓名</view>
          <input class="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-200" v-model="form.name" placeholder="请输入真实姓名" />
        </view>
        <view>
          <view class="text-sm font-medium text-gray-500 mb-2">身份证号</view>
          <input class="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-200" v-model="form.idNo" placeholder="请输入身份证号" />
        </view>
        <view>
          <view class="text-sm font-medium text-gray-500 mb-2">手机号码</view>
          <input class="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-200" v-model="form.phone" placeholder="请输入手机号码" />
        </view>

        <view>
          <view class="text-sm font-medium text-gray-500 mb-2">学生证照片</view>
          <view class="w-full rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center" style="height: 260rpx" @tap="pick('studentCard')">
            <image v-if="form.studentCard" class="w-full h-full object-cover rounded-lg" :src="form.studentCard" mode="aspectFill" />
            <view v-else class="flex flex-col items-center justify-center">
              <image class="w-8 h-8 opacity-60 mb-2" src="https://unpkg.com/lucide-static@latest/icons/camera.svg" />
              <text class="text-sm text-gray-500">点击上传学生证照片</text>
            </view>
          </view>
        </view>

        <view>
          <view class="text-sm font-medium text-gray-500 mb-2">个人照片</view>
          <view class="w-full rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center" style="height: 260rpx" @tap="pick('selfie')">
            <image v-if="form.selfie" class="w-full h-full object-cover rounded-lg" :src="form.selfie" mode="aspectFill" />
            <view v-else class="flex flex-col items-center justify-center">
              <image class="w-8 h-8 opacity-60 mb-2" src="https://unpkg.com/lucide-static@latest/icons/camera.svg" />
              <text class="text-sm text-gray-500">点击上传个人照片</text>
            </view>
          </view>
        </view>

        <button class="w-full py-3 bg-primary text-white rounded-lg font-medium" @tap="submit">提交申请</button>
        <text class="text-xs text-gray-500 text-center">提交后我们将在3个工作日内完成审核</text>
      </view>
    </view>
  </view>
</template>
<script>
import { applyCourier, getApplyStatus } from '@/api/courier'
export default {
  data() {
    return {
      status: 'NONE',
      form: { name: '', idNo: '', phone: '', studentCard: '', selfie: '' },
    }
  },
  async onShow() {
    const { data } = await getApplyStatus()
    this.status = data
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    statusText(s) {
      if (s === 'APPROVED') return '已通过'
      if (s === 'PENDING') return '审核中'
      if (s === 'NONE') return '未申请'
      return String(s || '-')
    },
    async pick(key) {
      const chooseRes = await uni.chooseImage({ count: 1, sizeType: ['compressed'] })
      const filePath = chooseRes.tempFilePaths?.[0]
      if (!filePath) return
      this.form[key] = filePath
    },
    async submit() {
      await applyCourier()
      const { data } = await getApplyStatus()
      this.status = data
      uni.showToast({ title: '已提交' })
    },
  },
}
</script>
<style></style>
