// uno.config.ts
import { defineConfig, presetUno } from 'unocss'
import { presetWeapp } from 'unocss-preset-weapp'

const isWeapp = process.env.UNI_PLATFORM?.startsWith('mp-')

export default defineConfig({
  presets: [isWeapp ? presetWeapp() : presetUno()],

  // 小程序不需要 transformers，直接删除
  transformers: [],

  theme: {
    colors: {
      primary: '#4F46E5',
      secondary: '#10B981',
      accent: '#F59E0B',
      danger: '#EF4444',
      dark: '#1F2937',
      light: '#F3F4F6',
    },
    spacing: {
      18: '72rpx',
      22: '88rpx',
      90: '360rpx',
    },
    fontSize: {
      14: '28rpx',
      15: '30rpx',
      16: '32rpx',
      18: '36rpx',
      20: '40rpx',
      22: '44rpx',
      sm: '24rpx',
      base: '28rpx',
      lg: '32rpx',
      xl: '36rpx',
      '2xl': '48rpx',
      '3xl': '60rpx',
    },
  },

  // 使用 shortcuts 定义常用组合样式
  shortcuts: {
    card: 'bg-white rounded-2xl p-4 shadow-sm mb-4',
    'btn-primary':
      'bg-primary text-white rounded-xl py-3 px-4 flex items-center justify-center font-medium',
    'btn-ghost': 'bg-white bg-opacity-15 border border-white border-opacity-30 text-white',
    'section-title': 'text-18 font-bold text-gray-800 mb-4 mt-6',
    'list-empty': 'text-center text-gray-400 py-10 text-sm',
    tag: 'px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full',
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
  },

  // 使用 rules 代替 shortcuts
  rules: [
    ['h-18', { height: '72rpx' }],
    ['w-18', { width: '72rpx' }],
    ['w-24', { width: '96rpx' }],
    ['h-24', { height: '96rpx' }],
    ['w-2', { width: '8rpx' }],
    ['h-2', { height: '8rpx' }],
    ['w-5', { width: '20rpx' }],
    ['h-5', { height: '20rpx' }],
    ['w-8', { width: '32rpx' }],
    ['h-8', { height: '32rpx' }],
    ['w-10', { width: '40rpx' }],
    ['h-10', { height: '40rpx' }],
    ['w-12', { width: '48rpx' }],
    ['h-12', { height: '48rpx' }],
    ['w-14', { width: '56rpx' }],
    ['h-14', { height: '56rpx' }],
    ['w-16', { width: '64rpx' }],
    ['h-16', { height: '64rpx' }],
    ['w-32', { width: '128rpx' }],
    ['h-32', { height: '128rpx' }],
    ['w-22', { width: '88rpx' }],
    ['h-22', { height: '88rpx' }],
    ['h-90', { height: '360rpx' }],
    ['text-14', { 'font-size': '28rpx' }],
    ['text-15', { 'font-size': '30rpx' }],
    ['text-16', { 'font-size': '32rpx' }],
    ['text-18', { 'font-size': '36rpx' }],
    ['text-20', { 'font-size': '40rpx' }],
    ['text-22', { 'font-size': '44rpx' }],
    ['text-26', { 'font-size': '52rpx' }],
  ],
})
