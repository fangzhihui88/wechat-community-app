import { memo, useState, useCallback } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

interface NewsItem {
  id: number
  title: string
  source: string
  time: string
  comments: number
  cover: string
}

const categories = ['推荐', '科技', '财经', '社会', '体育']

const mockNews: NewsItem[] = [
  { id: 1, title: 'AI大模型迎来新突破，多模态能力大幅提升', source: '科技日报', time: '2小时前', comments: 234, cover: 'https://picsum.photos/200/200?random=31' },
  { id: 2, title: '新能源汽车销量创新高，电动化转型加速', source: '财经周刊', time: '3小时前', comments: 156, cover: 'https://picsum.photos/200/200?random=32' },
  { id: 3, title: '城市绿地建设成效显著，居民幸福感提升', source: '都市报', time: '4小时前', comments: 89, cover: 'https://picsum.photos/200/200?random=33' },
  { id: 4, title: '中国航天再创佳绩，探月工程新进展', source: '新华社', time: '5小时前', comments: 567, cover: 'https://picsum.photos/200/200?random=34' },
  { id: 5, title: '全国游泳锦标赛落幕，多项纪录被打破', source: '体育频道', time: '6小时前', comments: 321, cover: 'https://picsum.photos/200/200?random=35' },
  { id: 6, title: '数字人民币试点扩大，应用场景更加丰富', source: '金融时报', time: '7小时前', comments: 198, cover: 'https://picsum.photos/200/200?random=36' },
]

const NewsList = memo(() => {
  const [activeCategory, setActiveCategory] = useState(0)

  const handleNewsClick = useCallback((id: number) => {
    Taro.navigateTo({ url: `/pages/news-detail/index?id=${id}` })
  }, [])

  return (
    <View className="page">
      <NavBar title="资讯" showBack />
      <ScrollView scrollY className="page__body">
        <View className="news-categories">
          {categories.map((cat, index) => (
            <View
              key={cat}
              className={`news-categories__item ${activeCategory === index ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(index)}
            >
              {cat}
            </View>
          ))}
        </View>

        <View className="news-list">
          {mockNews.map((news) => (
            <View key={news.id} className="news-item" onClick={() => handleNewsClick(news.id)}>
              <View className="news-item__content">
                <Text className="news-item__title">{news.title}</Text>
                <View className="news-item__meta">
                  <Text className="news-item__source">{news.source}</Text>
                  <Text className="news-item__time">{news.time}</Text>
                  <Text className="news-item__comments">{news.comments}评论</Text>
                </View>
              </View>
              <Image src={news.cover} className="news-item__cover" mode="aspectFill" />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
})

NewsList.displayName = 'NewsList'
NewsList.config = { navigationStyle: 'custom' } as any

export default NewsList
