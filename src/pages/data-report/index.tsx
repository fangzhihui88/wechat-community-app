import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

interface Stat {
  label: string
  value: string
  trend: string
}

interface Record {
  date: string
  fans: number
  reads: number
  likes: number
  interaction: number
}

const DataReportPage: React.FC = () => {
  const [stats] = useState<Stat[]>([
    { label: '粉丝数', value: '12,840', trend: '+128' },
    { label: '阅读量', value: '86,520', trend: '+2.3k' },
    { label: '获赞数', value: '5,672', trend: '+89' },
    { label: '互动数', value: '3,410', trend: '+56' },
  ])

  const [records] = useState<Record[]>([
    { date: '08-22', fans: 12, reads: 865, likes: 56, interaction: 34 },
    { date: '08-21', fans: 15, reads: 932, likes: 61, interaction: 42 },
    { date: '08-20', fans: 8, reads: 788, likes: 48, interaction: 28 },
    { date: '08-19', fans: 22, reads: 1102, likes: 72, interaction: 51 },
    { date: '08-18', fans: 11, reads: 920, likes: 55, interaction: 39 },
  ])

  return (
    <View className="page">
      <NavBar title="数据中心" showBack />
      <View className="page__body">
        {/* 顶部统计卡 */}
        <View className="stats-grid">
          {stats.map((s, i) => (
            <View className="stat-card" key={i}>
              <Text className="stat-card__value">{s.value}</Text>
              <Text className="stat-card__label">{s.label}</Text>
              <Text className="stat-card__trend">{s.trend}</Text>
            </View>
          ))}
        </View>

        {/* 趋势占位图 */}
        <View className="mp-section" style={{ marginTop: 'var(--spacing-lg)' }}>
          <Text className="mp-section__title">数据趋势</Text>
          <View className="trend-chart">
            <View className="trend-chart__area">
              <View className="trend-chart__fill" />
              <View className="trend-chart__grid">
                {[0, 1, 2, 3].map(i => (
                  <View className="trend-chart__grid-line" key={i} />
                ))}
              </View>
            </View>
            <View className="trend-chart__labels">
              <Text>08-18</Text>
              <Text>08-19</Text>
              <Text>08-20</Text>
              <Text>08-21</Text>
              <Text>08-22</Text>
            </View>
          </View>
        </View>

        {/* 近期数据列表 */}
        <View className="mp-section" style={{ marginTop: 'var(--spacing-lg)' }}>
          <Text className="mp-section__title">近期数据</Text>
          <View className="data-list">
            {records.map((r, i) => (
              <View className="data-row" key={i}>
                <Text className="data-row__date">{r.date}</Text>
                <View className="data-row__values">
                  <View className="data-row__item">
                    <Text className="data-row__num">{r.fans}</Text>
                    <Text className="data-row__key">粉丝</Text>
                  </View>
                  <View className="data-row__item">
                    <Text className="data-row__num">{r.reads}</Text>
                    <Text className="data-row__key">阅读</Text>
                  </View>
                  <View className="data-row__item">
                    <Text className="data-row__num">{r.likes}</Text>
                    <Text className="data-row__key">点赞</Text>
                  </View>
                  <View className="data-row__item">
                    <Text className="data-row__num">{r.interaction}</Text>
                    <Text className="data-row__key">互动</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

DataReportPage.config = { navigationStyle: 'custom' } as any
DataReportPage.displayName = 'DataReportPage'

export default memo(DataReportPage)
