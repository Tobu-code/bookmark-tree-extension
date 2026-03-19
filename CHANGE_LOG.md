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
