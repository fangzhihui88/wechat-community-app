import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const plans = [
  { id: 'month', name: '月度会员', price: 18, original: 30, desc: '尊享 VIP 标识 + 专属表情', tag: '热销' },
  { id: 'quarter', name: '季度会员', price: 45, original: 90, desc: 'VIP 标识 + 专属表情 + 去广告', tag: '超值' },
  { id: 'year', name: '年度会员', price: 128, original: 360, desc: '全部特权 + 专属客服 + 限量徽章', tag: '最划算' },
]

const Vip = memo(() => {
  const { currentUser } = useAppStore()

  const handleBuy = useCallback((plan: (typeof plans)[0]) => {
    Taro.showModal({
      title: '确认开通',
      content: `开通${plan.name}（¥${plan.price}）？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '开通成功，欢迎加入 VIP！', icon: 'success' })
        }
      },
    })
  }, [])

  const benefits = [
    { icon: '👑', label: '专属 VIP 标识', desc: '头像旁金色标识' },
    { icon: '💬', label: '专属表情包', desc: 'VIP 专属互动表情' },
    { icon: '🚫', label: '去广告', desc: '清爽浏览体验' },
    { icon: '🎁', label: '会员礼包', desc: '每月积分 + 优惠券' },
    { icon: '🎨', label: '个性主题', desc: 'VIP 专属皮肤' },
    { icon: '💬', label: '优先客服', desc: '问题优先处理' },
  ]

  return (
    <View className="vip-page">
      <NavBar title="VIP 会员" showBack />
      <View className="vip-page__body">
        <View className="vip-page__hero">
          <Text className="vip-page__hero-crown">👑</Text>
          <Text className="vip-page__hero-title">{currentUser?.isVip ? '尊贵的 VIP 会员' : '开通 VIP 会员'}</Text>
          <Text className="vip-page__hero-desc">{currentUser?.isVip ? '享受全部专属特权' : '解锁专属特权，尊享极致体验'}</Text>
        </View>

        <View className="vip-page__plans">
          {plans.map((p) => (
            <View key={p.id} className="vip-page__plan" onClick={() => handleBuy(p)}>
              {p.tag && <View className="vip-page__plan-tag"><Text className="vip-page__plan-tag-text">{p.tag}</Text></View>}
              <Text className="vip-page__plan-name">{p.name}</Text>
              <View className="vip-page__plan-price-row">
                <Text className="vip-page__plan-currency">¥</Text>
                <Text className="vip-page__plan-price">{p.price}</Text>
                <Text className="vip-page__plan-original">¥{p.original}</Text>
              </View>
              <Text className="vip-page__plan-desc">{p.desc}</Text>
            </View>
          ))}
        </View>

        <View className="vip-page__benefits">
          <Text className="vip-page__benefits-title">会员权益</Text>
          <View className="vip-page__benefits-grid">
            {benefits.map((b) => (
              <View key={b.label} className="vip-page__benefit">
                <Text className="vip-page__benefit-icon">{b.icon}</Text>
                <Text className="vip-page__benefit-label">{b.label}</Text>
                <Text className="vip-page__benefit-desc">{b.desc}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="safe-area-bottom" />
      </View>
    </View>
  )
})

Vip.config = { navigationStyle: 'custom' } as any
Vip.displayName = 'Vip'
export default Vip
