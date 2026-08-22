import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import './index.css'

const Profile = memo(() => {
  const { currentUser, themeMode, toggleTheme, likedPosts } = useAppStore()

  const stats = [
    { label: '动态', value: currentUser?.posts ?? 0 },
    { label: '关注', value: currentUser?.following ?? 0, url: '/pages/following/index' },
    { label: '粉丝', value: currentUser?.followers ?? 0, url: '/pages/followers/index' },
  ]

  const entries = [
    { icon: '🖼', label: '我的相册', url: '/pages/gallery/index' },
    { icon: '❤️', label: '我赞过的', count: likedPosts.length, url: '/pages/profile/index' },
    { icon: '💬', label: '我的私信', url: '/pages/chat/index' },
    { icon: '⭐️', label: '我的收藏', url: '/pages/profile/index' },
    { icon: '🌙', label: '黑夜模式', isSwitch: true },
    { icon: '⚙️', label: '设置', url: '/pages/settings/index' },
  ]

  const handleNav = useCallback((url?: string) => {
    if (url) Taro.navigateTo({ url })
  }, [])

  return (
    <View className="profile-page">
      <View className="profile-page__nav safe-area-top">
        <View className="profile-page__nav-content">
          <Text className="profile-page__title">我的</Text>
          <View className="profile-page__settings" onClick={() => Taro.navigateTo({ url: '/pages/settings/index' })}>
            <Text className="profile-page__settings-icon">⚙️</Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY className="profile-page__body">
        {/* 用户信息 */}
        <View className="profile-header">
          <View className="profile-header__avatar">
            <Text className="profile-header__avatar-text">🙂</Text>
            {currentUser?.isVip && <View className="profile-header__vip"><Text className="profile-header__vip-text">VIP</Text></View>}
          </View>
          <View className="profile-header__info">
            <View className="profile-header__name-row">
              <Text className="profile-header__name">{currentUser?.nickname}</Text>
            </View>
            <Text className="profile-header__bio">{currentUser?.bio}</Text>
            <Text className="profile-header__location">📍 {currentUser?.location}</Text>
          </View>
        </View>

        {/* 统计 */}
        <View className="profile-stats">
          {stats.map((s) => (
            <View
              key={s.label}
              className="profile-stat"
              onClick={() => s.url && Taro.navigateTo({ url: s.url })}
            >
              <Text className="profile-stat__value">{s.value}</Text>
              <Text className="profile-stat__label">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* 快捷入口 */}
        <View className="profile-entries">
          {entries.map((e) => (
            <View
              key={e.label}
              className="profile-entry"
              onClick={() => {
                if (e.isSwitch) toggleTheme()
                else handleNav(e.url)
              }}
            >
              <Text className="profile-entry__icon">{e.icon}</Text>
              <Text className="profile-entry__label">{e.label}</Text>
              {e.isSwitch ? (
                <Text className={`profile-entry__value ${themeMode === 'dark' ? 'profile-entry__value--on' : ''}`}>
                  {themeMode === 'dark' ? '已开' : '关'}
                </Text>
              ) : e.count !== undefined ? (
                <Text className="profile-entry__value">{e.count}</Text>
              ) : (
                <Text className="profile-entry__arrow">›</Text>
              )}
            </View>
          ))}
        </View>

        <View className="profile-page__edit" onClick={() => Taro.navigateTo({ url: '/pages/edit-profile/index' })}>
          <Text className="profile-page__edit-text">编辑个人资料</Text>
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Profile.config = { navigationStyle: 'custom' } as any
Profile.displayName = 'Profile'
export default Profile
