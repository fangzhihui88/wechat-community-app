import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

interface Task {
  title: string
  current: number
  total: number
}

interface Privilege {
  label: string
  unlocked: boolean
}

const LevelPage: React.FC = () => {
  const [tasks] = useState<Task[]>([
    { title: '发布内容', current: 12, total: 20 },
    { title: '获得点赞', current: 85, total: 100 },
    { title: '互动回复', current: 6, total: 10 },
  ])

  const privileges: Privilege[] = [
    { label: '专属身份标识', unlocked: true },
    { label: '优先客服响应', unlocked: true },
    { label: '每月 5 次置顶机会', unlocked: true },
    { label: '专属活动邀请', unlocked: false },
    { label: '线下活动优先报名', unlocked: false },
  ]

  const totalTasks = tasks.reduce((acc, t) => acc + t.total, 0)
  const completedTasks = tasks.reduce((acc, t) => acc + Math.min(t.current, t.total), 0)
  const overallPercent = Math.round((completedTasks / totalTasks) * 100)

  return (
    <View className="page">
      <NavBar title="等级" showBack />
      <View className="page__body">
        {/* 等级大圆环 */}
        <View className="level-hero">
          <View className="level-ring">
            <Text className="level-ring__num">Lv.8</Text>
            <Text className="level-ring__label">成长达人</Text>
          </View>
          <View className="level-progress-bar">
            <View className="level-progress-bar__fill" style={{ width: `${overallPercent}%` }} />
          </View>
          <Text className="level-progress-text">
            {completedTasks}/{totalTasks} 任务点 · 距离 Lv.9 还差 {totalTasks - completedTasks} 点
          </Text>
        </View>

        {/* 当前权益 */}
        <View className="mp-section" style={{ marginTop: 'var(--spacing-lg)' }}>
          <Text className="mp-section__title">当前权益</Text>
          <View className="privileges-list">
            {privileges.map((p, i) => (
              <View className="mp-cell" key={i}>
                <View className="mp-cell__icon">
                  <Text style={{ color: p.unlocked ? 'var(--color-primary)' : '#ccc', fontSize: '18px' }}>
                    {p.unlocked ? '✓' : '−'}
                  </Text>
                </View>
                <View className="mp-cell__label">
                  <Text style={{ color: p.unlocked ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                    {p.label}
                  </Text>
                </View>
                {p.unlocked && (
                  <View className="mp-cell__arrow">
                    <Text style={{ color: 'var(--color-primary)', fontSize: '12px' }}>已解锁</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* 升级任务 */}
        <View className="mp-section" style={{ marginTop: 'var(--spacing-lg)' }}>
          <Text className="mp-section__title">升级任务</Text>
          {tasks.map((task, i) => {
            const pct = Math.min(Math.round((task.current / task.total) * 100), 100)
            return (
              <View className="task-item" key={i}>
                <View className="task-item__header">
                  <Text className="task-item__title">{task.title}</Text>
                  <Text className="task-item__count">{task.current}/{task.total}</Text>
                </View>
                <View className="task-item__bar">
                  <View className="task-item__fill" style={{ width: `${pct}%` }} />
                </View>
              </View>
            )
          })}
        </View>

        {/* 底部按钮 */}
        <View style={{ padding: 'var(--spacing-md) var(--spacing-md) calc(var(--spacing-md) + env(safe-area-inset-bottom))' }}>
          <View
            className="mp-btn mp-btn--primary mp-btn--block"
            onClick={() => Taro.showToast({ title: '查看权益', icon: 'none' })}
          >
            查看全部权益
          </View>
        </View>
      </View>
    </View>
  )
}

LevelPage.config = { navigationStyle: 'custom' } as any
LevelPage.displayName = 'LevelPage'

export default memo(LevelPage)
