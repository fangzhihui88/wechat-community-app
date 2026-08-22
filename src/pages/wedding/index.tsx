import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const CATEGORIES = ['摄影', '化妆', '场地', '礼服', '策划']

const mockVendors = [
  { id: '1', name: '光影纪婚纱摄影', category: '摄影', cover: 'https://picsum.photos/seed/wed1/400/300', rating: 4.9, priceRange: '6888-12888', location: '南山區' },
  { id: '2', name: '薇拉高端婚礼跟妆', category: '化妆', cover: 'https://picsum.photos/seed/wed2/400/300', rating: 4.8, priceRange: '2000-5000', location: '福田區' },
  { id: '3', name: '瑞吉酒店婚宴厅', category: '场地', cover: 'https://picsum.photos/seed/wed3/400/300', rating: 4.9, priceRange: '3萬起', location: '福田區' },
  { id: '4', name: 'GRACE婚紗館', category: '礼服', cover: 'https://picsum.photos/seed/wed4/400/300', rating: 4.7, priceRange: '3000-8000', location: '羅湖區' },
  { id: '5', name: '幸福典藏婚慶策劃', category: '策划', cover: 'https://picsum.photos/seed/wed5/400/300', rating: 4.8, priceRange: '1.5萬起', location: '南山區' },
  { id: '6', name: 'VeraWang深圳店', category: '礼服', cover: 'https://picsum.photos/seed/wed6/400/300', rating: 5.0, priceRange: '5萬起', location: '南山區' },
]

const mockInspirations = [
  { id: 'i1', cover: 'https://picsum.photos/seed/wins1/300/400' },
  { id: 'i2', cover: 'https://picsum.photos/seed/wins2/300/400' },
  { id: 'i3', cover: 'https://picsum.photos/seed/wins3/300/400' },
  { id: 'i4', cover: 'https://picsum.photos/seed/wins4/300/400' },
  { id: 'i5', cover: 'https://picsum.photos/seed/wins5/300/400' },
  { id: 'i6', cover: 'https://picsum.photos/seed/wins6/300/400' },
]

const STEPS = [
  { label: '場地', done: true },
  { label: '攝影', done: true },
  { label: '化妝', done: false },
  { label: '禮服', done: false },
  { label: '策劃', done: false },
]

const WeddingServices = memo(() => {
  const [activeCategory, setActiveCategory] = useState('摄影')

  const filteredVendors = activeCategory === '全部'
    ? mockVendors
    : mockVendors.filter(v => v.category === activeCategory)

  const handleReserve = (name: string, e: any) => {
    e.stopPropagation()
    Taro.showToast({ title: `预约 ${name}`, icon: 'none' })
  }

  return (
    <View className="page">
      <NavBar title="婚慶服務" showBack />

      <ScrollView scrollY className="page__content">
        {/* 婚庆服务分类 */}
        <View className="cat-tabs">
          <ScrollView scrollX enableFlex className="cat-tabs__scroll">
            {['全部', ...CATEGORIES].map(c => (
              <View
                key={c}
                className={`cat-tab ${activeCategory === c ? 'cat-tab--active' : ''}`}
                onClick={() => setActiveCategory(c)}
              >
                <Text className="cat-tab__emoji">
                  {c === '摄影' ? '📷' : c === '化妆' ? '💄' : c === '场地' ? '🏛' : c === '礼服' ? '👗' : '🎀'}
                </Text>
                <Text className="cat-tab__text">{c}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 服务商卡片 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">💒 優質服務商</Text>
          </View>
          <View className="vendor-list">
            {filteredVendors.map(vendor => (
              <View key={vendor.id} className="vendor-card">
                <Image className="vendor-card__cover" src={vendor.cover} mode="aspectFill" />
                <View className="vendor-card__body">
                  <Text className="vendor-card__name">{vendor.name}</Text>
                  <View className="vendor-card__meta">
                    <View className="vendor-card__rating">
                      <Text className="vendor-card__stars">{'★'.repeat(Math.floor(vendor.rating))}</Text>
                      <Text className="vendor-card__rating-text">{vendor.rating}</Text>
                    </View>
                    <Text className="vendor-card__location">📍 {vendor.location}</Text>
                  </View>
                  <View className="vendor-card__bottom">
                    <Text className="vendor-card__price">{vendor.priceRange}</Text>
                    <View
                      className="vendor-card__btn"
                      onClick={(e) => handleReserve(vendor.name, e)}
                    >
                      <Text className="vendor-card__btn-text">預約</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 婚礼灵感集 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">💍 婚紗照靈感集</Text>
            <Text className="section__more">更多 ›</Text>
          </View>
          <View className="inspiration-grid">
            {mockInspirations.map(img => (
              <View key={img.id} className="inspiration-item">
                <Image className="inspiration-item__img" src={img.cover} mode="aspectFill" />
              </View>
            ))}
          </View>
        </View>

        {/* 我的婚礼筹备进度 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">📋 我的婚禮籌備進度</Text>
          </View>
          <View className="progress-bar">
            {STEPS.map((step, i) => (
              <View key={step.label} className="progress-step">
                <View className={`progress-step__dot ${step.done ? 'progress-step__dot--done' : ''}`}>
                  <Text className="progress-step__icon">{step.done ? '✓' : `${i + 1}`}</Text>
                </View>
                <Text className={`progress-step__label ${step.done ? 'progress-step__label--done' : ''}`}>
                  {step.label}
                </Text>
                {i < STEPS.length - 1 && (
                  <View className={`progress-step__line ${step.done ? 'progress-step__line--done' : ''}`} />
                )}
              </View>
            ))}
          </View>
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

WeddingServices.config = { navigationStyle: 'custom' } as any
WeddingServices.displayName = 'WeddingServices'
export default WeddingServices
