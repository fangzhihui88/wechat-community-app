// ============== 用户 ==============
export interface User {
  id: string
  nickname: string
  avatar: string
  bio?: string
  gender?: 'male' | 'female' | 'unknown'
  location?: string
  following: number
  followers: number
  posts: number
  isFollowing?: boolean
  isFollowed?: boolean
  isVip?: boolean
  isBlocked?: boolean
}

// ============== 动态 ==============
export type PostType = 'text' | 'image' | 'video'

export interface Post {
  id: string
  user: User
  content: string
  type: PostType
  images?: string[]
  videos?: string[]
  topics?: Topic[]
  mentions?: User[]
  likes: number
  comments: number
  shares: number
  isLiked?: boolean
  isBookmarked?: boolean
  createdAt: string
  location?: string
}

// ============== 评论 ==============
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

// ============== 话题 ==============
export interface Topic {
  id: string
  name: string
  icon?: string
  cover?: string
  posts: number
  description?: string
  isFollowed?: boolean
}

// ============== 消息通知 ==============
export type NotificationType = 'like' | 'comment' | 'follow' | 'system' | 'mention'

export interface Notification {
  id: string
  type: NotificationType
  user?: User
  content: string
  post?: Post
  isRead: boolean
  createdAt: string
}

// ============== 私信 ==============
export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  type: 'text' | 'image'
  createdAt: string
  isRead?: boolean
}

export interface Conversation {
  id: string
  user: User
  lastMessage: string
  lastTime: string
  unread: number
  messages: ChatMessage[]
}

// ============== 通用 ==============
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface TabBarItem {
  pagePath: string
  text: string
  iconPath: string
  selectedIconPath: string
}

// 首页 Tab 类型
export type FeedTab = 'recommend' | 'follow' | 'nearby'

// 主题模式
export type ThemeMode = 'light' | 'dark'

// 搜索类型
export type SearchType = 'all' | 'post' | 'user' | 'topic'
