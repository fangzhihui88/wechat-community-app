/**
 * 时间格式化工具
 */

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY

/**
 * 相对时间格式化（如"刚刚"、"5分钟前"）
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < MINUTE) {
    return '刚刚'
  } else if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE)
    return `${minutes}分钟前`
  } else if (diff < DAY) {
    const hours = Math.floor(diff / HOUR)
    return `${hours}小时前`
  } else if (diff < WEEK) {
    const days = Math.floor(diff / DAY)
    return `${days}天前`
  } else if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK)
    return `${weeks}周前`
  } else if (diff < YEAR) {
    const months = Math.floor(diff / MONTH)
    return `${months}个月前`
  } else {
    const years = Math.floor(diff / YEAR)
    return `${years}年前`
  }
}

/**
 * 格式化日期（完整格式）
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * 格式化日期（短格式）
 */
export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${month}-${day}`
}

/**
 * 格式化时间
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${hours}:${minutes}`
}

/**
 * 数字格式化（如 10000 -> 1万）
 */
export const formatNumber = (num: number): string => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1).replace(/\.0$/, '') + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1).replace(/\.0$/, '') + '万'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return String(num)
}

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 格式化距离
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  } else {
    return `${(meters / 1000).toFixed(1)}km`
  }
}
