# 生命力 × 自由度 · Vitality × Freedom

Vitality-Driven Freedom System — 一个可导航的世界模型（V0.2 Living World · 公开冻结版）。

> 用有限生命力，通过高效率架构，持续创造更高质量的未来自由。
> This is not a dashboard. This is a navigable world model.

## 具身化语义（V0.1.1）

- Vitality = **Flow**：流速、粒子密度、光强、生长活动、河道连续性（连续插值，无 50% 硬切换）
- Freedom = **Reachable Paths**：路径数量、分叉程度、地平线开放度、远景目的地与连接
- Architecture = **Channel Structure**：η_A 直接改变世界——低效时能量逸散、绕路、拥堵；高效时汇入清晰通道
- Φ = **Emergent State**：Latent → Compressed → Expanding → Generative → Compounding（状态词，主界面不显示分数）

验收模式（隐藏全部文字，只留世界与坐标轴）：`/?enter=1&debug=visual`

## V0.2 Living World

- **Generative Soundscape**：Sound = S(V, F, η_A)，Web Audio 实时生成（风/低频 drone/脉冲/远钟/回声空间），默认 Off，点击开启；η 控制一致性（错拍、绕路、能量泄漏 vs 归位、回应、结构），模块深度自适应（世界 100% → 架构 80% → 案例 45–60% → 诊断 35%）
- **State Trajectory**：会话内最多 5 个状态节点（Past/Transition/Now/Future），节点叠加在 V×F 状态空间上（η 以节点完整度表达）；点击节点世界恢复记忆；Play Trajectory 让视觉/声音/Φ 同步经历一次状态演化；Diagnosis 可加入轨迹；+V/+F/+η 反事实探索（非预测）
- **Public Release**：OG/Twitter 元数据、程序生成分享图（public/og.png）、apple-touch-icon、Methodology 免责声明、案例方法论标注

## 部署

线上地址：https://dongsust.github.io/vitality-freedom/ （GitHub Pages，push 到 main 自动构建部署；canonical / og:image 已配置为绝对地址）。

## 运行

    npm install
    npm run dev      # 本地开发（Vite）
    npm run build    # 生产构建（tsc 类型检查 + Rollup 打包）
    npm run preview  # 预览 dist/（纯 Node 静态服务器）
    npm run smoke    # jsdom 运行时冒烟测试（38 项交互检查）

## 体验路径（Step 1 → 10）

进入世界 → 操纵 V×F 象限 → 点击中央 Φ（Effective Potential）→ Architecture 展开 →
三层生成框架（Meta → Structure → Market）→ 药明康德案例 → 对照保利发展 →
法无自性（Conditional Geometry）→ Where Am I Now? 自我诊断 → 应用回象限世界。

## 深链接

- `/?enter=1` 跳过首页直接进入世界
- `/?view=architecture | layers | structural | atlas | case | compare | conditional | diagnosis | about`
- `/?view=case&case=wuxi` 打开指定案例

## 部署

静态站点：`vite.config.ts` 与构建产物均使用相对路径，可直接部署到 GitHub Pages 或任意静态托管。
`.github/workflows/deploy.yml` 提供 Pages 自动部署（push 到 main 即发布）。

## 技术

- React 18 + TypeScript（strict）+ 纯 CSS 设计令牌
- SVG 地形/星图/结构图 + SMIL 光流 + 极轻量 Canvas 星野（全部支持 prefers-reduced-motion）
- 生产构建使用 Rollup（进程内、无原生依赖）；开发使用 Vite
- 数据全部为本地 TypeScript 对象，与 UI 解耦（src/data/）
- 无后端、无数据库、无外部字体、无行情 API

## 免责声明

本网站为概念性自我反思工具，不构成投资建议或心理测评。
