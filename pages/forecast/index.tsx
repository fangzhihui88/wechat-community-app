import { memo, useState } from 'react'
import { View, Text, ScrollView, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const signs = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
const dimensions = ['爱情', '事业', '财运', '健康'] as const
const colors = ['🔴红色', '🟠橙色', '🟡黄色', '🟢绿色', '🔵蓝色', '🟣紫色', '⚪白色', '⚫黑色']
const luckyNums = [3, 7, 9, 12, 18, 21, 24, 36, 42, 48, 66, 88]

const mockFortunes: Record<string, { overall: string; ratings: Record<string, number> }> = {
  '白羊座': { overall: '今日运势极佳，行动力满满，适合开展新计划！', ratings: { '爱情': 4, '事业': 5, '财运': 3, '健康': 4 } },
  '金牛座': { overall: '稳定的一天，适合理财和享受美食，财运小有收获。', ratings: { '爱情': 3, '事业': 4, '财运': 5, '健康': 3 } },
  '双子座': { overall: '思维活跃，社交运佳，容易遇到志同道合的朋友。', ratings: { '爱情': 4, '事业': 3, '财运': 3, '健康': 4 } },
  '巨蟹座': { overall: '家庭运上升，与家人相处愉快，适合整理居住环境。', ratings: { '爱情': 5, '事业': 3, '财运': 3, '健康': 5 } },
  '狮子座': { overall: '自信满满，容易成为人群焦点，适合表现自己。', ratings: { '爱情': 4, '事业': 5, '财运': 4, '健康': 3 } },
  '处女座': { overall: '注重细节的一天，工作上会有突破，健康需要注意肠胃。', ratings: { '爱情': 3, '事业': 5, '财运': 3, '健康': 3 } },
  '天秤座': { overall: '人际和谐，适合谈判和社交，财运平稳。', ratings: { '爱情': 5, '事业': 4, '财运': 4, '健康': 4 } },
  '天蝎座': { overall: '直觉敏锐，适合深入思考和探索，财运有惊喜。', ratings: { '爱情': 4, '事业': 4, '财运': 5, '健康': 3 } },
  '射手座': { overall: '充满活力，适合出行和冒险，单身者桃花运佳。', ratings: { '爱情': 5, '事业': 3, '财运': 3, '健康': 5 } },
  '摩羯座': { overall: '脚踏实地，工作上有进展，感情上需要多沟通。', ratings: { '爱情': 3, '事业': 5, '财运': 4, '健康': 4 } },
  '水瓶座': { overall: '创意十足，适合艺术创作，财运有小波动。', ratings: { '爱情': 4, '事业': 4, '财运': 3, '健康': 4 } },
  '双鱼座': { overall: '感性温柔，适合艺术创作和浪漫约会，注意休息。', ratings: { '爱情': 5, '事业': 3, '财运': 3, '健康': 4 } },
}

const Forecast = memo(() => {
  const [signIdx, setSignIdx] = useState(0)
  const sign = signs[signIdx]
  const fortune = mockFortunes[sign]
  const luckyColor = colors[signIdx % colors.length]
  const luckyNum = luckyNums[signIdx % luckyNums.length]

  const handleShare = () => {
    Taro.showShareMenu({ withShareTicket: true })
    Taro.showToast({ title: '分享运势给好友', icon: 'none' })
  }

  return (
    <View className="page forecast-page">
      <NavBar title="生活预测" showBack />
      <ScrollView scrollY className="forecast-page__scroll">

        {/* 星座选择 */}
        <View className="forecast-picker-wrap">
          <Picker mode="selector" range={signs} value={signIdx} onChange={(e) => setSignIdx(Number(e.detail.value))}>
            <View className="forecast-picker">
              <Text className="forecast-picker__label">选择星座</Text>
              <View className="forecast-picker__value">
                <Text>{sign}</Text>
                <Text className="forecast-picker__arrow">▼</Text>
              </View>
            </View>
          </Picker>
        </View>

        {/* 今日运势卡 */}
        <View className="forecast-card forecast-card--today">
          <View className="forecast-card__header">
            <Text className="forecast-card__title">🌟 今日运势</Text>
            <Text className="forecast-card__sign">{sign}</Text>
          </View>
          <Text className="forecast-card__overall">{fortune.overall}</Text>

          {/* 各维度星级 */}
          <View className="forecast-dimensions">
            {dimensions.map(dim => (
              <View key={dim} className="forecast-dim">
                <Text className="forecast-dim__label">{dim}</Text>
                <Text className="forecast-dim__stars">{'⭐'.repeat(fortune.ratings[dim])}{'☆'.repeat(5 - fortune.ratings[dim])}</Text>
              </View>
            ))}
          </View>

          {/* 幸运信息 */}
          <View className="forecast-lucky">
            <View className="forecast-lucky__item">
              <Text className="forecast-lucky__label">幸运色</Text>
              <Text className="forecast-lucky__value">{luckyColor}</Text>
            </View>
            <View className="forecast-lucky__divider" />
            <View className="forecast-lucky__item">
              <Text className="forecast-lucky__label">幸运数</Text>
              <Text className="forecast-lucky__value">🔢 {luckyNum}</Text>
            </View>
          </View>
        </View>

        {/* 明日预览 */}
        <View className="forecast-card forecast-card--tomorrow">
          <Text className="forecast-card__title">📅 明日预览</Text>
          <Text className="forecast-card__overall">明日运势总体平稳，适合巩固今日成果。人际关系上可能会有小惊喜哦！</Text>
        </View>

        {/* 分享按钮 */}
        <View className="forecast-share-btn" onClick={handleShare}>
          <Text>🔗 分享运势给好友</Text>
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Forecast.displayName = 'Forecast'
Forecast.config = { navigationStyle: 'custom' } as any
export default Forecast
