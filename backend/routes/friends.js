const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { getDB } = require('../db/schema')
const { auth } = require('../middleware/auth')

// GET /api/friends/list
router.get('/list', auth, (req, res) => {
  const db = getDB()
  const friends = db.prepare(`
    SELECT u.id,u.nickname,u.avatar,u.bio,u.is_vip,u.location,
           f.remark,f.tag,f.is_top,f.source,f.created_at as friend_since
    FROM friends f JOIN users u ON f.friend_id=u.id
    WHERE f.user_id=?
    ORDER BY f.is_top DESC, f.created_at DESC
  `).all(req.userId)
  res.json({ code: 0, data: friends })
})

// POST /api/friends/request
router.post('/request', auth, (req, res) => {
  const db = getDB()
  const { toUserId, message = '' } = req.body
  if (!toUserId) return res.json({ code: 400, message: '目标用户不能为空' })
  const existing = db.prepare('SELECT id FROM friend_requests WHERE from_user_id=? AND to_user_id=? AND status=?').get(req.userId, toUserId, 'pending')
  if (existing) return res.json({ code: 400, message: '已发送过申请' })
  const id = `fr_${uuidv4().replace(/-/g, '').slice(0, 8)}`
  db.prepare('INSERT INTO friend_requests (id,from_user_id,to_user_id,message) VALUES (?,?,?,?)').run(id, req.userId, toUserId, message)
  res.json({ code: 0, message: '申请已发送', data: { id } })
})

// GET /api/friends/requests
router.get('/requests', auth, (req, res) => {
  const db = getDB()
  const pending = db.prepare(`
    SELECT r.*, u.nickname as from_nickname, u.avatar as from_avatar, u.is_vip as from_is_vip
    FROM friend_requests r JOIN users u ON r.from_user_id=u.id
    WHERE r.to_user_id=? AND r.status='pending'
    ORDER BY r.created_at DESC
  `).all(req.userId)
  const processed = db.prepare(`
    SELECT r.*, u.nickname as from_nickname, u.avatar as from_avatar
    FROM friend_requests r JOIN users u ON r.from_user_id=u.id
    WHERE r.to_user_id=? AND r.status!='pending'
    ORDER BY r.updated_at DESC LIMIT 20
  `).all(req.userId)
  res.json({ code: 0, data: { pending, processed } })
})

// POST /api/friends/requests/:id/accept
router.post('/requests/:id/accept', auth, (req, res) => {
  const db = getDB()
  const req2 = db.prepare('SELECT * FROM friend_requests WHERE id=? AND to_user_id=?').get(req.params.id, req.userId)
  if (!req2) return res.json({ code: 404, message: '申请不存在' })
  db.prepare("UPDATE friend_requests SET status='accepted',updated_at=datetime('now') WHERE id=?").run(req.params.id)
  // 双向添加好友
  db.prepare('INSERT OR IGNORE INTO friends (id,user_id,friend_id) VALUES (?,?,?)').run(uuidv4(), req.userId, req2.from_user_id)
  db.prepare('INSERT OR IGNORE INTO friends (id,user_id,friend_id) VALUES (?,?,?)').run(uuidv4(), req2.from_user_id, req.userId)
  res.json({ code: 0, message: '已同意' })
})

// POST /api/friends/requests/:id/reject
router.post('/requests/:id/reject', auth, (req, res) => {
  const db = getDB()
  db.prepare("UPDATE friend_requests SET status='rejected',updated_at=datetime('now') WHERE id=? AND to_user_id=?").run(req.params.id, req.userId)
  res.json({ code: 0, message: '已拒绝' })
})

// PUT /api/friends/:id/remark
router.put('/:id/remark', auth, (req, res) => {
  const db = getDB()
  const { remark } = req.body
  db.prepare('UPDATE friends SET remark=? WHERE user_id=? AND friend_id=?').run(remark, req.userId, req.params.id)
  res.json({ code: 0, message: '备注已更新' })
})

// DELETE /api/friends/:id
router.delete('/:id', auth, (req, res) => {
  const db = getDB()
  db.prepare('DELETE FROM friends WHERE user_id=? AND friend_id=?').run(req.userId, req.params.id)
  db.prepare('DELETE FROM friends WHERE user_id=? AND friend_id=?').run(req.params.id, req.userId)
  res.json({ code: 0, message: '已删除好友' })
})

module.exports = router
