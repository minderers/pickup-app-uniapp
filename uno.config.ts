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
      15: '15rpx',
      18: '18rpx',
      20: '20rpx',
    },
  },

  // 使用 rules 代替 shortcuts
  rules: [
    ['h-18', { height: '72rpx' }],
    ['w-18', { width: '72rpx' }],
    ['w-22', { width: '88rpx' }],
    ['h-22', { height: '88rpx' }],
    ['h-90', { height: '360rpx' }],
    ['text-15', { 'font-size': '15rpx' }],
    ['text-18', { 'font-size': '18rpx' }],
    ['text-20', { 'font-size': '20rpx' }],
  ],
})
