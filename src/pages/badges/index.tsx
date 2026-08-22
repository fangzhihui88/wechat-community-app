import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const Badges = memo(() => {
  const { badges } = useAppStore()
  const unlockedCount = badges.filter((b) => b.unlocked).length

  const handleShare = useCallback(() => {
    Taro.showToast({ title: '已复制分享链接', icon: 'success' })
  }, [])

  return (
    <View className="badges-page">
      <NavBar title="成就徽章" showBack />
      <ScrollView scrollY className="badges-page__body">
        <View className="badges-page__hero">
          <Text className="badges-page__hero-count">{unlockedCount}/{badges.length}</Text>
          <Text className="badges-page__hero-label">已解锁徽章</Text>
        </View>

        <View className="badges-page__grid">
          {badges.map((b) => (
            <View key={b.id} className={`badges-page__badge ${b.unlocked ? '' : 'badges-page__badge--locked'}`}>
              <View className="badges-page__badge-icon-wrap">
                <Text className="badges-page__badge-icon">{b.unlocked ? b.icon : '🔒'}</Text>
              </View>
              <Text className="badges-page__badge-name">{b.name}</Text>
              <Text className="badges-page__badge-desc">{b.desc}</Text>
            </View>
          ))}
        </View>

        <View className="badges-page__share" onClick={handleShare}>
          <Text className="badges-page__share-text">炫耀一下 →</Text>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Badges.config = { navigationStyle: 'custom' } as any
Badges.displayName = 'Badges'
export default Badges
