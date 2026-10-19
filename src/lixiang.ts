// 立项检查 —— 规则移植自系统《立项工作流 v3.22》
// 输出：立项门禁结论（无 A+B 融合、无红线命中、单集类型纯）+ 交付物清单 01~19

export interface LaunchGate {
  id: string;
  name: string;
  check: string; // 一句话检查要点
  pass: boolean; // 由输入的当前笔记文本自动判定的初步结论（文本缺失即视为未过，待人工核验）
}

// 立项门禁（对外精简版，P0 级）
// negate=true：keys 命中即违规（出现即驳回）；negate=false：keys 命中即达标（缺位即未过）
export const LAUNCH_GATES: { name: string; check: string; keys: string[]; negate: boolean }[] = [
  { name: "禁止 A+B 融合", check: "单一纯类型，禁止「科幻+情感」式融合", keys: ["+", "＋", "融合", "混合"], negate: true },
  { name: "无政策红线命中", check: "8 类内容红线 P0 必检，命中即驳回", keys: ["儿童", "擦边", "炫富", "强制爱", "迷信", "私刑", "霸总", "抄袭"], negate: true },
  { name: "明确剧名标题", check: "剧名式标题，不写概念串", keys: ["《"], negate: false },
  { name: "核心剧情主线", check: "第 1 集钩子 + 主线类型（P0 强制）", keys: ["钩子", "主线"], negate: false },
  { name: "主赛道明确", check: "选题归属六大赛道之一", keys: ["今日", "预测", "改编", "想象力", "生活", "赛道"], negate: false },
  { name: "交付物齐套", check: "18 项交付物齐套（01~19 中核心项）", keys: ["立项书", "大纲", "人设", "分集", "卖点"], negate: false },
];

// 立项交付物清单 01~19（精简自系统 18 项交付物，面向插件自查版）
export const LAUNCH_DELIVERABLES: string[] = [
  "01 立项书（一句话卖点 + 目标平台 + 题材赛道）",
  "02 选题定位卡（四维评分结果 + 平台定向）",
  "03 类型与赛道声明（单一纯类型）",
  "04 剧情主线大纲（第 1 集钩子 + 全剧主线）",
  "05 分集大纲（全剧逐集要点）",
  "06 人物小传（主角 + 主要配角，含记忆点）",
  "07 人物关系图（核心关系 + 冲突线）",
  "08 场景手册（核心场景 + 统一命名）",
  "09 金句库（备选金句登记）",
  "10 伏笔账本（埋设位置 + 回收计划）",
  "11 付费卡点设计（第 9-12 集钩子位）",
  "12 政策红线自查回执（8 类必检通过）",
  "13 世界观设定（现实题材则为职业/行业设定）",
  "14 制作形态声明（AI 漫剧 / 真人 / 均可）",
  "15 集尾信息区块模板（情绪/爽点/钩子）",
  "16 单集样章（第 1 集初稿）",
  "17 投稿定位三方一致校验（立项书/大纲/投稿版）",
  "18 立项自动质检回执（机检 PASS 全绿）",
  "19 立项交付物齐套清单（本清单自检）",
];

export function checkLaunch(text: string): LaunchGate[] {
  return LAUNCH_GATES.map((g) => {
    const hit = g.keys.some((k) => text.includes(k));
    // negate=true：出现违规词 → 未过；negate=false：出现达标词 → 过
    const pass = g.negate ? !hit : hit;
    return { id: g.name, name: g.name, check: g.check, pass };
  });
}

export function buildLaunchReport(text: string, title: string): string {
  const gates = checkLaunch(text);
  const lines: string[] = [];
  lines.push(`# 立项检查 · ${title || "未命名"}`);
  lines.push("");
  lines.push("> 生成时间：" + new Date().toLocaleString("zh-CN"));
  lines.push("> 规则来源：AI短剧创作系统 · 立项工作流 v3.22");
  lines.push("");
  lines.push("## 一、立项门禁结论");
  lines.push("");
  for (const g of gates) {
    lines.push(`- [${g.pass ? "x" : " "}] ${g.name}：${g.check}`);
  }
  lines.push("");
  lines.push("## 二、交付物清单 01~19");
  lines.push("");
  for (const d of LAUNCH_DELIVERABLES) {
    lines.push(`- [ ] ${d}`);
  }
  lines.push("");
  lines.push("> 说明：以上门禁判定基于当前笔记文本自动初判，交付物齐套须逐项人工核验后在清单勾选。");
  lines.push("> 结论口径：任一红线命中或 A+B 融合即驳回立项；交付物未齐套不得进入写作。");
  return lines.join("\n");
}
