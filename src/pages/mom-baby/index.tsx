import { memo, useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const stages = ['孕早期', '孕中期', '孕晚期', '0-1岁', '1-3岁']
const mockArticles = [
  { id: '1', title: '孕早期营养补充指南，收藏这一篇就够了', category: '营养', reads: 8923, cover: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop&q=80' },
  { id: '2', title: '胎动是什么感觉？准妈妈必知的5个知识点', category: '保健', reads: 6541, cover: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=300&fit=crop&q=80' },
  { id: '3', title: '待产包清单｜入院前必带的20样东西', category: '待产', reads: 12307, cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80' },
]
const mockProducts = [
  { id: '1', name: '婴儿奶瓶消毒器', rating: 4.9, price: 298, cover: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&h=300&fit=crop&q=80' },
  { id: '2', name: '孕妇专用护肤套装', rating: 4.8, price: 168, cover: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop&q=80' },
  { id: '3', name: '婴儿睡袋春秋款', rating: 4.7, price: 128, cover: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&h=300&fit=crop&q=80' },
]
const mockPosts = [
  { id: '1', user: '小美妈妈', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80', content: '宝宝今天第一次叫妈妈了！感动哭了', likes: 234, comments: 45 },
  { id: '2', user: '贝贝爸', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80', content: '分享一个哄睡神器，亲测有效！', likes: 189, comments: 32 },
]

const MomBaby = memo(() => {
  const [activeStage, setActiveStage] = useState(0)

  return (
    <View className="page mom-baby-page">
      <NavBar title="母婴育儿" showBack />
      <ScrollView scrollY className="mom-baby-page__scroll">

        {/* 孕育阶段选择 */}
        <View className="mom-stage-tabs">
          {stages.map((s, i) => (
            <View
              key={s}
              className={`mom-stage-tab ${i === activeStage ? 'mom-stage-tab--active' : ''}`}
              onClick={() => setActiveStage(i)}
            >
              <Text>{s}</Text>
            </View>
          ))}
        </View>

        {/* 知识文章 */}
        <View className="mom-section">
          <Text className="mom-section__title">📖 知识科普</Text>
          {mockArticles.map(a => (
            <View key={a.id} className="mom-article-card">
              <Image src={a.cover} className="mom-article-card__cover" />
              <View className="mom-article-card__body">
                <Text className="mom-article-card__title">{a.title}</Text>
                <View className="mom-article-card__meta">
                  <Text className="mom-article-card__tag">{a.category}</Text>
                  <Text className="mom-article-card__reads">👁 {a.reads.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 用品好物 */}
        <View className="mom-section">
          <Text className="mom-section__title">🛍 用品好物</Text>
          <View className="mom-products-grid">
            {mockProducts.map(p => (
              <View key={p.id} className="mom-product-card">
                <Image src={p.cover} className="mom-product-card__img" />
                <Text className="mom-product-card__name">{p.name}</Text>
                <View className="mom-product-card__footer">
                  <Text className="mom-product-card__rating">⭐ {p.rating}</Text>
                  <Text className="mom-product-card__price">¥{p.price}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 妈妈圈 */}
        <View className="mom-section">
          <Text className="mom-section__title">👩‍👧 妈妈圈</Text>
          {mockPosts.map(p => (
            <View key={p.id} className="mom-post">
              <Image src={p.avatar} className="mom-post__avatar" />
              <View className="mom-post__body">
                <Text className="mom-post__user">{p.user}</Text>
                <Text className="mom-post__content">{p.content}</Text>
                <View className="mom-post__actions">
                  <Text className="mom-post__action">❤️ {p.likes}</Text>
                  <Text className="mom-post__action">💬 {p.comments}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

MomBaby.displayName = 'MomBaby'
MomBaby.config = { navigationStyle: 'custom' } as any
export default MomBaby
