/**
 * src/mock/mock-server.ts
 *
 * Central Axios Mock Adapter Server
 * Intercepts all API calls at the HTTP client level when mock mode is enabled.
 */

import MockAdapter from 'axios-mock-adapter'
import { apiClient } from '@/lib/api-client'
import {
  MOCK_LOGIN_RESPONSE,
  MOCK_AUTH_USER,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_ATTENDANCE_LIST_RESPONSE,
  MOCK_ATTENDANCE_STATS,
} from './index'

export function setupMockServer() {
  const mock = new MockAdapter(apiClient, { delayResponse: 300 })

  // ── Auth Endpoints ──────────────────────────────────────────────────────────
  
  // POST /auth/login (supports /auth/login or /api/auth/login)
  mock.onPost(/\/auth\/login$/).reply((config) => {
    try {
      const { email, password } = JSON.parse(config.data || '{}')
      const isValid = password === 'admin@123' || password === 'password123'
      if (!isValid) {
        return [401, { message: 'Invalid email/username or password. Use admin@123' }]
      }
      return [
        200,
        {
          ...MOCK_LOGIN_RESPONSE,
          user: {
            ...MOCK_LOGIN_RESPONSE.user,
            email: email || MOCK_LOGIN_RESPONSE.user.email,
          },
        },
      ]
    } catch {
      return [400, { message: 'Bad request payload' }]
    }
  })

  // POST /auth/verify-otp
  mock.onPost(/\/auth\/verify-otp$/).reply((config) => {
    try {
      const { otp } = JSON.parse(config.data || '{}')
      if (otp !== '123456') {
        return [400, { message: 'Invalid OTP code. Please enter 123456.' }]
      }
      return [200, MOCK_LOGIN_RESPONSE]
    } catch {
      return [400, { message: 'Bad request payload' }]
    }
  })

  // POST /auth/forgot-password
  mock.onPost(/\/auth\/forgot-password$/).reply(200, {
    message: 'Password reset link sent to your email address.',
  })

  // POST /auth/reset-password
  mock.onPost(/\/auth\/reset-password$/).reply(200, {
    message: 'Password reset successfully. Please login.',
  })

  // GET /auth/me (requires Authorization header)
  mock.onGet(/\/auth\/me$/).reply((config) => {
    const auth = config.headers?.Authorization || config.headers?.authorization
    if (!auth || typeof auth !== 'string' || !auth.startsWith('Bearer ')) {
      return [401, { message: 'Unauthorized. Please login.' }]
    }
    return [200, MOCK_AUTH_USER]
  })

  // POST /auth/logout
  mock.onPost(/\/auth\/logout$/).reply(200, { message: 'Logged out successfully.' })

  // ── Attendance Endpoints ────────────────────────────────────────────────────

  // GET /attendance/stats
  mock.onGet(/\/attendance\/stats$/).reply(200, MOCK_ATTENDANCE_STATS)

  // GET /attendance/:id
  mock.onGet(/\/attendance\/[^/]+$/).reply((config) => {
    const id = config.url?.split('?')[0].split('/').pop()
    const record = MOCK_ATTENDANCE_RECORDS.find((r) => r.id === id)
    if (record) return [200, record]
    return [404, { message: `Attendance record ${id} not found` }]
  })

  // GET /attendance
  mock.onGet(/\/attendance$/).reply((config) => {
    const params = config.params || {}
    let records = [...MOCK_ATTENDANCE_RECORDS]

    if (params.status) records = records.filter((r) => r.status === params.status)
    if (params.type) records = records.filter((r) => r.type === params.type)
    if (params.classId) records = records.filter((r) => r.classId === params.classId)
    if (params.search) {
      const q = params.search.toLowerCase()
      records = records.filter((r) => r.memberName.toLowerCase().includes(q))
    }

    return [
      200,
      {
        ...MOCK_ATTENDANCE_LIST_RESPONSE,
        data: records,
        total: records.length,
      },
    ]
  })

  // POST /attendance
  mock.onPost(/\/attendance$/).reply((config) => {
    try {
      const payload = JSON.parse(config.data || '{}')
      const newRecord = {
        ...MOCK_ATTENDANCE_RECORDS[0],
        ...payload,
        id: `att_mock_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return [201, newRecord]
    } catch {
      return [400, { message: 'Invalid payload' }]
    }
  })

  // PUT /attendance/:id
  mock.onPut(/\/attendance\/[^/]+$/).reply((config) => {
    const id = config.url?.split('?')[0].split('/').pop()
    const record = MOCK_ATTENDANCE_RECORDS.find((r) => r.id === id) || MOCK_ATTENDANCE_RECORDS[0]
    try {
      const payload = JSON.parse(config.data || '{}')
      return [200, { ...record, ...payload, updatedAt: new Date().toISOString() }]
    } catch {
      return [200, record]
    }
  })

  // DELETE /attendance/:id
  mock.onDelete(/\/attendance\/[^/]+$/).reply((config) => {
    const id = config.url?.split('?')[0].split('/').pop()
    return [200, { id: id || 'att_001' }]
  })

  // Pass-through unmocked requests if any
  mock.onAny().passThrough()

  console.info('🛠️ [MockAdapter] Mock API server active for development.')
}
