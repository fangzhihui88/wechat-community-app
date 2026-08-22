import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import UserAvatar from '../../components/UserAvatar'
import { formatRelativeTime } from '../../utils/formatTime'
import EmptyState from '../../components/EmptyState'
import './index.css'

const typeIcons: Record<string, string> = {
  like: '❤️', comment: '💬', follow: '👋', system: '📢', mention: '@',
}

const Notifications = memo(() => {
  const { notifications, markAsRead, markAllRead } = useAppStore()
  const unread = notifications.filter((n) => !n.isRead).length

  const handleItem = useCallback((n: any) => {
    if (!n.isRead) markAsRead(n.id)
    if (n.post) {
      Taro.navigateTo({ url: `/pages/post-detail/index?id=${n.post.id}` })
    }
  }, [markAsRead])

  return (
    <View className="notif-page">
      <NavBar title="通知中心" showBack rightText={unread > 0 ? '全部已读' : ''} onRightClick={markAllRead} />
      <ScrollView scrollY className="notif-page__body">
        {notifications.length === 0 ? (
          <EmptyState icon="🔔" title="暂无通知" description="互动通知会显示在这里" />
        ) : (
          <View className="notif-page__list">
            {notifications.map((n) => (
              <View key={n.id} className={`notif-page__item ${n.isRead ? '' : 'notif-page__item--unread'}`} onClick={() => handleItem(n)}>
                <View className="notif-page__icon">
                  <Text className="notif-page__icon-text">{typeIcons[n.type] || '📣'}</Text>
                  {!n.isRead && <View className="notif-page__dot" />}
                </View>
                <View className="notif-page__info">
                  <View className="notif-page__top">
                    {n.user && <UserAvatar user={n.user} size="small" />}
                    <Text className="notif-page__content">{n.user ? `${n.user.nickname} ${n.content}` : n.content}</Text>
                  </View>
                  {n.post && (
                    <Text className="notif-page__post-preview">{n.post.content}</Text>
                  )}
                  <Text className="notif-page__time">{formatRelativeTime(n.createdAt)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Notifications.config = { navigationStyle: 'custom' } as any
Notifications.displayName = 'Notifications'
export default Notifications
