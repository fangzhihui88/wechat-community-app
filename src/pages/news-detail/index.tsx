import { memo } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const mockArticle = {
  id: 1,
  title: 'AI大模型迎来新突破，多模态能力大幅提升',
  source: '科技日报',
  time: '2024-01-15 10:30',
  cover: 'https://picsum.photos/800/400?random=41',
  content: [
    '近日，全球领先的AI研究机构发布了最新一代大语言模型，该模型在多模态理解与生成方面取得了重大突破。',
    '据了解，新模型不仅能够处理文本、图像、音频等多种模态的输入，还能够实现跨模态的联合推理，大幅提升了AI系统的综合能力。',
    '业内专家表示，这一突破标志着AI技术从单模态向多模态发展的重要里程碑，将为各行各业的智能化升级提供更强大的技术支撑。',
    '目前，该模型已在多个应用场景中完成测试，预计将于下季度正式向开发者开放API接口。',
  ],
}

const relatedNews = [
  { id: 2, title: 'GPT-5传闻再起，OpenAI回应：持续创新', cover: 'https://picsum.photos/200/150?random=42' },
  { id: 3, title: '国内AI大模型盘点：谁将脱颖而出', cover: 'https://picsum.photos/200/150?random=43' },
  { id: 4, title: 'AI芯片市场竞争加剧，格局重塑', cover: 'https://picsum.photos/200/150?random=44' },
]

const NewsDetail = memo(() => {
  const router = useRouter()
  const articleId = router.params.id || '1'

  return (
    <View className="page">
      <NavBar title="资讯详情" showBack />
      <ScrollView scrollY className="page__body">
        <View className="article">
          <Text className="article__title">{mockArticle.title}</Text>
          <View className="article__meta">
            <Text className="article__source">{mockArticle.source}</Text>
            <Text className="article__time">{mockArticle.time}</Text>
          </View>
          <Image src={mockArticle.cover} className="article__cover" mode="widthFix" />
          <View className="article__content">
            {mockArticle.content.map((para, index) => (
              <Text key={index} className="article__paragraph">
                {para}
              </Text>
            ))}
          </View>
        </View>

        <View className="related">
          <Text className="related__title">相关推荐</Text>
          <View className="related__list">
            {relatedNews.map((news) => (
              <View key={news.id} className="related__item">
                <Image src={news.cover} className="related__item-cover" mode="aspectFill" />
                <Text className="related__item-title">{news.title}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
})

NewsDetail.displayName = 'NewsDetail'
NewsDetail.config = { navigationStyle: 'custom' } as any

export default NewsDetail
