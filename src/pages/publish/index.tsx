import { View, Text, Textarea, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import TopicTag from '../../components/TopicTag'
import type { Topic } from '../../types'
import './index.css'

// 热门话题
const hotTopics: Topic[] = [
  { id: 'topic_001', name: '前端', posts: 10000 },
  { id: 'topic_002', name: 'React', posts: 8500 },
  { id: 'topic_003', name: 'Vue', posts: 7200 },
  { id: 'topic_004', name: 'TypeScript', posts: 6500 },
]

const Publish = memo(() => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([])
  const [isPosting, setIsPosting] = useState(false)
  const { currentUser, addPost } = useAppStore()

  const maxLength = 500

  // 选择图片
  const handleChooseImage = useCallback(async () => {
    if (images.length >= 9) {
      Taro.showToast({ title: '最多上传9张图片', icon: 'none' })
      return
    }
    
    try {
      const res = await Taro.chooseImage({
        count: 9 - images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })
      
      setImages([...images, ...res.tempFilePaths])
    } catch (error) {
      console.error('选择图片失败:', error)
    }
  }, [images])

  // 删除图片
  const handleRemoveImage = useCallback((index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }, [images])

  // 预览图片
  const handlePreviewImage = useCallback((index: number) => {
    Taro.previewImage({
      current: images[index],
      urls: images,
    })
  }, [images])

  // 选择话题
  const handleSelectTopic = useCallback((topic: Topic) => {
    if (selectedTopics.find(t => t.id === topic.id)) {
      setSelectedTopics(selectedTopics.filter(t => t.id !== topic.id))
    } else if (selectedTopics.length < 3) {
      setSelectedTopics([...selectedTopics, topic])
    } else {
      Taro.showToast({ title: '最多选择3个话题', icon: 'none' })
    }
  }, [selectedTopics])

  // 发布动态
  const handlePublish = useCallback(async () => {
    if (!content.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' })
      return
    }

    setIsPosting(true)
    
    try {
      // 实际项目中调用 API 上传
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // 添加新动态到列表
      const newPost = {
        id: `post_${Date.now()}`,
        user: currentUser!,
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
        topics: selectedTopics.length > 0 ? selectedTopics : undefined,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
      }
      
      addPost(newPost)
      
      Taro.showToast({ title: '发布成功', icon: 'success' })
      
      // 清空表单
      setContent('')
      setImages([])
      setSelectedTopics([])
      
      // 跳转到首页
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' })
      }, 1500)
    } catch (error) {
      Taro.showToast({ title: '发布失败', icon: 'none' })
    } finally {
      setIsPosting(false)
    }
  }, [content, images, selectedTopics, currentUser, addPost])

  // 获取位置
  const handleGetLocation = useCallback(async () => {
    try {
      const res = await Taro.getLocation({
        type: 'gcj02',
      })
      Taro.showToast({ 
        title: `位置: ${res.latitude.toFixed(2)}, ${res.longitude.toFixed(2)}`, 
        icon: 'none' 
      })
    } catch (error) {
      Taro.showToast({ title: '获取位置失败', icon: 'none' })
    }
  }, [])

  return (
    <View className="publish-page">
      {/* 导航栏 */}
      <View className="publish-page__nav safe-area-top">
        <View className="publish-page__nav-content">
          <View className="publish-page__cancel" onClick={() => Taro.navigateBack()}>
            <Text className="publish-page__cancel-text">取消</Text>
          </View>
          <Text className="publish-page__title">发布</Text>
          <View 
            className={`publish-page__submit ${isPosting ? 'publish-page__submit--disabled' : ''}`}
            onClick={isPosting ? undefined : handlePublish}
          >
            <Text className="publish-page__submit-text">
              {isPosting ? '发布中...' : '发布'}
            </Text>
          </View>
        </View>
      </View>

      {/* 内容区域 */}
      <View className="publish-page__content">
        {/* 文本输入 */}
        <View className="publish-page__input-wrapper">
          <Textarea
            className="publish-page__textarea"
            placeholder="分享你的想法..."
            value={content}
            onInput={(e: any) => setContent(e.detail.value)}
            maxlength={maxLength}
            cursorSpacing={20}
            autoFocus
          />
          <View className="publish-page__char-count">
            <Text className={content.length > maxLength * 0.9 ? 'publish-page__char-count--warning' : ''}>
              {content.length}/{maxLength}
            </Text>
          </View>
        </View>

        {/* 图片预览 */}
        {images.length > 0 && (
          <View className="publish-page__images">
            {images.map((image, index) => (
              <View key={index} className="publish-page__image-item">
                <Image
                  className="publish-page__image"
                  src={image}
                  mode="aspectFill"
                  onClick={() => handlePreviewImage(index)}
                />
                <View 
                  className="publish-page__image-remove"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Text className="publish-page__image-remove-icon">✕</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 功能栏 */}
        <View className="publish-page__toolbar">
          <View className="publish-page__tool" onClick={handleChooseImage}>
            <Text className="publish-page__tool-icon">📷</Text>
            <Text className="publish-page__tool-text">图片</Text>
          </View>
          <View className="publish-page__tool" onClick={handleGetLocation}>
            <Text className="publish-page__tool-icon">📍</Text>
            <Text className="publish-page__tool-text">位置</Text>
          </View>
          <View className="publish-page__tool">
            <Text className="publish-page__tool-icon">@</Text>
            <Text className="publish-page__tool-text">提醒</Text>
          </View>
        </View>

        {/* 话题选择 */}
        <View className="publish-page__topics">
          <View className="publish-page__topics-header">
            <Text className="publish-page__topics-title">添加话题</Text>
            {selectedTopics.length > 0 && (
              <Text className="publish-page__topics-selected">
                已选择: {selectedTopics.map(t => t.name).join(', ')}
              </Text>
            )}
          </View>
          <View className="publish-page__topics-list">
            {hotTopics.map((topic) => (
              <View 
                key={topic.id}
                className={`publish-page__topic-item ${
                  selectedTopics.find(t => t.id === topic.id) ? 'publish-page__topic-item--selected' : ''
                }`}
                onClick={() => handleSelectTopic(topic)}
              >
                <TopicTag topic={topic} size="small" />
                {selectedTopics.find(t => t.id === topic.id) && (
                  <Text className="publish-page__topic-check">✓</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
})

Publish.config = {
  navigationStyle: 'custom',
} as any

Publish.displayName = 'Publish'

export default Publish
