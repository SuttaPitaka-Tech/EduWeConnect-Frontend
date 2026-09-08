/**
 * Central API Gateway Configuration
 * All client requests route through the API Gateway (port 7001).
 */
export const API_GATEWAY_URL = import.meta.env.VITE_API_URL || 'http://localhost:7001/api'
export const GATEWAY_HOST_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:7001'
