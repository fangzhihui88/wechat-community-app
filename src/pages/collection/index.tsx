import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

interface Collection {
  id: number
  title: string
  count: number
  cover: string
}

const COLLECTIONS: Collection[] = [
  { id: 1, title: '内容创作干货合集', count: 24, cover: 'https://images.unsplash.com/photo-1493815793585-d91a9e6c1b13?w=300&h=300&fit=crop&q=80/300' },
  { id: 2, title: '运营技巧分享', count: 18, cover: 'https://images.unsplash.com/photo-1504805572947-34fad45a6b0f?w=300&h=300&fit=crop&q=80/300' },
  { id: 3, title: '涨粉实战案例', count: 32, cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&h=300&fit=crop&q=80/300' },
  { id: 4, title: '社区活动回顾', count: 12, cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop&q=80/300' },
  { id: 5, title: '优秀创作者访谈', count: 9, cover: 'https://images.unsplash.com/photo-1517686469639-549f10a8b783?w=300&h=300&fit=crop&q=80/300' },
  { id: 6, title: '每周热点分析', count: 45, cover: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=300&h=300&fit=crop&q=80/300' },
]

const CollectionPage: React.FC = () => {
  const [list] = useState<Collection[]>(COLLECTIONS)

  return (
    <View className="page">
      <NavBar title="内容合集" showBack />
      <View className="page__body">
        <View className="collection-grid">
          {list.map(item => (
            <View
              key={item.id}
              className="collection-card"
              onClick={() => Taro.showToast({ title: `打开合集：${item.title}`, icon: 'none' })}
            >
              <Image
                className="collection-card__cover"
                src={item.cover}
                mode="aspectFill"
              />
              <View className="collection-card__info">
                <Text className="collection-card__title">{item.title}</Text>
                <Text className="collection-card__count">{item.count} 篇内容</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

CollectionPage.config = { navigationStyle: 'custom' } as any
CollectionPage.displayName = 'CollectionPage'

export default memo(CollectionPage)
