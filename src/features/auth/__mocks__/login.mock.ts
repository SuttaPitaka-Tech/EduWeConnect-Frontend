/**
 * login.mock.ts — Dev/Test credentials ONLY.
 * NEVER import this file in production code.
 * Used only in dev environment for quick login testing.
 */

export const MOCK_LOGIN_CREDENTIALS = {
  email:    'admin',
  password: 'admin@123',
}

export const MOCK_AUTH_USER = {
  id:              'mock-user-001',
  firstName:       'Aarav',
  lastName:        'Sharma',
  email:           'admin',
  role:            'admin',
  institutionId:   'inst-001',
  institutionName: 'Sutta Pitaka Academy',
}
