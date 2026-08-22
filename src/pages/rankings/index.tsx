import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import UserAvatar from '../../components/UserAvatar'
import './index.css'

const tabs = [
  { key: 'hot', label: '人气榜' },
  { key: 'new', label: '新人榜' },
  { key: 'vip', label: 'VIP榜' },
] as const

const RankMedal = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Text className="rank-medal rank-medal--gold">🥇</Text>
  if (rank === 2) return <Text className="rank-medal rank-medal--silver">🥈</Text>
  if (rank === 3) return <Text className="rank-medal rank-medal--bronze">🥉</Text>
  return <Text className="rank-medal rank-medal--plain">{rank}</Text>
}

const Rankings = memo(() => {
  const { rankings, rankingType, setRankingType } = useAppStore()

  const handleTab = useCallback((key: 'hot' | 'new' | 'vip') => {
    setRankingType(key)
  }, [setRankingType])

  const handleUser = useCallback((userId: string) => {
    Taro.navigateTo({ url: `/pages/user-detail/index?id=${userId}` })
  }, [])

  return (
    <View className="rankings-page">
      <NavBar title="排行榜" showBack />

      <View className="rankings-page__tabs">
        {tabs.map((t) => (
          <View
            key={t.key}
            className={`rankings-page__tab ${rankingType === t.key ? 'rankings-page__tab--active' : ''}`}
            onClick={() => handleTab(t.key)}
          >
            <Text className="rankings-page__tab-text">{t.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY className="rankings-page__body">
        <View className="rankings-page__podium">
          {rankings.slice(0, 3).map((r) => (
            <View key={r.id} className={`rankings-page__podium-item rankings-page__podium-item--${r.rank}`} onClick={() => handleUser(r.user!.id)}>
              <UserAvatar user={r.user!} size={r.rank === 1 ? 'large' : 'medium'} showVipBadge />
              <Text className="rankings-page__podium-name">{r.user!.nickname}</Text>
              <Text className="rankings-page__podium-score">{r.score.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        <View className="rankings-page__list">
          {rankings.slice(3).map((r) => (
            <View key={r.id} className="rankings-page__item" onClick={() => handleUser(r.user!.id)}>
              <RankMedal rank={r.rank} />
              <UserAvatar user={r.user!} size="small" />
              <View className="rankings-page__item-info">
                <Text className="rankings-page__item-name">{r.user!.nickname}</Text>
                <Text className="rankings-page__item-title">{r.title}</Text>
              </View>
              <View className="rankings-page__item-right">
                <Text className="rankings-page__item-score">{r.score.toLocaleString()}</Text>
                <Text className={`rankings-page__item-trend rankings-page__item-trend--${r.trend}`}>
                  {r.trend === 'up' ? '↑' : r.trend === 'down' ? '↓' : '—'}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Rankings.config = { navigationStyle: 'custom' } as any
Rankings.displayName = 'Rankings'
export default Rankings
