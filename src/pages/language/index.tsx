import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const langs = [
  { key: 'zh-CN', label: '简体中文', desc: '默认语言' },
  { key: 'zh-TW', label: '繁體中文', desc: '繁體中文介面' },
  { key: 'en', label: 'English', desc: 'English interface' },
]

const Language = memo(() => {
  const [current, setCurrent] = useState('zh-CN')

  const handleSelect = useCallback((key: string) => {
    setCurrent(key)
    Taro.showToast({ title: '语言已切换', icon: 'success' })
  }, [])

  return (
    <View className="language-page">
      <NavBar title="语言设置" showBack />
      <ScrollView scrollY className="language-page__body">
        <View className="language-page__list">
          {langs.map((l) => (
            <View key={l.key} className="language-page__item" onClick={() => handleSelect(l.key)}>
              <View className="language-page__info">
                <Text className="language-page__label">{l.label}</Text>
                <Text className="language-page__desc">{l.desc}</Text>
              </View>
              <View className={`language-page__radio ${current === l.key ? 'language-page__radio--active' : ''}`}>
                {current === l.key && <View className="language-page__radio-dot" />}
              </View>
            </View>
          ))}
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Language.config = { navigationStyle: 'custom' } as any
Language.displayName = 'Language'
export default Language
