/**
 * mock/index.ts — Mock module barrel
 *
 * HOW TO USE:
 *   Set VITE_USE_MOCK=true in .env.local to enable mock mode via axios-mock-adapter.
 *   Set VITE_USE_MOCK=false (or remove) when connecting to the real backend.
 */

export * from './auth.mock'
export * from './attendance.mock'
export * from './mock-server'
