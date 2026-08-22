export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/discover/index',
    'pages/publish/index',
    'pages/message/index',
    'pages/profile/index',
    'pages/search/index',
    'pages/topic/index',
    'pages/user-detail/index',
    'pages/followers/index',
    'pages/following/index',
    'pages/chat/index',
    'pages/settings/index',
    'pages/edit-profile/index',
    'pages/post-detail/index',
    'pages/gallery/index',
    // ===== 100 项功能新页面 =====
    'pages/activities/index',        // 同城活动
    'pages/activity-detail/index',   // 活动详情
    'pages/rankings/index',          // 排行榜
    'pages/my-posts/index',          // 我的动态
    'pages/my-likes/index',          // 我赞过的
    'pages/my-bookmarks/index',      // 我的收藏
    'pages/my-drafts/index',         // 草稿箱
    'pages/visitors/index',          // 访客记录
    'pages/badges/index',            // 成就徽章
    'pages/points/index',            // 积分中心
    'pages/checkin/index',           // 每日签到
    'pages/lottery/index',           // 幸运转盘
    'pages/wallet/index',            // 我的钱包
    'pages/wallet-tx/index',         // 账单明细
    'pages/coupons/index',           // 优惠券
    'pages/mall/index',              // 积分商城
    'pages/exchange-records/index',  // 兑换记录
    'pages/notify-settings/index',   // 通知设置
    'pages/general-settings/index',  // 通用设置
    'pages/faq/index',               // 帮助中心
    'pages/about/index',             // 关于我们
    'pages/feedback/index',          // 意见反馈
    'pages/report/index',            // 举报中心
    'pages/blacklist/index',         // 黑名单
    'pages/privacy/index',           // 隐私设置
    'pages/security/index',          // 账号安全
    'pages/blocked/index',           // 屏蔽管理
    'pages/language/index',          // 语言设置
    'pages/theme/index',             // 主题设置
    'pages/notifications/index',     // 通知中心
    'pages/hot-posts/index',         // 热门动态
    'pages/nearby/index',            // 附近的人/动态
    'pages/follow-feed/index',       // 关注动态
    'pages/vip/index',               // VIP 会员
    'pages/recharge/index',          // 充值中心
    'pages/withdraw/index',          // 提现
    'pages/invite/index',            // 邀请好友
    'pages/community-rules/index',   // 社区公约
    'pages/user-agreement/index',    // 用户协议
    'pages/privacy-policy/index',    // 隐私政策
    // ===== 200 项功能扩展页面 =====
    'pages/group-list/index',         // 群组广场
    'pages/group-detail/index',       // 群资料
    'pages/create-group/index',       // 创建群
    'pages/nearby-people/index',      // 附近的人
    'pages/city/index',               // 同城
    'pages/short-video/index',        // 短视频
    'pages/live-list/index',          // 直播列表
    'pages/live-room/index',          // 直播间
    'pages/news-list/index',          // 资讯列表
    'pages/news-detail/index',        // 资讯详情
    'pages/trade-list/index',         // 二手市场
    'pages/trade-detail/index',       // 商品详情
    'pages/jobs-list/index',          // 招聘列表
    'pages/job-detail/index',         // 职位详情
    'pages/tools-center/index',       // 工具箱
    'pages/question-list/index',      // 问答列表
    'pages/question-detail/index',    // 问答详情
    'pages/game-center/index',        // 小游戏
    'pages/game-detail/index',        // 游戏详情
    'pages/task-center/index',        // 任务中心
    'pages/level/index',              // 我的等级
    'pages/data-report/index',        // 数据中心
    'pages/course/index',             // 成长课堂
    'pages/collection/index',         // 内容合集
    'pages/feedback-list/index',      // 我的反馈
    'pages/hub/index',                // 功能中心（预览总览）
    // ===== 300 项功能扩展页面 =====
    'pages/health/index',              // 健康打卡
    'pages/study/index',               // 学习中心
    'pages/recipes/index',             // 美食菜谱
    'pages/travel/index',               // 旅游攻略
    'pages/pet/index',                 // 宠物社区
    'pages/car/index',                 // 车友圈
    'pages/estate/index',              // 房产信息
    'pages/wedding/index',             // 婚庆服务
    'pages/reading/index',              // 读书社区
    'pages/music/index',               // 音乐分享
    'pages/photo/index',               // 摄影天地
    'pages/art/index',                 // 艺术画廊
    'pages/star/index',                // 追星圈
    'pages/fitness-hub/index',         // 健身中心
    'pages/mom-baby/index',            // 母婴育儿
    'pages/pet-detail/index',         // 宠物详情
    'pages/mental-health/index',       // 心理健康
    'pages/beauty/index',              // 美容美妆
    'pages/charity/index',             // 公益活动
    'pages/forecast/index',             // 生活预测
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '社区',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
    enablePullDownRefresh: true,
    backgroundColor: '#F6F7FB',
  },
  tabBar: {
    color: '#9A9AB0',
    selectedColor: '#FF4757',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/index/index', text: '首页', iconPath: 'assets/icons/home.png', selectedIconPath: 'assets/icons/home-active.png' },
      { pagePath: 'pages/discover/index', text: '发现', iconPath: 'assets/icons/discover.png', selectedIconPath: 'assets/icons/discover-active.png' },
      { pagePath: 'pages/publish/index', text: '发布', iconPath: 'assets/icons/publish.png', selectedIconPath: 'assets/icons/publish-active.png' },
      { pagePath: 'pages/message/index', text: '消息', iconPath: 'assets/icons/message.png', selectedIconPath: 'assets/icons/message-active.png' },
      { pagePath: 'pages/profile/index', text: '我的', iconPath: 'assets/icons/profile.png', selectedIconPath: 'assets/icons/profile-active.png' },
    ],
  },
  permission: { 'scope.userLocation': { desc: '你的位置信息将用于展示附近内容' } },
  requiredPrivateInfos: ['getLocation'],
})
