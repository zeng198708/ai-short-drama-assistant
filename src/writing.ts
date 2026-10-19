// 单集写作 —— 规则移植自系统《单集写作流水线》
// 输出：写前承诺 7 项 → 分集大纲 → 初稿 → 终稿 的流水线模板 + 硬规则自查清单

// 写前承诺 7 项（对外精简版）
export const WRITING_PROMISES: { id: string; name: string; check: string }[] = [
  { id: "W-01", name: "本集钩子明确", check: "开篇 300 字内强冲突落地，黄金 3 秒有钩子" },
  { id: "W-02", name: "情绪曲线连续", check: "本集情绪节拍承接上集，集尾留新钩子" },
  { id: "W-03", name: "对白占比达标", check: "对白占比 60%-70%，避免广播剧化旁白" },
  { id: "W-04", name: "台词单句不超长", check: "单句台词 ≤30 字（红线 40 字），适配 AI 对口型" },
  { id: "W-05", name: "伏笔登记回收", check: "新增伏笔入账本，已有伏笔按计划回收" },
  { id: "W-06", name: "集尾信息区块齐全", check: "集尾含情绪/爽点/钩子三核心字段" },
  { id: "W-07", name: "大纲终稿一致", check: "分集大纲与本集终稿无信息差" },
];

// 单集写作流水线四步
export const WRITING_FLOW: { step: string; action: string; output: string }[] = [
  { step: "第 1 步", action: "承接分集大纲与本集要点", output: "本集写作要点清单（钩子/情绪/爽点）" },
  { step: "第 2 步", action: "撰写初稿（对白驱动）", output: "初稿（场景+对白+动作提示）" },
  { step: "第 3 步", action: "单集硬规则自查（7 项承诺逐项过）", output: "自查记录（未过项标注修改）" },
  { step: "第 4 步", action: "产出终稿与投稿版", output: "终稿 / 投稿版（格式/字数门禁前置）" },
];

// 硬规则自查清单（写作期高频缺陷，对应问题模板库编号）
export const WRITING_HARD_RULES: { id: string; name: string; check: string }[] = [
  { id: "PT-003", name: "台词 AI 味说教", check: "无 AI 味、全员同腔、说教感" },
  { id: "PT-004", name: "单集无钩子注水", check: "每集有明确钩子，无注水段落" },
  { id: "PT-006", name: "逻辑降智反派无动机", check: "反派动机与剧情逻辑自洽" },
  { id: "PT-014", name: "对白占比不达标", check: "对白占比 60%-70%" },
  { id: "PT-033", name: "台词单句超长", check: "单句 ≤30 字（红线 40 字）" },
  { id: "PT-034", name: "集尾信息区块降级", check: "情绪/爽点/钩子三核心齐全" },
  { id: "PT-021", name: "集间承接断裂", check: "上集钩子被本集接住" },
  { id: "PT-028", name: "金手指 OS 呈现断线", check: "金手指视觉化呈现，非内心独白" },
];

export function buildWritingTemplate(title: string): string {
  const lines: string[] = [];
  lines.push(`# 单集写作流水线 · ${title || "未命名"}`);
  lines.push("");
  lines.push("> 生成时间：" + new Date().toLocaleString("zh-CN"));
  lines.push("> 规则来源：AI短剧创作系统 · 单集写作流水线");
  lines.push("");
  lines.push("## 一、写前承诺 7 项（本集开工前逐项确认）");
  lines.push("");
  for (const p of WRITING_PROMISES) {
    lines.push(`- [ ] ${p.id} ${p.name}：${p.check}`);
  }
  lines.push("");
  lines.push("## 二、写作流水线四步");
  lines.push("");
  for (const f of WRITING_FLOW) {
    lines.push(`### ${f.step}：${f.action}`);
    lines.push(`- 输出：${f.output}`);
  }
  lines.push("");
  lines.push("## 三、硬规则自查（写作期逐项过）");
  lines.push("");
  for (const r of WRITING_HARD_RULES) {
    lines.push(`- [ ] ${r.id} ${r.name}：${r.check}`);
  }
  lines.push("");
  lines.push("> 说明：本模板为写作流程辅助，初稿完成后建议再跑 46 项质检清单与红线快检。");
  return lines.join("\n");
}
