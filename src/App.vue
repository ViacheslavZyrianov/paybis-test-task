<script setup lang="ts">
import { useCurrenciesStore } from '@/stores/currencies.ts'
import { onMounted, ref, computed, type Ref, type ComputedRef } from 'vue'
import type { ExchangeHistoryItem } from '@/types/exchangeHistory.ts'
import { useToast } from '@/stores/toast'
import ErrorToast from '@/components/error-toast.vue'
import { getErrorMessage } from '@/utils/errorHandler.ts'
import type { ApplicationError } from '@/types/errors.ts'

const { showError } = useToast()

const currenciesStore = useCurrenciesStore()

const fromCurrency: Ref<string> = ref('')
const toCurrency: Ref<string> = ref('')
const amount: Ref<number | null> = ref(null)

const history = ref<ExchangeHistoryItem[]>([])

const convertedAmount: ComputedRef<number | null> = computed(() => {
  if (
    !amount.value ||
    !currenciesStore.currencies[fromCurrency.value] ||
    !currenciesStore.currencies[toCurrency.value]
  ) {
    return null
  }

  const fromRate = currenciesStore.currencies[fromCurrency.value].usd
  const toRate = currenciesStore.currencies[toCurrency.value].usd

  return (amount.value * fromRate) / toRate
})

const isPreviewVisible: ComputedRef<boolean> = computed(() => convertedAmount.value !== null)

const submitExchange = () => {
  if (convertedAmount.value === null || amount.value === null) return

  history.value.unshift({
    from: fromCurrency.value,
    to: toCurrency.value,
    amount: amount.value,
    result: convertedAmount.value,
    timestamp: new Date(),
  })

  amount.value = null
}

const setFromToCurrencies = () => {
  fromCurrency.value = Object.keys(currenciesStore.currencies)[0]
  toCurrency.value = Object.keys(currenciesStore.currencies)[1]
}

const fetchCurrencies = async () => {
  try {
    await currenciesStore.fetchCurrencies()
  } catch (error) {
    showError(getErrorMessage(error as ApplicationError))
  }
}

onMounted(async () => {
  await fetchCurrencies()
  setFromToCurrencies()
})
</script>

<template>
  <div class="container">
    <h2 class="mb-8">Crypto Prices</h2>
    <table>
      <thead>
        <tr>
          <th>Currency</th>
          <th>USD</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(coin, name) in currenciesStore.currencies" :key="name">
          <td>{{ name }}</td>
          <td>{{ coin.usd.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>

    <div class="mb-8">
      <h2 class="mb-8">Currency Exchange</h2>
      <form class="d-flex align-center" @submit.prevent="submitExchange">
        <div class="d-flex align-center mr-16">
          <label for="from" class="mr-4">From:</label>
          <select id="from" v-model="fromCurrency">
            <option
              v-for="name in Object.keys(currenciesStore.currencies)"
              :key="name"
              :value="name"
            >
              {{ name }}
            </option>
          </select>
        </div>

        <div class="d-flex align-center mr-16">
          <label for="to" class="mr-4">To:</label>
          <select id="to" v-model="toCurrency">
            <option
              v-for="name in Object.keys(currenciesStore.currencies)"
              :key="name"
              :value="name"
            >
              {{ name }}
            </option>
          </select>
        </div>

        <div class="d-flex align-center mr-16">
          <label for="amount" class="mr-4">Amount:</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="any"
            v-model.number="amount"
            placeholder="Enter amount"
          />
        </div>

        <button type="submit">Convert & Save</button>
      </form>

      <div v-if="isPreviewVisible" class="mt-8">
        <strong>Preview:</strong> {{ amount }} {{ fromCurrency }} =
        {{ convertedAmount?.toFixed(6) }}
        {{ toCurrency }}
      </div>
    </div>

    <div class="mb-8">
      <h2 class="mb-8">Previous Exchanges</h2>
      <table v-if="history.length">
        <thead>
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in history" :key="index">
            <td>{{ record.timestamp.toLocaleString() }}</td>
            <td>{{ record.from }}</td>
            <td>{{ record.to }}</td>
            <td>{{ record.amount }}</td>
            <td>{{ record.result.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>No exchanges yet.</p>
    </div>
  </div>

  <error-toast />
</template>
