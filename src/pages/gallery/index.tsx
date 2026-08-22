import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo } from 'react'
import NavBar from '../../components/NavBar'
import EmptyState from '../../components/EmptyState'
import './index.css'

const mockImages = [
  'https://picsum.photos/400/400?random=1',
  'https://picsum.photos/400/400?random=2',
  'https://picsum.photos/400/400?random=3',
  'https://picsum.photos/400/400?random=4',
  'https://picsum.photos/400/400?random=5',
  'https://picsum.photos/400/400?random=6',
  'https://picsum.photos/400/400?random=7',
  'https://picsum.photos/400/400?random=8',
  'https://picsum.photos/400/400?random=9',
]

const Gallery = memo(() => {
  const handlePreview = (index: number) => {
    Taro.previewImage({ current: mockImages[index], urls: mockImages })
  }

  return (
    <View className="gallery-page">
      <NavBar title="我的相册" showBack />
      <ScrollView scrollY className="gallery-page__body">
        {mockImages.length > 0 ? (
          <View className="gallery-grid">
            {mockImages.map((img, i) => (
              <View key={i} className="gallery-item" onClick={() => handlePreview(i)}>
                <Image className="gallery-item__img" src={img} mode="aspectFill" />
              </View>
            ))}
          </View>
        ) : (
          <EmptyState icon="📷" title="相册空空如也" description="发布带图动态会出现在这里" />
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Gallery.config = { navigationStyle: 'custom' } as any
Gallery.displayName = 'Gallery'
export default Gallery
