import { memo, useState, useCallback } from 'react'
import { View, Text, ScrollView, Image, Video, VideoSrc, CoverView, CoverImage } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

interface VideoItem {
  id: number
  title: string
  author: string
  likes: number
  cover: string
  src: string
}

const mockVideos: VideoItem[] = [
  {
    id: 1,
    title: '揭秘：如何用AI写出爆款文案',
    author: '运营小王子',
    likes: 12453,
    cover: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=700&fit=crop&q=80',
    src: 'https://raw.githubusercontent.com/fangzhihui88/wechat-community-app/main/public/videos/ai-marketing.mp4',
  },
  {
    id: 2,
    title: '周末露营装备清单大公开',
    author: '户外探险家',
    likes: 8921,
    cover: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=700&fit=crop&q=80',
    src: 'https://raw.githubusercontent.com/fangzhihui88/wechat-community-app/main/public/videos/camping.mp4',
  },
  {
    id: 3,
    title: '3分钟学会拿铁拉花',
    author: '咖啡师小李',
    likes: 6732,
    cover: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=700&fit=crop&q=80',
    src: 'https://raw.githubusercontent.com/fangzhihui88/wechat-community-app/main/public/videos/barista.mp4',
  },
  {
    id: 4,
    title: '城市夜景航拍技巧分享',
    author: '无人机玩家',
    likes: 15678,
    cover: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=700&fit=crop&q=80',
    src: 'https://raw.githubusercontent.com/fangzhihui88/wechat-community-app/main/public/videos/drone.mp4',
  },
  {
    id: 5,
    title: '独居女生的100个生活小妙招',
    author: '生活美学家',
    likes: 23456,
    cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=700&fit=crop&q=80',
    src: 'https://raw.githubusercontent.com/fangzhihui88/wechat-community-app/main/public/videos/life-hacks.mp4',
  },
  {
    id: 6,
    title: '健身餐怎么做才好吃又低卡',
    author: '健身达人阿杰',
    likes: 9876,
    cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=700&fit=crop&q=80',
    src: 'https://raw.githubusercontent.com/fangzhihui88/wechat-community-app/main/public/videos/fitness.mp4',
  },
]

const ShortVideo = memo(() => {
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set())

  const handlePlay = useCallback((id: number) => {
    setPlayingId(id)
  }, [])

  const handlePause = useCallback(() => {
    setPlayingId(null)
  }, [])

  const handleLike = useCallback((id: number) => {
    setLikedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleShare = useCallback((title: string) => {
    Taro.showShareMenu({ withShareTicket: true })
    Taro.showToast({ title: `分享：${title}`, icon: 'none' })
  }, [])

  return (
    <View className="page">
      <NavBar title="短视频" showBack />
      <ScrollView scrollY className="page__body video-scroll">
        {mockVideos.map((video) => (
          <View key={video.id} className="video-card">
            {/* 视频播放器或封面 */}
            <View className="video-card__player">
              {playingId === video.id ? (
                <Video
                  className="video-card__video"
                  src={video.src}
                  autoplay
                  loop
                  showCenterPlayBtn
                  showFullscreenBtn
                  showPlayBtn
                  controls
                  onPause={handlePause}
                  poster={video.cover}
                />
              ) : (
                <View onClick={() => handlePlay(video.id)}>
                  <Image src={video.cover} className="video-card__cover" mode="aspectFill" />
                  <View className="video-card__play-btn">
                    <Text className="video-card__play-icon">▶</Text>
                  </View>
                  <View className="video-card__duration">
                    <Text className="video-card__duration-text">02:30</Text>
                  </View>
                </View>
              )}
            </View>

            {/* 信息区 */}
            <View className="video-card__info">
              <View className="video-card__user">
                <Image src={`https://images.unsplash.com/photo-${['1527980965255-d3b416303d12', '1544005313-94ddf0286df2', '1534528741775-53994a69daeb', '1507003211169-0a1dd7228f2d', '1494790108377-be9c29b29330', '1472099645785-5658abf4ff4e'][video.id - 1]}?w=80&h=80&fit=crop&q=80`} className="video-card__avatar" />
                <Text className="video-card__author">{video.author}</Text>
              </View>
              <Text className="video-card__title">{video.title}</Text>

              {/* 操作栏 */}
              <View className="video-card__actions">
                <View className="video-card__action" onClick={() => handleLike(video.id)}>
                  <Text className={`video-card__action-icon ${likedIds.has(video.id) ? 'video-card__action-icon--liked' : ''}`}>
                    {likedIds.has(video.id) ? '❤️' : '🤍'}
                  </Text>
                  <Text className="video-card__action-text">
                    {video.likes + (likedIds.has(video.id) ? 1 : 0)}
                  </Text>
                </View>
                <View className="video-card__action" onClick={() => handleShare(video.title)}>
                  <Text className="video-card__action-icon">🔗</Text>
                  <Text className="video-card__action-text">分享</Text>
                </View>
              </View>
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
