import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

// ============== 本地 Mock 商户数据 ==============
interface MockMerchant {
  id: string
  name: string
  avatar: string
  amount: number
  category: string
}

const MOCK_MERCHANTS: MockMerchant[] = [
  {
    id: 'm_001',
    name: '源头咖啡馆',
    avatar: 'https://images.unsplash.com/photo-1508647909067-16550a78e478?w=200&h=200&fit=crop&q=80',
    amount: 28.0,
    category: '餐饮美食',
  },
  {
    id: 'm_002',
    name: '社区便利店',
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&q=80',
    amount: 12.5,
    category: '超市零售',
  },
  {
    id: 'm_003',
    name: '源头理发店',
    avatar: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop&q=80',
    amount: 68.0,
    category: '生活服务',
  },
  {
    id: 'm_004',
    name: '社区健身房',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&q=80',
    amount: 199.0,
    category: '运动健身',
  },
  {
    id: 'm_005',
    name: '源头水果铺',
    avatar: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=200&h=200&fit=crop&q=80',
    amount: 35.8,
    category: '生鲜水果',
  },
]

type PayMethod = 'balance' | 'points' | 'coupon'

interface MethodMeta {
  label: string
  icon: string
  canPay: (amount: number, walletBalance: number, pointsBalance: number, usableCoupons: number) => boolean
  insufficientText: string
}

const METHOD_META: Record<PayMethod, MethodMeta> = {
  balance: {
    label: '余额',
    icon: '💰',
    canPay: (amount, walletBalance) => walletBalance >= amount,
    insufficientText: '账户余额不足',
  },
  points: {
    label: '积分',
    icon: '⭐',
    canPay: (amount, _w, pointsBalance) => pointsBalance >= amount * 100,
    insufficientText: '积分不足（1 元 = 100 积分）',
  },
  coupon: {
    label: '优惠券',
    icon: '🎫',
    canPay: (_amount, _w, _p, usableCoupons) => usableCoupons > 0,
    insufficientText: '无可用优惠券',
  },
}

// ============== 组件 ==============
const ScanPay = memo(() => {
  const { walletBalance, pointsBalance, coupons, payOrders, addPayOrder, updatePayOrderStatus } = useAppStore()

  const [scanState, setScanState] = useState<'idle' | 'scanning'>('idle')
  const [merchant, setMerchant] = useState<MockMerchant | null>(null)
  const [payMethod, setPayMethod] = useState<PayMethod>('balance')
  const [password, setPassword] = useState('')
  const [showKeypad, setShowKeypad] = useState(false)
  const [paying, setPaying] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const usableCoupons = coupons.filter(
    (c) => !c.used && new Date(c.expiredAt).getTime() > Date.now(),
  ).length

  const amount = merchant?.amount ?? 0
  const meta = METHOD_META[payMethod]
  const canPayNow = meta.canPay(amount, walletBalance, pointsBalance, usableCoupons)

  // 点击扫描框 → 模拟扫码
  const handleScan = useCallback(() => {
    if (scanState === 'scanning') return
    Taro.showToast({ title: '扫描二维码', icon: 'none' })
    setScanState('scanning')
    setMerchant(null)
    setPassword('')
    setResult(null)
    setShowKeypad(false)
    setPayMethod('balance')
    setTimeout(() => {
      const next = MOCK_MERCHANTS[Math.floor(Math.random() * MOCK_MERCHANTS.length)]
      setMerchant(next)
      setScanState('idle')
    }, 1200)
  }, [scanState])

  // 支付密码键盘输入（模拟输入）
  const handleKey = useCallback((key: string) => {
    setPassword((prev) => {
      if (key === 'del') return prev.slice(0, -1)
      if (prev.length >= 6) return prev
      return prev + key
    })
  }, [])

  // 确认支付
  const handleConfirm = useCallback(() => {
    if (!merchant) return
    if (password.length < 6) {
      Taro.showToast({ title: '请输入 6 位支付密码', icon: 'none' })
      return
    }
    if (paying) return
    setPaying(true)

    const createdAt = new Date().toISOString()
    // 先写入一条 pending 订单（id 由 store 统一生成）
    addPayOrder({
      id: `po_local_${Date.now()}`,
      amount: merchant.amount,
      merchantName: merchant.name,
      merchantAvatar: merchant.avatar,
      status: 'pending',
      createdAt,
      desc: '扫码支付',
    })
    // 取回刚刚写入的订单（store 内部重新生成了 id）
    const stored =
      useAppStore.getState().payOrders.find((o) => o.createdAt === createdAt) ??
      useAppStore.getState().payOrders[0]

    setTimeout(() => {
      const ok = METHOD_META[payMethod].canPay(
        merchant.amount,
        walletBalance,
        pointsBalance,
        usableCoupons,
      )
      if (stored) {
        updatePayOrderStatus(stored.id, ok ? 'paid' : 'failed')
      }
      setPaying(false)
      setShowKeypad(false)
      setResult({
        success: ok,
        message: ok
          ? `支付成功 ¥${merchant.amount.toFixed(2)}`
          : METHOD_META[payMethod].insufficientText,
      })
    }, 900)
  }, [merchant, password, paying, payMethod, walletBalance, pointsBalance, usableCoupons, addPayOrder, updatePayOrderStatus])

  // 完成 / 重新扫码
  const handleReset = useCallback(() => {
    setResult(null)
    setMerchant(null)
    setPassword('')
    setPayMethod('balance')
    setShowKeypad(false)
  }, [])

  const statusText: Record<string, string> = {
    pending: '待支付',
    paid: '支付成功',
    failed: '支付失败',
    refunded: '已退款',
  }

  return (
    <View className="scan-pay-page">
      <NavBar title="扫码支付" showBack />

      <ScrollView scrollY className="scan-pay-page__body">
        {/* 1. 顶部扫描框 */}
        <View className="scan-pay-page__scan-wrap">
          <View
            className={`scan-pay-page__scan ${scanState === 'scanning' ? 'scan-pay-page__scan--active' : ''}`}
            onClick={handleScan}
          >
            <Text className="scan-pay-page__scan-icon">📷</Text>
            <Text className="scan-pay-page__scan-title">
              {scanState === 'scanning' ? '正在扫描二维码…' : '点击扫描商家收款码'}
            </Text>
            <Text className="scan-pay-page__scan-sub">支持微信 / 支付宝扫码</Text>
            {scanState === 'scanning' && <View className="scan-pay-page__scan-line" />}
          </View>
        </View>

        {/* 2. 扫描成功后的商户展示 */}
        {merchant && (
          <View className="scan-pay-page__merchant animate-fade-in">
            <Image className="scan-pay-page__merchant-avatar" src={merchant.avatar} mode="aspectFill" />
            <View className="scan-pay-page__merchant-info">
              <Text className="scan-pay-page__merchant-name">{merchant.name}</Text>
              <Text className="scan-pay-page__merchant-cat">{merchant.category}</Text>
            </View>
            <View className="scan-pay-page__amount">
              <Text className="scan-pay-page__amount-symbol">¥</Text>
              <Text className="scan-pay-page__amount-value">{merchant.amount.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* 3. 支付方式选择 */}
        {merchant && (
          <View className="scan-pay-page__methods animate-fade-in">
            <Text className="scan-pay-page__section-title">支付方式</Text>
            {(['balance', 'points', 'coupon'] as PayMethod[]).map((key) => {
              const m = METHOD_META[key]
              const bText =
                key === 'balance'
                  ? `可用余额 ¥${walletBalance.toFixed(2)}`
                  : key === 'points'
                  ? `可用积分 ${pointsBalance}`
                  : usableCoupons > 0
                  ? `${usableCoupons} 张可用`
                  : '暂无可用优惠券'
              const disabled =
                key === 'coupon' && usableCoupons === 0
              return (
                <View
                  key={key}
                  className={`scan-pay-page__method ${payMethod === key ? 'scan-pay-page__method--active' : ''} ${
                    disabled ? 'scan-pay-page__method--disabled' : ''
                  }`}
                  onClick={() => !disabled && setPayMethod(key)}
                >
                  <Text className="scan-pay-page__method-icon">{m.icon}</Text>
                  <View className="scan-pay-page__method-info">
                    <Text className="scan-pay-page__method-label">{m.label}</Text>
                    <Text className="scan-pay-page__method-balance">{bText}</Text>
                  </View>
                  <View
                    className={`scan-pay-page__radio ${payMethod === key ? 'scan-pay-page__radio--on' : ''}`}
                  >
                    {payMethod === key && <Text className="scan-pay-page__radio-dot" />}
                  </View>
                </View>
              )
            })}
            {!canPayNow && (
              <Text className="scan-pay-page__warn">⚠️ {meta.insufficientText}</Text>
            )}
          </View>
        )}

        {/* 4. 支付密码（6 位 * 遮罩，模拟输入） */}
        {merchant && (
          <View className="scan-pay-page__password animate-fade-in">
            <Text className="scan-pay-page__section-title">支付密码</Text>
            <View className="scan-pay-page__dots" onClick={() => setShowKeypad(true)}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <View
                  key={i}
                  className={`scan-pay-page__dot ${password.length > i ? 'scan-pay-page__dot--filled' : ''}`}
                >
                  {password.length > i && <Text className="scan-pay-page__dot-star">●</Text>}
                </View>
              ))}
            </View>
            <Text className="scan-pay-page__password-hint">点击密码框输入 6 位支付密码</Text>
          </View>
        )}

        {/* 5. 确认支付按钮 */}
        {merchant && (
          <View
            className={`scan-pay-page__confirm ${canPayNow && password.length === 6 && !paying ? '' : 'scan-pay-page__confirm--disabled'}`}
            onClick={handleConfirm}
          >
            <Text className="scan-pay-page__confirm-text">
              {paying ? '支付中…' : `确认支付 ¥${amount.toFixed(2)}`}
            </Text>
          </View>
        )}

        {/* 最近扫码记录（复用 store 数据） */}
        {payOrders.length > 0 && (
          <View className="scan-pay-page__history">
            <Text className="scan-pay-page__section-title">最近扫码记录</Text>
            {payOrders.slice(0, 5).map((o) => (
              <View key={o.id} className="scan-pay-page__record">
                <Image className="scan-pay-page__record-avatar" src={o.merchantAvatar} mode="aspectFill" />
                <View className="scan-pay-page__record-info">
                  <Text className="scan-pay-page__record-name">{o.merchantName}</Text>
                  <Text className="scan-pay-page__record-meta">
                    ¥{o.amount.toFixed(2)} · {statusText[o.status] || o.status}
                  </Text>
                </View>
                {o.status === 'pending' && (
                  <View
                    className="scan-pay-page__record-pay"
                    onClick={() => updatePayOrderStatus(o.id, 'paid')}
                  >
                    <Text className="scan-pay-page__record-pay-text">继续支付</Text>
                  </View>
                )}
                {o.status !== 'pending' && (
                  <Text
                    className={`scan-pay-page__record-status scan-pay-page__record-status--${o.status}`}
                  >
                    {statusText[o.status] || o.status}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View className="safe-area-bottom" />
      </ScrollView>

      {/* 4-续. 模拟支付密码键盘 */}
      {showKeypad && (
        <View className="scan-pay-page__keypad-mask" onClick={() => setShowKeypad(false)}>
          <View className="scan-pay-page__keypad" onClick={(e) => e.stopPropagation()}>
            <View className="scan-pay-page__keypad-head">
              <Text className="scan-pay-page__keypad-title">输入支付密码</Text>
              <Text className="scan-pay-page__keypad-close" onClick={() => setShowKeypad(false)}>✕</Text>
            </View>
            <View className="scan-pay-page__keypad-dots">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <View
                  key={i}
                  className={`scan-pay-page__keypad-dot ${password.length > i ? 'scan-pay-page__keypad-dot--filled' : ''}`}
                />
              ))}
            </View>
            <View className="scan-pay-page__keypad-grid">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
                <View key={k} className="scan-pay-page__key" onClick={() => handleKey(k)}>
                  <Text className="scan-pay-page__key-text">{k}</Text>
                </View>
              ))}
              <View className="scan-pay-page__key scan-pay-page__key--empty" />
              <View className="scan-pay-page__key" onClick={() => handleKey('0')}>
                <Text className="scan-pay-page__key-text">0</Text>
              </View>
              <View className="scan-pay-page__key" onClick={() => handleKey('del')}>
                <Text className="scan-pay-page__key-text">⌫</Text>
              </View>
            </View>
            <View className="safe-area-bottom" />
          </View>
        </View>
      )}

      {/* 6. 支付结果（成功✅ / 失败❌ 动画） */}
      {result && (
        <View className="scan-pay-page__result-mask">
          <View className="scan-pay-page__result-card">
            <View
              className={`scan-pay-page__result-icon ${
                result.success ? 'scan-pay-page__result-icon--success' : 'scan-pay-page__result-icon--fail'
              }`}
            >
              <Text className="scan-pay-page__result-emoji">{result.success ? '✅' : '❌'}</Text>
            </View>
            <Text className="scan-pay-page__result-title">
              {result.success ? '支付成功' : '支付失败'}
            </Text>
            <Text className="scan-pay-page__result-message">{result.message}</Text>
            <View className="scan-pay-page__result-btn" onClick={handleReset}>
              <Text className="scan-pay-page__result-btn-text">完成</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
})

ScanPay.displayName = 'ScanPay'
export default ScanPay
;(ScanPay as any).config = { navigationStyle: 'custom' } as any
