/**
 * Post-build: merge all chunk CSS files into css/app.css
 * Fixes Taro H5 CSS chunk splitting issue — ensures discover page styles
 * (including newly added components) are always loaded.
 */
const fs = require('fs')
const path = require('path')

const distDir = path.join(__dirname, '..', 'dist')
const cssDir = path.join(distDir, 'css')
const appCssPath = path.join(cssDir, 'app.css')

// Read app.css first
let merged = fs.readFileSync(appCssPath, 'utf-8')
merged += '\n'

// Read all chunk CSS files and append them
const chunkFiles = fs.readdirSync(cssDir)
  .filter(f => f.endsWith('.css') && f !== 'app.css')
  .sort()

for (const file of chunkFiles) {
  const content = fs.readFileSync(path.join(cssDir, file), 'utf-8')
  merged += `/* ===== ${file} ===== */\n${content}\n`
}

fs.writeFileSync(appCssPath, merged, 'utf-8')
console.log(`[merge-css] Merged ${chunkFiles.length} chunk CSS files into app.css (${Math.round(merged.length / 1024)} KB)`)
