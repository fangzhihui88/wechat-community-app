import { useState, memo, useCallback, useMemo } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import UserAvatar from '../../components/UserAvatar'
import { useAppStore } from '../../store/useAppStore'
import type { User } from '../../types'
import './index.css'

// ============== 本地 Mock 数据（不引用外部文件） ==============
type SourceKey = 'search' | 'qr' | 'nearby' | 'group' | 'recommend'

interface RecUser extends User {
  source: SourceKey
  groupName?: string
}

const SOURCE_META: Record<SourceKey, { label: string; cls: string }> = {
  search: { label: '搜索', cls: 'src--search' },
  qr: { label: '二维码', cls: 'src--qr' },
  nearby: { label: '附近的人', cls: 'src--nearby' },
  group: { label: '群聊', cls: 'src--group' },
  recommend: { label: '推荐', cls: 'src--recommend' },
}

// 通讯录好友推荐（3 个 mock 用户）
const RECOMMEND_USERS: RecUser[] = [
  {
    id: 'rec_001',
    nickname: '旅行摄影师小林',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&q=80',
    bio: '用镜头记录世界的美好 📷',
    following: 0,
    followers: 2100,
    posts: 86,
    isVip: true,
    source: 'recommend',
  },
  {
    id: 'rec_002',
    nickname: '读书会阿哲',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80',
    bio: '每月共读一本书 📚 欢迎来聊',
    following: 0,
    followers: 540,
    posts: 32,
    source: 'recommend',
  },
  {
    id: 'rec_003',
    nickname: '健身教练 Leo',
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&h=200&fit=crop&q=80',
    bio: '帮你科学增肌减脂 💪 私教预约中',
    following: 0,
    followers: 1280,
    posts: 54,
    isVip: true,
    source: 'recommend',
  },
]

// 群聊好友推荐（来自共同群聊）
const GROUP_USERS: RecUser[] = [
  {
    id: 'grp_001',
    nickname: '产品经理 Anna',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80',
    bio: '一起把产品打磨得更好',
    following: 0,
    followers: 980,
    posts: 41,
    source: 'group',
    groupName: '产品经理交流群',
  },
  {
    id: 'grp_002',
    nickname: '插画师小满',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&q=80',
    bio: '治愈系插画 / 约稿中',
    following: 0,
    followers: 1640,
    posts: 73,
    isVip: true,
    source: 'group',
    groupName: '设计灵感群',
  },
  {
    id: 'grp_003',
    nickname: '程序员老张',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&q=80',
    bio: '全栈开发 / 开源爱好者',
    following: 0,
    followers: 720,
    posts: 38,
    source: 'group',
    groupName: '技术摸鱼群',
  },
]

const AddFriendPage = () => {
  const currentUser = useAppStore((s) => s.currentUser)
  const friends = useAppStore((s) => s.friends)
  const sendFriendRequest = useAppStore((s) => (s as any).sendFriendRequest)

  const [searchVal, setSearchVal] = useState('')
  const [searchResult, setSearchResult] = useState<RecUser | null>(null)
  const [requestedIds, setRequestedIds] = useState<string[]>([])

  // 已添加的好友 id 集合（用于标记「已添加」）
  const friendIds = useMemo(() => new Set(friends.map((f) => f.id)), [friends])

  const handleMyQr = useCallback(() => {
    Taro.navigateTo({ url: '/pages/create-code/index' })
  }, [])

  const handleSearchInput = useCallback((e: any) => {
    setSearchVal(e.target.value)
  }, [])

  const handleSearch = useCallback(() => {
    const kw = searchVal.trim()
    if (!kw) {
      Taro.showToast({ title: '请输入用户ID或昵称', icon: 'none' })
      return
    }
    // 本地 mock：根据关键词生成一个搜索结果
    const mock: RecUser = {
      id: `search_${kw}`,
      nickname: kw.startsWith('user_') ? kw : kw,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&q=80',
      bio: '这个人很神秘，快去认识一下吧～',
      following: 0,
      followers: 120,
      posts: 8,
      source: 'search',
    }
    setSearchResult(mock)
  }, [searchVal])

  const handleScan = useCallback(() => {
    Taro.showToast({ title: '请使用扫一扫功能', icon: 'none' })
  }, [])

  const handleAdd = useCallback(
    (user: RecUser) => {
      if (friendIds.has(user.id)) {
        Taro.showToast({ title: '已经是好友啦', icon: 'none' })
        return
      }
      if (requestedIds.includes(user.id)) {
        Taro.showToast({ title: '好友请求已发送', icon: 'none' })
        return
      }
      sendFriendRequest(user.id, '你好，我是来自社区的朋友～')
      setRequestedIds((prev) => [...prev, user.id])
      Taro.showToast({ title: '好友请求已发送', icon: 'success' })
    },
    [friendIds, requestedIds, sendFriendRequest],
  )

  const renderSourceTag = (source: SourceKey) => {
    const meta = SOURCE_META[source]
    return (
      <View className={`src-tag ${meta.cls}`}>
        <Text className="src-tag__text">{meta.label}</Text>
      </View>
    )
  }

  const renderUserCard = (user: RecUser) => {
    const isFriend = friendIds.has(user.id)
    const isRequested = requestedIds.includes(user.id)
    const btnCls = isFriend
      ? 'add-btn add-btn--done'
      : isRequested
        ? 'add-btn add-btn--requested'
        : 'add-btn'
    const btnText = isFriend ? '已添加' : isRequested ? '已发送' : '添加'

    return (
      <View className="user-card" key={user.id}>
        <View className="user-card__avatar" onClick={() => Taro.navigateTo({ url: `/pages/user-detail/index?userId=${user.id}` })}>
          <UserAvatar user={user} size="medium" showVipBadge={false} />
        </View>
        <View className="user-card__info">
          <View className="user-card__top">
            <Text className="user-card__name">{user.nickname}</Text>
            {renderSourceTag(user.source)}
          </View>
          {user.groupName && (
            <Text className="user-card__group">来自群聊：{user.groupName}</Text>
          )}
          <Text className="user-card__bio">{user.bio}</Text>
        </View>
        <View
          className={btnCls}
          onClick={() => !isFriend && !isRequested && handleAdd(user)}
        >
          <Text className="add-btn__text">{btnText}</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="add-friend-page">
      <NavBar title="添加好友" rightText="我的二维码" onRightClick={handleMyQr} />

      <ScrollView scrollY className="add-friend-scroll">
        {/* 搜索添加区 */}
        <View className="section search-section">
          <View className="search-bar">
            <Text className="search-bar__icon">🔍</Text>
            <Input
              className="search-bar__input"
              placeholder="输入用户ID / 昵称"
              value={searchVal}
              onInput={handleSearchInput}
              confirmType="search"
              onConfirm={handleSearch}
            />
            <View className="search-bar__btn" onClick={handleSearch}>
              <Text className="search-bar__btn-text">搜索</Text>
            </View>
          </View>

          {searchResult && (
            <View className="search-result">
              {renderUserCard(searchResult)}
            </View>
          )}
        </View>

        {/* 扫码加好友区 */}
        <View className="section scan-section" onClick={handleScan}>
          <View className="scan-btn">
            <Text className="scan-btn__icon">📷</Text>
            <Text className="scan-btn__text">扫一扫，添加好友</Text>
          </View>
          <Text className="scan-tip">点击通过二维码添加好友</Text>
        </View>

        {/* 通讯录好友推荐 */}
        <View className="section">
          <View className="section-header">
            <Text className="section-header__title">通讯录好友推荐</Text>
            <Text className="section-header__more">查看更多 ›</Text>
          </View>
          <View className="user-list">
            {RECOMMEND_USERS.map((u) => renderUserCard(u))}
          </View>
        </View>

        {/* 群聊好友推荐 */}
        <View className="section">
          <View className="section-header">
            <Text className="section-header__title">来自共同群聊</Text>
            <Text className="section-header__more">查看更多 ›</Text>
          </View>
          <View className="user-list">
            {GROUP_USERS.map((u) => renderUserCard(u))}
          </View>
        </View>

        {/* 我的二维码提示 */}
        {currentUser && (
          <View className="section my-qr-section" onClick={handleMyQr}>
            <View className="my-qr-card">
              <Text className="my-qr-card__title">我的二维码名片</Text>
              <Text className="my-qr-card__sub">ID：{currentUser.id} · 让朋友扫码加我</Text>
              <View className="my-qr-card__btn">
                <Text className="my-qr-card__btn-text">出示我的二维码</Text>
              </View>
            </View>
          </View>
        )}

        <View className="page-bottom-safe" />
      </ScrollView>
    </View>
  )
}

const AddFriendPageMemo = memo(AddFriendPage)
export default AddFriendPageMemo
;(AddFriendPageMemo as any).config = { navigationStyle: 'custom' } as any
