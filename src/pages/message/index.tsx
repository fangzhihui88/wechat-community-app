import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import EmptyState from '../../components/EmptyState'
import { formatRelativeTime } from '../../utils/formatTime'
import type { NotificationType } from '../../types'
import './index.css'

const tabs: { key: NotificationType | 'chat'; label: string }[] = [
  { key: 'like', label: '互动' },
  { key: 'follow', label: '关注' },
  { key: 'system', label: '系统' },
  { key: 'chat', label: '私信' },
]

const typeIcon: Record<string, string> = {
  like: '❤️', comment: '💬', follow: '➕', system: '📢', mention: '📣',
}

const Message = memo(() => {
  const [activeTab, setActiveTab] = useState<NotificationType | 'chat'>('like')
  const { notifications, conversations, markAsRead, markAllRead, markConversationRead } = useAppStore()

  const handleTabChange = useCallback((tab: NotificationType | 'chat') => {
    setActiveTab(tab)
    if (tab !== 'chat') markAllRead()
  }, [markAllRead])

  const handleNotifClick = useCallback((id: string) => {
    markAsRead(id)
  }, [markAsRead])

  const handleChatClick = useCallback((convId: string) => {
    markConversationRead(convId)
    Taro.navigateTo({ url: `/pages/chat/index?convId=${convId}` })
  }, [markConversationRead])

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'like') return n.type === 'like' || n.type === 'comment' || n.type === 'mention'
    if (activeTab === 'follow') return n.type === 'follow'
    if (activeTab === 'system') return n.type === 'system'
    return false
  })

  return (
    <View className="message-page">
      <View className="message-page__nav safe-area-top">
        <View className="message-page__nav-content">
          <Text className="message-page__title">消息</Text>
        </View>
      </View>

      <View className="message-tabs">
        {tabs.map((t) => (
          <View
            key={t.key}
            className={`message-tabs__item ${activeTab === t.key ? 'message-tabs__item--active' : ''}`}
            onClick={() => handleTabChange(t.key)}
          >
            <Text className="message-tabs__text">{t.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY className="message-page__list">
        {activeTab === 'chat' ? (
          conversations.length > 0 ? conversations.map((conv) => (
            <View key={conv.id} className="message-item" onClick={() => handleChatClick(conv.id)}>
              <Image className="message-item__avatar" src={conv.user.avatar} />
              {conv.unread > 0 && <View className="message-item__badge"><Text className="message-item__badge-text">{conv.unread}</Text></View>}
              <View className="message-item__body">
                <Text className="message-item__name">{conv.user.nickname}</Text>
                <Text className="message-item__preview">{conv.lastMessage}</Text>
              </View>
              <Text className="message-item__time">{formatRelativeTime(conv.lastTime)}</Text>
            </View>
          )) : <EmptyState icon="💬" title="还没有私信" description="去关注的人主页发消息吧" />
        ) : (
          filteredNotifs.length > 0 ? filteredNotifs.map((n) => (
            <View key={n.id} className={`message-item ${n.isRead ? '' : 'message-item--unread'}`} onClick={() => handleNotifClick(n.id)}>
              {n.user && <Image className="message-item__avatar" src={n.user.avatar} />}
              {!n.user && <View className="message-item__system-icon">{typeIcon[n.type]}</View>}
              <View className="message-item__body">
                <Text className="message-item__name">
                  {n.user ? n.user.nickname : '系统通知'}
                </Text>
                <Text className="message-item__preview">{typeIcon[n.type]} {n.content}</Text>
              </View>
              <Text className="message-item__time">{formatRelativeTime(n.createdAt)}</Text>
            </View>
          )) : <EmptyState icon="🔔" title="暂无消息" description="你收到的互动提醒会显示在这里" />
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Message.config = { navigationStyle: 'custom' } as any
Message.displayName = 'Message'
export default Message
