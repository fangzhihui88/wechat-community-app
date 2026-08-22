import { useState } from 'react'
import { View, Text, ScrollView, Input, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

interface Answer {
  id: number
  avatar: string
  nickname: string
  content: string
  likes: number
  liked: boolean
}

const mockQuestion = {
  id: 1,
  title: '小区附近哪家宠物医院比较好？求推荐！',
  content: '家里养了只柯基，最近有点不舒服想带去看看。小区周边有没有靠谱的宠物医院？最好是离家近一点、医生比较耐心的。价格适中就行，不要求最便宜。',
  tags: ['生活', '求助'],
  answerCount: 12,
  viewCount: 345,
}

const mockAnswers: Answer[] = [
  { id: 1, avatar: '', nickname: '铲屎官小王', content: '推荐「爱心宠物医院」，就在南门那边，医生很专业，上次我家狗感冒一周就好了。', likes: 24, liked: false },
  { id: 2, avatar: '', nickname: '旺财妈妈', content: '我常去的是北街那家「宠物之家」，设备挺齐全的，价格也公道。可以电话预约。', likes: 18, liked: false },
  { id: 3, avatar: '', nickname: '养猫日记', content: '十字路口那家不错的，不过周末人比较多，建议工作日去。', likes: 12, liked: false },
]

const QuestionDetail: React.FC = () => {
  const router = useRouter()
  const id = router.params.id || '1'
  const [answers, setAnswers] = useState<Answer[]>(mockAnswers)
  const [inputText, setInputText] = useState('')

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return
    const newAnswer: Answer = {
      id: Date.now(),
      avatar: '',
      nickname: '我',
      content: inputText.trim(),
      likes: 0,
      liked: false,
    }
    setAnswers(prev => [...prev, newAnswer])
    setInputText('')
    Taro.showToast({ title: '回答成功', icon: 'success' })
  }, [inputText])

  const handleLike = (answerId: number) => {
    setAnswers(prev => prev.map(a =>
      a.id === answerId
        ? { ...a, liked: !a.liked, likes: a.liked ? a.likes - 1 : a.likes + 1 }
        : a
    ))
  }

  return (
    <View className="page">
      <NavBar title="问答详情" showBack />
      <ScrollView scrollY className="page__body" style="height:calc(100vh - 88px - env(safe-area-inset-top))">
        {/* 问题 */}
        <View className="mp-card question-card">
          <Text className="question-detail-title">{mockQuestion.title}</Text>
          <Text className="question-content">{mockQuestion.content}</Text>
          <View className="question-tags">
            {mockQuestion.tags.map((tag, i) => (
              <Text key={i} className="mp-tag" style="margin-right:6px">{tag}</Text>
            ))}
            <Text className="meta-text">{mockQuestion.answerCount} 回答 · {mockQuestion.viewCount} 浏览</Text>
          </View>
        </View>

        {/* 回答列表 */}
        <View className="mp-section">
          <View className="mp-section__title">全部回答 ({answers.length})</View>
          {answers.map(a => (
            <View key={a.id} className="mp-card answer-card">
              <View className="answer-header">
                <View className="answer-avatar">{a.nickname[0]}</View>
                <Text className="answer-nickname">{a.nickname}</Text>
              </View>
              <Text className="answer-content">{a.content}</Text>
              <View className="answer-footer">
                <View
                  className={`like-btn ${a.liked ? 'liked' : ''}`}
                  onClick={() => handleLike(a.id)}
                >
                  <Text>{a.liked ? '❤️' : '🤍'} {a.likes}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style="height:80px" />
      </ScrollView>

      {/* 底部输入 */}
      <View className="reply-bar">
        <Input
          className="reply-input"
          placeholder="写下你的回答..."
          value={inputText}
          onInput={e => setInputText(e.detail.value)}
          onConfirm={handleSend}
        />
        <View className="reply-send" onClick={handleSend}>发送</View>
      </View>
    </View>
  )
}

QuestionDetail.config = { navigationStyle: 'custom' } as any
QuestionDetail.displayName = 'QuestionDetail'
export default QuestionDetail
