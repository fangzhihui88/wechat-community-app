import { View, Text, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback, useMemo, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import UserAvatar from '../../components/UserAvatar'
import EmptyState from '../../components/EmptyState'
import type { User } from '../../types'
import './index.css'

// store 中好友条目类型（与 useAppStore 的 friends 声明保持一致）
type FriendItem = User & {
  remark?: string
  tag?: string
  isTop?: boolean
  lastChatTime?: string
  isOnline?: boolean
  source: string
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// 常用汉字 → 拼音首字母（用于通讯录 A~Z 分组，未覆盖的字符归入 '#'）
const PINYIN_MAP: Record<string, string> = {
  王: 'W', 李: 'L', 张: 'Z', 刘: 'L', 陈: 'C', 杨: 'Y', 黄: 'H', 赵: 'Z', 吴: 'W', 周: 'Z',
  徐: 'X', 孙: 'S', 马: 'M', 朱: 'Z', 胡: 'H', 郭: 'G', 何: 'H', 高: 'G', 林: 'L', 罗: 'L',
  郑: 'Z', 梁: 'L', 谢: 'X', 宋: 'S', 唐: 'T', 许: 'X', 韩: 'H', 冯: 'F', 邓: 'D', 曹: 'C',
  彭: 'P', 曾: 'Z', 肖: 'X', 田: 'T', 董: 'D', 袁: 'Y', 潘: 'P', 蒋: 'J', 蔡: 'C', 余: 'Y',
  杜: 'D', 叶: 'Y', 程: 'C', 苏: 'S', 魏: 'W', 吕: 'L', 丁: 'D', 任: 'R', 沈: 'S', 姚: 'Y',
  卢: 'L', 姜: 'J', 崔: 'C', 钟: 'Z', 谭: 'T', 陆: 'L', 汪: 'W', 范: 'F', 金: 'J', 石: 'S',
  廖: 'L', 贾: 'J', 夏: 'X', 韦: 'W', 付: 'F', 方: 'F', 白: 'B', 邹: 'Z', 孟: 'M', 熊: 'X',
  秦: 'Q', 邱: 'Q', 江: 'J', 尹: 'Y', 薛: 'X', 闫: 'Y', 段: 'D', 雷: 'L', 侯: 'H', 龙: 'L',
  史: 'S', 陶: 'T', 黎: 'L', 贺: 'H', 顾: 'G', 毛: 'M', 郝: 'H', 龚: 'G', 邵: 'S', 万: 'W',
  钱: 'Q', 严: 'Y', 覃: 'Q', 武: 'W', 戴: 'D', 莫: 'M', 孔: 'K', 向: 'X', 汤: 'T', 康: 'K',
  安: 'A', 常: 'C', 乔: 'Q', 文: 'W', 华: 'H', 房: 'F', 童: 'T', 葛: 'G', 游: 'Y', 明: 'M',
  产: 'C', 品: 'P', 经: 'J', 理: 'L', 小: 'X', 设: 'S', 计: 'J', 师: 'S', 阿: 'A', 美: 'M',
  技: 'J', 术: 'S', 大: 'D', 全: 'Q', 栈: 'Z', 工: 'G', 咖: 'K', 啡: 'F', 爱: 'A',
  好: 'H', 者: 'Z', 老: 'L', 运: 'Y', 动: 'D', 摄: 'S', 影: 'Y', 读: 'D', 书: 'S', 跑: 'P',
  步: 'B', 食: 'S', 探: 'T', 店: 'D', 达: 'D', 人: 'R', 同: 'T', 学: 'X', 前: 'Q',
  端: 'D', 开: 'K', 发: 'F', 聪: 'C', 博: 'B', 悦: 'Y', 笑: 'X', 甜: 'T', 鑫: 'X', 伟: 'W',
}

const getInitial = (name: string): string => {
  if (!name) return '#'
  const ch = name.trim().charAt(0)
  if (/[a-zA-Z]/.test(ch)) return ch.toUpperCase()
  if (/[\u4e00-\u9fa5]/.test(ch)) return PINYIN_MAP[ch] || '#'
  return '#'
}

const getDisplayName = (f: FriendItem) => f.remark || f.nickname

const FriendListPage = memo(() => {
  const { friends, currentUser, toggleFriendTop, removeFriend, updateFriendRemark } = useAppStore()
  const [keyword, setKeyword] = useState('')
  const [scrollIntoId, setScrollIntoId] = useState('')
  const [searchFocus, setSearchFocus] = useState(false)
  const [actionFriend, setActionFriend] = useState<FriendItem | null>(null)
  const [sheetVisible, setSheetVisible] = useState(false)

  // 搜索过滤：按昵称 / 备注名匹配
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return friends
    return friends.filter((f) => {
      const nickname = (f.nickname || '').toLowerCase()
      const remark = (f.remark || '').toLowerCase()
      return nickname.includes(kw) || remark.includes(kw)
    })
  }, [friends, keyword])

  // 置顶好友
  const pinned = useMemo(() => filtered.filter((f) => f.isTop), [filtered])
  // 普通好友按首字母分组
  const normal = useMemo(() => filtered.filter((f) => !f.isTop), [filtered])

  const groups = useMemo(() => {
    const map: Record<string, FriendItem[]> = {}
    normal.forEach((f) => {
      const initial = getInitial(f.remark || f.nickname)
      ;(map[initial] || (map[initial] = [])).push(f)
    })
    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) => (a.remark || a.nickname).localeCompare(b.remark || b.nickname, 'zh'))
    })
    return Object.keys(map)
      .sort((a, b) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)))
      .map((letter) => ({ letter, list: map[letter] }))
  }, [normal])

  const onlineCount = useMemo(() => friends.filter((f) => f.isOnline).length, [friends])

  const presentLetters = useMemo(() => {
    const s = new Set(groups.map((g) => g.letter))
    if (pinned.length) s.add('置')
    return s
  }, [groups, pinned.length])

  const jumpTo = useCallback((key: string) => {
    setScrollIntoId(key === '置' ? 'fl-letter-top' : `fl-letter-${key}`)
  }, [])

  const handleSearchIcon = useCallback(() => {
    setSearchFocus(true)
    setScrollIntoId('fl-search')
  }, [])

  const handleRowClick = useCallback((f: FriendItem) => {
    Taro.navigateTo({ url: `/pages/user-detail/index?userId=${f.id}` })
  }, [])

  const handleToggleTop = useCallback((f: FriendItem) => {
    toggleFriendTop(f.id)
    Taro.showToast({ title: f.isTop ? '已取消置顶' : '已置顶', icon: 'none' })
  }, [toggleFriendTop])

  const openSheet = useCallback((f: FriendItem) => {
    setActionFriend(f)
    setSheetVisible(true)
  }, [])

  const closeSheet = useCallback(() => {
    setSheetVisible(false)
  }, [])

  const handleSheetAction = useCallback((action: 'chat' | 'remark' | 'top' | 'remove') => {
    const f = actionFriend
    setSheetVisible(false)
    if (!f) return
    if (action === 'chat') {
      Taro.navigateTo({ url: `/pages/chat/index?convId=${f.id}` })
    } else if (action === 'remark') {
      Taro.showModal({
        title: '修改备注',
        editable: true,
        placeholderText: '请输入备注名',
        content: f.remark || '',
        success: (res: any) => {
          const newRemark = ((res && res.content) || '').trim()
          if (res && res.confirm && newRemark !== (f.remark || '')) {
            updateFriendRemark(f.id, newRemark)
            Taro.showToast({ title: newRemark ? '备注已更新' : '备注已清除', icon: 'success' })
          }
        },
      } as any)
    } else if (action === 'top') {
      toggleFriendTop(f.id)
      Taro.showToast({ title: f.isTop ? '已取消置顶' : '已置顶', icon: 'none' })
    } else if (action === 'remove') {
      Taro.showModal({
        title: '删除好友',
        content: `确定删除好友「${getDisplayName(f)}」吗？`,
        confirmColor: '#FF4757',
        success: (res) => {
          if (res.confirm) {
            removeFriend(f.id)
            Taro.showToast({ title: '已删除好友', icon: 'none' })
          }
        },
      })
    }
  }, [actionFriend, toggleFriendTop, removeFriend, updateFriendRemark])

  const renderRow = useCallback((f: FriendItem) => (
    <View
      key={f.id}
      className="friend-row"
      hoverClass="friend-row--hover"
      onClick={() => handleRowClick(f)}
      onLongPress={() => openSheet(f)}
    >
      <View className="friend-avatar-wrap">
        <UserAvatar user={f} size="medium" showVipBadge={false} onClick={() => undefined} />
        {f.isOnline && <View className="online-dot" />}
      </View>
      <View className="friend-row__info">
        <View className="friend-row__name-line">
          <Text className="friend-row__name text-ellipsis">{f.nickname}</Text>
          {f.isVip && <Text className="vip-chip">V</Text>}
        </View>
        <Text className="friend-row__sub text-ellipsis">{f.remark || f.tag || '好友'}</Text>
      </View>
      <Text className="friend-row__arrow">›</Text>
    </View>
  ), [handleRowClick, openSheet])

  return (
    <View className="friend-list-page">
      <NavBar title="好友列表" rightText="🔍" onRightClick={handleSearchIcon} />

      <ScrollView
        scrollY
        scrollWithAnimation
        scrollIntoView={scrollIntoId}
        className="friend-list-page__body"
      >
        {/* 搜索框 */}
        <View className="friend-search" id="fl-search">
          <View className="friend-search__box">
            <Text className="friend-search__icon">🔍</Text>
            <Input
              className="friend-search__input"
              placeholder="搜索昵称/备注名"
              value={keyword}
              focus={searchFocus}
              confirmType="search"
              onInput={(e) => setKeyword(e.detail.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
            />
            {keyword ? (
              <Text className="friend-search__clear" onClick={() => setKeyword('')}>✕</Text>
            ) : null}
          </View>
        </View>

        {/* 统计 */}
        <View className="friend-summary">
          <Text className="friend-summary__text">共 {friends.length} 位好友 · {onlineCount} 人在线</Text>
          <Text className="friend-summary__text">长按好友可管理</Text>
        </View>

        {friends.length === 0 ? (
          <View className="friend-empty">
            <EmptyState
              icon="👥"
              title="暂无好友，去添加吧"
              description="去「添加朋友」页找找有趣的邻居"
              actionText="去添加"
              onAction={() => Taro.navigateTo({ url: '/pages/add-friend/index' })}
            />
          </View>
        ) : filtered.length === 0 ? (
          <View className="friend-empty">
            <EmptyState
              icon="🔍"
              title="未找到相关好友"
              description="换个关键词试试吧"
            />
          </View>
        ) : (
          <View>
            {/* 我的资料行 */}
            {currentUser && (
              <View
                className="friend-me"
                hoverClass="friend-row--hover"
                onClick={() => Taro.switchTab({ url: '/pages/profile/index' })}
              >
                <View className="friend-avatar-wrap">
                  <UserAvatar user={currentUser} size="medium" onClick={() => undefined} />
                </View>
                <View className="friend-row__info">
                  <View className="friend-row__name-line">
                    <Text className="friend-row__name text-ellipsis">{currentUser.nickname}</Text>
                  </View>
                  <Text className="friend-row__sub text-ellipsis">我的主页</Text>
                </View>
                <Text className="friend-row__arrow">›</Text>
              </View>
            )}

            {/* 置顶好友区 */}
            {pinned.length > 0 && (
              <View className="friend-pin" id="fl-letter-top">
                <View className="friend-pin__header">
                  <Text className="friend-pin__title">置顶好友</Text>
                  <Text className="friend-pin__count">{pinned.length}</Text>
                </View>
                <View className="friend-pin__cards">
                  {pinned.map((f) => (
                    <View
                      key={f.id}
                      className="friend-pin__card"
                      hoverClass="friend-row--hover"
                      onClick={() => handleRowClick(f)}
                      onLongPress={() => openSheet(f)}
                    >
                      <View className="friend-avatar-wrap">
                        <UserAvatar user={f} size="medium" showVipBadge={false} onClick={() => undefined} />
                        {f.isOnline && <View className="online-dot" />}
                      </View>
                      <View className="friend-row__info">
                        <View className="friend-row__name-line">
                          <Text className="friend-row__name text-ellipsis">{f.nickname}</Text>
                          {f.isVip && <Text className="vip-chip">V</Text>}
                        </View>
                        <Text className="friend-row__sub text-ellipsis">{f.remark || f.tag || '好友'}</Text>
                      </View>
                      <View
                        className="friend-pin__badge"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleTop(f)
                        }}
                      >
                        <Text className="friend-pin__badge-text">📌 置顶</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 普通好友 A~Z 分组 */}
            {groups.map((g) => (
              <View className="friend-section" key={g.letter} id={`fl-letter-${g.letter}`}>
                <View className="friend-section__header">
                  <Text className="friend-section__letter">{g.letter}</Text>
                  <Text className="friend-section__count">{g.list.length} 位好友</Text>
                </View>
                {g.list.map(renderRow)}
              </View>
            ))}
          </View>
        )}

        <View className="safe-area-bottom" />
      </ScrollView>

      {/* 字母索引栏 */}
      {friends.length > 0 && (
        <View className="friend-index">
          <View
            className={`friend-index__item ${pinned.length ? 'friend-index__item--active' : ''}`}
            onClick={() => jumpTo('置')}
          >
            置
          </View>
          {LETTERS.map((l) => (
            <View
              key={l}
              className={`friend-index__item ${presentLetters.has(l) ? 'friend-index__item--active' : ''}`}
              onClick={() => jumpTo(l)}
            >
              {l}
            </View>
          ))}
        </View>
      )}

      {/* 长按操作面板 */}
      {sheetVisible && actionFriend && (
        <View className="friend-sheet-mask" onClick={closeSheet}>
          <View className="friend-sheet" onClick={(e) => e.stopPropagation()}>
            <View className="friend-sheet__user">
              <UserAvatar user={actionFriend} size="small" showVipBadge={false} onClick={() => undefined} />
              <Text className="friend-sheet__name text-ellipsis">{getDisplayName(actionFriend)}</Text>
            </View>
            <View className="friend-sheet__item" onClick={() => handleSheetAction('chat')}>
              <Text>💬 发消息</Text>
            </View>
            <View className="friend-sheet__item" onClick={() => handleSheetAction('remark')}>
              <Text>✏️ 修改备注</Text>
            </View>
            <View className="friend-sheet__item" onClick={() => handleSheetAction('top')}>
              <Text>{actionFriend.isTop ? '📌 取消置顶' : '📌 置顶好友'}</Text>
            </View>
            <View className="friend-sheet__item friend-sheet__item--danger" onClick={() => handleSheetAction('remove')}>
              <Text>🗑️ 删除好友</Text>
            </View>
            <View className="friend-sheet__cancel" onClick={closeSheet}>
              <Text>取消</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
})

FriendListPage.displayName = 'FriendListPage'

export default FriendListPage
;(FriendListPage as any).config = { navigationStyle: 'custom' } as any
