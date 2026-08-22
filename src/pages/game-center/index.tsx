import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

interface Game {
  id: number
  icon: string
  name: string
  category: string
  players: number
}

const mockGames: Game[] = [
  { id: 1, icon: '🎮', name: '消消乐', category: '休闲', players: 12843 },
  { id: 2, icon: '🏀', name: '投篮大师', category: '运动', players: 8562 },
  { id: 3, icon: '🧩', name: '拼图挑战', category: '益智', players: 6231 },
  { id: 4, icon: '🎯', name: '飞镖王', category: '竞技', players: 4398 },
  { id: 5, icon: '🐍', name: '贪吃蛇', category: '经典', players: 9821 },
  { id: 6, icon: '🃏', name: '斗地主', category: '棋牌', players: 15432 },
  { id: 7, icon: '🎨', name: '填色画', category: '休闲', players: 5674 },
  { id: 8, icon: '⚽', name: '点球大战', category: '运动', players: 7123 },
]

const GameCenter: React.FC = () => {
  const handleGameClick = (id: number) => {
    Taro.navigateTo({ url: `/pages/game-detail/index?id=${id}` })
  }

  return (
    <View className="page">
      <NavBar title="小游戏" showBack />
      <ScrollView scrollY className="page__body" style="height:calc(100vh - 88px - env(safe-area-inset-top))">
        <View className="mp-section" style="margin-top:0">
          <View className="mp-section__title">热门游戏</View>
          <View className="mp-grid game-grid">
            {mockGames.map(game => (
              <View
                key={game.id}
                className="mp-grid__item game-item"
                onClick={() => handleGameClick(game.id)}
              >
                <View className="game-icon-wrap">
                  <Text className="game-icon">{game.icon}</Text>
                </View>
                <Text className="game-name">{game.name}</Text>
                <Text className="mp-tag game-tag">{game.category}</Text>
                <Text className="game-players">{game.players.toLocaleString()}人在玩</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

GameCenter.config = { navigationStyle: 'custom' } as any
GameCenter.displayName = 'GameCenter'
export default GameCenter
