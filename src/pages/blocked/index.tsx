import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useState } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const Blocked = memo(() => {
  const [keywords, setKeywords] = useState(['广告', '赌博', '诈骗'])

  const handleRemove = useCallback((kw: string) => {
    setKeywords((k) => k.filter((x) => x !== kw))
    Taro.showToast({ title: '已移除', icon: 'none' })
  }, [])

  const handleAdd = useCallback(() => {
    Taro.showToast({ title: '演示：输入关键词后回车添加', icon: 'none' })
  }, [])

  return (
    <View className="blocked-page">
      <NavBar title="屏蔽管理" showBack />
      <ScrollView scrollY className="blocked-page__body">
        <View className="blocked-page__card">
          <Text className="blocked-page__label">屏蔽关键词</Text>
          <Text className="blocked-page__desc">包含这些关键词的内容将被过滤</Text>
          <View className="blocked-page__tags">
            {keywords.map((kw) => (
              <View key={kw} className="blocked-page__tag">
                <Text className="blocked-page__tag-text">{kw}</Text>
                <Text className="blocked-page__tag-close" onClick={() => handleRemove(kw)}>×</Text>
              </View>
            ))}
            <View className="blocked-page__tag blocked-page__tag--add" onClick={handleAdd}>
              <Text className="blocked-page__tag-text">+ 添加</Text>
            </View>
          </View>
        </View>

        <View className="blocked-page__card">
          <Text className="blocked-page__label">屏蔽话题</Text>
          <Text className="blocked-page__desc">这些话题的内容将被过滤</Text>
          <View className="blocked-page__tags">
            <View className="blocked-page__tag">
              <Text className="blocked-page__tag-text"># 房产中介</Text>
              <Text className="blocked-page__tag-close">×</Text>
            </View>
          </View>
        </View>

        <View className="blocked-page__hint">
          <Text className="blocked-page__hint-text">屏蔽后，相关内容将不会出现在首页推荐流中</Text>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Blocked.config = { navigationStyle: 'custom' } as any
Blocked.displayName = 'Blocked'
export default Blocked
