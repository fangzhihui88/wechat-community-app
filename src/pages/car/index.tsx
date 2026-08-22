import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const CAR_TYPES = ['轿车', 'SUV', '跑车', '电动车', '摩托']

const mockCars = [
  { id: '1', brand: '宝马', model: 'BMW 3系', type: '轿车', ownerAvatar: 'https://picsum.photos/seed/car1/200/200', location: '深圳·南山', cover: 'https://picsum.photos/seed/ccar1/400/250' },
  { id: '2', brand: '特斯拉', model: 'Model Y', type: 'SUV', ownerAvatar: 'https://picsum.photos/seed/car2/200/200', location: '广州·天河', cover: 'https://picsum.photos/seed/ccar2/400/250' },
  { id: '3', brand: '保时捷', model: '911 Carrera', type: '跑车', ownerAvatar: 'https://picsum.photos/seed/car3/200/200', location: '上海·浦东', cover: 'https://picsum.photos/seed/ccar3/400/250' },
  { id: '4', brand: '小牛', model: 'UQi+', type: '电动车', ownerAvatar: 'https://picsum.photos/seed/car4/200/200', location: '成都·武侯', cover: 'https://picsum.photos/seed/ccar4/400/250' },
  { id: '5', brand: '本田', model: 'CBR650R', type: '摩托', ownerAvatar: 'https://picsum.photos/seed/car5/200/200', location: '杭州·西湖', cover: 'https://picsum.photos/seed/ccar5/400/250' },
  { id: '6', brand: '奔驰', model: 'C-Class', type: '轿车', ownerAvatar: 'https://picsum.photos/seed/car6/200/200', location: '北京·朝阳', cover: 'https://picsum.photos/seed/ccar6/400/250' },
]

const mockCases = [
  { id: 'c1', title: '宝马M4碳纤维改装', cover: 'https://picsum.photos/seed/mod1/300/200', author: '玩车老王' },
  { id: 'c2', title: '特斯拉Model3氛围灯升级', cover: 'https://picsum.photos/seed/mod2/300/200', author: '电车玩家' },
  { id: 'c3', title: '保时捷992排气声浪改装', cover: 'https://picsum.photos/seed/mod3/300/200', author: '赛道达人' },
  { id: 'c4', title: '本田思域Si动力升级', cover: 'https://picsum.photos/seed/mod4/300/200', author: '性能车迷' },
]

const CarCircle = memo(() => {
  const [activeType, setActiveType] = useState('轿车')

  const filteredCars = activeType === '全部'
    ? mockCars
    : mockCars.filter(c => c.type === activeType)

  const handleEval = () => {
    Taro.showToast({ title: '估值工具开发中', icon: 'none' })
  }

  return (
    <View className="page">
      <NavBar title="车友圈" showBack />

      <ScrollView scrollY className="page__content">
        {/* 车型分类 Tabs */}
        <View className="type-tabs">
          <ScrollView scrollX enableFlex className="type-tabs__scroll">
            {['全部', ...CAR_TYPES].map(t => (
              <View
                key={t}
                className={`type-tab ${activeType === t ? 'type-tab--active' : ''}`}
                onClick={() => setActiveType(t)}
              >
                <Text className="type-tab__text">{t}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 车辆展示卡片 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">🚗 车辆展示</Text>
            <Text className="section__more">更多 ›</Text>
          </View>
          <View className="car-grid">
            {filteredCars.map(car => (
              <View key={car.id} className="car-card">
                <Image className="car-card__cover" src={car.cover} mode="aspectFill" />
                <View className="car-card__body">
                  <Text className="car-card__name">{car.brand} {car.model}</Text>
                  <View className="car-card__meta">
                    <Image className="car-card__owner-avatar" src={car.ownerAvatar} mode="aspectFill" />
                    <Text className="car-card__location">📍 {car.location}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 热门改装案例 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">🔧 热门改装案例</Text>
            <Text className="section__more">全部 ›</Text>
          </View>
          <ScrollView scrollX enableFlex className="case-scroll">
            {mockCases.map(c => (
              <View key={c.id} className="case-card">
                <Image className="case-card__cover" src={c.cover} mode="aspectFill" />
                <View className="case-card__info">
                  <Text className="case-card__title">{c.title}</Text>
                  <Text className="case-card__author">@{c.author}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 车辆估值工具入口 */}
        <View className="section">
          <View className="eval-banner" onClick={handleEval}>
            <View className="eval-banner__icon">📊</View>
            <View className="eval-banner__text">
              <Text className="eval-banner__title">车辆估值工具</Text>
              <Text className="eval-banner__sub">快速查询爱车当前市场价值</Text>
            </View>
            <View className="eval-banner__btn">
              <Text className="eval-banner__btn-text">去估值</Text>
            </View>
          </View>
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

CarCircle.config = { navigationStyle: 'custom' } as any
CarCircle.displayName = 'CarCircle'
export default CarCircle
