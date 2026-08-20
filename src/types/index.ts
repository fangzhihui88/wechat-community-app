// 用户类型
export interface User {
  id: string
  nickname: string
  avatar: string
  bio?: string
  following: number
  followers: number
  posts: number
  isFollowing?: boolean
  isVip?: boolean
}

// 动态类型
export interface Post {
  id: string
  user: User
  content: string
  images?: string[]
  videos?: string[]
  topics?: Topic[]
  likes: number
  comments: number
  shares: number
  isLiked?: boolean
  isBookmarked?: boolean
  createdAt: string
  location?: string
}

// 评论类型
export interface Comment {
  id: string
  user: User
  content: string
  likes: number
  isLiked?: boolean
  replies?: Comment[]
  replyTo?: User
  createdAt: string
}

// 话题类型
export interface Topic {
  id: string
  name: string
  icon?: string
  posts: number
  description?: string
  isFollowed?: boolean
}

// 消息类型
export interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'system' | 'mention'
  user?: User
  content: string
  post?: Post
  isRead: boolean
  createdAt: string
}

// API 响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// TabBar 配置
export interface TabBarItem {
  pagePath: string
  text: string
  iconPath: string
  selectedIconPath: string
}
