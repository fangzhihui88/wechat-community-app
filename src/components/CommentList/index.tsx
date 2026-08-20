import { View, Text, ScrollView } from '@tarojs/components'
import { memo } from 'react'
import type { Comment } from '../../types'
import { formatRelativeTime } from '../../utils/formatTime'
import UserAvatar from '../UserAvatar'
import './index.css'

interface CommentListProps {
  comments: Comment[]
  onCommentClick?: (comment: Comment) => void
  onUserClick?: (userId: string) => void
  onLike?: (commentId: string) => void
}

const CommentList = memo<CommentListProps>(({
  comments,
  onCommentClick,
  onUserClick,
  onLike,
}) => {
  return (
    <View className="comment-list">
      {comments.length > 0 && (
        <Text className="comment-list__title">评论 {comments.length}</Text>
      )}
      <ScrollView scrollX className="comment-list__scroll">
        {comments.map((comment) => (
          <View 
            key={comment.id}
            className="comment-item"
            onClick={() => onCommentClick?.(comment)}
          >
            <View onClick={() => onUserClick?.(comment.user.id)}>
              <UserAvatar user={comment.user} size="small" />
            </View>
            <View className="comment-item__content">
              <View className="comment-item__header">
                <Text className="comment-item__username">
                  {comment.user.nickname}
                </Text>
                <Text className="comment-item__time">
                  {formatRelativeTime(comment.createdAt)}
                </Text>
              </View>
              <Text className="comment-item__text">{comment.content}</Text>
              <View className="comment-item__actions">
                <View 
                  className="comment-item__like"
                  onClick={(e) => {
                    e.stopPropagation()
                    onLike?.(comment.id)
                  }}
                >
                  <Text className={`comment-item__like-icon ${comment.isLiked ? 'comment-item__like-icon--liked' : ''}`}>
                    {comment.isLiked ? '❤️' : '🤍'}
                  </Text>
                  <Text className="comment-item__like-count">
                    {comment.likes}
                  </Text>
                </View>
              </View>
              
              {/* 回复列表 */}
              {comment.replies && comment.replies.length > 0 && (
                <View className="comment-item__replies">
                  {comment.replies.slice(0, 2).map((reply) => (
                    <View key={reply.id} className="comment-reply">
                      <Text className="comment-reply__name">
                        {reply.user.nickname}
                      </Text>
                      {reply.replyTo && (
                        <Text className="comment-reply__to"> 回复 </Text>
                      )}
                      {reply.replyTo && (
                        <Text className="comment-reply__to-name">
                          @{reply.replyTo.nickname}
                        </Text>
                      )}
                      <Text className="comment-reply__text">：{reply.content}</Text>
                    </View>
                  ))}
                  {comment.replies.length > 2 && (
                    <Text className="comment-item__more-replies">
                      查看全部 {comment.replies.length} 条回复
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
})

CommentList.displayName = 'CommentList'

export default CommentList
