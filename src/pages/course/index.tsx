import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

interface Course {
  id: number
  title: string
  duration: string
  progress: number
  cover: string
  tag: string
}

const CATEGORIES = ['全部', '内容创作', '运营技巧', '数据分析', '用户增长']

const COURSES: Course[] = [
  { id: 1, title: '爆款内容的底层逻辑', duration: '12:35', progress: 80, cover: 'https://picsum.photos/seed/c1/240/160', tag: '内容创作' },
  { id: 2, title: '提高粉丝粘性的技巧', duration: '08:20', progress: 45, cover: 'https://picsum.photos/seed/c2/240/160', tag: '运营技巧' },
  { id: 3, title: '数据驱动内容优化', duration: '15:10', progress: 0, cover: 'https://picsum.photos/seed/c3/240/160', tag: '数据分析' },
  { id: 4, title: '用户增长实战案例', duration: '20:45', progress: 30, cover: 'https://picsum.photos/seed/c4/240/160', tag: '用户增长' },
  { id: 5, title: '选题与标题写法', duration: '10:00', progress: 100, cover: 'https://picsum.photos/seed/c5/240/160', tag: '内容创作' },
  { id: 6, title: '社区氛围运营指南', duration: '14:25', progress: 0, cover: 'https://picsum.photos/seed/c6/240/160', tag: '运营技巧' },
]

const CoursePage: React.FC = () => {
  const [active, setActive] = useState('全部')

  const filtered = active === '全部' ? COURSES : COURSES.filter(c => c.tag === active)

  return (
    <View className="page">
      <NavBar title="成长课堂" showBack />
      <View className="page__body">
        {/* 分类 chips */}
        <View className="chips-row">
          {CATEGORIES.map(cat => (
            <View
              key={cat}
              className={`chip ${active === cat ? 'chip--active' : ''}`}
              onClick={() => setActive(cat)}
            >
              <Text>{cat}</Text>
            </View>
          ))}
        </View>

        {/* 课程列表 */}
        <View className="course-list">
          {filtered.map(course => (
            <View
              key={course.id}
              className="course-item"
              onClick={() => Taro.showToast({ title: `进入课程：${course.title}`, icon: 'none' })}
            >
              <Image
                className="course-item__cover"
                src={course.cover}
                mode="aspectFill"
              />
              <View className="course-item__info">
                <Text className="course-item__title">{course.title}</Text>
                <View className="course-item__meta">
                  <Text className="course-item__duration">{course.duration}</Text>
                  <View className="mp-tag" style={{ fontSize: '10px', padding: '2px 6px' }}>
                    {course.tag}
                  </View>
                </View>
                {course.progress > 0 && (
                  <View className="course-item__progress">
                    <View className="course-item__bar">
                      <View
                        className="course-item__fill"
                        style={{ width: `${course.progress}%` }}
                      />
                    </View>
                    <Text className="course-item__pct">{course.progress}%</Text>
                  </View>
                )}
                {course.progress === 0 && (
                  <Text className="course-item__start">开始学习</Text>
                )}
                {course.progress > 0 && course.progress < 100 && (
                  <Text className="course-item__continue">继续学习</Text>
                )}
                {course.progress === 100 && (
                  <Text className="course-item__done">已完成</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

CoursePage.config = { navigationStyle: 'custom' } as any
CoursePage.displayName = 'CoursePage'

export default memo(CoursePage)
