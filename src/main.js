import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import { createUnistorage } from 'pinia-plugin-unistorage'

export function createApp() {
  const app = createSSRApp(App)
  const store = Pinia.createPinia()
  // 关键代码
  store.use(createUnistorage())
  app.use(store)
  return {
    app,
    Pinia, // 此处必须将 Pinia 返回
  }
}
