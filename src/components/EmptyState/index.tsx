import { View, Text } from '@tarojs/components'
import { memo } from 'react'
import './index.css'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionText?: string
  onAction?: () => void
}

const EmptyState = memo<EmptyStateProps>(({
  icon = '📭',
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <View className="empty-state">
      <Text className="empty-state__icon">{icon}</Text>
      <Text className="empty-state__title">{title}</Text>
      {description && (
        <Text className="empty-state__description">{description}</Text>
      )}
      {actionText && onAction && (
        <View className="empty-state__action" onClick={onAction}>
          <Text className="empty-state__action-text">{actionText}</Text>
        </View>
      )}
    </View>
  )
})

EmptyState.displayName = 'EmptyState'

export default EmptyState
