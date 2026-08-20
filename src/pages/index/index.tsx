import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import FeedCard from '../../components/FeedCard'
import SearchBar from '../../components/SearchBar'
import EmptyState from '../../components/EmptyState'
import type { Post } from '../../types'
import './index.css'

// 模拟获取更多动态
const fetchMorePosts = async (page: number): Promise<Post[]> => {
  // 实际项目中替换为 API 调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPosts: Post[] = [
        {
          id: `post_new_${page}_1`,
          user: {
            id: 'user_new_1',
            nickname: '新用户',
            avatar: 'https://picsum.photos/210',
            followers: 100,
          },
          content: `这是第 ${page} 页的新动态内容，欢迎大家来互动交流！${page > 1 ? '🎉' : '👋'}`,
          images: page % 2 === 0 ? ['https://picsum.photos/410/300'] : undefined,
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
          createdAt: new Date().toISOString(),
        },
      ]
      resolve(newPosts)
    }, 1000)
  })
}

const Index = memo(() => {
  const { 
    posts, 
    setPosts, 
    appendPosts, 
    hasMorePosts, 
    setHasMorePosts, 
    postsPage, 
    setPostsPage,
    isRefreshing,
    setRefreshing,
  } = useAppStore()
  
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // 页面加载时获取数据
  useDidShow(() => {
    // 可以在这里初始化数据
  })

  // 下拉刷新
  const handlePullDownRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      // 实际项目中替换为 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setPostsPage(1)
      setHasMorePosts(true)
      // 重新加载第一页数据
      Taro.showToast({ title: '刷新成功', icon: 'success' })
    } finally {
      setRefreshing(false)
      Taro.stopPullDownRefresh()
    }
  }, [setPosts, setPostsPage, setHasMorePosts, setRefreshing])

  // 上拉加载更多
  const handleScrollToLower = useCallback(async () => {
    if (isLoadingMore || !hasMorePosts) return
    
    setIsLoadingMore(true)
    try {
      const nextPage = postsPage + 1
      const newPosts = await fetchMorePosts(nextPage)
      
      if (newPosts.length === 0) {
        setHasMorePosts(false)
      } else {
        appendPosts(newPosts)
        setPostsPage(nextPage)
      }
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMorePosts, postsPage, appendPosts, setPostsPage, setHasMorePosts])

  // 处理点赞
  const handleLike = useCallback((postId: string) => {
    // 实际项目中调用 API
    console.log('点赞:', postId)
  }, [])

  // 处理评论
  const handleComment = useCallback((postId: string) => {
    Taro.navigateTo({
      url: `/pages/comment/index?postId=${postId}`,
    })
  }, [])

  // 处理分享
  const handleShare = useCallback((postId: string) => {
    Taro.showShareMenu({
      withShareTicket: true,
    })
  }, [])

  // 处理用户点击
  const handleUserClick = useCallback((userId: string) => {
    Taro.navigateTo({
      url: `/pages/profile-detail/index?userId=${userId}`,
    })
  }, [])

  // 处理话题点击
  const handleTopicClick = useCallback((topicId: string) => {
    Taro.navigateTo({
      url: `/pages/topic/index?topicId=${topicId}`,
    })
  }, [])

  // 处理搜索
  const handleSearch = useCallback((value: string) => {
    if (value.trim()) {
      Taro.navigateTo({
        url: `/pages/search/index?keyword=${encodeURIComponent(value)}`,
      })
    }
  }, [])

  return (
    <View className="index-page">
      {/* 自定义导航栏 */}
      <View className="index-page__nav safe-area-top">
        <View className="index-page__nav-content">
          <Text className="index-page__title">社区</Text>
        </View>
      </View>

      {/* 搜索栏 */}
      <SearchBar 
        placeholder="搜索动态、用户、话题..."
        onSearch={handleSearch}
      />

      {/* 动态列表 */}
      <ScrollView
        scrollY
        className="index-page__list"
        lowerThreshold={100}
        upperThreshold={100}
        onScrollToLower={handleScrollToLower}
        enableBackToTop
      >
        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
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
            
            {/* 加载状态 */}
            {isLoadingMore && (
              <View className="index-page__loading">
                <Text className="index-page__loading-text">加载中...</Text>
              </View>
            )}
            
            {!hasMorePosts && (
              <View className="index-page__no-more">
                <Text className="index-page__no-more-text">没有更多了</Text>
              </View>
            )}
          </>
        ) : (
          <EmptyState
            icon="📝"
            title="暂无动态"
            description="快去发布第一条动态吧！"
            actionText="发布动态"
            onAction={() => Taro.switchTab({ url: '/pages/publish/index' })}
          />
        )}
      </ScrollView>
    </View>
  )
})

Index.config = {
  navigationStyle: 'custom',
  enablePullDownRefresh: true,
  backgroundColor: '#F7F7F7',
} as any

Index.displayName = 'Index'

export default Index
