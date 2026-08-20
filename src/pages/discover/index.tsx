import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import SearchBar from '../../components/SearchBar'
import TopicTag from '../../components/TopicTag'
import FeedCard from '../../components/FeedCard'
import EmptyState from '../../components/EmptyState'
import type { Topic, Post } from '../../types'
import { useAppStore } from '../../store/useAppStore'
import './index.css'

// 模拟热门话题
const mockTopics: Topic[] = [
  { id: 'topic_001', name: '前端', posts: 10000 },
  { id: 'topic_002', name: 'React', posts: 8500 },
  { id: 'topic_003', name: 'Vue', posts: 7200 },
  { id: 'topic_004', name: 'TypeScript', posts: 6500 },
  { id: 'topic_005', name: 'Node.js', posts: 5800 },
  { id: 'topic_006', name: '小程序', posts: 5200 },
  { id: 'topic_007', name: 'UI设计', posts: 4800 },
  { id: 'topic_008', name: '产品经理', posts: 4200 },
]

// 模拟精选动态
const mockFeaturedPosts: Post[] = [
  {
    id: 'featured_001',
    user: {
      id: 'user_005',
      nickname: '技术大V',
      avatar: 'https://picsum.photos/220',
      followers: 50000,
      isVip: true,
    },
    content: '精选内容推荐给大家，点击查看详情...',
    images: ['https://picsum.photos/600/400'],
    likes: 5200,
    comments: 328,
    shares: 156,
    createdAt: new Date().toISOString(),
  },
]

const Discover = memo(() => {
  const [activeTab, setActiveTab] = useState<'hot' | 'follow' | 'nearby'>('hot')
  const [searchKeyword, setSearchKeyword] = useState('')
  const { posts } = useAppStore()

  const handleSearch = useCallback((value: string) => {
    setSearchKeyword(value)
    if (value.trim()) {
      Taro.navigateTo({
        url: `/pages/search/index?keyword=${encodeURIComponent(value)}`,
      })
    }
  }, [])

  const handleTopicClick = useCallback((topicId: string) => {
    Taro.navigateTo({
      url: `/pages/topic/index?topicId=${topicId}`,
    })
  }, [])

  const handlePostClick = useCallback((postId: string) => {
    Taro.navigateTo({
      url: `/pages/post-detail/index?postId=${postId}`,
    })
  }, [])

  return (
    <View className="discover-page">
      {/* 导航栏 */}
      <View className="discover-page__nav safe-area-top">
        <View className="discover-page__nav-content">
          <Text className="discover-page__title">发现</Text>
        </View>
      </View>

      {/* 搜索栏 */}
      <SearchBar placeholder="搜索话题、内容..." onSearch={handleSearch} />

      {/* 内容区域 */}
      <ScrollView scrollY className="discover-page__content">
        {/* Tab 切换 */}
        <View className="discover-tabs">
          <View 
            className={`discover-tabs__item ${activeTab === 'hot' ? 'discover-tabs__item--active' : ''}`}
            onClick={() => setActiveTab('hot')}
          >
            <Text className="discover-tabs__text">热门</Text>
          </View>
          <View 
            className={`discover-tabs__item ${activeTab === 'follow' ? 'discover-tabs__item--active' : ''}`}
            onClick={() => setActiveTab('follow')}
          >
            <Text className="discover-tabs__text">关注</Text>
          </View>
          <View 
            className={`discover-tabs__item ${activeTab === 'nearby' ? 'discover-tabs__item--active' : ''}`}
            onClick={() => setActiveTab('nearby')}
          >
            <Text className="discover-tabs__text">附近</Text>
          </View>
          {activeTab && (
            <View 
              className="discover-tabs__indicator"
              style={{ 
                left: activeTab === 'hot' ? '12%' : activeTab === 'follow' ? '38%' : '64%',
              }}
            />
          )}
        </View>

        {/* 热门话题 */}
        <View className="discover-section">
          <View className="discover-section__header">
            <Text className="discover-section__title">🔥 热门话题</Text>
            <View className="discover-section__more">
              <Text className="discover-section__more-text">查看更多</Text>
            </View>
          </View>
          <ScrollView scrollX className="discover-topics">
            {mockTopics.map((topic) => (
              <View key={topic.id} className="discover-topics__item">
                <TopicTag
                  topic={topic}
                  size="medium"
                  onClick={() => handleTopicClick(topic.id)}
                />
                <Text className="discover-topics__count">{topic.posts} 动态</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 精选内容 */}
        <View className="discover-section">
          <View className="discover-section__header">
            <Text className="discover-section__title">⭐ 精选推荐</Text>
          </View>
          {mockFeaturedPosts.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              onComment={() => handlePostClick(post.id)}
              onUserClick={() => {}}
            />
          ))}
        </View>

        {/* 动态列表 */}
        <View className="discover-section">
          <View className="discover-section__header">
            <Text className="discover-section__title">📱 最新动态</Text>
          </View>
          {posts.slice(0, 3).map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              onComment={() => handlePostClick(post.id)}
              onUserClick={() => {}}
            />
          ))}
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Discover.config = {
  navigationStyle: 'custom',
} as any

Discover.displayName = 'Discover'

export default Discover
