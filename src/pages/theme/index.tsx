import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const Theme = memo(() => {
  const { themeMode, setTheme, toggleTheme } = useAppStore()

  const handleSelect = useCallback((mode: 'light' | 'dark') => {
    setTheme(mode)
    Taro.showToast({ title: mode === 'dark' ? '已切换至深色模式' : '已切换至浅色模式', icon: 'none' })
  }, [setTheme])

  return (
    <View className="theme-page">
      <NavBar title="主题设置" showBack />
      <ScrollView scrollY className="theme-page__body">
        <View className="theme-page__preview">
          <View className={`theme-page__preview-card ${themeMode === 'dark' ? 'theme-page__preview-card--dark' : ''}`}>
            <Text className="theme-page__preview-title">社区</Text>
            <Text className="theme-page__preview-text">预览效果</Text>
            <View className="theme-page__preview-btn" />
          </View>
        </View>

        <View className="theme-page__list">
          <View className={`theme-page__item ${themeMode === 'light' ? 'theme-page__item--active' : ''}`} onClick={() => handleSelect('light')}>
            <Text className="theme-page__item-icon">☀️</Text>
            <Text className="theme-page__item-label">浅色模式</Text>
            {themeMode === 'light' && <Text className="theme-page__item-check">✓</Text>}
          </View>
          <View className={`theme-page__item ${themeMode === 'dark' ? 'theme-page__item--active' : ''}`} onClick={() => handleSelect('dark')}>
            <Text className="theme-page__item-icon">🌙</Text>
            <Text className="theme-page__item-label">深色模式</Text>
            {themeMode === 'dark' && <Text className="theme-page__item-check">✓</Text>}
          </View>
          <View className="theme-page__item" onClick={toggleTheme}>
            <Text className="theme-page__item-icon">🔄</Text>
            <Text className="theme-page__item-label">跟随系统</Text>
            <Text className="theme-page__item-arrow">›</Text>
          </View>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Theme.config = { navigationStyle: 'custom' } as any
Theme.displayName = 'Theme'
export default Theme
