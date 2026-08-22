import { memo } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const mockProjects = [
  { id: '1', name: '山区儿童助学金计划', org: '希望工程基金会', participants: 23456, progress: 68, target: 500000, cover: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop&q=80' },
  { id: '2', name: '流浪动物救助行动', org: '爱心宠物协会', participants: 15678, progress: 45, target: 200000, cover: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?w=600&h=400&fit=crop&q=80' },
  { id: '3', name: '孤寡老人关爱计划', org: '夕阳红公益', participants: 8901, progress: 82, target: 300000, cover: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&h=400&fit=crop&q=80' },
]
const mockNews = [
  { id: '1', title: '2026年度公益盛典在北京成功举办', time: '3天前', cover: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=200&h=150&fit=crop&q=80' },
  { id: '2', title: '爱心企业向希望工程捐赠1000万元', time: '1周前', cover: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=200&h=150&fit=crop&q=80' },
]

const Charity = memo(() => {
  const handleDonate = (name: string) => {
    Taro.showModal({ title: '捐款确认', content: `确定向「${name}」捐款？`, success: (r) => {
      if (r.confirm) Taro.showToast({ title: '感谢您的爱心！🙏', icon: 'none' })
    }})
  }
  const handleVolunteer = () => Taro.showModal({ title: '志愿者报名', content: '确定报名成为志愿者？我们会与您联系。', success: (r) => {
    if (r.confirm) Taro.showToast({ title: '报名成功！', icon: 'none' })
  }})

  return (
    <View className="page charity-page">
      <NavBar title="公益活动" showBack />
      <ScrollView scrollY className="charity-page__scroll">

        {/* 志愿者招募 */}
        <View className="charity-volunteer-banner" onClick={handleVolunteer}>
          <Text className="charity-volunteer-banner__title">🤝 加入志愿者行列</Text>
          <Text className="charity-volunteer-banner__sub">用行动传递温暖，用爱心点亮希望</Text>
        </View>

        {/* 公益项目 */}
        <View className="charity-section">
          <Text className="charity-section__title">🎗️ 公益项目</Text>
          {mockProjects.map(p => (
            <View key={p.id} className="charity-project-card">
              <Image src={p.cover} className="charity-project-card__cover" />
              <View className="charity-project-card__body">
                <Text className="charity-project-card__name">{p.name}</Text>
                <Text className="charity-project-card__org">🏛 {p.org}</Text>
                <View className="charity-project-card__progress">
                  <View className="charity-project-card__progress-bar">
                    <View className="charity-project-card__progress-fill" style={{ width: `${p.progress}%` }} />
                  </View>
                  <Text className="charity-project-card__progress-text">{p.progress}%</Text>
                </View>
                <View className="charity-project-card__footer">
                  <Text className="charity-project-card__participants">👥 {p.participants.toLocaleString()} 人参与</Text>
                  <View className="charity-project-card__donate-btn" onClick={() => handleDonate(p.name)}>
                    <Text>捐款</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 公益资讯 */}
        <View className="charity-section">
          <Text className="charity-section__title">📰 公益资讯</Text>
          {mockNews.map(n => (
            <View key={n.id} className="charity-news-item">
              <Image src={n.cover} className="charity-news-item__cover" />
              <View className="charity-news-item__body">
                <Text className="charity-news-item__title">{n.title}</Text>
                <Text className="charity-news-item__time">{n.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Charity.displayName = 'Charity'
Charity.config = { navigationStyle: 'custom' } as any
export default Charity
