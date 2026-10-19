import { App, Modal, Setting, Notice } from "obsidian";
import {
  ScoreInput,
  ScoreResult,
  scoreTopic,
  starText,
  RiskLevel,
  StarLevel,
} from "./score";
import { checkRedLines, RED_LINES, SAFE_DIRECTIONS, AI_TAG_RULES } from "./policy";

export class ScoreModal extends Modal {
  input: ScoreInput = {
    title: "",
    type: "现实行业剧",
    risk: "zero",
    cost: 5,
    visual: 4,
    novelty: 5,
    track: "",
  };

  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("asd-modal");
    contentEl.createEl("h3", { text: "四维评分 · 今日/预测类选题" });

    new Setting(contentEl).setName("候选标题").addText((t) => {
      t.setPlaceholder("剧名式标题，如《那把尺子换了三次刻度》");
      t.onChange((v) => (this.input.title = v));
    });
    new Setting(contentEl).setName("类型（纯）").addText((t) => {
      t.setPlaceholder("现实行业剧 / 都市情感 / 古装宅斗…");
      t.onChange((v) => (this.input.type = v));
    });
    new Setting(contentEl).setName("主赛道（仅参考，不参与计算）").addText((t) => {
      t.setPlaceholder("可选，如：港口船舶引航");
      t.onChange((v) => (this.input.track = v));
    });

    new Setting(contentEl)
      .setName("合规（权重 0.2）")
      .setDesc("零风险 1.0 / 低风险 0.7 / 中风险 0.4 / 高风险 0（直接淘汰）")
      .addDropdown((d) => {
        d.addOption("zero", "零风险 1.0");
        d.addOption("low", "低风险 0.7");
        d.addOption("mid", "中风险 0.4");
        d.addOption("high", "高风险 0（淘汰）");
        d.setValue(this.input.risk);
        d.onChange((v) => (this.input.risk = v as RiskLevel));
      });

    new Setting(contentEl)
      .setName("降本（权重 0.2）")
      .setDesc("AI 生成降本>80% = 1.0，逐级至全真人 = 0.2")
      .addDropdown((d) => {
        for (const s of [5, 4, 3, 2, 1] as StarLevel[]) {
          d.addOption(String(s), `${starText(s)} ${COST_LABEL[s]}`);
        }
        d.setValue(String(this.input.cost));
        d.onChange((v) => (this.input.cost = Number(v) as StarLevel));
      });

    new Setting(contentEl)
      .setName("视觉（权重 0.2）")
      .setDesc("AI 视觉奇观 1.0，逐级至无亮点 0.2")
      .addDropdown((d) => {
        for (const s of [5, 4, 3, 2, 1] as StarLevel[]) {
          d.addOption(String(s), `${starText(s)} ${VISUAL_LABEL[s]}`);
        }
        d.setValue(String(this.input.visual));
        d.onChange((v) => (this.input.visual = Number(v) as StarLevel));
      });

    new Setting(contentEl)
      .setName("新颖度（权重 0.4，刻意设计）")
      .setDesc("<10 部 = 1.0；>50 部 = 0 且第一道过滤")
      .addDropdown((d) => {
        for (const s of [5, 4, 3, 2, 1] as StarLevel[]) {
          d.addOption(String(s), `${starText(s)} ${NOVELTY_LABEL[s]}`);
        }
        d.setValue(String(this.input.novelty));
        d.onChange((v) => (this.input.novelty = Number(v) as StarLevel));
      });

    new Setting(contentEl).addButton((b) => {
      b.setButtonText("计算综合得分").setCta().onClick(() => {
        if (!this.input.title.trim()) {
          new Notice("请填写候选标题");
          return;
        }
        const result = scoreTopic(this.input);
        this.renderResult(result);
      });
    });
  }

  renderResult(result: ScoreResult) {
    const { contentEl } = this;
    // 移除旧结果
    contentEl.querySelectorAll(".asd-score-result").forEach((n) => n.remove());

    const box = contentEl.createDiv({ cls: "asd-score-result" });
    box.createEl("h4", { text: "综合得分" });
    const rows = [
      ["合规（0.2）", result.compliance.toFixed(2)],
      ["降本（0.2）", result.cost.toFixed(2)],
      ["视觉（0.2）", result.visual.toFixed(2)],
      ["新颖度（0.4）", result.novelty.toFixed(2)],
    ];
    for (const [k, v] of rows) {
      const row = box.createDiv({ cls: "asd-score-row" });
      row.createSpan({ text: k });
      row.createSpan({ text: v });
    }
    const total = box.createDiv({ cls: "asd-score-total" });
    total.createSpan({ text: "综合得分" });
    total.createSpan({ text: result.total.toFixed(2) });

    const grade = box.createDiv({ cls: `asd-grade asd-grade-${result.grade === "淘汰" ? "d" : result.grade.toLowerCase()}` });
    grade.setText(`评级：${result.grade}${result.reason ? " · " + result.reason : ""}`);
  }

  onClose() {
    this.contentEl.empty();
  }
}

export class PolicyModal extends Modal {
  constructor(app: App, text: string) {
    super(app);
    this.text = text;
  }
  private text: string;

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("asd-modal");
    contentEl.createEl("h3", { text: "政策红线快检 · 8 类 P0 必检" });

    const { hit, keywords } = checkRedLines(this.text);

    if (hit.length === 0) {
      contentEl.createEl("p", { text: "未命中 8 类红线关键词，初步合规。", cls: "asd-grade asd-grade-a" });
    } else {
      contentEl.createEl("p", { text: `命中关键词：${keywords.join("、")}`, cls: "asd-grade asd-grade-d" });
      for (const item of hit) {
        const row = contentEl.createDiv({ cls: "asd-score-row" });
        row.createSpan({ text: item.name });
        row.createSpan({ text: item.detail });
      }
    }

    contentEl.createEl("h4", { text: "8 类红线清单" });
    for (const item of RED_LINES) {
      const row = contentEl.createDiv({ cls: "asd-score-row" });
      row.createSpan({ text: item.name });
      row.createSpan({ text: item.detail });
    }

    contentEl.createEl("h4", { text: "推荐方向（政策鼓励）" });
    for (const dir of SAFE_DIRECTIONS) {
      contentEl.createEl("p", { text: `✅ ${dir}`, cls: "asd-topic-card" });
    }

    contentEl.createEl("h4", { text: "AI 标识合规（2026-06-14 强制）" });
    for (const rule of AI_TAG_RULES) {
      contentEl.createEl("p", { text: `• ${rule}` });
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}

const COST_LABEL: Record<StarLevel, string> = {
  5: "AI 生成降本>80%",
  4: "AI 生成降本 50-80%",
  3: "AI 辅助降本 20-50%",
  2: "真人为主 AI 辅助",
  1: "全真人高成本",
};

const VISUAL_LABEL: Record<StarLevel, string> = {
  5: "AI 视觉奇观",
  4: "AI 精美场景",
  3: "AI 辅助普通场景",
  2: "真人实拍一般",
  1: "真人无亮点",
};

const NOVELTY_LABEL: Record<StarLevel, string> = {
  5: "<10 部（极致蓝海）",
  4: "10-20 部（蓝海起量）",
  3: "20-30 部（开始竞争）",
  2: "30-50 部（红海边缘）",
  1: ">50 部（红海·过滤）",
};
