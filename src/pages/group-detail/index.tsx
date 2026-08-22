import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const MOCK_MEMBERS = [
  { id: '1', avatar: 'https://picsum.photos/seed/m1/200' },
  { id: '2', avatar: 'https://picsum.photos/seed/m2/200' },
  { id: '3', avatar: 'https://picsum.photos/seed/m3/200' },
  { id: '4', avatar: 'https://picsum.photos/seed/m4/200' },
  { id: '5', avatar: 'https://picsum.photos/seed/m5/200' },
  { id: '6', avatar: 'https://picsum.photos/seed/m6/200' },
  { id: '7', avatar: 'https://picsum.photos/seed/m7/200' },
  { id: '8', avatar: 'https://picsum.photos/seed/m8/200' },
  { id: '9', avatar: 'https://picsum.photos/seed/m9/200' },
]

const GroupDetail = memo(() => {
  const groupId = Taro.getCurrentInstance().router?.params?.groupId || 'default'
  const [groupName] = useState('北京跑步爱好者')
  const [memberCount] = useState(1280)
  const [announcement] = useState('每周六早上7点在奥森公园南门集合，欢迎新老朋友参加！\n注意事项：请穿运动装备，带好饮用水。')

  const handleJoin = () => {
    Taro.showToast({ title: '已申请加入群聊', icon: 'success' })
  }

  return (
    <View className="page">
      <NavBar title="群资料" showBack transparent />
      <ScrollView scrollY className="page__scroll">
        <View className="group-header">
          <View className="group-header__cover" />
          <View className="group-header__content">
            <View className="group-header__avatar">🏃</View>
            <Text className="group-header__name">{groupName}</Text>
            <Text className="group-header__count">{memberCount} 位成员</Text>
          </View>
        </View>

        <View className="page__body">
          <View className="mp-group">
            <View className="mp-section">
              <Text className="mp-section__title">群公告</Text>
            </View>
            <View className="announcement">
              <Text className="announcement__text">{announcement}</Text>
            </View>
          </View>

          <View className="mp-group">
            <View className="mp-section">
              <Text className="mp-section__title">群成员</Text>
              <Text className="mp-section__more">全部 ›</Text>
            </View>
            <View className="member-wall">
              {MOCK_MEMBERS.map((member) => (
                <Image key={member.id} className="member-wall__avatar" src={member.avatar} mode="aspectFill" />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="page__footer safe-area-bottom">
        <View className="mp-btn mp-btn--primary mp-btn--block" onClick={handleJoin}>
          <Text className="page__footer-text">加入群聊</Text>
        </View>
      </View>
    </View>
  )
})

GroupDetail.config = { navigationStyle: 'custom' } as any
GroupDetail.displayName = 'GroupDetail'
export default GroupDetail
