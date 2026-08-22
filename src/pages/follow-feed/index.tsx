import { View, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import FeedCard from '../../components/FeedCard'
import EmptyState from '../../components/EmptyState'
import './index.css'

const FollowFeed = memo(() => {
  const { posts, followingList, toggleLike } = useAppStore()
  const followingIds = followingList.map((u) => u.id)
  const followPosts = posts.filter((p) => followingIds.includes(p.user.id))

  const handleComment = useCallback((postId: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?postId=${postId}` })
  }, [])

  return (
    <View className="followfeed-page">
      <NavBar title="关注动态" showBack />
      <ScrollView scrollY className="followfeed-page__body">
        {followPosts.length === 0 ? (
          <EmptyState icon="👥" title="还没有关注动态" description="关注感兴趣的人，他们的动态会出现在这里" actionText="去发现" onAction={() => Taro.switchTab({ url: '/pages/discover/index' })} />
        ) : (
          followPosts.map((p) => (
            <View key={p.id} className="followfeed-page__item">
              <FeedCard post={p} onLike={toggleLike} onComment={handleComment} onShare={() => Taro.showToast({ title: '已分享', icon: 'success' })} />
            </View>
          ))
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

FollowFeed.config = { navigationStyle: 'custom' } as any
FollowFeed.displayName = 'FollowFeed'
export default FollowFeed
