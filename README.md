<div align="center">
🧭 陈淑婷 · 资源收藏导航
全中文一站式精选实用资源与网站导航平台

TypeScript
React
Vite
Tailwind CSS
Express
Google GenAI
Android

一个集「资源导航 · 聚合搜索 · AI 资讯 · 个性化定制」于一体的个人导航平台。 涵盖影视娱乐、AI 工具、在线工具、音乐听歌、小说阅读、游戏资源与装机必备，支持 Web 与 Android 双端使用。

</div>
🖼️ 项目预览
项目预览

💡 上图由 AI 生成的概念预览图。将本仓库 npm run dev 启动后截图，替换为 assets/preview.png 即为真实界面预览。

✨ 核心特性
🎯 海量资源导航
九大资源分类：影视娱乐、AI 与大模型、无限画布与创作、Prompt 与 Skill 社区、音乐听歌、小说阅读、游戏资源、装机必备、伙伴推荐
数千个精选卡片：每张卡片自动抓取站点 Logo，缺失时优雅降级为域名缩写
悬停即预览：鼠标悬停卡片实时弹出站点信息预览，快速判断是否值得点开
🔍 聚合搜索
多引擎随心切：必应 / 百度 / 搜狗 / 谷歌 / B 站 / 百度网盘 / 微博 / 知乎 / GitHub 一键切换
站内智能联想：输入即列出站内匹配的资源标题，空输入展示热门联想词，点一下直接填词
搜索历史 + 热词标签：常用词快速回填，热门标签一键直达
🎤 语音搜索：支持语音输入，解放双手
🤖 AI 资讯中心
实时科技头条：服务端基于 Gemini + Google Search 实时检索全球科技 / AI 重大新闻（10 分钟缓存）
新闻跑马灯：首页滚动播报最新 AI 前沿动态，点击查看详情
智能兜底：未配置 API Key 时自动切换为精选科技快讯，永不失联
🎨 个性化定制
深色 / 浅色模式：一键切换，护眼舒适
自定义背景：支持图片 / 视频背景，模糊度与透明度自由调节
收藏夹置顶：常用站点一键收藏，置顶展示
自定义卡片：自由添加个人常用链接
编辑模式 + 批量操作：多选卡片批量移动 / 删除，管理随心
数据备份 / 恢复：一键导出 JSON 备份，换设备无缝迁移
✨ 精美交互
二十四节气动效：立春花瓣、清明细雨、白露露珠、立冬雪花、流萤光点 —— 应景粒子特效自动切换
金龙绕边框特效：弹窗叠加纯代码绘制的动态金龙金框
点击粒子特效、顶部加载进度条、回到顶部、Toast 轻提示，处处精致
📱 双端发布
Web 端：React SPA，Express 单服务托管
Android 端：内置版本更新检测，多源容错拉取更新清单，一键升级
📦 快速开始
环境要求
Node.js ≥ 18
npm / pnpm / yarn
本地开发
bash
# 1. 克隆仓库
git clone https://github.com/shuting52/chenshuting2026.git
cd chenshuting2026

# 2. 安装依赖
npm install

# 3. 配置环境变量（可选，用于 AI 新闻）
cp .env.example .env
# 编辑 .env，填入 GEMINI_API_KEY（不配置时新闻自动使用精选兜底）

# 4. 启动开发服务
npm run dev
# → 打开 http://localhost:3000
生产构建
bash
npm run build      # 构建前端 + 打包服务端
npm start          # 以生产模式启动（端口 3000）
🧱 技术栈
领域	技术
前端框架	React 19 + TypeScript 5.8
构建工具	Vite 6 + esbuild
样式方案	Tailwind CSS 4
服务端	Express 4（Node.js）
AI 能力	Google GenAI（Gemini + Google Search 联网）
动画	Motion
图标	lucide-react
移动端	Android APK（自带更新检测）
📁 目录结构
code
chenshuting2026/
├── src/                        # 前端源码
│   ├── App.tsx                 # 应用主入口
│   ├── components/             # 组件库
│   │   ├── Header.tsx          # 搜索栏 / 多引擎切换 / 语音搜索
│   │   ├── CategorySection.tsx # 分类资源卡片区
│   │   ├── NewsMarquee.tsx     # AI 新闻跑马灯
│   │   ├── CustomBackgroundModal.tsx  # 自定义背景
│   │   ├── DataBackupModal.tsx # 数据备份 / 恢复
│   │   └── ...                 # 20+ 个功能组件
│   ├── data/                   # 分类与卡片数据（数千条资源）
│   ├── utils/                  # 点击统计、热词等工具
│   └── types.ts                # 类型定义
├── server.ts                   # Express 服务端（AI 新闻接口）
├── index.html                  # 页面入口
├── version.json                # Android 更新清单
├── vite.config.ts              # Vite 配置
└── *.apk                       # Android 安装包
🔌 API 接口
GET /api/news/tech
实时科技与 AI 新闻头条接口。

字段	说明
success	是否成功
headlines[]	新闻列表（title / tag / source / query）
source	数据来源：google_search（Gemini 联网检索）/ curated（精选兜底）/ cache（10 分钟缓存）
响应示例

json
{
  "success": true,
  "headlines": [
    {
      "title": "全球开源大模型迎来突破，长上下文与推理性能大幅跃升",
      "tag": "开源创新",
      "source": "科技前沿",
      "query": "开源大模型"
    }
  ],
  "source": "google_search"
}
📲 Android 发布与更新检测
App 内置「检查更新」功能，读取仓库根目录 version.json 清单（多源容错：gh-proxy / ghproxy.net / GitHub API / raw 直连）。

发布新版本三步走
同步版本号：AndroidManifest.xml 与 build.sh 中的 versionCode / versionName 同步 +1（必须一致）
上传新包：以英文名上传 APK（如 chenshuting-v1.4.0.apk）
更新清单：修改 version.json 的 versionCode / versionName / changelog / apkUrl
json
{
  "versionCode": 16,
  "versionName": "1.3.9",
  "changelog": "更新内容:\n· 全部弹窗叠加「金龙绕边框」动态特效...",
  "apkUrl": "https://cdn.jsdelivr.net/gh/shuting52/chenshuting2026@main/chenshuting-v1.3.9.apk"
}
同签名（chenshuting-release.jks）新包可直接覆盖安装，无需卸载。

🧾 更新日志
v1.4.0 · 最新
📱 版本持续迭代，性能与体验优化（仓库内已含 1.4.0 安装包）
v1.3.9
🐉 全部弹窗叠加「金龙绕边框」动态特效：纯代码绘制金龙沿金框匀速环绕，含龙身摆动、鳞片、龙头龙须与流光拖尾
🍂 首页新增二十四节气小标题：按当前节气自动加载粒子动效（立春花瓣 / 清明细雨 / 白露露珠 / 立冬雪花 / 流萤光点）
🔍 搜索框升级关键词联想：输入即列出站内匹配资源标题，空输入展示热门联想词
📍 IP 实时监控展示文案净化：只保留地域与运营商信息
🧩 Skill 社区上新 6 个技能（动态海报 / 动物播客 / 多风格摄影 / 复刻图片反推 / 分镜板 / 真人 IP 封面），共 23 个
v1.3.0 ~ v1.3.8
持续打磨搜索、收藏、自定义背景、数据备份等核心体验
🛠️ 常见问题
Q：新闻区域没有内容？ A：若未配置 GEMINI_API_KEY，会展示内置精选科技快讯，属正常现象；配置 Key 后自动升级为实时联网检索。

Q：如何修改/新增导航卡片？ A：直接编辑 src/data/ 下的分类数据文件；也可在 Web 端通过「自定义卡片」功能添加，个人数据保存在浏览器本地。

Q：私有仓库时 App 检测不到更新？ A：更新清单通过 GitHub 公开接口读取，请将仓库设为 Public，否则 App 会静默跳过更新检测。

📄 License
本项目仅供个人学习与收藏使用，资源链接版权归原站点所有。

<div align="center">
⭐ 如果这个导航对你有帮助，欢迎 Star 支持！

Made with ❤️ by shuting52

</div>
