import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import SearchBar from '../../components/SearchBar'
import TopicTag from '../../components/TopicTag'
import FeedCard from '../../components/FeedCard'
import EmptyState from '../../components/EmptyState'
import { formatNumber } from '../../utils/formatTime'
import './index.css'

const categories = ['推荐', '前端', '设计', '科技', '生活', '美食', '旅行', '读书']

const featureEntries = [
  { icon: '🎪', label: '活动', url: '/pages/activities/index' },
  { icon: '🏆', label: '排行', url: '/pages/rankings/index' },
  { icon: '💰', label: '积分', url: '/pages/points/index' },
  { icon: '🛍', label: '商城', url: '/pages/mall/index' },
  { icon: '👑', label: '会员', url: '/pages/vip/index' },
  { icon: '📅', label: '签到', url: '/pages/checkin/index' },
  { icon: '🎡', label: '抽奖', url: '/pages/lottery/index' },
  { icon: '💳', label: '钱包', url: '/pages/wallet/index' },
  { icon: '🚀', label: '全部', url: '/pages/hub/index' },
]

// 5 大功能分组
const featureGroups = [
  { icon: '🏃', label: '健康生活', sub: '打卡·学习·美食·旅游', color: '#FF6B81' },
  { icon: '🐾', label: '垂直社区', sub: '宠物·车·房产·婚庆', color: '#7C4DFF' },
  { icon: '📚', label: '文化艺术', sub: '读书·音乐·摄影·艺术', color: '#00BCD4' },
  { icon: '⭐', label: '兴趣圈层', sub: '追星·健身·母婴·心理·美妆', color: '#FF9500' },
  { icon: '🌍', label: '公益·其他', sub: '公益·生活预测', color: '#4CAF50' },
]

const Discover = memo(() => {
  const [activeCat, setActiveCat] = useState('推荐')
  const { topics, posts } = useAppStore()

  const handleSearch = useCallback((v: string) => {
    if (v.trim()) Taro.navigateTo({ url: `/pages/search/index?keyword=${encodeURIComponent(v)}` })
  }, [])
  const handleTopicClick = useCallback((topicId: string) => Taro.navigateTo({ url: `/pages/topic/index?topicId=${topicId}` }), [])
  const handlePostClick = useCallback((postId: string) => Taro.navigateTo({ url: `/pages/post-detail/index?postId=${postId}` }), [])

  const hotTopics = [...topics].sort((a, b) => b.posts - a.posts).slice(0, 6)

  return (
    <View className="discover-page">
      <View className="discover-page__nav safe-area-top">
        <View className="discover-page__nav-content">
          <Text className="discover-page__title">发现</Text>
        </View>
      </View>

      <SearchBar placeholder="搜索话题、内容..." onSearch={handleSearch} />

      <ScrollView scrollY className="discover-page__content">
        {/* 功能入口 */}
        <View className="discover-section">
          <View className="discover-section__header">
            <Text className="discover-section__title">🧩 功能中心</Text>
          </View>
          <View className="discover-grid">
            {featureEntries.map((f) => (
              <View
                key={f.label}
                className="discover-grid__item"
                onClick={() => Taro.navigateTo({ url: f.url })}
              >
                <View className="discover-grid__icon"><Text>{f.icon}</Text></View>
                <Text className="discover-grid__label">{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 5 大功能分组 */}
        <View className="discover-section">
          <View className="discover-section__header">
            <Text className="discover-section__title">📦 全部功能（20 个新页面）</Text>
          </View>
          <View className="discover-groups">
            {featureGroups.map((g) => (
              <View
                key={g.label}
                className="discover-group-card"
                style={{ borderLeftColor: g.color }}
                onClick={() => Taro.navigateTo({ url: '/pages/hub/index' })}
              >
                <Text className="discover-group-card__icon">{g.icon}</Text>
                <View className="discover-group-card__body">
                  <Text className="discover-group-card__label">{g.label}</Text>
                  <Text className="discover-group-card__sub">{g.sub}</Text>
                </View>
                <Text className="discover-group-card__arrow">›</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 短视频大入口 */}
        <View className="discover-video-banner" onClick={() => Taro.navigateTo({ url: '/pages/short-video/index' })}>
          <View className="discover-video-banner__bg" />
          <Text className="discover-video-banner__icon">🎬</Text>
          <View className="discover-video-banner__text">
            <Text className="discover-video-banner__title">短视频</Text>
            <Text className="discover-video-banner__sub">刷不停，好看到停不下来</Text>
          </View>
          <View className="discover-video-banner__btn">
            <Text className="discover-video-banner__btn-text">进入观看</Text>
          </View>
        </View>

        {/* 分类 */}
        <View className="discover-cats">
          {categories.map((c) => (
            <View
              key={c}
              className={`discover-cat ${activeCat === c ? 'discover-cat--active' : ''}`}
              onClick={() => setActiveCat(c)}
            >
              <Text className="discover-cat__text">{c}</Text>
            </View>
          ))}
        </View>

        {/* 热门话题榜 */}
        <View className="discover-section">
          <View className="discover-section__header">
            <Text className="discover-section__title">🔥 热门话题榜</Text>
            <Text className="discover-section__more" onClick={() => Taro.navigateTo({ url: '/pages/search/index' })}>更多</Text>
          </View>
          {hotTopics.map((topic, i) => (
            <View key={topic.id} className="hot-topic" onClick={() => handleTopicClick(topic.id)}>
              <Text className={`hot-topic__rank hot-topic__rank--${i < 3 ? 'top' : 'normal'}`}>{i + 1}</Text>
              <View className="hot-topic__info">
                <Text className="hot-topic__name">#{topic.name}</Text>
                <Text className="hot-topic__count">{formatNumber(topic.posts)} 动态</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 全部话题 */}
        <View className="discover-section">
          <View className="discover-section__header">
            <Text className="discover-section__title">🏷 全部话题</Text>
          </View>
          <View className="discover-topics">
            {topics.map((topic) => (
              <View key={topic.id} className="discover-topics__item" onClick={() => handleTopicClick(topic.id)}>
                <TopicTag topic={topic} size="medium" />
              </View>
            ))}
          </View>
        </View>

        {/* 精选推荐 */}
        <View className="discover-section">
          <View className="discover-section__header">
            <Text className="discover-section__title">⭐ 精选推荐</Text>
          </View>
          {posts.slice(0, 3).map((post) => (
            <FeedCard key={post.id} post={post} onComment={() => handlePostClick(post.id)} onUserClick={() => {}} onTopicClick={handleTopicClick} />
          ))}
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Discover.config = { navigationStyle: 'custom' } as any
Discover.displayName = 'Discover'
export default Discover
