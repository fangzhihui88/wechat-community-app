import { View, Text, ScrollView } from '@tarojs/components'
import { memo } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const WalletTx = memo(() => {
  const { walletTxs } = useAppStore()

  return (
    <View className="wallettx-page">
      <NavBar title="账单明细" showBack />
      <ScrollView scrollY className="wallettx-page__body">
        <View className="wallettx-page__summary">
          <Text className="wallettx-page__summary-label">本月支出</Text>
          <Text className="wallettx-page__summary-num">
            -{walletTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)} 元
          </Text>
        </View>
        <View className="wallettx-page__list">
          {walletTxs.map((tx) => (
            <View key={tx.id} className="wallettx-page__item">
              <View className="wallettx-page__item-info">
                <Text className="wallettx-page__item-title">{tx.title}</Text>
                <Text className="wallettx-page__item-time">{new Date(tx.createdAt).toLocaleString('zh-CN')}</Text>
              </View>
              <Text className={`wallettx-page__item-amount ${tx.type === 'income' ? 'wallettx-page__item-amount--in' : 'wallettx-page__item-amount--out'}`}>
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

WalletTx.config = { navigationStyle: 'custom' } as any
WalletTx.displayName = 'WalletTx'
export default WalletTx
