import { View, Text, Textarea, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const types = ['功能建议', '体验问题', '内容举报', '其他']

const Feedback = memo(() => {
  const [type, setType] = useState(0)
  const [content, setContent] = useState('')
  const [contact, setContact] = useState('')

  const handleSubmit = useCallback(() => {
    if (!content.trim()) {
      Taro.showToast({ title: '请填写反馈内容', icon: 'none' })
      return
    }
    Taro.showToast({ title: '提交成功，感谢反馈！', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 800)
  }, [content])

  return (
    <View className="feedback-page">
      <NavBar title="意见反馈" showBack />
      <ScrollView scrollY className="feedback-page__body">
        <View className="feedback-page__types">
          {types.map((t, i) => (
            <View key={t} className={`feedback-page__type ${type === i ? 'feedback-page__type--active' : ''}`} onClick={() => setType(i)}>
              <Text className="feedback-page__type-text">{t}</Text>
            </View>
          ))}
        </View>

        <View className="feedback-page__card">
          <Text className="feedback-page__label">反馈内容</Text>
          <Textarea
            className="feedback-page__textarea"
            placeholder="请详细描述你的问题或建议（必填）"
            value={content}
            maxlength={500}
            onInput={(e) => setContent(e.detail.value)}
          />
          <Text className="feedback-page__count">{content.length}/500</Text>
        </View>

        <View className="feedback-page__card">
          <Text className="feedback-page__label">联系方式（选填）</Text>
          <Textarea
            className="feedback-page__textarea feedback-page__textarea--short"
            placeholder="手机号 / 微信号 / QQ"
            value={contact}
            maxlength={50}
            onInput={(e) => setContact(e.detail.value)}
          />
        </View>

        <View className="feedback-page__submit" onClick={handleSubmit}>
          <Text className="feedback-page__submit-text">提交反馈</Text>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Feedback.config = { navigationStyle: 'custom' } as any
Feedback.displayName = 'Feedback'
export default Feedback
