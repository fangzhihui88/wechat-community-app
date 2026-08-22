import { View, Text, Textarea, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const reasons = ['垃圾广告', '色情低俗', '人身攻击', '虚假信息', '侵犯隐私', '其他']

const Report = memo(() => {
  const [reason, setReason] = useState(0)
  const [detail, setDetail] = useState('')

  const handleSubmit = useCallback(() => {
    Taro.showToast({ title: '举报已提交，我们会尽快处理', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 800)
  }, [])

  return (
    <View className="report-page">
      <NavBar title="举报中心" showBack />
      <ScrollView scrollY className="report-page__body">
        <View className="report-page__hint">
          <Text className="report-page__hint-text">请选择举报原因，我们会严格保护你的隐私</Text>
        </View>

        <View className="report-page__reasons">
          {reasons.map((r, i) => (
            <View key={r} className={`report-page__reason ${reason === i ? 'report-page__reason--active' : ''}`} onClick={() => setReason(i)}>
              <View className={`report-page__radio ${reason === i ? 'report-page__radio--active' : ''}`}>
                {reason === i && <View className="report-page__radio-dot" />}
              </View>
              <Text className="report-page__reason-text">{r}</Text>
            </View>
          ))}
        </View>

        <View className="report-page__card">
          <Text className="report-page__label">补充说明（选填）</Text>
          <Textarea
            className="report-page__textarea"
            placeholder="请描述具体情况，帮助我们更快处理"
            value={detail}
            maxlength={300}
            onInput={(e) => setDetail(e.detail.value)}
          />
        </View>

        <View className="report-page__submit" onClick={handleSubmit}>
          <Text className="report-page__submit-text">提交举报</Text>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Report.config = { navigationStyle: 'custom' } as any
Report.displayName = 'Report'
export default Report
