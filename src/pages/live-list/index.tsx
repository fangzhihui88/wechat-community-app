import { memo, useCallback } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

interface LiveItem {
  id: number
  title: string
  streamer: string
  viewers: number
  cover: string
}

const mockLives: LiveItem[] = [
  { id: 1, title: '深夜唱歌陪你入眠', streamer: '小甜心', viewers: 2341, cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop&q=80' },
  { id: 2, title: '王者巅峰赛冲分中', streamer: '游戏大神', viewers: 8932, cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop&q=80' },
  { id: 3, title: '美妆教程：日常通勤妆', streamer: '化妆师Mia', viewers: 1567, cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop&q=80' },
  { id: 4, title: '健身打卡第100天', streamer: '肌肉小哥', viewers: 3456, cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop&q=80' },
  { id: 5, title: '夜宵探店：烤串摊', streamer: '吃货小分队', viewers: 789, cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop&q=80' },
  { id: 6, title: '钢琴即兴演奏', streamer: '音乐人阿浩', viewers: 1234, cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop&q=80' },
]

const LiveList = memo(() => {
  const handleLiveClick = useCallback((roomId: number) => {
    Taro.navigateTo({ url: `/pages/live-room/index?roomId=${roomId}` })
  }, [])

  return (
    <View className="page">
      <NavBar title="直播" showBack />
      <ScrollView scrollY className="page__body">
        <View className="live-grid">
          {mockLives.map((live) => (
            <View key={live.id} className="live-card" onClick={() => handleLiveClick(live.id)}>
              <View className="live-card__cover-wrap">
                <Image src={live.cover} className="live-card__cover" mode="aspectFill" />
                <View className="live-card__badge">直播中</View>
              </View>
              <View className="live-card__info">
                <Text className="live-card__title">{live.title}</Text>
                <Text className="live-card__streamer">{live.streamer}</Text>
                <Text className="live-card__viewers">{live.viewers}人观看</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
})

LiveList.displayName = 'LiveList'
LiveList.config = { navigationStyle: 'custom' } as any

export default LiveList
