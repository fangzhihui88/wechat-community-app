import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

// --- Mock Data ---
interface CheckinDay {
  date: string
  done: boolean
}

const generateHistory = (): CheckinDay[] => {
  const result: CheckinDay[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    result.push({
      date: `${d.getMonth() + 1}-${d.getDate()}`,
      done: i % 3 !== 0,
    })
  }
  return result
}

const mockCheckinData = {
  streak: 12,
  todayDone: false,
  history: generateHistory(),
}

const mockHealthMetrics = [
  { id: 1, label: '步数', value: 8000, unit: '步', target: 10000, icon: '👟' },
  { id: 2, label: '睡眠', value: 7, unit: 'h', target: 8, icon: '🌙' },
  { id: 3, label: '饮水', value: 2000, unit: 'ml', target: 2500, icon: '💧' },
]

// --- Component ---
const HealthPage = memo(() => {
  const [todayDone, setTodayDone] = useState(mockCheckinData.todayDone)
  const [streak, setStreak] = useState(mockCheckinData.streak)
  const [animating, setAnimating] = useState(false)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()

  // 当月第一天是周几
  const firstDay = new Date(year, month, 1).getDay() || 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // 生成日历格子
  const cells: (number | null)[] = []
  for (let i = 1; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  // 历史打卡映射 (date -> done)
  const historyMap: Record<string, boolean> = {}
  mockCheckinData.history.forEach((h) => {
    historyMap[h.date] = h.done
  })

  const handleCheckin = useCallback(() => {
    if (todayDone) {
      Taro.showToast({ title: '今日已完成', icon: 'none' })
      return
    }
    setTodayDone(true)
    setStreak((s) => s + 1)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 1200)
    Taro.showToast({ title: '打卡成功！', icon: 'success' })
  }, [todayDone])

  return (
    <View className="page health-page">
      <NavBar title="健康打卡" showBack />

      <ScrollView scrollY className="health-page__body">
        {/* 连续打卡 */}
        <View className="health-page__streak-card">
          <View className="health-page__streak-icon">🔥</View>
          <Text className="health-page__streak-num">{streak}</Text>
          <Text className="health-page__streak-label">连续打卡天数</Text>
        </View>

        {/* 日历打卡 */}
        <View className="health-page__calendar-card">
          <Text className="health-page__section-title">{year}年{month + 1}月</Text>
          <View className="health-page__weekday-row">
            {['一', '二', '三', '四', '五', '六', '日'].map((w) => (
              <Text key={w} className="health-page__weekday">{w}</Text>
            ))}
          </View>
          <View className="health-page__calendar-grid">
            {cells.map((day, idx) => {
              if (!day) return <View key={`empty-${idx}`} className="health-page__cal-cell health-page__cal-cell--empty" />
              const key = `${month + 1}-${day}`
              const isToday = day === today
              const isDone = day < today ? (historyMap[key] ?? false) : day === today ? todayDone : false
              return (
                <View
                  key={key}
                  className={[
                    'health-page__cal-cell',
                    isDone ? 'health-page__cal-cell--done' : 'health-page__cal-cell--missed',
                    isToday ? 'health-page__cal-cell--today' : '',
                  ].join(' ')}
                >
                  <Text className="health-page__cal-day">{day}</Text>
                  {isDone && <View className="health-page__cal-dot" />}
                </View>
              )
            })}
          </View>
        </View>

        {/* 健康数据 */}
        <View className="health-page__section-title" style={{ margin: '16px 16px 12px' }}>健康数据</View>
        <View className="health-page__metrics">
          {mockHealthMetrics.map((m) => {
            const pct = Math.min(100, Math.round((m.value / m.target) * 100))
            const r = 44
            const circ = 2 * Math.PI * r
            const offset = circ * (1 - pct / 100)
            return (
              <View key={m.id} className="health-page__metric-card">
                <View className="health-page__ring-wrap">
                  <View className="health-page__ring-svg">
                    <View className="health-page__ring-track" />
                    <View
                      className="health-page__ring-fill"
                      style={{ strokeDasharray: `${circ} ${circ}`, strokeDashoffset: offset }}
                    />
                  </View>
                  <Text className="health-page__ring-icon">{m.icon}</Text>
                </View>
                <Text className="health-page__metric-label">{m.label}</Text>
                <Text className="health-page__metric-value">{m.value}{m.unit}</Text>
                <Text className="health-page__metric-target">目标 {m.target}{m.unit}</Text>
              </View>
            )
          })}
        </View>

        <View className="health-page__safe-bottom" />
      </ScrollView>

      {/* 打卡按钮 */}
      <View className="health-page__footer">
        <View
          className={[
            'health-page__checkin-btn',
            todayDone ? 'health-page__checkin-btn--done' : '',
            animating ? 'health-page__checkin-btn--animating' : '',
          ].join(' ')}
          onClick={handleCheckin}
        >
          <Text className="health-page__checkin-btn-text">
            {todayDone ? '✓ 今日已打卡' : '立即打卡'}
          </Text>
        </View>
      </View>
    </View>
  )
})

HealthPage.config = { navigationStyle: 'custom' } as any
HealthPage.displayName = 'HealthPage'
export default HealthPage
