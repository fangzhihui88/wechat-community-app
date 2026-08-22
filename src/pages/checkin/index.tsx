import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const Checkin = memo(() => {
  const { checkin, checkinToday } = useAppStore()

  const handleCheckin = useCallback(() => {
    if (checkin.todayChecked) {
      Taro.showToast({ title: '今天已签到啦', icon: 'none' })
      return
    }
    checkinToday()
    Taro.showToast({ title: '签到成功 +10 积分', icon: 'success' })
  }, [checkin.todayChecked, checkinToday])

  const days = Array.from({ length: 7 }, (_, i) => i + 1)

  return (
    <View className="checkin-page">
      <NavBar title="每日签到" showBack />

      <ScrollView scrollY className="checkin-page__body">
        <View className="checkin-page__hero">
          <Text className="checkin-page__streak-num">{checkin.streak}</Text>
          <Text className="checkin-page__streak-label">连续签到天数 🔥</Text>
          <Text className="checkin-page__total">累计签到 {checkin.totalDays} 天</Text>
        </View>

        <View className="checkin-page__card">
          <Text className="checkin-page__card-title">本周奖励</Text>
          <View className="checkin-page__days">
            {days.map((d) => {
              const reward = checkin.rewards.find((r) => r.day === d)
              const isDone = checkin.streak >= d
              return (
                <View key={d} className={`checkin-page__day ${isDone ? 'checkin-page__day--done' : ''}`}>
                  <Text className="checkin-page__day-label">第{d}天</Text>
                  <View className="checkin-page__day-circle">
                    {isDone ? <Text className="checkin-page__day-check">✓</Text> : <Text className="checkin-page__day-points">+{reward?.points}</Text>}
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        <View className="checkin-page__rules">
          <Text className="checkin-page__rules-title">签到规则</Text>
          <Text className="checkin-page__rules-text">· 每日签到可获得积分奖励</Text>
          <Text className="checkin-page__rules-text">· 连续签到奖励更丰厚</Text>
          <Text className="checkin-page__rules-text">· 中断后重新计算连续天数</Text>
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>

      <View className="checkin-page__footer safe-area-bottom">
        <View className={`checkin-page__btn ${checkin.todayChecked ? 'checkin-page__btn--done' : ''}`} onClick={handleCheckin}>
          <Text className="checkin-page__btn-text">{checkin.todayChecked ? '今日已签到 ✓' : '立即签到 +10 积分'}</Text>
        </View>
      </View>
    </View>
  )
})

Checkin.config = { navigationStyle: 'custom' } as any
Checkin.displayName = 'Checkin'
export default Checkin
