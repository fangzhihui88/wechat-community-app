# Task: WeChat Community Mini-Program Page Creation

## Objective
Create 5 pages for a Taro 4 + React + TypeScript + Zustand WeChat/Alipay community mini-program with design tokens and mock data.

## Completed Pages

1. **群组广场 (group-list)** - Search bar + recommended groups with join button
2. **群资料 (group-detail)** - Gradient header, group info, announcement, member wall, join button
3. **建群 (create-group)** - Name input, description textarea, category chips, public/private switch, create button
4. **附近的人 (nearby-people)** - Location banner + user cards with distance, avatar, nickname, signature, greet button
5. **同城 (city)** - City selector chips + mixed content feed (articles, topics, users)

## Key Implementation Details

- All pages use NavBar with custom navigation style
- Mock data defined locally within each page (no store imports)
- Design tokens from app.css (--color-primary, --spacing-*, --radius-*, --font-size-*)
- Mobile-first responsive layouts with rpx conversion
- Platform-standard components (.mp-cell, .mp-tag, .mp-btn, etc.)
- Safe area handling for iOS notch/home indicator

## File Structure
```
src/pages/
├── group-list/
│   ├── index.tsx (2.1KB)
│   └── index.css (1.6KB)
├── group-detail/
│   ├── index.tsx (2.9KB)
│   └── index.css (2.0KB)
├── create-group/
│   ├── index.tsx (3.5KB)
│   └── index.css (1.5KB)
├── nearby-people/
│   ├── index.tsx (3.5KB)
│   └── index.css (2.2KB)
└── city/
    ├── index.tsx (4.9KB)
    └── index.css (2.4KB)
```

## Notes
- No modifications to existing files (app.config.ts, store, types, app.css)
- All pages follow strict page structure with NavBar + ScrollView pattern
- Interactive elements use Taro.showToast for feedback
- Navigation uses Taro.navigateTo/navigateBack
- All pages ready for mini-program compilation
