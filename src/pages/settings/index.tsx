import { View, Text, Switch } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

interface RowItem {
  label: string
  type: 'switch' | 'arrow' | 'text'
  value?: string
  onClick?: () => void
  onSwitch?: (v: boolean) => void
}

const Settings = memo(() => {
  const { themeMode, toggleTheme } = useAppStore()
  const isDark = themeMode === 'dark'

  const groups: { title: string; items: RowItem[] }[] = [
    {
      title: '通用',
      items: [
        { label: '黑夜模式', type: 'switch', onSwitch: () => toggleTheme() },
        { label: '清除缓存', type: 'arrow', onClick: () => Taro.showToast({ title: '缓存已清除', icon: 'success' }) },
        { label: '消息通知', type: 'arrow', onClick: () => Taro.switchTab({ url: '/pages/message/index' }) },
      ],
    },
    {
      title: '账号',
      items: [
        { label: '编辑资料', type: 'arrow', onClick: () => Taro.navigateTo({ url: '/pages/edit-profile/index' }) },
        { label: '我的相册', type: 'arrow', onClick: () => Taro.navigateTo({ url: '/pages/gallery/index' }) },
      ],
    },
    {
      title: '关于',
      items: [
        { label: '关于社区', type: 'arrow', onClick: () => Taro.showModal({ title: '源头社区', content: '版本 v1.0.0\n一个用 React + Taro 构建的社区小程序 Demo' }) },
        { label: '检查更新', type: 'arrow', onClick: () => Taro.showToast({ title: '已是最新版本', icon: 'none' }) },
        { label: '退出登录', type: 'arrow', value: '', onClick: () => {
          Taro.showModal({
            title: '提示', content: '确定退出登录吗？',
            success: (res) => { if (res.confirm) Taro.showToast({ title: '已退出', icon: 'none' }) },
          })
        } },
      ],
    },
  ]

  return (
    <View className="settings-page">
      <NavBar title="设置" showBack />
      <View className="settings-page__body">
        {groups.map((group, gi) => (
          <View key={gi} className="settings-group">
            <Text className="settings-group__title">{group.title}</Text>
            <View className="settings-group__card">
              {group.items.map((item, ii) => (
                <View
                  key={ii}
                  className={`settings-item ${ii < group.items.length - 1 ? 'settings-item--border' : ''}`}
                  onClick={item.onClick}
                >
                  <Text className="settings-item__label">{item.label}</Text>
                  <View className="settings-item__right">
                    {item.type === 'switch' && (
                      <Switch checked={isDark} onChange={item.onSwitch} color="#FF4757" />
                    )}
                    {item.type === 'arrow' && <Text className="settings-item__arrow">›</Text>}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
        <View className="settings-page__footer">
          <Text className="settings-page__version">源头社区 v1.0.0</Text>
        </View>
      </View>
    </View>
  )
})

Settings.config = { navigationStyle: 'custom' } as any
Settings.displayName = 'Settings'
export default Settings
