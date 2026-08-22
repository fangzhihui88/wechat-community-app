import { View, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import FeedCard from '../../components/FeedCard'
import EmptyState from '../../components/EmptyState'
import './index.css'

const MyBookmarks = memo(() => {
  const { bookmarks, toggleLike } = useAppStore()

  const handleComment = useCallback((postId: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?postId=${postId}` })
  }, [])

  return (
    <View className="mybookmarks-page">
      <NavBar title="我的收藏" showBack />
      <ScrollView scrollY className="mybookmarks-page__body">
        {bookmarks.length === 0 ? (
          <EmptyState icon="⭐" title="还没有收藏" description="收藏的内容会出现在这里" />
        ) : (
          bookmarks.map((p) => (
            <View key={p.id} className="mybookmarks-page__item">
              <FeedCard post={p} onLike={toggleLike} onComment={handleComment} onShare={() => Taro.showToast({ title: '已分享', icon: 'success' })} />
            </View>
          ))
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

MyBookmarks.config = { navigationStyle: 'custom' } as any
MyBookmarks.displayName = 'MyBookmarks'
export default MyBookmarks
