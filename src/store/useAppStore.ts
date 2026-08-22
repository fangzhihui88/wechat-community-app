import { create } from 'zustand'
import type {
  User, Post, Notification, Conversation, Topic, Comment,
  FeedTab, ThemeMode, SearchType,
} from '../types'

// ============== Mock 数据 ==============
const mockCurrentUser: User = {
  id: 'user_001',
  nickname: '前端开发者',
  avatar: 'https://picsum.photos/200',
  bio: '热爱前端技术，追求卓越用户体验',
  gender: 'male',
  location: '深圳',
  following: 128,
  followers: 1024,
  posts: 56,
  isVip: true,
}

const mkPost = (
  id: string, user: Partial<User> & { id: string; nickname: string; avatar: string },
  content: string, opts: Partial<Post> = {},
): Post => ({
  id, user: { ...mockCurrentUser, ...user } as User, content,
  type: 'text', likes: 0, comments: 0, shares: 0, createdAt: new Date().toISOString(),
  ...opts,
})

const mockPosts: Post[] = [
  mkPost('post_001',
    { id: 'user_002', nickname: '产品经理小王', avatar: 'https://picsum.photos/201', followers: 5200, isVip: true },
    '今天分享一个 React 性能优化的技巧 —— 使用 useMemo 和 useCallback 来避免不必要的重新渲染。#前端 #React',
    { images: ['https://picsum.photos/400/300', 'https://picsum.photos/400/301'], topics: [{ id: 'topic_001', name: '前端', posts: 10000 }], likes: 328, comments: 45, shares: 12 }),
  mkPost('post_002',
    { id: 'user_003', nickname: '设计师阿美', avatar: 'https://picsum.photos/202', followers: 8900 },
    '分享一组极简风格的 UI 设计稿，大家觉得怎么样？',
    { images: ['https://picsum.photos/400/302', 'https://picsum.photos/400/303', 'https://picsum.photos/400/304'], topics: [{ id: 'topic_002', name: 'UI设计', posts: 8500 }], likes: 567, comments: 89, shares: 34, location: '深圳·南山' }),
  mkPost('post_003',
    { id: 'user_004', nickname: '全栈工程师', avatar: 'https://picsum.photos/203', followers: 3200, isVip: true },
    'TypeScript 4.9 发布！这些新特性你一定要知道...',
    { images: ['https://picsum.photos/400/305'], topics: [{ id: 'topic_003', name: 'TypeScript', posts: 5200 }], likes: 234, comments: 67, shares: 45 }),
  mkPost('post_004',
    { id: 'user_005', nickname: '技术大V', avatar: 'https://picsum.photos/204', followers: 50000, isVip: true },
    '一分钟看懂前端工程化演进 🚀',
    { videos: ['https://www.w3schools.com/html/mov_bbb.mp4'], type: 'video', topics: [{ id: 'topic_004', name: '工程化', posts: 3100 }], likes: 1203, comments: 156, shares: 89 }),
]

const mockTopics: Topic[] = [
  { id: 'topic_001', name: '前端', posts: 10000, description: '前端开发技术交流', isFollowed: true },
  { id: 'topic_002', name: 'UI设计', posts: 8500, description: 'UI/UX 设计分享' },
  { id: 'topic_003', name: 'React', posts: 7200 },
  { id: 'topic_004', name: 'TypeScript', posts: 6500 },
  { id: 'topic_005', name: 'Vue', posts: 5800 },
  { id: 'topic_006', name: '小程序', posts: 5200 },
  { id: 'topic_007', name: 'Node.js', posts: 4800 },
  { id: 'topic_008', name: '产品经理', posts: 4200 },
]

const mockNotifications: Notification[] = [
  { id: 'notif_001', type: 'like', user: { ...mockCurrentUser, id: 'user_002', nickname: '产品经理小王', avatar: 'https://picsum.photos/201' }, content: '赞了你的动态', post: mockPosts[0], isRead: false, createdAt: '2026-08-21T12:00:00Z' },
  { id: 'notif_002', type: 'comment', user: { ...mockCurrentUser, id: 'user_003', nickname: '设计师阿美', avatar: 'https://picsum.photos/202' }, content: '评论了你的动态：「写得很好！」', post: mockPosts[0], isRead: false, createdAt: '2026-08-21T11:30:00Z' },
  { id: 'notif_003', type: 'follow', user: { ...mockCurrentUser, id: 'user_004', nickname: '全栈工程师', avatar: 'https://picsum.photos/203' }, content: '关注了你', isRead: true, createdAt: '2026-08-21T10:00:00Z' },
  { id: 'notif_004', type: 'system', content: '欢迎加入社区！记得完善个人资料哦~', isRead: false, createdAt: '2026-08-20T09:00:00Z' },
]

const mockConversations: Conversation[] = [
  { id: 'conv_001', user: { id: 'user_002', nickname: '产品经理小王', avatar: 'https://picsum.photos/201', following: 0, followers: 5200 }, lastMessage: '那个需求文档你看了吗？', lastTime: '2026-08-21T18:00:00Z', unread: 2, messages: [
    { id: 'm1', conversationId: 'conv_001', senderId: 'user_002', content: '在吗？', createdAt: '2026-08-21T17:50:00Z' },
    { id: 'm2', conversationId: 'conv_001', senderId: 'user_002', content: '那个需求文档你看了吗？', createdAt: '2026-08-21T18:00:00Z' },
  ] },
  { id: 'conv_002', user: { id: 'user_003', nickname: '设计师阿美', avatar: 'https://picsum.photos/202', following: 0, followers: 8900 }, lastMessage: '[图片]', lastTime: '2026-08-20T20:30:00Z', unread: 0, messages: [] },
]

// ============== Store ==============
interface AppState {
  currentUser: User | null
  isLoggedIn: boolean
  themeMode: ThemeMode

  posts: Post[]
  feedTab: FeedTab
  hasMorePosts: boolean
  postsPage: number

  bookmarks: Post[]
  likedPosts: string[]

  topics: Topic[]
  notifications: Notification[]
  unreadCount: number
  conversations: Conversation[]

  followingList: User[]
  followersList: User[]

  isLoading: boolean
  isRefreshing: boolean

  // actions
  setCurrentUser: (u: User | null) => void
  setLoginStatus: (s: boolean) => void
  toggleTheme: () => void
  setTheme: (m: ThemeMode) => void

  setFeedTab: (t: FeedTab) => void
  addPost: (p: Post) => void
  updatePost: (id: string, u: Partial<Post>) => void
  removePost: (id: string) => void
  setPosts: (p: Post[]) => void
  appendPosts: (p: Post[]) => void
  setHasMorePosts: (b: boolean) => void
  setPostsPage: (n: number) => void

  toggleLike: (postId: string) => void
  toggleBookmark: (postId: string) => void

  setTopics: (t: Topic[]) => void
  followTopic: (id: string) => void

  addNotification: (n: Notification) => void
  setNotifications: (n: Notification[]) => void
  markAsRead: (id: string) => void
  markAllRead: () => void
  setUnreadCount: (n: number) => void

  addConversation: (c: Conversation) => void
  sendMessage: (convId: string, content: string) => void
  markConversationRead: (convId: string) => void

  setFollowingList: (u: User[]) => void
  setFollowersList: (u: User[]) => void
  toggleFollowUser: (userId: string) => void

  setLoading: (b: boolean) => void
  setRefreshing: (b: boolean) => void
}

const findPost = (posts: Post[], id: string) => posts.find((p) => p.id === id)

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: mockCurrentUser,
  isLoggedIn: true,
  themeMode: 'light',

  posts: mockPosts,
  feedTab: 'recommend',
  hasMorePosts: true,
  postsPage: 1,

  bookmarks: [],
  likedPosts: [],

  topics: mockTopics,
  notifications: mockNotifications,
  unreadCount: 3,
  conversations: mockConversations,

  followingList: [mockCurrentUser, { id: 'user_002', nickname: '产品经理小王', avatar: 'https://picsum.photos/201', following: 0, followers: 5200 }],
  followersList: [{ id: 'user_004', nickname: '全栈工程师', avatar: 'https://picsum.photos/203', following: 0, followers: 3200 }, { id: 'user_005', nickname: '技术大V', avatar: 'https://picsum.photos/204', following: 0, followers: 50000, isVip: true }],

  isLoading: false,
  isRefreshing: false,

  setCurrentUser: (u) => set({ currentUser: u }),
  setLoginStatus: (s) => set({ isLoggedIn: s }),
  toggleTheme: () => set((s) => ({ themeMode: s.themeMode === 'light' ? 'dark' : 'light' })),
  setTheme: (m) => set({ themeMode: m }),

  setFeedTab: (t) => set({ feedTab: t }),
  addPost: (p) => set((s) => ({ posts: [p, ...s.posts] })),
  updatePost: (id, u) => set((s) => ({ posts: s.posts.map((p) => (p.id === id ? { ...p, ...u } : p)) })),
  removePost: (id) => set((s) => ({ posts: s.posts.filter((p) => p.id !== id) })),
  setPosts: (p) => set({ posts: p }),
  appendPosts: (p) => set((s) => ({ posts: [...s.posts, ...p] })),
  setHasMorePosts: (b) => set({ hasMorePosts: b }),
  setPostsPage: (n) => set({ postsPage: n }),

  toggleLike: (postId) => set((s) => {
    const posts = s.posts.map((p) => {
      if (p.id !== postId) return p
      const isLiked = !p.isLiked
      return { ...p, isLiked, likes: p.likes + (isLiked ? 1 : -1) }
    })
    const likedPosts = findPost(posts, postId)?.isLiked ? [...s.likedPosts, postId] : s.likedPosts.filter((x) => x !== postId)
    return { posts, likedPosts }
  }),
  toggleBookmark: (postId) => set((s) => {
    const posts = s.posts.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    const target = findPost(posts, postId)
    const bookmarks = target?.isBookmarked
      ? [target, ...s.bookmarks]
      : s.bookmarks.filter((b) => b.id !== postId)
    return { posts, bookmarks }
  }),

  setTopics: (t) => set({ topics: t }),
  followTopic: (id) => set((s) => ({ topics: s.topics.map((t) => (t.id === id ? { ...t, isFollowed: !t.isFollowed } : t)) })),

  addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications], unreadCount: s.unreadCount + 1 })),
  setNotifications: (n) => set({ notifications: n }),
  markAsRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)), unreadCount: Math.max(0, s.unreadCount - 1) })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, isRead: true })), unreadCount: 0 })),
  setUnreadCount: (n) => set({ unreadCount: n }),

  addConversation: (c) => set((s) => ({ conversations: [c, ...s.conversations] })),
  sendMessage: (convId, content) => set((s) => ({
    conversations: s.conversations.map((c) => c.id === convId
      ? { ...c, lastMessage: content, lastTime: new Date().toISOString(), messages: [...c.messages, { id: `m_${Date.now()}`, conversationId: convId, senderId: s.currentUser!.id, content, type: 'text', createdAt: new Date().toISOString() }] }
      : c),
  })),
  markConversationRead: (convId) => set((s) => ({
    conversations: s.conversations.map((c) => (c.id === convId ? { ...c, unread: 0 } : c)),
  })),

  setFollowingList: (u) => set({ followingList: u }),
  setFollowersList: (u) => set({ followersList: u }),
  toggleFollowUser: (userId) => set((s) => {
    const cu = s.currentUser
    if (!cu) return {}
    const isFollowing = cu.following > 0
    // 切换设计：在 followingList 中增删
    const exists = s.followingList.find((u) => u.id === userId)
    const followingList = exists ? s.followingList.filter((u) => u.id !== userId) : [...s.followingList, { id: userId, nickname: '用户' + userId.slice(-3), avatar: `https://picsum.photos/${200 + Math.floor(Math.random() * 50)}`, following: 0, followers: 100 }]
    return { followingList }
  }),

  setLoading: (b) => set({ isLoading: b }),
  setRefreshing: (b) => set({ isRefreshing: b }),
}))
