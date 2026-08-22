import { memo, useState, useCallback } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

interface VideoItem {
  id: number
  title: string
  author: string
  likes: number
  cover: string
}

const mockVideos: VideoItem[] = [
  { id: 1, title: '揭秘：如何用AI写出爆款文案', author: '运营小王子', likes: 12453, cover: 'https://picsum.photos/400/700?random=1' },
  { id: 2, title: '周末露营装备清单大公开', author: '户外探险家', likes: 8921, cover: 'https://picsum.photos/400/700?random=2' },
  { id: 3, title: '3分钟学会拿铁拉花', author: '咖啡师小李', likes: 6732, cover: 'https://picsum.photos/400/700?random=3' },
  { id: 4, title: '城市夜景航拍技巧分享', author: '无人机玩家', likes: 15678, cover: 'https://picsum.photos/400/700?random=4' },
  { id: 5, title: '独居女生的100个生活小妙招', author: '生活美学家', likes: 23456, cover: 'https://picsum.photos/400/700?random=5' },
  { id: 6, title: '健身餐怎么做才好吃又低卡', author: '健身达人阿杰', likes: 9876, cover: 'https://picsum.photos/400/700?random=6' },
]

const ShortVideo = memo(() => {
  const handleVideoClick = useCallback((title: string) => {
    Taro.showToast({ title: `播放 ${title}`, icon: 'none' })
  }, [])

  return (
    <View className="page">
      <NavBar title="短视频" showBack />
      <ScrollView scrollY className="page__body video-scroll">
        {mockVideos.map((video) => (
          <View key={video.id} className="video-card" onClick={() => handleVideoClick(video.title)}>
            <Image src={video.cover} className="video-card__cover" mode="aspectFill" />
            <View className="video-card__content">
              <Text className="video-card__title">{video.title}</Text>
              <View className="video-card__meta">
                <Text className="video-card__author">@{video.author}</Text>
                <Text className="video-card__likes">❤ {video.likes}</Text>
              </View>
            </View>
            <View className="video-card__progress">
              <View className="video-card__progress-bar" />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
})

ShortVideo.displayName = 'ShortVideo'
ShortVideo.config = { navigationStyle: 'custom' } as any

export default ShortVideo
