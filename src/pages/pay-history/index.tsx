import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState, useMemo } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

type PayStatus = 'pending' | 'paid' | 'failed' | 'refunded'
type TabKey = 'all' | 'paid' | 'pending' | 'refunded'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'paid', label: '已完成' },
  { key: 'pending', label: '待支付' },
  { key: 'refunded', label: '已退款' },
]

const STATUS_META: Record<PayStatus, { text: string; cls: string }> = {
  paid: { text: '已完成', cls: 'pay-history-page__status--success' },
  pending: { text: '待支付', cls: 'pay-history-page__status--warning' },
  failed: { text: '支付失败', cls: 'pay-history-page__status--failed' },
  refunded: { text: '已退款', cls: 'pay-history-page__status--info' },
}

const formatTime = (iso: string) => new Date(iso).toLocaleString('zh-CN', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit',
})

const formatAmount = (n: number) => `¥${n.toFixed(2)}`

const PayHistoryPage = memo(() => {
  const { payOrders } = useAppStore()
  const [activeTab, setActiveTab] = useState<TabKey>('all')

  const list = useMemo(
    () => (activeTab === 'all' ? payOrders : payOrders.filter((o) => o.status === activeTab)),
    [activeTab, payOrders],
  )

  const handleFilter = () => {
    Taro.showToast({ title: '筛选功能开发中', icon: 'none' })
  }

  return (
    <View className="pay-history-page">
      <NavBar title="支付记录" showBack rightText="筛选" onRightClick={handleFilter} />

      <View className="pay-history-page__tabs">
        {TABS.map((t) => (
          <View
            key={t.key}
            className={`pay-history-page__tab ${activeTab === t.key ? 'pay-history-page__tab--active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            <Text className="pay-history-page__tab-text">{t.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY className="pay-history-page__body">
        {list.length === 0 ? (
          <View className="pay-history-page__empty">
            <Text className="pay-history-page__empty-icon">💳</Text>
            <Text className="pay-history-page__empty-text">暂无支付记录</Text>
          </View>
        ) : (
          <View className="pay-history-page__list">
            {list.map((o) => {
              const meta = STATUS_META[o.status]
              return (
                <View key={o.id} className="pay-history-page__item">
                  <Image className="pay-history-page__avatar" src={o.merchantAvatar} />
                  <View className="pay-history-page__info">
                    <Text className="pay-history-page__name">{o.merchantName}</Text>
                    <Text className="pay-history-page__time">{o.desc ? `${o.desc} · ${formatTime(o.createdAt)}` : formatTime(o.createdAt)}</Text>
                  </View>
                  <View className="pay-history-page__right">
                    <Text className="pay-history-page__amount">{formatAmount(o.amount)}</Text>
                    <Text className={`pay-history-page__status ${meta.cls}`}>{meta.text}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        )}
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

PayHistoryPage.displayName = 'PayHistoryPage'
export default PayHistoryPage
;(PayHistoryPage as any).config = { navigationStyle: 'custom' } as any
