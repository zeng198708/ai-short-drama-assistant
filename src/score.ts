// 四维评分核心 —— 规则移植自系统《优先级计算公式.md》（v4.8）
// 综合得分 = 合规×0.2 + 降本×0.2 + 视觉×0.2 + 新颖度×0.4

export type RiskLevel = "zero" | "low" | "mid" | "high";
export type StarLevel = 5 | 4 | 3 | 2 | 1;

export interface ScoreInput {
  title: string;
  type: string; // 单一纯类型
  risk: RiskLevel; // 合规
  cost: StarLevel; // 降本
  visual: StarLevel; // 视觉
  novelty: StarLevel; // 新颖度（同类型数量）
  track?: string; // 主赛道（仅作参考，不参与计算）
}

export interface ScoreResult {
  compliance: number;
  cost: number;
  visual: number;
  novelty: number;
  total: number;
  grade: "A" | "B" | "C" | "D" | "淘汰";
  eliminated: boolean;
  reason?: string;
}

export const RISK_SCORE: Record<RiskLevel, number> = {
  zero: 1.0, // 零风险
  low: 0.7, // 低风险
  mid: 0.4, // 中风险
  high: 0, // 高风险（淘汰）
};

// 降本：AI 生成降本 >80% = 1.0，逐级至全真人 = 0.2
export const COST_SCORE: Record<StarLevel, number> = {
  5: 1.0,
  4: 0.8,
  3: 0.6,
  2: 0.4,
  1: 0.2,
};

// 视觉：AI 视觉奇观 1.0，逐级至无亮点 0.2
export const VISUAL_SCORE: Record<StarLevel, number> = {
  5: 1.0,
  4: 0.8,
  3: 0.6,
  2: 0.4,
  1: 0.2,
};

// 新颖度（权重 40%，刻意设计）：<10 部 = 1.0；>50 部 = 0 且第一道过滤
export const NOVELTY_SCORE: Record<StarLevel, number> = {
  5: 1.0, // <10 部 极致蓝海
  4: 0.8, // 10-20 部 蓝海起量期
  3: 0.6, // 20-30 部 开始竞争
  2: 0.4, // 30-50 部 红海边缘
  1: 0, // >50 部 红海，第一道过滤
};

export function scoreTopic(input: ScoreInput): ScoreResult {
  const compliance = RISK_SCORE[input.risk];
  const cost = COST_SCORE[input.cost];
  const visual = VISUAL_SCORE[input.visual];
  const novelty = NOVELTY_SCORE[input.novelty];

  const eliminated = compliance === 0 || novelty === 0;
  const total = compliance * 0.2 + cost * 0.2 + visual * 0.2 + novelty * 0.4;

  let grade: ScoreResult["grade"];
  let reason: string | undefined;
  if (eliminated) {
    grade = "淘汰";
    reason = compliance === 0 ? "合规高风险，直接淘汰" : "新颖度>50部红海，第一道过滤";
  } else if (total >= 0.9) {
    grade = "A";
    reason = "P0 级，建议优先推送";
  } else if (total >= 0.8) {
    grade = "B";
    reason = "可推送，打磨卖点";
  } else if (total >= 0.6) {
    grade = "C";
    reason = "需增强蓝海/视觉/降本之一";
  } else {
    grade = "D";
    reason = "竞争力弱，不建议";
  }

  return {
    compliance,
    cost,
    visual,
    novelty,
    total: Math.round(total * 100) / 100,
    grade,
    eliminated,
    reason,
  };
}

export function starText(level: StarLevel): string {
  return "★".repeat(level) + "☆".repeat(5 - level);
}
