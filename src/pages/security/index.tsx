import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useCallback } from 'react'
import NavBar from '../../components/NavBar'
import './index.css'

const Security = memo(() => {
  const handleItem = useCallback((label: string) => {
    Taro.showToast({ title: `${label}功能演示`, icon: 'none' })
  }, [])

  return (
    <View className="security-page">
      <NavBar title="账号安全" showBack />
      <ScrollView scrollY className="security-page__body">
        <View className="security-page__group">
          <View className="security-page__item" onClick={() => handleItem('修改密码')}>
            <Text className="security-page__label">修改密码</Text>
            <Text className="security-page__arrow">›</Text>
          </View>
          <View className="security-page__item" onClick={() => handleItem('绑定手机号')}>
            <Text className="security-page__label">绑定手机号</Text>
            <Text className="security-page__value">138****8888</Text>
            <Text className="security-page__arrow">›</Text>
          </View>
          <View className="security-page__item" onClick={() => handleItem('绑定邮箱')}>
            <Text className="security-page__label">绑定邮箱</Text>
            <Text className="security-page__value">未绑定</Text>
            <Text className="security-page__arrow">›</Text>
          </View>
          <View className="security-page__item" onClick={() => handleItem('微信登录')}>
            <Text className="security-page__label">微信登录</Text>
            <Text className="security-page__value">已绑定</Text>
            <Text className="security-page__arrow">›</Text>
          </View>
        </View>

        <View className="security-page__group">
          <View className="security-page__item" onClick={() => handleItem('登录设备管理')}>
            <Text className="security-page__label">登录设备管理</Text>
            <Text className="security-page__arrow">›</Text>
          </View>
          <View className="security-page__item" onClick={() => handleItem('账号注销')}>
            <Text className="security-page__label security-page__label--danger">注销账号</Text>
            <Text className="security-page__arrow">›</Text>
          </View>
        </View>

        <View className="security-page__hint">
          <Text className="security-page__hint-text">🔒 我们采用多重安全措施保护你的账号安全</Text>
        </View>
        <View className="safe-area-bottom" />
      </ScrollView>
    </View>
  )
})

Security.config = { navigationStyle: 'custom' } as any
Security.displayName = 'Security'
export default Security
