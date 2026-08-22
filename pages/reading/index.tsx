import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

interface Book {
  id: number
  title: string
  author: string
  cover: string
  progress: number
  totalPages: number
}

interface Review {
  id: number
  bookTitle: string
  rating: number
  comment: string
  userAvatar: string
  userName: string
}

const mockBooks: Book[] = [
  { id: 1, title: '活着', author: '余华', cover: 'https://picsum.photos/seed/reading1/200/280', progress: 72, totalPages: 180 },
  { id: 2, title: '百年孤独', author: '马尔克斯', cover: 'https://picsum.photos/seed/reading2/200/280', progress: 45, totalPages: 360 },
  { id: 3, title: '三体', author: '刘慈欣', cover: 'https://picsum.photos/seed/reading3/200/280', progress: 100, totalPages: 320 },
  { id: 4, title: '围城', author: '钱钟书', cover: 'https://picsum.photos/seed/reading4/200/280', progress: 28, totalPages: 310 },
  { id: 5, title: '追风筝的人', author: '卡勒德·胡赛尼', cover: 'https://picsum.photos/seed/reading5/200/280', progress: 88, totalPages: 274 },
  { id: 6, title: '解忧杂货店', author: '东野圭吾', cover: 'https://picsum.photos/seed/reading6/200/280', progress: 55, totalPages: 289 },
]

const mockReviews: Review[] = [
  { id: 1, bookTitle: '活着', rating: 5, comment: '福贵的一生让人泪目，活着本身就是意义。', userAvatar: 'https://picsum.photos/seed/user1/100/100', userName: '书虫小雅' },
  { id: 2, bookTitle: '百年孤独', rating: 4, comment: '魔幻现实主义的巅峰之作，名字难记但值得。', userAvatar: 'https://picsum.photos/seed/user2/100/100', userName: '文学青年' },
  { id: 3, bookTitle: '三体', rating: 5, comment: '打开科幻新世界的大门，黑暗森林法则震撼到我了。', userAvatar: 'https://picsum.photos/seed/user3/100/100', userName: '宇宙探索者' },
  { id: 4, bookTitle: '追风筝的人', rating: 5, comment: '为你，千千万万遍。每次读都热泪盈眶。', userAvatar: 'https://picsum.photos/seed/user4/100/100', userName: '心灵读者' },
]

const mockRecommendLists = [
  { id: 1, name: '豆瓣 Top250 必读', cover: 'https://picsum.photos/seed/rl1/300/200', count: 10 },
  { id: 2, name: '诺贝尔文学奖系列', cover: 'https://picsum.photos/seed/rl2/300/200', count: 8 },
  { id: 3, name: '年度重磅新书', cover: 'https://picsum.photos/seed/rl3/300/200', count: 12 },
  { id: 4, name: '心理学入门经典', cover: 'https://picsum.photos/seed/rl4/300/200', count: 6 },
  { id: 5, name: '科幻迷的私藏书单', cover: 'https://picsum.photos/seed/rl5/300/200', count: 9 },
]

const Reading = memo(() => {
  const [books] = useState<Book[]>(mockBooks)
  const [reviews] = useState<Review[]>(mockReviews)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Text key={i} className={`review-card__star ${i < rating ? 'review-card__star--active' : ''}`}>★</Text>
    ))
  }

  return (
    <View className="page">
      <NavBar title="读书社区" showBack />
      <ScrollView scrollY className="reading-body">

        {/* 读书笔记入口 */}
        <View className="section">
          <View className="reading-notes-entry" onClick={() => Taro.showToast({ title: '读书笔记', icon: 'none' })}>
            <View className="reading-notes-entry__left">
              <Text className="reading-notes-entry__icon">📖</Text>
              <View className="reading-notes-entry__info">
                <Text className="reading-notes-entry__title">我的读书笔记</Text>
                <Text className="reading-notes-entry__sub">记录每一页的思考</Text>
              </View>
            </View>
            <Text className="reading-notes-entry__arrow">›</Text>
          </View>
        </View>

        {/* 书架 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">我的书架</Text>
            <Text className="section__more">全部 ›</Text>
          </View>
          <View className="book-grid">
            {books.map(book => (
              <View key={book.id} className="book-card">
                <Image className="book-card__cover" src={book.cover} mode="aspectFill" />
                <View className="book-card__info">
                  <Text className="book-card__title" numberOfLines={1}>{book.title}</Text>
                  <Text className="book-card__author" numberOfLines={1}>{book.author}</Text>
                  <View className="book-card__progress-wrap">
                    <View className="book-card__progress-bar">
                      <View className="book-card__progress-fill" style={{ width: `${book.progress}%` }} />
                    </View>
                    <Text className="book-card__progress-text">{book.progress}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 推荐书单 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">推荐书单</Text>
            <Text className="section__more">更多 ›</Text>
          </View>
          <ScrollView scrollX className="recommend-scroll">
            <View className="recommend-list">
              {mockRecommendLists.map(item => (
                <View key={item.id} className="recommend-card" onClick={() => Taro.showToast({ title: item.name, icon: 'none' })}>
                  <Image className="recommend-card__cover" src={item.cover} mode="aspectFill" />
                  <Text className="recommend-card__name" numberOfLines={2}>{item.name}</Text>
                  <Text className="recommend-card__count">{item.count} 本</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 书评列表 */}
        <View className="section">
          <View className="section__header">
            <Text className="section__title">最新书评</Text>
            <Text className="section__more">更多 ›</Text>
          </View>
          {reviews.map(review => (
            <View key={review.id} className="review-card">
              <View className="review-card__header">
                <Image className="review-card__avatar" src={review.userAvatar} mode="aspectFill" />
                <View className="review-card__meta">
                  <Text className="review-card__username">{review.userName}</Text>
                  <Text className="review-card__book">{review.bookTitle}</Text>
                </View>
                <View className="review-card__stars">{renderStars(review.rating)}</View>
              </View>
              <Text className="review-card__comment">{review.comment}</Text>
            </View>
          ))}
        </View>

        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Reading.config = { navigationStyle: 'custom' } as any
Reading.displayName = 'Reading'
export default Reading
