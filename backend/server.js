require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// 静态文件（上传的图片 + H5 构建产物）
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
app.use('/uploads', express.static(uploadsDir))

// H5 构建产物（开发时指向项目根目录的 dist）
const distDir = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
}

// API 路由（等数据库初始化完成后挂载）
let routerReady = false

app.get('/api/health', (req, res) => {
  res.json({ code: 0, message: 'ok', data: { ready: routerReady, version: '1.0.0' } })
})

// 初始化数据库，然后挂载路由
async function start() {
  const { initDBAsync } = require('./db/schema')
  await initDBAsync()

  // 挂载路由
  app.use('/api/auth', require('./routes/auth'))
  app.use('/api/users', require('./routes/users'))
  app.use('/api/posts', require('./routes/posts'))
  app.use('/api/messages', require('./routes/messages'))
  app.use('/api/friends', require('./routes/friends'))
  app.use('/api/wallet', require('./routes/wallet'))
  app.use('/api/topics', require('./routes/topics'))

  // 全局错误处理
  app.use((err, req, res, next) => {
    console.error('[Error]', err.message)
    res.status(500).json({ code: 500, message: err.message || '服务器内部错误' })
  })

  // SPA 路由兜底（所有未匹配路径返回 index.html）
  app.get('*', (req, res) => {
    const indexPath = path.join(distDir, 'index.html')
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath)
    } else {
      res.status(404).json({ code: 404, message: 'Not Found' })
    }
  })

  routerReady = true

  app.listen(PORT, () => {
    console.log(`\n🚀 源头社区 API 服务已启动`)
    console.log(`📍 http://localhost:${PORT}`)
    console.log(`📊 健康检查: http://localhost:${PORT}/api/health`)
    console.log(`\n测试账号：dev_frontend / 123456\n`)
  })
}

start().catch(err => {
  console.error('启动失败:', err)
  process.exit(1)
})
