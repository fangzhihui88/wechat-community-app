import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const Points = memo(() => {
  const { pointsBalance, walletTxs } = useAppStore()

  const entries = [
    { icon: '📅', label: '每日签到', desc: '连续签到领积分', url: '/pages/checkin/index' },
    { icon: '🎡', label: '幸运转盘', desc: '抽奖赢积分', url: '/pages/lottery/index' },
    { icon: '🛍', label: '积分商城', desc: '好物兑换', url: '/pages/mall/index' },
    { icon: '📦', label: '兑换记录', desc: '查看历史兑换', url: '/pages/exchange-records/index' },
  ]

  const handleNav = useCallback((url: string) => {
    Taro.navigateTo({ url })
  }, [])

  return (
    <View className="points-page">
      <NavBar title="积分中心" showBack />

      <ScrollView scrollY className="points-page__body">
        <View className="points-page__hero">
          <Text className="points-page__balance-label">我的积分</Text>
          <Text className="points-page__balance">{pointsBalance.toLocaleString()}</Text>
          <Text className="points-page__balance-hint">积分可兑换商城好物</Text>
        </View>

        <View className="points-page__entries">
          {entries.map((e) => (
            <View key={e.label} className="points-page__entry" onClick={() => handleNav(e.url)}>
              <Text className="points-page__entry-icon">{e.icon}</Text>
              <View className="points-page__entry-info">
                <Text className="points-page__entry-label">{e.label}</Text>
                <Text className="points-page__entry-desc">{e.desc}</Text>
              </View>
              <Text className="points-page__entry-arrow">›</Text>
            </View>
          ))}
        </View>

        <View className="points-page__section">
          <Text className="points-page__section-title">积分明细</Text>
          {walletTxs.map((tx) => (
            <View key={tx.id} className="points-page__tx">
              <View className="points-page__tx-info">
                <Text className="points-page__tx-title">{tx.title}</Text>
                <Text className="points-page__tx-time">{new Date(tx.createdAt).toLocaleDateString('zh-CN')}</Text>
              </View>
              <Text className={`points-page__tx-amount ${tx.type === 'income' ? 'points-page__tx-amount--in' : 'points-page__tx-amount--out'}`}>
                {tx.type === 'income' ? '+' : '-'}{tx.amount}
              </Text>
            </View>
          ))}
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Points.config = { navigationStyle: 'custom' } as any
Points.displayName = 'Points'
export default Points
