import { View, Text } from '@tarojs/components'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import EmptyState from '../../components/EmptyState'
import './index.css'

type FeedbackType = '功能建议' | 'Bug反馈' | '内容投诉' | '其他'
type FeedbackStatus = '处理中' | '已回复' | '已关闭'

interface Feedback {
  id: number
  type: FeedbackType
  content: string
  status: FeedbackStatus
  time: string
}

const FEEDBACKS: Feedback[] = [
  { id: 1, type: '功能建议', content: '希望增加夜间模式功能，方便晚上浏览内容', status: '已回复', time: '2026-08-20 14:32' },
  { id: 2, type: 'Bug反馈', content: '发布内容时图片上传经常失败', status: '处理中', time: '2026-08-19 09:15' },
  { id: 3, type: '内容投诉', content: '某用户发布的内容存在违规行为', status: '已关闭', time: '2026-08-18 20:05' },
  { id: 4, type: '功能建议', content: '希望能支持 Markdown 编辑器', status: '处理中', time: '2026-08-17 16:48' },
]

const getStatusColor = (status: FeedbackStatus) => {
  if (status === '已回复') return 'var(--color-primary)'
  if (status === '处理中') return '#FF9500'
  return 'var(--color-text-tertiary)'
}

const getTypeColor = (type: FeedbackType) => {
  if (type === 'Bug反馈') return '#FF3B30'
  if (type === '功能建议') return '#007AFF'
  if (type === '内容投诉') return '#FF9500'
  return 'var(--color-text-secondary)'
}

const FeedbackListPage: React.FC = () => {
  const [list] = useState<Feedback[]>(FEEDBACKS)

  if (list.length === 0) {
    return (
      <View className="page">
        <NavBar title="我的反馈" showBack />
        <View className="page__body">
          <EmptyState
            icon="💬"
            title="暂无反馈记录"
            description="您还没有提交过任何反馈内容"
          />
        </View>
      </View>
    )
  }

  return (
    <View className="page">
      <NavBar title="我的反馈" showBack />
      <View className="page__body">
        <View className="feedback-list">
          {list.map(item => (
            <View key={item.id} className="feedback-item">
              <View className="feedback-item__header">
                <View
                  className="mp-tag"
                  style={{
                    color: getTypeColor(item.type),
                    borderColor: getTypeColor(item.type),
                    fontSize: '12px',
                    padding: '2px 8px',
                  }}
                >
                  {item.type}
                </View>
                <View
                  className="mp-badge"
                  style={{
                    color: getStatusColor(item.status),
                    fontSize: '12px',
                    background: 'transparent',
                  }}
                >
                  {item.status}
                </View>
              </View>
              <Text className="feedback-item__content">{item.content}</Text>
              <Text className="feedback-item__time">{item.time}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

FeedbackListPage.config = { navigationStyle: 'custom' } as any
FeedbackListPage.displayName = 'FeedbackListPage'

export default memo(FeedbackListPage)
