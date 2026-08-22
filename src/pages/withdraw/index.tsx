import { View, Text, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const Withdraw = memo(() => {
  const { walletBalance, withdraw } = useAppStore()
  const [amount, setAmount] = useState('')
  const dailyLimit = 500

  const handleAll = useCallback(() => setAmount(String(walletBalance)), [walletBalance])
  const handleMax = useCallback(() => {
    Taro.showToast({ title: `今日可提现上限 ¥${dailyLimit}`, icon: 'none' })
  }, [dailyLimit])

  const handleSubmit = useCallback(() => {
    const val = Number(amount)
    if (!val || val <= 0) {
      Taro.showToast({ title: '请输入有效金额', icon: 'none' })
      return
    }
    if (val > walletBalance) {
      Taro.showToast({ title: '余额不足', icon: 'none' })
      return
    }
    Taro.showModal({
      title: '确认提现',
      content: `提现 ¥${val} 到微信零钱？`,
      success: (res) => {
        if (res.confirm) {
          withdraw(val)
          setAmount('')
          Taro.showToast({ title: '提现申请已提交', icon: 'success' })
        }
      },
    })
  }, [amount, walletBalance, withdraw])

  return (
    <View className="withdraw-page">
      <NavBar title="提现" showBack />
      <ScrollView scrollY className="withdraw-page__body">
        <View className="withdraw-page__balance">
          <Text className="withdraw-page__balance-label">可提现余额</Text>
          <Text className="withdraw-page__balance-value">¥{walletBalance}</Text>
          <Text className="withdraw-page__balance-desc">今日剩余可提现 ¥{dailyLimit}</Text>
        </View>

        <View className="withdraw-page__card">
          <Text className="withdraw-page__label">提现金额</Text>
          <View className="withdraw-page__input-wrap">
            <Text className="withdraw-page__prefix">¥</Text>
            <Input
              className="withdraw-page__input"
              type="digit"
              placeholder="0.00"
              value={amount}
              onInput={(e) => setAmount(e.detail.value)}
            />
            <Text className="withdraw-page__all" onClick={handleAll}>全部</Text>
          </View>
          <View className="withdraw-page__tips">
            <Text className="withdraw-page__tip" onClick={handleMax}>单笔最低 ¥1 · 每日上限 ¥{dailyLimit}</Text>
          </View>
        </View>

        <View className="withdraw-page__way">
          <Text className="withdraw-page__way-label">提现方式</Text>
          <View className="withdraw-page__way-item">
            <Text className="withdraw-page__way-icon">💚</Text>
            <Text className="withdraw-page__way-name">微信零钱</Text>
            <Text className="withdraw-page__way-check">✓</Text>
          </View>
        </View>

        <View className="withdraw-page__submit" onClick={handleSubmit}>
          <Text className="withdraw-page__submit-text">确认提现</Text>
        </View>
        <View className="withdraw-page__hint">
          <Text className="withdraw-page__hint-text">提现通常 1-3 个工作日到账</Text>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Withdraw.config = { navigationStyle: 'custom' } as any
Withdraw.displayName = 'Withdraw'
export default Withdraw
