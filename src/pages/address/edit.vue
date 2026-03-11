<template>
  <view class="p-6">
    <view class="flex flex-col gap-4">
      <input
        class="border border-gray-200 rounded-lg p-4"
        v-model="form.name"
        placeholder="收件人"
      />
      <input
        class="border border-gray-200 rounded-lg p-4"
        v-model="form.phone"
        type="number"
        placeholder="手机号"
      />
      <input
        class="border border-gray-200 rounded-lg p-4"
        v-model="form.region"
        placeholder="校区/楼栋"
      />
      <input
        class="border border-gray-200 rounded-lg p-4"
        v-model="form.detail"
        placeholder="详细地址"
      />
      <view class="flex items-center justify-between px-2">
        <label class="text-gray-600">设为默认</label>
        <switch
          :checked="form.isDefault === 1"
          @change="(e) => (form.isDefault = e.detail.value ? 1 : 0)"
        />
      </view>
      <button class="bg-primary text-white rounded-xl py-3" @tap="onSave">保存</button>
    </view>
  </view>
</template>
<script>
import { getAddress, addAddress, updateAddress } from '@/api/address'
export default {
  data() {
    return { form: { pkId: null, name: '', phone: '', region: '', detail: '', isDefault: 0 } }
  },
  async onLoad(q) {
    if (q.id) {
      const a = await getAddress(Number(q.id))
      if (a) this.form = { ...a }
    }
  },
  methods: {
    async onSave() {
      const payload = {
        name: this.form.name,
        phone: this.form.phone,
        region: this.form.region,
        detail: this.form.detail,
        isDefault: this.form.isDefault,
      }
      if (this.form.pkId) await updateAddress(this.form.pkId, payload)
      else await addAddress(payload)
      uni.navigateBack()
    },
  },
}
</script>
<style></style>
