import { memo, useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const mockIdol = {
  name: '小甜心',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&q=80',
  fans: 128456,
  following: true,
}

const mockSchedules = [
  { date: '2026-08-25', event: '演唱会', location: '深圳湾体育中心' },
  { date: '2026-09-03', event: '粉丝见面会', location: '广州大剧院' },
  { date: '2026-09-15', event: '综艺录制', location: '北京电视台' },
  { date: '2026-09-28', event: '演唱会', location: '上海梅赛德斯' },
]

const mockGoods = [
  { id: '1', name: '官方应援棒', price: 128, cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop&q=80' },
  { id: '2', name: '签名专辑', price: 298, cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&q=80' },
  { id: '3', name: '周边抱枕', price: 88, cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&q=80' },
]

const mockNews = [
  { id: '1', title: '小甜心新歌《星光》上线 24 小时播放破亿', time: '2小时前', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=150&fit=crop&q=80' },
  { id: '2', title: '深圳演唱会门票今日开售，3分钟售罄', time: '1天前', cover: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=200&h=150&fit=crop&q=80' },
  { id: '3', title: '小甜心登顶年度女歌手排行榜', time: '3天前', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop&q=80' },
]

// 当月日历
const now = new Date()
const year = now.getFullYear()
const month = now.getMonth()
const daysInMonth = new Date(year, month + 1, 0).getDate()
const firstDay = new Date(year, month, 1).getDay() || 7
const scheduleDates = new Set(mockSchedules.map(s => s.date.slice(8, 10).padStart(2, '0')))

const Star = memo(() => {
  const [idol] = useState(mockIdol)

  const handleFollow = () => {
    Taro.showToast({ title: idol.following ? '已取消关注' : '关注成功 ❤️', icon: 'none' })
  }

  const handleAddCart = (name: string) => {
    Taro.showToast({ title: `已加入购物车：${name}`, icon: 'none' })
  }

  const monthName = `${year}年${month + 1}月`
  const weekdays = ['一', '二', '三', '四', '五', '六', '日']

  return (
    <View className="page star-page">
      <NavBar title="追星圈" showBack />

      <ScrollView scrollY className="star-page__scroll">
        {/* 偶像主页 */}
        <View className="star-hero">
          <Image src={idol.avatar} className="star-hero__avatar" />
          <Text className="star-hero__name">{idol.name}</Text>
          <Text className="star-hero__fans">{idol.fans.toLocaleString()} 粉丝</Text>
          <View className="star-hero__follow-btn" onClick={handleFollow}>
            <Text>{idol.following ? '已关注' : '+ 关注'}</Text>
          </View>
        </View>

        {/* 行程日历 */}
        <View className="star-section">
          <Text className="star-section__title">📅 {monthName} 行程</Text>
          <View className="star-calendar">
            <View className="star-calendar__weekdays">
              {weekdays.map(d => <Text key={d} className="star-calendar__wd">{d}</Text>)}
            </View>
            <View className="star-calendar__grid">
              {Array.from({ length: firstDay - 1 }).map((_, i) => (
                <View key={`empty-${i}`} className="star-calendar__cell star-calendar__cell--empty" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = String(i + 1).padStart(2, '0')
                const hasSchedule = scheduleDates.has(day)
                const isToday = day === String(now.getDate()).padStart(2, '0')
                return (
                  <View
                    key={day}
                    className={`star-calendar__cell ${hasSchedule ? 'star-calendar__cell--schedule' : ''} ${isToday ? 'star-calendar__cell--today' : ''}`}
                  >
                    <Text>{i + 1}</Text>
                    {hasSchedule && <View className="star-calendar__dot" />}
                  </View>
                )
              })}
            </View>
          </View>
          {mockSchedules.map((s, i) => (
            <View key={i} className="star-schedule-item">
              <Text className="star-schedule-item__date">{s.date}</Text>
              <Text className="star-schedule-item__event">{s.event}</Text>
              <Text className="star-schedule-item__loc">📍 {s.location}</Text>
            </View>
          ))}
        </View>

        {/* 周边商品 */}
        <View className="star-section">
          <Text className="star-section__title">🛍 周边商品</Text>
          <ScrollView scrollX className="star-goods-scroll">
            {mockGoods.map(g => (
              <View key={g.id} className="star-goods-card">
                <Image src={g.cover} className="star-goods-card__img" />
                <Text className="star-goods-card__name">{g.name}</Text>
                <View className="star-goods-card__footer">
                  <Text className="star-goods-card__price">¥{g.price}</Text>
                  <View className="star-goods-card__cart" onClick={() => handleAddCart(g.name)}>
                    <Text>加入</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 明星资讯 */}
        <View className="star-section">
          <Text className="star-section__title">📰 明星资讯</Text>
          {mockNews.map(n => (
            <View key={n.id} className="star-news-item">
              <Image src={n.cover} className="star-news-item__cover" />
              <View className="star-news-item__body">
                <Text className="star-news-item__title">{n.title}</Text>
                <Text className="star-news-item__time">{n.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Star.displayName = 'Star'
Star.config = { navigationStyle: 'custom' } as any
export default Star
