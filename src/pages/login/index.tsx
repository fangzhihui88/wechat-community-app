import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Button, Navigator } from '@tarojs/components'
import { post } from '../../utils/request'
import './index.css'

interface LoginForm {
  username: string
  password: string
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' })
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 自动登录检测：启动时检查本地 token 是否有效
  useEffect(() => {
    const token = Taro.getStorageSync('token')
    const savedUser = Taro.getStorageSync('currentUser')
    if (token && savedUser) {
      // 有 token，直接跳转首页
      Taro.switchTab({ url: '/pages/index/index' })
    }
  }, [])

  const setField = (key: keyof LoginForm, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setError('')
  }

  const handleLogin = async () => {
    if (!form.username.trim()) return setError('请输入用户名')
    if (!form.password) return setError('请输入密码')
    setLoading(true)
    setError('')
    try {
      const res = await post('/api/auth/login', {
        username: form.username.trim(),
        password: form.password,
      }, false)

      const { token, user } = res.data
      // 持久化
      Taro.setStorageSync('token', token)
      Taro.setStorageSync('currentUser', user)

      Taro.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => Taro.switchTab({ url: '/pages/index/index' }), 800)
    } catch (e: any) {
      setError(e?.message || '登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!form.username.trim()) return setError('请输入用户名')
    if (!form.password) return setError('请输入密码')
    if (!nickname.trim()) return setError('请输入昵称')
    setLoading(true)
    setError('')
    try {
      const res = await post('/api/auth/register', {
        username: form.username.trim(),
        password: form.password,
        nickname: nickname.trim(),
      }, false)
      const { token, userId, nickname: nk } = res.data
      Taro.setStorageSync('token', token)
      Taro.setStorageSync('currentUser', { id: userId, nickname: nk })
      Taro.showToast({ title: '注册成功', icon: 'success' })
      setTimeout(() => Taro.switchTab({ url: '/pages/index/index' }), 800)
    } catch (e: any) {
      setError(e?.message || '注册失败，用户名可能已被占用')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="login-page">
      {/* 顶部品牌区 */}
      <View className="login-header">
        <View className="login-logo">🏠</View>
        <Text className="login-brand">源头社区</Text>
        <Text className="login-slogan">发现志同道合的伙伴</Text>
      </View>

      {/* Tab 切换 */}
      <View className="login-tabs">
        <View
          className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => { setActiveTab('login'); setError('') }}
        >
          登录
        </View>
        <View
          className={`login-tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => { setActiveTab('register'); setError('') }}
        >
          注册
        </View>
      </View>

      {/* 表单 */}
      <View className="login-form">
        <View className="form-item">
          <Text className="form-label">用户名</Text>
          <Input
            className="form-input"
            placeholder="请输入用户名"
            value={form.username}
            onInput={e => setField('username', e.detail.value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {activeTab === 'register' && (
          <View className="form-item">
            <Text className="form-label">昵称</Text>
            <Input
              className="form-input"
              placeholder="设置你的昵称"
              value={nickname}
              onInput={e => setNickname(e.detail.value)}
            />
          </View>
        )}

        <View className="form-item">
          <Text className="form-label">密码</Text>
          <Input
            className="form-input"
            placeholder="请输入密码"
            value={form.password}
            onInput={e => setField('password', e.detail.value)}
            password
          />
        </View>

        {error && (
          <View className="form-error">
            <Text>⚠️ {error}</Text>
          </View>
        )}

        <Button
          className="login-btn"
          loading={loading}
          onClick={activeTab === 'login' ? handleLogin : handleRegister}
        >
          {loading ? '处理中...' : activeTab === 'login' ? '登 录' : '注 册'}
        </Button>

        {/* 演示账号快捷登录 */}
        {activeTab === 'login' && (
          <View className="demo-hint">
            <Text>演示账号: dev_frontend / 123456</Text>
            <View
              className="demo-btn"
              onClick={() => setForm({ username: 'dev_frontend', password: '123456' })}
            >
              一键填充
            </View>
          </View>
        )}
      </View>

      {/* 底部 */}
      <View className="login-footer">
        <Text>登录即表示同意</Text>
        <Navigator url="/pages/user-agreement/index" className="footer-link">《用户协议》</Navigator>
        <Text>和</Text>
        <Navigator url="/pages/privacy-policy/index" className="footer-link">《隐私政策》</Navigator>
      </View>
    </View>
  )
}

LoginPage.config = {
  navigationBarTitleText: '登录',
  navigationStyle: 'custom',
} as any
