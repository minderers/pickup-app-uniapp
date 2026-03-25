<template>
  <view class="container">
    <view class="tab-header">
      <uni-segmented-control
        class="seg-control"
        :current="current"
        :values="items"
        @clickItem="onClickItem"
        styleType="text"
        activeColor="#5b73ff"
      ></uni-segmented-control>
      <view class="nav-right-text" @click="goToPendingOrders">待接订单</view>
    </view>

    <view class="content">
      <view v-if="filteredOrders.length" class="px-6 py-4">
        <view
          v-for="order in filteredOrders"
          :key="order.pkId"
          class="bg-white rounded-3xl p-5 shadow-sm mb-4"
          @tap="viewDetail(order.pkId)"
        >
          <!-- 顶部：订单编号 + 状态胶囊 -->
          <view class="flex justify-between items-center mb-3">
            <view class="text-xs text-gray-400">订单编号：{{ order.orderNo || order.pkId }}</view>
            <view :class="getStatusTagClasses(order.status)">{{
              formatOrderStatus(order.status)
            }}</view>
          </view>

          <!-- 主体：左侧图标与信息，右侧价格 -->
          <view class="flex justify-between items-start">
            <view class="flex">
              <view class="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center mr-3">
                <image class="svg" mode="aspectFit" :src="guessIcon(order.content)" />
              </view>
              <view>
                <view class="text-[16px] font-bold text-gray-800">{{
                  guessType(order.content)
                }}</view>
                <view class="text-xs text-gray-600 mt-1">
                  取件地点：{{ order.pickupLocation || pickFrom(order.content) }}
                </view>
                <view class="text-xs text-gray-600 mt-1">
                  送达地点：{{ getDeliveryLocation(order) || deliverTo(order.content) }}
                </view>
              </view>
            </view>
            <view class="text-18 font-bold text-primary">¥{{ order.price || 0 }}</view>
          </view>

          <!-- 分割线 -->
          <view class="my-4 h-px bg-gray-100"></view>

          <!-- 底部按钮：再次下单 / 评价 -->
          <view class="flex justify-end gap-2">
            <button
              v-if="order.status === 1 || order.status === 3"
              class="bg-white text-gray-700 text-xs px-6 py-1.5 rounded-full border border-gray-200 m-0"
              @tap.stop="reorder(order.pkId)"
            >
              再次下单
            </button>
            <button
              v-if="order.status === 3 && !order.evaluated"
              class="bg-primary text-white text-xs px-6 py-1.5 rounded-full m-0"
              @tap.stop="evaluateOrder(order.pkId)"
            >
              评价
            </button>
          </view>
        </view>
      </view>
      <view v-else class="empty-list">
        <text>暂无订单</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getMyPublishedOrders, getMyAcceptedOrders } from '@/api/order'
import { formatDateTime, formatOrderStatus } from '@/utils/util'

export default {
  computed: {
    filteredOrders() {
      let filtered = this.allOrders
      switch (this.current) {
        case 0: // 全部
          // No filtering needed, allOrders already contains all
          break
        case 1: // 进行中：已发布或已截单
          filtered = filtered.filter((order) => order.status === 1 || order.status === 2)
          break
        case 2: // 已完成 (Assuming status 3 for completed)
          filtered = filtered.filter((order) => order.status === 3)
          break
        case 3: // 已取消 (Assuming status 4 for cancelled)
          filtered = filtered.filter((order) => order.status === 4)
          break
      }
      return filtered
    },
  },
  data() {
    return {
      items: ['全部', '进行中', '已完成', '已取消'],
      current: 0,
      publishedOrders: [],
      acceptedOrders: [],
      allOrders: [], // Combined list for filtering
      publishedPage: 1,
      publishedSize: 10,
      publishedHasMore: true,
      publishedLoading: false,
      acceptedPage: 1,
      acceptedSize: 10,
      acceptedHasMore: true,
      acceptedLoading: false,
      loading: false, // General loading indicator
    }
  },
  onLoad() {
    this.loadPublishedOrders()
    this.loadAcceptedOrders()
  },
  onReachBottom() {
    if (this.loading) return
    if (this.publishedHasMore) {
      this.publishedPage++
      this.loadPublishedOrders()
    }
    if (this.acceptedHasMore) {
      this.acceptedPage++
      this.loadAcceptedOrders()
    }
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    goToPendingOrders() {
      // Navigate to the pending orders page, assuming it's at pages/orders/list.vue
      uni.navigateTo({
        url: '/pages/orders/list',
      })
    },
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex
        // Reset pagination and reload orders for the new tab
        this.publishedPage = 1
        this.publishedOrders = []
        this.publishedHasMore = true
        this.acceptedPage = 1
        this.acceptedOrders = []
        this.acceptedHasMore = true
        this.loadPublishedOrders()
        this.loadAcceptedOrders()
      }
    },
    async loadPublishedOrders() {
      this.publishedLoading = true
      try {
        const { data } = await getMyPublishedOrders({
          page: this.publishedPage,
          size: this.publishedSize,
        })
        if (data && data.list) {
          this.publishedOrders = [...this.publishedOrders, ...data.list]
          this.publishedHasMore = data.list.length === this.publishedSize
        } else {
          this.publishedHasMore = false
        }
      } catch (e) {
        console.error('加载我发布的订单失败', e)
        uni.showToast({
          title: '加载失败',
          icon: 'error',
        })
      } finally {
        this.publishedLoading = false
        this.updateAllOrders()
      }
    },
    async loadAcceptedOrders() {
      this.acceptedLoading = true
      try {
        const { data } = await getMyAcceptedOrders({
          page: this.acceptedPage,
          size: this.acceptedSize,
        })
        if (data && data.list) {
          this.acceptedOrders = [...this.acceptedOrders, ...data.list]
          this.acceptedHasMore = data.list.length === this.acceptedSize
        } else {
          this.acceptedHasMore = false
        }
      } catch (e) {
        console.error('加载我接的订单失败', e)
        uni.showToast({
          title: '加载失败',
          icon: 'error',
        })
      } finally {
        this.acceptedLoading = false
        this.updateAllOrders()
      }
    },
    updateAllOrders() {
      this.allOrders = [...this.publishedOrders, ...this.acceptedOrders].sort(
        (a, b) => new Date(b.createTime) - new Date(a.createTime),
      )
    },
    guessType(content) {
      const c = String(content || '')
      if (c.includes('外卖')) return '外卖代取'
      if (c.includes('超市') || c.includes('代购')) return '超市代购'
      return '快递代取'
    },
    guessIcon(content) {
      const t = this.guessType(content)
      if (t === '外卖代取') return 'https://unpkg.com/lucide-static@latest/icons/coffee.svg'
      if (t === '超市代购') return 'https://unpkg.com/lucide-static@latest/icons/shopping-bag.svg'
      return 'https://unpkg.com/lucide-static@latest/icons/package.svg'
    },
    pickFrom(content) {
      const c = String(content || '')
      const m = c.match(/取件地点[:：]\s*([^|]+)/)
      return (m?.[1] || '').trim()
    },
    deliverTo(content) {
      const c = String(content || '')
      const m = c.match(/送达地点[:：]\s*([^|]+)/)
      return (m?.[1] || '').trim()
    },
    getDeliveryLocation(order) {
      if (order.deliveryLocation) return order.deliveryLocation
      const c = order.content || ''
      const m = c.match(/送达地点[:：]\s*([^|\n]+)/)
      return m ? m[1].trim() : ''
    },
    formatPickupTime(time) {
      return formatDateTime(time)
    },
    formatOrderStatus(status) {
      return formatOrderStatus(status)
    },
    getStatusClass(status) {
      switch (status) {
        case 1: // 已发布
        case 2: // 已截单
          return 'status-in-progress'
        case 3: // 已完成
          return 'status-completed'
        case 4: // 已取消
          return 'status-cancelled'
        default:
          return ''
      }
    },
    getStatusTagClasses(status) {
      if (status === 3) return 'px-2 py-0.5 bg-green-50 text-green-500 text-[10px] rounded-md'
      if (status === 4) return 'px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-md'
      return 'px-2 py-0.5 bg-blue-50 text-blue-500 text-[10px] rounded-md'
    },
    viewDetail(orderId) {
      uni.navigateTo({
        url: `/pages/orders/detail?id=${orderId}`,
      })
    },
    reorder(orderId) {
      uni.showToast({
        title: '再次下单 ' + orderId,
        icon: 'none',
      })
      // Implement reorder logic
    },
    evaluateOrder(orderId) {
      uni.showToast({
        title: '评价订单 ' + orderId,
        icon: 'none',
      })
      // Implement evaluation logic
    },
    refreshOrders() {
      this.publishedPage = 1
      this.publishedOrders = []
      this.publishedHasMore = true
      this.acceptedPage = 1
      this.acceptedOrders = []
      this.acceptedHasMore = true
      this.loadPublishedOrders()
      this.loadAcceptedOrders()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.nav-right-text {
  font-size: 28rpx;
  color: #5b73ff;
  margin-right: 20rpx;
}

.tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  background-color: #fff;
}

.seg-control {
  flex: 1;
}

.content {
  flex: 1;
  overflow-y: auto;
}

.empty-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  font-size: 32rpx;
  color: #999;
  height: 200rpx; /* 确保在内容区域有足够的高度 */
}
</style>
