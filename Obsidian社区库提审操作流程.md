# Obsidian 社区库提审操作流程（AI短剧创作助手 v0.2.0）

> 适用：本地验证通过后（selftest 18/18 + 六模块 9 命令全部触发通过），将插件上架到 Obsidian 官方社区库。
> 现行渠道（2026-05 起）：Obsidian 启用新版「Obsidian Community」目录 + 开发者面板 + 自动化审核，所有新插件统一走该面板，不再走旧版 obsidian-releases PR 流程（旧提交已全部迁移至新面板）。
> 依据：obsidian.md 官方公告《The future of Obsidian plugins》(2026-05-12) + 官方开发者文档（GitHub Actions 发布指南）。
> 状态（2026-10-19 更新）：本地验证 ✅ → GitHub 上传 ✅（4 commits，最新 fd3ca40）→ Actions 自动打包 ✅（绿色，官方最新模板已修复）→ **当前待办：Releases 草稿 → Publish release → 社区站提审提交**。

---

## 〇、提审全流程一览

| 阶段 | 动作 | 耗时 | 谁操作 |
|---|---|---|---|
| 1 | GitHub 公开仓库托管插件（含 Release 发布） | 30-60 分钟 | 用户（本机已备好物料） |
| 2 | Obsidian Community 开发者面板提交 | 10-15 分钟 | 用户（需登录） |
| 3 | 自动化审核 | 几分钟内出结果 | Obsidian 系统 |
| 4 | 审核通过 → App 内可搜索下载 | 通过后 24 小时内 | Obsidian 系统 |

---

## 一、前置条件（三样缺一不可）

1. **GitHub 账号**（免费注册 https://github.com ，建议用户名用稳定品牌名，后续可加 authorUrl）。
2. **Obsidian 账号**（免费注册 https://obsidian.md/account 或直接在 Community 站 Sign in；开发者面板强制要求 Obsidian 账号）。
3. **插件公开仓库**，满足：
   - 仓库为 **public**（新目录暂不接受闭源插件，也不支持非 GitHub 托管）；
   - 仓库根目录含 `main.js`、`manifest.json`、`styles.css`、`README.md`（四件套本机已在 `release\ai-short-drama-assistant\` 备好）；
   - 仓库至少有 **1 个 GitHub Release**，且 Release 标签版本号与 `manifest.json` 的 `version` 完全一致（本插件为 `0.2.0`）；
   - Release 附件必须包含 `main.js`、`manifest.json`、`styles.css` 三个文件。

> 本插件工程已就绪：`D:\智脑工作台\06-短剧创作库\00_产品化落地\03_工具工程\obsidian插件\`（含 src 源码、构建脚本、README、selftest、六模块触发验证清单，以及刚生成的 `.github\workflows\release.yml`）。上传这个目录即可。

---

## 二、第 1 步：GitHub 托管（建仓库 + 发布 Release）

### 2.1 创建公开仓库
1. 登录 GitHub → 右上角 **+ → New repository**。
2. Repository name：`ai-short-drama-assistant`（与 manifest id 一致，便于识别）。
3. 选 **Public**；不要勾选 Add a README / .gitignore / license（避免与上传文件冲突）。
4. Create repository。

### 2.2 上传插件工程（Git 已装好 ✅，直接双击一键脚本）

> ✅ 当前状态：Git 已于 2026-10-19 装好（安装在 `D:\Git\Git\cmd`），**无需再装**。
> ⚠️ 为什么不用网页上传：**GitHub 网页上传（Upload files）不支持上传文件夹**，而插件有 `src\`（源码）和 `.github\`（发布配置）两个文件夹必须保留，所以网页上传这条路走不通——你之前看到的"没有选项、全是英文"就是因为它。**直接双击脚本。**

#### 操作步骤（全程不用碰命令行、不用看英文界面）
1. 打开材料包文件夹：`D:\智脑工作台\06-短剧创作库\00_产品化落地\04_发布包\Obsidian插件提审材料包_v0.2.0\`。
2. **双击 `一键上传到GitHub.bat`**，脚本自动完成：初始化仓库 → 提交全部文件 → 关联你的 GitHub 仓库 → 推送（黑窗口依次显示 [1/5]~[5/5]）。
3. 第一次推送时，GitHub 会**弹出登录窗口**（浏览器或小窗），用你的账号 `zeng198708` 登录一次即可。
4. 看到「上传完成」后，回浏览器刷新仓库页面，全部文件就在了。
5. 上传成功后**接着双击 `打标签发布v0.2.0.bat`**（见 2.4，已免去手敲命令）。

> 常见问题：
> - 脚本报 `remote ... not found`：说明你的仓库名不是 `ai-short-drama-assistant`，用记事本打开脚本，把第 11 行的仓库地址改成你实际的名字，再双击一次。
> - 黑窗口报「git 不是内部或外部命令」：脚本已内置 Git 路径兜底（`D:\Git\Git\cmd`），正常情况下不会出现；若仍出现，把报错内容发我处理。
> - 两个脚本都用完后，黑窗口最后会显示 `请按任意键继续`，按任意键即可关闭。

#### 网络连不上 GitHub 怎么办（已实测的有效方案）
> 现象：黑窗口反复报 `Failed to connect to github.com:443` / `Connection was reset`（国内访问 GitHub 的默认线路常被断）。脚本已内置自动重试 5 次，若仍失败：
1. 双击桌面 **`一键修复GitHub连接.bat`** → 弹管理员确认框点「是」→ 看到「修复完成」。原理：把 GitHub 域名固定解析到可达的香港节点 `20.205.243.166`（写入系统 hosts），绕过被断线路。
2. 重新双击 `一键上传到GitHub.bat`，即可正常推送。
3. 若换网络后仍失败：改用手机热点网络再试；或过几分钟再双击（GitHub 连接时好时坏，多试几次）。

#### 备用（网页上传，只适合补传/修改单个文件，不适合首次上传整个插件）
- 首次整体上传请勿用网页（无法传文件夹）。
- 后续补传单个文件（如只改了 `README.md`）：仓库页面 → **Add file**（右上角）→ **Upload files** → 把文件拖入虚线框 → 页面底部 **Commit changes**（绿色按钮，提交）→ 完成。
- 界面英文对照：Add file=添加文件；Upload files=上传文件；Commit changes=提交；页面顶部的 "main"=分支名（保持默认即可）。

### 2.3 开启 Actions 写权限（关键，漏了发布会失败）
1. 仓库页面顶部一排菜单找 **Settings**（齿轮，最后一项）→ 左侧菜单找 **Actions** → 点 **General**（Actions 下第一项）。
2. 滚动到 **Workflow permissions**（工作流权限）→ 选 **Read and write permissions**（读写权限，单选）→ 点页面下方 **Save**（保存）。
- 界面英文对照：Settings=设置；Actions=操作；General=常规；Workflow permissions=工作流权限；Read and write permissions=读写权限；Save=保存。

### 2.4 打版本标签，触发自动发布（双击脚本即可，免手敲命令）
1. **双击 `打标签发布v0.2.0.bat`**（材料包根目录），脚本自动完成：**重建标签 `0.2.0`**（先删旧标签再打新标签，确保指向最新提交）→ 推送到 GitHub（黑窗口显示 [1/2]→[2/2]）。
2. 回浏览器刷新仓库页面：顶部一排菜单里找 **Actions**（操作）——位置是 `Code | Issues | Pull requests | Agents | Actions | Projects | ...`，**第 5 个**就是它。点进去会看到名为 "Release Obsidian plugin" 的工作流运行记录。
3. 约 1-2 分钟跑完：**绿色对勾 = 打包成功**（橙色 = 进行中，红色× = 失败）。成功后 → 回仓库主页，**右侧栏 Releases（发行版）** → 出现一个 **Draft**（草稿）版本，已自动附带 `main.js`、`manifest.json`、`styles.css` 三个附件。
4. 点草稿右侧 **Edit**（铅笔图标）→ 填 Release notes（版本说明，如"首个社区版：六模块 9 命令，选题/立项/写作/质检/改写/投稿全流程"）→ 点 **Publish release**（发布版本）。
5. **发布成功后**才去第 2 步提审（第 3 节）。发布未完成就去提审，审核必然失败。

- 界面英文对照：Actions=操作；Releases=发行版；Draft=草稿；Edit=编辑；Publish release=发布版本；绿色对勾=成功、红色×=失败。

> ⚠️ **Actions 打包失败的排查实录（2026-10-19，已全部解决）**
> 现象：点打标签脚本后 Actions 记录 18-19 秒就红×。根因链（一次比一次旧版本组件被 GitHub 停用）：
> 1. **旧版 `actions/checkout@v3` + `actions/setup-node@v3`**：基于 Node16，GitHub 已停用 Node16 的 Action，一跑必挂（第 1 次失败）→ 已升级 v4。
> 2. **`andstor/file-existence-action@v2`**：同样是 Node16 旧组件（第 2、3 次失败）→ 已删除，改用纯命令行检查。
> 3. 最终方案 = **官方最新模板**：checkout@v4 + setup-node@v4（Node20）+ 纯 shell 检查文件存在 + `actions/attest@v4` 生成**产物来源证明（artifact attestation，提审审核必需）** + `gh release create` 建草稿。
> 结论：**以后不要手动改 `.github\workflows\release.yml` 里的组件版本**；如遇新失败，把红色步骤截图发我处理即可。当前模板已按 2026-10 官方文档校准。
> 另注意：Actions 默认权限可能是只读，若发布步骤报权限错误，去 2.3 开启 **Read and write permissions**。

> 手动替代方案（不用 Actions）：直接仓库 **Releases → Create a new release**（新建发行版），Tag 填 `0.2.0`，标题填 `0.2.0`，把 `main.js`、`manifest.json`、`styles.css` 三个文件拖入附件区后点 **Publish release** 发布。效果等同。

---

## 三、第 2 步：Obsidian Community 提审（新社区面板）

> ✅ 正确网址：**https://community.obsidian.md**（不是 obsidian.md/plugins）。登录的是 **Obsidian 账号**（不是 GitHub 账号），没有就按提示注册一个。

1. 打开 https://community.obsidian.md → 右上角 **Sign in** → 用 Obsidian 账号登录。
2. 登录后自动落在 **Community profile（社区资料页）**，左侧边栏有：Profile（资料）/ Plugins（插件）/ Themes（主题）/ Organizations（组织）/ Community site（返回社区）/ Log out（退出）。——"选择"就在这里，别在首页找。
3. 在资料页找到 **GitHub** 区块 → 点 **Connect**（连接）→ 跳转 GitHub 授权页，用 `zeng198708` 登录并同意授权（只读取用户名和公开仓库列表）。
4. 授权后若页面出现 **Available to claim**（可认领）列表 → 勾选 `ai-short-drama-assistant` → **Claim as** 选 Myself → 点 **Claim**（认领，之后它就是你名下的条目）。
5. 若列表里没有你的仓库（新插件一般不会自动列出）→ 点左侧 **Plugins** → 点 **New plugin** → 填写提交表单：
   - **GitHub repository URL**：`https://github.com/zeng198708/ai-short-drama-assistant`
   - **Owner**：选你自己
   - 勾选同意开发者政策 → 点 **Submit**（提交）
6. 提交后系统**立即自动审核**，通常几分钟内出结果；结果显示在插件详情页的 Review / Scorecard 区。

> ⚠️ 前置条件：GitHub 仓库**必须已上传成功、且已完成 0.2.0 的 Release 发布**（前面第 1 步做完），否则填了仓库地址也无法通过审核。

### 3.1 面板填报建议（对照本插件）

| 字段 | 建议填写 | 说明 |
|---|---|---|
| 插件显示名 | `AI Short Drama Assistant` | 目录要求英文命名（中文名会被拒，已实测报错）；描述里可含中文关键词便于国内搜索 |
| 描述（Description） | 沿用 manifest.json 的 description，建议再附英文一句话：`Six-module AI assistant for short-drama creators: topic scoring, project check, writing pipeline, policy red-line check, 46-item QC, de-AI rewrite, submission & novel conversion.` | 目录按关键词搜索，中英双语覆盖更广 |
| 分类（Category） | AI / Writing / Commands 等（面板提供多选标签） | 让用户能在对应分类下发现 |
| 定价标签 | **Free** | 插件本身免费且不绑定付费服务；若后续接入需付费的 API 服务，须改为 **Optional payments** |
| 作者 / Author URL | 作者名填个人名（如老曾）；Author URL 填 `https://github.com/zeng198708` | manifest.json 中 `authorUrl` 已填 GitHub 主页，面板里保持一致即可 |
| 截图 / 预览图 | 上传 2-3 张：评分面板弹窗、红线快检弹窗、生成的文件清单页面（本机已有验证截图可复用） | 详情页展示，直接影响用户安装意愿 |

---

## 四、第 3 步：自动化审核与常见失败点

### 4.1 系统会扫描什么（每个版本都审，不只首版）
- **安全漏洞扫描**（已知漏洞依赖检测）；
- **混淆代码检测**（发现混淆代码直接失败）；
- **构建产物与源码一致性校验**（`Build verified against source`：release 的 main.js 必须能用仓库源码构建复现）；
- **GitHub 产物来源认证**（artifact attestation，随 Actions 发布自动满足）；
- **恶意行为扫描**（外联域名、剪贴板访问等会作为 Disclosures 披露项展示）。

### 4.2 本插件的风险点与对策
| 风险点 | 说明 | 对策 |
|---|---|---|
| 构建一致性 | 若 release 的 main.js 不是用仓库源码构建的，会标记不一致 | 本机 `release\` 与工程根 `main.js` 均为 esbuild 产物且 selftest 通过；上传时保持源码 + 产物一致，用 Actions 发布即自动满足 |
| 外联域名 | 插件当前无任何网络请求（纯本地规则），自动扫描通过后 Disclosures 为空 | 无 |
| 剪贴板/文件访问 | 插件只读写 Vault 内笔记，属正常插件能力，会如实披露 | 无 |

### 4.3 提交失败怎么办
1. 失败详情会显示在 **Developer dashboard**（含建议/warning/失败标志），按提示修正后重新提交。
2. 本地预检工具（推荐先用，避免反复提交）：
   - **官方 ESLint 插件**：obsidian 官方 eslint 配置，本地跑一遍开发者政策检查；
   - **面板预览扫描**：dashboard 可对任意 branch / tag / commit 先跑 preview scan，不改动 Release 也能看结果。
3. 修正后重新打 tag 发布 → 自动重审。

---

## 五、第 4 步：通过后管理与后续维护

### 5.1 上架生效
- 审核 **Passed** 后，**24 小时内** App 内即可通过「设置 → 第三方插件 → 浏览」搜索到并一键安装。
- 详情页自动生成 **Scorecard**（健康分 / Review 状态 / Disclosures），用户可见。

### 5.2 版本更新流程（每次发新版都走一遍）
1. 更新 `manifest.json` 的 `version`（如 0.2.0 → 0.2.1）与 `minAppVersion`（如需）；
2. 改完源码后本地 `npm run build` 重新生成 `main.js`，跑 `node selftest.js` 全绿；
3. 提交推送 → 打新 tag（`git tag -a 0.2.1 -m "0.2.1" && git push origin 0.2.1`）；
4. Actions 自动创建新 Draft Release → 补 notes → Publish；
5. 新版本自动重审；**若新版未通过审核，24 小时内会从目录搜索移除**，需到 dashboard 查看细节并修复。

### 5.3 上架后的运营动作（配合引流）
- 插件详情页露出系统官网 / 作者主页链接（authorUrl），引导用户了解 AI短剧创作系统与后续 API 服务；
- 在 Obsidian Discord `#plugin-dev` 频道可反馈/求助；用户举报问题会触发人工复审。

---

## 六、本机物料清单（提审前核对）

| 物料 | 位置 | 状态 |
|---|---|---|
| 插件四件套 | `obsidian插件\release\ai-short-drama-assistant\`（main.js / manifest.json / README.md / styles.css） | ✅ 就绪 |
| 发布压缩包 | `04_发布包\Obsidian插件提审材料包_v0.2.0\01_插件安装包\AI短剧创作助手-obsidian-v0.2.0.zip`（15,688B，manifest 已改英文名） | ✅ 就绪 |
| 发布工作流 | `obsidian插件\.github\workflows\release.yml`（官方 2026 最新模板：v4 + Node20 + attestation） | ✅ 已修复并上传 |
| 验证证据 | `obsidian插件\六模块触发验证清单.md`（9 命令全部通过） | ✅ 已完成 |
| 示例截图 | 评分面板 / 红线快检 / 生成文件页面（验证时已截图留存） | ✅ 可作商店预览图 |
| GitHub 仓库 | `https://github.com/zeng198708/ai-short-drama-assistant`（Public，4 commits，fd3ca40） | ✅ 上传完成 |
| Actions 自动打包 | 仓库顶部 Actions → Release Obsidian plugin | ✅ 绿色通过 |
| Releases 发布 | 仓库右侧 Releases → Draft 草稿 → 填说明 → Publish | ⬜ **当前待办** |
| 社区站提审 | https://community.obsidian.md → Plugins → New plugin → Submit | ⬜ 待 Release 发布后提交 |

---

*本流程依据 Obsidian 官方 2026-05-12 公告与开发者文档整理；若面板界面有调整，以 https://obsidian.md/blog/future-of-plugins/ 与开发者文档为准。*
