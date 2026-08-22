import { memo, useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const mockPlans = [
  { id: '1', name: '减脂燃脂计划', difficulty: '中等', duration: '4周', members: 8923, cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop&q=80' },
  { id: '2', name: '增肌训练计划', difficulty: '高难', duration: '8周', members: 6541, cover: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=600&h=400&fit=crop&q=80' },
  { id: '3', name: '瑜伽塑形计划', difficulty: '轻松', duration: '6周', members: 12307, cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop&q=80' },
]

const mockCoaches = [
  { id: '1', name: '阿杰教练', avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=80&h=80&fit=crop&q=80', specialty: '减脂/塑形', rating: 4.9 },
  { id: '2', name: '小美教练', avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=80&h=80&fit=crop&q=80', specialty: '瑜伽/普拉提', rating: 4.8 },
  { id: '3', name: '大力教练', avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&h=80&fit=crop&q=80', specialty: '增肌/力量', rating: 4.7 },
]

const mockCourses = [
  { id: '1', name: 'HIIT燃脂操', trainer: '阿杰', cover: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=300&h=200&fit=crop&q=80' },
  { id: '2', name: '核心力量训练', trainer: '大力', cover: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop&q=80' },
  { id: '3', name: '睡前拉伸放松', trainer: '小美', cover: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=300&h=200&fit=crop&q=80' },
  { id: '4', name: '马甲线养成', trainer: '阿杰', cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&q=80' },
]

const difficultyColor: Record<string, string> = { '轻松': '#34C759', '中等': '#FF9500', '高难': '#FF3B30' }

const FitnessHub = memo(() => {
  const [step, setStep] = useState(8000)
  const [cal, setCal] = useState(420)
  const [duration, setDuration] = useState(45)
  const maxStep = 10000, maxCal = 600, maxDuration = 60

  const makeProgress = (v: number, max: number) => ((v / max) * 100).toFixed(0)

  const handleBook = (name: string) => {
    Taro.showModal({ title: '约课确认', content: `确定预约 ${name} 教练的课程？`, success: () => Taro.showToast({ title: '预约成功', icon: 'none' }) })
  }

  return (
    <View className="page fitness-page">
      <NavBar title="健身中心" showBack />
      <ScrollView scrollY className="fitness-page__scroll">

        {/* 运动记录仪表盘 */}
        <View className="fitness-dashboard">
          <Text className="fitness-dashboard__title">今日运动</Text>
          <View className="fitness-metrics">
            {[
              { label: '步数', value: step, max: maxStep, unit: '步', color: '#FF4757' },
              { label: '卡路里', value: cal, max: maxCal, unit: 'kcal', color: '#FF9500' },
              { label: '时长', value: duration, max: maxDuration, unit: '分钟', color: '#34C759' },
            ].map(m => (
              <View key={m.label} className="fitness-metric">
                <View className="fitness-metric__ring" style={{ '--pct': makeProgress(m.value, m.max), '--color': m.color } as any}>
                  <Text className="fitness-metric__val">{m.value}</Text>
                  <Text className="fitness-metric__unit">{m.unit}</Text>
                </View>
                <Text className="fitness-metric__label">{m.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 健身计划 */}
        <View className="fitness-section">
          <Text className="fitness-section__title">🏋️ 健身计划</Text>
          {mockPlans.map(p => (
            <View key={p.id} className="fitness-plan-card">
              <Image src={p.cover} className="fitness-plan-card__cover" />
              <View className="fitness-plan-card__info">
                <Text className="fitness-plan-card__name">{p.name}</Text>
                <View className="fitness-plan-card__tags">
                  <Text className="fitness-tag" style={{ background: difficultyColor[p.difficulty] + '22', color: difficultyColor[p.difficulty] }}>{p.difficulty}</Text>
                  <Text className="fitness-tag fitness-tag--gray">{p.duration}</Text>
                </View>
                <Text className="fitness-plan-card__members">👥 {p.members.toLocaleString()} 人参与</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 教练推荐 */}
        <View className="fitness-section">
          <Text className="fitness-section__title">🏅 教练推荐</Text>
          <ScrollView scrollX className="fitness-coach-scroll">
            {mockCoaches.map(c => (
              <View key={c.id} className="fitness-coach">
                <Image src={c.avatar} className="fitness-coach__avatar" />
                <Text className="fitness-coach__name">{c.name}</Text>
                <Text className="fitness-coach__spec">{c.specialty}</Text>
                <Text className="fitness-coach__rating">⭐ {c.rating}</Text>
                <View className="fitness-coach__book" onClick={() => handleBook(c.name)}>
                  <Text>约课</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 健身课程 */}
        <View className="fitness-section">
          <Text className="fitness-section__title">📺 精选课程</Text>
          <ScrollView scrollX className="fitness-course-scroll">
            {mockCourses.map(c => (
              <View key={c.id} className="fitness-course">
                <Image src={c.cover} className="fitness-course__cover" />
                <Text className="fitness-course__name">{c.name}</Text>
                <Text className="fitness-course__trainer">教练：{c.trainer}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

FitnessHub.displayName = 'FitnessHub'
FitnessHub.config = { navigationStyle: 'custom' } as any
export default FitnessHub
