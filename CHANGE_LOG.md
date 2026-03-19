# Change Log

## [2026-03-17]
- **Type**: Feature (Visual Haptic Feedback)
- **Content**: Added visual spring animation (`transform: scale(0.97)` on `:active`) to `.folder-tile`, `.leaf-wrapper`, and `.bookmark-card` to provide pseudo-haptic physical feedback upon user clicks.
- **Type**: BugFix (Visual Haptic Feedback)
- **Content**: Fixed an issue where the `transform: scale(0.97)` on `:active` would pull inner child buttons (like the expand button, hide icon, and bookmark actions) out from under the cursor, causing `click` events to fail. Used `:not(:has(...:hover))` pseudo-class to prevent the scale animation when the user is interacting with these specific child buttons.
- **Type**: BugFix (CSS Encoding)
- **Content**: Fixed garbled characters (`â¤¢`) showing on the card expand button on hover by replacing the literal character `⤢` with its CSS unicode escape sequence `\2922`.
- **Type**: BugFix (Flat Mode Layout)
- **Content**: Increased horizontal gaps `gap: 16px 32px;` and right-padding in the flat-mode `.directory-pane` to create a safe corridor. This prevents the mouse from accidentally triggering a hover switch to the second-column folders when the user moves diagonally from the first column into the bookmarks list pane.
- **Type**: Optimization (Visual quality)
- **Content**: Implemented three advanced aesthetic refinements: 
  - 1. Added a subtle top gradient to the main container to improve date and search bar readability on bright backgrounds.
  - 2. Applied `drop-shadow` to bookmark icons to give them better depth and visual separation.
  - 3. Added a "Hover Focus" effect that slightly dims un-hovered items in the directory and bookmark panes, enhancing focus on the current target.
- **Type**: Optimization (Flat Mode Dark Mode Adaptation)
- **Content**: Adapted Flat Mode for better visibility in Dark Mode by reinforcing header separators with brand-themed gradients, increasing pane border opacity, and improving breadcrumb readability.

## [2026-03-19]
- **Time**: 2026-03-19 16:11:44 +0800
- **Type**: Docs (Prompt Optimization)
- **Content**: 优化 `AGENTS.md` 与 `GEMINI.md` 提示词文案，强化“编码前方案确认门禁 + 执行后自动记录变更日志 + 自动提交 git”的闭环流程，并统一两份文档规则。
- **Impact**: `AGENTS.md`、`GEMINI.md`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 16:30:15 +0800
- **Type**: Optimization (Native Theme Readability)
- **Content**: 优化原生浅色/深色主题下的新标签页可读性与层级感：提升容器遮罩与文本对比、强化目录选中态、优化卡片标题与域名节奏、增强滚动条可见性，并补充书签项键盘焦点态。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 16:43:52 +0800
- **Type**: Optimization (Layout Consistency)
- **Content**: 统一平铺模式与树状模式的主容器内边距基线，消除切换割裂；下调平铺模式目录/卡片标题与域名字号字重，并收紧卡片内边距与网格间距，提升精致感。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 16:59:24 +0800
- **Type**: Optimization (Layout Transition)
- **Content**: 为树状/平铺模式切换新增统一过渡动效：容器轻微淡出缩放、内容首帧淡入上移，并仅在布局切换时触发，降低模式切换跳变感。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 16:55:23 +0800
- **Type**: Optimization (P2 Visual-First Performance)
- **Content**: 在不牺牲视觉效果的前提下完成 P2 优化：将 `styles.css` 中广域 `transition: all` 替换为显式属性过渡，减少非必要动画开销；将 `build.js` 的高强度混淆降为轻量混淆，降低脚本体积与运行时解析负担。
- **Impact**: `styles.css`、`build.js`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 16:57:20 +0800
- **Type**: Docs (Workflow Rule Update)
- **Content**: 在提示文档中新增规则：用户确认开发方案后，`CHANGE_LOG.md` 更新与 `git commit` 作为执行后闭环动作可直接执行，无需再次二次确认。
- **Impact**: `AGENTS.md`、`GEMINI.md`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 17:08:44 +0800
- **Type**: Optimization (Layout Consistency)
- **Content**: 调整平铺模式左侧基准边距，新增自适应左侧补偿（`--flat-left-gutter`），使“书签目录”模块与树状模式的主内容左边界更一致，降低模式切换时的视觉跳变。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 17:12:55 +0800
- **Type**: Optimization (Layout Symmetry)
- **Content**: 平铺模式改为左右对称内边距（`--flat-side-gutter`）以与树状模式统一边界，同时将平铺书签块最小宽度由 `220px` 微调为 `210px`，在保持观感的同时留出右侧边距空间。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 17:20:13 +0800
- **Type**: Fix (Background Image Clarity)
- **Content**: 修复背景图清晰度过低问题：上传策略改为高保真优先，先尝试保存原图，再按 4096/3840/3200/2560 分级压缩回退；同时将背景层采样策略调整为浏览器原生 `image-rendering: auto`，避免强制采样导致画质劣化。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`
