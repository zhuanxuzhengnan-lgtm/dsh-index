# dsh-index

DSH 插件索引（index format 1）+ 主题包。由 DSH「插件 → 发现」页读取。

## 索引地址

```
https://cdn.jsdelivr.net/gh/zhuanxuzhengnan-lgtm/dsh-index@main/index.json
```

备用（这台机器上 `raw.githubusercontent.com` 偶尔连不上，jsDelivr 更稳）：

```
https://raw.githubusercontent.com/zhuanxuzhengnan-lgtm/dsh-index/main/index.json
```

## 目录

```
index.json                 索引本体（format 1）
check.mjs                  用 DSH 自带校验器验证 index.json
serve.mjs                  本地静态服务（node serve.mjs 8787）
plugins/tech-theme/        主题包：git source 安装目标
```

## 现有条目

| 插件 | 版本 | 来源 |
|---|---|---|
| `@deepseek-ai/dsh-experimental-agent-team-profile` | 0.2.2-rc.1 | npm |
| `@deepseek-ai/dsh-experimental-voice-input-bundle` | 0.2.2-rc.1 | npm |
| `@local/tech-theme` | 0.1.0 | git（本仓库 `plugins/tech-theme`，锁 commit） |

## 更新流程

**发新版本的主题**

1. 改 `plugins/tech-theme/`，提交，记下这次 commit 的 40 位 SHA
2. 在 `index.json` 的 `@local/tech-theme.versions` **新增**一项（`version` 递增、`source.commit` 指向新 SHA）
3. 提交 `index.json`
4. 跑校验：`node check.mjs`

规则：**同一 version 不能换 commit**，否则已装用户会静默换内容。旧版本条目保留。

**改索引本身**（加插件、改文案）

1. 改 `index.json` → 2. `node check.mjs` 通过 → 3. 提交

## 缓存

jsDelivr 对 `@main` 有 CDN 缓存，提交后可能要等几分钟到几小时才在「发现」页生效。急着看效果就把 URL 换成
`.../dsh-index@<commit>/index.json` 这种写死版本的地址。

## 安装前提

- npm 条目：只需 registry.npmjs.org 可达。
- git 条目：安装端必须有 `git`（pnpm 要 clone），这台机器目前没装：
  `winget install --id Git.Git -e`。

## 注意

- 相对 `icon` 按索引 URL 解析，所以 `plugins/tech-theme/icon.svg` 会落到
  `https://cdn.jsdelivr.net/gh/.../plugins/tech-theme/icon.svg`（https，允许）。
- 仓库必须 public：DSH 抓索引不带任何凭据。
