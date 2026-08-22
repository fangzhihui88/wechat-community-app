import { View, Text, ScrollView } from '@tarojs/components'
import { memo } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const ExchangeRecords = memo(() => {
  const { exchangeRecords } = useAppStore()

  return (
    <View className="exchange-page">
      <NavBar title="兑换记录" showBack />
      <ScrollView scrollY className="exchange-page__body">
        {exchangeRecords.length === 0 ? (
          <View className="exchange-page__empty">
            <Text className="exchange-page__empty-icon">📦</Text>
            <Text className="exchange-page__empty-text">暂无兑换记录</Text>
          </View>
        ) : (
          <View className="exchange-page__list">
            {exchangeRecords.map((r) => (
              <View key={r.id} className="exchange-page__item">
                <View className="exchange-page__item-icon">📦</View>
                <View className="exchange-page__item-info">
                  <Text className="exchange-page__item-name">{r.productName}</Text>
                  <Text className="exchange-page__item-time">{new Date(r.createdAt).toLocaleString('zh-CN')}</Text>
                </View>
                <View className="exchange-page__item-right">
                  <Text className="exchange-page__item-points">-{r.points} 积分</Text>
                  <Text className={`exchange-page__item-status exchange-page__item-status--${r.status}`}>
                    {r.status === 'done' ? '已完成' : '处理中'}
                  </Text>
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

ExchangeRecords.config = { navigationStyle: 'custom' } as any
ExchangeRecords.displayName = 'ExchangeRecords'
export default ExchangeRecords
