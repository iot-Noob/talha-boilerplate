import axios, { type AxiosRequestConfig } from "axios"
import axiosRetry from "axios-retry"
import { validateUrl } from "./schema"
import { axiosConfig } from "./config"
import { ToastMsgs } from "../toastUtils"
import { useAuthStore } from "../../store/authStore"

// Extend Axios types
declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
    skipToast?: boolean;  // Add skipToast option
    _retry?: boolean;
    retryCount?: number;
  }
}

const API_URL = import.meta.env.VITE_API_URL

// Get validated URL with fallback
const getValidatedApiUrl = (): string => {
  try {
    return validateUrl(API_URL)
  } catch (err) {
    // ✅ Toast for invalid URL (user sees this)
    ToastMsgs.error(`Invalid API URL in environment configuration`)

    console.error('Invalid API URL:', err)

    const fallback = import.meta.env.DEV
      ? axiosConfig.fallbackUrls.development
      : axiosConfig.fallbackUrls.production

    console.log(`Using fallback: ${fallback}`)
    return fallback
  }
}

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: getValidatedApiUrl(),
  timeout: axiosConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Add retry logic
axiosRetry(axiosInstance, {
  retries: axiosConfig.retryCount,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkError(error) ||
      (error.response?.status || 0) >= 500
  }
})

// Request interceptor
let isRefreshing = false
interface FailedQueueItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}
let failedQueue: Array<FailedQueueItem> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState()
    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`
    }

    config.headers['X-Request-ID'] = crypto.randomUUID?.() || Date.now().toString()
    config.headers['X-App-Version'] = import.meta.env.VITE_APP_VERSION || '1.0.0'

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor with token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // ✅ Optional: Show success toast for specific operations
    if (response.config.method?.toUpperCase() === 'POST' ||
      response.config.method?.toUpperCase() === 'PUT' ||
      response.config.method?.toUpperCase() === 'DELETE') {
      // Only show if not skipped
      if (!response.config.skipToast) {
        const successMessages = {
          'POST': 'Created successfully',
          'PUT': 'Updated successfully',
          'DELETE': 'Deleted successfully'
        }
        const message = successMessages[response.config.method?.toUpperCase() as keyof typeof successMessages]
        if (message && response.status >= 200 && response.status < 300) {
          ToastMsgs.success(message)
        }
      }
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Network error
    if (!error.response) {
      // ✅ Show network error toast
      if (!originalRequest?.skipToast) {
        ToastMsgs.error('Network error. Please check your connection.')
      }

      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR'
      })
    }

    // Token refresh logic for 401
    if (error.response?.status === 401) {
      const isRefreshEndpoint = originalRequest?.url?.includes(axiosConfig.refreshEndpoint)
      const alreadyRetried = originalRequest?._retry

      if (!isRefreshEndpoint && !alreadyRetried) {
        originalRequest._retry = true

        if (isRefreshing) {
          // Queue request while refreshing
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return axiosInstance(originalRequest)
            })
            .catch(err => Promise.reject(err))
        }

        isRefreshing = true
        const { refreshToken } = useAuthStore.getState()

        if (!refreshToken) {
          // No refresh token, logout
          handleLogout()
          ToastMsgs.error('Session expired. Please login again.')
          return Promise.reject({
            status: 401,
            message: 'No refresh token available',
            code: 'NO_REFRESH_TOKEN'
          })
        }

        try {
          const refreshClient = axios.create({
            baseURL: getValidatedApiUrl(),
            timeout: 10000,
          })

          const response = await refreshClient.post(
            axiosConfig.refreshEndpoint,
            { refresh_token: refreshToken }
          )

          const newAccessToken = response.data.access_token
          const newRefreshToken = response.data.refresh_token || refreshToken

          useAuthStore.getState().setAuth(newAccessToken, newRefreshToken, useAuthStore.getState().user!)

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          processQueue(null, newAccessToken)

          return axiosInstance(originalRequest)

        } catch (refreshError: unknown) {
          handleLogout()
          processQueue(refreshError, null)
          ToastMsgs.error('Session expired. Please login again.')

          return Promise.reject({
            status: 401,
            message: 'Session expired. Please login again.',
            code: 'SESSION_EXPIRED'
          })

        } finally {
          isRefreshing = false
        }
      }

      // Already retried or is refresh endpoint, just logout
      if (isRefreshEndpoint || alreadyRetried) {
        handleLogout()
        // ✅ Show auth failed toast
        ToastMsgs.error('Authentication failed')
        return Promise.reject({
          status: 401,
          message: 'Authentication failed',
          code: 'AUTH_FAILED'
        })
      }
    }

    // Format other errors
    const errorMessage = error.response?.data?.message ||
      error.response?.data?.Message ||
      error.message ||
      'Request failed'

    // ✅ Show error toast (except 401 which is handled above)
    if (error.response?.status !== 401 && !originalRequest?.skipToast) {
      ToastMsgs.error(errorMessage)
    }

    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
    })
  }
)

// Helper function for logout
const handleLogout = () => {
  useAuthStore.getState().logout()

  if (!window.location.pathname.includes('/login') &&
    typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

// Export http wrapper with convenient methods
export const http = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config).then(res => res.data),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config).then(res => res.data),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config).then(res => res.data),

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config).then(res => res.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config).then(res => res.data),

  // Raw axios instance for advanced use
  instance: axiosInstance,
}

// Development logging
if (import.meta.env.DEV) {
  axiosInstance.interceptors.request.use(
    (config) => {
      console.group(`🌐 ${config.method?.toUpperCase()} ${config.url}`)
      console.log('Headers:', config.headers)
      console.log('Data:', config.data)
      console.groupEnd()
      return config
    }
  )

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log(`✅ ${response.status} ${response.config.url}`)
      return response
    },
    (error) => {
      console.error(`❌ ${error.response?.status || 'Network'} ${error.config?.url}`)
      console.error('Error:', error.message)
      return Promise.reject(error)
    }
  )
}