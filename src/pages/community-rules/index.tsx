import { View, Text, ScrollView } from '@tarojs/components'
import { memo } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const rules = [
  { title: '一、友善交流', desc: '尊重每一位用户，禁止人身攻击、辱骂、歧视等不友善行为。' },
  { title: '二、内容规范', desc: '禁止发布违法违规、色情低俗、虚假广告、侵权等内容。' },
  { title: '三、尊重原创', desc: '转载内容请注明出处，尊重他人知识产权与劳动成果。' },
  { title: '四、保护隐私', desc: '未经他人同意，不得公开他人隐私信息（照片、住址、联系方式等）。' },
  { title: '五、拒绝灌水', desc: '禁止刷屏、刷赞、恶意举报等影响社区秩序的行为。' },
  { title: '六、活动参与', desc: '参与社区活动请遵守活动规则，诚信参与，杜绝作弊。' },
  { title: '七、违规处理', desc: '违反公约将视情节给予警告、删帖、禁言、封号等处理。' },
]

const CommunityRules = memo(() => {
  return (
    <View className="rules-page">
      <NavBar title="社区公约" showBack />
      <ScrollView scrollY className="rules-page__body">
        <View className="rules-page__header">
          <Text className="rules-page__title">社区公约</Text>
          <Text className="rules-page__subtitle">共建温暖、友善、有价值的社区</Text>
        </View>
        <View className="rules-page__list">
          {rules.map((r) => (
            <View key={r.title} className="rules-page__item">
              <Text className="rules-page__item-title">{r.title}</Text>
              <Text className="rules-page__item-desc">{r.desc}</Text>
            </View>
          ))}
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

CommunityRules.config = { navigationStyle: 'custom' } as any
CommunityRules.displayName = 'CommunityRules'
export default CommunityRules
