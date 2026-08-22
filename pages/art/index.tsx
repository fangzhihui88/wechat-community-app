import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

interface Artwork {
  id: number
  title: string
  artist: string
  year: number
  cover: string
  desc: string
  category: string
}

interface Artist {
  id: number
  name: string
  avatar: string
  bio: string
  worksCount: number
  style: string
}

const CATEGORIES = ['全部', '油画', '水彩', '雕塑', '摄影', '装置']

const mockArtworks: Artwork[] = [
  { id: 1, title: '星空', artist: '文森特·梵高', year: 1889, cover: 'https://picsum.photos/seed/art1/600/400', desc: '后印象派代表作之一，描绘了阿尔勒夜晚的星空景象。', category: '油画' },
  { id: 2, title: '蒙娜丽莎', artist: '达·芬奇', year: 1503, cover: 'https://picsum.photos/seed/art2/400/600', desc: '文艺复兴时期最著名的肖像画之一，神秘微笑至今令人着迷。', category: '油画' },
  { id: 3, title: '呐喊', artist: '爱德华·蒙克', year: 1893, cover: 'https://picsum.photos/seed/art3/500/400', desc: '表现主义先驱之作，表达了人类永恒的恐惧与焦虑。', category: '油画' },
  { id: 4, title: '记忆的永恒', artist: '萨尔瓦多·达利', year: 1931, cover: 'https://picsum.photos/seed/art4/600/400', desc: '超现实主义经典，融化的时钟成为20世纪最具标志性的视觉符号。', category: '油画' },
  { id: 5, title: '睡莲', artist: '克劳德·莫奈', year: 1906, cover: 'https://picsum.photos/seed/art5/500/400', desc: '印象派大师晚年的巅峰系列，以光与色彩的变幻捕捉自然之美。', category: '水彩' },
  { id: 6, title: '思想者', artist: '奥古斯特·罗丹', year: 1904, cover: 'https://picsum.photos/seed/art6/400/600', desc: '雕塑史上的不朽丰碑，刻画了人类内心深处的沉思与力量。', category: '雕塑' },
  { id: 7, title: '镜中人', artist: '荒木经惟', year: 1990, cover: 'https://picsum.photos/seed/art7/400/500', desc: '当代摄影艺术的独特表达，探索身体、时间与存在的边界。', category: '摄影' },
  { id: 8, title: '雨屋', artist: '奥拉维尔·埃利亚松', year: 2012, cover: 'https://picsum.photos/seed/art8/600/400', desc: '沉浸式装置艺术代表作，让观众在雨中漫步而不被淋湿。', category: '装置' },
]

const mockArtists: Artist[] = [
  { id: 1, name: '梵高', avatar: 'https://picsum.photos/seed/artist1/200/200', bio: '后印象派巨匠，用生命燃烧艺术。', worksCount: 37, style: '油画' },
  { id: 2, name: '达·芬奇', avatar: 'https://picsum.photos/seed/artist2/200/200', bio: '文艺复兴全才，人文主义先驱。', worksCount: 28, style: '油画/雕塑' },
  { id: 3, name: '莫奈', avatar: 'https://picsum.photos/seed/artist3/200/200', bio: '印象派创始人，光与色彩的大师。', worksCount: 42, style: '水彩' },
  { id: 4, name: '罗丹', avatar: 'https://picsum.photos/seed/artist4/200/200', bio: '现代雕塑之父，力量与美的塑造者。', worksCount: 19, style: '雕塑' },
]

const Art = memo(() => {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filteredArtworks = activeCategory === '全部'
    ? mockArtworks
    : mockArtworks.filter(a => a.category === activeCategory)

  const toggleExpand = (id: number) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  const handleAuction = (title: string) => {
    Taro.showToast({ title: `拍卖: ${title}`, icon: 'none' })
  }

  return (
    <View className="page">
      <NavBar title="艺术画廊" showBack />
      <ScrollView scrollY className="art-body">

        {/* 艺术品拍卖入口 */}
        <View className="section">
          <View className="auction-banner" onClick={() => Taro.showToast({ title: '艺术品拍卖', icon: 'none' })}>
            <View className="auction-banner__left">
              <Text className="auction-banner__icon">🏛️</Text>
              <View className="auction-banner__info">
                <Text className="auction-banner__title">艺术品拍卖</Text>
                <Text className="auction-banner__sub">珍品竞拍 · 火热进行中</Text>
              </View>
            </View>
            <View className="auction-banner__badge">
              <Text className="auction-banner__badge-text">去看看</Text>
            </View>
          </View>
        </View>

        {/* 艺术家介绍 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">艺术家</Text>
            <Text className="section__more">更多 ›</Text>
          </View>
          <View className="artist-grid">
            {mockArtists.map(artist => (
              <View key={artist.id} className="artist-card" onClick={() => Taro.showToast({ title: artist.name, icon: 'none' })}>
                <Image className="artist-card__avatar" src={artist.avatar} mode="aspectFill" />
                <View className="artist-card__info">
                  <Text className="artist-card__name">{artist.name}</Text>
                  <Text className="artist-card__style">{artist.style}</Text>
                  <Text className="artist-card__bio" numberOfLines={2}>{artist.bio}</Text>
                  <Text className="artist-card__count">{artist.worksCount} 件作品</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 作品分类 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">作品分类</Text>
          </View>
          <View className="category-chips">
            {CATEGORIES.map(cat => (
              <View
                key={cat}
                className={`category-chip ${activeCategory === cat ? 'category-chip--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <Text className={`category-chip__text ${activeCategory === cat ? 'category-chip__text--active' : ''}`}>
                  {cat}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 艺术作品 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">艺术作品</Text>
            <Text className="section__more">{filteredArtworks.length} 件</Text>
          </View>
          {filteredArtworks.map(artwork => (
            <View key={artwork.id} className={`artwork-card ${expandedId === artwork.id ? 'artwork-card--expanded' : ''}`}>
              <View className="artwork-card__cover-wrap" onClick={() => toggleExpand(artwork.id)}>
                <Image
                  className="artwork-card__cover"
                  src={artwork.cover}
                  mode="aspectFill"
                  className={`artwork-card__cover ${expandedId === artwork.id ? 'artwork-card__cover--expanded' : ''}`}
                />
              </View>
              <View className="artwork-card__info">
                <View className="artwork-card__header">
                  <View>
                    <Text className="artwork-card__title">{artwork.title}</Text>
                    <Text className="artwork-card__meta">{artwork.artist} · {artwork.year}年 · {artwork.category}</Text>
                  </View>
                  <View
                    className="artwork-card__auction-btn"
                    onClick={() => handleAuction(artwork.title)}
                  >
                    <Text className="artwork-card__auction-text">参与竞拍</Text>
                  </View>
                </View>
                {expandedId === artwork.id && (
                  <View className="artwork-card__desc-wrap">
                    <Text className="artwork-card__desc">{artwork.desc}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Art.config = { navigationStyle: 'custom' } as any
Art.displayName = 'Art'
export default Art
