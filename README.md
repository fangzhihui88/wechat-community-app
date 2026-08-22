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
├── app.ts              # 应用入口（黑暗模式注入）
├── app.config.ts        # 应用配置（tabBar、15 个页面路由）
├── app.css             # 全局样式 + CSS 变量 + 黑暗模式
├── pages/
│   ├── index/           # 首页（多 Tab Feed 流：推荐/关注/附近）
│   ├── discover/        # 发现页（热门话题榜/分类/搜索入口）
│   ├── publish/         # 发布页（图文/视频/话题/@提醒/定位）
│   ├── message/         # 消息页（互动/关注/私信/系统 分类）
│   ├── profile/         # 个人主页（资料/相册/我赞过的/设置）
│   ├── search/          # 全局搜索（综合/用户/话题）
│   ├── topic/           # 话题详情页（动态列表/关注话题）
│   ├── user-detail/     # 他人主页（关注/私信）
│   ├── followers/       # 粉丝列表
│   ├── following/       # 关注列表
│   ├── chat/            # 私信聊天（会话列表 + 聊天窗口）
│   ├── post-detail/     # 动态详情（评论列表 + 发表评论）
│   ├── gallery/         # 我的相册（图片网格预览）
│   ├── edit-profile/    # 编辑资料
│   └── settings/        # 设置中心
├── components/
│   ├── FeedCard/        # 动态卡片组件
│   ├── UserAvatar/      # 用户头像组件
│   ├── ActionBar/       # 互动栏（点赞/评论/分享）
│   ├── CommentList/     # 评论列表组件（含子评论）
│   ├── NavBar/          # 子页面通用导航栏
│   ├── SearchBar/       # 搜索栏
│   ├── TopicTag/        # 话题标签组件
│   └── EmptyState/      # 空状态组件
├── store/
│   └── useAppStore.ts   # Zustand 全局状态（mock 数据 + actions）
├── utils/
│   └── formatTime.ts    # 时间/数字格式化
├── types/
│   └── index.ts         # TypeScript 类型定义
└── assets/
    └── icons/           # 图标资源（gen:icons 生成）
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

## 主要功能（30 项）

**首页 / Feed 流**
1. 多 Tab 首页（推荐 / 关注 / 附近）
2. 下拉刷新（加载最新动态）
3. 上拉加载更多（分页追加）
4. 点赞（联动点赞列表 + 点赞数）
5. 评论列表（动态详情页展示）
6. 发表评论（动态详情页输入框）
7. 转发 / 分享
8. 收藏（联动收藏列表）

**发布**
9. 图文发布
10. 视频发布
11. 话题选择
12. 位置获取（getLocation）
13. @ 好友提醒

**发现 / 话题**
14. 话题详情页
15. 热门话题榜
16. 全局搜索（综合）
17. 搜索用户
18. 搜索话题

**关注关系**
19. 关注用户
20. 取消关注
21. 粉丝列表
22. 关注列表

**私信**
23. 私信聊天（会话列表 + 聊天窗口）

**个人中心**
24. 个人主页
25. 编辑资料
26. 我的相册
27. 我赞过的
28. 消息分类通知（互动 / 关注 / 私信 / 系统）
29. 黑暗模式
30. 设置中心

> 数据均为 `src/store/useAppStore.ts` 中的 mock 数据，便于本地体验全部交互。

## 设计规范

- 主题色：`#FF4757`（活力红）
- 辅助色：`#FF6B81`、`#FFE4E1`
- 文字色：`#333`（主文字）、`#999`（次级文字）
- 背景色：`#F7F7F7`（页面背景）、`#FFFFFF`（卡片背景）
- 圆角：8px（卡片）、16px（按钮）、50%（头像）
- 间距：12px（组件内）、16px（页面边距）、24px（区块间距）
