import { View, Text, ScrollView, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const NotifySettings = memo(() => {
  const { prefs, setPrefs } = useAppStore()

  const items = [
    { key: 'like' as const, label: '点赞通知', desc: '有人赞你的动态时通知' },
    { key: 'comment' as const, label: '评论通知', desc: '有人评论你的动态时通知' },
    { key: 'follow' as const, label: '关注通知', desc: '有人关注你时通知' },
    { key: 'system' as const, label: '系统通知', desc: '系统消息与公告' },
    { key: 'chat' as const, label: '私信通知', desc: '收到新私信时通知' },
  ]

  const handleChange = useCallback((key: keyof typeof prefs, val: boolean) => {
    setPrefs({ [key]: val })
    Taro.showToast({ title: val ? '已开启' : '已关闭', icon: 'none' })
  }, [setPrefs])

  return (
    <View className="notifset-page">
      <NavBar title="通知设置" showBack />
      <ScrollView scrollY className="notifset-page__body">
        <View className="notifset-page__group">
          {items.map((item) => (
            <View key={item.key} className="notifset-page__item">
              <View className="notifset-page__info">
                <Text className="notifset-page__label">{item.label}</Text>
                <Text className="notifset-page__desc">{item.desc}</Text>
              </View>
              <Switch
                checked={prefs[item.key]}
                color="#FF4757"
                onChange={(e) => handleChange(item.key, e.detail.value)}
              />
            </View>
          ))}
        </View>
        <View className="notifset-page__hint">
          <Text className="notifset-page__hint-text">关闭后将不再收到该类消息的推送提醒</Text>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

NotifySettings.config = { navigationStyle: 'custom' } as any
NotifySettings.displayName = 'NotifySettings'
export default NotifySettings
