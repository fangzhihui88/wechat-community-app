import { useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import './index.css'

interface RankItem {
  rank: number
  nickname: string
  score: number
}

const gameData: Record<string, { icon: string; name: string; desc: string; ranks: RankItem[] }> = {
  '1': { icon: '🎮', name: '消消乐', desc: '超人气休闲消除游戏，简单上手，趣味无穷！点击三个及以上相同图标即可消除，挑战高分吧！', ranks: [{ rank: 1, nickname: '消除达人', score: 98420 }, { rank: 2, nickname: '消消新手', score: 87230 }, { rank: 3, nickname: '消个够', score: 76540 }, { rank: 4, nickname: '消乐无穷', score: 65120 }, { rank: 5, nickname: '消消乐迷', score: 54320 }] },
  '2': { icon: '🏀', name: '投篮大师', desc: '模拟真实投篮手感，考验你的精准度和节奏感，快来挑战排行榜吧！', ranks: [{ rank: 1, nickname: '神投手', score: 1280 }, { rank: 2, nickname: '篮球王子', score: 1150 }, { rank: 3, nickname: '投篮狂热', score: 1020 }, { rank: 4, nickname: '灌篮高手', score: 980 }, { rank: 5, nickname: '三分射手', score: 870 }] },
  '3': { icon: '🧩', name: '拼图挑战', desc: '将碎片拼合成完整图片，锻炼观察力和耐心，多种难度可选。', ranks: [{ rank: 1, nickname: '拼图王', score: 98 }, { rank: 2, nickname: '碎片猎人', score: 95 }, { rank: 3, nickname: '拼拼凑凑', score: 91 }, { rank: 4, nickname: '拼图小白', score: 87 }, { rank: 5, nickname: '慢慢来', score: 82 }] },
  '4': { icon: '🎯', name: '飞镖王', desc: '感受飞镖的刺激与精准，挑战各种关卡，成为真正的飞镖王！', ranks: [{ rank: 1, nickname: '飞镖神', score: 9990 }, { rank: 2, nickname: '靶靶命中', score: 8760 }, { rank: 3, nickname: '飞镖手', score: 7540 }, { rank: 4, nickname: '命中注定', score: 6320 }, { rank: 5, nickname: '一镖入魂', score: 5110 }] },
  '5': { icon: '🐍', name: '贪吃蛇', desc: '经典怀旧贪吃蛇，操控小蛇吃食物变长，注意别撞到自己哦！', ranks: [{ rank: 1, nickname: '蛇王', score: 54321 }, { rank: 2, nickname: '贪吃鬼', score: 43210 }, { rank: 3, nickname: '蛇精', score: 32100 }, { rank: 4, nickname: '长蛇', score: 21000 }, { rank: 5, nickname: '小蛇游', score: 12340 }] },
  '6': { icon: '🃏', name: '斗地主', desc: '经典三人斗地主，随时随地来一局，和邻居们一较高下吧！', ranks: [{ rank: 1, nickname: '地主老财', score: 15600 }, { rank: 2, nickname: '斗神', score: 14200 }, { rank: 3, nickname: '牌神', score: 12800 }, { rank: 4, nickname: '牌王', score: 11500 }, { rank: 5, nickname: '斗迷', score: 10200 }] },
  '7': { icon: '🎨', name: '填色画', desc: '轻松解压的填色游戏，在数字格里填入对应颜色，创作属于你的画作。', ranks: [{ rank: 1, nickname: '画师小张', score: 8800 }, { rank: 2, nickname: '填色爱好者', score: 7600 }, { rank: 3, nickname: '色彩大师', score: 6500 }, { rank: 4, nickname: '涂鸦达人', score: 5400 }, { rank: 5, nickname: '小画家', score: 4300 }] },
  '8': { icon: '⚽', name: '点球大战', desc: '模拟点球，守门与射门两种模式，体验世界杯级别的紧张感！', ranks: [{ rank: 1, nickname: '守门神', score: 9800 }, { rank: 2, nickname: '射门王', score: 8900 }, { rank: 3, nickname: '点球王', score: 7800 }, { rank: 4, nickname: '球探', score: 6700 }, { rank: 5, nickname: '足球小子', score: 5600 }] },
}

const GameDetail: React.FC = () => {
  const router = useRouter()
  const id = router.params.id || '1'
  const game = gameData[id] || gameData['1']

  const handleStart = () => {
    Taro.showToast({ title: `即将开始${game.name}，敬请期待！`, icon: 'none' })
  }

  const rankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `第${rank}`
  }

  return (
    <View className="page">
      <NavBar title={game.name} showBack />
      <ScrollView scrollY className="page__body" style="height:calc(100vh - 88px - env(safe-area-inset-top))">
        {/* 游戏信息 */}
        <View className="mp-card game-info">
          <View className="game-icon-large">{game.icon}</View>
          <View className="game-info-text">
            <Text className="game-title">{game.name}</Text>
            <Text className="game-desc">{game.desc}</Text>
          </View>
        </View>

        {/* 截图 */}
        <View className="mp-section">
          <View className="mp-section__title">游戏截图</View>
          <View className="screenshot-row">
            <View className="screenshot-item">
              <View className="screenshot-placeholder">
                <Text style="font-size:40px">{game.icon}</Text>
                <Text style="font-size:12px;color:var(--color-text-tertiary);margin-top:4px">截图一</Text>
              </View>
            </View>
            <View className="screenshot-item">
              <View className="screenshot-placeholder">
                <Text style="font-size:40px">{game.icon}</Text>
                <Text style="font-size:12px;color:var(--color-text-tertiary);margin-top:4px">截图二</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 排行榜 */}
        <View className="mp-section">
          <View className="mp-section__title">排行榜 TOP5</View>
          <View className="mp-card">
            {game.ranks.map(item => (
              <View key={item.rank} className="rank-item">
                <Text className="rank-icon">{rankIcon(item.rank)}</Text>
                <Text className="rank-nickname">{item.nickname}</Text>
                <Text className="rank-score">{item.score.toLocaleString()} 分</Text>
              </View>
            ))}
          </View>
        </View>
        <View style="height:80px" />
      </ScrollView>

      {/* 底部按钮 */}
      <View className="bottom-bar">
        <View className="mp-btn mp-btn--primary mp-btn--block" onClick={handleStart}>
          开始玩
        </View>
      </View>
    </View>
  )
}

GameDetail.config = { navigationStyle: 'custom' } as any
GameDetail.displayName = 'GameDetail'
export default GameDetail
