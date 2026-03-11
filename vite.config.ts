// vite.config.js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    // 先运行 UnoCSS，确保生成虚拟样式并参与后续编译
    UnoCSS(),
    uni(),
  ],
})
