import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const steps = [
  { icon: '📲', title: '分享邀请链接', desc: '把邀请链接/海报发给好友' },
  { icon: '👤', title: '好友注册', desc: '好友通过链接注册社区' },
  { icon: '🎁', title: '获得奖励', desc: '双方各得 50 金币 + 优惠券' },
]

const Invite = memo(() => {
  const handleCopy = useCallback(() => {
    Taro.setClipboardData({ data: 'https://community.example.com/invite?uid=user_001&code=VIP2026' })
  }, [])

  const handleShare = useCallback(() => {
    Taro.showToast({ title: '分享面板已唤起', icon: 'none' })
  }, [])

  return (
    <View className="invite-page">
      <NavBar title="邀请有礼" showBack />
      <ScrollView scrollY className="invite-page__body">
        <View className="invite-page__hero">
          <Text className="invite-page__hero-icon">🎉</Text>
          <Text className="invite-page__hero-title">邀请好友，双双得利</Text>
          <Text className="invite-page__hero-desc">每成功邀请 1 位好友，你和好友各得 50 金币</Text>
        </View>

        <View className="invite-page__steps">
          {steps.map((s, i) => (
            <View key={s.title} className="invite-page__step">
              <View className="invite-page__step-num">
                <Text className="invite-page__step-num-text">{i + 1}</Text>
              </View>
              <Text className="invite-page__step-icon">{s.icon}</Text>
              <View className="invite-page__step-info">
                <Text className="invite-page__step-title">{s.title}</Text>
                <Text className="invite-page__step-desc">{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="invite-page__card" onClick={handleCopy}>
          <Text className="invite-page__card-label">我的邀请码</Text>
          <Text className="invite-page__card-code">VIP2026</Text>
          <Text className="invite-page__card-tip">点击复制邀请链接</Text>
        </View>

        <View className="invite-page__record">
          <Text className="invite-page__record-title">邀请记录</Text>
          <View className="invite-page__record-empty">
            <Text className="invite-page__record-empty-text">还没有邀请记录，快去分享吧</Text>
          </View>
        </View>

        <View className="invite-page__share" onClick={handleShare}>
          <Text className="invite-page__share-text">分享给好友</Text>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Invite.config = { navigationStyle: 'custom' } as any
Invite.displayName = 'Invite'
export default Invite
