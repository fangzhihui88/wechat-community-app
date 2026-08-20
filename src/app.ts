import { Component } from 'react'
import './app.css'
import 'taro-ui/dist/style/index.scss'

class App extends Component {

  componentDidMount() {
    // 初始化应用
    console.log('微信社区小程序启动')
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
