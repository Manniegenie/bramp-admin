import axios from '@/core/services/axios'
import type { DashboardAnalyticsResponse, RecentTransactionsResponse, FilterParams, FilterResponse } from '../type/analytic'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const getDashboardAnalytics = async (): Promise<DashboardAnalyticsResponse> => {
  const token = localStorage.getItem('token')
  const res = await axios.get(`${BASE_URL}/analytics/dashboard`, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined }
  })
  return res.data
}

export const getRecentTransactions = async (
  page: number = 1,
  limit: number = 50
): Promise<RecentTransactionsResponse> => {
  const token = localStorage.getItem('token')
  const res = await axios.get(
    `${BASE_URL}/analytics/recent-transactions?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: token ? `Bearer ${token}` : undefined }
    }
  )
  return res.data
}

export const getFilteredData = async (filters: FilterParams): Promise<FilterResponse> => {
  const token = localStorage.getItem('token')
  
  // Build query parameters
  const params = new URLSearchParams()
  
  if (filters.searchTerm) params.append('searchTerm', filters.searchTerm)
  if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.append('dateTo', filters.dateTo)
  if (filters.transactionType) params.append('transactionType', filters.transactionType)
  if (filters.transactionStatus) params.append('transactionStatus', filters.transactionStatus)
  if (filters.userVerificationStatus) params.append('userVerificationStatus', filters.userVerificationStatus)
  if (filters.currency) params.append('currency', filters.currency)
  if (filters.minAmount) params.append('minAmount', filters.minAmount)
  if (filters.maxAmount) params.append('maxAmount', filters.maxAmount)
  
  params.append('page', String(filters.page || 1))
  params.append('limit', String(filters.limit || 50))
  
  const res = await axios.get(
    `${BASE_URL}/analytics/filter?${params.toString()}`,
    {
      headers: { Authorization: token ? `Bearer ${token}` : undefined }
    }
  )
  
  return res.data
}

export const getSwapPairAnalytics = async (timeframe: '24h' | '7d' | '30d' = '24h') => {
  const token = localStorage.getItem('token')
  const res = await axios.get(
    `${BASE_URL}/analytics/swap-pairs?timeframe=${timeframe}`,
    {
      headers: { Authorization: token ? `Bearer ${token}` : undefined }
    }
  )
  return res.data
}

export default getDashboardAnalytics
