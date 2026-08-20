import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import type { Post } from '../../types'
import { formatRelativeTime, formatNumber } from '../../utils/formatTime'
import UserAvatar from '../UserAvatar'
import ActionBar from '../ActionBar'
import TopicTag from '../TopicTag'
import './index.css'

interface FeedCardProps {
  post: Post
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onUserClick?: (userId: string) => void
  onTopicClick?: (topicId: string) => void
  onImageClick?: (index: number, images: string[]) => void
}

const FeedCard = memo<FeedCardProps>(({
  post,
  onLike,
  onComment,
  onShare,
  onUserClick,
  onTopicClick,
  onImageClick,
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [isExpanded, setIsExpanded] = useState(false)

  const shouldTruncate = post.content.length > 120
  const displayContent = shouldTruncate && !isExpanded 
    ? post.content.slice(0, 120) + '...' 
    : post.content

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    onLike?.(post.id)
  }, [isLiked, likeCount, onLike, post.id])

  const handleComment = useCallback(() => {
    onComment?.(post.id)
  }, [onComment, post.id])

  const handleShare = useCallback(() => {
    onShare?.(post.id)
  }, [onShare, post.id])

  const handleUserClick = useCallback(() => {
    onUserClick?.(post.user.id)
  }, [onUserClick, post.user.id])

  const handleTopicClick = useCallback((topicId: string) => {
    onTopicClick?.(topicId)
  }, [onTopicClick])

  const handleImageClick = useCallback((index: number) => {
    onImageClick?.(index, post.images || [])
  }, [onImageClick, post.images])

  const handleImagePreview = (index: number) => {
    if (post.images && post.images.length > 0) {
      Taro.previewImage({
        current: post.images[index],
        urls: post.images,
      })
    }
  }

  return (
    <View className="feed-card">
      {/* 用户信息头部 */}
      <View className="feed-card__header" onClick={handleUserClick}>
        <UserAvatar 
          user={post.user} 
          size="medium" 
          showVipBadge={true}
        />
        <View className="feed-card__user-info">
          <View className="feed-card__user-top">
            <Text className="feed-card__username">{post.user.nickname}</Text>
          </View>
          <Text className="feed-card__meta">
            {formatRelativeTime(post.createdAt)}
            {post.location && ` · ${post.location}`}
          </Text>
        </View>
      </View>

      {/* 内容区域 */}
      <View className="feed-card__content">
        <Text 
          className="feed-card__text text-ellipsis-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {displayContent}
        </Text>
        {shouldTruncate && (
          <Text 
            className="feed-card__expand"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '收起' : '展开'}
          </Text>
        )}
      </View>

      {/* 话题标签 */}
      {post.topics && post.topics.length > 0 && (
        <View className="feed-card__topics">
          {post.topics.map((topic) => (
            <TopicTag
              key={topic.id}
              topic={topic}
              size="small"
              onClick={() => handleTopicClick(topic.id)}
            />
          ))}
        </View>
      )}

      {/* 图片网格 */}
      {post.images && post.images.length > 0 && (
        <View className={`feed-card__images feed-card__images--${Math.min(post.images.length, 3)}`}>
          {post.images.slice(0, 9).map((image, index) => (
            <View 
              key={index}
              className="feed-card__image-wrapper"
              onClick={() => handleImagePreview(index)}
            >
              <Image
                className="feed-card__image"
                src={image}
                mode="aspectFill"
                lazyLoad
              />
            </View>
          ))}
        </View>
      )}

      {/* 互动栏 */}
      <ActionBar
        likes={likeCount}
        comments={post.comments}
        shares={post.shares}
        isLiked={isLiked}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
      />
    </View>
  )
})

FeedCard.displayName = 'FeedCard'

export default FeedCard
