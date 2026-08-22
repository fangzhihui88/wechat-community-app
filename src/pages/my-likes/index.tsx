import { View, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import FeedCard from '../../components/FeedCard'
import EmptyState from '../../components/EmptyState'
import './index.css'

const MyLikes = memo(() => {
  const { likedPosts, posts, toggleLike } = useAppStore()
  const liked = posts.filter((p) => likedPosts.includes(p.id))

  const handleComment = useCallback((postId: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?postId=${postId}` })
  }, [])

  return (
    <View className="mylikes-page">
      <NavBar title="我赞过的" showBack />
      <ScrollView scrollY className="mylikes-page__body">
        {liked.length === 0 ? (
          <EmptyState icon="❤️" title="还没有赞过动态" description="去给喜欢的内容点个赞吧" />
        ) : (
          liked.map((p) => (
            <View key={p.id} className="mylikes-page__item">
              <FeedCard post={p} onLike={toggleLike} onComment={handleComment} onShare={() => Taro.showToast({ title: '已分享', icon: 'success' })} />
            </View>
          ))
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

MyLikes.config = { navigationStyle: 'custom' } as any
MyLikes.displayName = 'MyLikes'
export default MyLikes
