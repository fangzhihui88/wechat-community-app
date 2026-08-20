import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import EmptyState from '../../components/EmptyState'
import type { Notification } from '../../types'
import { formatRelativeTime } from '../../utils/formatTime'
import './index.css'

const Message = memo(() => {
  const [activeTab, setActiveTab] = useState<'all' | 'like' | 'comment' | 'follow'>('all')
  const { notifications, unreadCount, markAsRead } = useAppStore()

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like': return '❤️'
      case 'comment': return '💬'
      case 'follow': return '➕'
      case 'mention': return '@'
      case 'system': return '🔔'
      default: return '📌'
    }
  }

  const getNotificationText = (notification: Notification) => {
    if (notification.user) {
      return `${notification.user.nickname} ${notification.content}`
    }
    return notification.content
  }

  const handleNotificationClick = useCallback((notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }

    if (notification.type === 'follow' && notification.user) {
      Taro.navigateTo({
        url: `/pages/profile-detail/index?userId=${notification.user.id}`,
      })
    } else if (notification.post) {
      Taro.navigateTo({
        url: `/pages/post-detail/index?postId=${notification.post.id}`,
      })
    }
  }, [markAsRead])

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'all') return true
    if (activeTab === 'like') return notif.type === 'like'
    if (activeTab === 'comment') return notif.type === 'comment'
    if (activeTab === 'follow') return notif.type === 'follow'
    return true
  })

  const handleClearAll = useCallback(() => {
    Taro.showModal({
      title: '提示',
      content: '确定清空所有消息吗？',
      success: (res) => {
        if (res.confirm) {
          // 清空消息
          Taro.showToast({ title: '已清空', icon: 'success' })
        }
      },
    })
  }, [])

  return (
    <View className="message-page">
      {/* 导航栏 */}
      <View className="message-page__nav safe-area-top">
        <View className="message-page__nav-content">
          <Text className="message-page__title">消息</Text>
          {unreadCount > 0 && (
            <View className="message-page__badge">
              <Text className="message-page__badge-text">{unreadCount > 99 ? '99+' : unreadCount}</Text>
            </View>
          )}
          <View className="message-page__clear" onClick={handleClearAll}>
            <Text className="message-page__clear-text">清空</Text>
          </View>
        </View>
      </View>

      {/* Tab 切换 */}
      <View className="message-tabs">
        <View 
          className={`message-tabs__item ${activeTab === 'all' ? 'message-tabs__item--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Text className="message-tabs__text">全部</Text>
        </View>
        <View 
          className={`message-tabs__item ${activeTab === 'like' ? 'message-tabs__item--active' : ''}`}
          onClick={() => setActiveTab('like')}
        >
          <Text className="message-tabs__text">赞</Text>
        </View>
        <View 
          className={`message-tabs__item ${activeTab === 'comment' ? 'message-tabs__item--active' : ''}`}
          onClick={() => setActiveTab('comment')}
        >
          <Text className="message-tabs__text">评论</Text>
        </View>
        <View 
          className={`message-tabs__item ${activeTab === 'follow' ? 'message-tabs__item--active' : ''}`}
          onClick={() => setActiveTab('follow')}
        >
          <Text className="message-tabs__text">关注</Text>
        </View>
      </View>

      {/* 消息列表 */}
      <ScrollView scrollY className="message-page__list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <View
              key={notification.id}
              className={`message-item ${!notification.isRead ? 'message-item--unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <View className="message-item__avatar">
                <Text className="message-item__icon">{getNotificationIcon(notification.type)}</Text>
              </View>
              <View className="message-item__content">
                <Text className="message-item__text">{getNotificationText(notification)}</Text>
                <Text className="message-item__time">
                  {formatRelativeTime(notification.createdAt)}
                </Text>
              </View>
              {!notification.isRead && <View className="message-item__dot" />}
            </View>
          ))
        ) : (
          <EmptyState
            icon="💌"
            title="暂无消息"
            description="你还没有收到任何消息通知"
          />
        )}
      </ScrollView>
    </View>
  )
})

Message.config = {
  navigationStyle: 'custom',
} as any

Message.displayName = 'Message'

export default Message
