import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

interface Photographer {
  id: number
  name: string
  avatar: string
  style: string
  worksCount: number
}

interface Photo {
  id: number
  url: string
  photographer: string
  likes: number
  category: string
  height?: number
}

const TABS = ['全部', '人像', '风景', '纪实', '建筑', '夜景']

const mockPhotographers: Photographer[] = [
  { id: 1, name: '光影猎人', avatar: 'https://picsum.photos/seed/photoer1/200/200', style: '人像 · 纪实', worksCount: 128 },
  { id: 2, name: '山川湖海', avatar: 'https://picsum.photos/seed/photoer2/200/200', style: '风景 · 自然', worksCount: 256 },
  { id: 3, name: '城市记号', avatar: 'https://picsum.photos/seed/photoer3/200/200', style: '建筑 · 夜景', worksCount: 94 },
  { id: 4, name: '黑白诗人', avatar: 'https://picsum.photos/seed/photoer4/200/200', style: '黑白 · 人文', worksCount: 183 },
]

const mockPhotos: Photo[] = [
  { id: 1, url: 'https://picsum.photos/seed/photo1/400/500', photographer: '光影猎人', likes: 328, category: '人像', height: 500 },
  { id: 2, url: 'https://picsum.photos/seed/photo2/400/300', photographer: '山川湖海', likes: 512, category: '风景', height: 300 },
  { id: 3, url: 'https://picsum.photos/seed/photo3/400/450', photographer: '城市记号', likes: 204, category: '建筑', height: 450 },
  { id: 4, url: 'https://picsum.photos/seed/photo4/400/400', photographer: '光影猎人', likes: 445, category: '人像', height: 400 },
  { id: 5, url: 'https://picsum.photos/seed/photo5/400/350', photographer: '黑白诗人', likes: 167, category: '纪实', height: 350 },
  { id: 6, url: 'https://picsum.photos/seed/photo6/400/480', photographer: '山川湖海', likes: 389, category: '风景', height: 480 },
  { id: 7, url: 'https://picsum.photos/seed/photo7/400/320', photographer: '城市记号', likes: 293, category: '夜景', height: 320 },
  { id: 8, url: 'https://picsum.photos/seed/photo8/400/420', photographer: '黑白诗人', likes: 521, category: '纪实', height: 420 },
  { id: 9, url: 'https://picsum.photos/seed/photo9/400/380', photographer: '光影猎人', likes: 178, category: '人像', height: 380 },
  { id: 10, url: 'https://picsum.photos/seed/photo10/400/460', photographer: '山川湖海', likes: 634, category: '风景', height: 460 },
  { id: 11, url: 'https://picsum.photos/seed/photo11/400/300', photographer: '城市记号', likes: 412, category: '建筑', height: 300 },
  { id: 12, url: 'https://picsum.photos/seed/photo12/400/520', photographer: '光影猎人', likes: 287, category: '夜景', height: 520 },
]

const Photo = memo(() => {
  const [activeTab, setActiveTab] = useState('全部')
  const [liked, setLiked] = useState<Record<number, boolean>>({})
  const [collected, setCollected] = useState<Record<number, boolean>>({})
  const [photographers] = useState<Photographer[]>(mockPhotographers)
  const [photos] = useState<Photo[]>(mockPhotos)

  const filteredPhotos = activeTab === '全部'
    ? photos
    : photos.filter(p => p.category === activeTab)

  const toggleLike = (id: number, e: any) => {
    e.stopPropagation?.()
    setLiked(prev => ({ ...prev, [id]: !prev[id] }))
    const msg = liked[id] ? '取消点赞' : '点赞 +1'
    Taro.showToast({ title: msg, icon: 'none' })
  }

  const toggleCollect = (id: number, e: any) => {
    e.stopPropagation?.()
    setCollected(prev => ({ ...prev, [id]: !prev[id] }))
    const msg = collected[id] ? '取消收藏' : '已收藏'
    Taro.showToast({ title: msg, icon: 'none' })
  }

  const handleComment = (e: any) => {
    e.stopPropagation?.()
    Taro.showToast({ title: '评论功能', icon: 'none' })
  }

  const handlePreview = (url: string) => {
    Taro.previewImage({ current: url, urls: photos.map(p => p.url) })
  }

  return (
    <View className="page">
      <NavBar title="摄影天地" showBack />
      <ScrollView scrollY className="photo-body">

        {/* 摄影师推荐 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">推荐摄影师</Text>
            <Text className="section__more">更多 ›</Text>
          </View>
          <ScrollView scrollX className="photographer-scroll">
            <View className="photographer-list">
              {photographers.map(p => (
                <View
                  key={p.id}
                  className="photographer-card"
                  onClick={() => Taro.showToast({ title: p.name, icon: 'none' })}
                >
                  <Image className="photographer-card__avatar" src={p.avatar} mode="aspectFill" />
                  <Text className="photographer-card__name">{p.name}</Text>
                  <Text className="photographer-card__style">{p.style}</Text>
                  <Text className="photographer-card__count">{p.worksCount} 作品</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 分类 Tabs */}
        <View className="section">
          <View className="tab-bar">
            {TABS.map(tab => (
              <View
                key={tab}
                className={`tab-item ${activeTab === tab ? 'tab-item--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <Text className={`tab-item__text ${activeTab === tab ? 'tab-item__text--active' : ''}`}>
                  {tab}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 瀑布流作品 */}
        <View className="section">
          <View className="waterfall">
            {filteredPhotos.map((photo, idx) => (
              <View
                key={photo.id}
                className={`waterfall__item ${idx % 2 === 0 ? 'waterfall__item--left' : 'waterfall__item--right'}`}
                onClick={() => handlePreview(photo.url)}
              >
                <View
                  className="waterfall__img-wrap"
                  style={{ paddingTop: `${(photo.height || 400) / 400 * 100}%` }}
                >
                  <Image
                    className="waterfall__img"
                    src={photo.url}
                    mode="aspectFill"
                    lazyLoad
                  />
                </View>
                <View className="waterfall__info">
                  <View className="waterfall__author">
                    <Image className="waterfall__author-avatar" src={mockPhotographers.find(p => p.name === photo.photographer)?.avatar || ''} mode="aspectFill" />
                    <Text className="waterfall__author-name">{photo.photographer}</Text>
                  </View>
                  <View className="waterfall__actions">
                    <View className="action-btn" onClick={(e) => toggleLike(photo.id, e)}>
                      <Text className={`action-btn__icon ${liked[photo.id] ? 'action-btn__icon--liked' : ''}`}>
                        {liked[photo.id] ? '❤️' : '🤍'}
                      </Text>
                      <Text className="action-btn__count">{photo.likes + (liked[photo.id] ? 1 : 0)}</Text>
                    </View>
                    <View className="action-btn" onClick={(e) => toggleCollect(photo.id, e)}>
                      <Text className={`action-btn__icon ${collected[photo.id] ? 'action-btn__icon--liked' : ''}`}>
                        {collected[photo.id] ? '⭐' : '☆'}
                      </Text>
                      <Text className="action-btn__count">收藏</Text>
                    </View>
                    <View className="action-btn" onClick={(e) => handleComment(e)}>
                      <Text className="action-btn__icon">💬</Text>
                      <Text className="action-btn__count">评论</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Photo.config = { navigationStyle: 'custom' } as any
Photo.displayName = 'Photo'
export default Photo
