const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { getDB } = require('../db/schema')

const JWT_SECRET = process.env.JWT_SECRET || 'yuantou-community-secret-2024'

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, password, nickname } = req.body
  if (!username || !password || !nickname) {
    return res.json({ code: 400, message: '用户名、密码、昵称不能为空' })
  }
  const db = getDB()
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
  if (existing) return res.json({ code: 400, message: '用户名已存在' })

  const id = `user_${uuidv4().replace(/-/g, '').slice(0, 8)}`
  const hash = bcrypt.hashSync(password, 10)
  db.prepare(`INSERT INTO users (id,username,password,nickname) VALUES (?,?,?,?)`)
    .run(id, username, hash, nickname)

  // 初始化钱包
  db.prepare('INSERT INTO wallets (user_id,balance,points) VALUES (?,0,0)').run(id)

  const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '30d' })
  res.json({ code: 0, message: '注册成功', data: { token, userId: id, nickname } })
})

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.json({ code: 400, message: '用户名和密码不能为空' })

  const db = getDB()
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.json({ code: 401, message: '用户名或密码错误' })
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' })
  const { password: _, ...safeUser } = user
  res.json({ code: 0, message: '登录成功', data: { token, user: safeUser } })
})

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.json({ code: 401, message: '未登录' })

  try {
    const { userId } = jwt.verify(token, JWT_SECRET)
    const db = getDB()
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
    if (!user) return res.json({ code: 404, message: '用户不存在' })
    const { password: _, ...safeUser } = user
    res.json({ code: 0, data: safeUser })
  } catch {
    res.json({ code: 401, message: 'token无效' })
  }
})

module.exports = router
