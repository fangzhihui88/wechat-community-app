import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import FeedCard from '../../components/FeedCard'
import UserAvatar from '../../components/UserAvatar'
import EmptyState from '../../components/EmptyState'
import { formatNumber } from '../../utils/formatTime'
import type { Post, User } from '../../types'
import './index.css'

const MOCK_USERS: Record<string, User> = {
  '1002': {
    id: '1002',
    nickname: '小明同学',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
    bio: '喜欢摄影和旅行，记录生活的美好瞬间 📷✈️',
    following: 128,
    followers: 892,
    posts: 45,
    isVip: true,
  },
  '1003': {
    id: '1003',
    nickname: '产品经理小王',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80',
    bio: '专注产品思考与用户体验，分享产品方法论',
    following: 234,
    followers: 1205,
    posts: 78,
    isVip: false,
  },
  '1004': {
    id: '1004',
    nickname: '设计师阿花',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80',
    bio: 'UI/UX设计师 | 追求极致的视觉体验',
    following: 89,
    followers: 2341,
    posts: 112,
    isVip: true,
  },
}

const MOCK_POSTS: Record<string, Post[]> = {
  '1002': [
    {
      id: 'p1',
      userId: '1002',
      nickname: '小明同学',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
      content: '今天去了趟西湖，天气超好！拍了超多照片，感觉整个人都被治愈了 🌸',
      images: ['https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=800&fit=crop&q=80'],
      likes: 234,
      comments: 45,
      createdAt: '2024-03-15T10:30:00Z',
      isVip: true,
    },
    {
      id: 'p2',
      userId: '1002',
      nickname: '小明同学',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
      content: '新入手的相机到了，试拍了几张，色彩表现真的太棒了！',
      images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop&q=80', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80'],
      likes: 189,
      comments: 32,
      createdAt: '2024-03-10T15:20:00Z',
      isVip: true,
    },
    {
      id: 'p3',
      userId: '1002',
      nickname: '小明同学',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
      content: '周末徒步穿越山林，感受大自然的宁静与力量。累并快乐着！',
      images: [],
      likes: 156,
      comments: 28,
      createdAt: '2024-03-05T08:00:00Z',
      isVip: true,
    },
  ],
  '1003': [
    {
      id: 'p4',
      userId: '1003',
      nickname: '产品经理小王',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80',
      content: '最近在研究 AI 产品方向，有一些思考想和大家分享...',
      images: [],
      likes: 456,
      comments: 89,
      createdAt: '2024-03-14T14:00:00Z',
      isVip: false,
    },
    {
      id: 'p5',
      userId: '1003',
      nickname: '产品经理小王',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80',
      content: '参加了一场产品经理大会，收获满满，记录一下核心观点：\n1. 用户增长的核心是留存\n2. 数据驱动决策\n3. 体验是产品的护城河',
      images: [],
      likes: 678,
      comments: 134,
      createdAt: '2024-03-08T20:00:00Z',
      isVip: false,
    },
    {
      id: 'p6',
      userId: '1003',
      nickname: '产品经理小王',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80',
      content: '今天完成了 A/B 测试的方案设计，期待数据表现！',
      images: [],
      likes: 234,
      comments: 45,
      createdAt: '2024-03-01T11:30:00Z',
      isVip: false,
    },
  ],
  '1004': [
    {
      id: 'p7',
      userId: '1004',
      nickname: '设计师阿花',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80',
      content: '刚完成一套 APP 设计稿，分享一下整体风格探索过程 🔥',
      images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80'],
      likes: 892,
      comments: 167,
      createdAt: '2024-03-16T16:00:00Z',
      isVip: true,
    },
    {
      id: 'p8',
      userId: '1004',
      nickname: '设计师阿花',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80',
      content: 'Figma 的新插件太好用了，效率直接翻倍！强烈推荐给各位设计师同行～',
      images: [],
      likes: 567,
      comments: 98,
      createdAt: '2024-03-12T09:30:00Z',
      isVip: true,
    },
    {
      id: 'p9',
      userId: '1004',
      nickname: '设计师阿花',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80',
      content: '色彩心理学在 UI 设计中的应用，颜色不只是装饰，更是沟通的语言。',
      images: [],
      likes: 445,
      comments: 76,
      createdAt: '2024-03-06T14:00:00Z',
      isVip: true,
    },
  ],
}

const UserDetail = memo(() => {
  const router = useRouter()
  const { currentUser } = useAppStore()
  const userId = router.params.userId || ''

  const [isFollowing, setIsFollowing] = useState(false)

  const isSelf = !userId || userId === currentUser?.id
  const targetUser: User | undefined = isSelf
    ? currentUser
    : MOCK_USERS[userId] || {
        id: userId,
        nickname: '未知用户',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
        bio: '这个人很懒，什么都没写',
        following: 0,
        followers: 0,
        posts: 0,
        isVip: false,
      }

  const userPosts: Post[] = isSelf
    ? []
    : MOCK_POSTS[userId] || []

  const handleFollow = useCallback(() => {
    setIsFollowing((prev) => {
      const next = !prev
      Taro.showToast({
        title: next ? '已关注' : '已取消关注',
        icon: 'none',
      })
      return next
    })
  }, [])

  const handleMessage = useCallback(() => {
    Taro.navigateTo({ url: `/pages/chat/index?convId=conv_${userId}` })
  }, [userId])

  const handleEditProfile = useCallback(() => {
    Taro.navigateTo({ url: '/pages/edit-profile/index' })
  }, [])

  const handleComment = useCallback(
    (postId: string) => {
      Taro.navigateTo({ url: `/pages/post-detail/index?postId=${postId}` })
    },
    []
  )

  const handleUserClick = useCallback((uid: string) => {
    Taro.navigateTo({ url: `/pages/user-detail/index?userId=${uid}` })
  }, [])

  const handleTopicClick = useCallback((topic: string) => {
    Taro.navigateTo({ url: `/pages/topic/index?topicId=${encodeURIComponent(topic)}` })
  }, [])

  return (
    <View className="user-detail">
      <NavBar title="个人主页" showBack />

      <ScrollView scrollY className="user-detail__scroll">
        {/* 用户信息头部 */}
        <View className="user-detail__header">
          <UserAvatar user={targetUser} size="large" showVipBadge />

          <View className="user-detail__info">
            <View className="user-detail__name-row">
              <Text className="user-detail__nickname">{targetUser?.nickname}</Text>
              {targetUser?.isVip && <View className="user-detail__vip-badge">VIP</View>}
            </View>
            <Text className="user-detail__bio">{targetUser?.bio}</Text>

            {/* 统计数据 */}
            <View className="user-detail__stats">
              <View className="user-detail__stat-item">
                <Text className="user-detail__stat-num">{formatNumber(targetUser?.posts || 0)}</Text>
                <Text className="user-detail__stat-label">动态</Text>
              </View>
              <View className="user-detail__stat-divider" />
              <View className="user-detail__stat-item">
                <Text className="user-detail__stat-num">{formatNumber(targetUser?.followers || 0)}</Text>
                <Text className="user-detail__stat-label">粉丝</Text>
              </View>
              <View className="user-detail__stat-divider" />
              <View className="user-detail__stat-item">
                <Text className="user-detail__stat-num">{formatNumber(targetUser?.following || 0)}</Text>
                <Text className="user-detail__stat-label">关注</Text>
              </View>
            </View>
          </View>

          {/* 操作按钮区 */}
          <View className="user-detail__actions">
            {isSelf ? (
              <View className="user-detail__edit-btn" onClick={handleEditProfile}>
                <Text className="user-detail__edit-text">编辑资料</Text>
              </View>
            ) : (
              <>
                <View
                  className={`user-detail__follow-btn ${isFollowing ? 'user-detail__follow-btn--followed' : ''}`}
                  onClick={handleFollow}
                >
                  <Text className="user-detail__follow-text">{isFollowing ? '已关注' : '关注'}</Text>
                </View>
                <View className="user-detail__message-btn" onClick={handleMessage}>
                  <Text className="user-detail__message-text">私信</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* 动态列表 */}
        <View className="user-detail__feeds">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                onComment={handleComment}
                onUserClick={handleUserClick}
                onTopicClick={handleTopicClick}
              />
            ))
          ) : (
            !isSelf && <EmptyState icon="📭" title="暂无动态" />
          )}
          {isSelf && <EmptyState icon="📝" title="还没有发布过动态" description="快去发布第一条吧！" />}
        </View>
      </ScrollView>
    </View>
  )
})

export default UserDetail

(UserDetail as any).config = { navigationStyle: 'custom' }
