const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { getDB } = require('../db/schema')
const { auth } = require('../middleware/auth')

// GET /api/topics (热门话题榜)
router.get('/', (req, res) => {
  const db = getDB()
  const { page = 1, pageSize = 20 } = req.query
  const offset = (page - 1) * pageSize
  const topics = db.prepare('SELECT * FROM topics ORDER BY followers_count DESC,posts_count DESC LIMIT ? OFFSET ?').all(Number(pageSize), Number(offset))
  const total = db.prepare('SELECT COUNT(*) as c FROM topics').get().c
  res.json({ code: 0, data: { list: topics, total, hasMore: offset + topics.length < total } })
})

// GET /api/topics/:id
router.get('/:id', (req, res) => {
  const db = getDB()
  const topic = db.prepare('SELECT * FROM topics WHERE id=?').get(req.params.id)
  if (!topic) return res.json({ code: 404, message: '话题不存在' })
  res.json({ code: 0, data: topic })
})

// GET /api/topics/:id/posts
router.get('/:id/posts', (req, res) => {
  const db = getDB()
  const { page = 1, pageSize = 10 } = req.query
  const offset = (page - 1) * pageSize
  const posts = db.prepare(`
    SELECT p.*, u.nickname as user_nickname, u.avatar as user_avatar, u.is_vip as user_is_vip,
           t.name as topic_name, t.icon as topic_icon
    FROM posts p LEFT JOIN users u ON p.user_id=u.id LEFT JOIN topics t ON p.topic_id=t.id
    WHERE p.topic_id=?
    ORDER BY p.created_at DESC LIMIT ? OFFSET ?
  `).all(req.params.id, Number(pageSize), Number(offset))
  const result = posts.map(p => ({ ...p, images: JSON.parse(p.images || '[]') }))
  res.json({ code: 0, data: { list: result, hasMore: posts.length === Number(pageSize) } })
})

// POST /api/topics/:id/follow
router.post('/:id/follow', auth, (req, res) => {
  const db = getDB()
  const existing = db.prepare('SELECT id FROM topic_follows WHERE user_id=? AND topic_id=?').get(req.userId, req.params.id)
  if (existing) {
    db.prepare('DELETE FROM topic_follows WHERE user_id=? AND topic_id=?').run(req.userId, req.params.id)
    db.prepare('UPDATE topics SET followers_count=followers_count-1 WHERE id=?').run(req.params.id)
    return res.json({ code: 0, message: '已取消关注', data: { followed: false } })
  }
  db.prepare('INSERT INTO topic_follows (id,user_id,topic_id) VALUES (?,?,?)').run(uuidv4(), req.userId, req.params.id)
  db.prepare('UPDATE topics SET followers_count=followers_count+1 WHERE id=?').run(req.params.id)
  res.json({ code: 0, message: '关注成功', data: { followed: true } })
})

module.exports = router
