import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

interface Task {
  id: number
  icon: string
  name: string
  progress: string
  reward: number
  done: boolean
}

const mockTasks: Task[] = [
  { id: 1, icon: '📮', name: '每日签到', progress: '1/1', reward: 5, done: true },
  { id: 2, icon: '💬', name: '发布一条动态', progress: '0/1', reward: 10, done: false },
  { id: 3, icon: '🔍', name: '浏览5篇内容', progress: '3/5', reward: 5, done: false },
  { id: 4, icon: '❤️', name: '点赞3篇内容', progress: '1/3', reward: 3, done: false },
  { id: 5, icon: '💬', name: '评论2篇内容', progress: '0/2', reward: 4, done: false },
  { id: 6, icon: '👥', name: '邀请1位邻居', progress: '0/1', reward: 20, done: false },
  { id: 7, icon: '🎮', name: '玩1次小游戏', progress: '0/1', reward: 8, done: false },
  { id: 8, icon: '📖', name: '分享1篇文章', progress: '0/1', reward: 5, done: false },
]

const TaskCenter: React.FC = () => {
  const [tasks, setTasks] = useState(mockTasks)

  const totalReward = tasks.reduce((sum, t) => sum + (t.done ? t.reward : 0), 0)
  const pendingReward = tasks.filter(t => !t.done).reduce((sum, t) => sum + t.reward, 0)

  const handleTaskAction = (task: Task) => {
    if (task.done) return
    Taro.showToast({ title: `去完成「${task.name}」`, icon: 'none' })
  }

  const handleClaim = () => {
    const doneCount = tasks.filter(t => t.done).length
    if (doneCount === 0) {
      Taro.showToast({ title: '还没有完成任何任务', icon: 'none' })
      return
    }
    Taro.showToast({ title: `已领取 ${totalReward} 积分！`, icon: 'success' })
  }

  return (
    <View className="page">
      <NavBar title="任务中心" showBack />
      <ScrollView scrollY className="page__body" style="height:calc(100vh - 88px - env(safe-area-inset-top))">
        {/* 积分汇总 */}
        <View className="mp-card reward-summary">
          <Text className="reward-label">今日可领积分</Text>
          <Text className="reward-value">{totalReward}</Text>
          <View className="reward-row">
            <Text className="reward-hint">完成更多任务，最高可领 <Text style="color:var(--color-primary);font-weight:600">{pendingReward + totalReward}</Text> 积分</Text>
          </View>
        </View>

        {/* 每日任务 */}
        <View className="mp-section" style="margin-top:0">
          <View className="mp-section__title">每日任务</View>
          {tasks.map(task => (
            <View key={task.id} className="task-item">
              <Text className="task-icon">{task.icon}</Text>
              <View className="task-info">
                <Text className="task-name">{task.name}</Text>
                <Text className="task-progress">进度 {task.progress}</Text>
              </View>
              <View className="task-right">
                <Text className="task-reward">+{task.reward}积分</Text>
                <View
                  className={`task-btn ${task.done ? 'task-btn--done' : 'task-btn--active'}`}
                  onClick={() => handleTaskAction(task)}
                >
                  {task.done ? '已完成' : '去完成'}
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style="height:80px" />
      </ScrollView>

      {/* 底部领取 */}
      <View className="bottom-bar">
        <View className="mp-btn mp-btn--primary mp-btn--block" onClick={handleClaim}>
          领取奖励 {totalReward > 0 ? `+${totalReward}积分` : ''}
        </View>
      </View>
    </View>
  )
}

TaskCenter.config = { navigationStyle: 'custom' } as any
TaskCenter.displayName = 'TaskCenter'
export default TaskCenter
