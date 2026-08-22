import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const Mall = memo(() => {
  const { mallProducts, pointsBalance, exchangeProduct } = useAppStore()

  const handleExchange = useCallback((id: string) => {
    const product = mallProducts.find((p) => p.id === id)
    if (!product) return
    if (product.exchanged) {
      Taro.showToast({ title: '已兑换过啦', icon: 'none' })
      return
    }
    if (pointsBalance < product.points) {
      Taro.showToast({ title: '积分不足', icon: 'none' })
      return
    }
    Taro.showModal({
      title: '确认兑换',
      content: `使用 ${product.points} 积分兑换「${product.name}」？`,
      success: (res) => {
        if (res.confirm) {
          exchangeProduct(id)
          Taro.showToast({ title: '兑换成功', icon: 'success' })
        }
      },
    })
  }, [mallProducts, pointsBalance, exchangeProduct])

  return (
    <View className="mall-page">
      <NavBar title="积分商城" showBack />
      <ScrollView scrollY className="mall-page__body">
        <View className="mall-page__points">
          <Text className="mall-page__points-label">我的积分</Text>
          <Text className="mall-page__points-num">{pointsBalance.toLocaleString()}</Text>
        </View>

        <View className="mall-page__grid">
          {mallProducts.map((p) => (
            <View key={p.id} className="mall-page__product">
              <Image className="mall-page__product-img" src={p.image} mode="aspectFill" lazyLoad />
              <View className="mall-page__product-info">
                <Text className="mall-page__product-name">{p.name}</Text>
                <Text className="mall-page__product-stock">剩余 {p.stock} 件</Text>
                <View className="mall-page__product-footer">
                  <Text className="mall-page__product-points">{p.points} 积分</Text>
                  <View className="mall-page__product-btn" onClick={() => handleExchange(p.id)}>
                    <Text className="mall-page__product-btn-text">{p.exchanged ? '已兑换' : '兑换'}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Mall.config = { navigationStyle: 'custom' } as any
Mall.displayName = 'Mall'
export default Mall
