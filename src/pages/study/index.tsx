import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

// --- Mock Data ---
const mockPlans = [
  { id: 1, title: '考研英语全程班', cover: 'https://picsum.photos/seed/plan1/400/300', progress: 60, totalHours: 120, tag: '考研' },
  { id: 2, title: '公务员行测冲刺', cover: 'https://picsum.photos/seed/plan2/400/300', progress: 80, totalHours: 80, tag: '考公' },
  { id: 3, title: 'Python 全栈技能', cover: 'https://picsum.photos/seed/plan3/400/300', progress: 45, totalHours: 200, tag: '职业技能' },
]

const mockStudyStats = [
  { label: '今日学习', pct: 60, value: '3.6h', target: '6h' },
  { label: '本周学习', pct: 80, value: '18h', target: '20h' },
  { label: '本月学习', pct: 45, value: '45h', target: '100h' },
]

const mockCourses = [
  { id: 1, title: '考研政治核心考点', teacher: '张老师', cover: 'https://picsum.photos/seed/course1/300/200' },
  { id: 2, title: '申论写作技巧精讲', teacher: '李老师', cover: 'https://picsum.photos/seed/course2/300/200' },
  { id: 3, title: '前端工程化实战', teacher: '王老师', cover: 'https://picsum.photos/seed/course3/300/200' },
  { id: 4, title: '数据分析与可视化', teacher: '赵老师', cover: 'https://picsum.photos/seed/course4/300/200' },
]

// --- Component ---
const StudyPage = memo(() => {
  return (
    <View className="page study-page">
      <NavBar title="学习中心" showBack />

      <ScrollView scrollY className="study-page__body">
        {/* 学习计划 */}
        <View className="study-page__section">
          <Text className="study-page__section-title">我的学习计划</Text>
          <View className="study-page__plans">
            {mockPlans.map((plan) => (
              <View key={plan.id} className="study-page__plan-card">
                <Image
                  className="study-page__plan-cover"
                  src={plan.cover}
                  mode="aspectFill"
                />
                <View className="study-page__plan-info">
                  <View className="study-page__plan-tag">{plan.tag}</View>
                  <Text className="study-page__plan-title">{plan.title}</Text>
                  <View className="study-page__plan-footer">
                    <View className="study-page__progress-bar">
                      <View
                        className="study-page__progress-fill"
                        style={{ width: `${plan.progress}%` }}
                      />
                    </View>
                    <Text className="study-page__progress-text">{plan.progress}%</Text>
                  </View>
                  <Text className="study-page__plan-hours">共 {plan.totalHours} 学时</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 每日学习时长统计 */}
        <View className="study-page__section">
          <Text className="study-page__section-title">学习时长统计</Text>
          <View className="study-page__stats-card">
            {mockStudyStats.map((stat, idx) => (
              <View key={idx} className="study-page__stat-row">
                <Text className="study-page__stat-label">{stat.label}</Text>
                <View className="study-page__stat-bar-wrap">
                  <View className="study-page__stat-bar">
                    <View
                      className="study-page__stat-fill"
                      style={{ width: `${stat.pct}%` }}
                    />
                  </View>
                  <Text className="study-page__stat-pct">{stat.pct}%</Text>
                </View>
                <Text className="study-page__stat-value">{stat.value} / {stat.target}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 学习圈子 */}
        <View className="study-page__section">
          <View className="study-page__circle-card">
            <View className="study-page__circle-left">
              <Text className="study-page__circle-emoji">📚</Text>
              <View>
                <Text className="study-page__circle-title">加入学习小组</Text>
                <Text className="study-page__circle-desc">和志同道合的伙伴一起进步</Text>
              </View>
            </View>
            <View className="study-page__circle-btn">
              <Text className="study-page__circle-btn-text">加入</Text>
            </View>
          </View>
        </View>

        {/* 推荐课程 */}
        <View className="study-page__section">
          <View className="study-page__section-header">
            <Text className="study-page__section-title">推荐课程</Text>
            <Text className="study-page__more">查看全部 ›</Text>
          </View>
          <ScrollView scrollX className="study-page__courses-scroll">
            <View className="study-page__courses-row">
              {mockCourses.map((course) => (
                <View key={course.id} className="study-page__course-card">
                  <Image
                    className="study-page__course-cover"
                    src={course.cover}
                    mode="aspectFill"
                  />
                  <Text className="study-page__course-title">{course.title}</Text>
                  <Text className="study-page__course-teacher">{course.teacher}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="study-page__safe-bottom" />
      </ScrollView>
    </View>
  )
})

StudyPage.config = { navigationStyle: 'custom' } as any
StudyPage.displayName = 'StudyPage'
export default StudyPage
