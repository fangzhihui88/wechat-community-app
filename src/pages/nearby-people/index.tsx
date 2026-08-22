import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

interface NearbyUser {
  id: string
  avatar: string
  nickname: string
  signature: string
  distance: string
}

const MOCK_USERS: NearbyUser[] = [
  { id: '1', avatar: 'https://picsum.photos/seed/n1/200', nickname: '小明同学', signature: '热爱生活，喜欢运动', distance: '120m' },
  { id: '2', avatar: 'https://picsum.photos/seed/n2/200', nickname: '咖啡爱好者', signature: '每一天都值得被认真对待', distance: '350m' },
  { id: '3', avatar: 'https://picsum.photos/seed/n3/200', nickname: '读书笔记', signature: '书中自有黄金屋', distance: '580m' },
  { id: '4', avatar: 'https://picsum.photos/seed/n4/200', nickname: '跑步达人', signature: '坚持跑步第三年', distance: '720m' },
  { id: '5', avatar: 'https://picsum.photos/seed/n5/200', nickname: '摄影师小王', signature: '用镜头记录美好瞬间', distance: '1.2km' },
  { id: '6', avatar: 'https://picsum.photos/seed/n6/200', nickname: '美食探店', signature: '寻找城市里的味道', distance: '1.5km' },
]

const NearbyPeople = memo(() => {
  const [users] = useState(MOCK_USERS)
  const [locationEnabled] = useState(false)

  const handleGreet = useCallback((nickname: string) => {
    Taro.showToast({ title: `已向「${nickname}」打招呼`, icon: 'success' })
  }, [])

  const handleEnableLocation = useCallback(() => {
    Taro.showToast({ title: '定位功能开发中', icon: 'none' })
  }, [])

  return (
    <View className="page">
      <NavBar title="附近的人" showBack />
      <ScrollView scrollY className="page__scroll">
        {!locationEnabled && (
          <View className="location-banner">
            <Text className="location-banner__icon">📍</Text>
            <View className="location-banner__content">
              <Text className="location-banner__title">开启定位</Text>
              <Text className="location-banner__desc">发现身边更多有趣的人</Text>
            </View>
            <View className="mp-btn mp-btn--primary mp-btn--sm" onClick={handleEnableLocation}>
              <Text className="location-banner__btn-text">开启</Text>
            </View>
          </View>
        )}

        <View className="page__body">
          <View className="mp-section">
            <Text className="mp-section__title">附近的人</Text>
          </View>

          <View className="nearby-list">
            {users.map(user => (
              <View key={user.id} className="nearby-card">
                <View className="nearby-card__header">
                  <Text className="nearby-card__distance">{user.distance}</Text>
                </View>
                <View className="nearby-card__content">
                  <Image className="nearby-card__avatar" src={user.avatar} mode="aspectFill" />
                  <View className="nearby-card__info">
                    <Text className="nearby-card__name">{user.nickname}</Text>
                    <Text className="nearby-card__signature">{user.signature}</Text>
                  </View>
                </View>
                <View className="nearby-card__action" onClick={() => handleGreet(user.nickname)}>
                  <Text className="mp-btn mp-btn--ghost mp-btn--sm">打招呼</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
})

NearbyPeople.config = { navigationStyle: 'custom' } as any
NearbyPeople.displayName = 'NearbyPeople'
export default NearbyPeople
