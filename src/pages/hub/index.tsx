import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

interface HubSection {
  title: string
  emoji: string
  color: string
  items: { label: string; url: string; tag?: string }[]
}

const sections: HubSection[] = [
  {
    title: '社交',
    emoji: '💬',
    color: '#FF4757',
    items: [
      { label: '群组广场', url: '/pages/group-list/index' },
      { label: '附近的人', url: '/pages/nearby-people/index' },
      { label: '同城', url: '/pages/city/index' },
      { label: '问答列表', url: '/pages/question-list/index' },
    ],
  },
  {
    title: '内容',
    emoji: '🎬',
    color: '#7C4DFF',
    items: [
      { label: '短视频', url: '/pages/short-video/index' },
      { label: '直播列表', url: '/pages/live-list/index' },
      { label: '资讯列表', url: '/pages/news-list/index' },
    ],
  },
  {
    title: '活动',
    emoji: '🎪',
    color: '#FF6B35',
    items: [
      { label: '活动列表', url: '/pages/activities/index' },
      { label: '排行榜', url: '/pages/rankings/index' },
      { label: '邀请好友', url: '/pages/invite/index' },
    ],
  },
  {
    title: '积分·钱包',
    emoji: '💰',
    color: '#FFD700',
    items: [
      { label: '积分中心', url: '/pages/points/index' },
      { label: '每日签到', url: '/pages/checkin/index' },
      { label: '幸运转盘', url: '/pages/lottery/index' },
      { label: '我的钱包', url: '/pages/wallet/index' },
      { label: '充值中心', url: '/pages/recharge/index' },
      { label: '提现', url: '/pages/withdraw/index' },
    ],
  },
  {
    title: '商城',
    emoji: '🛍',
    color: '#E040FB',
    items: [
      { label: '积分商城', url: '/pages/mall/index' },
      { label: '优惠券', url: '/pages/coupons/index' },
      { label: '兑换记录', url: '/pages/exchange-records/index' },
      { label: '二手市场', url: '/pages/trade-list/index' },
      { label: '招聘', url: '/pages/jobs-list/index' },
    ],
  },
  {
    title: '会员',
    emoji: '👑',
    color: '#FF4757',
    items: [
      { label: 'VIP 会员', url: '/pages/vip/index' },
      { label: '我的等级', url: '/pages/level/index' },
      { label: '成就徽章', url: '/pages/badges/index' },
      { label: '任务中心', url: '/pages/task-center/index' },
    ],
  },
  {
    title: '内容管理',
    emoji: '📝',
    color: '#007AFF',
    items: [
      { label: '我的动态', url: '/pages/my-posts/index' },
      { label: '我赞过的', url: '/pages/my-likes/index' },
      { label: '我的收藏', url: '/pages/my-bookmarks/index' },
      { label: '草稿箱', url: '/pages/my-drafts/index' },
      { label: '我的相册', url: '/pages/gallery/index' },
      { label: '数据中心', url: '/pages/data-report/index' },
    ],
  },
  {
    title: '社交关系',
    emoji: '👥',
    color: '#07C160',
    items: [
      { label: '粉丝列表', url: '/pages/followers/index' },
      { label: '关注列表', url: '/pages/following/index' },
      { label: '访客记录', url: '/pages/visitors/index' },
      { label: '黑名单', url: '/pages/blacklist/index' },
      { label: '屏蔽管理', url: '/pages/blocked/index' },
    ],
  },
  {
    title: '消息',
    emoji: '🔔',
    color: '#FF9500',
    items: [
      { label: '私信聊天', url: '/pages/chat/index' },
      { label: '通知中心', url: '/pages/notifications/index' },
      { label: '小游戏', url: '/pages/game-center/index' },
      { label: '成长课堂', url: '/pages/course/index' },
      { label: '内容合集', url: '/pages/collection/index' },
    ],
  },
  {
    title: '设置',
    emoji: '⚙️',
    color: '#5856D6',
    items: [
      { label: '编辑资料', url: '/pages/edit-profile/index' },
      { label: '通知设置', url: '/pages/notify-settings/index' },
      { label: '通用设置', url: '/pages/general-settings/index' },
      { label: '主题设置', url: '/pages/theme/index' },
      { label: '语言设置', url: '/pages/language/index' },
      { label: '隐私设置', url: '/pages/privacy/index' },
      { label: '账号安全', url: '/pages/security/index' },
      { label: '意见反馈', url: '/pages/feedback/index' },
      { label: '我的反馈', url: '/pages/feedback-list/index' },
      { label: '关于社区', url: '/pages/about/index' },
      { label: '工具箱', url: '/pages/tools-center/index' },
    ],
  },
]

const Hub = memo(() => {
  const total = sections.reduce((acc, s) => acc + s.items.length, 0)

  return (
    <View className="hub-page">
      <NavBar title="功能中心" showBack transparent />

      <View className="hub-banner">
        <Text className="hub-banner__emoji">🚀</Text>
        <View className="hub-banner__info">
          <Text className="hub-banner__title">微信社区小程序</Text>
          <Text className="hub-banner__sub">共 {total} 个功能页面 · 10 大模块</Text>
        </View>
        <View className="hub-banner__tag">v2.0</View>
      </View>

      <ScrollView scrollY className="hub-page__scroll">
        {sections.map((section, si) => (
          <View key={si} className="hub-section">
            <View className="hub-section__header">
              <Text className="hub-section__emoji">{section.emoji}</Text>
              <Text className="hub-section__title">{section.title}</Text>
              <View className="hub-section__count" style={{ background: section.color + '22', color: section.color }}>
                <Text style={{ fontSize: '20px', color: section.color }}>{section.items.length}</Text>
              </View>
            </View>
            <View className="hub-section__grid">
              {section.items.map((item) => (
                <View
                  key={item.url}
                  className="hub-card"
                  style={{ borderLeftColor: section.color }}
                  onClick={() => Taro.navigateTo({ url: item.url })}
                >
                  <Text className="hub-card__label">{item.label}</Text>
                  <Text className="hub-card__arrow">›</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Hub.config = { navigationStyle: 'custom' } as any
Hub.displayName = 'Hub'
export default Hub
