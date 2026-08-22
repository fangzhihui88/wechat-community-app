const initSqlJs = require('sql.js')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')

const DB_PATH = path.join(__dirname, 'community.db')
let db = null
let SQL = null

// sql.js 结果转普通对象
function toObject(stmt) {
  const cols = stmt.getColumnNames()
  const values = stmt.get()
  const row = {}
  cols.forEach((c, i) => { row[c] = values[i] })
  return row
}
function toArray(stmt) {
  const cols = stmt.getColumnNames()
  const result = []
  while (stmt.step()) {
    const values = stmt.get()
    const row = {}
    cols.forEach((c, i) => { row[c] = values[i] })
    result.push(row)
  }
  return result
}

// 同步初始化（Node 启动时）
async function initDBAsync() {
  SQL = await initSqlJs()

  // 加载已有数据库或新建
  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buf)
  } else {
    db = new SQL.Database()
  }

  db.run('PRAGMA foreign_keys = ON')

  // 建表
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT NOT NULL,
      avatar TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      location TEXT DEFAULT '',
      gender TEXT DEFAULT 'secret',
      is_vip INTEGER DEFAULT 0,
      vip_expire_at TEXT,
      followers_count INTEGER DEFAULT 0,
      following_count INTEGER DEFAULT 0,
      posts_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS follows (
      id TEXT PRIMARY KEY,
      follower_id TEXT NOT NULL,
      following_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(follower_id, following_id)
    )`,
    `CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      icon TEXT DEFAULT '',
      posts_count INTEGER DEFAULT 0,
      followers_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      images TEXT DEFAULT '[]',
      video TEXT DEFAULT '',
      topic_id TEXT,
      location TEXT DEFAULT '',
      likes_count INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      shares_count INTEGER DEFAULT 0,
      is_hot INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS likes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      post_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, post_id)
    )`,
    `CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      post_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, post_id)
    )`,
    `CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      parent_id TEXT,
      likes_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT DEFAULT 'text',
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user1_id TEXT NOT NULL,
      user2_id TEXT NOT NULL,
      last_message TEXT DEFAULT '',
      last_message_at TEXT,
      unread_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS friend_requests (
      id TEXT PRIMARY KEY,
      from_user_id TEXT NOT NULL,
      to_user_id TEXT NOT NULL,
      message TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS friends (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      friend_id TEXT NOT NULL,
      remark TEXT DEFAULT '',
      tag TEXT DEFAULT '',
      is_top INTEGER DEFAULT 0,
      source TEXT DEFAULT 'search',
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, friend_id)
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      from_user_id TEXT,
      post_id TEXT,
      content TEXT DEFAULT '',
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS wallets (
      user_id TEXT PRIMARY KEY,
      balance REAL DEFAULT 0,
      points INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS pay_orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL,
      title TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      pay_method TEXT DEFAULT 'balance',
      created_at TEXT DEFAULT (datetime('now')),
      paid_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS point_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      points INTEGER NOT NULL,
      title TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS checkins (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      points INTEGER DEFAULT 10,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, date)
    )`,
    `CREATE TABLE IF NOT EXISTS topic_follows (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, topic_id)
    )`,
  ]

  for (const sql of tables) db.run(sql)
  saveDB()

  // 种子数据
  seedData()

  console.log('✅ 数据库初始化完成 (sql.js)')
  return db
}

function saveDB() {
  if (!db) return
  const data = db.export()
  const buf = Buffer.from(data)
  fs.writeFileSync(DB_PATH, buf)
}

// 每次写操作后自动保存
function save() { saveDB() }

function seedData() {
  const existing = db.exec('SELECT COUNT(*) as c FROM users')
  if (existing.length > 0 && existing[0].values[0][0] > 0) return

  console.log('🌱 写入种子数据...')
  const pwHash = bcrypt.hashSync('123456', 10)
  const now = new Date().toISOString()

  const users = [
    { id: 'user_001', username: 'dev_frontend', nickname: '前端开发者', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', bio: '热爱前端技术，关注用户体验', location: '深圳', gender: 'male', is_vip: 1, vip_expire_at: '2027-12-31' },
    { id: 'user_002', username: 'designer_anna', nickname: '设计师Anna', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200&h=200&fit=crop', bio: 'UI/UX设计师，追求像素级完美', location: '北京', gender: 'female', is_vip: 1, vip_expire_at: '2026-09-15' },
    { id: 'user_003', username: 'product_pm', nickname: '产品经理小王', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', bio: '5年产品经验，专注于社区产品', location: '上海', gender: 'male', is_vip: 0 },
    { id: 'user_004', username: 'data_analyst', nickname: '数据分析师小李', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', bio: '用数据驱动决策', location: '广州', gender: 'female', is_vip: 0 },
    { id: 'user_005', username: 'backend_guy', nickname: '后端工程师', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', bio: 'Node.js / Go / Python', location: '杭州', gender: 'male', is_vip: 1, vip_expire_at: '2027-06-01' },
  ]
  for (const u of users) {
    db.run(`INSERT INTO users (id,username,password,nickname,avatar,bio,location,gender,is_vip,vip_expire_at,followers_count,following_count,posts_count) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [u.id, u.username, pwHash, u.nickname, u.avatar, u.bio, u.location, u.gender, u.is_vip||0, u.vip_expire_at||null, Math.floor(Math.random()*200)+50, Math.floor(Math.random()*100)+20, Math.floor(Math.random()*30)+5])
  }

  const topics = [
    { id: 'topic_001', name: '前端开发', description: 'React/Vue/TypeScript 相关讨论', icon: '💻' },
    { id: 'topic_002', name: '产品设计', description: '产品需求、UI设计交流', icon: '🎨' },
    { id: 'topic_003', name: '人工智能', description: 'AI/ML 技术探讨', icon: '🤖' },
    { id: 'topic_004', name: '职场成长', description: '职业发展、技能提升', icon: '📈' },
    { id: 'topic_005', name: '摄影技巧', description: '摄影作品分享与技巧交流', icon: '📷' },
    { id: 'topic_006', name: '读书分享', description: '好书推荐、读书笔记', icon: '📚' },
    { id: 'topic_007', name: '运动健身', description: '健身打卡、经验分享', icon: '💪' },
    { id: 'topic_008', name: '美食天地', description: '美食制作、餐厅推荐', icon: '🍜' },
  ]
  for (const t of topics) db.run(`INSERT INTO topics (id,name,description,icon,posts_count,followers_count) VALUES (?,?,?,?,?,?)`, [t.id, t.name, t.description, t.icon, Math.floor(Math.random()*150)+50, Math.floor(Math.random()*300)+100])

  const posts = [
    { id: 'post_001', user_id: 'user_002', content: '分享一个刚完成的 App 设计稿，大家觉得配色怎么样？整体风格偏向现代简约风，主色调用了品牌蓝 #2196F3，辅以橙色作为强调色。', images: JSON.stringify(['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop']), topic_id: 'topic_002', location: '北京·朝阳区', likes_count: 42, comments_count: 8 },
    { id: 'post_002', user_id: 'user_003', content: '今天给大家推荐一本书《俞军产品方法论》，作为产品经理必读读物，里面关于用户价值的论述让我受益匪浅。', images: JSON.stringify(['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop']), topic_id: 'topic_006', location: '上海·浦东新区', likes_count: 38, comments_count: 12 },
    { id: 'post_003', user_id: 'user_001', content: 'React 19 正式发布了！这次带来了很多新特性，包括 Server Components、Actions、use() hook 等。尤其是 use() 可以让函数组件"等待"promise，太香了！', images: '', video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', topic_id: 'topic_001', location: '深圳·南山区', likes_count: 156, comments_count: 45, is_hot: 1 },
    { id: 'post_004', user_id: 'user_005', content: '刚从健身房回来，今天练了腿。一周三次力量训练配合有氧，感觉精神状态好了很多。大家平时都做什么运动？', images: JSON.stringify(['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop']), topic_id: 'topic_007', location: '杭州·西湖区', likes_count: 67, comments_count: 23 },
    { id: 'post_005', user_id: 'user_004', content: '数据分析报告：2024年社区类 App 用户增长趋势。数据显示，短视频+社交的融合模式增长最快，其次是垂直兴趣社区。', images: JSON.stringify(['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop']), topic_id: 'topic_003', location: '广州·天河区', likes_count: 89, comments_count: 34, is_hot: 1 },
    { id: 'post_006', user_id: 'user_002', content: '周末在家尝试做了红烧肉，炖了2个小时，入口即化！配方记录：五花肉500g、冰糖30g、老抽2勺、生抽3勺、料酒适量。', images: JSON.stringify(['https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop']), topic_id: 'topic_008', location: '北京·海淀区', likes_count: 124, comments_count: 38 },
  ]
  for (const p of posts) db.run(`INSERT INTO posts (id,user_id,content,images,video,topic_id,location,likes_count,comments_count,is_hot) VALUES (?,?,?,?,?,?,?,?,?,?)`, [p.id, p.user_id, p.content, p.images||'', p.video||'', p.topic_id||null, p.location||'', p.likes_count||0, p.comments_count||0, p.is_hot||0])

  const comments = [
    { id: 'comment_001', post_id: 'post_001', user_id: 'user_001', content: '配色很好看！蓝色+橙色是很经典的对比色搭配，视觉层次很清晰。', likes_count: 5 },
    { id: 'comment_002', post_id: 'post_001', user_id: 'user_003', content: '这个卡片圆角和阴影的处理很细腻，大厂设计水平', likes_count: 3 },
    { id: 'comment_003', post_id: 'post_003', user_id: 'user_005', content: 'Server Components 确实是革命性的，用起来体验怎么样？', likes_count: 8 },
    { id: 'comment_004', post_id: 'post_004', user_id: 'user_001', content: '我也是一周三练，腿部训练真的很酸爽！', likes_count: 2 },
  ]
  for (const c of comments) db.run(`INSERT INTO comments (id,post_id,user_id,content,likes_count) VALUES (?,?,?,?,?)`, [c.id, c.post_id, c.user_id, c.content, c.likes_count||0])

  db.run(`INSERT INTO conversations (id,user1_id,user2_id,last_message,last_message_at,unread_count) VALUES (?,?,?,?,?,?)`, ['conv_001', 'user_001', 'user_002', '配色方案我改好了，你看一下', now, 1])
  db.run(`INSERT INTO conversations (id,user1_id,user2_id,last_message,last_message_at,unread_count) VALUES (?,?,?,?,?,?)`, ['conv_002', 'user_001', 'user_003', '[图片]', now, 0])

  const wallets = [['user_001', 680.50, 2340], ['user_002', 320.00, 1200], ['user_003', 1200.00, 5800], ['user_004', 89.50, 450], ['user_005', 2100.00, 8900]]
  for (const w of wallets) db.run(`INSERT INTO wallets (user_id,balance,points) VALUES (?,?,?)`, w)

  const notifs = [
    ['notif_001', 'user_001', 'like', 'user_002', 'post_003', '赞了你的帖子', 0],
    ['notif_002', 'user_001', 'comment', 'user_003', 'post_001', '评论了你的帖子：配色很好看！', 0],
    ['notif_003', 'user_001', 'follow', 'user_005', null, '关注了你', 1],
    ['notif_004', 'user_001', 'system', null, null, '恭喜获得「活跃用户」徽章', 0],
  ]
  for (const n of notifs) db.run(`INSERT INTO notifications (id,user_id,type,from_user_id,post_id,content,is_read) VALUES (?,?,?,?,?,?,?)`, n)

  save()
  console.log('🌱 种子数据写入完成')
}

// ── 封装查询方法（与 better-sqlite3 API 兼容）────────────
function getDB() { return db }

function prepare(sql) {
  return {
    _sql: sql,
    get: function(...params) {
      const stmt = db.prepare(sql)
      stmt.bind(params)
      if (stmt.step()) {
        const row = toObject(stmt)
        stmt.free()
        return row
      }
      stmt.free()
      return undefined
    },
    all: function(...params) {
      const stmt = db.prepare(sql)
      stmt.bind(params)
      const result = toArray(stmt)
      stmt.free()
      return result
    },
    run: function(...params) {
      db.run(sql, params)
      save()
      return { changes: db.getRowsModified() }
    }
  }
}

// 兼容层：db.prepare() -> { get, all, run }
const dbWrapper = {
  prepare: (sql) => prepare(sql),
  exec: (sql) => db.exec(sql),
  run: (sql, params) => { db.run(sql, params); save() }
}

module.exports = {
  initDBAsync,
  getDB: () => dbWrapper,
  saveDB,
}
