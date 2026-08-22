import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

const TOOLS = [
  { name: '扫一扫', icon: '📷' },
  { name: '计算器', icon: '🧮' },
  { name: '翻译', icon: '🌐' },
  { name: '日历', icon: '📅' },
  { name: '天气', icon: '⛅' },
  { name: '记账', icon: '💰' },
  { name: '待办', icon: '✅' },
  { name: '单位换算', icon: '🔄' },
  { name: '二维码', icon: '📱' },
]

function ToolsCenter() {
  const handleTap = (name: string) => {
    Taro.showToast({ title: `打开 ${name}`, icon: 'none' })
  }

  return (
    <View className="page">
      <NavBar title="工具箱" showBack />
      <View className="page__body">
        <View className="mp-section">
          <Text className="mp-section__title">常用工具</Text>
          <View className="tools-grid">
            {TOOLS.map(tool => (
              <View
                key={tool.name}
                className="tool-item"
                onClick={() => handleTap(tool.name)}
              >
                <Text className="tool-item__icon">{tool.icon}</Text>
                <Text className="tool-item__name">{tool.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

ToolsCenter.config = { navigationStyle: 'custom' } as any
ToolsCenter.displayName = 'ToolsCenter'

export default ToolsCenter
