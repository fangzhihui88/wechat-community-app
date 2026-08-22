import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import FeedCard from '../../components/FeedCard'
import SearchBar from '../../components/SearchBar'
import EmptyState from '../../components/EmptyState'
import type { Post, FeedTab } from '../../types'
import './index.css'

const fetchMorePosts = async (page: number): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pool = [
        '今天天气真好，分享一张随手拍 📸 #生活',
        '刚学完 React 18 新特性，并发渲染真香！#React #前端',
        '周末去爬山，山顶风景绝美 ⛰️ #旅行',
        '推荐一本好书《代码整洁之道》#读书',
        '做了份番茄炒蛋，第一次下厨成功 🍳 #美食',
      ]
      const newPosts: Post[] = [{
        id: `post_new_${page}_${Date.now()}`,
        user: { id: `u_${page}`, nickname: `用户${page}`, avatar: `https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&q=80`, following: 0, followers: Math.floor(Math.random() * 1000) },
        content: pool[page % pool.length],
        type: 'text',
        images: page % 2 === 0 ? [`https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&q=80`] : undefined,
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 20),
        createdAt: new Date().toISOString(),
      }]
      resolve(newPosts)
    }, 800)
  })
}

const tabs: { key: FeedTab; label: string }[] = [
  { key: 'recommend', label: '推荐' },
  { key: 'follow', label: '关注' },
  { key: 'nearby', label: '附近' },
]

const Index = memo(() => {
  const {
    posts, appendPosts, hasMorePosts, setHasMorePosts, postsPage, setPostsPage,
    feedTab, setFeedTab, toggleLike, toggleBookmark, isRefreshing, setRefreshing,
  } = useAppStore()
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useDidShow(() => {})

  const handlePullDownRefresh = useCallback(async () => {
    setRefreshing(true)
    await new Promise((r) => setTimeout(r, 800))
    setPostsPage(1)
    setHasMorePosts(true)
    setRefreshing(false)
    Taro.stopPullDownRefresh()
    Taro.showToast({ title: ' refreshed', icon: 'success' })
  }, [])

  const handleScrollToLower = useCallback(async () => {
    if (isLoadingMore || !hasMorePosts) return
    setIsLoadingMore(true)
    const nextPage = postsPage + 1
    const newPosts = await fetchMorePosts(nextPage)
    if (newPosts.length === 0) setHasMorePosts(false)
    else { appendPosts(newPosts); setPostsPage(nextPage) }
    setIsLoadingMore(false)
  }, [isLoadingMore, hasMorePosts, postsPage])

  const handleLike = useCallback((postId: string) => toggleLike(postId), [toggleLike])
  const handleComment = useCallback((postId: string) => Taro.navigateTo({ url: `/pages/post-detail/index?postId=${postId}` }), [])
  const handleShare = useCallback(() => Taro.showShareMenu({ withShareTicket: true }), [])
  const handleUserClick = useCallback((userId: string) => Taro.navigateTo({ url: `/pages/user-detail/index?userId=${userId}` }), [])
  const handleTopicClick = useCallback((topicId: string) => Taro.navigateTo({ url: `/pages/topic/index?topicId=${topicId}` }), [])
  const handleSearch = useCallback((v: string) => { if (v.trim()) Taro.navigateTo({ url: `/pages/search/index?keyword=${encodeURIComponent(v)}` }) }, [])
  const handleBookmark = useCallback((postId: string) => { toggleBookmark(postId); Taro.showToast({ title: '已收藏', icon: 'none' }) }, [toggleBookmark])

  // 根据 feedTab 过滤
  const visiblePosts = feedTab === 'follow'
    ? posts.filter((p) => p.user.isVip)
    : feedTab === 'nearby'
      ? posts.filter((p) => p.location)
      : posts

  return (
    <View className="index-page">
      <View className="index-page__nav safe-area-top">
        <View className="index-page__nav-content">
          <Text className="index-page__title">社区</Text>
        </View>
      </View>

      <SearchBar placeholder="搜索动态、用户、话题..." onSearch={handleSearch} />

      <View className="index-tabs">
        {tabs.map((t) => (
          <View
            key={t.key}
            className={`index-tabs__item ${feedTab === t.key ? 'index-tabs__item--active' : ''}`}
            onClick={() => setFeedTab(t.key)}
          >
            <Text className="index-tabs__text">{t.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView
        scrollY
        className="index-page__list"
        lowerThreshold={100}
        onScrollToLower={handleScrollToLower}
        enableBackToTop
      >
        {visiblePosts.length > 0 ? (
          <>
            {visiblePosts.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onUserClick={handleUserClick}
                onTopicClick={handleTopicClick}
              />
            ))}
            {isLoadingMore && <View className="index-page__loading"><Text>加载中...</Text></View>}
            {!hasMorePosts && <View className="index-page__no-more"><Text>没有更多了</Text></View>}
          </>
        ) : (
          <EmptyState icon="📝" title="暂无动态" description="快去发布第一条动态吧！" actionText="发布动态" onAction={() => Taro.switchTab({ url: '/pages/publish/index' })} />
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Index.config = { navigationStyle: 'custom', enablePullDownRefresh: true, backgroundColor: '#F7F7F7' } as any
Index.displayName = 'Index'
export default Index
