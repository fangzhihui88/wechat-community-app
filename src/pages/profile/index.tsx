import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import FeedCard from '../../components/FeedCard'
import EmptyState from '../../components/EmptyState'
import type { Post } from '../../types'
import { formatNumber } from '../../utils/formatTime'
import './index.css'

// 用户发布的动态
const mockUserPosts: Post[] = []

const Profile = memo(() => {
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes'>('posts')
  const [isEditing, setIsEditing] = useState(false)
  const { currentUser, posts } = useAppStore()

  // 当前用户的动态（实际从 API 获取）
  const userPosts = posts.filter(p => p.user.id === currentUser?.id)

  const handleEditProfile = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/edit-profile/index',
    })
  }, [])

  const handleFollow = useCallback(() => {
    Taro.showToast({ title: currentUser?.isFollowing ? '已取消关注' : '关注成功', icon: 'success' })
  }, [currentUser])

  const handleSettings = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/settings/index',
    })
  }, [])

  if (!currentUser) {
    return (
      <View className="profile-page">
        <EmptyState
          icon="👤"
          title="未登录"
          description="请先登录"
          actionText="登录"
          onAction={() => Taro.navigateTo({ url: '/pages/login/index' })}
        />
      </View>
    )
  }

  return (
    <View className="profile-page">
      {/* 导航栏 */}
      <View className="profile-page__nav safe-area-top">
        <View className="profile-page__nav-content">
          <View className="profile-page__settings" onClick={handleSettings}>
            <Text className="profile-page__settings-icon">⚙️</Text>
          </View>
          <Text className="profile-page__nav-title">个人主页</Text>
          <View className="profile-page__share">
            <Text className="profile-page__share-icon">📤</Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY className="profile-page__content">
        {/* 用户信息卡片 */}
        <View className="profile-card">
          <View className="profile-card__bg" />
          <View className="profile-card__avatar-section">
            <View className="profile-card__avatar-wrapper">
              <Image
                className={`profile-card__avatar ${currentUser.isVip ? 'profile-card__avatar--vip' : ''}`}
                src={currentUser.avatar}
                mode="aspectFill"
              />
              {currentUser.isVip && (
                <View className="profile-card__vip-badge">V</View>
              )}
            </View>
            <View className="profile-card__actions">
              {isEditing ? (
                <>
                  <View className="profile-card__btn profile-card__btn--primary" onClick={() => setIsEditing(false)}>
                    <Text className="profile-card__btn-text">保存</Text>
                  </View>
                </>
              ) : (
                <>
                  <View className="profile-card__btn" onClick={() => setIsEditing(true)}>
                    <Text className="profile-card__btn-text">编辑资料</Text>
                  </View>
                  <View className="profile-card__btn" onClick={handleFollow}>
                    <Text className="profile-card__btn-text">关注</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          <View className="profile-card__info">
            <View className="profile-card__name-row">
              <Text className="profile-card__name">{currentUser.nickname}</Text>
              {currentUser.isVip && <Text className="profile-card__vip-tag">VIP</Text>}
            </View>
            {currentUser.bio && (
              <Text className="profile-card__bio">{currentUser.bio}</Text>
            )}
            
            {/* 数据统计 */}
            <View className="profile-card__stats">
              <View className="profile-card__stat">
                <Text className="profile-card__stat-value">{formatNumber(currentUser.following)}</Text>
                <Text className="profile-card__stat-label">关注</Text>
              </View>
              <View className="profile-card__stat">
                <Text className="profile-card__stat-value">{formatNumber(currentUser.followers)}</Text>
                <Text className="profile-card__stat-label">粉丝</Text>
              </View>
              <View className="profile-card__stat">
                <Text className="profile-card__stat-value">{formatNumber(currentUser.posts)}</Text>
                <Text className="profile-card__stat-label">动态</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 内容 Tab */}
        <View className="profile-tabs">
          <View 
            className={`profile-tabs__item ${activeTab === 'posts' ? 'profile-tabs__item--active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <Text className="profile-tabs__text">动态</Text>
          </View>
          <View 
            className={`profile-tabs__item ${activeTab === 'media' ? 'profile-tabs__item--active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <Text className="profile-tabs__text">相册</Text>
          </View>
          <View 
            className={`profile-tabs__item ${activeTab === 'likes' ? 'profile-tabs__item--active' : ''}`}
            onClick={() => setActiveTab('likes')}
          >
            <Text className="profile-tabs__text">赞过</Text>
          </View>
        </View>

        {/* 内容列表 */}
        <View className="profile-content">
          {activeTab === 'posts' && (
            userPosts.length > 0 ? (
              userPosts.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  onComment={() => Taro.navigateTo({ url: `/pages/post-detail/index?postId=${post.id}` })}
                  onUserClick={() => {}}
                />
              ))
            ) : (
              <EmptyState
                icon="📝"
                title="暂无动态"
                description="发布你的第一条动态吧"
                actionText="去发布"
                onAction={() => Taro.switchTab({ url: '/pages/publish/index' })}
              />
            )
          )}

          {activeTab === 'media' && (
            <EmptyState
              icon="📷"
              title="暂无相册"
              description="发布的图片会展示在这里"
            />
          )}

          {activeTab === 'likes' && (
            <EmptyState
              icon="❤️"
              title="暂无点赞"
              description="点赞的内容会展示在这里"
            />
          )}
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Profile.config = {
  navigationStyle: 'custom',
} as any

Profile.displayName = 'Profile'

export default Profile
