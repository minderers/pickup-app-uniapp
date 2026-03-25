<template>
  <view class="container">
    <uni-nav-bar
      title="待接订单"
      left-icon="left"
      :fixed="true"
      :status-bar="true"
      @clickLeft="back"
    ></uni-nav-bar>

    <view v-if="orders.length" class="order-list">
      <view v-for="order in orders" :key="order.pkId" class="order-item">
        <view class="order-header">
          <text class="order-type">{{ order.content }}</text>
          <text class="order-price">¥{{ order.price }}</text>
        </view>
        <view class="order-body">
          <text class="order-location">取件地点: {{ order.pickupLocation }}</text>
          <text class="order-time">取件时间: {{ formatPickupTime(order.pickupTime) }}</text>
        </view>
        <view class="order-footer">
          <button class="accept-button" @click="acceptOrder(order.pkId)">接单</button>
        </view>
      </view>
    </view>
    <view v-else class="empty-list">
      <text>暂无待接订单</text>
    </view>
  </view>
</template>

<script>
import { getAvailableOrders, acceptOrder } from '@/api/order'
import { formatDateTime } from '@/utils/util' // 假设有一个格式化时间的工具函数

export default {
  data() {
    return {
      orders: [],
      page: 1,
      size: 10,
      hasMore: true,
      loading: false,
    }
  },
  onLoad() {
    this.loadOrders()
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.page++
      this.loadOrders()
    }
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    async loadOrders() {
      this.loading = true
      try {
        const { data } = await getAvailableOrders({ page: this.page, size: this.size })
        if (data && data.list) {
          this.orders = [...this.orders, ...data.list]
          this.hasMore = data.list.length === this.size
        } else {
          this.hasMore = false
        }
      } catch (e) {
        console.error('加载待接订单失败', e)
        uni.showToast({
          title: '加载订单失败',
          icon: 'error',
        })
      } finally {
        this.loading = false
      }
    },
    formatPickupTime(time) {
      return formatDateTime(time)
    },
    async acceptOrder(orderId) {
      try {
        await acceptOrder(orderId)
        uni.showToast({
          title: '接单成功',
          icon: 'success',
        })
        // 刷新订单列表
        this.page = 1
        this.orders = []
        this.loadOrders()
      } catch (e) {
        console.error('接单失败', e)
        uni.showToast({
          title: '接单失败',
          icon: 'error',
        })
      }
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

.order-list {
  padding: 20rpx;
}

.order-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .order-type {
      font-size: 24rpx;
      font-weight: bold;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: calc(100% - 200rpx);
    }

    .order-price {
      font-size: 36rpx;
      font-weight: bold;
      color: #ff5722;
      flex-shrink: 0;
    }
  }

  .order-body {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;

    .order-location,
    .order-time {
      display: block;
      margin-bottom: 10rpx;
    }
  }

  .order-footer {
    display: flex;
    justify-content: flex-end;

    .accept-button {
      background-color: #007aff;
      color: #fff;
      font-size: 28rpx;
      padding: 10rpx 30rpx;
      border-radius: 40rpx;
      line-height: 1;
    }
  }
}

.empty-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  font-size: 32rpx;
  color: #999;
}
</style>
