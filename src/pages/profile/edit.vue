<template>
  <view class="min-h-screen bg-gray-50 pb-20">
    <!-- 顶部导航栏 -->
    <view
      class="bg-white px-6 pt-12 pb-4 sticky top-0 z-50 flex items-center justify-between shadow-sm"
    >
      <view class="flex items-center gap-4" @tap="back">
        <image class="svg" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />
      </view>
      <view class="text-18 font-bold text-gray-800">个人资料</view>
      <view class="text-primary font-medium" @tap="save">保存</view>
    </view>

    <view class="p-6 space-y-6">
      <!-- 头像上传 -->
      <view
        class="bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm"
        @tap="pickAvatar"
      >
        <view class="relative">
          <image
            class="w-24 h-24 rounded-full bg-gray-100"
            :src="form.avatar || def"
            mode="aspectFill"
          />
          <view
            class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex-center border-2 border-white"
          >
            <image class="w-5 h-5" src="https://unpkg.com/lucide-static@latest/icons/camera.svg" />
          </view>
        </view>
        <view class="text-sm text-gray-400 mt-4">点击更换头像</view>
      </view>

      <!-- 信息列表 -->
      <view class="bg-white rounded-3xl overflow-hidden shadow-sm">
        <view class="flex-between p-5 border-b border-gray-50">
          <text class="text-gray-500">昵称</text>
          <input
            class="text-right text-gray-800"
            v-model="form.nickname"
            placeholder="请输入昵称"
          />
        </view>
        <view class="flex-between p-5 border-b border-gray-50">
          <text class="text-gray-500">手机号</text>
          <text class="text-gray-400">{{ desensitize(user.phone) }}</text>
        </view>
        <view class="flex-between p-5 border-b border-gray-50">
          <text class="text-gray-500">性别</text>
          <view class="flex items-center gap-2">
            <text class="text-gray-800">{{ form.gender || '请选择' }}</text>
            <image
              class="svg opacity-30"
              src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg"
            />
          </view>
        </view>
        <view class="flex-between p-5 border-b border-gray-50">
          <text class="text-gray-500">学校</text>
          <view class="flex items-center gap-2">
            <text class="text-gray-800">{{ form.school || 'XX大学' }}</text>
            <image
              class="svg opacity-30"
              src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg"
            />
          </view>
        </view>
        <view class="flex-between p-5">
          <text class="text-gray-500">宿舍</text>
          <view class="flex items-center gap-2">
            <text class="text-gray-800">{{ form.dorm || '3栋502' }}</text>
            <image
              class="svg opacity-30"
              src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getProfile, updateProfile } from '@/api/user'
import { desensitize } from '@/utils/filters.js'

export default {
  data() {
    return {
      user: {},
      form: {
        nickname: '',
        avatar: '',
        gender: null,
        school: '',
        dorm: '',
      },
      def: '/static/tabbar/user.png',
    }
  },
  async onLoad() {
    const { data } = await getProfile()
    this.user = data
    this.form.nickname = data.nickname || ''
    this.form.avatar = data.avatar || ''
    this.form.gender = data.gender ?? null
    this.form.school = data.school || ''
    this.form.dorm = data.dorm || ''
  },
  methods: {
    desensitize,
    back() {
      uni.navigateBack()
    },
    async save() {
      await updateProfile(this.form)
      uni.showToast({ title: '已保存' })
      uni.navigateBack()
    },
    async pickAvatar() {
      const chooseRes = await uni.chooseImage({ count: 1, sizeType: ['compressed'] })
      const filePath = chooseRes.tempFilePaths?.[0]
      if (!filePath) return
      uni.showLoading({ title: '上传中...' })
      try {
        const uploadRes = await uni.uploadFile({
          url: 'http://localhost:8088/pickup-app-api/common/upload/img',
          filePath,
          name: 'file',
          header: {
            Authorization: uni.getStorageSync('token') || '',
          },
        })
        const parsed = (() => {
          try {
            return JSON.parse(uploadRes.data)
          } catch {
            return null
          }
        })()
        const url = parsed?.data
        if (url) this.form.avatar = url
        else uni.showToast({ icon: 'none', title: parsed?.msg || '上传失败' })
      } finally {
        uni.hideLoading()
      }
    },
  },
}
</script>

<style>
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
