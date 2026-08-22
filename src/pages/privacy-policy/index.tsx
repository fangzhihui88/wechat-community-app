import { View, Text, ScrollView } from '@tarojs/components'
import { memo } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const sections = [
  { title: '一、我们收集的信息', desc: '为向你提供服务，我们可能收集：账号信息（昵称、头像）、设备信息、位置信息（仅在你授权后）、使用记录等。' },
  { title: '二、信息的使用', desc: '我们使用收集的信息用于：提供核心功能、优化产品体验、安全风控、消息推送（可关闭）等。' },
  { title: '三、信息的共享', desc: '我们不会向第三方出售你的个人信息。仅在法律法规要求、获得你明确同意或为提供服务所必需时共享。' },
  { title: '四、信息的存储', desc: '你的信息存储于境内服务器。我们将采取加密等技术手段保护你的数据安全。' },
  { title: '五、你的权利', desc: '你可以随时查看、修改、导出或删除你的个人信息，也可注销账号（注销后数据将依法删除）。' },
  { title: '六、未成年人保护', desc: '若你是未满 14 周岁的未成年人，请在监护人陪同下使用本产品。' },
  { title: '七、政策更新', desc: '本政策如有重大变更，我们将通过站内通知等方式告知，并重新征求你的同意。' },
  { title: '八、联系我们', desc: '如对本政策有任何疑问，可通过「设置 → 意见反馈」与我们联系。' },
]

const PrivacyPolicy = memo(() => {
  return (
    <View className="privacy-policy-page">
      <NavBar title="隐私政策" showBack />
      <ScrollView scrollY className="privacy-policy-page__body">
        <View className="privacy-policy-page__header">
          <Text className="privacy-policy-page__title">隐私政策</Text>
          <Text className="privacy-policy-page__meta">生效日期：2026 年 8 月 22 日</Text>
        </View>
        {sections.map((s) => (
          <View key={s.title} className="privacy-policy-page__section">
            <Text className="privacy-policy-page__section-title">{s.title}</Text>
            <Text className="privacy-policy-page__section-desc">{s.desc}</Text>
          </View>
        ))}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

PrivacyPolicy.config = { navigationStyle: 'custom' } as any
PrivacyPolicy.displayName = 'PrivacyPolicy'
export default PrivacyPolicy
