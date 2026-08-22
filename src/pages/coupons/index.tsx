import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const Coupons = memo(() => {
  const { coupons, useCoupon } = useAppStore()

  const handleUse = useCallback((id: string) => {
    useCoupon(id)
    Taro.showToast({ title: '已使用', icon: 'success' })
  }, [useCoupon])

  return (
    <View className="coupons-page">
      <NavBar title="我的优惠券" showBack />
      <ScrollView scrollY className="coupons-page__body">
        {coupons.length === 0 && (
          <View className="coupons-page__empty">
            <Text className="coupons-page__empty-icon">🎫</Text>
            <Text className="coupons-page__empty-text">暂无优惠券</Text>
          </View>
        )}
        {coupons.map((c) => (
          <View key={c.id} className={`coupon-card ${c.used ? 'coupon-card--used' : ''}`}>
            <View className="coupon-card__left">
              <Text className="coupon-card__value">¥{c.value}</Text>
              <Text className="coupon-card__threshold">{c.threshold > 0 ? `满 ${c.threshold} 可用` : '无门槛'}</Text>
            </View>
            <View className="coupon-card__right">
              <Text className="coupon-card__name">{c.name}</Text>
              <Text className="coupon-card__expire">有效期至 {new Date(c.expiredAt).toLocaleDateString('zh-CN')}</Text>
              <View
                className={`coupon-card__btn ${c.used ? 'coupon-card__btn--used' : ''}`}
                onClick={() => !c.used && handleUse(c.id)}
              >
                <Text className="coupon-card__btn-text">{c.used ? '已使用' : '立即使用'}</Text>
              </View>
            </View>
          </View>
        ))}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Coupons.config = { navigationStyle: 'custom' } as any
Coupons.displayName = 'Coupons'
export default Coupons
