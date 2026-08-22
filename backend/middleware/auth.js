const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'yuantou-community-secret-2024'

function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ code: 401, message: '请先登录' })
  try {
    const { userId } = jwt.verify(token, JWT_SECRET)
    req.userId = userId
    next()
  } catch {
    res.status(401).json({ code: 401, message: '登录已过期，请重新登录' })
  }
}

module.exports = { auth }
