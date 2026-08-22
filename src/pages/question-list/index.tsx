import { useState } from 'react'
import { View, Text, ScrollView, Tag } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

interface Question {
  id: number
  title: string
  tags: string[]
  answerCount: number
  viewCount: number
}

const mockQuestions: Question[] = [
  { id: 1, title: '小区附近哪家宠物医院比较好？求推荐！', tags: ['生活', '求助'], answerCount: 12, viewCount: 345 },
  { id: 2, title: '周末有没有人一起去爬梧桐山？', tags: ['户外', '组队'], answerCount: 8, viewCount: 221 },
  { id: 3, title: '社区团购的蔬菜新鲜吗？质量如何？', tags: ['团购', '经验'], answerCount: 23, viewCount: 567 },
  { id: 4, title: '家里宽带卡顿严重，有什么解决办法吗？', tags: ['数码', '求助'], answerCount: 5, viewCount: 189 },
  { id: 5, title: '附近哪家少儿编程班性价比高？', tags: ['教育'], answerCount: 9, viewCount: 412 },
  { id: 6, title: '地下车库停车总是被堵，有什么投诉渠道？', tags: ['物业', '维权'], answerCount: 15, viewCount: 623 },
]

const QuestionList: React.FC = () => {
  const handleQuestionClick = (id: number) => {
    Taro.navigateTo({ url: `/pages/question-detail/index?id=${id}` })
  }

  const handleAsk = () => {
    Taro.showToast({ title: '提问功能即将上线', icon: 'none' })
  }

  return (
    <View className="page">
      <NavBar title="问答" showBack rightText="提问" onRightClick={handleAsk} />
      <ScrollView scrollY className="page__body" style="height:calc(100vh - 88px - env(safe-area-inset-top))">
        <View className="mp-section" style="margin-top:0">
          {mockQuestions.map(q => (
            <View
              key={q.id}
              className="mp-cell"
              onClick={() => handleQuestionClick(q.id)}
            >
              <View className="mp-cell__label" style="flex:1">
                <Text className="question-title">{q.title}</Text>
                <View className="question-meta" style="margin-top:8px">
                  {q.tags.map((tag, i) => (
                    <Text key={i} className="mp-tag" style="margin-right:6px;font-size:10px">{tag}</Text>
                  ))}
                  <Text className="meta-text">{q.answerCount} 回答 · {q.viewCount} 浏览</Text>
                </View>
              </View>
              <Text className="mp-cell__arrow">›</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

QuestionList.config = { navigationStyle: 'custom' } as any
QuestionList.displayName = 'QuestionList'
export default QuestionList
