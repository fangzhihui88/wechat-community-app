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
  level?: number
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
  isMine?: boolean
  createdAt: string
  location?: string
  isHot?: boolean
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
  category?: string
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

// ============== 同城活动 ==============
export interface Activity {
  id: string
  title: string
  cover: string
  location: string
  startTime: string
  participants: number
  maxParticipants: number
  joined?: boolean
  host: User
  desc: string
}

// ============== 排行榜 ==============
export type RankingType = 'hot' | 'new' | 'vip'
export interface RankingItem {
  id: string
  rank: number
  user?: User
  post?: Post
  topic?: Topic
  score: number
  title: string
  trend: 'up' | 'down' | 'same'
}

// ============== 钱包 ==============
export type TxType = 'income' | 'expense'
export interface WalletTx {
  id: string
  type: TxType
  amount: number
  title: string
  createdAt: string
}
export interface Coupon {
  id: string
  name: string
  value: number
  threshold: number
  expiredAt: string
  used?: boolean
}

// ============== 积分商城 ==============
export interface MallProduct {
  id: string
  name: string
  image: string
  points: number
  stock: number
  exchanged?: boolean
}
export interface ExchangeRecord {
  id: string
  productName: string
  points: number
  createdAt: string
  status: 'pending' | 'done'
}

// ============== 成就/等级/签到 ==============
export interface Badge {
  id: string
  name: string
  icon: string
  desc: string
  unlocked: boolean
}
export interface LevelInfo {
  level: number
  name: string
  minPoints: number
  icon: string
}
export interface CheckinInfo {
  streak: number
  todayChecked: boolean
  totalDays: number
  rewards: { day: number; points: number }[]
}
export interface LotteryPrize {
  id: string
  name: string
  icon: string
  rate: number
}

// ============== 草稿/历史/访客 ==============
export interface Draft {
  id: string
  content: string
  images: string[]
  topic?: string
  updatedAt: string
}
export interface Visitor {
  id: string
  user: User
  visitedAt: string
}

// ============== 设置 ==============
export interface NotificationPrefs {
  like: boolean
  comment: boolean
  follow: boolean
  system: boolean
  chat: boolean
}
export interface UserSettings {
  fontSize: 'small' | 'medium' | 'large'
  saveDataMode: boolean
  soundOn: boolean
  vibrateOn: boolean
  language: string
  hideOnline: boolean
}
export interface FAQItem {
  q: string
  a: string
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
