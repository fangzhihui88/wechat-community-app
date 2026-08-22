import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useEffect, useMemo, useState, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

// ============== 付款码模拟配置 ==============
const QR_SIZE = 21 // 标准 QR 版本 1 的格子数

// 彩色调色板（活力红 → 紫 → 橙 → 绿），模拟微信/支付宝彩色付款码
const PALETTE = ['#FF4757', '#FF6B81', '#7C4DFF', '#B388FF', '#FFA502', '#2ED573']

interface Cell {
  filled: boolean
  color: string
}

// 基于种子的伪随机（mulberry32），保证同一分钟内图案稳定
function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 绘制 QR 的三个定位角（左上 / 右上 / 左下）
function paintFinder(m: Cell[][], r0: number, c0: number) {
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const isBorder = r === 0 || r === 6 || c === 0 || c === 6
      const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4
      m[r0 + r][c0 + c] = { filled: isBorder || isCenter, color: '#1A1A2E' }
    }
  }
}

// 根据种子生成彩色付款码矩阵
function buildMatrix(seed: number): Cell[][] {
  const rnd = mulberry32(seed)
  const m: Cell[][] = []
  for (let r = 0; r < QR_SIZE; r++) {
    const row: Cell[] = []
    for (let c = 0; c < QR_SIZE; c++) {
      const on = rnd() > 0.45
      const color = PALETTE[Math.floor(rnd() * PALETTE.length)]
      row.push({ filled: on, color })
    }
    m.push(row)
  }
  // 三个定位角
  paintFinder(m, 0, 0)
  paintFinder(m, 0, QR_SIZE - 7)
  paintFinder(m, QR_SIZE - 7, 0)
  return m
}

// 金额选择项
const AMOUNT_CHIPS = [
  { label: '任意金额', value: undefined as number | undefined },
  { label: '¥1', value: 1 },
  { label: '¥5', value: 5 },
  { label: '¥10', value: 10 },
  { label: '¥20', value: 20 },
  { label: '¥50', value: 50 },
  { label: '¥100', value: 100 },
]

type AmountMode = 'any' | 'preset' | 'custom'

const PaymentCodePage = memo(() => {
  const { walletBalance, paymentCodes } = useAppStore()

  const [tick, setTick] = useState(0)
  const [mode, setMode] = useState<AmountMode>('any')
  const [presetAmount, setPresetAmount] = useState<number | undefined>(undefined)
  const [customAmount, setCustomAmount] = useState('')

  // 每秒刷新倒计时
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000)
    return () => clearInterval(t)
  }, [])

  // 当前分钟种子（每分钟自动刷新付款码）
  const minuteSeed = Math.floor(Date.now() / 60000)
  // 剩余倒计时（秒）
  const secondsLeft = 60 - Math.floor((Date.now() % 60000) / 1000)

  // 当前实际金额（用于付款码图案 & 展示）
  const amount = useMemo(() => {
    if (mode === 'any') return 0
    if (mode === 'preset') return presetAmount ?? 0
    const n = parseFloat(customAmount)
    return isNaN(n) ? 0 : n
  }, [mode, presetAmount, customAmount])

  // 付款码矩阵：每分钟 + 金额变化都会重新生成（模拟动态码）
  const matrix = useMemo(
    () => buildMatrix(minuteSeed * 1009 + Math.floor(amount * 100)),
    [minuteSeed, amount],
  )

  const amountText = mode === 'any' ? '任意金额' : `¥${amount.toFixed(2)}`

  const handleChip = useCallback((value: number | undefined) => {
    if (value === undefined) {
      setMode('any')
      setCustomAmount('')
    } else {
      setMode('preset')
      setPresetAmount(value)
      setCustomAmount('')
    }
  }, [])

  const handleCustomInput = useCallback((e: { detail: { value: string } }) => {
    setMode('custom')
    setCustomAmount(e.detail.value)
  }, [])

  const handleManage = useCallback(() => {
    if (paymentCodes.length) {
      Taro.showToast({ title: `共 ${paymentCodes.length} 个收款码`, icon: 'none' })
    } else {
      Taro.showToast({ title: '暂无收款码', icon: 'none' })
    }
  }, [paymentCodes])

  const handleSave = useCallback(() => {
    Taro.showLoading({ title: '生成图片中...' })
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showToast({ title: '已保存到相册（模拟）', icon: 'success' })
    }, 800)
  }, [])

  return (
    <View className="payment-code-page">
      <NavBar title="付款码" rightText="管理收款码" onRightClick={handleManage} />

      <View className="payment-code-page__body">
        {/* 付款码主区域 */}
        <View className="payment-code-page__qr-card">
          <View className="payment-code-page__qr-top">
            <Text className="payment-code-page__qr-title">向商家付款</Text>
            <Text className="payment-code-page__qr-amount">{amountText}</Text>
          </View>

          <View className="payment-code-page__qr-box">
            <View className="payment-code-page__qr-grid">
              {matrix.map((row, r) =>
                row.map((cell, c) => (
                  <View
                    key={`${r}-${c}`}
                    className="payment-code-page__qr-cell"
                    style={cell.filled ? { backgroundColor: cell.color } : undefined}
                  />
                )),
              )}
            </View>
          </View>

          <View className="payment-code-page__countdown">
            <Text className="payment-code-page__countdown-icon">⏱</Text>
            <Text className="payment-code-page__countdown-text">
              {secondsLeft}s 后自动刷新（动态码）
            </Text>
          </View>
        </View>

        {/* 金额选择栏 */}
        <View className="payment-code-page__amount-section">
          <Text className="payment-code-page__section-title">付款金额</Text>
          <View className="payment-code-page__chips">
            {AMOUNT_CHIPS.map((chip) => {
              const active =
                (mode === 'any' && chip.value === undefined) ||
                (mode === 'preset' && chip.value === presetAmount)
              return (
                <View
                  key={chip.label}
                  className={`payment-code-page__chip ${active ? 'payment-code-page__chip--active' : ''}`}
                  onClick={() => handleChip(chip.value)}
                >
                  <Text
                    className={`payment-code-page__chip-text ${active ? 'payment-code-page__chip-text--active' : ''}`}
                  >
                    {chip.label}
                  </Text>
                </View>
              )
            })}
          </View>

          {/* 自定义金额输入 */}
          <View className="payment-code-page__custom-input">
            <Text className="payment-code-page__custom-symbol">¥</Text>
            <Input
              className="payment-code-page__custom-field"
              type="digit"
              placeholder="输入自定义金额"
              value={customAmount}
              onInput={handleCustomInput}
            />
          </View>
        </View>

        {/* 底部：余额 + 保存图片 */}
        <View className="payment-code-page__footer">
          <View className="payment-code-page__balance">
            <Text className="payment-code-page__balance-label">当前余额</Text>
            <Text className="payment-code-page__balance-value">¥{walletBalance.toFixed(2)}</Text>
          </View>
          <View className="payment-code-page__save-btn" onClick={handleSave}>
            <Text className="payment-code-page__save-text">保存图片</Text>
          </View>
        </View>

        <View className="safe-area-bottom" />
      </View>
    </View>
  )
})

PaymentCodePage.displayName = 'PaymentCodePage'
export default PaymentCodePage
;(PaymentCodePage as any).config = { navigationStyle: 'custom' } as any
