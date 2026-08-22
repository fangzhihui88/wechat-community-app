import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo } from 'react'
import './index.css'

interface NavBarProps {
  title: string
  showBack?: boolean
  rightText?: string
  onRightClick?: () => void
  transparent?: boolean
}

const NavBar = memo<NavBarProps>(({ title, showBack = true, rightText, onRightClick, transparent }) => {
  const handleBack = () => {
    if (Taro.getCurrentPages().length > 1) Taro.navigateBack()
    else Taro.switchTab({ url: '/pages/index/index' })
  }

  return (
    <View className={`navbar ${transparent ? 'navbar--transparent' : ''} safe-area-top`}>
      <View className="navbar__inner">
        {showBack ? (
          <View className="navbar__back" onClick={handleBack}>
            <Text className="navbar__back-icon">‹</Text>
          </View>
        ) : <View className="navbar__back navbar__back--empty" />}
        <Text className="navbar__title">{title}</Text>
        {rightText ? (
          <View className="navbar__right" onClick={onRightClick}>
            <Text className="navbar__right-text">{rightText}</Text>
          </View>
        ) : <View className="navbar__back navbar__back--empty" />}
      </View>
    </View>
  )
})

NavBar.displayName = 'NavBar'
export default NavBar
