import Taro from '@tarojs/taro'
import type { ApiResponse } from '../types'

// API 基础地址
// 开发环境（H5/模拟器调试）：使用本地后端
// 生产环境：使用线上地址
const isDev = process.env.NODE_ENV !== 'production'
const BASE_URL = isDev
  ? 'http://localhost:3000'
  : 'https://api.yuantou.community'

// 请求封装
interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  header?: Record<string, string>
  loading?: boolean
}

export const request = async <T = any>({
  url,
  method = 'GET',
  data,
  header = {},
  loading = true,
}: RequestOptions): Promise<ApiResponse<T>> => {
  if (loading) {
    Taro.showLoading({ title: '加载中...', mask: true })
  }

  try {
    const token = Taro.getStorageSync('token')

    const response = await Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...header,
      },
      timeout: 15000,
    })

    if (loading) {
      Taro.hideLoading()
    }

    if (response.statusCode === 200) {
      const result = response.data as ApiResponse<T>
      // 业务层错误（非 0）
      if (result.code !== 0) {
        Taro.showToast({ title: result.message || '请求失败', icon: 'none' })
        return Promise.reject(result)
      }
      return result
    } else if (response.statusCode === 401) {
      Taro.removeStorageSync('token')
      Taro.removeStorageSync('currentUser')
      // 跳登录页（如果不在登录页）
      const pages = Taro.getCurrentPages()
      if (pages.length === 0 || !pages[pages.length-1].route.includes('login')) {
        Taro.reLaunch({ url: '/pages/login/index' })
      }
      return Promise.reject(new Error('登录已过期'))
    } else {
      Taro.showToast({
        title: response.data?.message || `请求失败(${response.statusCode})`,
        icon: 'none',
      })
      return Promise.reject(response.data)
    }
  } catch (error: any) {
    if (loading) Taro.hideLoading()

    const msg = error?.message || error?.errMsg || '网络错误'
    // 避免登录页本身触发过多提示
    const pages = Taro.getCurrentPages()
    const isLoginPage = pages.length > 0 && pages[pages.length-1].route.includes('login')
    if (!isLoginPage && msg !== 'request:fail ') {
      Taro.showToast({ title: msg, icon: 'none', duration: 2000 })
    }
    return Promise.reject(error)
  }
}

// 快捷方法
export const get = <T = any>(url: string, data?: any, loading = true) =>
  request<T>({ url, method: 'GET', data, loading })

export const post = <T = any>(url: string, data?: any, loading = true) =>
  request<T>({ url, method: 'POST', data, loading })

export const put = <T = any>(url: string, data?: any, loading = true) =>
  request<T>({ url, method: 'PUT', data, loading })

export const del = <T = any>(url: string, data?: any, loading = true) =>
  request<T>({ url, method: 'DELETE', data, loading })

// 文件上传
export const uploadFile = (filePath: string, formData?: Record<string, string>) => {
  return new Promise<{ url: string }>((resolve, reject) => {
    Taro.uploadFile({
      url: `${BASE_URL}/upload`,
      filePath,
      name: 'file',
      formData,
      header: {
        'Authorization': Taro.getStorageSync('token')
          ? `Bearer ${Taro.getStorageSync('token')}`
          : '',
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data)
          resolve({ url: data.data.url })
        } else {
          reject(new Error('上传失败'))
        }
      },
      fail: reject,
    })
  })
}

// 导出 BASE_URL 供其他模块使用
export { BASE_URL }
