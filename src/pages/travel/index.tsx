import { View, Text, ScrollView, Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

// --- Mock Data ---
const mockDestinations = [
  { id: 1, name: '丽江古城', desc: '小桥流水，邂逅慢时光', cover: 'https://picsum.photos/seed/travel1/750/400' },
  { id: 2, name: '厦门鼓浪屿', desc: '海上花园，万国建筑博览', cover: 'https://picsum.photos/seed/travel2/750/400' },
  { id: 3, name: '成都大熊猫基地', desc: '与国宝来一场萌趣约会', cover: 'https://picsum.photos/seed/travel3/750/400' },
]

const mockArticles = [
  { id: 1, title: '三天两夜玩转厦门，精华路线全攻略', location: '厦门', reads: 12580, cover: 'https://picsum.photos/seed/article1/300/200' },
  { id: 2, title: '成都本地人带你吃遍宽窄巷子', location: '成都', reads: 8932, cover: 'https://picsum.photos/seed/article2/300/200' },
  { id: 3, title: '杭州西湖周边隐藏玩法大公开', location: '杭州', reads: 6421, cover: 'https://picsum.photos/seed/article3/300/200' },
  { id: 4, title: '上海网红打卡地不完全指南', location: '上海', reads: 21034, cover: 'https://picsum.photos/seed/article4/300/200' },
  { id: 5, title: '北京胡同漫游：寻找老北京的记忆', location: '北京', reads: 7650, cover: 'https://picsum.photos/seed/article5/300/200' },
]

const cities = ['上海', '北京', '成都', '杭州', '厦门']

// --- Component ---
const TravelPage = memo(() => {
  const [selectedCity, setSelectedCity] = useState('上海')

  const handleCityChange = useCallback((city: string) => {
    setSelectedCity(city)
    Taro.showToast({ title: `切换至${city}`, icon: 'none' })
  }, [])

  const handlePublish = useCallback(() => {
    Taro.showToast({ title: '发布攻略', icon: 'none' })
  }, [])

  return (
    <View className="page travel-page">
      <NavBar title="旅游攻略" showBack />

      <ScrollView scrollY className="travel-page__body">
        {/* 热门目的地轮播 */}
        <View className="travel-page__banner">
          <Swiper
            className="travel-page__swiper"
            indicatorDots
            autoplay
            interval={3000}
            circular
            indicatorColor="rgba(255,255,255,0.5)"
            indicatorActiveColor="#FF4757"
          >
            {mockDestinations.map((dest) => (
              <SwiperItem key={dest.id} className="travel-page__swiper-item">
                <Image
                  className="travel-page__banner-img"
                  src={dest.cover}
                  mode="aspectFill"
                />
                <View className="travel-page__banner-overlay">
                  <Text className="travel-page__banner-title">{dest.name}</Text>
                  <Text className="travel-page__banner-desc">{dest.desc}</Text>
                </View>
              </SwiperItem>
            ))}
          </Swiper>
        </View>

        {/* 城市选择 */}
        <View className="travel-page__city-section">
          <View className="travel-page__city-picker">
            <Text className="travel-page__city-label">当前城市</Text>
            <ScrollView scrollX className="travel-page__city-scroll">
              <View className="travel-page__city-tabs">
                {cities.map((city) => (
                  <View
                    key={city}
                    className={`travel-page__city-tab ${selectedCity === city ? 'travel-page__city-tab--active' : ''}`}
                    onClick={() => handleCityChange(city)}
                  >
                    <Text className="travel-page__city-tab-text">{city}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* 攻略文章列表 */}
        <View className="travel-page__articles">
          <Text className="travel-page__articles-title">精选攻略</Text>
          {mockArticles.map((article) => (
            <View key={article.id} className="travel-page__article-card">
              <Image
                className="travel-page__article-cover"
                src={article.cover}
                mode="aspectFill"
              />
              <View className="travel-page__article-info">
                <Text className="travel-page__article-title">{article.title}</Text>
                <View className="travel-page__article-meta">
                  <Text className="travel-page__article-location">📍 {article.location}</Text>
                  <Text className="travel-page__article-reads">👁 {article.reads.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 发布入口 */}
        <View className="travel-page__publish-banner" onClick={handlePublish}>
          <Text className="travel-page__publish-banner-icon">✏️</Text>
          <View>
            <Text className="travel-page__publish-banner-title">分享你的旅行</Text>
            <Text className="travel-page__publish-banner-desc">发布攻略赢积分奖励</Text>
          </View>
          <Text className="travel-page__publish-banner-arrow">›</Text>
        </View>

        <View className="travel-page__safe-bottom" />
      </ScrollView>
    </View>
  )
})

TravelPage.config = { navigationStyle: 'custom' } as any
TravelPage.displayName = 'TravelPage'
export default TravelPage
