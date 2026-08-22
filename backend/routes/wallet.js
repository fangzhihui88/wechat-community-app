const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { getDB } = require('../db/schema')
const { auth } = require('../middleware/auth')

// GET /api/wallet/info
router.get('/info', auth, (req, res) => {
  const db = getDB()
  let wallet = db.prepare('SELECT * FROM wallets WHERE user_id=?').get(req.userId)
  if (!wallet) {
    db.prepare('INSERT INTO wallets (user_id,balance,points) VALUES (?,0,0)').run(req.userId)
    wallet = db.prepare('SELECT * FROM wallets WHERE user_id=?').get(req.userId)
  }
  // 获取今日是否签到
  const today = new Date().toISOString().slice(0, 10)
  const checkedIn = !!db.prepare('SELECT id FROM checkins WHERE user_id=? AND date=?').get(req.userId, today)
  res.json({ code: 0, data: { ...wallet, checkedIn } })
})

// POST /api/wallet/recharge
router.post('/recharge', auth, (req, res) => {
  const db = getDB()
  const { amount } = req.body
  if (!amount || amount <= 0) return res.json({ code: 400, message: '充值金额必须大于0' })
  db.prepare('UPDATE wallets SET balance=balance+?,updated_at=datetime("now") WHERE user_id=?').run(amount, req.userId)
  db.prepare('INSERT INTO point_logs (id,user_id,type,points,title) VALUES (?,?,?,?,?)').run(uuidv4(), req.userId, 'recharge', Math.floor(amount), `余额充值 ¥${amount}`)
  const wallet = db.prepare('SELECT * FROM wallets WHERE user_id=?').get(req.userId)
  res.json({ code: 0, message: '充值成功', data: wallet })
})

// POST /api/wallet/checkin
router.post('/checkin', auth, (req, res) => {
  const db = getDB()
  const today = new Date().toISOString().slice(0, 10)
  const existing = db.prepare('SELECT id FROM checkins WHERE user_id=? AND date=?').get(req.userId, today)
  if (existing) return res.json({ code: 400, message: '今日已签到' })
  const id = `checkin_${uuidv4().replace(/-/g, '').slice(0, 8)}`
  const points = 10
  db.prepare('INSERT INTO checkins (id,user_id,date,points) VALUES (?,?,?,?)').run(id, req.userId, today, points)
  db.prepare('UPDATE wallets SET points=points+?,updated_at=datetime("now") WHERE user_id=?').run(points, req.userId)
  const streak = db.prepare(`
    SELECT COUNT(*) as c FROM checkins
    WHERE user_id=? AND date>=date('now','-7 days')
  `).get(req.userId).c
  res.json({ code: 0, message: `签到成功，获得${points}积分！已连续${streak}天`, data: { points, streak } })
})

// GET /api/wallet/point-logs
router.get('/point-logs', auth, (req, res) => {
  const db = getDB()
  const logs = db.prepare('SELECT * FROM point_logs WHERE user_id=? ORDER BY created_at DESC LIMIT 50').all(req.userId)
  res.json({ code: 0, data: logs })
})

// POST /api/wallet/pay
router.post('/pay', auth, (req, res) => {
  const db = getDB()
  const { amount, title } = req.body
  if (!amount || amount <= 0) return res.json({ code: 400, message: '金额必须大于0' })
  const wallet = db.prepare('SELECT * FROM wallets WHERE user_id=?').get(req.userId)
  if (wallet.balance < amount) return res.json({ code: 400, message: '余额不足' })
  const id = `order_${uuidv4().replace(/-/g, '').slice(0, 10)}`
  db.prepare('INSERT INTO pay_orders (id,user_id,amount,title,status) VALUES (?,?,?,?,?)').run(id, req.userId, amount, title || '支付', 'paid')
  db.prepare('UPDATE wallets SET balance=balance-?,updated_at=datetime("now") WHERE user_id=?').run(amount, req.userId)
  const updated = db.prepare('SELECT * FROM wallets WHERE user_id=?').get(req.userId)
  res.json({ code: 0, message: '支付成功', data: { orderId: id, balance: updated.balance } })
})

// GET /api/wallet/orders
router.get('/orders', auth, (req, res) => {
  const db = getDB()
  const orders = db.prepare('SELECT * FROM pay_orders WHERE user_id=? ORDER BY created_at DESC LIMIT 50').all(req.userId)
  res.json({ code: 0, data: orders })
})

module.exports = router
