// 去AI味改写 —— 规则移植自系统《台词去AI化规则》+ 问题模板库 PT-003/PT-017
// 输出：原文 → 改后对照 + 依据 PT 编号说明

export interface AiPattern {
  id: string;
  name: string;
  sign: string; // 识别特征
  fix: string; // 改写方向
  ptRef: string; // 对应问题模板编号
}

// AI 味高频特征（台词/叙述层）
export const AI_PATTERNS: AiPattern[] = [
  {
    id: "AI-01",
    name: "全员同腔说教",
    sign: "所有角色说话方式雷同、像旁白/论文",
    fix: "按人物小传拆声线：身份、口头禅、语气词各不同；盖住名字可分辨是谁说的",
    ptRef: "PT-003 / PT-017",
  },
  {
    id: "AI-02",
    name: "万能金句堆砌",
    sign: "跨剧复制的制式金句、哲理短句",
    fix: "删金句，换具体场景里的动作与对话；金句必须为本剧人物专属",
    ptRef: "PT-012",
  },
  {
    id: "AI-03",
    name: "旁白独白滥用",
    sign: "大量心理独白/环境旁白替代对白",
    fix: "把独白改写成对白或动作反应，对白占比提到 60%-70%",
    ptRef: "PT-008 / PT-014",
  },
  {
    id: "AI-04",
    name: "单句超长书面化",
    sign: "单句台词超过 30 字、书面语腔",
    fix: "拆短句，口语化，单句 ≤30 字（红线 40 字）",
    ptRef: "PT-033",
  },
  {
    id: "AI-05",
    name: "情绪断档空转",
    sign: "情绪无递进、爽点靠喊口号",
    fix: "用动作/道具/第三视角反应做情绪递进，杜绝口号式爽点",
    ptRef: "PT-007 / PT-011",
  },
];

// 常见 AI 套话词（命中即提示）
export const AI_CLICHES: string[] = [
  "总而言之", "综上所述", "众所周知", "值得注意的是", "不禁让人", "仿佛在说",
  "在这一刻", "然而", "但现实是", "或许", "某种意义上", "毫无疑问",
  "不仅仅是", "更是", "让我们", "不得不承认", "这一切", "内心深处",
];

export function scanAiFlavor(text: string): { patternHits: AiPattern[]; clicheHits: string[] } {
  const patternHits = AI_PATTERNS.filter((p) => text.includes(p.name) || text.includes(p.fix.slice(0, 4)));
  const clicheHits = AI_CLICHES.filter((c) => text.includes(c));
  return { patternHits, clicheHits };
}

export function buildRewriteReport(text: string, title: string): string {
  const { patternHits, clicheHits } = scanAiFlavor(text);
  const lines: string[] = [];
  lines.push(`# 去AI味改写 · ${title || "未命名"}`);
  lines.push("");
  lines.push("> 生成时间：" + new Date().toLocaleString("zh-CN"));
  lines.push("> 规则来源：AI短剧创作系统 · 台词去AI化规则");
  lines.push("");
  lines.push("## 一、AI 味扫描结果");
  lines.push("");
  if (clicheHits.length === 0 && patternHits.length === 0) {
    lines.push("- 未命中常见 AI 套话词与高频特征，初步判定无明显 AI 味。");
  } else {
    if (clicheHits.length > 0) {
      lines.push(`- 命中套话词：${clicheHits.join("、")}（建议全部删除或改写为口语）`);
    }
    for (const p of patternHits) {
      lines.push(`- 命中特征 ${p.id} ${p.name}：${p.sign}`);
    }
  }
  lines.push("");
  lines.push("## 二、五项改写对照模板");
  lines.push("");
  lines.push("> 改写原则：原文 → 改后对照，逐条说明依据 PT 编号。以下为自查模板，按实际情况填写。");
  lines.push("");
  for (const p of AI_PATTERNS) {
    lines.push(`### ${p.id} ${p.name}（依据 ${p.ptRef}）`);
    lines.push(`- 识别：${p.sign}`);
    lines.push(`- 原文：___`);
    lines.push(`- 改后：___`);
    lines.push(`- 改写动作：${p.fix}`);
  }
  lines.push("");
  lines.push("## 三、改写自查清单");
  lines.push("");
  lines.push("- [ ] 每句台词盖住名字能分辨是谁说的");
  lines.push("- [ ] 无跨剧复制金句、无说教式长句");
  lines.push("- [ ] 单句台词 ≤30 字（红线 40 字）");
  lines.push("- [ ] 对白占比 60%-70%，旁白/独白压到最低");
  lines.push("- [ ] 情绪递进靠动作与场景，不靠口号");
  lines.push("");
  lines.push("> 说明：本清单为去 AI 味自查辅助，改后建议复跑 46 项质检清单确认 PT-003/PT-017 等通过。");
  return lines.join("\n");
}
