// 插件核心逻辑自检（node 直接运行，不依赖 obsidian API）
const assert = require("assert");

(async () => {
  // 用 node 原生 strip-types 加载 TS 纯逻辑模块
  const score = require("./src/score.ts");
  const policy = require("./src/policy.ts");
  const qc = require("./src/qc.ts");
  const topics = require("./src/topics.ts");
  const lixiang = require("./src/lixiang.ts");
  const writing = require("./src/writing.ts");
  const rewrite = require("./src/rewrite.ts");
  const submit = require("./src/submit.ts");

  let pass = 0, fail = 0;
  const check = (name, fn) => {
    try { fn(); pass++; console.log("PASS", name); }
    catch (e) { fail++; console.log("FAIL", name, e.message); }
  };

  // 1. 四维评分：零风险全五星 → A
  check("评分-A级(零风险/降本5/视觉5/新颖5)", () => {
    const r = score.scoreTopic({ title: "t", type: "现实行业剧", risk: "zero", cost: 5, visual: 5, novelty: 5 });
    assert.strictEqual(r.grade, "A");
    assert.strictEqual(r.total, 1.0);
    assert.strictEqual(r.eliminated, false);
  });

  // 2. 合规高风险 → 淘汰
  check("评分-合规高风险淘汰", () => {
    const r = score.scoreTopic({ title: "t", type: "x", risk: "high", cost: 5, visual: 5, novelty: 5 });
    assert.strictEqual(r.grade, "淘汰");
    assert.strictEqual(r.eliminated, true);
  });

  // 3. 新颖度>50部 → 第一道过滤
  check("评分-新颖度红海过滤", () => {
    const r = score.scoreTopic({ title: "t", type: "x", risk: "zero", cost: 5, visual: 5, novelty: 1 });
    assert.strictEqual(r.grade, "淘汰");
    assert.strictEqual(r.novelty, 0);
  });

  // 4. 权重校验：合规0.2+降本0.2+视觉0.2+新颖0.4
  check("评分-权重公式", () => {
    const r = score.scoreTopic({ title: "t", type: "x", risk: "zero", cost: 4, visual: 4, novelty: 4 });
    // 1.0*0.2 + 0.8*0.2 + 0.8*0.2 + 0.8*0.4 = 0.2+0.16+0.16+0.32 = 0.84
    assert.strictEqual(r.total, 0.84);
    assert.strictEqual(r.grade, "B");
  });

  // 5. 红线扫描命中
  check("红线-命中低俗片名", () => {
    const { hit, keywords } = policy.checkRedLines("战神归来一掷千金");
    assert.ok(hit.length > 0);
    assert.ok(keywords.includes("战神") || keywords.includes("一掷千金"));
  });

  // 6. 红线扫描干净
  check("红线-无命中", () => {
    const { hit } = policy.checkRedLines("港口引航员的日常工作与家庭");
    assert.strictEqual(hit.length, 0);
  });

  // 7. 红线清单 8 类 + AI 标识 4 条
  check("红线-8类+AI标识4条", () => {
    assert.strictEqual(policy.RED_LINES.length, 8);
    assert.strictEqual(policy.AI_TAG_RULES.length, 4);
    assert.ok(policy.SAFE_DIRECTIONS.length >= 6);
  });

  // 8. 质检清单 46 项（PT-001~046，缺 041 则 45 项）
  check("质检-46项模板", () => {
    assert.ok(qc.QC_CHECKLIST.length >= 45);
    assert.ok(qc.QC_CHECKLIST.some(i => i.id === "PT-001"));
    assert.ok(qc.QC_CHECKLIST.some(i => i.id === "PT-046"));
  });

  // 9. 质检报告生成
  check("质检-报告生成", () => {
    const report = qc.buildQcReport("测试剧本内容", "测试剧");
    assert.ok(report.includes("# 单集质检清单"));
    assert.ok(report.includes("AI生成"));
  });

  // 10. 六大赛道 + P0 门禁 6 项
  check("选题-六大赛道+P0六项", () => {
    assert.strictEqual(topics.TRACKS.length, 6);
    assert.strictEqual(topics.P0_GATES.length, 6);
  });

  // 11. 选题卡生成
  check("选题-卡片生成", () => {
    const card = topics.generateTopicCard("今日选题", "港口船舶引航员的一天");
    assert.ok(card.track === "今日选题");
    const text = topics.formatTopicCard(card);
    assert.ok(text.includes("今日选题"));
  });

  // 12. 立项：交付物清单 19 项 + 门禁
  check("立项-交付物19项+门禁", () => {
    assert.strictEqual(lixiang.LAUNCH_DELIVERABLES.length, 19);
    assert.strictEqual(lixiang.LAUNCH_GATES.length, 6);
    const report = lixiang.buildLaunchReport("现实行业剧《那把尺子》钩子与主线明确", "测试剧");
    assert.ok(report.includes("立项工作流 v3.22"));
    assert.ok(report.includes("01 立项书"));
    assert.ok(report.includes("19 立项交付物齐套清单"));
  });

  // 13. 立项：红线命中判定（霸总 → 门禁未过）
  check("立项-红线关键词触发", () => {
    const gates = lixiang.checkLaunch("战神霸总归来，一掷千金");
    const red = gates.find(g => g.name.includes("政策红线"));
    assert.ok(red);
    assert.strictEqual(red.pass, false);
  });

  // 14. 写作：写前承诺 7 项 + 流水线四步 + 硬规则
  check("写作-承诺7项+四步+硬规则", () => {
    assert.strictEqual(writing.WRITING_PROMISES.length, 7);
    assert.strictEqual(writing.WRITING_FLOW.length, 4);
    assert.ok(writing.WRITING_HARD_RULES.length >= 8);
    const tpl = writing.buildWritingTemplate("测试剧");
    assert.ok(tpl.includes("写前承诺 7 项"));
    assert.ok(tpl.includes("第 4 步"));
  });

  // 15. 改写：AI 套话词扫描命中
  check("改写-套话词扫描", () => {
    const { clicheHits } = rewrite.scanAiFlavor("总而言之，这个故事不禁让人深思。");
    assert.ok(clicheHits.includes("总而言之"));
    assert.ok(clicheHits.includes("不禁让人"));
    const report = rewrite.buildRewriteReport("总而言之，值得注意", "测试");
    assert.ok(report.includes("去AI味"));
  });

  // 16. 改写：5 项模式 + PT 依据
  check("改写-5项模式+PT编号", () => {
    assert.strictEqual(rewrite.AI_PATTERNS.length, 5);
    assert.ok(rewrite.AI_PATTERNS.every(p => p.ptRef.includes("PT-")));
  });

  // 17. 投稿：格式门禁 6 项 + 字数门禁
  check("投稿-格式6项+字数门禁", () => {
    assert.strictEqual(submit.SUBMIT_FORMAT_GATES.length, 6);
    const r = submit.checkWordcount("好的，这是一个足够长的测试文本用于字数统计。".repeat(30));
    assert.ok(typeof r.pass === "boolean");
    assert.ok(r.verdict.includes("字数"));
    const report = submit.buildSubmitReport("内容", "测试", "submit");
    assert.ok(report.includes("投稿格式门禁"));
  });

  // 18. 转小说：6 项检查 + 模式
  check("投稿-转小说6项", () => {
    assert.strictEqual(submit.NOVEL_CHECKLIST.length, 6);
    const report = submit.buildSubmitReport("内容", "测试", "novel");
    assert.ok(report.includes("转小说检查要点"));
    assert.ok(report.includes("qc_novel.js"));
  });

  console.log(`\n结果: ${pass} 通过, ${fail} 失败`);
  process.exit(fail ? 1 : 0);
})();
