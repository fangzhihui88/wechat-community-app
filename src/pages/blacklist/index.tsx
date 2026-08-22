import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import NavBar from '../../components/NavBar'
import UserAvatar from '../../components/UserAvatar'
import EmptyState from '../../components/EmptyState'
import './index.css'

const mockBlocked = [
  { id: 'user_099', nickname: '广告机器人', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&q=80' },
  { id: 'user_098', nickname: '杠精本精', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&q=80' },
]

const Blacklist = memo(() => {
  const [list, setList] = useState(mockBlocked)

  const handleUnblock = useCallback((id: string) => {
    Taro.showModal({
      title: '解除拉黑',
      content: '解除后将不再屏蔽该用户',
      success: (res) => {
        if (res.confirm) {
          setList((l) => l.filter((u) => u.id !== id))
          Taro.showToast({ title: '已解除', icon: 'success' })
        }
      },
    })
  }, [])

  return (
    <View className="blacklist-page">
      <NavBar title="黑名单" showBack />
      <ScrollView scrollY className="blacklist-page__body">
        {list.length === 0 ? (
          <EmptyState icon="🛡️" title="黑名单是空的" description="被拉黑的用户会显示在这里" />
        ) : (
          <View className="blacklist-page__list">
            {list.map((u) => (
              <View key={u.id} className="blacklist-page__item">
                <UserAvatar user={{ ...u, following: 0, followers: 0, posts: 0 } as any} size="medium" />
                <View className="blacklist-page__info">
                  <Text className="blacklist-page__name">{u.nickname}</Text>
                  <Text className="blacklist-page__desc">已拉黑，不再接收其消息</Text>
                </View>
                <View className="blacklist-page__btn" onClick={() => handleUnblock(u.id)}>
                  <Text className="blacklist-page__btn-text">解除</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Blacklist.config = { navigationStyle: 'custom' } as any
Blacklist.displayName = 'Blacklist'
export default Blacklist
