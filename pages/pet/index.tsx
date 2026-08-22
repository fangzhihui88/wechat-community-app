import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

// mock 数据
const mockPets = [
  { id: '1', name: '豆豆', species: 'dog', breed: '金毛', age: '2岁', status: '待领养', avatar: 'https://picsum.photos/seed/pet1/200/200', owner: '小林' },
  { id: '2', name: '咪咪', species: 'cat', breed: '英短', age: '1岁', status: '已领养', avatar: 'https://picsum.photos/seed/pet2/200/200', owner: '阿花' },
  { id: '3', name: '旺财', species: 'dog', breed: '柴犬', age: '3岁', status: '待领养', avatar: 'https://picsum.photos/seed/pet3/200/200', owner: '老王' },
  { id: '4', name: '小白', species: 'cat', breed: '布偶', age: '8个月', status: '待领养', avatar: 'https://picsum.photos/seed/pet4/200/200', owner: '小美' },
  { id: '5', name: '大橘', species: 'cat', breed: '橘猫', age: '2岁', status: '已领养', avatar: 'https://picsum.photos/seed/pet5/200/200', owner: '阿强' },
]

// 热门宠物榜单（TOP 3）
const topPets = mockPets
  .filter(p => p.status === '待领养')
  .slice(0, 3)
  .map((p, i) => ({ ...p, likes: [3280, 2150, 1890][i] }))

const PetCommunity = memo(() => {
  const handlePublish = () => {
    Taro.showToast({ title: '发布宠物信息', icon: 'none' })
  }

  const handleDiary = () => {
    Taro.navigateTo({ url: '/pages/my-drafts/index' })
  }

  const handlePetClick = (id: string) => {
    Taro.showToast({ title: `查看宠物 ${id}`, icon: 'none' })
  }

  return (
    <View className="page">
      <NavBar title="宠物社区" showBack rightText="发布" onRightClick={handlePublish} />

      <ScrollView scrollY className="page__content">
        {/* 宠物领养列表 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">🐾 待领养宠物</Text>
            <Text className="section__more">查看全部 ›</Text>
          </View>
          <View className="pet-list">
            {mockPets.map(pet => (
              <View
                key={pet.id}
                className="pet-card"
                onClick={() => handlePetClick(pet.id)}
              >
                <Image
                  className="pet-card__avatar"
                  src={pet.avatar}
                  mode="aspectFill"
                />
                <View className="pet-card__info">
                  <View className="pet-card__row">
                    <Text className="pet-card__name">{pet.name}</Text>
                    <View className={`pet-card__status pet-card__status--${pet.status === '待领养' ? 'available' : 'adopted'}`}>
                      <Text className="pet-card__status-text">{pet.status}</Text>
                    </View>
                  </View>
                  <Text className="pet-card__breed">品种：{pet.breed}</Text>
                  <Text className="pet-card__age">年龄：{pet.age}</Text>
                  <Text className="pet-card__owner">主人：{pet.owner}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 宠物日记入口 */}
        <View className="section">
          <View
            className="diary-banner"
            onClick={handleDiary}
          >
            <View className="diary-banner__left">
              <Text className="diary-banner__icon">📔</Text>
              <View className="diary-banner__text">
                <Text className="diary-banner__title">宠物日记</Text>
                <Text className="diary-banner__sub">记录毛孩子的成长瞬间</Text>
              </View>
            </View>
            <Text className="diary-banner__arrow">›</Text>
          </View>
        </View>

        {/* 热门宠物榜单 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">🏆 热门宠物榜单</Text>
            <Text className="section__more">周榜 ›</Text>
          </View>
          <View className="rank-list">
            {topPets.map((pet, index) => (
              <View key={pet.id} className="rank-item">
                <View className={`rank-item__medal rank-item__medal--${index}`}>
                  <Text className="rank-item__rank-text">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </Text>
                </View>
                <Image className="rank-item__avatar" src={pet.avatar} mode="aspectFill" />
                <View className="rank-item__info">
                  <Text className="rank-item__name">{pet.name}</Text>
                  <Text className="rank-item__breed">{pet.breed}</Text>
                </View>
                <View className="rank-item__likes">
                  <Text className="rank-item__likes-icon">❤️</Text>
                  <Text className="rank-item__likes-count">{pet.likes.toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

PetCommunity.config = { navigationStyle: 'custom' } as any
PetCommunity.displayName = 'PetCommunity'
export default PetCommunity
