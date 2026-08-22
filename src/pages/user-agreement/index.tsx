import { View, Text, ScrollView } from '@tarojs/components'
import { memo } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const sections = [
  { title: '第一条 协议的接受', desc: '欢迎使用微信社区小程序。当您注册、登录或使用本产品时，即表示您已阅读、理解并同意本协议的全部内容。' },
  { title: '第二条 账号注册', desc: '您应使用真实、合法的信息注册账号。账号仅限本人使用，不得转让、出借或出售。因保管不善导致的损失由您自行承担。' },
  { title: '第三条 用户行为规范', desc: '您承诺在使用本产品过程中遵守法律法规，不得发布违法信息，不得利用本产品从事任何违法违规活动。' },
  { title: '第四条 内容版权', desc: '您在本平台发布的原创内容，著作权归您所有；您授权平台在合理范围内进行展示、传播与推广。' },
  { title: '第五条 积分与虚拟财产', desc: '积分、金币等虚拟财产仅限本平台内使用，不可兑换现金，不可转让。' },
  { title: '第六条 服务的变更与终止', desc: '平台有权根据业务发展调整或终止部分服务，并将提前以合理方式通知用户。' },
  { title: '第七条 免责声明', desc: '用户间因社交互动产生的纠纷，平台将尽力协助调解，但不承担由此产生的直接或间接责任。' },
  { title: '第八条 协议的修订', desc: '平台可适时修订本协议，修订后的协议将在平台公示，继续使用即视为接受修订内容。' },
]

const UserAgreement = memo(() => {
  return (
    <View className="agreement-page">
      <NavBar title="用户协议" showBack />
      <ScrollView scrollY className="agreement-page__body">
        <View className="agreement-page__header">
          <Text className="agreement-page__title">微信社区用户协议</Text>
          <Text className="agreement-page__meta">更新日期：2026 年 8 月 22 日</Text>
        </View>
        {sections.map((s) => (
          <View key={s.title} className="agreement-page__section">
            <Text className="agreement-page__section-title">{s.title}</Text>
            <Text className="agreement-page__section-desc">{s.desc}</Text>
          </View>
        ))}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

UserAgreement.config = { navigationStyle: 'custom' } as any
UserAgreement.displayName = 'UserAgreement'
export default UserAgreement
