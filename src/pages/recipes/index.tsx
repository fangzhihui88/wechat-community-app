import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useCallback } from 'react'
import NavBar from '../../components/NavBar'
import SearchBar from '../../components/SearchBar'
import './index.css'

// --- Mock Data ---
const categories = ['早餐', '午餐', '晚餐', '甜点', '饮品']

const mockRecipes = [
  { id: 1, title: '蒜香黄油虾', author: '美食小当家', cover: 'https://picsum.photos/seed/recipe1/400/300', likes: 2341, category: '晚餐' },
  { id: 2, title: '日式厚蛋烧', author: '日食记', cover: 'https://picsum.photos/seed/recipe2/400/300', likes: 1892, category: '早餐' },
  { id: 3, title: '杨枝甘露', author: '甜品控', cover: 'https://picsum.photos/seed/recipe3/400/300', likes: 3204, category: '饮品' },
  { id: 4, title: '红烧肉炖蛋', author: '家常味道', cover: 'https://picsum.photos/seed/recipe4/400/300', likes: 4512, category: '午餐' },
  { id: 5, title: '提拉米苏', author: '烘焙达人', cover: 'https://picsum.photos/seed/recipe5/400/300', likes: 5620, category: '甜点' },
  { id: 6, title: '皮蛋瘦肉粥', author: '早餐党', cover: 'https://picsum.photos/seed/recipe6/400/300', likes: 987, category: '早餐' },
  { id: 7, title: '麻婆豆腐', author: '川味馆', cover: 'https://picsum.photos/seed/recipe7/400/300', likes: 3105, category: '午餐' },
  { id: 8, title: '珍珠奶茶', author: '奶茶少女', cover: 'https://picsum.photos/seed/recipe8/400/300', likes: 7803, category: '饮品' },
  { id: 9, title: '芒果班戟', author: '甜品师小绿', cover: 'https://picsum.photos/seed/recipe9/400/300', likes: 2109, category: '甜点' },
  { id: 10, title: '糖醋里脊', author: '中华小当家', cover: 'https://picsum.photos/seed/recipe10/400/300', likes: 3890, category: '晚餐' },
]

// --- Component ---
const RecipesPage = memo(() => {
  const [activeTab, setActiveTab] = useState('全部')
  const allCategories = ['全部', ...categories]
  const displayRecipes = activeTab === '全部'
    ? mockRecipes
    : mockRecipes.filter((r) => r.category === activeTab)

  const handleSearch = useCallback((val: string) => {
    Taro.showToast({ title: `搜索: ${val}`, icon: 'none' })
  }, [])

  const handlePublish = useCallback(() => {
    Taro.showToast({ title: '发布菜谱', icon: 'none' })
  }, [])

  return (
    <View className="page recipes-page">
      <NavBar title="美食菜谱" showBack />

      <View className="recipes-page__search">
        <SearchBar placeholder="搜索菜谱、食材..." onSearch={handleSearch} />
      </View>

      {/* 分类 tabs */}
      <View className="recipes-page__tabs-wrap">
        <ScrollView scrollX className="recipes-page__tabs-scroll">
          <View className="recipes-page__tabs">
            {allCategories.map((cat) => (
              <View
                key={cat}
                className={`recipes-page__tab ${activeTab === cat ? 'recipes-page__tab--active' : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                <Text className="recipes-page__tab-text">{cat}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView scrollY className="recipes-page__body">
        <View className="recipes-page__grid">
          {displayRecipes.map((recipe) => (
            <View key={recipe.id} className="recipes-page__card">
              <Image
                className="recipes-page__card-cover"
                src={recipe.cover}
                mode="aspectFill"
              />
              <View className="recipes-page__card-body">
                <Text className="recipes-page__card-title">{recipe.title}</Text>
                <View className="recipes-page__card-meta">
                  <Text className="recipes-page__card-author">{recipe.author}</Text>
                  <View className="recipes-page__card-likes">
                    <Text className="recipes-page__card-heart">♥</Text>
                    <Text className="recipes-page__card-like-num">{recipe.likes}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View className="recipes-page__safe-bottom" />
      </ScrollView>

      {/* 底部发布按钮 */}
      <View className="recipes-page__footer">
        <View className="recipes-page__publish-btn" onClick={handlePublish}>
          <Text className="recipes-page__publish-btn-icon">+</Text>
          <Text className="recipes-page__publish-btn-text">发布菜谱</Text>
        </View>
      </View>
    </View>
  )
})

RecipesPage.config = { navigationStyle: 'custom' } as any
RecipesPage.displayName = 'RecipesPage'
export default RecipesPage
