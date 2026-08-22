import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import UserAvatar from '../../components/UserAvatar'
import { formatRelativeTime } from '../../utils/formatTime'
import './index.css'

const ActivityDetail = memo(() => {
  const router = useRouter()
  const { activities, joinActivity } = useAppStore()
  const id = router.params.id || 'act_001'
  const activity = activities.find((a) => a.id === id) || activities[0]

  const handleJoin = useCallback(() => {
    joinActivity(activity.id)
    Taro.showToast({ title: activity.joined ? '已取消报名' : '报名成功', icon: 'success' })
  }, [activity, joinActivity])

  if (!activity) return null

  return (
    <View className="activity-detail-page">
      <NavBar title="活动详情" showBack />
      <ScrollView scrollY className="activity-detail-page__body">
        <Image className="activity-detail-page__cover" src={activity.cover} mode="aspectFill" />
        <View className="activity-detail-page__card animate-fade-in">
          <Text className="activity-detail-page__title">{activity.title}</Text>
          <View className="activity-detail-page__host">
            <UserAvatar user={activity.host} size="small" showName />
            <Text className="activity-detail-page__host-label">发起人</Text>
          </View>
          <View className="activity-detail-page__divider" />
          <View className="activity-detail-page__info-row">
            <Text className="activity-detail-page__info-icon">🕐</Text>
            <Text className="activity-detail-page__info-text">{formatRelativeTime(activity.startTime)}</Text>
          </View>
          <View className="activity-detail-page__info-row">
            <Text className="activity-detail-page__info-icon">📍</Text>
            <Text className="activity-detail-page__info-text">{activity.location}</Text>
          </View>
          <View className="activity-detail-page__info-row">
            <Text className="activity-detail-page__info-icon">👥</Text>
            <Text className="activity-detail-page__info-text">{activity.participants}/{activity.maxParticipants} 人已报名</Text>
          </View>
          <View className="activity-detail-page__divider" />
          <Text className="activity-detail-page__section-title">活动介绍</Text>
          <Text className="activity-detail-page__desc">{activity.desc}</Text>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>

      <View className="activity-detail-page__footer safe-area-bottom">
        <View
          className={`activity-detail-page__join-btn ${activity.joined ? 'activity-detail-page__join-btn--joined' : ''}`}
          onClick={handleJoin}
        >
          <Text className="activity-detail-page__join-text">
            {activity.joined ? '已报名，点击取消' : '立即报名'}
          </Text>
        </View>
      </View>
    </View>
  )
})

ActivityDetail.config = { navigationStyle: 'custom' } as any
ActivityDetail.displayName = 'ActivityDetail'
export default ActivityDetail
