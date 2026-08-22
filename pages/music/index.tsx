import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

interface Playlist {
  id: number
  name: string
  cover: string
  trackCount: number
  creator: string
}

interface CurrentSong {
  title: string
  artist: string
  cover: string
  duration: number
}

const mockPlaylists: Playlist[] = [
  { id: 1, name: '华语热歌榜', cover: 'https://picsum.photos/seed/music1/300/300', trackCount: 50, creator: '官方' },
  { id: 2, name: '深夜emo专用', cover: 'https://picsum.photos/seed/music2/300/300', trackCount: 32, creator: '心灵疗愈师' },
  { id: 3, name: '学习专注BGM', cover: 'https://picsum.photos/seed/music3/300/300', trackCount: 25, creator: '学霸小明' },
  { id: 4, name: '运动燃脂必备', cover: 'https://picsum.photos/seed/music4/300/300', trackCount: 40, creator: '健身达人' },
  { id: 5, name: '轻音乐放松', cover: 'https://picsum.photos/seed/music5/300/300', trackCount: 20, creator: '静心阁' },
  { id: 6, name: '民谣时光', cover: 'https://picsum.photos/seed/music6/300/300', trackCount: 18, creator: '流浪诗人' },
]

const mockSongs: CurrentSong[] = [
  { title: '晴天', artist: '周杰伦', cover: 'https://picsum.photos/seed/song1/300/300', duration: 267 },
  { title: '稻香', artist: '周杰伦', cover: 'https://picsum.photos/seed/song2/300/300', duration: 224 },
  { title: '起风了', artist: '买辣椒也用券', cover: 'https://picsum.photos/seed/song3/300/300', duration: 298 },
]

const Music = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [playlists] = useState<Playlist[]>(mockPlaylists)
  const currentSong = mockSongs[currentIndex]

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    const title = currentSong.title
    if (!isPlaying) {
      setIsPlaying(true)
      Taro.showToast({ title: `播放: ${title}`, icon: 'none' })
    } else {
      setIsPlaying(false)
      Taro.showToast({ title: `暂停: ${title}`, icon: 'none' })
    }
  }

  const handlePrev = () => {
    const idx = (currentIndex - 1 + mockSongs.length) % mockSongs.length
    setCurrentIndex(idx)
    setIsPlaying(true)
    setProgress(0)
    Taro.showToast({ title: `上一首: ${mockSongs[idx].title}`, icon: 'none' })
  }

  const handleNext = () => {
    const idx = (currentIndex + 1) % mockSongs.length
    setCurrentIndex(idx)
    setIsPlaying(true)
    setProgress(0)
    Taro.showToast({ title: `下一首: ${mockSongs[idx].title}`, icon: 'none' })
  }

  const handlePlaylist = (name: string) => {
    Taro.showToast({ title: name, icon: 'none' })
  }

  return (
    <View className="page">
      <NavBar title="音乐分享" showBack />
      <ScrollView scrollY className="music-body">

        {/* 本地音乐入口 + 排行榜入口 */}
        <View className="section">
          <View className="entry-row">
            <View className="entry-card entry-card--local" onClick={() => Taro.showToast({ title: '本地音乐', icon: 'none' })}>
              <Text className="entry-card__icon">🎵</Text>
              <Text className="entry-card__label">本地音乐</Text>
              <Text className="entry-card__sub">128 首</Text>
            </View>
            <View className="entry-card entry-card--rank" onClick={() => Taro.showToast({ title: '排行榜', icon: 'none' })}>
              <Text className="entry-card__icon">🏆</Text>
              <Text className="entry-card__label">排行榜</Text>
              <Text className="entry-card__sub">热歌 TOP100</Text>
            </View>
          </View>
        </View>

        {/* 播放控制栏 */}
        <View className="section">
          <View className="player-card">
            <View className="player-disc-wrap">
              <View className={`player-disc ${isPlaying ? 'player-disc--spinning' : ''}`}>
                <View className="player-disc__inner">
                  <Image className="player-disc__cover" src={currentSong.cover} mode="aspectFill" />
                </View>
              </View>
            </View>
            <View className="player-info">
              <Text className="player-info__title" numberOfLines={1}>{currentSong.title}</Text>
              <Text className="player-info__artist" numberOfLines={1}>{currentSong.artist}</Text>
            </View>
            {/* 进度条 mock */}
            <View className="player-progress">
              <Text className="player-progress__time">{formatTime(progress)}</Text>
              <View className="player-progress__bar">
                <View className="player-progress__fill" style={{ width: `${progress}%` }} />
                <View className="player-progress__thumb" style={{ left: `${progress}%` }} />
              </View>
              <Text className="player-progress__time">{formatTime(currentSong.duration)}</Text>
            </View>
            {/* 控制按钮 */}
            <View className="player-controls">
              <View className="player-btn player-btn--prev" onClick={handlePrev}>
                <Text className="player-btn__icon">⏮</Text>
              </View>
              <View className="player-btn player-btn--play" onClick={handlePlayPause}>
                <Text className="player-btn__icon player-btn__icon--lg">{isPlaying ? '⏸' : '▶'}</Text>
              </View>
              <View className="player-btn player-btn--next" onClick={handleNext}>
                <Text className="player-btn__icon">⏭</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 歌单列表 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">推荐歌单</Text>
            <Text className="section__more">更多 ›</Text>
          </View>
          {playlists.map(playlist => (
            <View
              key={playlist.id}
              className="playlist-card"
              onClick={() => handlePlaylist(playlist.name)}
            >
              <Image className="playlist-card__cover" src={playlist.cover} mode="aspectFill" />
              <View className="playlist-card__info">
                <Text className="playlist-card__name" numberOfLines={1}>{playlist.name}</Text>
                <Text className="playlist-card__meta">
                  {playlist.trackCount} 首 · by {playlist.creator}
                </Text>
              </View>
              <Text className="playlist-card__arrow">›</Text>
            </View>
          ))}
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Music.config = { navigationStyle: 'custom' } as any
Music.displayName = 'Music'
export default Music
