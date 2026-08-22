import { memo, useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const mockTests = [
  { id: '1', name: '心理健康自评量表（SCL-90）', participants: 23456, description: '国际通用心理健康筛查工具' },
  { id: '2', name: '抑郁自评量表（SDS）', participants: 18923, description: '评估抑郁情绪严重程度' },
  { id: '3', name: '焦虑自评量表（SAS）', participants: 15678, description: '了解自身焦虑状态' },
]
const mockArticles = [
  { id: '1', title: '如何识别自己的情绪信号？', category: '情绪管理', reads: 8923, cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop&q=80' },
  { id: '2', title: '5个简单方法改善睡眠质量', category: '睡眠', reads: 12307, cover: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop&q=80' },
  { id: '3', title: '职场压力管理：如何保持心理健康', category: '职场', reads: 7654, cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop&q=80' },
]
const moodOptions: { emoji: string; label: string; color: string }[] = [
  { emoji: '😊', label: '开心', color: '#34C759' },
  { emoji: '😐', label: '一般', color: '#FF9500' },
  { emoji: '😢', label: '难过', color: '#5856D6' },
  { emoji: '😠', label: '生气', color: '#FF3B30' },
]

const MentalHealth = memo(() => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  const handleTest = (name: string) => Taro.showToast({ title: `开始测试：${name}`, icon: 'none' })
  const handleConsult = () => {
    Taro.showModal({ title: '心理咨询预约', content: '确定预约专业心理咨询师？', success: (r) => {
      if (r.confirm) Taro.showToast({ title: '预约成功，客服将尽快联系您', icon: 'none' })
    }})
  }
  const handleMood = (mood: string) => {
    setSelectedMood(mood)
    Taro.showToast({ title: `今日心情：${mood}`, icon: 'none' })
  }

  return (
    <View className="page mental-page">
      <NavBar title="心理健康" showBack />
      <ScrollView scrollY className="mental-page__scroll">

        {/* 情绪记录 */}
        <View className="mental-mood-section">
          <Text className="mental-section-title">🌈 今日心情</Text>
          <View className="mental-mood-options">
            {moodOptions.map(m => (
              <View
                key={m.label}
                className={`mental-mood-btn ${selectedMood === m.label ? 'mental-mood-btn--active' : ''}`}
                style={selectedMood === m.label ? { background: m.color } as any : {}}
                onClick={() => handleMood(m.label)}
              >
                <Text className="mental-mood-btn__emoji">{m.emoji}</Text>
                <Text className="mental-mood-btn__label">{m.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 心理测试 */}
        <View className="mental-section">
          <Text className="mental-section-title">📝 心理测试</Text>
          {mockTests.map(t => (
            <View key={t.id} className="mental-test-card">
              <View className="mental-test-card__info">
                <Text className="mental-test-card__name">{t.name}</Text>
                <Text className="mental-test-card__desc">{t.description}</Text>
                <Text className="mental-test-card__count">👥 {t.participants.toLocaleString()} 人已测</Text>
              </View>
              <View className="mental-test-card__btn" onClick={() => handleTest(t.name)}>
                <Text>去做测试</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 心理文章 */}
        <View className="mental-section">
          <Text className="mental-section-title">📚 科普文章</Text>
          {mockArticles.map(a => (
            <View key={a.id} className="mental-article-card">
              <Image src={a.cover} className="mental-article-card__cover" />
              <View className="mental-article-card__body">
                <Text className="mental-article-card__title">{a.title}</Text>
                <View className="mental-article-card__meta">
                  <Text className="mental-article-card__tag">{a.category}</Text>
                  <Text className="mental-article-card__reads">👁 {a.reads.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 心理咨询 */}
        <View className="mental-consult-banner" onClick={handleConsult}>
          <Text className="mental-consult-banner__title">💬 专业心理咨询</Text>
          <Text className="mental-consult-banner__sub">国家二级心理咨询师，一对一倾诉</Text>
          <View className="mental-consult-banner__btn"><Text>立即预约</Text></View>
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

MentalHealth.displayName = 'MentalHealth'
MentalHealth.config = { navigationStyle: 'custom' } as any
export default MentalHealth
