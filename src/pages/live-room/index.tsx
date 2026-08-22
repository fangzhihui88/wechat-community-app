import { memo, useState, useCallback } from 'react'
import { View, Text, ScrollView, Image, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

interface Comment {
  id: number
  user: string
  content: string
}

const mockStreamer = {
  avatar: 'https://picsum.photos/100/100?random=21',
  nickname: '小甜心',
  followers: 123456,
}

const LiveRoom = memo(() => {
  const router = useRouter()
  const roomId = router.params.roomId || '1'
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, user: '用户A', content: '主播唱得真好听！' },
    { id: 2, user: '用户B', content: '来首周杰伦的歌吧' },
    { id: 3, user: '用户C', content: '支持主播~' },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollow = useCallback(() => {
    setIsFollowing(!isFollowing)
    Taro.showToast({ title: isFollowing ? '已取消关注' : '关注成功', icon: 'success' })
  }, [isFollowing])

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return
    setComments([...comments, { id: Date.now(), user: '我', content: inputValue }])
    setInputValue('')
  }, [comments, inputValue])

  const handleGift = useCallback(() => {
    Taro.showToast({ title: '送出礼物', icon: 'none' })
  }, [])

  const handleLike = useCallback(() => {
    Taro.showToast({ title: '点赞成功', icon: 'none' })
  }, [])

  return (
    <View className="page live-room">
      <View className="live-room__header">
        <Image src={mockStreamer.avatar} className="live-room__avatar" />
        <View className="live-room__info">
          <Text className="live-room__nickname">{mockStreamer.nickname}</Text>
          <Text className="live-room__followers">{mockStreamer.followers}粉丝</Text>
        </View>
        <View
          className={`live-room__follow-btn ${isFollowing ? 'is-following' : ''}`}
          onClick={handleFollow}
        >
          {isFollowing ? '已关注' : '关注'}
        </View>
      </View>

      <View className="live-room__video">
        <Text className="live-room__video-text">直播画面</Text>
        <Text className="live-room__room-id">房间号: {roomId}</Text>
      </View>

      <View className="live-room__actions">
        <View className="live-room__action" onClick={handleGift}>
          <Text className="live-room__action-icon">🎁</Text>
        </View>
        <View className="live-room__action" onClick={handleLike}>
          <Text className="live-room__action-icon">❤️</Text>
        </View>
      </View>

      <ScrollView scrollY className="live-room__comments">
        {comments.map((comment) => (
          <View key={comment.id} className="live-room__comment">
            <Text className="live-room__comment-user">{comment.user}：</Text>
            <Text className="live-room__comment-content">{comment.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View className="live-room__input-bar">
        <Input
          className="live-room__input"
          placeholder="说点什么..."
          value={inputValue}
          onInput={(e) => setInputValue(e.detail.value)}
        />
        <View className="live-room__send-btn" onClick={handleSend}>
          发送
        </View>
      </View>
    </View>
  )
})

LiveRoom.displayName = 'LiveRoom'
LiveRoom.config = { navigationStyle: 'custom' } as any

export default LiveRoom
