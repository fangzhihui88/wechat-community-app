const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { getDB } = require('../db/schema')
const { auth } = require('../middleware/auth')

// GET /api/users/search?q=keyword
router.get('/search', (req, res) => {
  const { q, type = 'all' } = req.query
  if (!q) return res.json({ code: 0, data: [] })
  const db = getDB()
  const like = `%${q}%`

  if (type === 'user' || type === 'all') {
    const users = db.prepare(`
      SELECT id,nickname,avatar,bio,is_vip,followers_count,posts_count
      FROM users WHERE nickname LIKE ? OR bio LIKE ? LIMIT 20
    `).all(like, like)
    if (type === 'all') {
      const topics = db.prepare('SELECT id,name as nickname,icon as avatar,description as bio,followers_count FROM topics WHERE name LIKE ? LIMIT 5').all(like)
      return res.json({ code: 0, data: { users, topics } })
    }
    return res.json({ code: 0, data: users })
  }
  res.json({ code: 0, data: [] })
})

// GET /api/users/:id
router.get('/:id', (req, res) => {
  const db = getDB()
  const user = db.prepare('SELECT id,username,nickname,avatar,bio,location,gender,is_vip,vip_expire_at,followers_count,following_count,posts_count,created_at FROM users WHERE id = ?').get(req.params.id)
  if (!user) return res.json({ code: 404, message: '用户不存在' })
  res.json({ code: 0, data: user })
})

// PUT /api/users/profile (更新个人资料)
router.put('/profile', auth, (req, res) => {
  const db = getDB()
  const { nickname, bio, location, gender, avatar } = req.body
  const userId = req.userId
  db.prepare(`UPDATE users SET nickname=COALESCE(?,nickname),bio=COALESCE(?,bio),location=COALESCE(?,location),gender=COALESCE(?,gender),avatar=COALESCE(?,avatar),updated_at=datetime('now') WHERE id=?`)
    .run(nickname||null, bio||null, location||null, gender||null, avatar||null, userId)
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
  const { password: _, ...safeUser } = user
  res.json({ code: 0, data: safeUser })
})

// GET /api/users/:id/posts
router.get('/:id/posts', (req, res) => {
  const db = getDB()
  const { page = 1, pageSize = 10 } = req.query
  const offset = (page - 1) * pageSize
  const posts = db.prepare(`
    SELECT p.*, u.nickname as user_nickname, u.avatar as user_avatar, u.is_vip as user_is_vip,
           t.name as topic_name, t.icon as topic_icon
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN topics t ON p.topic_id = t.id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `).all(req.params.id, Number(pageSize), Number(offset))
  const total = db.prepare('SELECT COUNT(*) as c FROM posts WHERE user_id = ?').get(req.params.id).c
  res.json({ code: 0, data: { list: posts, total, page: Number(page), pageSize: Number(pageSize), hasMore: offset + posts.length < total } })
})

// POST /api/users/:id/follow
router.post('/:id/follow', auth, (req, res) => {
  const db = getDB()
  const userId = req.userId
  const targetId = req.params.id
  if (userId === targetId) return res.json({ code: 400, message: '不能关注自己' })

  const existing = db.prepare('SELECT id FROM follows WHERE follower_id=? AND following_id=?').get(userId, targetId)
  if (existing) {
    db.prepare('DELETE FROM follows WHERE follower_id=? AND following_id=?').run(userId, targetId)
    db.prepare('UPDATE users SET following_count=following_count-1 WHERE id=?').run(userId)
    db.prepare('UPDATE users SET followers_count=followers_count-1 WHERE id=?').run(targetId)
    return res.json({ code: 0, message: '已取消关注', data: { followed: false } })
  }

  db.prepare('INSERT OR IGNORE INTO follows (id,follower_id,following_id) VALUES (?,?,?)').run(uuidv4(), userId, targetId)
  db.prepare('UPDATE users SET following_count=following_count+1 WHERE id=?').run(userId)
  db.prepare('UPDATE users SET followers_count=followers_count+1 WHERE id=?').run(targetId)
  res.json({ code: 0, message: '关注成功', data: { followed: true } })
})

// GET /api/users/:id/followers
router.get('/:id/followers', (req, res) => {
  const db = getDB()
  const followers = db.prepare(`
    SELECT u.id,u.nickname,u.avatar,u.bio,u.is_vip,u.followers_count,
           EXISTS(SELECT 1 FROM follows WHERE follower_id=? AND following_id=u.id) as is_following
    FROM follows f JOIN users u ON f.follower_id=u.id
    WHERE f.following_id=?
    ORDER BY f.created_at DESC LIMIT 50
  `).all(req.params.id, req.params.id)
  res.json({ code: 0, data: followers })
})

// GET /api/users/:id/following
router.get('/:id/following', (req, res) => {
  const db = getDB()
  const following = db.prepare(`
    SELECT u.id,u.nickname,u.avatar,u.bio,u.is_vip,u.following_count,
           EXISTS(SELECT 1 FROM follows WHERE follower_id=? AND following_id=u.id) as is_following
    FROM follows f JOIN users u ON f.following_id=u.id
    WHERE f.follower_id=?
    ORDER BY f.created_at DESC LIMIT 50
  `).all(req.params.id, req.params.id)
  res.json({ code: 0, data: following })
})

module.exports = router
