import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const AREAS = ['不限', '福田区', '南山區', '寶安區', '羅湖區', '龍崗區', '龍華區']
const PRICE_RANGES = ['不限', '200萬以下', '200-500萬', '500-800萬', '800-1200萬', '1200萬以上']
const ROOM_TYPES = ['不限', '一室', '兩室', '三室', '四室', '五室以上']
const AREA_SIZES = ['不限', '50㎡以下', '50-90㎡', '90-130㎡', '130-180㎡', '180㎡以上']

const mockListings = [
  { id: '1', community: '華潤城潤璽', address: '南山·科技園', area: 120, price: 1850, unitPrice: 154167, cover: 'https://picsum.photos/seed/est1/400/250', rooms: '3室2廳' },
  { id: '2', community: '深圳灣壹號', address: '南山·深圳灣', area: 230, price: 4200, unitPrice: 182609, cover: 'https://picsum.photos/seed/est2/400/250', rooms: '4室2廳' },
  { id: '3', community: '香蜜湖壹號', address: '福田·香蜜湖', area: 89, price: 920, unitPrice: 103371, cover: 'https://picsum.photos/seed/est3/400/250', rooms: '2室2廳' },
  { id: '4', community: '前海時代廣場', address: '南山·前海', area: 75, price: 780, unitPrice: 104000, cover: 'https://picsum.photos/seed/est4/400/250', rooms: '2室1廳' },
  { id: '5', community: '龍華金茂府', address: '龍華·紅山', area: 155, price: 1380, unitPrice: 89032, cover: 'https://picsum.photos/seed/est5/400/250', rooms: '3室2廳' },
]

const EstateInfo = memo(() => {
  const [activeArea, setActiveArea] = useState('不限')
  const [activePrice, setActivePrice] = useState('不限')
  const [activeRooms, setActiveRooms] = useState('不限')
  const [activeSize, setActiveSize] = useState('不限')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const toggleFavorite = (id: string, e: any) => {
    e.stopPropagation()
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        Taro.showToast({ title: '已取消收藏', icon: 'none' })
      } else {
        next.add(id)
        Taro.showToast({ title: '已收藏', icon: 'success' })
      }
      return next
    })
  }

  const handlePublish = () => {
    Taro.showToast({ title: '发布房源', icon: 'none' })
  }

  return (
    <View className="page">
      <NavBar title="房產信息" showBack rightText="发布" onRightClick={handlePublish} />

      <View className="filter-bar">
        {/* 区域 */}
        <View className="filter-group">
          <Text className="filter-label">區域</Text>
          <ScrollView scrollX enableFlex className="filter-chips">
            {AREAS.map(a => (
              <View
                key={a}
                className={`filter-chip ${activeArea === a ? 'filter-chip--active' : ''}`}
                onClick={() => setActiveArea(a)}
              >
                <Text className="filter-chip__text">{a}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* 价格 */}
        <View className="filter-group">
          <Text className="filter-label">價格</Text>
          <ScrollView scrollX enableFlex className="filter-chips">
            {PRICE_RANGES.map(p => (
              <View
                key={p}
                className={`filter-chip ${activePrice === p ? 'filter-chip--active' : ''}`}
                onClick={() => setActivePrice(p)}
              >
                <Text className="filter-chip__text">{p}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* 户型 */}
        <View className="filter-group">
          <Text className="filter-label">戶型</Text>
          <ScrollView scrollX enableFlex className="filter-chips">
            {ROOM_TYPES.map(r => (
              <View
                key={r}
                className={`filter-chip ${activeRooms === r ? 'filter-chip--active' : ''}`}
                onClick={() => setActiveRooms(r)}
              >
                <Text className="filter-chip__text">{r}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        {/* 面积 */}
        <View className="filter-group">
          <Text className="filter-label">面積</Text>
          <ScrollView scrollX enableFlex className="filter-chips">
            {AREA_SIZES.map(s => (
              <View
                key={s}
                className={`filter-chip ${activeSize === s ? 'filter-chip--active' : ''}`}
                onClick={() => setActiveSize(s)}
              >
                <Text className="filter-chip__text">{s}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView scrollY className="page__content">
        {/* 房源列表 */}
        <View className="listing-list">
          {mockListings.map(item => (
            <View key={item.id} className="listing-card">
              <View className="listing-card__cover-wrap">
                <Image className="listing-card__cover" src={item.cover} mode="aspectFill" />
                <View
                  className={`listing-card__fav ${favorites.has(item.id) ? 'listing-card__fav--active' : ''}`}
                  onClick={(e) => toggleFavorite(item.id, e)}
                >
                  <Text className="listing-card__fav-icon">{favorites.has(item.id) ? '❤️' : '🤍'}</Text>
                </View>
              </View>
              <View className="listing-card__info">
                <Text className="listing-card__community">{item.community}</Text>
                <Text className="listing-card__address">📍 {item.address} · {item.rooms} · {item.area}㎡</Text>
                <View className="listing-card__price-row">
                  <Text className="listing-card__price">{item.price}<Text className="listing-card__price-unit">萬</Text></Text>
                  <Text className="listing-card__unit-price">{item.unitPrice.toLocaleString()}元/㎡</Text>
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

EstateInfo.config = { navigationStyle: 'custom' } as any
EstateInfo.displayName = 'EstateInfo'
export default EstateInfo
