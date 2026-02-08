// config.ts
export const axiosConfig = {
  timeout: 10000,
  retryCount: 2,
  refreshEndpoint: '/auth/refresh',
  fallbackUrls: {
    development: 'http://localhost:3000/api',
    production: '/api'
  }
} as const;