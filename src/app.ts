import { Component } from 'react'
import { useAppStore } from './store/useAppStore'
import './app.css'
import 'taro-ui/dist/style/index.scss'

class App extends Component {

  componentDidMount() {
    // 初始化应用
    console.log('源头社区启动')
    this.applyTheme(useAppStore.getState().themeMode)
    useAppStore.subscribe((state) => this.applyTheme(state.themeMode))
  }

  applyTheme(mode: string) {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.classList.toggle('dark', mode === 'dark')
      document.body?.classList.toggle('dark', mode === 'dark')
    }
  }

  componentDidShow() {
    // 小程序显示时触发
  }

  componentDidHide() {
    // 小程序隐藏时触发
  }

  componentDidCatchError(err: string) {
    console.error('小程序错误:', err)
  }

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children
  }
}

export default App
