<p align="center">
  <img src="screenshots/home.jpg" alt="2026 World Cup Analyzer" width="800">
</p>

<h1 align="center">⚽ 2026 FIFA World Cup · Group Stage Analyzer</h1>

<p align="center">
  <b>纯浏览器端计算 · 零依赖 · 离线可用 · 开源免费</b>
</p>

> <br>
> **「十二组争锋，八席待定；绿茵之外，数学亦有答案。」**<br>
> <br>
> 2026年，FIFA世界杯史上首次迎来48支劲旅。全新的赛制之下，<br>
> 12个小组的第三名将展开一场无声的跨组较量——仅8支球队能够突围。<br>
> 一支球队的命运，从此不再只由自己书写，更系于其他赛场的风云变幻。<br>
> <br>
> 传统的直觉与分析已不足以解答这前所未有的复杂性。<br>
> 于是，我们选择用数学的力量——穷举每一种可能的未来，<br>
> 计算出每一个概率背后，那条通往晋级的隐秘路径。<br>
> <br>
> *—— 一个热爱足球、痴迷计算的灵魂，献给这届独一无二的世界杯。* ⚽</p>
</p>

<p align="center">
  <a href="https://yzfootball.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel"></a>
  <a href="https://gitee.com/10831-max/worldcup-oracle"><img src="https://img.shields.io/badge/Mirror-Gitee-C71D23?style=for-the-badge&logo=gitee" alt="Gitee"></a>
  <a href="https://github.com/10831-max/worldcup-oracle/blob/main/LICENSE"><img src="https://img.shields.io/github/license/10831-max/worldcup-oracle?style=for-the-badge" alt="License"></a>
  <a href="https://github.com/10831-max/worldcup-oracle/stargazers"><img src="https://img.shields.io/github/stars/10831-max/worldcup-oracle?style=for-the-badge" alt="Stars"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Pure-JavaScript-F7DF1E?logo=javascript" alt="JS">
  <img src="https://img.shields.io/badge/Dependencies-Zero-brightgreen" alt="Zero Deps">
  <img src="https://img.shields.io/badge/Offline-Ready-blue" alt="Offline">
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/Made_with-❤️-red" alt="Made with love">
</p>

<p align="center">
  <a href="https://yzfootball.vercel.app"><b>🌐 Live Demo</b></a> ·
  <a href="#-features"><b>✨ Features</b></a> ·
  <a href="#-quick-start"><b>🚀 Quick Start</b></a> ·
  <a href="#-architecture"><b>🧠 Architecture</b></a> ·
  <a href="#-contributing"><b>🤝 Contributing</b></a>
</p>

---

## 📸 界面预览

| 🇲🇽 A组积分榜 | 🇦🇷 J组积分榜 |
|:---:|:---:|
| ![A组](screenshots/home.jpg) | ![J组](screenshots/home-j.jpg) |

| 🇦🇷 阿根廷详情页 | 🇦🇷 阿根廷出线路径 |
|:---:|:---:|
| ![阿根廷](screenshots/team.jpg) | ![路径](screenshots/paths.jpg) |

| 🇧🇷 巴西出线路径（复杂情况） |
|:---:|
| ![巴西](screenshots/paths-brazil.jpg) |

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

## 🛠️ 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | Vanilla JavaScript (ES6+) | 零框架、零依赖 |
| 样式 | CSS3 + CSS Grid + Flexbox | 暗金主题，响应式三断点 |
| 数据 | JSON + localStorage | 内嵌数据为主，localStorage 持久化 |
| 部署 | Vercel + Gitee Pages | 双平台，国内外皆可访问 |
| 计算 | 加权穷举引擎 + 蒙特卡洛采样 | ≤4场完整穷举，≥5场 100k 采样 |
| API | worldcup26.ir + ESPN | 已移除自动拉取，改为手动更新模式 |

## 🧗 开发历程与挑战

### 起源
作为一个痴迷足球和数学的开发者，2026世界杯扩军至48队的新赛制深深吸引了我。12个小组第三名争夺8个席位——这种前所未有的复杂性，传统的直觉判断已无法胜任。唯有代码，唯有穷举，才能给出真正的答案。

### 挑战一：等概率模型的谬误
**问题：** 最初的穷举引擎假设所有未赛比分等概率发生——西班牙4:0佛得角与佛得角4:0西班牙的概率相同。这导致西班牙和沙特的出线概率几乎一样，完全不符合现实。

**解决：** 引入基于 FIFA 排名的加权概率模型。将排名转化为强度值，使用 `ratio^1.8`指数级加权调整进球概率分布。强队的进球概率曲线向右偏移，弱队向左偏移。修复后西班牙对沙特的胜率从33%提升至64%，概率计算符合足球常识。

### 挑战二：跨组第三名的复杂性
**问题：** 12个小组第三名PK，不能简单地看积分。需要具体到「某队赢某队」「某队输某球」的条件。

**解决：** 对全部12组同时进行蒙特卡洛模拟，追踪每个场景下第三名的积分分布。针对目标球队，枚举其所在组的所有可能，同时分析其他11组的第三名候选人——精确到某队剩余比赛的具体胜平负条件。

### 挑战三：线上部署的数据污染
**问题：** 本地测试完美，部署到 Vercel 后积分全部错乱。排查发现两个根因：① API自动拉取的数据对阵与内嵌赛程不完全匹配；② localStorage 缓存的旧版本比分与新赛程ID冲突。

**解决：** 彻底移除API自动拉取，改为纯手动更新模式（保证数据100%可控）。将 localStorage key 从 v2 升级到 v3，旧缓存自动失效。此后积分计算始终正确。

### 挑战四：纯前端的性能极限
**问题：** 全6场未赛时，25^6≈2.4亿种比分组合，浏览器根本无法完成。

**解决：** 采用混合策略——剩余≤4场时完整穷举（即时），5场时穷举约970万（~5ms），6场时切换蒙特卡洛采样10万次（~50ms，误差<±1.5%）。配合惰性计算，仅计算用户当前查看的小组。

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

## 🚀 One-Click Deploy

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/10831-max/worldcup-oracle">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" height="40">
  </a>
  &nbsp;&nbsp;
  <a href="https://app.netlify.com/start/deploy?repository=https://github.com/10831-max/worldcup-oracle">
    <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" height="40">
  </a>
</p>

---

## ⭐ Star History

<p align="center">
  <a href="https://star-history.com/#10831-max/worldcup-oracle&Date">
    <img src="https://api.star-history.com/svg?repos=10831-max/worldcup-oracle&type=Date" alt="Star History Chart" width="600">
  </a>
</p>

如果你喜欢这个项目，请给一个 ⭐ Star！这是对开源作者最大的鼓励。

---

<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/10831-max"><b>_YinZhuo</b></a></sub>
  <br>
  <sub>2026 FIFA World Cup Group Stage Analyzer · MIT License</sub>
</p>
