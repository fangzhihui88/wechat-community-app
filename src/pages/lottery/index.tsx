import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const Lottery = memo(() => {
  const { lotteryPrizes, pointsBalance, drawLottery, spendPoints } = useAppStore()
  const [spinning, setSpinning] = useState(false)
  const [lastPrize, setLastPrize] = useState<number | null>(null)

  const handleDraw = useCallback(() => {
    if (spinning) return
    if (pointsBalance < 50) {
      Taro.showToast({ title: '积分不足，先去签到吧', icon: 'none' })
      return
    }
    setSpinning(true)
    setLastPrize(null)
    spendPoints(50)
    setTimeout(() => {
      const idx = drawLottery()
      setLastPrize(idx)
      setSpinning(false)
      const prize = lotteryPrizes[idx]
      Taro.showToast({ title: `抽中：${prize.name}`, icon: 'none' })
    }, 1200)
  }, [spinning, pointsBalance, spendPoints, drawLottery, lotteryPrizes])

  return (
    <View className="lottery-page">
      <NavBar title="幸运转盘" showBack />

      <View className="lottery-page__body">
        <View className="lottery-page__balance">
          <Text className="lottery-page__balance-label">我的积分</Text>
          <Text className="lottery-page__balance-num">{pointsBalance.toLocaleString()}</Text>
        </View>

        <View className={`lottery-page__wheel ${spinning ? 'lottery-page__wheel--spinning' : ''}`}>
          <View className="lottery-page__wheel-inner">
            <Text className="lottery-page__wheel-emoji">🎡</Text>
            <Text className="lottery-page__wheel-text">幸运转盘</Text>
          </View>
        </View>

        <View className="lottery-page__prizes">
          {lotteryPrizes.map((p, i) => (
            <View key={p.id} className={`lottery-page__prize ${lastPrize === i ? 'lottery-page__prize--hit' : ''}`}>
              <Text className="lottery-page__prize-icon">{p.icon}</Text>
              <Text className="lottery-page__prize-name">{p.name}</Text>
            </View>
          ))}
        </View>

        <View className="lottery-page__rules">
          <Text className="lottery-page__rules-title">活动规则</Text>
          <Text className="lottery-page__rules-text">· 每次抽奖消耗 50 积分</Text>
          <Text className="lottery-page__rules-text">· 奖品包括积分、实物好物</Text>
          <Text className="lottery-page__rules-text">· 每日抽奖次数不限</Text>
        </View>
      </View>

      <View className="lottery-page__footer safe-area-bottom">
        <View className={`lottery-page__btn ${spinning ? 'lottery-page__btn--disabled' : ''}`} onClick={handleDraw}>
          <Text className="lottery-page__btn-text">{spinning ? '开奖中...' : '开始抽奖（-50 积分）'}</Text>
        </View>
      </View>
    </View>
  )
})

Lottery.config = { navigationStyle: 'custom' } as any
Lottery.displayName = 'Lottery'
export default Lottery
