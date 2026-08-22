import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import EmptyState from '../../components/EmptyState'
import './index.css'

const MyDrafts = memo(() => {
  const { draftPosts, removeDraft } = useAppStore()

  const handleEdit = useCallback((draft: any) => {
    Taro.showToast({ title: '已载入草稿，去发布页继续编辑', icon: 'none' })
  }, [])

  const handleDelete = useCallback((id: string) => {
    Taro.showModal({
      title: '删除草稿',
      content: '确定要删除这篇草稿吗？',
      success: (res) => {
        if (res.confirm) {
          removeDraft(id)
          Taro.showToast({ title: '已删除', icon: 'success' })
        }
      },
    })
  }, [removeDraft])

  return (
    <View className="mydrafts-page">
      <NavBar title="草稿箱" showBack />
      <ScrollView scrollY className="mydrafts-page__body">
        {draftPosts.length === 0 ? (
          <EmptyState icon="📄" title="草稿箱是空的" description="发布时选择保存草稿，就会出现在这里" />
        ) : (
          draftPosts.map((d) => (
            <View key={d.id} className="mydrafts-page__item">
              <View className="mydrafts-page__content" onClick={() => handleEdit(d)}>
                {d.images.length > 0 && <Image className="mydrafts-page__thumb" src={d.images[0]} mode="aspectFill" />}
                <View className="mydrafts-page__info">
                  <Text className="mydrafts-page__text">{d.content || '（无文字内容）'}</Text>
                  <Text className="mydrafts-page__time">编辑于 {new Date(d.updatedAt).toLocaleString('zh-CN')}</Text>
                </View>
              </View>
              <View className="mydrafts-page__actions">
                <View className="mydrafts-page__btn" onClick={() => handleEdit(d)}>
                  <Text className="mydrafts-page__btn-text">编辑</Text>
                </View>
                <View className="mydrafts-page__btn mydrafts-page__btn--danger" onClick={() => handleDelete(d.id)}>
                  <Text className="mydrafts-page__btn-text">删除</Text>
                </View>
              </View>
            </View>
          ))
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

MyDrafts.config = { navigationStyle: 'custom' } as any
MyDrafts.displayName = 'MyDrafts'
export default MyDrafts
