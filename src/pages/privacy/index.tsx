import { View, Text, ScrollView, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const Privacy = memo(() => {
  const [state, setState] = useState({
    showProfile: true,
    showLocation: false,
    allowSearch: true,
    allowRecommend: true,
    showOnline: false,
  })

  const handleToggle = useCallback((key: keyof typeof state) => {
    setState((s) => ({ ...s, [key]: !s[key] }))
  }, [])

  const items: { key: keyof typeof state; label: string; desc: string }[] = [
    { key: 'showProfile', label: '公开个人主页', desc: '允许他人查看你的主页' },
    { key: 'showLocation', label: '展示所在位置', desc: '在动态中展示位置信息' },
    { key: 'allowSearch', label: '允许被搜索', desc: '可通过昵称被搜索到' },
    { key: 'allowRecommend', label: '允许被推荐', desc: '在推荐列表中展示' },
    { key: 'showOnline', label: '展示在线状态', desc: '显示当前是否在线' },
  ]

  return (
    <View className="privacy-page">
      <NavBar title="隐私设置" showBack />
      <ScrollView scrollY className="privacy-page__body">
        <View className="privacy-page__group">
          {items.map((item) => (
            <View key={item.key} className="privacy-page__item">
              <View className="privacy-page__info">
                <Text className="privacy-page__label">{item.label}</Text>
                <Text className="privacy-page__desc">{item.desc}</Text>
              </View>
              <Switch checked={state[item.key]} color="#FF4757" onChange={() => handleToggle(item.key)} />
            </View>
          ))}
        </View>
        <View className="privacy-page__group" onClick={() => Taro.navigateTo({ url: '/pages/blocked/index' })}>
          <View className="privacy-page__item">
            <View className="privacy-page__info">
              <Text className="privacy-page__label">屏蔽管理</Text>
              <Text className="privacy-page__desc">管理屏蔽的关键词与话题</Text>
            </View>
            <Text className="privacy-page__arrow">›</Text>
          </View>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Privacy.config = { navigationStyle: 'custom' } as any
Privacy.displayName = 'Privacy'
export default Privacy
