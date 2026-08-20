import Taro from '@tarojs/taro'
import type { ApiResponse } from '../types'

// API 基础地址（开发环境）
const BASE_URL = 'https://api.example.com'

// 请求封装
interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
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
    Taro.showLoading({ title: '加载中...' })
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
      timeout: 10000,
    })

    if (loading) {
      Taro.hideLoading()
    }

    if (response.statusCode === 200) {
      return response.data as ApiResponse<T>
    } else if (response.statusCode === 401) {
      // token 过期，跳转登录
      Taro.removeStorageSync('token')
      Taro.navigateTo({ url: '/pages/login/index' })
      return Promise.reject(new Error('未授权'))
    } else {
      Taro.showToast({
        title: response.data?.message || '请求失败',
        icon: 'none',
      })
      return Promise.reject(response.data)
    }
  } catch (error: any) {
    if (loading) {
      Taro.hideLoading()
    }
    
    Taro.showToast({
      title: error.message || '网络错误',
      icon: 'none',
    })
    
    return Promise.reject(error)
  }
}

// 快捷请求方法
export const get = <T = any>(url: string, data?: any) =>
  request<T>({ url, method: 'GET', data })

export const post = <T = any>(url: string, data?: any) =>
  request<T>({ url, method: 'POST', data })

export const put = <T = any>(url: string, data?: any) =>
  request<T>({ url, method: 'PUT', data })

export const del = <T = any>(url: string, data?: any) =>
  request<T>({ url, method: 'DELETE', data })

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
