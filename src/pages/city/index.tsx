import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const CITIES = ['北京', '上海', '深圳', '广州']

type ContentType = 'article' | 'topic' | 'user'

interface CityContent {
  id: string
  type: ContentType
  title?: string
  content?: string
  nickname?: string
  avatar?: string
  signature?: string
  likes?: number
  comments?: number
  image?: string
}

const MOCK_CONTENTS: CityContent[] = [
  { id: '1', type: 'article', title: '周末去哪玩？探秘城市艺术街区', content: '发现了一个超美的艺术街区，适合拍照打卡...', likes: 128, comments: 32, image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop&q=80' },
  { id: '2', type: 'topic', title: '大家周末都做什么？', content: '分享你的周末生活方式', likes: 256, comments: 89 },
  { id: '3', type: 'user', nickname: '本地达人小明', avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&h=200&fit=crop&q=80', signature: '专注本地生活服务10年' },
  { id: '4', type: 'article', title: '这家隐藏餐厅绝了！', content: '人均50吃得超满足，关键是环境还很好...', likes: 89, comments: 15, image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=400&fit=crop&q=80' },
  { id: '5', type: 'user', nickname: '城市探索者', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&q=80', signature: '用脚步丈量这座城市的每一个角落' },
  { id: '6', type: 'topic', title: '租房避坑指南', content: '分享租房经验，避免踩坑', likes: 167, comments: 45 },
  { id: '7', type: 'article', title: '周末徒步好去处', content: '推荐几条适合周末徒步的路线...', likes: 234, comments: 67, image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=400&h=400&fit=crop&q=80' },
  { id: '8', type: 'user', nickname: '美食侦探', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&q=80', signature: '分享最地道的本地美食' },
]

const City = memo(() => {
  const [selectedCity, setSelectedCity] = useState('北京')
  const [contents] = useState(MOCK_CONTENTS)

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city)
  }, [])

  const handleItemClick = useCallback((item: CityContent) => {
    Taro.showToast({ title: item.title || item.nickname || '详情', icon: 'none' })
  }, [])

  return (
    <View className="page">
      <NavBar title="同城" showBack />
      <ScrollView scrollY className="page__scroll">
        <View className="page__body">
          <View className="city-chips">
            {CITIES.map(city => (
              <View
                key={city}
                className={`city-chip ${selectedCity === city ? 'city-chip--active' : ''}`}
                onClick={() => handleCityChange(city)}
              >
                <Text className="city-chip__text">{city}</Text>
              </View>
            ))}
          </View>

          <View className="city-feed">
            {contents.map(item => (
              <View key={item.id} className="feed-card" onClick={() => handleItemClick(item)}>
                {item.type === 'article' && (
                  <>
                    <View className="feed-card__header">
                      <Text className="feed-card__title">{item.title}</Text>
                    </View>
                    <Text className="feed-card__content">{item.content}</Text>
                    {item.image && <Image className="feed-card__image" src={item.image} mode="aspectFill" />}
                    <View className="feed-card__stats">
                      <Text className="feed-card__stat">👍 {item.likes}</Text>
                      <Text className="feed-card__stat">💬 {item.comments}</Text>
                    </View>
                  </>
                )}
                {item.type === 'topic' && (
                  <>
                    <View className="feed-card__header">
                      <Text className="mp-tag">话题</Text>
                      <Text className="feed-card__title">{item.title}</Text>
                    </View>
                    <Text className="feed-card__content">{item.content}</Text>
                    <View className="feed-card__stats">
                      <Text className="feed-card__stat">👍 {item.likes}</Text>
                      <Text className="feed-card__stat">💬 {item.comments}</Text>
                    </View>
                  </>
                )}
                {item.type === 'user' && (
                  <View className="feed-user">
                    <Image className="feed-user__avatar" src={item.avatar} mode="aspectFill" />
                    <View className="feed-user__info">
                      <Text className="feed-user__name">{item.nickname}</Text>
                      <Text className="feed-user__signature">{item.signature}</Text>
                    </View>
                    <View className="mp-btn mp-btn--ghost mp-btn--sm">
                      <Text className="feed-user__btn-text">关注</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
})

City.config = { navigationStyle: 'custom' } as any
City.displayName = 'City'
export default City
