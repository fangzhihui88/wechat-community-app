import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const CATEGORIES = [
  { id: 'sports', label: '运动健身' },
  { id: 'reading', label: '读书学习' },
  { id: 'food', label: '美食探店' },
  { id: 'travel', label: '旅行户外' },
  { id: 'tech', label: '科技数码' },
  { id: 'career', label: '职场发展' },
]

const CreateGroup = memo(() => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [isPublic, setIsPublic] = useState(true)

  const handleToggleCat = useCallback((id: string) => {
    setSelectedCats(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }, [])

  const handleCreate = useCallback(() => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入群名称', icon: 'none' })
      return
    }
    Taro.showToast({ title: '创建成功', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 1500)
  }, [name])

  return (
    <View className="page">
      <NavBar title="建群" showBack rightText="创建" onRightClick={handleCreate} />
      <ScrollView scrollY className="page__scroll">
        <View className="page__body">
          <View className="mp-group">
            <View className="mp-cell">
              <Text className="mp-cell__label">群名称</Text>
              <Input
                className="create-input"
                placeholder="请输入群名称"
                value={name}
                onInput={e => setName(e.detail.value)}
                maxlength={20}
              />
            </View>
          </View>

          <View className="mp-group">
            <View className="form-label">
              <Text className="mp-cell__label">群简介</Text>
              <Text className="form-label__count">{description.length}/100</Text>
            </View>
            <Textarea
              className="create-textarea"
              placeholder="介绍一下你的群吧~"
              value={description}
              onInput={e => setDescription(e.detail.value)}
              maxlength={100}
            />
          </View>

          <View className="mp-group">
            <View className="mp-section">
              <Text className="mp-section__title">群分类（可多选）</Text>
            </View>
            <View className="category-chips">
              {CATEGORIES.map(cat => (
                <View
                  key={cat.id}
                  className={`mp-tag ${selectedCats.includes(cat.id) ? 'mp-tag--active' : ''}`}
                  onClick={() => handleToggleCat(cat.id)}
                >
                  <Text className="mp-tag__text">{cat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mp-group">
            <View className="mp-cell">
              <Text className="mp-cell__label">公开群</Text>
              <View className={`mp-switch ${isPublic ? 'mp-switch--on' : ''}`} onClick={() => setIsPublic(!isPublic)}>
                <View className="mp-switch__knob" />
              </View>
            </View>
            <Text className="form-hint">公开群可在群广场被搜索到</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
})

CreateGroup.config = { navigationStyle: 'custom' } as any
CreateGroup.displayName = 'CreateGroup'
export default CreateGroup
