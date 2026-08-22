import { View, Text, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import NavBar from '../../components/NavBar'
import './index.css'

const EditProfile = memo(() => {
  const { currentUser } = useAppStore()
  const [nickname, setNickname] = useState(currentUser?.nickname || '')
  const [bio, setBio] = useState(currentUser?.bio || '')
  const [gender, setGender] = useState<'male' | 'female' | 'unknown'>(currentUser?.gender || 'unknown')
  const [location, setLocation] = useState(currentUser?.location || '')

  const handleSave = () => {
    if (!nickname.trim()) {
      Taro.showToast({ title: '昵称不能为空', icon: 'none' })
      return
    }
    Taro.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 1000)
  }

  const genders: { key: 'male' | 'female' | 'unknown'; label: string }[] = [
    { key: 'male', label: '男' },
    { key: 'female', label: '女' },
    { key: 'unknown', label: '保密' },
  ]

  return (
    <View className="edit-page">
      <NavBar title="编辑资料" showBack rightText="保存" onRightClick={handleSave} />
      <View className="edit-page__body">
        <View className="edit-card">
          <View className="edit-row">
            <Text className="edit-row__label">头像</Text>
            <View className="edit-row__avatar">
              <Text className="edit-row__avatar-text">📷</Text>
            </View>
          </View>
          <View className="edit-row edit-row--border">
            <Text className="edit-row__label">昵称</Text>
            <Input
              className="edit-row__input"
              value={nickname}
              placeholder="请输入昵称"
              maxlength={20}
              onInput={(e: any) => setNickname(e.detail.value)}
            />
          </View>
          <View className="edit-row edit-row--border">
            <Text className="edit-row__label">性别</Text>
            <View className="edit-genders">
              {genders.map((g) => (
                <View
                  key={g.key}
                  className={`edit-gender ${gender === g.key ? 'edit-gender--active' : ''}`}
                  onClick={() => setGender(g.key)}
                >
                  <Text className="edit-gender__text">{g.label}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className="edit-row edit-row--border">
            <Text className="edit-row__label">所在地</Text>
            <Input
              className="edit-row__input"
              value={location}
              placeholder="城市"
              onInput={(e: any) => setLocation(e.detail.value)}
            />
          </View>
        </View>

        <View className="edit-card">
          <Text className="edit-bio-label">个人简介</Text>
          <Textarea
            className="edit-bio"
            value={bio}
            placeholder="介绍一下自己吧~"
            maxlength={100}
            onInput={(e: any) => setBio(e.detail.value)}
          />
          <Text className="edit-bio-count">{bio.length}/100</Text>
        </View>
      </View>
    </View>
  )
})

EditProfile.config = { navigationStyle: 'custom' } as any
EditProfile.displayName = 'EditProfile'
export default EditProfile
