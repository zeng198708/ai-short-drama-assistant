// 选题灵感卡 —— 六大赛道模板 + P0 门禁
// 赛道定义移植自系统《系统说明.md》v6.1 六大赛道

export interface TopicCard {
  track: string;
  title: string;
  type: string;
  sellingPoint: string;
  hook: string; // 第 1 集钩子
  costMode: "AI漫剧" | "真人精品" | "均可";
  novelty: number; // 同类型部数估算
}

export const TRACKS = [
  { name: "今日选题", desc: "当下热榜验证赛道（红果/抖音/快手热榜）" },
  { name: "预测类选题", desc: "未来 1-2 个月爆发赛道（政策+技术趋势）" },
  { name: "改编选题", desc: "成熟 IP 改编赛道（畅销书/经典 IP）" },
  { name: "想象力选题", desc: "高冲击·颠覆·超出认知（单一纯类型，禁止 A+B 融合）" },
  { name: "生活类选题", desc: "真实生活共鸣赛道（素人热搜/亲身经历）" },
  { name: "赛道专题选题", desc: "定向赛道深挖（赛道模型+平台趋势）" },
];

// P0 门禁 6 项（对外精简版）
export const P0_GATES = [
  "三完全不同：方向/类型/气质三重全不同",
  "单一纯类型：每个选题 1 个纯类型，禁止融合",
  "主赛道各异：5 个选题 5 个不同主赛道",
  "明确标题：剧名式标题，不写概念串",
  "禁止 AI 主角：以人或物为主角，AI 只是工具",
  "核心剧情主线：第 1 集钩子 + 主线类型",
];

export function generateTopicCard(track: string, signal: string): TopicCard {
  // 由用户信号生成一张选题草稿卡（模板化组装，人工再核验）
  const clean = signal.trim() || "待补充信号";
  return {
    track,
    title: `《${clean.slice(0, 12)}·反转》`,
    type: "现实行业剧", // 默认安全类型，用户可改
    sellingPoint: `围绕「${clean}」的强冲突 + 固定识别物`,
    hook: `第 1 集钩子：${clean} 场景下出现无法回避的规则冲突`,
    costMode: "AI漫剧",
    novelty: 8, // 估算同类型 <10 部
  };
}

export function formatTopicCard(card: TopicCard): string {
  return [
    `### ${card.track}｜《${card.title}》`,
    `- 类型（纯）：${card.type}`,
    `- 一句话卖点：${card.sellingPoint}`,
    `- 第 1 集钩子：${card.hook}`,
    `- 制作形态：${card.costMode}`,
    `- 同类型部数（估）：${card.novelty} 部`,
    "",
  ].join("\n");
}
