import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePreferenceStore = defineStore(
  'preference',
  () => {
    const serviceTypes = ref(['快递代取'])
    const maxPrice = ref(5)
    const nearOnly = ref(true)

    const setServiceTypes = (val) => {
      serviceTypes.value = Array.isArray(val) ? val : []
    }
    const toggleServiceType = (val) => {
      const set = new Set(serviceTypes.value || [])
      if (set.has(val)) set.delete(val)
      else set.add(val)
      serviceTypes.value = Array.from(set)
    }
    const setMaxPrice = (val) => {
      const n = Number(val)
      maxPrice.value = Number.isFinite(n) ? n : 0
    }
    const setNearOnly = (val) => {
      nearOnly.value = !!val
    }

    return {
      serviceTypes,
      maxPrice,
      nearOnly,
      setServiceTypes,
      toggleServiceType,
      setMaxPrice,
      setNearOnly,
    }
  },
  {
    unistorage: true,
  },
)

