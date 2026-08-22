const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { getDB } = require('../db/schema')
const { auth } = require('../middleware/auth')

// GET /api/messages/notifications
router.get('/notifications', auth, (req, res) => {
  const db = getDB()
  const notifs = db.prepare(`
    SELECT n.*, u.nickname as from_nickname, u.avatar as from_avatar
    FROM notifications n LEFT JOIN users u ON n.from_user_id=u.id
    WHERE n.user_id=?
    ORDER BY n.created_at DESC LIMIT 50
  `).all(req.userId)
  res.json({ code: 0, data: notifs })
})

// PUT /api/messages/notifications/read
router.put('/notifications/read', auth, (req, res) => {
  const db = getDB()
  db.prepare('UPDATE notifications SET is_read=1 WHERE user_id=?').run(req.userId)
  res.json({ code: 0, message: '已全部已读' })
})

// GET /api/messages/conversations
router.get('/conversations', auth, (req, res) => {
  const db = getDB()
  const convs = db.prepare(`
    SELECT c.*,
      CASE WHEN c.user1_id=? THEN u2.nickname ELSE u1.nickname END as other_nickname,
      CASE WHEN c.user1_id=? THEN u2.avatar ELSE u1.avatar END as other_avatar,
      CASE WHEN c.user1_id=? THEN u2.id ELSE u1.id END as other_id
    FROM conversations c
    LEFT JOIN users u1 ON c.user1_id=u1.id
    LEFT JOIN users u2 ON c.user2_id=u2.id
    WHERE c.user1_id=? OR c.user2_id=?
    ORDER BY c.last_message_at DESC
  `).all(req.userId, req.userId, req.userId, req.userId, req.userId)
  res.json({ code: 0, data: convs })
})

// GET /api/messages/conversations/:id/messages
router.get('/conversations/:id/messages', auth, (req, res) => {
  const db = getDB()
  const msgs = db.prepare(`
    SELECT m.*, u.nickname as sender_nickname, u.avatar as sender_avatar
    FROM chat_messages m LEFT JOIN users u ON m.sender_id=u.id
    WHERE m.conversation_id=?
    ORDER BY m.created_at ASC
  `).all(req.params.id)
  // 标记已读
  db.prepare('UPDATE chat_messages SET is_read=1 WHERE conversation_id=? AND sender_id!=?').run(req.params.id, req.userId)
  db.prepare('UPDATE conversations SET unread_count=0 WHERE id=?').run(req.params.id)
  res.json({ code: 0, data: msgs })
})

// POST /api/messages/conversations/:id/send
router.post('/conversations/:id/send', auth, (req, res) => {
  const db = getDB()
  const { content, type = 'text' } = req.body
  if (!content) return res.json({ code: 400, message: '消息内容不能为空' })
  const id = `msg_${uuidv4().replace(/-/g, '').slice(0, 10)}`
  db.prepare('INSERT INTO chat_messages (id,conversation_id,sender_id,content,type) VALUES (?,?,?,?,?)')
    .run(id, req.params.id, req.userId, content, type)
  db.prepare(`UPDATE conversations SET last_message=?, last_message_at=datetime('now') WHERE id=?`)
    .run(content, req.params.id)
  // 对方未读+1
  const conv = db.prepare('SELECT * FROM conversations WHERE id=?').get(req.params.id)
  if (conv) {
    const otherId = conv.user1_id === req.userId ? conv.user2_id : conv.user1_id
    db.prepare('UPDATE conversations SET unread_count=unread_count+1 WHERE id=?').run(req.params.id)
  }
  const msg = db.prepare('SELECT * FROM chat_messages WHERE id=?').get(id)
  res.json({ code: 0, data: msg })
})

// POST /api/messages/conversations (创建或获取会话)
router.post('/conversations', auth, (req, res) => {
  const db = getDB()
  const { userId } = req.body // 对方用户ID
  if (!userId) return res.json({ code: 400, message: 'userId不能为空' })
  let conv = db.prepare('SELECT * FROM conversations WHERE (user1_id=? AND user2_id=?) OR (user1_id=? AND user2_id=?)')
    .get(req.userId, userId, userId, req.userId)
  if (!conv) {
    const id = `conv_${uuidv4().replace(/-/g, '').slice(0, 10)}`
    db.prepare('INSERT INTO conversations (id,user1_id,user2_id) VALUES (?,?,?)').run(id, req.userId, userId)
    conv = db.prepare('SELECT * FROM conversations WHERE id=?').get(id)
  }
  res.json({ code: 0, data: conv })
})

module.exports = router
