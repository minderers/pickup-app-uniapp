<template>
  <view class="min-h-screen bg-gray-50 pb-20">
    <!-- 顶部导航栏 -->
    <view
      class="bg-white px-6 pt-12 pb-4 sticky top-0 z-50 flex items-center justify-between shadow-sm"
    >
      <view class="flex items-center gap-4" @tap="back">
        <image class="svg" src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" />
      </view>
      <view class="text-18 font-bold text-gray-800">地址管理</view>
      <view class="w-10 h-10"></view>
      <!-- 占位符 -->
    </view>

    <view class="p-6 space-y-4">
      <!-- 新增地址按钮 -->
      <view
        class="bg-white rounded-3xl p-5 shadow-sm flex items-center justify-between active:opacity-60"
        @tap="add"
      >
        <view class="flex items-center gap-3">
          <view class="w-10 h-10 rounded-full bg-indigo-50 flex-center">
            <image
              class="w-5 h-5 opacity-80"
              src="https://unpkg.com/lucide-static@latest/icons/plus.svg"
            />
          </view>
          <text class="font-bold text-gray-800">新增收货地址</text>
        </view>
        <image
          class="svg opacity-30"
          src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg"
        />
      </view>

      <view v-if="list.length" class="space-y-4">
        <view
          class="bg-white rounded-3xl p-6 shadow-sm flex items-center justify-between"
          v-for="a in list"
          :key="a.pkId"
          @tap="selectAddress(a)"
        >
          <view class="flex-1 mr-4">
            <view class="flex items-center gap-2 mb-2">
              <text class="text-16 font-bold text-gray-800">{{ a.name || '—' }}</text>
              <text class="text-sm text-gray-400 ml-1">{{ desensitize(a.phone) }}</text>
              <view
                v-if="a.isDefault === 1"
                class="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-400 text-xs rounded-lg"
              >
                默认
              </view>
            </view>
            <view class="text-sm text-gray-500 leading-relaxed">
              {{ a.region || '' }} {{ a.detail || '' }}
            </view>
          </view>
          <view class="flex items-center gap-6">
            <view @tap.stop="edit(a)">
              <image
                class="svg opacity-80"
                src="https://unpkg.com/lucide-static@latest/icons/pencil.svg"
              />
            </view>
            <view @tap.stop="del(a.pkId)">
              <image
                class="svg opacity-80"
                src="https://unpkg.com/lucide-static@latest/icons/trash-2.svg"
              />
            </view>
          </view>
        </view>
      </view>
      <view class="flex flex-col items-center justify-center py-20" v-else>
        <image
          class="w-32 h-32 opacity-10 mb-4"
          src="https://unpkg.com/lucide-static@latest/icons/map-pin.svg"
        />
        <view class="text-gray-400 text-sm">暂无地址</view>
      </view>
    </view>

    <!-- 弹窗模态框 -->
    <view
      v-if="showModal"
      class="fixed inset-0 z-100 flex items-end justify-center bg-black bg-opacity-50 transition-all"
      @tap="closeModal"
    >
      <view class="w-full bg-white rounded-t-3xl p-6 space-y-6 animate-slide-up" @tap.stop>
        <view class="flex-between">
          <text class="text-18 font-bold text-gray-800">{{
            form.pkId ? '编辑地址' : '新增地址'
          }}</text>
          <view class="p-2" @tap="closeModal">
            <image
              class="svg opacity-30"
              src="https://unpkg.com/lucide-static@latest/icons/x.svg"
            />
          </view>
        </view>

        <!-- 表单内容 -->
        <view class="space-y-5">
          <view>
            <text class="text-sm font-medium text-gray-700">收件人</text>
            <input
              class="w-full h-12 px-4 mt-2 bg-gray-100 rounded-xl text-sm"
              v-model="form.name"
              placeholder="请输入收件人姓名"
              placeholder-class="text-gray-400"
            />
          </view>
          <view>
            <text class="text-sm font-medium text-gray-700">手机号</text>
            <input
              class="w-full h-12 px-4 mt-2 bg-gray-100 rounded-xl text-sm"
              v-model="form.phone"
              type="number"
              placeholder="请输入手机号"
              placeholder-class="text-gray-400"
            />
          </view>
          <view>
            <text class="text-sm font-medium text-gray-700">校区楼栋</text>
            <input
              class="w-full h-12 px-4 mt-2 bg-gray-100 rounded-xl text-sm"
              v-model="form.region"
              placeholder="如：XX大学 1号楼"
              placeholder-class="text-gray-400"
            />
          </view>
          <view>
            <text class="text-sm font-medium text-gray-700">详细地址</text>
            <textarea
              class="w-full h-24 p-4 mt-2 bg-gray-100 rounded-xl text-sm"
              v-model="form.detail"
              placeholder="如：3单元502室"
              placeholder-class="text-gray-400"
            />
          </view>
        </view>

        <!-- 默认设置 -->
        <view class="flex-between py-2">
          <view>
            <view class="text-gray-800 font-medium text-sm">设为默认地址</view>
            <view class="text-xs text-gray-400 mt-1">下单时将优先使用该地址</view>
          </view>
          <switch
            :checked="form.isDefault === 1"
            color="#4F46E5"
            @change="(e) => (form.isDefault = e.detail.value ? 1 : 0)"
            style="transform: scale(0.7)"
          />
        </view>

        <!-- 保存按钮 -->
        <view
          class="bg-primary text-white h-14 rounded-full flex-center font-bold shadow-lg active:opacity-90 mb-4"
          @tap="onSave"
        >
          保存并应用
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { listAddress, removeAddress, getAddress, addAddress, updateAddress } from '@/api/address'
import { desensitize } from '@/utils/filters.js'

export default {
  data() {
    return {
      list: [],
      showModal: false,
      form: {
        pkId: null,
        name: '',
        phone: '',
        region: '',
        detail: '',
        isDefault: 0,
      },
      fromOrderCreate: false, // 新增标志，判断是否从订单创建页跳转而来
    }
  },
  async onLoad(q) {
    if (q?.from === 'orderCreate') {
      this.fromOrderCreate = true
    }
  },
  async onShow() {
    this.fetchList()
  },
  methods: {
    desensitize,
    async fetchList() {
      const { data } = await listAddress()
      this.list = data || []
    },
    back() {
      uni.navigateBack()
    },
    add() {
      this.form = {
        pkId: null,
        name: '',
        phone: '',
        region: '',
        detail: '',
        isDefault: 0,
      }
      this.showModal = true
    },
    // 新增方法：处理地址选择
    selectAddress(address) {
      if (this.fromOrderCreate) {
        uni.$emit('selectAddress', address)
        uni.navigateBack()
      } else {
        // 如果不是从订单创建页跳转，则执行编辑操作
        this.edit(address)
      }
    },
    edit(a) {
      this.form = { ...a }
      this.showModal = true
    },
    async del(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该地址吗？',
        success: async (res) => {
          if (res.confirm) {
            await removeAddress(id)
            uni.showToast({ title: '删除成功' })
            this.fetchList()
          }
        },
      })
    },
    closeModal() {
      this.showModal = false
    },
    async onSave() {
      if (!this.form.name || !this.form.phone || !this.form.region || !this.form.detail) {
        uni.showToast({ title: '请填写完整信息', icon: 'none' })
        return
      }
      if (this.form.pkId) {
        await updateAddress(this.form.pkId, this.form)
        uni.showToast({ title: '更新成功' })
      } else {
        await addAddress(this.form)
        uni.showToast({ title: '新增成功' })
      }
      this.closeModal()
      this.fetchList()
    },
  },
}
</script>

<style>
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slideUp 0.3s ease-out forwards;
}
</style>
