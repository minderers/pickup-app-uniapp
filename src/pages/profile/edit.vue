<template>
  <view class="min-h-screen bg-gray-50 pb-20">
    <!-- 顶部导航栏 -->
    <view
      class="bg-white px-6 pt-10 pb-3 sticky top-0 z-50 flex items-center justify-between shadow-sm"
    >
      <view class="flex items-center gap-4" @tap="back">
        <image class="svg" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />
      </view>
      <view class="text-18 font-bold text-gray-800">个人资料</view>
      <view class="text-primary font-medium text-sm" @tap="save">保存</view>
    </view>

    <view class="p-6 space-y-4">
      <!-- 头像上传 -->
      <view
        class="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm active:opacity-80"
        @tap="pickAvatar"
      >
        <view class="relative">
          <image
            class="w-18 h-18 rounded-full bg-gray-100 object-cover"
            :src="form.avatar || def"
            mode="aspectFill"
          />
          <view
            class="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-white"
          >
            <image class="w-4 h-4" src="https://unpkg.com/lucide-static@latest/icons/camera.svg" />
          </view>
        </view>
        <view class="text-xs text-gray-400 mt-3">点击更换头像</view>
      </view>

      <!-- 信息列表 -->
      <view class="bg-white rounded-2xl overflow-hidden shadow-sm">
        <!-- 昵称 -->
        <view class="flex items-center px-5 py-2.5 border-b border-gray-50">
          <text class="text-gray-500 text-sm whitespace-nowrap w-18 shrink-0 leading-none mr-3">昵称</text>
          <input
            class="flex-1 min-w-0 text-gray-800 text-sm"
            v-model="form.nickname"
            placeholder="请输入昵称"
            placeholder-class="text-gray-300"
          />
        </view>

        <!-- 手机号（可编辑） -->
        <view class="flex items-center px-5 py-2.5 border-b border-gray-50">
          <text class="text-gray-500 text-sm whitespace-nowrap w-18 shrink-0 leading-none mr-3">手机号</text>
          <input
            class="flex-1 min-w-0 text-gray-800 text-sm"
            v-model="form.phone"
            type="tel"
            maxlength="11"
            placeholder="请输入手机号"
            placeholder-class="text-gray-300"
          />
        </view>

        <!-- 性别 -->
        <view
          class="flex items-center px-5 py-2.5 border-b border-gray-50 active:bg-gray-50"
          @tap="showGenderPicker"
        >
          <text class="text-gray-500 text-sm whitespace-nowrap w-18 shrink-0 leading-none mr-3">性别</text>
          <view class="flex-1 min-w-0 flex items-center justify-between">
            <text class="text-gray-800 text-sm truncate">{{ genderText(form.gender) }}</text>
            <image
              class="svg opacity-30 w-4 h-4"
              src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg"
            />
          </view>
        </view>

        <!-- 生日 -->
        <view class="flex items-center px-5 py-2.5">
          <text class="text-gray-500 text-sm whitespace-nowrap w-18 shrink-0 leading-none mr-3">生日</text>
          <input
            class="flex-1 min-w-0 text-gray-800 text-sm"
            v-model="form.birthday"
            placeholder="请输入生日(如 1999-01-01)"
            placeholder-class="text-gray-300"
          />
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="flex mt-6">
        <button
          class="flex-1 py-2 mr-2 border border-gray-200 text-gray-600 rounded-lg font-medium text-sm m-0 active:bg-gray-50"
          @tap="back"
        >
          取消
        </button>
        <button
          class="flex-1 py-2 bg-primary text-white rounded-lg font-medium text-sm m-0 active:opacity-80"
          @tap="save"
        >
          保存
        </button>
      </view>
    </view>

    <!-- 性别选择弹窗 -->
    <view
      v-if="showGenderModal"
      class="fixed inset-0 z-100 flex items-end justify-center bg-black bg-opacity-50"
      @tap="showGenderModal = false"
    >
      <view class="w-full bg-white rounded-t-2xl p-5" @tap.stop>
        <view class="text-16 font-bold text-gray-800 mb-4">选择性别</view>
        <view class="space-y-2">
          <view
            v-for="item in genderOptions"
            :key="item.value"
            class="p-3 rounded-lg border-2 transition-all text-sm"
            :class="form.gender === item.value ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-100'"
            @tap="selectGender(item.value)"
          >
            <text :class="form.gender === item.value ? 'text-primary font-medium' : 'text-gray-600'">
              {{ item.label }}
            </text>
          </view>
        </view>
        <button
          class="w-full py-2 bg-primary text-white rounded-lg font-medium text-sm mt-4 m-0"
          @tap="showGenderModal = false"
        >
          确认
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { getProfile, updateProfile } from '@/api/user'

export default {
  data() {
    return {
      user: {},
      form: {
        nickname: '',
        phone: '',
        avatar: '',
        gender: null,
        birthday: '',
      },
      def: '/static/tabbar/user.png',
      showGenderModal: false,
      genderOptions: [
        { value: 0, label: '男' },
        { value: 1, label: '女' },
      ],
    }
  },
  async onLoad() {
    try {
      const { data } = await getProfile()
      this.user = data || {}
      this.form.nickname = data?.nickname || ''
      this.form.phone = data?.phone || ''
      this.form.avatar = data?.avatar || ''
      this.form.gender = data?.gender ?? null
      this.form.birthday = data?.birthday || ''
    } catch (e) {
      console.error('获取个人信息失败', e)
      uni.showToast({ title: '获取信息失败', icon: 'none' })
    }
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    
    genderText(value) {
      if (value === null || value === undefined) return '请选择'
      const option = this.genderOptions.find(o => o.value === value)
      return option?.label || '请选择'
    },
    
    showGenderPicker() {
      this.showGenderModal = true
    },
    
    selectGender(value) {
      this.form.gender = value
    },
    
    async save() {
      // 验证必填字段
      if (!this.form.nickname?.trim()) {
        uni.showToast({ title: '昵称不能为空', icon: 'none' })
        return
      }

      if (!/^1[3-9]\d{9}$/.test(this.form.phone?.trim() || '')) {
        uni.showToast({ title: '请输入正确手机号', icon: 'none' })
        return
      }
      
      if (this.form.gender === null || this.form.gender === undefined) {
        uni.showToast({ title: '请选择性别', icon: 'none' })
        return
      }
      
      uni.showLoading({ title: '保存中...' })
      try {
        const payload = {
          nickname: this.form.nickname.trim(),
          phone: this.form.phone.trim(),
          gender: this.form.gender,
          ...(this.form.avatar ? { avatar: this.form.avatar } : {}),
          ...(this.form.birthday?.trim() ? { birthday: this.form.birthday.trim() } : {}),
        }
        
        await updateProfile(payload)
        uni.hideLoading()
        uni.showToast({ title: '保存成功', icon: 'success' })
        
        // 延迟返回，让用户看到成功提示
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (e) {
        uni.hideLoading()
        console.error('保存失败', e)
        uni.showToast({ title: '保存失败，请重试', icon: 'none' })
      }
    },
    
    async pickAvatar() {
      try {
        const chooseRes = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
        })
        
        const filePath = chooseRes.tempFilePaths?.[0]
        if (!filePath) return
        
        uni.showLoading({ title: '上传中...' })
        
        const uploadRes = await uni.uploadFile({
          url: 'http://localhost:8088/pickup-app-api/common/upload/img',
          filePath,
          name: 'file',
          header: {
            Authorization: uni.getStorageSync('token') || '',
          },
        })
        
        uni.hideLoading()
        
        const parsed = (() => {
          try {
            return JSON.parse(uploadRes.data)
          } catch {
            return null
          }
        })()
        
        if (parsed?.code === 0 && parsed?.data) {
          this.form.avatar = parsed.data
          uni.showToast({ title: '头像更新成功', icon: 'success' })
        } else {
          uni.showToast({ icon: 'none', title: parsed?.msg || '上传失败' })
        }
      } catch (e) {
        uni.hideLoading()
        console.error('上传头像失败', e)
        uni.showToast({ icon: 'none', title: '上传失败' })
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

input {
  outline: none;
  border: none;
  background: transparent;
  /* 交给 UnoCSS 的 text-* 类控制字号 */
  font-size: inherit;
}

input::placeholder {
  color: #d1d5db;
}

/* 移除 input 的默认样式 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>
