import axiosRetry from 'axios-retry'
import axios from 'axios'

axiosRetry.exponentialDelay
axiosRetry(axios, { 
  retries: 5, 
  retryDelay: (retryCount: number) => retryCount * 5000
})

export default axios