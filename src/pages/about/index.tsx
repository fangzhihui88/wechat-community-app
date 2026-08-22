import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const About = memo(() => {
  const handleCopy = useCallback(() => {
    Taro.setClipboardData({ data: 'https://github.com/fangzhihui88/yuantou-community' })
  }, [])

  const handleCheckUpdate = useCallback(() => {
    Taro.showToast({ title: '已是最新版本', icon: 'success' })
  }, [])

  return (
    <View className="about-page">
      <NavBar title="关于我们" showBack />
      <View className="about-page__body">
        <View className="about-page__logo">
          <Text className="about-page__logo-text">👥</Text>
        </View>
        <Text className="about-page__name">源头社区</Text>
        <Text className="about-page__version">版本 2.0.0</Text>
        <Text className="about-page__desc">
          一个集社交、内容分享、同城活动于一体的社区小程序。
          在这里发现有趣的人与事，分享你的每一刻。
        </Text>

        <View className="about-page__list">
          <View className="about-page__item" onClick={() => Taro.navigateTo({ url: '/pages/community-rules/index' })}>
            <Text className="about-page__item-label">社区公约</Text>
            <Text className="about-page__item-arrow">›</Text>
          </View>
          <View className="about-page__item" onClick={() => Taro.navigateTo({ url: '/pages/user-agreement/index' })}>
            <Text className="about-page__item-label">用户协议</Text>
            <Text className="about-page__item-arrow">›</Text>
          </View>
          <View className="about-page__item" onClick={() => Taro.navigateTo({ url: '/pages/privacy-policy/index' })}>
            <Text className="about-page__item-label">隐私政策</Text>
            <Text className="about-page__item-arrow">›</Text>
          </View>
          <View className="about-page__item" onClick={handleCheckUpdate}>
            <Text className="about-page__item-label">检查更新</Text>
            <Text className="about-page__item-arrow">›</Text>
          </View>
        </View>

        <View className="about-page__copy" onClick={handleCopy}>
          <Text className="about-page__copy-text">点击复制项目地址</Text>
        </View>
        <View className="safe-area-bottom" />
      </View>
    </View>
  )
})

About.config = { navigationStyle: 'custom' } as any
About.displayName = 'About'
export default About
