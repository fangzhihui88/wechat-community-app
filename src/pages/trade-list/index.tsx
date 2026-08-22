import { useState } from 'react'
import { View, Text, ScrollView, Image, Chip } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const CATEGORIES = ['全部', '数码', '服饰', '家居', '图书']

const MOCK_ITEMS = [
  { id: '1', title: 'iPhone 14 Pro Max 256G 国行', price: 5800, seller: '李明', avatar: 'https://i.pravatar.cc/100?img=1', category: '数码' },
  { id: '2', title: '小米13 8+256G 99新', price: 2200, seller: '张伟', avatar: 'https://i.pravatar.cc/100?img=2', category: '数码' },
  { id: '3', title: '优衣库联名款卫衣 M码', price: 89, seller: '王芳', avatar: 'https://i.pravatar.cc/100?img=3', category: '服饰' },
  { id: '4', title: 'ZARA风衣女士 全新带吊牌', price: 199, seller: '赵丽', avatar: 'https://i.pravatar.cc/100?img=4', category: '服饰' },
  { id: '5', title: '宜家书架 简约款 9成新', price: 350, seller: '陈强', avatar: 'https://i.pravatar.cc/100?img=5', category: '家居' },
  { id: '6', title: '二手茶几 实木 60x40', price: 120, seller: '刘洋', avatar: 'https://i.pravatar.cc/100?img=6', category: '家居' },
  { id: '7', title: 'Python编程从入门到实践', price: 35, seller: '周杰', avatar: 'https://i.pravatar.cc/100?img=7', category: '图书' },
  { id: '8', title: '算法导论 第3版 原版进口', price: 180, seller: '吴磊', avatar: 'https://i.pravatar.cc/100?img=8', category: '图书' },
]

function TradeList() {
  const [activeTab, setActiveTab] = useState('全部')

  const filtered = activeTab === '全部' ? MOCK_ITEMS : MOCK_ITEMS.filter(i => i.category === activeTab)

  const handleClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/trade-detail/index?id=${id}` })
  }

  return (
    <View className="page">
      <NavBar title="二手市场" showBack />
      <View className="page__body">
        <ScrollView scrollY>
          {/* 分类 chips */}
          <View className="chips-wrap">
            {CATEGORIES.map(cat => (
              <View
                key={cat}
                className={`chip ${activeTab === cat ? 'chip--active' : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </View>
            ))}
          </View>

          {/* 商品网格 */}
          <View className="goods-grid">
            {filtered.map(item => (
              <View
                key={item.id}
                className="goods-card"
                onClick={() => handleClick(item.id)}
              >
                <Image
                  className="goods-card__pic"
                  src={`https://picsum.photos/300/300?random=${item.id}`}
                  mode="aspectFill"
                />
                <View className="goods-card__info">
                  <Text className="goods-card__title">{item.title}</Text>
                  <View className="goods-card__row">
                    <Text className="goods-card__price">¥{item.price}</Text>
                    <View className="goods-card__seller">
                      <Image className="goods-card__avatar" src={item.avatar} />
                      <Text className="goods-card__nick">{item.seller}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

TradeList.config = { navigationStyle: 'custom' } as any
TradeList.displayName = 'TradeList'

export default TradeList
