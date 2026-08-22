import { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const MOCK = {
  id: '1',
  title: 'iPhone 14 Pro Max 256G 国行 99新',
  price: 5800,
  seller: '李明',
  avatar: 'https://i.pravatar.cc/100?img=1',
  desc: [
    '2023年6月购入，一直贴膜戴壳使用，屏幕无划痕，机身无磕碰。',
    '国行正品，支持官方验机。电池健康度93%。',
    '配件齐全：原装充电线+包装盒+说明书。',
    '可当面交易，地点海淀区五道口附近。',
  ],
}

function TradeDetail() {
  const router = useRouter()
  const id = router.params.id || '1'
  const [item] = useState(() => MOCK)

  return (
    <View className="page">
      <NavBar title="商品详情" showBack />
      <ScrollView scrollY className="detail-scroll">
        {/* 轮播图 */}
        <Swiper
          className="detail-swiper"
          indicatorDots
          autoplay
          circular
          indicatorColor="rgba(255,255,255,0.4)"
          indicatorActiveColor="#fff"
        >
          {[1, 2, 3].map(n => (
            <SwiperItem key={n}>
              <Image
                className="detail-swiper__img"
                src={`https://picsum.photos/750/500?random=trade${id}${n}`}
                mode="aspectFill"
              />
            </SwiperItem>
          ))}
        </Swiper>

        {/* 价格 */}
        <View className="detail-price-row">
          <Text className="detail-price">¥{item.price}</Text>
        </View>

        {/* 标题 */}
        <View className="detail-section">
          <Text className="detail-title">{item.title}</Text>
        </View>

        <View className="detail-divider" />

        {/* 卖家信息 */}
        <View className="detail-section">
          <View className="seller-row">
            <Image className="seller-avatar" src={item.avatar} />
            <Text className="seller-nick">{item.seller}</Text>
            <View className="seller-action">
              <Text className="seller-action__text">想要</Text>
            </View>
          </View>
        </View>

        <View className="detail-divider" />

        {/* 商品描述 */}
        <View className="detail-section">
          <Text className="detail-section__title">商品描述</Text>
          {item.desc.map((d, i) => (
            <Text key={i} className="detail-desc">{d}</Text>
          ))}
        </View>
      </ScrollView>

      {/* 底部购买 */}
      <View className="detail-footer">
        <View
          className="detail-buy-btn"
          onClick={() => Taro.showToast({ title: '购买功能开发中', icon: 'none' })}
        >
          立即购买
        </View>
      </View>
    </View>
  )
}

TradeDetail.config = { navigationStyle: 'custom' } as any
TradeDetail.displayName = 'TradeDetail'

export default TradeDetail
