import { memo, useState, useCallback, useRef, useEffect } from 'react'
import { View, Text, Image, Video, VideoProps } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const VIDEO_BASE = 'https://fangzhihui88.github.io/wechat-community-app/videos'

const mockVideos = [
  {
    id: 1,
    title: '揭秘：如何用AI写出爆款文案',
    author: '运营小王子',
    likes: 12453,
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=700&fit=crop&q=80',
    src: `${VIDEO_BASE}/ai-marketing.mp4`,
  },
  {
    id: 2,
    title: '周末露营装备清单大公开',
    author: '户外探险家',
    likes: 8921,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=700&fit=crop&q=80',
    src: `${VIDEO_BASE}/camping.mp4`,
  },
  {
    id: 3,
    title: '3分钟学会拿铁拉花',
    author: '咖啡师小李',
    likes: 6732,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=700&fit=crop&q=80',
    src: `${VIDEO_BASE}/barista.mp4`,
  },
  {
    id: 4,
    title: '城市夜景航拍技巧分享',
    author: '无人机玩家',
    likes: 15678,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=700&fit=crop&q=80',
    src: `${VIDEO_BASE}/drone.mp4`,
  },
  {
    id: 5,
    title: '独居女生的100个生活小妙招',
    author: '生活美学家',
    likes: 23456,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=700&fit=crop&q=80',
    src: `${VIDEO_BASE}/life-hacks.mp4`,
  },
  {
    id: 6,
    title: '健身餐怎么做才好吃又低卡',
    author: '健身达人阿杰',
    likes: 9876,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=700&fit=crop&q=80',
    src: `${VIDEO_BASE}/fitness.mp4`,
  },
]

const ShortVideo = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedSet, setLikedSet] = useState<Set<number>>(new Set())
  const [pausedSet, setPausedSet] = useState<Set<number>>(new Set())
  const [muted, setMuted] = useState(true)
  const videoRefs = useRef<Record<number, any>>({})

  const currentVideo = mockVideos[currentIndex]

  // Scroll to current video when index changes
  useEffect(() => {
    // Pause other videos, play current one
    const curId = mockVideos[currentIndex]?.id
    if (curId !== undefined) {
      videoRefs.current[curId]?.play?.()
      setPausedSet(prev => {
        const next = new Set<number>()
        return next
      })
    }
  }, [currentIndex])

  const handleScroll = useCallback((e: any) => {
    const scrollTop = e.detail?.scrollTop || 0
    constvh = typeof window !== 'undefined' ? window.innerHeight : 667
    const index = Math.round(scrollTop / (window.innerHeight || 667))
    const clamped = Math.max(0, Math.min(index, mockVideos.length - 1))
    if (clamped !== currentIndex) {
      setCurrentIndex(clamped)
    }
  }, [currentIndex])

  const handleLike = useCallback((id: number, e?: any) => {
    e?.stopPropagation?.()
    setLikedSet(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleShare = useCallback((title: string, e?: any) => {
    e?.stopPropagation?.()
    Taro.showShareMenu({ withShareTicket: true })
    Taro.showToast({ title: `分享：${title}`, icon: 'none' })
  }, [])

  const handleVideoClick = useCallback((id: number) => {
    setPausedSet(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        videoRefs.current[id]?.play?.()
      } else {
        next.add(id)
        videoRefs.current[id]?.pause?.()
      }
      return next
    })
  }, [])

  const handleVideoEnd = useCallback((id: number) => {
    videoRefs.current[id]?.seek?.(0)
    videoRefs.current[id]?.play?.()
  }, [])

  const handleMuteToggle = useCallback((e?: any) => {
    e?.stopPropagation?.()
    setMuted(prev => !prev)
    Taro.showToast({ title: muted ? '已开启声音' : '已静音', icon: 'none', duration: 800 })
  }, [muted])

  const formatNum = (n: number) => n >= 10000 ? `${(n / 10000).toFixed(1)}万` : String(n)

  return (
    <View className="page short-video-page">
      <NavBar title="短视频" showBack />

      {/* 全屏垂直滑动 Feed */}
      <ScrollView
        scrollY
        className="video-feed"
        onScroll={handleScroll}
        scrollWithAnimation
        enhanced
        showsVerticalScrollIndicator={false}
      >
        {mockVideos.map((video, idx) => {
          const isActive = idx === currentIndex
          const isPaused = !pausedSet.has(video.id)
          return (
            <View
              key={video.id}
              className="video-item"
              onClick={() => handleVideoClick(video.id)}
            >
              {/* Video 或封面 */}
              {isActive ? (
                <Video
                  ref={(ref: any) => { if (ref) videoRefs.current[video.id] = ref }}
                  className="video-item__player"
                  src={video.src}
                  autoplay={isActive}
                  muted={muted}
                  loop
                  showCenterPlayBtn={false}
                  showPlayBtn={false}
                  showFullscreenBtn
                  showProgress={false}
                  enableProgressGesture={false}
                  objectFit="contain"
                  poster={video.cover}
                  onPlay={() => setPausedSet(prev => { const n = new Set(prev); n.delete(video.id); return n })}
                  onPause={() => setPausedSet(prev => { const n = new Set(prev); n.add(video.id); return n })}
                  onEnded={() => handleVideoEnd(video.id)}
                />
              ) : (
                <Image src={video.cover} className="video-item__cover" mode="aspectFill" />
              )}

              {/* 暂停图标 */}
              {isActive && isPaused && (
                <View className="video-item__pause-icon">
                  <Text>▶</Text>
                </View>
              )}

              {/* 右侧操作栏 */}
              <View className="video-item__actions">
                <View className="action-btn" onClick={(e) => handleLike(video.id, e)}>
                  <Text className="action-btn__icon">{likedSet.has(video.id) ? '❤️' : '🤍'}</Text>
                  <Text className="action-btn__text">{formatNum(video.likes + (likedSet.has(video.id) ? 1 : 0))}</Text>
                </View>
                <View className="action-btn" onClick={(e) => handleShare(video.title, e)}>
                  <Text className="action-btn__icon">🔗</Text>
                  <Text className="action-btn__text">分享</Text>
                </View>
                <View className="action-btn" onClick={handleMuteToggle}>
                  <Text className="action-btn__icon">{muted ? '🔇' : '🔊'}</Text>
                  <Text className="action-btn__text">{muted ? '静音' : '声音'}</Text>
                </View>
              </View>

              {/* 底部信息栏 */}
              <View className="video-item__footer">
                <View className="video-item__author">
                  <Image src={video.avatar} className="video-item__avatar" />
                  <Text className="video-item__author-name">{video.author}</Text>
                </View>
                <Text className="video-item__desc">{video.title}</Text>
              </View>
            </View>
          )
        })}
      </ScrollView>

      {/* 顶部页码指示 */}
      <View className="video-indicator">
        {mockVideos.map((v) => (
          <View
            key={v.id}
            className={`video-indicator__dot ${v.id === currentVideo.id ? 'video-indicator__dot--active' : ''}`}
          />
        ))}
      </View>
    </View>
  )
})

ShortVideo.displayName = 'ShortVideo'
ShortVideo.config = { navigationStyle: 'custom' } as any

export default ShortVideo
