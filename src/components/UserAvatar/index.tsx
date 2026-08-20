import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo } from 'react'
import type { User } from '../../types'
import './index.css'

interface UserAvatarProps {
  user: User
  size?: 'small' | 'medium' | 'large'
  showVipBadge?: boolean
  showName?: boolean
  onClick?: () => void
}

const sizeMap = {
  small: 80,
  medium: 100,
  large: 140,
}

const UserAvatar = memo<UserAvatarProps>(({
  user,
  size = 'medium',
  showVipBadge = true,
  showName = false,
  onClick,
}) => {
  const pxSize = sizeMap[size]
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      Taro.navigateTo({
        url: `/pages/profile-detail/index?userId=${user.id}`,
      })
    }
  }

  return (
    <View 
      className={`user-avatar ${showName ? 'user-avatar--with-name' : ''}`}
      onClick={handleClick}
    >
      <View className="user-avatar__wrapper" style={{ width: pxSize, height: pxSize }}>
        <Image
          className={`user-avatar__image ${user.isVip ? 'user-avatar__image--vip' : ''}`}
          src={user.avatar}
          mode="aspectFill"
          style={{ width: pxSize, height: pxSize }}
        />
        {showVipBadge && user.isVip && (
          <View className="user-avatar__vip-badge">V</View>
        )}
      </View>
      {showName && (
        <Text className="user-avatar__name text-ellipsis">{user.nickname}</Text>
      )}
    </View>
  )
})

UserAvatar.displayName = 'UserAvatar'

export default UserAvatar
