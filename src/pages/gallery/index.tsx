import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo } from 'react'
import NavBar from '../../components/NavBar'
import EmptyState from '../../components/EmptyState'
import './index.css'

const mockImages = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=600&fit=crop&q=80',
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
