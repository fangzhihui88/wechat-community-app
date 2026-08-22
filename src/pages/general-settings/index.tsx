import { View, Text, ScrollView, Switch, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const GeneralSettings = memo(() => {
  const { settings, setSettings } = useAppStore()

  const handleSwitch = useCallback((key: 'saveDataMode' | 'soundOn' | 'vibrateOn' | 'hideOnline', val: boolean) => {
    setSettings({ [key]: val })
  }, [setSettings])

  const handleFontSize = useCallback((e: any) => {
    const sizes = ['small', 'medium', 'large']
    setSettings({ fontSize: sizes[Number(e.detail.value)] as any })
  }, [setSettings])

  return (
    <View className="genset-page">
      <NavBar title="通用设置" showBack />
      <ScrollView scrollY className="genset-page__body">
        <View className="genset-page__group">
          <View className="genset-page__item">
            <Text className="genset-page__label">字体大小</Text>
            <Picker mode="selector" range={['小', '标准', '大']} onChange={handleFontSize}>
              <View className="genset-page__picker">
                <Text className="genset-page__picker-value">
                  {settings.fontSize === 'small' ? '小' : settings.fontSize === 'large' ? '大' : '标准'}
                </Text>
                <Text className="genset-page__picker-arrow">›</Text>
              </View>
            </Picker>
          </View>
          <View className="genset-page__item">
            <Text className="genset-page__label">省流量模式</Text>
            <Switch checked={settings.saveDataMode} color="#FF4757" onChange={(e) => handleSwitch('saveDataMode', e.detail.value)} />
          </View>
          <View className="genset-page__item">
            <Text className="genset-page__label">提示音</Text>
            <Switch checked={settings.soundOn} color="#FF4757" onChange={(e) => handleSwitch('soundOn', e.detail.value)} />
          </View>
          <View className="genset-page__item">
            <Text className="genset-page__label">震动反馈</Text>
            <Switch checked={settings.vibrateOn} color="#FF4757" onChange={(e) => handleSwitch('vibrateOn', e.detail.value)} />
          </View>
          <View className="genset-page__item">
            <Text className="genset-page__label">隐藏在线状态</Text>
            <Switch checked={settings.hideOnline} color="#FF4757" onChange={(e) => handleSwitch('hideOnline', e.detail.value)} />
          </View>
        </View>

        <View className="genset-page__group">
          <View className="genset-page__item" onClick={() => Taro.navigateTo({ url: '/pages/language/index' })}>
            <Text className="genset-page__label">语言</Text>
            <View className="genset-page__picker">
              <Text className="genset-page__picker-value">简体中文</Text>
              <Text className="genset-page__picker-arrow">›</Text>
            </View>
          </View>
          <View className="genset-page__item" onClick={() => Taro.navigateTo({ url: '/pages/theme/index' })}>
            <Text className="genset-page__label">主题设置</Text>
            <View className="genset-page__picker">
              <Text className="genset-page__picker-value">跟随系统/手动</Text>
              <Text className="genset-page__picker-arrow">›</Text>
            </View>
          </View>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

GeneralSettings.config = { navigationStyle: 'custom' } as any
GeneralSettings.displayName = 'GeneralSettings'
export default GeneralSettings
