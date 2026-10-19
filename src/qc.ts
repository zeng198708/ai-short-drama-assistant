// 单集质检清单 —— 精简自系统《问题模板库》PT-001~PT-046（46 项）
// 对外插件版为「自查清单」，完整机检逻辑留在系统内部（qc_auto.js）

export interface QcItem {
  id: string;
  name: string;
  check: string; // 一句话检查要点
}

export const QC_CHECKLIST: QcItem[] = [
  { id: "PT-001", name: "开篇冲突缺失", check: "前 300 字/黄金 3 秒是否有强冲突落地？" },
  { id: "PT-002", name: "人设扁平无记忆点", check: "主角是否有可一句话记住的记忆点？" },
  { id: "PT-003", name: "台词 AI 味说教", check: "台词是否有 AI 味、全员同腔、说教感？" },
  { id: "PT-004", name: "单集无钩子注水", check: "本集是否有明确钩子，无注水段落？" },
  { id: "PT-005", name: "审核红线题材违规", check: "是否触碰 8 类政策红线（P0 必检）？" },
  { id: "PT-006", name: "逻辑降智反派无动机", check: "反派动机与剧情逻辑是否自洽？" },
  { id: "PT-007", name: "情绪断档爽点不足", check: "情绪曲线是否连续、爽点是否达标？" },
  { id: "PT-008", name: "旁白独白滥用", check: "是否广播剧化/有声小说化、旁白过多？" },
  { id: "PT-009", name: "片名标题党违禁词", check: "片名是否含违禁词或过度标题党？" },
  { id: "PT-010", name: "伏笔不回收挖坑不填", check: "伏笔是否有登记并有计划回收？" },
  { id: "PT-011", name: "高开低走爽点通胀", check: "跨集爽点是否升维、无重复通胀？" },
  { id: "PT-012", name: "制式金句万能台词", check: "是否跨剧复制制式金句/万能台词？" },
  { id: "PT-013", name: "场景资产膨胀", check: "同一地点全本名称是否统一？" },
  { id: "PT-014", name: "对白占比不达标", check: "对白占比是否达到 60%-70%？" },
  { id: "PT-015", name: "伏笔账本脱节", check: "伏笔账本登记与实际埋设是否一致？" },
  { id: "PT-016", name: "自检清单数字造假", check: "质检自检数据是否真实可复现？" },
  { id: "PT-017", name: "角色声音趋同", check: "盖住名字能否分辨每句台词是谁说的？" },
  { id: "PT-018", name: "分集大纲与终稿脱节", check: "大纲与终稿是否有信息差？" },
  { id: "PT-019", name: "人物小传两张皮", check: "小传设定是否在正文有行为落地？" },
  { id: "PT-020", name: "金句库登记未落地", check: "金句库台词是否已在正文出现？" },
  { id: "PT-021", name: "集间承接断裂", check: "上集钩子是否被本集接住？" },
  { id: "PT-022", name: "付费卡点缺失错位", check: "第 9-12 集附近是否有付费卡点钩子？" },
  { id: "PT-023", name: "爽点自报缺项", check: "集尾爽点字段是否登记、数量达标？" },
  { id: "PT-024", name: "场景手册与终稿脱节", check: "场景名与场景手册是否一致？" },
  { id: "PT-025", name: "人物卡片四要素缺失", check: "人物卡是否含身份/关系/表达/声音？" },
  { id: "PT-026", name: "黄金三章密度无载体", check: "前 3 集是否每集埋 ≥3 个钩子？" },
  { id: "PT-027", name: "详细大纲标题冲突", check: "16 号大纲与本集标题是否一致？" },
  { id: "PT-028", name: "金手指 OS 呈现断线", check: "金手指是否视觉化呈现（OS/特效/互动）？" },
  { id: "PT-029", name: "道具服装登记缺位", check: "核心道具/服装是否有生命周期登记？" },
  { id: "PT-030", name: "剧本格式与模板脱节", check: "剧本格式是否符合平台标准模板？" },
  { id: "PT-031", name: "交付物缺项无声明", check: "缺项是否有声明与修订痕迹？" },
  { id: "PT-032", name: "金手指退化为独白", check: "金手指是否真实被执行而非内心独白？" },
  { id: "PT-033", name: "台词单句超长", check: "单句台词是否 ≤30 字（红线 40 字）？" },
  { id: "PT-034", name: "集尾信息区块降级", check: "集尾情绪/爽点/钩子三核心是否齐全？" },
  { id: "PT-035", name: "世界观禁令被违反", check: "分集层是否违反 01 号世界观禁令？" },
  { id: "PT-036", name: "跨集情绪通道同质化", check: "连续多集情绪节拍是否重复？" },
  { id: "PT-037", name: "同集场景实体重复", check: "同一场景是否在同一集写两次？" },
  { id: "PT-038", name: "转场声明矛盾", check: "转场声明与下一场景标题是否矛盾？" },
  { id: "PT-039", name: "分镜表载体缺失", check: "AI 漫剧是否配套分镜表（同框≤3人）？" },
  { id: "PT-040", name: "荒诞奇观博眼球", check: "数值/设定是否离谱到反智（现实题材）？" },
  { id: "PT-042", name: "核心卖点空转", check: "立项卖点在正文是否真实落地？" },
  { id: "PT-043", name: "开篇前 300 字无炸点", check: "开头是否含社死/打脸/反转场面？" },
  { id: "PT-044", name: "爽点全在私人场景", check: "前 10 集是否有 ≥3 个公开打脸名场面？" },
  { id: "PT-045", name: "收入职业不匹配", check: "人物收入与职业身份是否匹配？" },
  { id: "PT-046", name: "基础档案时空穿帮", check: "婚否/年龄/性别/同名/时间地点是否对账？" },
];

export function buildQcReport(episodeText: string, title: string): string {
  const lines: string[] = [];
  lines.push(`# 单集质检清单 · ${title || "未命名"}`);
  lines.push("");
  lines.push("> 生成时间：" + new Date().toLocaleString("zh-CN"));
  lines.push("> 规则来源：AI短剧创作系统 · 问题模板库 PT-001~046（46 项）");
  lines.push("");
  lines.push("## 一、政策红线快检（P0）");
  lines.push("");
  for (const item of QC_CHECKLIST.slice(0, 1)) {
    lines.push(`- [ ] ${item.name}：${item.check}`);
  }
  // 红线项单列
  lines.push("- [ ] 涉儿童内容：无儿童成人化/工具化情节");
  lines.push("- [ ] 软色情：无性暗示台词/擦边情节");
  lines.push("- [ ] 拜金炫富：无金钱至上价值观");
  lines.push("- [ ] 畸形婚恋：无强制爱/囚禁/PUA");
  lines.push("- [ ] 封建糟粕：无迷信/包办婚姻");
  lines.push("- [ ] 暴力血腥：无私刑/血腥复仇");
  lines.push("- [ ] 低俗片名：片名无违禁词");
  lines.push("- [ ] 侵权抄袭：无抄袭/未经授权改编");
  lines.push("");
  lines.push("## 二、46 项问题模板自查");
  lines.push("");
  for (const item of QC_CHECKLIST) {
    lines.push(`- [ ] ${item.id} ${item.name}：${item.check}`);
  }
  lines.push("");
  lines.push("## 三、AI 标识合规");
  lines.push("");
  lines.push("- [ ] 开头 3 秒画面标注「AI生成」");
  lines.push("- [ ] 开头语音播报「本剧为 AI 技术生成」");
  lines.push("- [ ] 平台后台已勾选 AI 生成声明");
  lines.push("");
  lines.push("> 说明：本清单为自查辅助，投稿前建议对照系统 qc_auto.js 机检结果复核。");
  return lines.join("\n");
}
