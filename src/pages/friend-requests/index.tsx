import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import EmptyState from '../../components/EmptyState'
import { formatRelativeTime } from '../../utils/formatTime'
import './index.css'

const FriendRequestsPage = memo(() => {
  const { friendRequests, acceptFriendRequest, rejectFriendRequest } = useAppStore()
  const [showProcessed, setShowProcessed] = useState(false)

  const pending = friendRequests.filter(r => r.status === 'pending')
  const processed = friendRequests.filter(r => r.status !== 'pending')

  const handleAccept = useCallback((id: string) => {
    acceptFriendRequest(id)
    Taro.showToast({ title: '已添加好友', icon: 'success' })
  }, [acceptFriendRequest])

  const handleReject = useCallback((id: string) => {
    rejectFriendRequest(id)
    Taro.showToast({ title: '已拒绝', icon: 'none' })
  }, [rejectFriendRequest])

  return (
    <View className="friend-requests-page">
      <NavBar
        title="好友申请"
        showBack
        rightText={processed.length > 0 ? '清空' : undefined}
        onRightClick={showProcessed ? () => {
          setShowProcessed(false)
          processed.forEach(r => rejectFriendRequest(r.id))
        } : undefined}
      />

      <ScrollView scrollY className="friend-requests-page__list">
        {pending.length > 0 ? (
          <View className="req-list">
            <Text className="req-section-title">待处理 ({pending.length})</Text>
            {pending.map((req) => (
              <View key={req.id} className="req-card">
                <View className="req-card__header">
                  <View className="req-card__avatar-wrap">
                    <Image className="req-card__avatar" src={req.fromUser.avatar} />
                    {req.fromUser.isVip && <View className="req-card__vip-badge">V</View>}
                  </View>
                  <View className="req-card__info">
                    <Text className="req-card__name">{req.fromUser.nickname}</Text>
                    <Text className="req-card__time">{formatRelativeTime(req.createdAt)}</Text>
                  </View>
                </View>
                {req.message && (
                  <View className="req-card__message">
                    <Text className="req-card__message-text">{req.message}</Text>
                  </View>
                )}
                <View className="req-card__actions">
                  <View
                    className="req-card__btn req-card__btn--reject"
                    onClick={() => handleReject(req.id)}
                  >
                    <Text className="req-card__btn-text">拒绝</Text>
                  </View>
                  <View
                    className="req-card__btn req-card__btn--accept"
                    onClick={() => handleAccept(req.id)}
                  >
                    <Text className="req-card__btn-text req-card__btn-text--primary">同意</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="req-empty-wrap">
            <EmptyState icon="👥" title="暂无好友申请" description="发送好友申请后，对方会在这里收到通知" />
          </View>
        )}

        {processed.length > 0 && (
          <View className="req-processed">
            <View
              className="req-processed__header"
              onClick={() => setShowProcessed(v => !v)}
            >
              <Text className="req-section-title">已处理 ({processed.length})</Text>
              <Text className="req-processed__toggle">{showProcessed ? '▲' : '▼'}</Text>
            </View>
            {showProcessed && processed.map((req) => (
              <View key={req.id} className="req-card req-card--processed">
                <View className="req-card__header">
                  <Image className="req-card__avatar" src={req.fromUser.avatar} />
                  <View className="req-card__info">
                    <Text className="req-card__name">{req.fromUser.nickname}</Text>
                    <Text className="req-card__time">{formatRelativeTime(req.updatedAt)}</Text>
                  </View>
                  <View className={`req-card__status req-card__status--${req.status}`}>
                    <Text className="req-card__status-text">
                      {req.status === 'accepted' ? '已添加' : '已拒绝'}
                    </Text>
                  </View>
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

export default FriendRequestsPage
(FriendRequestsPage as any).config = { navigationStyle: 'custom' } as any
