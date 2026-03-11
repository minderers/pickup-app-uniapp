<template>
  <view class="p-6">
    <view class="flex flex-col gap-4">
      <view class="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
        <image class="w-24 h-24 rounded-full bg-gray-100" :src="form.avatar || def" />
        <view class="flex-1">
          <view class="text-[15px] font-medium">头像</view>
          <view class="text-xs text-gray-500 mt-1">可直接填写链接，或点击上传</view>
          <view class="flex gap-3 mt-3">
            <button size="mini" @tap="chooseAvatar">上传</button>
            <button size="mini" @tap="clearAvatar" type="warn">清除</button>
          </view>
        </view>
      </view>
      <input
        class="border border-gray-200 rounded-lg p-4"
        v-model="form.nickname"
        placeholder="昵称"
      />
      <input
        class="border border-gray-200 rounded-lg p-4"
        v-model="form.avatar"
        placeholder="头像链接"
      />
      <picker mode="selector" :range="genders" @change="onGender">
        <view class="border border-gray-200 rounded-lg p-4 text-gray-600"
          >性别：{{ genders[form.gender] || '未设置' }}</view
        >
      </picker>
      <picker mode="date" :value="form.birthday" @change="onDate">
        <view class="border border-gray-200 rounded-lg p-4 text-gray-600"
          >生日：{{ form.birthday || '未设置' }}</view
        >
      </picker>
      <button class="bg-primary text-white rounded-xl py-3" @tap="onSave">保存</button>
    </view>
  </view>
</template>
<script>
import { getProfile, updateProfile } from '@/api/user'
export default {
  data() {
    return {
      form: { nickname: '', avatar: '', gender: null, birthday: '' },
      // 后端：0-男，1-女。这里用下标直接对应
      genders: ['男', '女'],
      def: '/static/logo.png',
    }
  },
  async onLoad() {
    const { data } = await getProfile()
    this.form.nickname = data.nickname || ''
    this.form.avatar = data.avatar || ''
    this.form.gender = data.gender ?? null
    this.form.birthday = data.birthday || ''
  },
  methods: {
    onGender(e) {
      this.form.gender = Number(e.detail.value)
    },
    onDate(e) {
      this.form.birthday = e.detail.value
    },
    async onSave() {
      await updateProfile(this.form)
      uni.showToast({ title: '已保存' })
      uni.navigateBack()
    },
    clearAvatar() {
      this.form.avatar = ''
    },
    async chooseAvatar() {
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
<style></style>
