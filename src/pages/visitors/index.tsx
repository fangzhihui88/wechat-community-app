import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import UserAvatar from '../../components/UserAvatar'
import { formatRelativeTime } from '../../utils/formatTime'
import EmptyState from '../../components/EmptyState'
import './index.css'

const Visitors = memo(() => {
  const { visitors } = useAppStore()

  const handleUser = useCallback((userId: string) => {
    Taro.navigateTo({ url: `/pages/user-detail/index?id=${userId}` })
  }, [])

  return (
    <View className="visitors-page">
      <NavBar title="访客记录" showBack />
      <ScrollView scrollY className="visitors-page__body">
        {visitors.length === 0 ? (
          <EmptyState icon="👀" title="暂无访客" description="有人看过你的主页就会显示在这里" />
        ) : (
          <View className="visitors-page__list">
            {visitors.map((v) => (
              <View key={v.id} className="visitors-page__item" onClick={() => handleUser(v.user.id)}>
                <UserAvatar user={v.user} size="medium" showVipBadge />
                <View className="visitors-page__info">
                  <Text className="visitors-page__name">{v.user.nickname}</Text>
                  <Text className="visitors-page__time">来访于 {formatRelativeTime(v.visitedAt)}</Text>
                </View>
                <Text className="visitors-page__arrow">›</Text>
              </View>
            ))}
          </View>
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Visitors.config = { navigationStyle: 'custom' } as any
Visitors.displayName = 'Visitors'
export default Visitors
