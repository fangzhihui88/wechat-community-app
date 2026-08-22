import { memo, useState, useCallback, useRef } from 'react'
import { View, Text, Image, Video, VideoProps } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const VIDEO_BASE = 'https://fangzhihui88.github.io/wechat-community-app/videos'

interface VideoItem {
  id: number
  title: string
  author: string
  likes: number
  avatar: string
  cover: string
  src: string
  duration: string
}

const mockVideos: VideoItem[] = [
  {
    id: 1,
    title: '揭秘：如何用AI写出爆款文案',
    author: '运营小王子',
    likes: 12453,
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1080&h=1920&fit=crop&q=80',
    src: `${VIDEO_BASE}/ai-marketing.mp4`,
    duration: '02:30',
  },
  {
    id: 2,
    title: '周末露营装备清单大公开',
    author: '户外探险家',
    likes: 8921,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1080&h=1920&fit=crop&q=80',
    src: `${VIDEO_BASE}/camping.mp4`,
    duration: '01:48',
  },
  {
    id: 3,
    title: '3分钟学会拿铁拉花',
    author: '咖啡师小李',
    likes: 6732,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1080&h=1920&fit=crop&q=80',
    src: `${VIDEO_BASE}/barista.mp4`,
    duration: '03:12',
  },
  {
    id: 4,
    title: '城市夜景航拍技巧分享',
    author: '无人机玩家',
    likes: 15678,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1080&h=1920&fit=crop&q=80',
    src: `${VIDEO_BASE}/drone.mp4`,
    duration: '04:05',
  },
  {
    id: 5,
    title: '独居女生的100个生活小妙招',
    author: '生活美学家',
    likes: 23456,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1080&h=1920&fit=crop&q=80',
    src: `${VIDEO_BASE}/life-hacks.mp4`,
    duration: '02:58',
  },
  {
    id: 6,
    title: '健身餐怎么做才好吃又低卡',
    author: '健身达人阿杰',
    likes: 9876,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1080&h=1920&fit=crop&q=80',
    src: `${VIDEO_BASE}/fitness.mp4`,
    duration: '03:30',
  },
]

const ShortVideo = memo(() => {
  const [currentId, setCurrentId] = useState<number>(1)
  const [likedSet, setLikedSet] = useState<Set<number>>(new Set())
  const videoRef = useRef<any>(null)

  const currentVideo = mockVideos.find(v => v.id === currentId) || mockVideos[0]

  const handleLike = useCallback(() => {
    setLikedSet(prev => {
      const next = new Set(prev)
      if (next.has(currentId)) next.delete(currentId)
      else next.add(currentId)
      return next
    })
  }, [currentId])

  const handleShare = useCallback(() => {
    Taro.showShareMenu({ withShareTicket: true })
    Taro.showToast({ title: `分享：${currentVideo.title}`, icon: 'none' })
  }, [currentVideo.title])

  const formatNum = (n: number) => n >= 10000 ? `${(n / 10000).toFixed(1)}万` : String(n)

  return (
    <View className="page short-video-page">
      <NavBar title="短视频" showBack />

      {/* 主视频播放器 — 和直播间完全一致的结构 */}
      <View className="short-video__player-wrap">
        <Video
          ref={videoRef}
          className="short-video__player"
          src={currentVideo.src}
          autoplay
          loop
          showCenterPlayBtn
          showFullscreenBtn
          showPlayBtn
          controls
          poster={currentVideo.cover}
        />

        {/* 右侧操作栏 */}
        <View className="short-video__actions">
          <View className="short-action" onClick={handleLike}>
            <Text className="short-action__icon">{likedSet.has(currentId) ? '❤️' : '🤍'}</Text>
            <Text className="short-action__text">{formatNum(currentVideo.likes + (likedSet.has(currentId) ? 1 : 0))}</Text>
          </View>
          <View className="short-action" onClick={handleShare}>
            <Text className="short-action__icon">🔗</Text>
            <Text className="short-action__text">分享</Text>
          </View>
        </View>

        {/* 底部信息 */}
        <View className="short-video__footer">
          <View className="short-video__author">
            <Image src={currentVideo.avatar} className="short-video__avatar" />
            <Text className="short-video__author-name">{currentVideo.author}</Text>
          </View>
          <Text className="short-video__desc">{currentVideo.title}</Text>
        </View>
      </View>

      {/* 视频列表切换 */}
      <View className="short-video__list">
        <Text className="short-video__list-title">更多视频</Text>
        {mockVideos.map(video => (
          <View
            key={video.id}
            className={`short-video__item ${video.id === currentId ? 'short-video__item--active' : ''}`}
            onClick={() => setCurrentId(video.id)}
          >
            <Image src={video.cover} className="short-video__item-cover" mode="aspectFill" />
            <View className="short-video__item-info">
              <Text className="short-video__item-title">{video.title}</Text>
              <Text className="short-video__item-author">{video.author}</Text>
            </View>
            {video.id === currentId && (
              <View className="short-video__item-playing">
                <Text>▶</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  )
})

ShortVideo.displayName = 'ShortVideo'
ShortVideo.config = { navigationStyle: 'custom' } as any

export default ShortVideo
