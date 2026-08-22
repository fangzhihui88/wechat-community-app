import { memo, useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import SearchBar from '../../components/SearchBar'
import './index.css'

const mockSteps = [
  { id: 1, step: '清洁', product: '氨基酸洁面乳', tip: '温水打湿，泡沫敷面 30 秒' },
  { id: 2, step: '爽肤水', product: '保湿化妆水', tip: '轻拍至吸收，避免用力擦拭' },
  { id: 3, step: '精华', product: '维C美白精华', tip: '滴管取 3-5 滴，重点涂抹暗沉区' },
  { id: 4, step: '面霜', product: '保湿面霜', tip: '掌心乳化后按压上脸' },
  { id: 5, step: '防晒', product: 'SPF50+ 防晒霜', tip: '出门前 15 分钟涂抹，每 2 小时补涂' },
]
const mockTutorials = [
  { id: '1', title: '新手日常妆保姆级教程', difficulty: '入门', collects: 8923, cover: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=200&fit=crop&q=80' },
  { id: '2', title: '高级感眼妆画法详解', difficulty: '进阶', collects: 6541, cover: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=200&fit=crop&q=80' },
  { id: '3', title: '3分钟快速出门妆', difficulty: '入门', collects: 12307, cover: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=200&fit=crop&q=80' },
]
const mockIngredients = [
  { id: '1', name: '烟酰胺', effect: '美白淡斑', safety: 5 },
  { id: '2', name: '透明质酸', effect: '深层补水', safety: 5 },
  { id: '3', name: '视黄醇', effect: '抗老紧致', safety: 3 },
  { id: '4', name: '水杨酸', effect: '去角质', safety: 3 },
  { id: '5', name: '神经酰胺', effect: '修复屏障', safety: 5 },
]
const mockProducts = [
  { id: '1', name: '兰蔻小黑瓶精华', rating: 4.9, price: 760, cover: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop&q=80' },
  { id: '2', name: 'SK-II 神仙水', rating: 4.8, price: 1190, cover: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop&q=80' },
  { id: '3', name: '雅诗兰黛小棕瓶', rating: 4.7, price: 590, cover: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop&q=80' },
]

const Beauty = memo(() => {
  const [tab, setTab] = useState(0)
  const [keyword, setKeyword] = useState('')
  const tabs = ['护肤步骤', '美妆教程', '成分百科', '产品测评']
  const safetyLabel = (n: number) => ['未知', '低', '中等', '较安全', '安全', '极安全'][n]

  return (
    <View className="page beauty-page">
      <NavBar title="美容美妆" showBack />
      <ScrollView scrollY className="beauty-page__scroll">

        {/* Tab 切换 */}
        <View className="beauty-tabs">
          {tabs.map((t, i) => (
            <View key={t} className={`beauty-tab ${i === tab ? 'beauty-tab--active' : ''}`} onClick={() => setTab(i)}>
              <Text>{t}</Text>
            </View>
          ))}
        </View>

        {tab === 0 && (
          <View className="beauty-section">
            {mockSteps.map((s, i) => (
              <View key={s.id} className="beauty-step">
                <View className="beauty-step__num">{i + 1}</View>
                <View className="beauty-step__info">
                  <Text className="beauty-step__name">{s.step}</Text>
                  <Text className="beauty-step__product">💄 {s.product}</Text>
                  <Text className="beauty-step__tip">💡 {s.tip}</Text>
                </View>
                {i < mockSteps.length - 1 && <View className="beauty-step__line" />}
              </View>
            ))}
          </View>
        )}

        {tab === 1 && (
          <View className="beauty-section">
            {mockTutorials.map(t => (
              <View key={t.id} className="beauty-tutorial-card">
                <Image src={t.cover} className="beauty-tutorial-card__cover" />
                <View className="beauty-tutorial-card__body">
                  <Text className="beauty-tutorial-card__title">{t.title}</Text>
                  <View className="beauty-tutorial-card__meta">
                    <Text className="beauty-tutorial-card__diff">{t.difficulty}</Text>
                    <Text className="beauty-tutorial-card__coll">⭐ {t.collects.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === 2 && (
          <View className="beauty-section">
            <View style="padding: 0 0 16px"><SearchBar placeholder="搜索成分..." onSearch={(k) => setKeyword(k)} autoFocus={false} /></View>
            {mockIngredients.filter(i => !keyword || i.name.includes(keyword)).map(ing => (
              <View key={ing.id} className="beauty-ing-card">
                <View className="beauty-ing-card__name">{ing.name}</View>
                <View className="beauty-ing-card__effect">{ing.effect}</View>
                <View className="beauty-ing-card__safety" style={{ color: ing.safety >= 4 ? '#34C759' : '#FF9500' }}>
                  安全性：{'⭐'.repeat(ing.safety)} {safetyLabel(ing.safety)}
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === 3 && (
          <View className="beauty-section">
            {mockProducts.map(p => (
              <View key={p.id} className="beauty-product-card">
                <Image src={p.cover} className="beauty-product-card__img" />
                <View className="beauty-product-card__body">
                  <Text className="beauty-product-card__name">{p.name}</Text>
                  <View className="beauty-product-card__footer">
                    <Text className="beauty-product-card__rating">⭐ {p.rating}</Text>
                    <Text className="beauty-product-card__price">¥{p.price}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Beauty.displayName = 'Beauty'
Beauty.config = { navigationStyle: 'custom' } as any
export default Beauty
