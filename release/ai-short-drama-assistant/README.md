# AI Short Drama Assistant

AI Short Drama Assistant is a six-module AI assistant for short-drama creators built for Obsidian. It covers topic scoring, project check, single-episode writing pipeline, policy red-line check, 46-item quality checklist, de-AI rewriting, submission formatting, and short-drama-to-novel conversion. All rules are embedded locally and work offline. Rules are sourced from the AI Short Drama Creation System (six-track topic engine, 4-dimension scoring v4.8, project workflow v3.22, 8 policy red lines, 46-item problem template library, dialogue de-AI rules and submission conversion rules).

## 中文简介

短剧创作者工具插件 —— 六模块全覆盖，规则源自「AI短剧创作系统」核心资产（六大赛道选题引擎、四维评分 v4.8、立项工作流 v3.22、8 类政策红线、46 项问题模板库、台词去AI化与投稿转换规则）。

## 功能（9 个命令 + 1 个侧栏图标，对齐豆包 Skill v1.1 六模块）

| 模块 | 命令 | 作用 | 对应系统能力 |
|---|---|---|---|
| ① 选题 | 四维评分面板 | 输入候选，按 合规0.2+降本0.2+视觉0.2+新颖度0.4 出综合分与评级（A/B/C/D/淘汰） | 优先级计算公式 v4.8 |
| ① 选题 | 生成选题灵感卡 | 按六大赛道生成 5 张选题草稿卡 + P0 门禁 6 项必检 | 六大赛道引擎 + P0 门禁 |
| ② 立项 | **立项检查**（新增 v0.2） | 输出立项门禁结论（无 A+B 融合、无红线命中）+ 交付物清单 01~19 | 立项工作流 v3.22 |
| ③ 写作 | **单集写作流水线**（新增 v0.2） | 写前承诺 7 项 → 分集大纲 → 初稿 → 终稿 + 硬规则自查 | 单集写作流水线 |
| ④ 质检 | 政策红线快检（对当前笔记） | 扫描笔记文本，命中 8 类红线即标红，附推荐方向与 AI 标识 4 条规则 | 政策风险清单 |
| ④ 质检 | 生成单集质检清单（对当前笔记） | 在当前笔记基础上生成 46 项问题模板自查清单（PT-001~046） | 问题模板库 |
| ⑤ 改写 | **去AI味改写**（新增 v0.2） | 原文 → 改后对照 + 依据 PT 编号说明（5 项模式 + 套话词扫描） | 台词去AI化规则 |
| ⑥ 投稿 | **转投稿格式**（新增 v0.2） | 格式门禁 6 项 + 字数门禁（600—1500 字）+ 可投稿判定 | 投稿格式转换规则 |
| ⑥ 投稿 | **转成小说检查**（新增 v0.2） | 转小说 6 项检查要点 + 小说质检提示 | 短剧转小说规则 |
| — | 侧栏魔法棒图标 | 快速打开四维评分面板 | — |

生成结果统一写入库内「AI短剧创作助手」文件夹。

## 安装（本地开发版）

1. 打开 Obsidian → 设置 → 第三方插件 → 关闭「安全模式」（或开启开发者模式）。
2. 将本目录复制到你的 Vault 下：`<Vault>/.obsidian/plugins/ai-short-drama-assistant/`。
3. 重启 Obsidian，在「已安装插件」中启用「AI短剧创作助手」。

## 开发者

```bash
npm install
npm run build   # 产出 main.js（esbuild production）
node selftest.js  # 核心逻辑自检（评分/红线/质检/选题/立项/写作/改写/投稿 18 项）
```

## 作者

- GitHub：https://github.com/zeng198708
- AI短剧创作系统：选题 → 立项 → 写作 → 质检 → 改写 → 投稿六模块全流程工具，插件为系统的 Obsidian 入口；系统授权合作与 API 服务见作者主页。

## 数据口径（诚实声明）

- 本插件为**规则内嵌版**：评分公式、红线清单、46 项模板要点、立项门禁、写作承诺、去AI味规则、投稿门禁以代码常量内置，可离线运行。
- 完整机检逻辑（qc_auto.js、灵感引擎.js、已推选题数据库 1,127 行）仍在系统内部，插件定位为**引流入口 + 自助工具**，非系统完整替代。
- 选题卡为模板化草稿，须按 P0 门禁人工核验后立项。

## Roadmap（对齐《多平台工具端插件入口对接方案》）

- v0.2（当前）：六模块补齐（立项/写作/改写/投稿），18 项自检通过，对齐豆包 Skill v1.1 六模块基准。
- v1.0：社区库发布（需 GitHub 仓库 + Obsidian 社区站点面板审核）。
- API 化：插件数据上报接口（后续收费内核，见融资计划书第 6 章与产品定价方案）。
