import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { formatNumber } from '../../utils/formatTime'
import './index.css'

interface ActionBarProps {
  likes: number
  comments: number
  shares: number
  isLiked?: boolean
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
}

const ActionBar = memo<ActionBarProps>(({
  likes,
  comments,
  shares,
  isLiked = false,
  onLike,
  onComment,
  onShare,
}) => {
  const handleLike = useCallback(() => {
    onLike?.()
    // 触发震动反馈
    Taro.vibrateShort({ type: 'light' })
  }, [onLike])

  const handleComment = useCallback(() => {
    onComment?.()
  }, [onComment])

  const handleShare = useCallback(() => {
    onShare?.()
    Taro.showShareMenu({
      withShareTicket: true,
    })
  }, [onShare])

  return (
    <View className="action-bar">
      <View className="action-bar__item" onClick={handleLike}>
        <Text className={`action-bar__icon ${isLiked ? 'action-bar__icon--liked' : ''}`}>
          {isLiked ? '❤️' : '🤍'}
        </Text>
        <Text className={`action-bar__text ${isLiked ? 'action-bar__text--liked' : ''}`}>
          {formatNumber(likes)}
        </Text>
      </View>

      <View className="action-bar__item" onClick={handleComment}>
        <Text className="action-bar__icon">💬</Text>
        <Text className="action-bar__text">
          {formatNumber(comments)}
        </Text>
      </View>

      <View className="action-bar__item" onClick={handleShare}>
        <Text className="action-bar__icon">🔗</Text>
        <Text className="action-bar__text">
          {formatNumber(shares)}
        </Text>
      </View>

      <View className="action-bar__item action-bar__item--bookmark">
        <Text className="action-bar__icon">🔖</Text>
      </View>
    </View>
  )
})

ActionBar.displayName = 'ActionBar'

export default ActionBar
