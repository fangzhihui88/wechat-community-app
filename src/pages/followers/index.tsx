import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import NavBar from '../../components/NavBar'
import UserAvatar from '../../components/UserAvatar'
import EmptyState from '../../components/EmptyState'
import type { User } from '../../types'
import './index.css'

// 本地 mock 粉丝数据
const mockFollowers: User[] = [
  { id: 'f1', nickname: `用户${Math.floor(Math.random() * 9000) + 1000}`, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80', bio: '这个人很懒~', following: 120, followers: 320, posts: 24, isVip: true, isFollowing: false },
  { id: 'f2', nickname: `用户${Math.floor(Math.random() * 9000) + 1000}`, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80', bio: '这个人很懒~', following: 58, followers: 12, posts: 5, isVip: false, isFollowing: true },
  { id: 'f3', nickname: `用户${Math.floor(Math.random() * 9000) + 1000}`, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80', bio: '这个人很懒~', following: 980, followers: 12000, posts: 312, isVip: true, isFollowing: true },
  { id: 'f4', nickname: `用户${Math.floor(Math.random() * 9000) + 1000}`, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80', bio: '这个人很懒~', following: 11, followers: 6, posts: 1, isVip: false, isFollowing: false },
  { id: 'f5', nickname: `用户${Math.floor(Math.random() * 9000) + 1000}`, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80', bio: '这个人很懒~', following: 233, followers: 89, posts: 47, isVip: false, isFollowing: false },
  { id: 'f6', nickname: `用户${Math.floor(Math.random() * 9000) + 1000}`, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80', bio: '这个人很懒~', following: 45, followers: 200, posts: 18, isVip: true, isFollowing: true },
]

const Followers = memo(() => {
  const getButtonText = (user: User) => {
    return user.isFollowing ? '互相关注' : '回关'
  }

  const handleFollowClick = useCallback((user: User) => {
    Taro.showToast({
      title: user.isFollowing ? '已互相关注' : '已回关',
      icon: 'none',
    })
  }, [])

  return (
    <View className="follow-page">
      <NavBar title="粉丝" showBack />
      <ScrollView scrollY className="follow-page__list">
        {mockFollowers.length > 0 ? (
          mockFollowers.map((user) => (
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
            icon="👥"
            title="还没有粉丝"
            description="还没人关注你，发布动态吸引更多粉丝吧"
          />
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Followers.config = {
  navigationStyle: 'custom',
} as any

Followers.displayName = 'Followers'

export default Followers
