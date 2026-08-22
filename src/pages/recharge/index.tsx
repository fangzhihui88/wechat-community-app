import { View, Text, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const amounts = [6, 30, 68, 128, 198, 328]

const Recharge = memo(() => {
  const { walletBalance, recharge } = useAppStore()
  const [amount, setAmount] = useState(30)
  const [custom, setCustom] = useState('')

  const handleSelect = useCallback((a: number) => {
    setAmount(a)
    setCustom('')
  }, [])

  const handlePay = useCallback(() => {
    const finalAmount = custom ? Number(custom) : amount
    if (!finalAmount || finalAmount <= 0) {
      Taro.showToast({ title: '请输入有效金额', icon: 'none' })
      return
    }
    Taro.showModal({
      title: '确认充值',
      content: `充值 ¥${finalAmount}，获得 ${finalAmount} 金币`,
      success: (res) => {
        if (res.confirm) {
          recharge(finalAmount)
          Taro.showToast({ title: '充值成功', icon: 'success' })
        }
      },
    })
  }, [amount, custom, recharge])

  return (
    <View className="recharge-page">
      <NavBar title="充值中心" showBack />
      <ScrollView scrollY className="recharge-page__body">
        <View className="recharge-page__balance">
          <Text className="recharge-page__balance-label">当前余额（金币）</Text>
          <Text className="recharge-page__balance-value">{walletBalance}</Text>
        </View>

        <View className="recharge-page__amounts">
          {amounts.map((a) => (
            <View key={a} className={`recharge-page__amount ${amount === a && !custom ? 'recharge-page__amount--active' : ''}`} onClick={() => handleSelect(a)}>
              <Text className="recharge-page__amount-value">¥{a}</Text>
              <Text className="recharge-page__amount-bonus">{a >= 128 ? `送${Math.round(a * 0.2)}金币` : ''}</Text>
            </View>
          ))}
        </View>

        <View className="recharge-page__custom">
          <Text className="recharge-page__custom-label">自定义金额</Text>
          <View className="recharge-page__custom-input-wrap">
            <Text className="recharge-page__custom-prefix">¥</Text>
            <Input
              className="recharge-page__custom-input"
              type="number"
              placeholder="输入金额"
              value={custom}
              onInput={(e) => { setCustom(e.detail.value); setAmount(0) }}
            />
          </View>
        </View>

        <View className="recharge-page__pay" onClick={handlePay}>
          <Text className="recharge-page__pay-text">立即充值 ¥{custom ? (Number(custom) || 0) : amount}</Text>
        </View>
        <View className="recharge-page__hint">
          <Text className="recharge-page__hint-text">1 元 = 1 金币 · 金币可用于打赏、兑换礼品</Text>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Recharge.config = { navigationStyle: 'custom' } as any
Recharge.displayName = 'Recharge'
export default Recharge
