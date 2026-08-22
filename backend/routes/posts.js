const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { getDB } = require('../db/schema')
const { auth } = require('../middleware/auth')

// GET /api/posts?tab=recommend&page=1&pageSize=10
router.get('/', (req, res) => {
  const db = getDB()
  const { tab = 'recommend', page = 1, pageSize = 10 } = req.query
  const offset = (page - 1) * pageSize
  let where = '1=1'
  if (tab === 'hot') where += ' AND p.is_hot=1'
  if (tab === 'follow') {
    // 关注动态需要登录，这里简化处理
    where += ' AND p.is_hot=1'
  }

  const posts = db.prepare(`
    SELECT p.*, u.nickname as user_nickname, u.avatar as user_avatar, u.is_vip as user_is_vip,
           t.name as topic_name, t.icon as topic_icon
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN topics t ON p.topic_id = t.id
    WHERE ${where}
    ORDER BY p.is_hot DESC, p.created_at DESC
    LIMIT ? OFFSET ?
  `).all(Number(pageSize), Number(offset))
  const total = db.prepare(`SELECT COUNT(*) as c FROM posts p WHERE ${where}`).get().c

  // 处理 images JSON
  const result = posts.map(p => ({ ...p, images: JSON.parse(p.images || '[]') }))
  res.json({ code: 0, data: { list: result, total, page: Number(page), pageSize: Number(pageSize), hasMore: offset + posts.length < total } })
})

// GET /api/posts/:id
router.get('/:id', (req, res) => {
  const db = getDB()
  const post = db.prepare(`
    SELECT p.*, u.nickname as user_nickname, u.avatar as user_avatar, u.is_vip as user_is_vip,
           t.name as topic_name, t.icon as topic_icon
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN topics t ON p.topic_id = t.id
    WHERE p.id=?
  `).get(req.params.id)
  if (!post) return res.json({ code: 404, message: '帖子不存在' })
  res.json({ code: 0, data: { ...post, images: JSON.parse(post.images || '[]') } })
})

// POST /api/posts (发布帖子)
router.post('/', auth, (req, res) => {
  const db = getDB()
  const { content, images, video, topic_id, location } = req.body
  if (!content) return res.json({ code: 400, message: '内容不能为空' })

  const id = `post_${uuidv4().replace(/-/g, '').slice(0, 10)}`
  const imagesJson = JSON.stringify(images || [])
  db.prepare(`INSERT INTO posts (id,user_id,content,images,video,topic_id,location) VALUES (?,?,?,?,?,?,?)`)
    .run(id, req.userId, content, imagesJson, video || '', topic_id || null, location || '')
  db.prepare('UPDATE users SET posts_count=posts_count+1 WHERE id=?').run(req.userId)
  if (topic_id) db.prepare('UPDATE topics SET posts_count=posts_count+1 WHERE id=?').run(topic_id)

  const post = db.prepare('SELECT * FROM posts WHERE id=?').get(id)
  res.json({ code: 0, message: '发布成功', data: { ...post, images: JSON.parse(post.images || '[]') } })
})

// POST /api/posts/:id/like
router.post('/:id/like', auth, (req, res) => {
  const db = getDB()
  const postId = req.params.id
  const userId = req.userId
  const existing = db.prepare('SELECT id FROM likes WHERE user_id=? AND post_id=?').get(userId, postId)
  if (existing) {
    db.prepare('DELETE FROM likes WHERE user_id=? AND post_id=?').run(userId, postId)
    db.prepare('UPDATE posts SET likes_count=likes_count-1 WHERE id=?').run(postId)
    return res.json({ code: 0, message: '已取消点赞', data: { liked: false } })
  }
  db.prepare('INSERT INTO likes (id,user_id,post_id) VALUES (?,?,?)').run(uuidv4(), userId, postId)
  db.prepare('UPDATE posts SET likes_count=likes_count+1 WHERE id=?').run(postId)
  res.json({ code: 0, message: '点赞成功', data: { liked: true } })
})

// POST /api/posts/:id/bookmark
router.post('/:id/bookmark', auth, (req, res) => {
  const db = getDB()
  const postId = req.params.id
  const userId = req.userId
  const existing = db.prepare('SELECT id FROM bookmarks WHERE user_id=? AND post_id=?').get(userId, postId)
  if (existing) {
    db.prepare('DELETE FROM bookmarks WHERE user_id=? AND post_id=?').run(userId, postId)
    return res.json({ code: 0, message: '已取消收藏', data: { bookmarked: false } })
  }
  db.prepare('INSERT INTO bookmarks (id,user_id,post_id) VALUES (?,?,?)').run(uuidv4(), userId, postId)
  res.json({ code: 0, message: '收藏成功', data: { bookmarked: true } })
})

// GET /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
  const db = getDB()
  const comments = db.prepare(`
    SELECT c.*, u.nickname as user_nickname, u.avatar as user_avatar, u.is_vip as user_is_vip
    FROM comments c LEFT JOIN users u ON c.user_id=u.id
    WHERE c.post_id=? AND c.parent_id IS NULL
    ORDER BY c.likes_count DESC, c.created_at ASC
  `).all(req.params.id)
  // 加载子评论
  for (const c of comments) {
    c.replies = db.prepare(`
      SELECT c2.*, u.nickname as user_nickname, u.avatar as user_avatar
      FROM comments c2 LEFT JOIN users u ON c2.user_id=u.id
      WHERE c2.parent_id=? ORDER BY c2.created_at ASC LIMIT 2
    `).all(c.id)
  }
  res.json({ code: 0, data: comments })
})

// POST /api/posts/:id/comment
router.post('/:id/comment', auth, (req, res) => {
  const db = getDB()
  const { content, parent_id } = req.body
  if (!content) return res.json({ code: 400, message: '评论内容不能为空' })
  const id = `comment_${uuidv4().replace(/-/g, '').slice(0, 8)}`
  db.prepare('INSERT INTO comments (id,post_id,user_id,content,parent_id) VALUES (?,?,?,?,?)')
    .run(id, req.params.id, req.userId, content, parent_id || null)
  db.prepare('UPDATE posts SET comments_count=comments_count+1 WHERE id=?').run(req.params.id)
  const comment = db.prepare(`
    SELECT c.*, u.nickname as user_nickname, u.avatar as user_avatar
    FROM comments c LEFT JOIN users u ON c.user_id=u.id WHERE c.id=?
  `).get(id)
  res.json({ code: 0, data: comment })
})

module.exports = router
