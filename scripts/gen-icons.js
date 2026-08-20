// 生成 tabBar 占位 PNG 图标脚本
// 用法: node scripts/gen-icons.js
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const SIZE = 81

// ---------- PNG 编码 ----------
function crc32(buf) {
  let table = crc32.table
  if (!table) {
    table = crc32.table = new Int32Array(256)
    for (let n = 0; n < 256; n++) {
      let c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      table[n] = c
    }
  }
  let crc = -1
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff]
  return (crc ^ -1) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function encodePNG(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0 // filter: None
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4
      const dst = y * (width * 4 + 1) + 1 + x * 4
      raw[dst] = rgba[src]
      raw[dst + 1] = rgba[src + 1]
      raw[dst + 2] = rgba[src + 2]
      raw[dst + 3] = rgba[src + 3]
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  const idat = zlib.deflateSync(raw, { level: 9 })
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------- 形状绘制 ----------
function createCanvas() {
  const rgba = new Uint8Array(SIZE * SIZE * 4)
  const setPixel = (x, y, color) => {
    if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return
    const i = (y * SIZE + x) * 4
    rgba[i] = color[0]; rgba[i + 1] = color[1]; rgba[i + 2] = color[2]; rgba[i + 3] = color[3]
  }
  return { rgba, setPixel }
}

function fillRect(setPixel, x0, y0, w, h, color) {
  for (let y = y0; y < y0 + h; y++)
    for (let x = x0; x < x0 + w; x++) setPixel(x, y, color)
}

function fillCircle(setPixel, cx, cy, r, color) {
  for (let y = cy - r; y <= cy + r; y++)
    for (let x = cx - r; x <= cx + r; x++) {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      if (d <= r) setPixel(x, y, color)
    }
}

function fillTriangle(setPixel, x0, y0, x1, y1, x2, y2, color) {
  const sign = (ax, ay, bx, by, cx, cy) => (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
  const minX = Math.max(0, Math.floor(Math.min(x0, x1, x2)))
  const maxX = Math.min(SIZE - 1, Math.ceil(Math.max(x0, x1, x2)))
  const minY = Math.max(0, Math.floor(Math.min(y0, y1, y2)))
  const maxY = Math.min(SIZE - 1, Math.ceil(Math.max(y0, y1, y2)))
  for (let y = minY; y <= maxY; y++)
    for (let x = minX; x <= maxX; x++) {
      const d1 = sign(x, y, x0, y0, x1, y1)
      const d2 = sign(x, y, x1, y1, x2, y2)
      const d3 = sign(x, y, x2, y2, x0, y0)
      const hasNeg = d1 < 0 || d2 < 0 || d3 < 0
      const hasPos = d1 > 0 || d2 > 0 || d3 > 0
      if (!(hasNeg && hasPos)) setPixel(x, y, color)
    }
}

function strokeCircle(setPixel, cx, cy, r, width, color) {
  for (let y = cy - r - width; y <= cy + r + width; y++)
    for (let x = cx - r - width; x <= cx + r + width; x++) {
      const d = Math.abs(Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) - r)
      if (d <= width / 2) setPixel(x, y, color)
    }
}

// 各 tab 图标绘制（基于 setPixel 的纯函数）
function drawHome(setPixel, color) {
  const t = (x0, y0, x1, y1, x2, y2, c) => fillTriangle(setPixel, x0, y0, x1, y1, x2, y2, c)
  const r = (x0, y0, w, h, c) => fillRect(setPixel, x0, y0, w, h, c)
  const c2 = (cx, cy, rad, col) => fillCircle(setPixel, cx, cy, rad, col)
  // 屋顶
  t(10, 42, 40, 12, 71, 42, color)
  // 房身
  r(18, 40, 45, 30, color)
  // 门
  r(34, 50, 14, 20, [255, 255, 255, 255])
}

function drawDiscover(setPixel, color) {
  const c2 = (cx, cy, rad, col) => fillCircle(setPixel, cx, cy, rad, col)
  const t = (x0, y0, x1, y1, x2, y2, c) => fillTriangle(setPixel, x0, y0, x1, y1, x2, y2, c)
  const s = (cx, cy, r, w, col) => strokeCircle(setPixel, cx, cy, r, w, col)
  c2(40, 40, 26, [255, 255, 255, 255])
  s(40, 40, 26, 7, color)
  // 指针
  t(40, 24, 47, 47, 40, 40, color)
  t(40, 56, 33, 33, 40, 40, color)
}

function drawPublish(setPixel, color) {
  const c2 = (cx, cy, rad, col) => fillCircle(setPixel, cx, cy, rad, col)
  const r = (x0, y0, w, h, c) => fillRect(setPixel, x0, y0, w, h, c)
  // 圆角方形底
  c2(20, 20, 10, color); c2(61, 20, 10, color)
  c2(20, 61, 10, color); c2(61, 61, 10, color)
  r(20, 14, 41, 53, color)
  r(14, 20, 53, 41, color)
  // 白色加号
  r(35, 25, 11, 31, [255, 255, 255, 255])
  r(25, 35, 31, 11, [255, 255, 255, 255])
}

function drawMessage(setPixel, color) {
  const c2 = (cx, cy, rad, col) => fillCircle(setPixel, cx, cy, rad, col)
  const r = (x0, y0, w, h, c) => fillRect(setPixel, x0, y0, w, h, c)
  const t = (x0, y0, x1, y1, x2, y2, c) => fillTriangle(setPixel, x0, y0, x1, y1, x2, y2, c)
  c2(40, 36, 22, color)
  r(18, 36, 44, 20, color)
  r(18, 30, 44, 8, color)
  // 尾部小三角
  t(22, 56, 38, 56, 26, 68, color)
  // 眼睛
  c2(32, 42, 3.5, [255, 255, 255, 255])
  c2(48, 42, 3.5, [255, 255, 255, 255])
}

function drawProfile(setPixel, color) {
  const c2 = (cx, cy, rad, col) => fillCircle(setPixel, cx, cy, rad, col)
  const r = (x0, y0, w, h, c) => fillRect(setPixel, x0, y0, w, h, c)
  // 头
  c2(40, 28, 13, color)
  // 身体
  c2(40, 64, 22, color)
  r(18, 60, 44, 6, color)
}

const icons = {
  home: drawHome,
  discover: drawDiscover,
  publish: drawPublish,
  message: drawMessage,
  profile: drawProfile,
}

const GRAY = [153, 153, 153, 255]      // #999999
const RED = [255, 71, 87, 255]         // #FF4757

const outDir = path.join(__dirname, '..', 'src', 'assets', 'icons')
fs.mkdirSync(outDir, { recursive: true })

for (const [name, draw] of Object.entries(icons)) {
  for (const [suffix, color] of [['', GRAY], ['-active', RED]]) {
    const { rgba, setPixel } = createCanvas()
    draw(setPixel, color)
    const png = encodePNG(SIZE, SIZE, rgba)
    const file = path.join(outDir, `${name}${suffix}.png`)
    fs.writeFileSync(file, png)
    console.log('✓', file, `(${png.length} bytes)`)
  }
}
console.log('全部图标生成完毕')
