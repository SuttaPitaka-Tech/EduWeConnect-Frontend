import { apiClient } from '@/lib/api-client'

export const fetchDashboardStatsApi = async () => {
  const { data } = await apiClient.get('/organization-details/dashboard/stats')
  return data
}
