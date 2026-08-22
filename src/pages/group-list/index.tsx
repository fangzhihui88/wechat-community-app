import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import NavBar from '../../components/NavBar'
import SearchBar from '../../components/SearchBar'
import './index.css'

interface GroupItem {
  id: string
  name: string
  avatar: string
  memberCount: number
  description: string
  tags: string[]
}

const MOCK_GROUPS: GroupItem[] = [
  { id: '1', name: '北京跑步爱好者', avatar: '🏃', memberCount: 1280, description: '每周组织跑步活动，欢迎热爱运动的你', tags: ['运动', '跑步'] },
  { id: '2', name: '读书会交流群', avatar: '📚', memberCount: 856, description: '每周分享一本好书，一起成长进步', tags: ['阅读', '成长'] },
  { id: '3', name: '摄影技术交流', avatar: '📷', memberCount: 2340, description: '摄影技巧分享，外拍活动组织', tags: ['摄影', '艺术'] },
  { id: '4', name: '美食探店群', avatar: '🍜', memberCount: 1567, description: '发现城市美食，分享探店体验', tags: ['美食', '生活'] },
  { id: '5', name: '职场进阶营', avatar: '💼', memberCount: 980, description: '职场经验分享，职业发展规划', tags: ['职场', '成长'] },
]

const GroupList = memo(() => {
  const [groups] = useState(MOCK_GROUPS)

  const handleSearch = useCallback((value: string) => {
    Taro.showToast({ title: `搜索: ${value}`, icon: 'none' })
  }, [])

  const handleJoin = useCallback((groupName: string) => {
    Taro.showToast({ title: `已申请加入「${groupName}」`, icon: 'success' })
  }, [])

  return (
    <View className="page">
      <NavBar title="群组广场" showBack />
      <ScrollView scrollY className="page__scroll">
        <View className="page__body">
          <SearchBar placeholder="搜索群组名称" onSearch={handleSearch} />

          <View className="mp-section">
            <Text className="mp-section__title">推荐群组</Text>
            <Text className="mp-section__more">更多 ›</Text>
          </View>

          <View className="group-list">
            {groups.map((group) => (
              <View key={group.id} className="group-card">
                <View className="group-card__avatar">{group.avatar}</View>
                <View className="group-card__content">
                  <View className="group-card__header">
                    <Text className="group-card__name">{group.name}</Text>
                    <Text className="group-card__count">{group.memberCount}人</Text>
                  </View>
                  <Text className="group-card__desc">{group.description}</Text>
                  <View className="group-card__tags">
                    {group.tags.map((tag) => (
                      <Text key={tag} className="mp-tag">{tag}</Text>
                    ))}
                  </View>
                </View>
                <View className="group-card__action" onClick={() => handleJoin(group.name)}>
                  <Text className="mp-btn mp-btn--primary mp-btn--sm">加入</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
})

GroupList.config = { navigationStyle: 'custom' } as any
GroupList.displayName = 'GroupList'
export default GroupList
