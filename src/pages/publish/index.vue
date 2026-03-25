<template>
  <view class="min-h-screen bg-gray-50 pb-20">
    <!-- 订单类型选择 -->
    <view class="bg-white py-8">
      <view class="px-6 text-sm text-gray-500 mb-6 font-medium">订单类型</view>
      <view class="grid grid-cols-4 gap-4 px-4">
        <view class="flex flex-col items-center" @tap="setType('快递代取')">
          <view :class="typeIconWrap('快递代取')">
            <image
              class="w-8 h-8"
              :class="typeIconCls('快递代取')"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/package.svg"
            />
          </view>
          <text :class="typeTextCls('快递代取')">快递代取</text>
        </view>
        <view class="flex flex-col items-center" @tap="setType('外卖代取')">
          <view :class="typeIconWrap('外卖代取')">
            <image
              class="w-8 h-8"
              :class="typeIconCls('外卖代取')"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/coffee.svg"
            />
          </view>
          <text :class="typeTextCls('外卖代取')">外卖代取</text>
        </view>
        <view class="flex flex-col items-center" @tap="setType('超市代购')">
          <view :class="typeIconWrap('超市代购')">
            <image
              class="w-8 h-8"
              :class="typeIconCls('超市代购')"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg"
            />
          </view>
          <text :class="typeTextCls('超市代购')">超市代购</text>
        </view>
        <view class="flex flex-col items-center" @tap="setType('其他服务')">
          <view :class="typeIconWrap('其他服务')">
            <image
              class="w-8 h-8"
              :class="typeIconCls('其他服务')"
              mode="aspectFit"
              src="https://unpkg.com/lucide-static@latest/icons/more-horizontal.svg"
            />
          </view>
          <text :class="typeTextCls('其他服务')">其他服务</text>
        </view>
      </view>
    </view>

    <!-- 智能推荐模块 -->
    <view v-if="studentRecommendations.length" class="p-4 mt-2">
      <view class="bg-white rounded-2xl p-6 shadow-sm">
        <view class="text-sm text-gray-500 mb-3 font-medium">智能推荐</view>
        <view class="flex flex-wrap gap-2">
          <text
            v-for="(rec, idx) in studentRecommendations"
            :key="idx"
            class="px-3 py-1 rounded-full bg-blue-50 text-blue-500 text-xs"
            @click="fillFormWithRecommendation(rec.content)"
            >{{ formatRecommendation(rec.content) }}</text
          >
        </view>
      </view>
    </view>

    <!-- 订单信息填写 -->
    <view class="p-4 mt-2">
      <view class="bg-white rounded-2xl p-6 space-y-6 shadow-sm">
        <view>
          <view class="text-sm text-gray-500 mb-3 font-medium">取件地点</view>
          <input
            class="w-full h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm"
            v-model="pickupFrom"
            placeholder="请输入取件地点"
            placeholder-class="text-gray-300"
          />
        </view>

        <view>
          <view class="text-sm text-gray-500 mb-3 font-medium">送达地点</view>
          <view
            class="w-full h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm flex items-center"
            @tap="toAddressList"
          >
            <text :class="deliverTo ? 'text-gray-800' : 'text-gray-300'">{{
              deliverTo || '请选择送达地点'
            }}</text>
          </view>
        </view>

        <view>
          <view class="text-sm text-gray-500 mb-3 font-medium">取件时间</view>
          <view class="flex gap-2">
            <picker
              mode="date"
              :value="date"
              @change="onDateChange"
              class="flex-1 h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm flex items-center"
            >
              <text :class="date ? 'text-gray-800' : 'text-gray-300'">{{
                date || '请选择日期'
              }}</text>
            </picker>
            <picker
              mode="time"
              :value="time"
              @change="onTimeChange"
              class="flex-1 h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm flex items-center"
            >
              <text :class="time ? 'text-gray-800' : 'text-gray-300'">{{
                time || '请选择时间'
              }}</text>
            </picker>
          </view>
        </view>

        <view>
          <view class="text-sm text-gray-500 mb-3 font-medium">报酬金额</view>
          <input
            class="w-full h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm"
            v-model.number="form.price"
            type="number"
            placeholder="请输入报酬金额"
            placeholder-class="text-gray-300"
          />
        </view>

        <view>
          <view class="text-sm text-gray-500 mb-3 font-medium">优惠券</view>
          <picker
            @change="onCouponChange"
            :value="selectedCouponIndex"
            :range="coupons"
            range-key="name"
            class="w-full h-14 px-4 rounded-xl bg-gray-50 border border-gray-100 text-sm flex items-center justify-between"
          >
            <text :class="couponId ? 'text-gray-800' : 'text-gray-300'">{{
              coupons[selectedCouponIndex] ? coupons[selectedCouponIndex].name : '不使用优惠券'
            }}</text>
            <image
              class="svg w-4 h-4 opacity-30"
              src="https://unpkg.com/lucide-static@latest/icons/chevron-right.svg"
            />
          </picker>
        </view>

        <view>
          <view class="text-sm text-gray-500 mb-3 font-medium">备注信息</view>
          <textarea
            class="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm"
            v-model="remark"
            placeholder="请输入备注信息"
            placeholder-class="text-gray-300"
            :maxlength="200"
            style="height: 240rpx"
          />
        </view>

        <button
          class="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary bg-opacity-10 mt-8"
          @tap="onSubmit"
        >
          确认发布
        </button>
      </view>
    </view>
  </view>
</template>
<script>
import { createOrder, getRecommend, payOrder, getMyCoupons, getCouponDetail } from '@/api/order'
import { listAddress } from '@/api/address'
import { getProfile } from '@/api/user' // 导入获取用户信息的API
import { getPublishRecommendations } from '@/api/student' // 导入新的学生推荐API
export default {
  data() {
    return {
      form: { content: '', price: 0, duration: 30 },
      pickupPoints: [],
      pickers: [],
      addresses: [],
      selectedAddress: null,
      type: '',
      pickupFrom: '',
      deliverTo: '',
      date: '', // 用于日期选择器
      time: '', // 用于时间选择器
      remark: '',
      couponId: 0, // 优惠券ID，0表示不使用优惠券
      coupons: [], // 用户可用的优惠券列表
      selectedCouponIndex: 0, // 选中的优惠券索引，0表示不使用优惠券
      studentRecommendations: [], // 学生推荐信息 (现在对所有用户都加载)
      // 用于从地址列表页返回时接收选中的地址
      selectedAddressFromList: null,
    }
  },
  onLoad(q) {
    if (q?.type) {
      this.type = String(q.type)
    }
    // 监听从地址列表页选择地址的事件
    uni.$on('selectAddress', (address) => {
      this.selectedAddressFromList = address
    })
  },
  onUnload() {
    // 页面卸载时移除事件监听
    uni.$off('selectAddress')
  },
  async onShow() {
    // 处理从地址列表页返回的选中地址
    if (this.selectedAddressFromList) {
      this.selectedAddress = this.selectedAddressFromList
      const a = this.selectedAddress
      this.deliverTo = `${a.region || ''}${a.detail ? ' ' + a.detail : ''}`.trim()
      this.selectedAddressFromList = null // 清空，避免重复处理
    } else {
      // 否则，正常加载地址列表并设置默认地址
      const c = await listAddress()
      this.addresses = c.data || []
      this.selectedAddress =
        this.addresses.find((x) => x.isDefault === 1) || this.addresses[0] || null
      if (this.selectedAddress) {
        const a = this.selectedAddress
        this.deliverTo = `${a.region || ''}${a.detail ? ' ' + a.detail : ''}`.trim()
      }
    }

    // 加载取件点和代取员推荐
    const a = await getRecommend('pickup-point')
    this.pickupPoints = a.data || []
    const b = await getRecommend('picker')
    this.pickers = b.data || []

    // 加载协同过滤推荐 (对所有用户)
    try {
      const { data: rec } = await getPublishRecommendations() // 新的调用
      this.studentRecommendations = Array.isArray(rec) ? rec : []
      console.log('Collaborative Recommendations for Publish Page:', this.studentRecommendations)
    } catch (e) {
      console.error('获取协同过滤推荐失败', e)
      this.studentRecommendations = []
    }

    // 加载用户优惠券
    try {
      const { data: couponsData } = await getMyCoupons()
      const list = Array.isArray(couponsData) ? couponsData : []
      // 并发加载每张券的详情以获得展示名称
      const details = await Promise.all(
        list.map((c) =>
          getCouponDetail(c.pkId)
            .then((res) => res.data)
            .catch(() => null),
        ),
      )
      const enriched = list
        .filter((c) => c.status === 0)
        .map((c, i) => {
          const d = details[i]
          return {
            pkId: c.pkId,
            name:
              (d?.name || '优惠券') +
              (c.endTime ? `（有效至：${String(c.endTime).slice(0, 10)}）` : ''),
            status: c.status,
            endTime: c.endTime,
            interestId: c.interestId,
          }
        })
      this.coupons = [{ pkId: 0, name: '不使用优惠券' }, ...enriched]
      this.selectedCouponIndex = 0 // 默认选中不使用优惠券
      this.couponId = this.coupons[this.selectedCouponIndex].pkId
    } catch (e) {
      console.error('获取优惠券失败', e)
      this.coupons = [{ pkId: 0, name: '不使用优惠券', discount: 0 }]
      this.selectedCouponIndex = 0
      this.couponId = 0
    }
  },
  methods: {
    formatRecommendation(recommendation) {
      if (recommendation.startsWith('最常发布: ')) {
        return recommendation.replace('最常发布: ', '')
      } else if (recommendation.startsWith('常用取件地点: ')) {
        return recommendation.replace('常用取件地点: ', '')
      } else if (recommendation.startsWith('价格建议: ')) {
        return recommendation.replace('价格建议: ', '')
      }
      return recommendation
    },
    fillFormWithRecommendation(recommendation) {
      if (recommendation.startsWith('最常发布: ')) {
        this.type = recommendation.replace('最常发布: ', '')
      } else if (recommendation.startsWith('常用取件地点: ')) {
        this.pickupFrom = recommendation.replace('常用取件地点: ', '')
      } else if (recommendation.startsWith('价格建议: ')) {
        // 价格建议可能是一个范围，这里简单取第一个数字作为参考
        const priceMatch = recommendation.match(/(\d+)/)
        if (priceMatch && priceMatch[1]) {
          this.form.price = parseFloat(priceMatch[1])
        }
      }
    },
    back() {
      uni.navigateBack()
    },
    setType(t) {
      this.type = t
    },
    typeIconWrap(t) {
      const active = this.type === t || (!this.type && t === '快递代取')
      return [
        'w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all',
        active ? 'bg-primary bg-opacity-10 scale-110 shadow-sm' : 'bg-gray-100',
      ]
    },
    typeIconCls(t) {
      const active = this.type === t || (!this.type && t === '快递代取')
      return active ? '' : 'opacity-40'
    },
    typeTextCls(t) {
      const active = this.type === t || (!this.type && t === '快递代取')
      return active ? 'text-xs text-gray-800 font-bold' : 'text-xs text-gray-400'
    },
    toAddressList() {
      uni.navigateTo({ url: '/pages/address/list?from=orderCreate' })
    },
    onDateChange(e) {
      this.date = e.detail.value
    },
    onTimeChange(e) {
      this.time = e.detail.value
    },
    onCouponChange(e) {
      this.selectedCouponIndex = e.detail.value
      this.couponId = this.coupons[this.selectedCouponIndex].pkId
    },
    async onSubmit() {
      if (!this.pickupFrom) {
        uni.showToast({ title: '请输入取件地点', icon: 'none' })
        return
      }
      if (!this.selectedAddress) {
        uni.showToast({ title: '请选择送达地点', icon: 'none' })
        return
      }
      if (!this.date || !this.time) {
        uni.showToast({ title: '请选择取件日期和时间', icon: 'none' })
        return
      }
      if (!this.form.price || this.form.price <= 0) {
        uni.showToast({ title: '请输入正确的报酬金额', icon: 'none' })
        return
      }

      const t = this.type || '快递代取'
      const pickupTimeStr = `${this.date} ${this.time}:00`
      const parts = [
        `${t}`,
        `取件地点：${this.pickupFrom}`,
        `送达地点：${this.deliverTo}`,
        `取件时间：${pickupTimeStr}`,
        `备注：${this.remark || '无'}`,
      ]
      const payload = {
        ...this.form,
        content: parts.join(' | '),
        pickupLocation: this.pickupFrom,
        deliveryAddressId: this.selectedAddress ? this.selectedAddress.pkId : null,
        pickupTime: pickupTimeStr, // ISO 8601 格式字符串
        couponId: this.couponId,
      }

      // 弹出支付确认弹窗
      uni.showModal({
        title: '确认支付',
        content: `订单金额：¥${this.form.price}，是否立即支付？`,
        confirmText: '立即支付',
        cancelText: '稍后支付',
        success: async (res) => {
          if (res.confirm) {
            // 用户选择立即支付
            const { data } = await createOrder(payload)
            console.log('Newly created order pkId (立即支付):', data.pkId) // 添加这一行
            await payOrder(data.pkId)
            uni.showToast({ title: '已支付', icon: 'success' })
            uni.navigateTo({ url: '/pages/orders/detail?id=' + data.pkId })
          } else if (res.cancel) {
            // 用户选择稍后支付
            const { data } = await createOrder(payload)
            console.log('Newly created order pkId (稍后支付):', data.pkId) // 添加这一行
            uni.showToast({ title: '订单已创建，待支付', icon: 'none' })
            uni.navigateTo({ url: '/pages/orders/detail?id=' + data.pkId })
          }
        },
      })
    },
  },
}
</script>
<style></style>
