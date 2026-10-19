import { Notice, Plugin, TFile, Editor, MarkdownView } from "obsidian";
import { ScoreModal, PolicyModal } from "./modals";
import { buildQcReport } from "./qc";
import { generateTopicCard, formatTopicCard, TRACKS, P0_GATES } from "./topics";
import { buildLaunchReport } from "./lixiang";
import { buildWritingTemplate } from "./writing";
import { buildRewriteReport } from "./rewrite";
import { buildSubmitReport } from "./submit";

const OUTPUT_DIR = "AI短剧创作助手";

export default class AiShortDramaAssistantPlugin extends Plugin {
  async onload() {
    // 命令 1：四维评分面板（MVP 最小闭环）
    this.addCommand({
      id: "score-topic",
      name: "四维评分面板（今日/预测类选题）",
      callback: () => {
        new ScoreModal(this.app).open();
      },
    });

    // 命令 2：政策红线快检
    this.addCommand({
      id: "check-policy",
      name: "政策红线快检（对当前笔记）",
      checkCallback: (checking: boolean) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
          if (!checking) {
            new PolicyModal(this.app, view.editor.getValue()).open();
          }
          return true;
        }
        return false;
      },
    });

    // 命令 3：生成单集质检清单
    this.addCommand({
      id: "gen-qc-checklist",
      name: "生成单集质检清单（对当前笔记）",
      checkCallback: (checking: boolean) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
          if (!checking) {
            this.generateQcReport(view.editor, view.file);
          }
          return true;
        }
        return false;
      },
    });

    // 命令 4：生成选题灵感卡
    this.addCommand({
      id: "gen-topic-cards",
      name: "生成选题灵感卡（六大赛道草稿）",
      callback: () => {
        this.generateTopicCards();
      },
    });

    // 命令 5：立项检查（v0.2 新增，对齐豆包六模块之②）
    this.addCommand({
      id: "launch-check",
      name: "立项检查（对当前笔记，门禁+交付物清单）",
      checkCallback: (checking: boolean) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
          if (!checking) {
            this.writeReport(buildLaunchReport(view.editor.getValue(), view.file?.basename), "立项检查");
          }
          return true;
        }
        return false;
      },
    });

    // 命令 6：单集写作流水线（v0.2 新增，对齐豆包六模块之③）
    this.addCommand({
      id: "gen-writing-template",
      name: "生成单集写作流水线（写前承诺7项+四步+硬规则）",
      checkCallback: (checking: boolean) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
          if (!checking) {
            this.writeReport(buildWritingTemplate(view.file?.basename ?? "未命名"), "写作流水线");
          }
          return true;
        }
        return false;
      },
    });

    // 命令 7：去AI味改写（v0.2 新增，对齐豆包六模块之⑤）
    this.addCommand({
      id: "rewrite-deai",
      name: "去AI味改写（对当前笔记，原文→改后对照+PT依据）",
      checkCallback: (checking: boolean) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
          if (!checking) {
            this.writeReport(buildRewriteReport(view.editor.getValue(), view.file?.basename), "去AI味改写");
          }
          return true;
        }
        return false;
      },
    });

    // 命令 8：转投稿格式 / 转成小说（v0.2 新增，对齐豆包六模块之⑥）
    this.addCommand({
      id: "submit-convert",
      name: "转投稿格式（对当前笔记，格式/字数门禁）",
      checkCallback: (checking: boolean) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
          if (!checking) {
            this.writeReport(buildSubmitReport(view.editor.getValue(), view.file?.basename, "submit"), "投稿格式检查");
          }
          return true;
        }
        return false;
      },
    });

    this.addCommand({
      id: "submit-to-novel",
      name: "转成小说检查（对当前笔记，小说质检要点）",
      checkCallback: (checking: boolean) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
          if (!checking) {
            this.writeReport(buildSubmitReport(view.editor.getValue(), view.file?.basename, "novel"), "转小说检查");
          }
          return true;
        }
        return false;
      },
    });

    this.app.workspace.onLayoutReady(() => {
      this.addRibbonIcon("wand-2", "AI短剧创作助手", () => {
        new ScoreModal(this.app).open();
      });
    });
  }

  private async writeReport(content: string, kind: string) {
    const dir = await this.ensureOutputDir();
    const fname = `${dir}/${kind}_${new Date().toISOString().slice(0, 10)}.md`;
    await this.app.vault.create(fname, content);
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(this.app.vault.getAbstractFileByPath(fname) as TFile);
    new Notice(`${kind}已生成`);
  }

  private async ensureOutputDir(): Promise<string> {
    const dir = this.app.vault.getAbstractFileByPath(OUTPUT_DIR);
    if (!dir) {
      await this.app.vault.createFolder(OUTPUT_DIR);
    }
    return OUTPUT_DIR;
  }

  private async generateQcReport(editor: Editor, file: TFile | null) {
    const text = editor.getValue();
    const title = file ? file.basename : "未命名";
    const report = buildQcReport(text, title);

    const dir = await this.ensureOutputDir();
    const fname = `${dir}/质检清单_${title}_${new Date().toISOString().slice(0, 10)}.md`;
    await this.app.vault.create(fname, report);
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(this.app.vault.getAbstractFileByPath(fname) as TFile);
    new Notice("质检清单已生成");
  }

  private async generateTopicCards() {
    const dir = await this.ensureOutputDir();
    const fname = `${dir}/选题灵感卡_${new Date().toISOString().slice(0, 10)}.md`;

    const cards = TRACKS.map((t) => generateTopicCard(t.name, t.desc.split("（")[0]));
    const lines: string[] = [];
    lines.push("# 选题灵感卡 · AI短剧创作助手");
    lines.push("");
    lines.push(`> 生成时间：${new Date().toLocaleString("zh-CN")}`);
    lines.push("> 说明：以下为模板化草稿，须按系统 P0 门禁人工核验后再立项。");
    lines.push("");
    lines.push("## P0 门禁（6 项必检）");
    lines.push("");
    for (const gate of P0_GATES) {
      lines.push(`- [ ] ${gate}`);
    }
    lines.push("");
    lines.push("## 六大赛道草稿");
    lines.push("");
    for (let i = 0; i < cards.length; i++) {
      lines.push(`### 赛道 ${i + 1}：${TRACKS[i].name}`);
      lines.push("");
      lines.push(formatTopicCard(cards[i]));
    }
    lines.push("---");
    lines.push("> 规则来源：AI短剧创作系统 · 六大赛道引擎 v6.1 + P0 门禁");

    await this.app.vault.create(fname, lines.join("\n"));
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(this.app.vault.getAbstractFileByPath(fname) as TFile);
    new Notice("选题灵感卡已生成（草稿，请人工核验）");
  }

  onunload() {}
}
