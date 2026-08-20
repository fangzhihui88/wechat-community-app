# 微信社区小程序 - WeChat Community Mini Program

## 技术栈

- **框架**：Taro 4.x（React 语法，跨端支持微信小程序）
- **语言**：TypeScript
- **样式**：Tailwind CSS + Taro UI
- **状态管理**：Zustand
- **路由**：Taro Router
- **目标平台**：微信小程序

## 项目结构

```
src/
├── app.tsx              # 应用入口
├── app.config.ts        # 应用配置（tabBar、页面路由）
├── pages/
│   ├── index/           # 首页（动态 Feed 流）
│   ├── discover/        # 发现页（话题/标签）
│   ├── publish/         # 发布页
│   ├── message/         # 消息页
│   └── profile/         # 个人主页
├── components/
│   ├── FeedCard/        # 动态卡片组件
│   ├── UserAvatar/      # 用户头像组件
│   ├── ActionBar/       # 互动栏（点赞/评论/分享）
│   ├── CommentList/     # 评论列表组件
│   ├── TabBar/          # 底部导航栏
│   ├── SearchBar/       # 搜索栏
│   ├── TopicTag/        # 话题标签组件
│   └── EmptyState/      # 空状态组件
├── store/
│   └── useAppStore.ts   # 全局状态管理
├── hooks/
│   ├── usePullDownRefresh.ts
│   └── useTabBar.ts
├── utils/
│   ├── request.ts       # 请求封装
│   └── formatTime.ts    # 时间格式化
├── types/
│   └── index.ts         # TypeScript 类型定义
└── assets/
    └── icons/           # 图标资源
```

## 快速开始

```bash
# 安装依赖（Taro 项目需跳过 peer 依赖检查）
npm install --legacy-peer-deps

# 开发微信小程序（微信开发者工具导入项目根目录，产物在 dist/）
npm run dev:weapp

# 构建微信小程序
npm run build:weapp

# 构建 H5 并在浏览器预览
npm run build:h5
python3 -m http.server 8848 --directory dist
# 浏览器打开 http://localhost:8848/

# 一条命令构建 H5 + 启动预览服务器
npm run preview:h5

# 重新生成 tabBar 图标
npm run gen:icons
```

## 预览方式

### 方式一：浏览器预览（H5）

```bash
npm run preview:h5
```

然后浏览器打开 **http://localhost:8848/** 即可体验完整页面（首页 Feed 流、点赞/评论交互、发布、消息、我的）。

### 方式二：微信开发者工具（真机效果）

1. 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 启动项目构建：`npm run dev:weapp`（保持运行，支持热更新）
3. 微信开发者工具 → 导入项目 → 选择本项目根目录
4. AppID 选择「测试号」（project.config.json 已配置 touristappid）
5. 即可在模拟器/真机预览

> 注意：两个方式共用 dist/ 输出目录，切换平台时需重新构建对应端。

## 常见问题

- **npm install 报 peer 冲突**：`@types/react` 版本冲突是 taro-ui → react-native 间接引入导致，用 `npm install --legacy-peer-deps` 即可
- **构建报 ProgressPlugin 校验错误**：webpack 版本过新，已锁定 `webpack@5.78.0`（Taro 4 验证过的兼容版本）
- **H5 构建无 index.html**：需在 `src/index.html` 提供 HTML 模板（Taro 4 要求）
- **CSS Conflicting order 报错**：已在 `config/index.ts` 配置 `miniCssExtractPluginOption.ignoreOrder`
- **tabBar 图标缺失**：运行 `npm run gen:icons` 重新生成

## 后续接入计划

- [ ] 接入真实 API（替换 `src/utils/request.ts` 的 BASE_URL）
- [ ] 微信登录（`wx.login` + code 换 token）
- [ ] 图片上传服务（当前为本地 chooseImage）
- [ ] 小程序 AppID 正式配置
- [ ] 替换占位 tabBar 图标为设计稿图标

## 主要功能

1. **首页 Feed 流**：瀑布流/列表展示社区动态，支持下拉刷新、上拉加载更多
2. **发现页**：话题标签聚合内容，支持搜索
3. **发布页**：图文/纯文字发布，支持话题标签
4. **消息页**：评论、点赞、关注等通知
5. **个人主页**：用户信息、发布的动态、相册

## 设计规范

- 主题色：`#FF4757`（活力红）
- 辅助色：`#FF6B81`、`#FFE4E1`
- 文字色：`#333`（主文字）、`#999`（次级文字）
- 背景色：`#F7F7F7`（页面背景）、`#FFFFFF`（卡片背景）
- 圆角：8px（卡片）、16px（按钮）、50%（头像）
- 间距：12px（组件内）、16px（页面边距）、24px（区块间距）
