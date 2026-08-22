import { View, Text, ScrollView, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import React, { memo, useState, useCallback, useEffect, useRef } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import UserAvatar from '../../components/UserAvatar'
import { formatTime } from '../../utils/formatTime'
import type { Conversation, ChatMessage } from '../../types'
import './index.css'

// ========== Mock 会话列表数据 ==========
const mockConversationList: Conversation[] = [
  {
    id: 'conv_001',
    user: { id: 'user_002', nickname: '产品经理小王', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80', following: 0, followers: 5200, posts: 0 },
    lastMessage: '那个需求文档你看了吗？',
    lastTime: '2026-08-21T18:00:00Z',
    unread: 2,
    messages: [
      { id: 'm1', conversationId: 'conv_001', senderId: 'user_002', content: '在吗？', type: 'text', createdAt: '2026-08-21T17:50:00Z' },
      { id: 'm2', conversationId: 'conv_001', senderId: 'user_002', content: '那个需求文档你看了吗？', type: 'text', createdAt: '2026-08-21T18:00:00Z' },
    ],
  },
  {
    id: 'conv_002',
    user: { id: 'user_003', nickname: '设计师阿美', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80', following: 0, followers: 8900, posts: 0 },
    lastMessage: '[图片]',
    lastTime: '2026-08-20T20:30:00Z',
    unread: 0,
    messages: [
      { id: 'm3', conversationId: 'conv_002', senderId: 'user_001', content: '设计稿收到了，很漂亮！', type: 'text', createdAt: '2026-08-20T20:00:00Z' },
      { id: 'm4', conversationId: 'conv_002', senderId: 'user_003', content: '[图片]', type: 'image', createdAt: '2026-08-20T20:30:00Z' },
    ],
  },
  {
    id: 'conv_003',
    user: { id: 'user_004', nickname: '全栈工程师', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80', following: 0, followers: 3200, posts: 0 },
    lastMessage: '好的，线上见！',
    lastTime: '2026-08-19T14:20:00Z',
    unread: 0,
    messages: [
      { id: 'm5', conversationId: 'conv_003', senderId: 'user_004', content: '下午的技术分享记得来听', type: 'text', createdAt: '2026-08-19T14:00:00Z' },
      { id: 'm6', conversationId: 'conv_003', senderId: 'user_001', content: '好的，线上见！', type: 'text', createdAt: '2026-08-19T14:20:00Z' },
    ],
  },
  {
    id: 'conv_004',
    user: { id: 'user_005', nickname: '社区运营小李', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80', following: 0, followers: 2100, posts: 0 },
    lastMessage: '欢迎加入我们社区！',
    lastTime: '2026-08-18T09:00:00Z',
    unread: 1,
    messages: [
      { id: 'm7', conversationId: 'conv_004', senderId: 'user_005', content: '欢迎加入我们社区！', type: 'text', createdAt: '2026-08-18T09:00:00Z' },
    ],
  },
]

// ========== 会话列表视图 ==========
const ConversationList = memo(function ConversationList() {
  const handleClickConv = useCallback((convId: string) => {
    Taro.navigateTo({ url: `/pages/chat/index?convId=${convId}` })
  }, [])

  return (
    <View className="conv-list">
      {mockConversationList.map((conv) => (
        <View
          key={conv.id}
          className="conv-item"
          onClick={() => handleClickConv(conv.id)}
        >
          <View className="conv-item__avatar-wrap">
            <UserAvatar user={conv.user} size="medium" />
            {conv.unread > 0 && <View className="conv-item__badge" />}
          </View>
          <View className="conv-item__body">
            <View className="conv-item__row">
              <Text className="conv-item__nickname">{conv.user.nickname}</Text>
              <Text className="conv-item__time">{formatTime(conv.lastTime)}</Text>
            </View>
            <Text className="conv-item__msg" numberOfLines={1}>{conv.lastMessage}</Text>
          </View>
        </View>
      ))}
    </View>
  )
})

// ========== 聊天消息项 ==========
interface MessageItemProps {
  message: ChatMessage
  isSelf: boolean
}

const MessageItem = memo(function MessageItem({ message, isSelf }: MessageItemProps) {
  return (
    <View className={`msg-item ${isSelf ? 'msg-item--self' : 'msg-item--other'}`}>
      {!isSelf && (
        <UserAvatar
          user={{ id: message.senderId, nickname: '', avatar: '', following: 0, followers: 0, posts: 0 }}
          size="small"
        />
      )}
      <View className={`msg-bubble ${isSelf ? 'msg-bubble--self' : 'msg-bubble--other'}`}>
        <Text className="msg-bubble__text">{message.content}</Text>
      </View>
      {isSelf && (
        <UserAvatar
          user={{ id: message.senderId, nickname: '', avatar: '', following: 0, followers: 0, posts: 0 }}
          size="small"
        />
      )}
    </View>
  )
})

// ========== 聊天窗口视图 ==========
const ChatWindow = memo(function ChatWindow({ convId }: { convId: string }) {
  const scrollRef = useRef<any>(null)
  const [inputText, setInputText] = useState('')

  const currentUser = useAppStore((s) => s.currentUser)
  const conversations = useAppStore((s) => s.conversations)
  const sendMessage = useAppStore((s) => s.sendMessage)
  const markConversationRead = useAppStore((s) => s.markConversationRead)

  const userId = currentUser?.id ?? 'user_001'

  // 合并 mock 数据和 store 数据
  const mockConv = mockConversationList.find((c) => c.id === convId)
  const storeConv = conversations.find((c) => c.id === convId)
  const conv = storeConv ?? mockConv

  // 从 store 中获取对方用户信息
  const otherUser = storeConv?.user ?? mockConv?.user

  // 进入时标记已读
  useEffect(() => {
    markConversationRead(convId)
  }, [convId, markConversationRead])

  const handleSend = useCallback(() => {
    const text = inputText.trim()
    if (!text) return
    sendMessage(convId, text)
    setInputText('')
    // 滚动到底部
    setTimeout(() => {
      scrollRef.current?.scrollIntoView?.({ behavior: 'smooth' })
    }, 100)
  }, [inputText, convId, sendMessage])

  // 会话不存在时（从用户主页发起的全新私信），仍渲染空聊天窗，发消息时自动创建
  const messages = conv?.messages ?? []

  return (
    <View className="chat-window">
      <ScrollView
        className="chat-msgs"
        scrollY
        scrollWithAnimation
        scrollTop={99999}
        ref={scrollRef}
      >
        {messages.length === 0 && (
          <View className="chat-empty">
            <Text className="chat-empty__text">暂无消息，开始聊天吧~</Text>
          </View>
        )}
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isSelf={msg.senderId === userId}
          />
        ))}
        <View id="msg-bottom" />
      </ScrollView>

      <View className="chat-input-bar">
        <Input
          className="chat-input-bar__input"
          value={inputText}
          onInput={(e) => setInputText(e.detail.value)}
          onConfirm={handleSend}
          placeholder="输入消息..."
          confirmType="send"
          cursorSpacing={12}
        />
        <View
          className={`chat-input-bar__send ${!inputText.trim() ? 'chat-input-bar__send--disabled' : ''}`}
          onClick={handleSend}
        >
          <Text className="chat-input-bar__send-text">发送</Text>
        </View>
      </View>
    </View>
  )
})

// ========== 页面入口 ==========
const ChatPage = memo(function ChatPage() {
  const router = useRouter()
  const convId = router.params.convId

  // 有 convId → 聊天窗口；无 convId → 会话列表
  if (convId) {
    return (
      <View className="page chat-page">
        <NavBar title={mockConversationList.find((c) => c.id === convId)?.user.nickname ?? '私信'} />
        <View className="chat-page__content">
          <ChatWindow convId={convId} />
        </View>
      </View>
    )
  }

  return (
    <View className="page chat-page">
      <NavBar title="私信" />
      <View className="chat-page__content">
        <ConversationList />
      </View>
    </View>
  )
})

;(ChatPage as unknown as React.ComponentType<{}> & { config: unknown }).config = {
  navigationStyle: 'custom',
}

export default ChatPage
