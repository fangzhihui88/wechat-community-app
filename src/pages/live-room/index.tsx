import { memo, useState, useCallback } from 'react'
import { View, Text, ScrollView, Image, Input, Video } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

interface Comment {
  id: number
  user: string
  avatar: string
  content: string
}

const mockStreamer = {
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80',
  nickname: '小甜心',
  followers: 123456,
  streamUrl: 'https://fangzhihui88.github.io/wechat-community-app/videos/live-stream.mp4',
  streamCover: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1280&h=720&fit=crop&q=80',
}

const LiveRoom = memo(() => {
  const router = useRouter()
  const roomId = router.params.roomId || '1'
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, user: '阳光男孩', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80', content: '主播唱得真好听！' },
    { id: 2, user: '雨后彩虹', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&q=80', content: '来首周杰伦的歌吧' },
    { id: 3, user: '星空漫步', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&q=80', content: '支持主播~ 点赞了' },
    { id: 4, user: '咖啡时光', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80', content: '这首歌太治愈了' },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)

  const handleFollow = useCallback(() => {
    setIsFollowing(prev => !prev)
    Taro.showToast({ title: isFollowing ? '已取消关注' : '关注成功 ✅', icon: 'none' })
  }, [isFollowing])

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return
    const newComment: Comment = {
      id: Date.now(),
      user: '我',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80',
      content: inputValue,
    }
    setComments(prev => [...prev, newComment])
    setInputValue('')
  }, [inputValue])

  const handleGift = useCallback(() => {
    Taro.showToast({ title: '🎁 礼物已送出！', icon: 'none' })
  }, [])

  const handleShare = useCallback(() => {
    Taro.showShareMenu({ withShareTicket: true })
    Taro.showToast({ title: '分享房间给好友', icon: 'none' })
  }, [])

  return (
    <View className="page live-room">
      <NavBar title="直播间" showBack />

      {/* 直播画面 */}
      <View className="live-room__video-wrap">
        <Video
          className="live-room__video"
          src={mockStreamer.streamUrl}
          autoplay={isPlaying}
          loop
          showCenterPlayBtn={false}
          showFullscreenBtn
          showPlayBtn
          controls
          poster={mockStreamer.streamCover}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <View className="live-room__live-badge">
          <Text className="live-room__live-dot" />
          <Text className="live-room__live-text">LIVE</Text>
        </View>
        <View className="live-room__viewer-count">
          <Text className="live-room__viewer-icon">👁</Text>
          <Text className="live-room__viewer-num">{mockStreamer.followers.toLocaleString()}</Text>
        </View>
      </View>

      {/* 主播信息 */}
      <View className="live-room__header">
        <Image src={mockStreamer.avatar} className="live-room__avatar" />
        <View className="live-room__info">
          <Text className="live-room__nickname">{mockStreamer.nickname}</Text>
          <Text className="live-room__followers">{mockStreamer.followers.toLocaleString()} 粉丝</Text>
        </View>
        <View
          className={`live-room__follow-btn ${isFollowing ? 'live-room__follow-btn--following' : ''}`}
          onClick={handleFollow}
        >
          {isFollowing ? '已关注' : '+ 关注'}
        </View>
      </View>

      {/* 互动操作栏 */}
      <View className="live-room__actions">
        <View className="live-room__action" onClick={handleGift}>
          <Text className="live-room__action-icon">🎁</Text>
          <Text className="live-room__action-label">礼物</Text>
        </View>
        <View className="live-room__action" onClick={handleShare}>
          <Text className="live-room__action-icon">↗️</Text>
          <Text className="live-room__action-label">分享</Text>
        </View>
      </View>

      {/* 弹幕评论 */}
      <ScrollView scrollY className="live-room__comments">
        <Text className="live-room__comments-title">💬 聊天 ({comments.length})</Text>
        {comments.map((comment) => (
          <View key={comment.id} className="live-room__comment">
            <Image src={comment.avatar} className="live-room__comment-avatar" />
            <View className="live-room__comment-body">
              <Text className="live-room__comment-user">{comment.user}</Text>
              <Text className="live-room__comment-content">{comment.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 输入栏 */}
      <View className="live-room__input-bar">
        <Input
          className="live-room__input"
          placeholder="说点什么..."
          value={inputValue}
          onInput={(e) => setInputValue(e.detail.value)}
          onConfirm={handleSend}
        />
        <View className="live-room__send-btn" onClick={handleSend}>
          <Text className="live-room__send-text">发送</Text>
        </View>
      </View>
    </View>
  )
})

LiveRoom.displayName = 'LiveRoom'
LiveRoom.config = { navigationStyle: 'custom' } as any

export default LiveRoom
