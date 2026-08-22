import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import EmptyState from '../../components/EmptyState'
import { formatRelativeTime } from '../../utils/formatTime'
import type { NotificationType } from '../../types'
import './index.css'

type TabKey = NotificationType | 'chat' | 'friend'

const tabs: { key: TabKey; label: string; badge?: number }[] = [
  { key: 'like', label: '互动' },
  { key: 'follow', label: '关注' },
  { key: 'friend', label: '好友' },
  { key: 'chat', label: '私信' },
  { key: 'system', label: '系统' },
]

const typeIcon: Record<string, string> = {
  like: '❤️', comment: '💬', follow: '👋', system: '📢', mention: '📣',
  accepted: '✅', rejected: '❌', pending: '⏳',
}

const Message = memo(() => {
  const [activeTab, setActiveTab] = useState<TabKey>('like')
  const {
    notifications, conversations, friendRequests, unreadFriendReqCount,
    markAsRead, markAllRead, markConversationRead, acceptFriendRequest, rejectFriendRequest,
  } = useAppStore()

  const totalUnread = notifications.filter(n => !n.isRead).length
    + conversations.reduce((a, c) => a + c.unread, 0)
    + unreadFriendReqCount

  const handleTabChange = useCallback((tab: TabKey) => {
    setActiveTab(tab)
    if (tab !== 'chat' && tab !== 'friend') markAllRead()
  }, [markAllRead])

  const handleNotifClick = useCallback((id: string) => {
    markAsRead(id)
  }, [markAsRead])

  const handleChatClick = useCallback((convId: string) => {
    markConversationRead(convId)
    Taro.navigateTo({ url: `/pages/chat/index?convId=${convId}` })
  }, [markConversationRead])

  const handleFriendReqAccept = useCallback((id: string) => {
    acceptFriendRequest(id)
    Taro.showToast({ title: '已添加好友', icon: 'success' })
  }, [acceptFriendRequest])

  const handleFriendReqReject = useCallback((id: string) => {
    rejectFriendRequest(id)
    Taro.showToast({ title: '已拒绝', icon: 'none' })
  }, [rejectFriendRequest])

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'like') return n.type === 'like' || n.type === 'comment' || n.type === 'mention'
    if (activeTab === 'follow') return n.type === 'follow'
    if (activeTab === 'system') return n.type === 'system'
    return false
  })

  const pendingRequests = friendRequests.filter(r => r.status === 'pending')
  const processedRequests = friendRequests.filter(r => r.status !== 'pending')

  return (
    <View className="message-page">
      <NavBar
        title={totalUnread > 0 ? `消息 (${totalUnread})` : '消息'}
        showBack={false}
      />

      <View className="message-tabs">
        {tabs.map((t) => (
          <View
            key={t.key}
            className={`message-tabs__item ${activeTab === t.key ? 'message-tabs__item--active' : ''}`}
            onClick={() => handleTabChange(t.key)}
          >
            <Text className="message-tabs__text">{t.label}</Text>
            {t.key === 'friend' && unreadFriendReqCount > 0 && (
              <View className="message-tabs__dot">
                <Text className="message-tabs__dot-text">{unreadFriendReqCount}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <ScrollView scrollY className="message-page__list">
        {/* ===== 互动 / 关注 / 系统通知 ===== */}
        {activeTab !== 'chat' && activeTab !== 'friend' && (
          filteredNotifs.length > 0 ? filteredNotifs.map((n) => (
            <View
              key={n.id}
              className={`message-item ${n.isRead ? '' : 'message-item--unread'}`}
              onClick={() => handleNotifClick(n.id)}
            >
              {n.user && <Image className="message-item__avatar" src={n.user.avatar} />}
              {!n.user && <View className="message-item__system-icon">{typeIcon[n.type]}</View>}
              {n.isRead === false && <View className="message-item__red-dot" />}
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

        {/* ===== 私信 ===== */}
        {activeTab === 'chat' && (
          conversations.length > 0 ? conversations.map((conv) => (
            <View
              key={conv.id}
              className="message-item"
              onClick={() => handleChatClick(conv.id)}
            >
              <View className="message-item__avatar-wrap">
                <Image className="message-item__avatar" src={conv.user.avatar} />
                {conv.unread > 0 && <View className="message-item__badge">
                  <Text className="message-item__badge-text">{conv.unread > 99 ? '99+' : conv.unread}</Text>
                </View>}
              </View>
              <View className="message-item__body">
                <Text className="message-item__name">{conv.user.nickname}</Text>
                <Text className="message-item__preview">{conv.lastMessage}</Text>
              </View>
              <Text className="message-item__time">{formatRelativeTime(conv.lastTime)}</Text>
            </View>
          )) : <EmptyState icon="💬" title="暂无私信" description="去关注的人主页发消息吧" />
        )}

        {/* ===== 好友申请 ===== */}
        {activeTab === 'friend' && (
          <View className="friend-section">
            {/* 好友申请入口卡片 */}
            <View
              className="friend-req-entry"
              onClick={() => Taro.navigateTo({ url: '/pages/friend-requests/index' })}
            >
              <View className="friend-req-entry__icon">👥</View>
              <View className="friend-req-entry__body">
                <Text className="friend-req-entry__title">好友申请</Text>
                <Text className="friend-req-entry__sub">
                  {pendingRequests.length > 0
                    ? `有 ${pendingRequests.length} 条待处理申请`
                    : '暂无新申请'}
                </Text>
              </View>
              {unreadFriendReqCount > 0 && (
                <View className="friend-req-entry__badge">
                  <Text className="friend-req-entry__badge-text">{unreadFriendReqCount}</Text>
                </View>
              )}
              <Text className="friend-req-entry__arrow">›</Text>
            </View>

            {/* 快捷入口 */}
            <View className="friend-quick-actions">
              <View
                className="friend-quick-btn"
                onClick={() => Taro.navigateTo({ url: '/pages/friend-list/index' })}
              >
                <Text className="friend-quick-btn__icon">📖</Text>
                <Text className="friend-quick-btn__label">通讯录</Text>
              </View>
              <View
                className="friend-quick-btn"
                onClick={() => Taro.navigateTo({ url: '/pages/add-friend/index' })}
              >
                <Text className="friend-quick-btn__icon">➕</Text>
                <Text className="friend-quick-btn__label">添加好友</Text>
              </View>
            </View>

            {/* 近期处理记录 */}
            {processedRequests.length > 0 && (
              <View className="friend-processed">
                <Text className="friend-processed__title">最近处理</Text>
                {processedRequests.slice(0, 3).map((req) => (
                  <View key={req.id} className="message-item message-item--processed">
                    <Image className="message-item__avatar" src={req.fromUser.avatar} />
                    <View className="message-item__body">
                      <Text className="message-item__name">{req.fromUser.nickname}</Text>
                      <Text className="message-item__preview">
                        {typeIcon[req.status]} {req.status === 'accepted' ? '已添加' : req.status === 'rejected' ? '已拒绝' : '待处理'}
                      </Text>
                    </View>
                    <Text className="message-item__time">{formatRelativeTime(req.updatedAt)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Message.config = { navigationStyle: 'custom' } as any
Message.displayName = 'Message'
export default Message
