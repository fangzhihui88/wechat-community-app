import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import NavBar from '../../components/NavBar'
import UserAvatar from '../../components/UserAvatar'
import EmptyState from '../../components/EmptyState'
import type { User } from '../../types'
import './index.css'

// 本地 mock 关注数据
const mockFollowing: User[] = [
  { id: 'g1', nickname: `用户${Math.floor(Math.random() * 9000) + 1000}`, avatar: 'https://picsum.photos/210', bio: '这个人很懒~', following: 320, followers: 1200, posts: 88, isVip: false, isFollowing: true },
  { id: 'g2', nickname: `用户${Math.floor(Math.random() * 9000) + 1000}`, avatar: 'https://picsum.photos/211', bio: '这个人很懒~', following: 12, followers: 58, posts: 3, isVip: true, isFollowing: true },
  { id: 'g3', nickname: `用户${Math.floor(Math.random() * 9000) + 1000}`, avatar: 'https://picsum.photos/212', bio: '这个人很懒~', following: 12000, followers: 30000, posts: 1024, isVip: true, isFollowing: false },
  { id: 'g4', nickname: `用户${Math.floor(Math.random() * 9000) + 1000}`, avatar: 'https://picsum.photos/213', bio: '这个人很懒~', following: 6, followers: 11, posts: 2, isVip: false, isFollowing: true },
  { id: 'g5', nickname: `用户${Math.floor(Math.random() * 9000) + 1000}`, avatar: 'https://picsum.photos/214', bio: '这个人很懒~', following: 89, followers: 233, posts: 65, isVip: false, isFollowing: false },
  { id: 'g6', nickname: `用户${Math.floor(Math.random() * 9000) + 1000}`, avatar: 'https://picsum.photos/215', bio: '这个人很懒~', following: 200, followers: 45, posts: 27, isVip: true, isFollowing: true },
]

const Following = memo(() => {
  const getButtonText = (user: User) => {
    return user.isFollowing ? '已关注' : '关注'
  }

  const handleFollowClick = useCallback((user: User) => {
    Taro.showToast({
      title: user.isFollowing ? '已取消关注' : '关注成功',
      icon: 'none',
    })
  }, [])

  return (
    <View className="follow-page">
      <NavBar title="关注" showBack />
      <ScrollView scrollY className="follow-page__list">
        {mockFollowing.length > 0 ? (
          mockFollowing.map((user) => (
            <View className="user-row" key={user.id}>
              <UserAvatar user={user} size="medium" />
              <View className="user-row__info">
                <Text className="user-row__name">{user.nickname}</Text>
                <Text className="user-row__bio text-ellipsis">{user.bio}</Text>
              </View>
              <View
                className={`user-row__action ${user.isFollowing ? 'user-row__action--mutual' : ''}`}
                onClick={() => handleFollowClick(user)}
              >
                <Text className="user-row__action-text">{getButtonText(user)}</Text>
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon="👀"
            title="还没有关注的人"
            description="去发现页关注感兴趣的人吧"
          />
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Following.config = {
  navigationStyle: 'custom',
} as any

Following.displayName = 'Following'

export default Following
