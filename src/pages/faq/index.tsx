import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const Faq = memo(() => {
  const { faqs } = useAppStore()
  const [openId, setOpenId] = useState<string | null>(null)

  const handleContact = useCallback(() => {
    Taro.showToast({ title: '客服通道已开启', icon: 'none' })
  }, [])

  return (
    <View className="faq-page">
      <NavBar title="帮助中心" showBack />
      <ScrollView scrollY className="faq-page__body">
        <View className="faq-page__header">
          <Text className="faq-page__header-icon">💡</Text>
          <Text className="faq-page__header-title">常见问题</Text>
          <Text className="faq-page__header-desc">看看这里有没有你想要的答案</Text>
        </View>

        <View className="faq-page__list">
          {faqs.map((f) => (
            <View key={f.q} className="faq-page__item" onClick={() => setOpenId(openId === f.q ? null : f.q)}>
              <View className="faq-page__question">
                <Text className="faq-page__q-text">{f.q}</Text>
                <Text className={`faq-page__arrow ${openId === f.q ? 'faq-page__arrow--open' : ''}`}>▾</Text>
              </View>
              {openId === f.q && (
                <Text className="faq-page__answer animate-fade-in">{f.a}</Text>
              )}
            </View>
          ))}
        </View>

        <View className="faq-page__contact" onClick={handleContact}>
          <Text className="faq-page__contact-text">还没有解决？联系在线客服</Text>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Faq.config = { navigationStyle: 'custom' } as any
Faq.displayName = 'Faq'
export default Faq
