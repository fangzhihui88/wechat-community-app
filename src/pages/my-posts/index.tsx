import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import FeedCard from '../../components/FeedCard'
import EmptyState from '../../components/EmptyState'
import './index.css'

const MyPosts = memo(() => {
  const { myPosts, toggleLike, toggleBookmark, removePost } = useAppStore()

  const handleComment = useCallback((postId: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?postId=${postId}` })
  }, [])

  const handleDelete = useCallback((postId: string) => {
    Taro.showModal({
      title: '删除动态',
      content: '确定要删除这条动态吗？',
      success: (res) => {
        if (res.confirm) {
          removePost(postId)
          Taro.showToast({ title: '已删除', icon: 'success' })
        }
      },
    })
  }, [removePost])

  return (
    <View className="myposts-page">
      <NavBar title="我的动态" showBack rightText="发布" onRightClick={() => Taro.switchTab({ url: '/pages/publish/index' })} />
      <ScrollView scrollY className="myposts-page__body">
        {myPosts.length === 0 ? (
          <EmptyState icon="📝" title="还没有发布动态" description="分享你的第一刻吧" actionText="去发布" onAction={() => Taro.switchTab({ url: '/pages/publish/index' })} />
        ) : (
          myPosts.map((p) => (
            <View key={p.id} className="myposts-page__item">
              <FeedCard post={p} onLike={toggleLike} onComment={handleComment} onShare={() => Taro.showToast({ title: '已分享', icon: 'success' })} />
              <View className="myposts-page__item-actions">
                <View className="myposts-page__item-btn" onClick={() => handleDelete(p.id)}>
                  <Text className="myposts-page__item-btn-text">删除</Text>
                </View>
              </View>
            </View>
          ))
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

MyPosts.config = { navigationStyle: 'custom' } as any
MyPosts.displayName = 'MyPosts'
export default MyPosts
