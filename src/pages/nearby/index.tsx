import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import FeedCard from '../../components/FeedCard'
import EmptyState from '../../components/EmptyState'
import './index.css'

const Nearby = memo(() => {
  const { posts, toggleLike } = useAppStore()
  const [nearbyPosts, setNearbyPosts] = useState<typeof posts>([])

  useDidShow(() => {
    // 模拟获取附近动态
    setNearbyPosts(posts.filter((p) => p.location))
  })

  const handleComment = useCallback((postId: string) => {
    Taro.navigateTo({ url: `/pages/post-detail/index?postId=${postId}` })
  }, [])

  const handleLocate = useCallback(() => {
    Taro.getLocation({
      type: 'gcj02',
      success: (res) => {
        Taro.showToast({ title: `定位成功：${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)}`, icon: 'none' })
      },
      fail: () => {
        Taro.showToast({ title: '定位失败，请检查权限', icon: 'none' })
      },
    })
  }, [])

  return (
    <View className="nearby-page">
      <NavBar title="附近动态" showBack rightText="📍定位" onRightClick={handleLocate} />
      <ScrollView scrollY className="nearby-page__body">
        <View className="nearby-page__banner">
          <Text className="nearby-page__banner-title">📍 附近的人与动态</Text>
          <Text className="nearby-page__banner-desc">发现 3 公里内的新鲜事</Text>
        </View>
        {nearbyPosts.length === 0 ? (
          <EmptyState icon="📍" title="附近暂无动态" description="打开定位，看看周边的人在分享什么" actionText="开启定位" onAction={handleLocate} />
        ) : (
          nearbyPosts.map((p) => (
            <View key={p.id} className="nearby-page__item">
              <FeedCard post={p} onLike={toggleLike} onComment={handleComment} onShare={() => Taro.showToast({ title: '已分享', icon: 'success' })} />
            </View>
          ))
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Nearby.config = { navigationStyle: 'custom' } as any
Nearby.displayName = 'Nearby'
export default Nearby
