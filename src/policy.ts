// 政策合规 —— 规则移植自系统《政策风险清单.md》（2026-06-15 更新）

export interface RedLineItem {
  name: string;
  detail: string;
  risk: string;
}

// 广电总局 8 类内容红线（P0 必检）
export const RED_LINES: RedLineItem[] = [
  { name: "涉儿童内容", detail: "儿童形象成人化/工具化/娱乐化，儿童参与成人剧情", risk: "高风险" },
  { name: "软色情", detail: "性暗示台词、擦边球情节、衣着暴露", risk: "高风险" },
  { name: "拜金炫富", detail: "一掷千金、嫁入豪门、金钱至上价值观", risk: "高风险" },
  { name: "畸形婚恋", detail: "强制爱、囚禁、PUA 情感操控", risk: "高风险" },
  { name: "封建糟粕", detail: "重男轻女、包办婚姻、迷信思想", risk: "高风险" },
  { name: "暴力血腥", detail: "私刑报复、血腥打斗、极端复仇", risk: "高风险" },
  { name: "低俗片名", detail: "标题党、哗众取宠、违禁词", risk: "高风险" },
  { name: "侵权抄袭", detail: "创意抄袭、肖像侵权、未经授权改编", risk: "高风险" },
];

// 低风险推荐方向（政策鼓励）
export const SAFE_DIRECTIONS: string[] = [
  "现实题材（职场奋斗、家庭温情）",
  "正能量逆袭（靠努力成功、技能提升）",
  "传统文化（非遗传承、历史故事）",
  "科技创新（AI 发展、未来想象）",
  "亲情友情（家庭温情、互助）",
  "乡村生活（乡村振兴、田园）",
];

// AI 标识合规要点（2026-06-14 强制落地）
export const AI_TAG_RULES: string[] = [
  "AI 生成内容开头 3 秒必须标注「AI生成」（画面+语音双标注）",
  "平台在视频文件元数据中嵌入溯源编码",
  "仅画面标注、后台不勾选仍判定违规",
  "违规后果：限制推荐 → 下架 → 限流",
];

export function checkRedLines(text: string): { hit: RedLineItem[]; keywords: string[] } {
  const hit: RedLineItem[] = [];
  const keywords: string[] = [];
  const dict: { line: RedLineItem; keys: string[] }[] = [
    {
      line: RED_LINES[0],
      keys: ["儿童", "孩子", "小学生", "未成年人", "童"],
    },
    {
      line: RED_LINES[1],
      keys: ["擦边", "性暗示", "暧昧", "暴露"],
    },
    {
      line: RED_LINES[2],
      keys: ["一掷千金", "嫁入豪门", "炫富", "拜金", "豪车", "千万彩礼"],
    },
    {
      line: RED_LINES[3],
      keys: ["强制爱", "囚禁", "PUA", "操控", "病娇"],
    },
    {
      line: RED_LINES[4],
      keys: ["重男轻女", "包办婚姻", "迷信", "封建"],
    },
    {
      line: RED_LINES[5],
      keys: ["私刑", "血腥", "复仇", "打斗", "暴力"],
    },
    {
      line: RED_LINES[6],
      keys: ["霸总", "战神", "赘婿", "龙傲天", "逆袭"],
    },
    {
      line: RED_LINES[7],
      keys: ["抄袭", "改编", "盗版"],
    },
  ];
  for (const entry of dict) {
    for (const k of entry.keys) {
      if (text.includes(k)) {
        hit.push(entry.line);
        keywords.push(k);
        break;
      }
    }
  }
  return { hit, keywords };
}
