import { defineStore } from 'pinia'
import type { Currencies } from '@/types/currencies.ts'
import { ref, type Ref } from 'vue'

export const useCurrenciesStore = defineStore('currencies', () => {
  const currencies: Ref<Currencies> = ref({})

  const fetchCurrencies = async () => {
    const url =
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,solana&vs_currencies=usd'
    try {
      const response = await fetch(url)
      currencies.value = await response.json()
    } catch (error) {
      throw error
    }
  }

  return {
    fetchCurrencies,
    currencies,
  }
})
