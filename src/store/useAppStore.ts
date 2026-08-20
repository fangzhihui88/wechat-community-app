import { create } from 'zustand'
import type { User, Post, Notification } from '../types'

interface AppState {
  // 用户信息
  currentUser: User | null
  isLoggedIn: boolean
  
  // 动态列表
  posts: Post[]
  hasMorePosts: boolean
  postsPage: number
  
  // 消息列表
  notifications: Notification[]
  unreadCount: number
  
  // 全局状态
  isLoading: boolean
  isRefreshing: boolean
  
  // Actions
  setCurrentUser: (user: User | null) => void
  setLoginStatus: (status: boolean) => void
  
  addPost: (post: Post) => void
  updatePost: (postId: string, updates: Partial<Post>) => void
  removePost: (postId: string) => void
  setPosts: (posts: Post[]) => void
  appendPosts: (posts: Post[]) => void
  setHasMorePosts: (hasMore: boolean) => void
  setPostsPage: (page: number) => void
  
  addNotification: (notification: Notification) => void
  setNotifications: (notifications: Notification[]) => void
  markAsRead: (notificationId: string) => void
  setUnreadCount: (count: number) => void
  
  setLoading: (loading: boolean) => void
  setRefreshing: (refreshing: boolean) => void
}

// 模拟当前用户数据
const mockCurrentUser: User = {
  id: 'user_001',
  nickname: '前端开发者',
  avatar: 'https://picsum.photos/200',
  bio: '热爱前端技术，追求卓越用户体验',
  following: 128,
  followers: 1024,
  posts: 56,
  isVip: true,
}

// 模拟动态数据
const mockPosts: Post[] = [
  {
    id: 'post_001',
    user: {
      id: 'user_002',
      nickname: '产品经理小王',
      avatar: 'https://picsum.photos/201',
      followers: 5200,
      isVip: true,
    },
    content: '今天分享一个 React 性能优化的技巧 —— 使用 useMemo 和 useCallback 来避免不必要的重新渲染。#前端 #React',
    images: [
      'https://picsum.photos/400/300',
      'https://picsum.photos/400/301',
    ],
    topics: [{ id: 'topic_001', name: '前端', posts: 10000 }],
    likes: 328,
    comments: 45,
    shares: 12,
    isLiked: false,
    createdAt: '2026-08-14T10:30:00Z',
  },
  {
    id: 'post_002',
    user: {
      id: 'user_003',
      nickname: '设计师阿美',
      avatar: 'https://picsum.photos/202',
      followers: 8900,
    },
    content: '分享一组极简风格的 UI 设计稿，大家觉得怎么样？',
    images: [
      'https://picsum.photos/400/302',
      'https://picsum.photos/400/303',
      'https://picsum.photos/400/304',
    ],
    topics: [{ id: 'topic_002', name: 'UI设计', posts: 8500 }],
    likes: 567,
    comments: 89,
    shares: 34,
    isLiked: true,
    createdAt: '2026-08-14T09:15:00Z',
    location: '深圳·南山',
  },
  {
    id: 'post_003',
    user: {
      id: 'user_004',
      nickname: '全栈工程师',
      avatar: 'https://picsum.photos/203',
      followers: 3200,
      isVip: true,
    },
    content: 'TypeScript 4.9 发布！这些新特性你一定要知道...',
    images: ['https://picsum.photos/400/305'],
    topics: [{ id: 'topic_003', name: 'TypeScript', posts: 5200 }],
    likes: 234,
    comments: 67,
    shares: 45,
    isLiked: false,
    createdAt: '2026-08-14T08:00:00Z',
  },
]

// 模拟消息数据
const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'like',
    user: mockCurrentUser,
    content: '赞了你的动态',
    post: mockPosts[0],
    isRead: false,
    createdAt: '2026-08-14T12:00:00Z',
  },
  {
    id: 'notif_002',
    type: 'comment',
    user: mockCurrentUser,
    content: '评论了你的动态："写得很好！"',
    post: mockPosts[0],
    isRead: false,
    createdAt: '2026-08-14T11:30:00Z',
  },
  {
    id: 'notif_003',
    type: 'follow',
    user: mockCurrentUser,
    content: '关注了你',
    isRead: true,
    createdAt: '2026-08-14T10:00:00Z',
  },
]

export const useAppStore = create<AppState>((set) => ({
  // 初始状态
  currentUser: mockCurrentUser,
  isLoggedIn: true,
  posts: mockPosts,
  hasMorePosts: true,
  postsPage: 1,
  notifications: mockNotifications,
  unreadCount: 2,
  isLoading: false,
  isRefreshing: false,
  
  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  setLoginStatus: (status) => set({ isLoggedIn: status }),
  
  addPost: (post) => set((state) => ({
    posts: [post, ...state.posts],
  })),
  
  updatePost: (postId, updates) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId ? { ...post, ...updates } : post
    ),
  })),
  
  removePost: (postId) => set((state) => ({
    posts: state.posts.filter((post) => post.id !== postId),
  })),
  
  setPosts: (posts) => set({ posts }),
  
  appendPosts: (newPosts) => set((state) => ({
    posts: [...state.posts, ...newPosts],
  })),
  
  setHasMorePosts: (hasMore) => set({ hasMorePosts: hasMore }),
  
  setPostsPage: (page) => set({ postsPage: page }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),
  
  setNotifications: (notifications) => set({ notifications }),
  
  markAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  
  setUnreadCount: (count) => set({ unreadCount: count }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
}))
