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

// ============== 健康打卡 ==============
export interface HealthRecord {
  id: string
  date: string
  steps: number
  sleepHours: number
  waterMl: number
  checked: boolean
}
export interface HealthPlan {
  id: string
  streak: number
  todayDone: boolean
  totalDays: number
  records: HealthRecord[]
}

// ============== 学习 ==============
export interface StudyPlan {
  id: string
  title: string
  cover: string
  progress: number
  totalHours: number
  category: string
}
export interface Course {
  id: string
  title: string
  teacher: string
  cover: string
  duration: string
  students: number
}

// ============== 美食菜谱 ==============
export type RecipeCategory = '早餐' | '午餐' | '晚餐' | '甜点' | '饮品'
export interface Recipe {
  id: string
  title: string
  author: string
  cover: string
  likes: number
  category: RecipeCategory
  cookTime: string
  difficulty: string
}

// ============== 旅游攻略 ==============
export interface Destination {
  id: string
  name: string
  cover: string
  desc: string
  rating: number
}
export interface TravelArticle {
  id: string
  title: string
  location: string
  reads: number
  cover: string
  author: string
  date: string
}

// ============== 宠物 ==============
export type PetStatus = '待领养' | '已领养' | '救助中'
export interface Pet {
  id: string
  name: string
  species: string
  breed: string
  age: string
  gender: string
  weight: string
  status: PetStatus
  avatar: string
  owner: string
  images: string[]
  notes: string[]
}

// ============== 车辆 ==============
export type CarType = '轿车' | 'SUV' | '跑车' | '电动车' | '摩托'
export interface Car {
  id: string
  brand: string
  model: string
  type: CarType
  cover: string
  ownerAvatar: string
  ownerName: string
  location: string
  likes: number
}

// ============== 房产 ==============
export interface Listing {
  id: string
  community: string
  address: string
  area: number
  price: number
  unitPrice: number
  cover: string
  rooms: string
  floor: string
 朝向: string
  decorated: boolean
}

// ============== 婚庆 ==============
export type WeddingCategory = '摄影' | '化妆' | '场地' | '礼服' | '策划'
export interface WeddingVendor {
  id: string
  name: string
  category: WeddingCategory
  cover: string
  rating: number
  priceRange: string
  tags: string[]
}
export interface WeddingProgress {
  step: string
  done: boolean
}

// ============== 读书 ==============
export interface Book {
  id: string
  title: string
  author: string
  cover: string
  progress: number
  totalPages: number
}
export interface BookReview {
  id: string
  bookTitle: string
  rating: number
  comment: string
  userAvatar: string
  userName: string
}

// ============== 音乐 ==============
export interface Song {
  id: string
  title: string
  artist: string
  cover: string
  duration: string
}
export interface Playlist {
  id: string
  name: string
  cover: string
  trackCount: number
  creator: string
}

// ============== 摄影 ==============
export type PhotoCategory = '人像' | '风景' | '纪实' | '建筑' | '夜景'
export interface Photographer {
  id: string
  name: string
  avatar: string
  style: string
  worksCount: number
}
export interface Photo {
  id: string
  url: string
  photographer: string
  likes: number
  category: PhotoCategory
}

// ============== 艺术 ==============
export type ArtCategory = '油画' | '水彩' | '雕塑' | '摄影' | '装置'
export interface Artwork {
  id: string
  title: string
  artist: string
  year: number
  cover: string
  desc: string
  category: ArtCategory
}

// ============== 追星 ==============
export interface IdolSchedule {
  date: string
  event: string
  location: string
}
export interface IdolGoods {
  id: string
  name: string
  price: number
  cover: string
}
export interface IdolNews {
  id: string
  title: string
  time: string
  cover: string
}

// ============== 健身 ==============
export interface FitnessPlan {
  id: string
  name: string
  difficulty: string
  duration: string
  members: number
  cover: string
}
export interface Coach {
  id: string
  name: string
  avatar: string
  specialty: string
  rating: number
}

// ============== 母婴 ==============
export type BabyStage = '孕早期' | '孕中期' | '孕晚期' | '0-1岁' | '1-3岁'
export interface BabyArticle {
  id: string
  title: string
  category: string
  reads: number
  cover: string
}
export interface BabyProduct {
  id: string
  name: string
  rating: number
  price: number
  cover: string
}

// ============== 心理健康 ==============
export type MoodType = '😊开心' | '😐一般' | '😢难过' | '😠生气'
export interface MentalTest {
  id: string
  name: string
  participants: number
  description: string
}
export interface MentalArticle {
  id: string
  title: string
  category: string
  reads: number
  cover: string
}

// ============== 美容美妆 ==============
export interface BeautyStep {
  id: number
  step: string
  product: string
  tip: string
}
export interface BeautyTutorial {
  id: string
  title: string
  difficulty: string
  cover: string
  collects: number
}
export interface Ingredient {
  id: string
  name: string
  effect: string
  safetyLevel: number // 1-5
}

// ============== 公益 ==============
export interface CharityProject {
  id: string
  name: string
  org: string
  participants: number
  progress: number
  cover: string
  target: number
}
export interface CharityNews {
  id: string
  title: string
  time: string
  cover: string
}

// ============== 生活预测 ==============
export type ZodiacSign = '白羊座' | '金牛座' | '双子座' | '巨蟹座' | '狮子座' | '处女座' | '天秤座' | '天蝎座' | '射手座' | '摩羯座' | '水瓶座' | '双鱼座'
export type FortuneDimension = '爱情' | '事业' | '财运' | '健康'
export interface FortuneRating {
  dimension: FortuneDimension
  star: number // 1-5
}
export interface FortuneResult {
  sign: ZodiacSign
  overall: string
  ratings: FortuneRating[]
  luckyColor: string
  luckyNumber: number
}
