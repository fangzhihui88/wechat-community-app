import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import { formatRelativeTime } from '../../utils/formatTime'
import './index.css'

const Activities = memo(() => {
  const { activities, joinActivity } = useAppStore()

  const handleJoin = useCallback((e: any, id: string) => {
    e.stopPropagation()
    joinActivity(id)
    Taro.showToast({ title: '报名成功', icon: 'success' })
  }, [joinActivity])

  const handleDetail = useCallback((id: string) => {
    Taro.navigateTo({ url: `/pages/activity-detail/index?id=${id}` })
  }, [])

  return (
    <View className="activities-page">
      <NavBar title="同城活动" showBack />

      <ScrollView scrollY className="activities-page__body">
        <View className="gradient-header">
          <Text className="activities-page__header-title">同城活动</Text>
          <Text className="activities-page__header-sub">发现身边有趣的人和事</Text>
        </View>

        {activities.map((a) => (
          <View key={a.id} className="activity-card animate-fade-in" onClick={() => handleDetail(a.id)}>
            <Image className="activity-card__cover" src={a.cover} mode="aspectFill" lazyLoad />
            <View className="activity-card__body">
              <Text className="activity-card__title">{a.title}</Text>
              <Text className="activity-card__desc">{a.desc}</Text>
              <View className="activity-card__meta">
                <Text className="activity-card__meta-item">📍 {a.location}</Text>
                <Text className="activity-card__meta-item">🕐 {formatRelativeTime(a.startTime)}</Text>
              </View>
              <View className="activity-card__footer">
                <Text className="activity-card__count">
                  {a.participants}/{a.maxParticipants} 人已报名
                </Text>
                <View
                  className={`activity-card__btn ${a.joined ? 'activity-card__btn--joined' : ''}`}
                  onClick={(e) => handleJoin(e, a.id)}
                >
                  <Text className="activity-card__btn-text">{a.joined ? '已报名 ✓' : '立即报名'}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
})

Activities.config = { navigationStyle: 'custom' } as any
Activities.displayName = 'Activities'
export default Activities
