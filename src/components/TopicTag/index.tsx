import { View, Text } from '@tarojs/components'
import { memo } from 'react'
import type { Topic } from '../../types'
import './index.css'

interface TopicTagProps {
  topic: Topic
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
}

const TopicTag = memo<TopicTagProps>(({ topic, size = 'medium', onClick }) => {
  return (
    <View 
      className={`topic-tag topic-tag--${size}`}
      onClick={onClick}
    >
      <Text className="topic-tag__sharp">#</Text>
      <Text className="topic-tag__name">{topic.name}</Text>
    </View>
  )
})

TopicTag.displayName = 'TopicTag'

export default TopicTag
