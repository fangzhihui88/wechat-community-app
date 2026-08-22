import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { memo, useState, useCallback, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import FeedCard from '../../components/FeedCard'
import EmptyState from '../../components/EmptyState'
import { formatRelativeTime, formatNumber } from '../../utils/formatTime'
import type { Post, Topic } from '../../types'
import './index.css'

// local mock posts
function buildMockPosts(topicId: string, topicName: string): Post[] {
  const now = Date.now()
  return [
    {
      id: `${topicId}-1`,
      userId: 'user-001',
      user: { id: 'user-001', nickname: '小明', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&q=80' },
      content: `今天在 #${topicName} 里看到好多有趣的内容，大家讨论得很热烈！`,
      images: ['https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=800&fit=crop&q=800'],
      topicId,
      topicName,
      likes: 42,
      comments: 8,
      isLiked: false,
      createdAt: new Date(now - 30 * 60000).toISOString(),
    },
    {
      id: `${topicId}-2`,
      userId: 'user-002',
      user: { id: 'user-002', nickname: '阿华', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&q=80' },
      content: `关于 #${topicName}，我的看法是：内容质量真的越来越好了。`,
      images: [],
      topicId,
      topicName,
      likes: 15,
      comments: 3,
      isLiked: true,
      createdAt: new Date(now - 2 * 3600000).toISOString(),
    },
    {
      id: `${topicId}-3`,
      userId: 'user-003',
      user: { id: 'user-003', nickname: '小鱼', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&q=80' },
      content: `#${topicName} 这个话题好棒！`,
      images: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop&q=800',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop&q=801',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop&q=802',
      ],
      topicId,
      topicName,
      likes: 88,
      comments: 22,
      isLiked: false,
      createdAt: new Date(now - 5 * 3600000).toISOString(),
    },
    {
      id: `${topicId}-4`,
      userId: 'user-004',
      user: { id: 'user-004', nickname: '叶子', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&q=80' },
      content: `终于找到组织了！#${topicName} 的氛围太棒了，强烈推荐给大家！`,
      images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80'],
      topicId,
      topicName,
      likes: 33,
      comments: 7,
      isLiked: false,
      createdAt: new Date(now - 10 * 3600000).toISOString(),
    },
  ]
}

// default topic fallback
const defaultTopic: Topic = {
  id: '',
  name: '未知话题',
  description: '暂无描述',
  coverImage: '',
  followers: 0,
  posts: 0,
  isFollowed: false,
  createdAt: new Date().toISOString(),
}

const TopicPage = memo(function TopicPage() {
  const router = useRouter()
  const topicId = router.params.topicId ?? ''

  const { topics, followTopic } = useAppStore()

  const topic = topics.find((t) => t.id === topicId) ?? { ...defaultTopic, id: topicId }

  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    setPosts(buildMockPosts(topicId, topic.name))
  }, [topicId, topic.name])

  const handleFollow = useCallback(() => {
    followTopic(topicId)
    const t = topics.find((x) => x.id === topicId)
    Taro.showToast({
      title: t?.isFollowed ? '已取消关注' : '已关注',
      icon: 'none',
      duration: 1500,
    })
  }, [topicId, followTopic, topics])

  const handleComment = useCallback(
    (postId: string) => {
      Taro.navigateTo({ url: `/pages/post-detail/index?postId=${postId}` })
    },
    [],
  )

  const handleUserClick = useCallback((userId: string) => {
    Taro.navigateTo({ url: `/pages/user-detail/index?userId=${userId}` })
  }, [])

  const handleTopicClick = useCallback((tid: string) => {
    Taro.navigateTo({ url: `/pages/topic/index?topicId=${tid}` })
  }, [])

  return (
    <View className="topic-page">
      <NavBar title="话题" showBack />

      <ScrollView scroll-y className="topic-scroll" show-scrollbar={false}>
        {/* topic header card */}
        <View className="topic-header">
          <View className="topic-name-row">
            <Text className="topic-name">#{topic.name}</Text>
            <View
              className={`topic-follow-btn ${topic.isFollowed ? 'followed' : ''}`}
              onClick={handleFollow}
            >
              <Text className="topic-follow-text">
                {topic.isFollowed ? '已关注' : '关注'}
              </Text>
            </View>
          </View>

          <Text className="topic-desc">{topic.description || '暂无描述'}</Text>

          <View className="topic-stats">
            <Text className="topic-stat">
              <Text className="stat-num">{formatNumber(topic.posts ?? 0)}</Text>
              <Text className="stat-label"> 动态</Text>
            </Text>
            <Text className="topic-stat">
              <Text className="stat-num">{formatNumber(topic.followers ?? 0)}</Text>
              <Text className="stat-label"> 关注</Text>
            </Text>
          </View>
        </View>

        {/* feed list */}
        <View className="feed-section">
          {posts.length === 0 ? (
            <EmptyState
              icon="feed"
              title="暂无动态"
              description="成为第一个分享的人吧"
            />
          ) : (
            posts.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                onComment={handleComment}
                onUserClick={handleUserClick}
                onTopicClick={handleTopicClick}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  )
})

export default TopicPage

TopicPage.config = {
  navigationStyle: 'custom',
} as any
