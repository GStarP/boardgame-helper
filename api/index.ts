import { isDev } from '@/modules/common/env'
import axios from 'axios'

const API_BASE_URL = isDev() ? 'http://localhost:8000' : ''

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

export default axiosInstance

export interface Res<T = void> {
  code: number
  msg?: string
  data?: T
}
