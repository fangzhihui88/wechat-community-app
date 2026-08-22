import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const Wallet = memo(() => {
  const { walletBalance, coupons } = useAppStore()
  const usableCoupons = coupons.filter((c) => !c.used).length

  const entries = [
    { icon: '📊', label: '账单明细', desc: '收支记录', url: '/pages/wallet-tx/index' },
    { icon: '🎫', label: '优惠券', desc: `${usableCoupons} 张可用`, url: '/pages/coupons/index' },
    { icon: '📷', label: '扫码支付', desc: '扫一扫付钱', url: '/pages/scan-pay/index' },
    { icon: '💳', label: '付款码', desc: '出示付款码', url: '/pages/payment-code/index' },
    { icon: '🧩', label: '支付记录', desc: '查看所有支付', url: '/pages/pay-history/index' },
    { icon: '🎨', label: '生成收款码', desc: '创建收款码', url: '/pages/create-code/index' },
    { icon: '🏧', label: '充值中心', desc: '余额充值', url: '/pages/recharge/index' },
    { icon: '💸', label: '提现', desc: '余额提现', url: '/pages/withdraw/index' },
    { icon: '💎', label: '积分商城', desc: '积分兑换好物', url: '/pages/mall/index' },
    { icon: '🧾', label: '兑换记录', desc: '积分兑换记录', url: '/pages/exchange-records/index' },
  ]

  const handleNav = useCallback((url: string) => {
    Taro.navigateTo({ url })
  }, [])

  return (
    <View className="wallet-page">
      <NavBar title="我的钱包" showBack />
      <View className="wallet-page__body">
        <View className="wallet-page__hero">
          <Text className="wallet-page__balance-label">账户余额（元）</Text>
          <Text className="wallet-page__balance">{walletBalance.toFixed(2)}</Text>
          <View className="wallet-page__actions">
            <View className="wallet-page__action-btn" onClick={() => handleNav('/pages/recharge/index')}>
              <Text className="wallet-page__action-text">充值</Text>
            </View>
            <View className="wallet-page__action-btn" onClick={() => handleNav('/pages/withdraw/index')}>
              <Text className="wallet-page__action-text">提现</Text>
            </View>
          </View>
        </View>

        <View className="wallet-page__entries">
          {entries.map((e) => (
            <View key={e.label} className="wallet-page__entry" onClick={() => handleNav(e.url)}>
              <Text className="wallet-page__entry-icon">{e.icon}</Text>
              <View className="wallet-page__entry-info">
                <Text className="wallet-page__entry-label">{e.label}</Text>
                <Text className="wallet-page__entry-desc">{e.desc}</Text>
              </View>
              <Text className="wallet-page__entry-arrow">›</Text>
            </View>
          ))}
        </View>

        <View className="wallet-page__hint">
          <Text className="wallet-page__hint-text">💰 余额可通过充值获得，或参与社区活动赚取</Text>
        </View>
        <View className="safe-area-bottom" />
      </View>
    </View>
  )
})

Wallet.config = { navigationStyle: 'custom' } as any
Wallet.displayName = 'Wallet'
export default Wallet
