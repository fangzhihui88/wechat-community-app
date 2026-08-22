import { memo } from 'react'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const mockPet = {
  name: '豆豆',
  species: '猫咪',
  breed: '英短蓝白',
  age: '2岁',
  gender: '弟弟',
  weight: '4.5kg',
  images: [
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=750&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=750&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=750&h=500&fit=crop&q=80',
  ],
  notes: [
    { label: '疫苗', value: '已全部接种' },
    { label: '驱虫', value: '已驱虫' },
    { label: '绝育', value: '已绝育' },
    { label: '性格', value: '温顺亲人' },
    { label: '领养要求', value: '有固定住所，科学喂养，不离不弃' },
    { label: '联系方式', value: '救助人：158****8888' },
  ],
}

const PetDetail = memo(() => {
  const handleAdopt = () => {
    Taro.showModal({
      title: '领养申请',
      content: `确定要申请领养「${mockPet.name}」吗？我们会尽快与您联系。`,
      success: (res) => {
        if (res.confirm) Taro.showToast({ title: '申请成功，我们会尽快联系您！', icon: 'none' })
      },
    })
  }

  const handleShare = () => {
    Taro.showShareMenu({ withShareTicket: true })
    Taro.showToast({ title: '分享给好友', icon: 'none' })
  }

  const handlePreview = (index: number) => {
    Taro.previewImage({ urls: mockPet.images, current: mockPet.images[index] })
  }

  return (
    <View className="page pet-detail-page">
      <NavBar title="宠物详情" showBack />

      {/* 图片轮播 */}
      <Swiper className="pet-detail-swiper" circular autoplay interval={3000}>
        {mockPet.images.map((img, i) => (
          <SwiperItem key={i}>
            <Image src={img} className="pet-detail-swiper__img" onClick={() => handlePreview(i)} />
          </SwiperItem>
        ))}
      </Swiper>

      {/* 基本信息 */}
      <View className="pet-detail-section pet-detail-info">
        <View className="pet-detail-info__header">
          <Text className="pet-detail-info__name">{mockPet.name}</Text>
          <View className="pet-detail-info__status"><Text>待领养</Text></View>
        </View>
        <View className="pet-detail-info__chips">
          {[
            mockPet.species, mockPet.breed, mockPet.age,
            mockPet.gender, mockPet.weight,
          ].map((tag) => (
            <View key={tag} className="pet-detail-info__chip"><Text>{tag}</Text></View>
          ))}
        </View>
      </View>

      {/* 领养须知 */}
      <View className="pet-detail-section">
        <Text className="pet-detail-section__title">📋 领养须知</Text>
        {mockPet.notes.map((n, i) => (
          <View key={i} className="pet-detail-note">
            <Text className="pet-detail-note__label">{n.label}</Text>
            <Text className="pet-detail-note__value">{n.value}</Text>
          </View>
        ))}
      </View>

      {/* 底部操作栏 */}
      <View className="pet-detail-actions">
        <View className="pet-detail-actions__btn pet-detail-actions__btn--collect" onClick={() => Taro.showToast({ title: '已收藏', icon: 'none' })}>
          <Text>🤍 收藏</Text>
        </View>
        <View className="pet-detail-actions__btn pet-detail-actions__btn--share" onClick={handleShare}>
          <Text>🔗 分享</Text>
        </View>
        <View className="pet-detail-actions__btn pet-detail-actions__btn--adopt" onClick={handleAdopt}>
          <Text>🐾 申请领养</Text>
        </View>
      </View>
    </View>
  )
})

PetDetail.displayName = 'PetDetail'
PetDetail.config = { navigationStyle: 'custom' } as any
export default PetDetail
