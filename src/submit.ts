// 投稿与小说转换 —— 规则移植自系统《投稿与小说转换规则》（convert_to_submit.js / qc_novel.js / format_check.js / 字数检查_强制门禁）
// 输出：格式门禁结论 + 字数门禁结论 + 可投稿判定 + 转小说检查要点

// 短剧投稿格式门禁（对外精简版）
export const SUBMIT_FORMAT_GATES: { id: string; name: string; check: string }[] = [
  { id: "F-01", name: "标题与剧名一致", check: "投稿版标题与立项剧名完全一致" },
  { id: "F-02", name: "分集编号规范", check: "集数编号连续、无跳号（第 1 集…第 N 集）" },
  { id: "F-03", name: "场景标题规范", check: "场景标题含地点/时间/内外景，全剧命名统一" },
  { id: "F-04", name: "对白格式统一", check: "角色名+冒号+对白，无混用符号" },
  { id: "F-05", name: "无占位符残留", check: "无【XX】/TODO/未填项残留" },
  { id: "F-06", name: "AI 标识声明", check: "开头 3 秒画面/语音标注「AI生成」+ 后台勾选声明" },
];

// 单集字数门禁（系统字数检查_强制门禁口径）
export const WORDCOUNT_GATES: { name: string; min: number; max: number; note: string } = {
  name: "单集正文字数",
  min: 600,
  max: 1500,
  note: "以系统 wordcount_check_v6 口径为准；低于下限或超上限均判定不合格",
};

// 转小说检查要点（短剧剧本 → 小说）
export const NOVEL_CHECKLIST: { id: string; name: string; check: string }[] = [
  { id: "N-01", name: "叙事视角转换", check: "剧本对白体转为小说叙述体，补环境与心理描写" },
  { id: "N-02", name: "场景描写补全", check: "剧本场景提示词转为可读的场景描写段落" },
  { id: "N-03", name: "章节约分合理", check: "按剧情节奏分章，每章有钩子与爽点" },
  { id: "N-04", name: "金句伏笔保留", check: "剧本金句与伏笔在小说中完整保留并回收" },
  { id: "N-05", name: "平台规范适配", check: "符合番茄等小说平台字数/章节/敏感词规范" },
  { id: "N-06", name: "小说质检通过", check: "对照 qc_novel.js 小说质检项复核" },
];

export function countCnChars(text: string): number {
  // 统计中文字符与常见标点（近似正文字数口径）
  const m = text.replace(/\s/g, "").match(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef0-9a-zA-Z]/g);
  return m ? m.length : 0;
}

export function checkWordcount(text: string): { pass: boolean; count: number; verdict: string } {
  const count = countCnChars(text);
  const pass = count >= WORDCOUNT_GATES.min && count <= WORDCOUNT_GATES.max;
  const verdict = pass
    ? `字数 ${count}，在 ${WORDCOUNT_GATES.min}—${WORDCOUNT_GATES.max} 区间内，通过`
    : count < WORDCOUNT_GATES.min
      ? `字数 ${count}，低于下限 ${WORDCOUNT_GATES.min}，需扩写`
      : `字数 ${count}，超过上限 ${WORDCOUNT_GATES.max}，需精简`;
  return { pass, count, verdict };
}

export function buildSubmitReport(text: string, title: string, mode: "submit" | "novel"): string {
  const wc = checkWordcount(text);
  const lines: string[] = [];
  const modeName = mode === "submit" ? "投稿格式" : "转成小说";
  lines.push(`# ${modeName} · ${title || "未命名"}`);
  lines.push("");
  lines.push("> 生成时间：" + new Date().toLocaleString("zh-CN"));
  lines.push("> 规则来源：AI短剧创作系统 · 投稿与小说转换规则");
  lines.push("");
  lines.push("## 一、字数门禁（强制）");
  lines.push("");
  lines.push(`- ${wc.verdict}`);
  lines.push(`- 口径：${WORDCOUNT_GATES.note}`);
  lines.push("");
  if (mode === "submit") {
    lines.push("## 二、投稿格式门禁");
    lines.push("");
    for (const g of SUBMIT_FORMAT_GATES) {
      lines.push(`- [ ] ${g.id} ${g.name}：${g.check}`);
    }
    lines.push("");
    lines.push("## 三、可投稿判定");
    lines.push("");
    lines.push(`- 字数门禁：${wc.pass ? "通过" : "未通过（先处理字数）"}`);
    lines.push("- 格式门禁：逐项勾选确认后判定");
    lines.push("- AI 标识：必须三处齐备（画面/语音/后台）");
    lines.push("");
    lines.push("> 说明：本清单为投稿前终检辅助，正式投稿前建议对照系统 pre_submit_check.js 复核。");
  } else {
    lines.push("## 二、转小说检查要点");
    lines.push("");
    for (const n of NOVEL_CHECKLIST) {
      lines.push(`- [ ] ${n.id} ${n.name}：${n.check}`);
    }
    lines.push("");
    lines.push("> 说明：短剧转小说完成后，须对照系统 qc_novel.js 小说质检复核后再投小说平台。");
  }
  return lines.join("\n");
}
