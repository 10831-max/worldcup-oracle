<p align="center">
  <img src="screenshots/banner.png" alt="2026 World Cup Analyzer" width="800">
</p>

<h1 align="center">⚽ 2026 FIFA World Cup · Group Stage Analyzer</h1>

<p align="center">
  <b>纯浏览器端计算 · 零依赖 · 离线可用 · 开源免费</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Pure-JavaScript-F7DF1E?logo=javascript&style=for-the-badge" alt="JavaScript">
  <img src="https://img.shields.io/badge/Dependencies-Zero-brightgreen?style=for-the-badge" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/Offline-Ready-blue?style=for-the-badge" alt="Offline">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License">
  <img src="https://img.shields.io/github/stars/你的用户名/yz_football?style=for-the-badge" alt="Stars">
</p>

<p align="center">
  <a href="https://yzfootball.vercel.app"><b>🌐 在线体验</b></a> ·
  <a href="#-features"><b>✨ 功能</b></a> ·
  <a href="#-quick-start"><b>🚀 快速开始</b></a> ·
  <a href="#-architecture"><b>🧠 架构</b></a> ·
  <a href="#-contributing"><b>🤝 贡献</b></a>
</p>

---

## 📸 界面预览

| 首页 - 积分榜 | 球队详情页 |
|:---:|:---:|
| ![首页](screenshots/home.png) | ![球队页](screenshots/team.png) |

| 比分编辑 | 出线路径分析 |
|:---:|:---:|
| ![比分](screenshots/score.png) | ![路径](screenshots/paths.png) |

---

## ✨ Features

### 🎯 核心功能

| 功能 | 说明 |
|------|------|
| 📊 **实时积分榜** | 12组48队完整数据，场次/胜/平/负/进球/失球/净胜球/积分，完全符合FIFA规则 |
| 🔮 **智能出线预测** | 基于FIFA排名的加权穷举引擎 + 蒙特卡洛采样，精准计算出线概率 |
| 🔍 **球队详情页** | 点击任意球队进入专属页面：档案、历史、核心球员、世界杯趣梗 |
| 🌍 **跨组分析** | 12组第三名实时PK，精确定位"某队需输给某队N球"的具体条件 |
| 📡 **实时比分API** | 自动拉取最新赛果，5分钟智能刷新，离线降级保证始终可用 |
| 🎨 **颜色状态系统** | 🥇锁定头名 / ✅锁定出线 / 🟢稳 / 🟡有戏 / ⚫悬 / 💀出局 |
| 😂 **世界杯趣梗** | 48条专属足球梗，凯恩叔叔的亚军魔咒、维尼修斯的"小熊"、魔人布欧… |
| 💾 **数据持久化** | localStorage + JSON导入导出，刷新不丢失 |
| 📱 **响应式设计** | 320px~1920px全适配，手机/平板/桌面完美体验 |

### ⌨️ 快捷键

| 键 | 功能 | 键 | 功能 |
|---|------|---|------|
| `←` `→` | 切换小组 | `Esc` | 关闭弹窗 |
| `A` - `L` | 跳转到对应小组 | `R` | 刷新计算 |

---

## 🚀 Quick Start

### 方式一：在线访问（推荐）
直接打开 **[https://yzfootball.vercel.app](https://yzfootball.vercel.app)** ，无需安装任何东西。

### 方式二：本地运行
```bash
# 克隆仓库
git clone https://github.com/你的用户名/yz_football.git

# 双击 index.html 即可
# 或使用任意 HTTP 服务器
npx serve .
```

### 方式三：自行部署
```bash
# Vercel (推荐)
npx vercel --prod

# GitHub Pages
# Settings → Pages → 选择 main 分支 → Save
```

---

## 🧠 Architecture

### 数据流

```
用户输入比分 → 穷举引擎启动
  ├── 已完赛场次：使用实际比分
  ├── 未完赛场次：加权穷举 或 蒙特卡洛采样
  │    └── 基于FIFA排名加权进球概率分布
  ├── FIFA规则排名 → 统计出线场景数
  └── 12组第三名跨组比较 → 概率输出 → 颜色映射 → 更新界面
```

### 加权概率模型 (v2.0 核心)

传统穷举假设所有比分等概率（西班牙4:0佛得角 = 佛得角4:0西班牙），v2.0 引入**基于FIFA排名的指数加权模型**：

- 排名→强度值→进球概率分布偏移
- 使用 `ratio^1.8` 指数级加权
- 强队进球分布偏向高值，弱队偏向低值

| 场景 | 旧模型 | 新模型 |
|------|:---:|:---:|
| 🇪🇸 西班牙 vs 🇸🇦 沙特 | 33% | 64% |
| 🇪🇸 西班牙 vs 🇺🇾 乌拉圭 | 33% | 39% |
| 🇸🇦 沙特 vs 🇨🇻 佛得角 | 33% | 57% |
| 🇺🇾 乌拉圭 vs 🇨🇻 佛得角 | 33% | 78% |

### 穷举策略

| 剩余场次 | 方法 | 场景数 | 耗时 |
|----------|------|--------|------|
| 0-1 | 直接计算 | 1 | 瞬时 |
| 2-4 | 加权完整穷举 | 625~390,625 | <5ms |
| 5 | 完整穷举 | ~9.7M | ~5ms |
| 6 | 蒙特卡洛采样 | 100,000 | ~50ms |

---

## 📁 Project Structure

```
yz_football/
├── index.html              ← SPA主页面 + 球队详情页
├── css/
│   └── style.css           ← 世界杯暗金主题 (~1200行)
├── js/
│   ├── data.js             ← 48队档案 + 72场赛程 + 趣梗 + 完整球队介绍
│   ├── engine.js           ← 加权概率引擎 + 出线路径 + 跨组条件分析
│   ├── api.js              ← 实时比分API客户端 + 缓存 + 降级
│   ├── rules.js            ← FIFA官方排名规则（7级Tie-breaking）
│   ├── colorSystem.js      ← 概率→颜色映射系统
│   ├── renderer.js         ← 全部DOM渲染 + 球队页 + Hero
│   └── main.js             ← 主控制器 + API集成 + Hash路由
├── data/                   ← JSON数据文件（服务器部署用）
├── img/teams/              ← 球队Hero图片（48张 .jpg）
├── screenshots/            ← 界面截图
├── docs/                   ← 说明文档
├── LICENSE                 ← MIT 开源协议
├── CONTRIBUTING.md         ← 贡献指南
└── README.md               ← 本文件
```

---

## 🤝 Contributing

欢迎贡献！详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

### 如何贡献
- 🐛 报告Bug → [Issue Template](.github/ISSUE_TEMPLATE/bug_report.md)
- 💡 功能建议 → [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)
- 🔧 提交代码 → Fork → PR
- 📸 球队照片 → 放到 `img/teams/` 文件夹

### 如何添加球队照片
```
img/teams/ARG.jpg  ← 阿根廷
img/teams/BRA.jpg  ← 巴西
img/teams/ESP.jpg  ← 西班牙
...共48个，命名规则：3字母球队ID.jpg
```

---

## 📝 Changelog

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v2.1 | 2026-06-21 | GitHub社区文档完善 + 界面视觉优化 |
| v2.0 | 2026-06-20 | 加权概率模型 + API实时比分 + 球队详情页 + 趣梗系统 |
| v1.0 | 2026-06-19 | 基础穷举引擎 + 积分榜 + 颜色系统 |

---

## ⭐ Star History

如果你喜欢这个项目，请给一个 ⭐ Star！这是对开源作者最大的鼓励。

---

<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/你的用户名"><b>_YinZhuo</b></a></sub>
  <br>
  <sub>2026 FIFA World Cup Group Stage Analyzer · MIT License</sub>
</p>
