<template>
  <view class="min-h-screen bg-gray-50 pb-20">
    <!-- 顶部导航栏 -->
    <view
      class="bg-white px-6 pt-12 pb-4 sticky top-0 z-50 flex items-center justify-between shadow-sm"
    >
      <view class="flex items-center gap-4" @tap="back">
        <image class="svg" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />
      </view>
      <view class="text-18 font-bold text-gray-800">申请成为代取员</view>
      <view class="text-primary font-medium" @tap="submit">提交</view>
    </view>

    <view class="p-6">
      <view class="bg-white rounded-3xl p-6 space-y-6 shadow-sm">
        <view>
          <view class="text-sm text-gray-400 mb-2">真实姓名</view>
          <input
            class="w-full h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm"
            v-model="form.name"
            placeholder="请输入真实姓名"
            placeholder-class="text-gray-300"
          />
        </view>

        <view>
          <view class="text-sm text-gray-400 mb-2">身份证号</view>
          <input
            class="w-full h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm"
            v-model="form.idNo"
            placeholder="请输入身份证号"
            placeholder-class="text-gray-300"
          />
        </view>

        <view>
          <view class="text-sm text-gray-400 mb-2">手机号码</view>
          <input
            class="w-full h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm"
            v-model="form.phone"
            placeholder="请输入手机号码"
            placeholder-class="text-gray-300"
          />
        </view>

        <view>
          <view class="text-sm text-gray-400 mb-2">学生证照片</view>
          <view
            class="w-full rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center transition-all active:bg-gray-100"
            style="height: 320rpx"
            @tap="pick('studentCard')"
          >
            <image
              v-if="form.studentCard"
              class="w-full h-full rounded-2xl"
              :src="form.studentCard"
              mode="aspectFill"
            />
            <view v-else class="flex flex-col items-center justify-center">
              <image
                class="w-10 h-10 mb-3 opacity-80"
                mode="aspectFit"
                src="https://unpkg.com/lucide-static@latest/icons/camera.svg"
              />
              <text class="text-xs text-gray-400">点击上传学生证照片</text>
            </view>
          </view>
        </view>

        <view>
          <view class="text-sm text-gray-400 mb-2">个人照片</view>
          <view
            class="w-full rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center transition-all active:bg-gray-100"
            style="height: 320rpx"
            @tap="pick('selfie')"
          >
            <image
              v-if="form.selfie"
              class="w-full h-full rounded-2xl"
              :src="form.selfie"
              mode="aspectFill"
            />
            <view v-else class="flex flex-col items-center justify-center">
              <image
                class="w-10 h-10 mb-3 opacity-80"
                mode="aspectFit"
                src="https://unpkg.com/lucide-static@latest/icons/camera.svg"
              />
              <text class="text-xs text-gray-400">点击上传个人照片</text>
            </view>
          </view>
        </view>

        <view class="pt-4">
          <button
            class="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary bg-opacity-10 mb-4"
            @tap="submit"
          >
            提交申请
          </button>
          <view class="text-center text-xs text-gray-400"> 提交后我们将在3个工作日内完成审核 </view>
        </view>
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
      form: {
        name: '',
        idNo: '',
        phone: '',
        studentCard: '',
        selfie: '',
      },
    }
  },
  async onShow() {
    try {
      const { data } = await getApplyStatus()
      this.status = data || 'NONE'
    } catch (e) {
      this.status = 'NONE'
    }
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    statusText(s) {
      const map = {
        APPROVED: '已通过',
        PENDING: '审核中',
        NONE: '未申请',
        REJECTED: '已驳回',
      }
      return map[s] || String(s || '未申请')
    },
    async pick(key) {
      try {
        const chooseRes = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
        })
        const filePath = chooseRes.tempFilePaths?.[0]
        if (filePath) {
          this.form[key] = filePath
        }
      } catch (e) {
        console.error('选择图片失败', e)
      }
    },
    async submit() {
      if (!this.form.name || !this.form.idNo || !this.form.phone) {
        return uni.showToast({ icon: 'none', title: '请完善个人信息' })
      }
      if (!this.form.studentCard || !this.form.selfie) {
        return uni.showToast({ icon: 'none', title: '请上传相关照片' })
      }

      try {
        await applyCourier(this.form)
        uni.showToast({ title: '已提交申请' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (e) {
        uni.showToast({ icon: 'none', title: '提交失败，请稍后重试' })
      }
    },
  },
}
</script>

<style></style>
