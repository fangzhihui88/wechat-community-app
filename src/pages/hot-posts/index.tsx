import { View, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import FeedCard from '../../components/FeedCard'
import EmptyState from '../../components/EmptyState'
import './index.css'

const HotPosts = memo(() => {
  const { posts, toggleLike } = useAppStore()
  const hot = posts.filter((p) => p.isHot).length > 0 ? posts.filter((p) => p.isHot) : posts.slice(0, 3)

  const handleComment = useCallback((postId: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?id=${postId}` })
  }, [])

  return (
    <View className="hotposts-page">
      <NavBar title="热门动态" showBack />
      <ScrollView scrollY className="hotposts-page__body">
        {hot.length === 0 ? (
          <EmptyState icon="🔥" title="暂无热门内容" description="快去发布你的第一条动态吧" />
        ) : (
          hot.map((p, i) => (
            <View key={p.id} className="hotposts-page__item">
              <View className="hotposts-page__rank">
                <Text className="hotposts-page__rank-text">TOP {i + 1}</Text>
              </View>
              <FeedCard
                post={p}
                onLike={toggleLike}
                onComment={handleComment}
                onShare={() => Taro.showToast({ title: '已分享', icon: 'success' })}
               
              />
            </View>
          ))
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

HotPosts.config = { navigationStyle: 'custom' } as any
HotPosts.displayName = 'HotPosts'
export default HotPosts
