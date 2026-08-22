import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback, useMemo } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import SearchBar from '../../components/SearchBar'
import FeedCard from '../../components/FeedCard'
import UserAvatar from '../../components/UserAvatar'
import TopicTag from '../../components/TopicTag'
import EmptyState from '../../components/EmptyState'
import { formatNumber } from '../../utils/formatTime'
import type { User, Topic } from '../../types'
import './index.css'

type SearchTab = 'all' | 'user' | 'topic'

// 本地 mock 用户数据
const MOCK_USERS: User[] = [
  {
    id: 'user_mock_1',
    nickname: '小森林',
    avatar: 'https://picsum.photos/seed/forest/200',
    following: 120,
    followers: 3245,
    posts: 86,
  },
  {
    id: 'user_mock_2',
    nickname: '城市漫游者',
    avatar: 'https://picsum.photos/seed/city/200',
    following: 89,
    followers: 12500,
    posts: 210,
  },
  {
    id: 'user_mock_3',
    nickname: '美食研究所',
    avatar: 'https://picsum.photos/seed/food/200',
    following: 230,
    followers: 45800,
    posts: 540,
  },
  {
    id: 'user_mock_4',
    nickname: '深夜电台',
    avatar: 'https://picsum.photos/seed/radio/200',
    following: 45,
    followers: 8900,
    posts: 73,
  },
  {
    id: 'user_mock_5',
    nickname: '山野之间',
    avatar: 'https://picsum.photos/seed/mountain/200',
    following: 67,
    followers: 2310,
    posts: 134,
  },
]

const TABS: { key: SearchTab; label: string }[] = [
  { key: 'all', label: '综合' },
  { key: 'user', label: '用户' },
  { key: 'topic', label: '话题' },
]

const Search = memo(() => {
  const { posts, topics } = useAppStore()

  const [keyword, setKeyword] = useState('')
  const [activeTab, setActiveTab] = useState<SearchTab>('all')
  const [results, setResults] = useState<{
    posts: typeof posts
    users: User[]
    topics: Topic[]
  }>({ posts: [], users: [], topics: [] })

  // 执行搜索：根据关键词与当前 Tab 过滤数据
  const runSearch = useCallback(
    (value: string) => {
      const kw = value.trim().toLowerCase()
      if (!kw) {
        setResults({ posts: [], users: [], topics: [] })
        return
      }
      const matchedPosts = posts.filter((p) =>
        p.content.toLowerCase().includes(kw)
      )
      const matchedUsers = MOCK_USERS.filter((u) =>
        u.nickname.toLowerCase().includes(kw)
      )
      const matchedTopics = topics.filter((t) =>
        t.name.toLowerCase().includes(kw)
      )
      setResults({
        posts: matchedPosts,
        users: matchedUsers,
        topics: matchedTopics,
      })
    },
    [posts, topics]
  )

  const handleSearch = useCallback(
    (value: string) => {
      setKeyword(value)
      runSearch(value)
    },
    [runSearch]
  )

  // 切换 Tab 时，若已有结果则重新计算（保持关键词不变）
  const handleTabChange = useCallback(
    (tab: SearchTab) => {
      setActiveTab(tab)
      if (keyword.trim()) {
        runSearch(keyword)
      }
    },
    [keyword, runSearch]
  )

  // 关注按钮点击
  const handleFollow = useCallback((user: User) => {
    Taro.showToast({
      title: `已关注 ${user.nickname}`,
      icon: 'none',
    })
  }, [])

  // 当前 Tab 是否无结果
  const hasResult = useMemo(() => {
    if (!keyword.trim()) return true // 空关键词不算无结果（综合展示热门话题）
    if (activeTab === 'all') return results.posts.length > 0
    if (activeTab === 'user') return results.users.length > 0
    return results.topics.length > 0
  }, [keyword, activeTab, results])

  return (
    <View className="search-page">
      <NavBar title="搜索" showBack />

      <View className="search-page__header">
        <SearchBar
          placeholder="搜索动态、用户或话题"
          autoFocus={false}
          onSearch={handleSearch}
        />
      </View>

      <View className="search-page__tabs">
        {TABS.map((tab) => (
          <View
            key={tab.key}
            className={`search-page__tab ${
              activeTab === tab.key ? 'search-page__tab--active' : ''
            }`}
            onClick={() => handleTabChange(tab.key)}
          >
            <Text className="search-page__tab-text">{tab.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY className="search-page__body">
        {!keyword.trim() ? (
          // 空关键词：综合展示热门话题
          <View className="search-page__hot">
            <Text className="search-page__section-title">🔥 热门话题</Text>
            <View className="search-page__topic-list">
              {topics.map((topic) => (
                <View key={topic.id} className="search-page__topic-item">
                  <TopicTag topic={topic} size="medium" />
                  <Text className="search-page__topic-count">
                    {formatNumber(topic.posts)} 讨论
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : !hasResult ? (
          <EmptyState
            icon="🔍"
            title="没有找到相关内容"
            description={`换一个关键词试试吧「${keyword}」`}
          />
        ) : (
          <>
            {activeTab === 'all' && (
              <View className="search-page__posts">
                {results.posts.map((post) => (
                  <FeedCard key={post.id} post={post} />
                ))}
              </View>
            )}

            {activeTab === 'user' && (
              <View className="search-page__users">
                {results.users.map((user) => (
                  <View key={user.id} className="search-page__user-row">
                    <UserAvatar user={user} size="medium" showName={false} />
                    <View className="search-page__user-info">
                      <Text className="search-page__user-name">
                        {user.nickname}
                      </Text>
                      <Text className="search-page__user-meta">
                        {formatNumber(user.followers)} 粉丝
                      </Text>
                    </View>
                    <View
                      className="search-page__follow-btn"
                      onClick={() => handleFollow(user)}
                    >
                      <Text className="search-page__follow-text">关注</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'topic' && (
              <View className="search-page__topic-list">
                {results.topics.map((topic) => (
                  <View key={topic.id} className="search-page__topic-item">
                    <TopicTag topic={topic} size="medium" />
                    <Text className="search-page__topic-count">
                      {formatNumber(topic.posts)} 讨论
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  )
})

export default Search

Search.config = {
  navigationStyle: 'custom',
} as any
