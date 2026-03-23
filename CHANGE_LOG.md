# Change Log

## [2026-03-23]
- **Time**: 2026-03-23 18:01:00 +0800
- **Type**: Feature (Premium Icon Redesign & Bug Fix)
- **Content**: 重新设计并应用了高级 3D 质感的“丝带树”图标（精简树叶版）。修复了图像裁剪时被存为 JPEG 导致 Chrome 插件图标变灰的问题，强制转换为 True PNG 格式，并重新打包了最新版本 `v3.0.0` 发布文件。
- **Impact**: `icons/icon16.png`、`icons/icon48.png`、`icons/icon128.png`、`icon.png`、`release/小飞猪的书签_v3.0.0_20260323_1759.zip`、`CHANGE_LOG.md`

## [2026-03-23]
- **Time**: 2026-03-23 17:05:00 +0800
- **Type**: Feature (Icon Redesign)
- **Content**: 响应用户要求，重新设计插件为主体为白色、背景为纯绿色的极简艺术风格图标。使用程序化方案提取 AI 概念图的核心镂空主体，生成完全居中、去阴影的纯净方图，并替换了项目目录下 `16x16`, `48x48`, `128x128` 三个标准尺寸。
- **Impact**: `icons/icon16.png`、`icons/icon48.png`、`icons/icon128.png`

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

## [2026-03-19]
- **Time**: 2026-03-19 17:29:53 +0800
- **Type**: Refactor (Flat Layout De-clutter)
- **Content**: 执行 Phase 1 页面减负：降低容器与背景竞争度、收紧搜索区上下空间并弱化时间文案存在感；平铺模式改为更清晰的左右主次（目录窄化为单列、右侧书签卡片固定断点列数 3/2/1、卡片高度与间距提升）；目录切换改为“点击优先 + 仅细鼠标设备延迟 hover”，减少误触导致的频繁切换与视觉抖动。
- **Impact**: `styles.css`、`script.js`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 17:38:16 +0800
- **Type**: Feature (Phase 2 Directory Focus)
- **Content**: 执行 Phase 2 目录降噪与对齐优化：平铺模式新增目录“展开更多/收起”并持久化状态（默认仅展示前 8 个目录）；统一左侧目录头与右侧书签头高度基线，修复首个目录与首行书签视觉不齐；同时加大搜索栏与内容区垂直间距，提升首屏呼吸感。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 17:47:36 +0800
- **Type**: Refactor (Phase 3 Visual Polish)
- **Content**: 完成审美向视觉统一：重构浅/深色主题 token（暖米白前景 + 单一陶土强调）、弱化搜索框过度炫光并改为克制焦点环、优化容器玻璃层与边框质感、统一目录与卡片层级关系、提升书签标题与域名字体对比，整体降低“灰糊感”并增强页面气质一致性。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 17:53:14 +0800
- **Type**: Refactor (Artistic Texture Pass)
- **Content**: 完成“质感艺术”视觉通道：新增背景多层光晕与暗角叠层，容器增加柔高光与内边缘描线形成景深；搜索栏改为材质渐变玻璃并强化克制焦点环；目录与卡片统一为雾面玻璃语义（更柔圆角、更细腻阴影、更连贯 hover），整体从“组件感”提升为“氛围感”。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 18:05:36 +0800
- **Type**: Feature (Directory Ordering UX)
- **Content**: 目录功能增强：新增目录“置顶”按钮并支持一键移至同级首位；修复目录拖拽排序持久化问题（仅按目录项计算索引并写回 `chrome.bookmarks.move`，刷新后保持顺序）；优化目录悬停切换节奏（降低延迟、移除繁重过渡）使交互更灵敏且更丝滑。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 18:11:25 +0800
- **Type**: Fix (Pin-To-Top Reliability)
- **Content**: 修复目录“置顶”按钮偶发无效：将图标改为独立按钮并隔离拖拽事件，避免点击被拖拽/父层事件干扰；补充置顶移动双通道回退（先同父级 `parentId + index`，失败再仅 `index`），提升兼容性与成功率。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 18:25:29 +0800
- **Type**: Fix (Flat Directory Independent Order)
- **Content**: 重构平铺目录排序模型为扩展内独立顺序：新增 `flat_directory_order` 本地持久化；目录置顶与拖拽排序均改为更新该顺序而非改写 Chrome 书签树结构，修复“置顶后回弹”和“刷新后顺序丢失”问题。
- **Impact**: `script.js`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 18:34:33 +0800
- **Type**: Refactor (Container Transparency Control)
- **Content**: 将“主容器模糊程度”改为“主容器透明度程度”：设置面板文案与数值展示改为透明度百分比；容器滑杆逻辑从动态 `backdrop-filter` 调整为动态控制主容器背景透明度，拖动时补充平滑过渡。
- **Impact**: `newtab.html`、`script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 18:42:03 +0800
- **Type**: Fix (Scroll Compositing Stability)
- **Content**: 修复平铺模式滚动时偶发白块/未加载占位问题：移除滚动容器上的 `mask-image + translateZ + will-change` 高风险组合，简化目录与书签卡片的滚动合成层；同时为左右滚动区补充 `overscroll-behavior` 与平滑滚动参数，提升滚动连续性并降低卡顿感。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 18:44:18 +0800
- **Type**: Fix (Independent Split-Scroll)
- **Content**: 平铺模式改为左右独立滚动：固定 `#bookmarks-tree.layout-flat` 不滚动，左侧 `directory-pane` 与右侧 `bookmarks-pane` 各自管理纵向滚动；补充高度与最小高度约束，避免滚动联动与抢滚轮问题。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 18:52:45 +0800
- **Type**: Refactor (Layout Consistency & Density)
- **Content**: 优化平铺与树状一致性和密度：目录标题改为与右侧同体系的无左边框样式；树状模式对齐平铺模式的左右内容边距；平铺书签网格调整为大屏 4 列，并缩小卡片高度/内边距，保持更紧凑且不过密的间距节奏。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 18:57:48 +0800
- **Type**: Refactor (Directory Frame & Tree 4-Column)
- **Content**: 弱化平铺模式左侧目录区外层框感：移除 `directory-pane` 的明显边框与背景承载；树状模式主卡片网格改为大屏 4 列展示，并补充 3/2/1 列响应式降级，保证不同宽度下的可读性与密度平衡。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 19:02:36 +0800
- **Type**: Optimization (Directory Hover Responsiveness)
- **Content**: 优化平铺模式目录悬停跟手性：移除目录 hover 延迟定时器，改为进入即高亮并通过 `requestAnimationFrame` 调度内容区渲染，修复快速划过目录时“跳项高亮”导致的不连贯体验。
- **Impact**: `script.js`、`CHANGE_LOG.md`

## [2026-03-19]
- **Time**: 2026-03-19 19:11:27 +0800
- **Type**: Refactor (Follow-Hand Interaction Upgrade)
- **Content**: 交互体验升级：平铺模式书签卡片选中动效强化并提高跟手响应（更短过渡、更明显边框与阴影反馈）；树状模式子文件夹 hover 展开改为低延迟跟手（延迟上限 40ms）；移除树状模式子文件夹标题前的小箭头图标；同时增大平铺模式右侧列表与滚动条的安全间距，缓解贴边拥挤感。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-03-20]
- **Time**: 2026-03-20 09:37:17 +0800
- **Type**: Fix (Container Transparency-Blur Fusion)
- **Content**: 修复“主容器透明度调高但通透感不明显”问题：将主容器滑杆改为透明度与磨砂感联动映射（透明度越高，背景 alpha 越低且 blur 越小，保留最小 blur 保障可读性），并在设置项补充联动说明文案。
- **Impact**: `script.js`、`newtab.html`、`CHANGE_LOG.md`

## [2026-03-20]
- **Time**: 2026-03-20 09:42:45 +0800
- **Type**: Fix (HD Background Preservation)
- **Content**: 修复高分辨率背景图上传后易发糊问题：背景上传改为“始终先尝试原图保存”，仅在存储失败时按 6144→5120→4096→3200→2560 分级压缩回退；并在 `bg-blur=0` 时关闭滤镜路径（`filter:none`），避免 `blur(0)` 带来的额外软化。
- **Impact**: `script.js`、`CHANGE_LOG.md`

## [2026-03-20]
- **Time**: 2026-03-20 10:06:59 +0800
- **Type**: Fix (AI Sidebar Default Sync)
- **Content**: 修复 AI 侧边栏“Tab 高亮与实际加载 iframe 不一致”问题：新增统一 `syncAiState` 流程，在恢复本地偏好后同时同步 tab 高亮与 iframe 切换；并在切换时强制清理所有 iframe 的陈旧 `active` 状态，避免初始化竞态导致错位。
- **Impact**: `script.js`、`CHANGE_LOG.md`

## [2026-03-20]
- **Time**: 2026-03-20 10:53:30 +0800
- **Type**: Feature (Icon Refresh & Version 3.0.0)
- **Content**: 重绘并替换插件图标为统一“书签树”视觉风格（16/48/128 与源图一致），提升小尺寸识别度与品牌一致性；同时将项目与插件版本号统一升级到 `3.0.0`，并完成构建校验。
- **Impact**: `icon.png`、`icons/icon16.png`、`icons/icon48.png`、`icons/icon128.png`、`manifest.json`、`package.json`、`package-lock.json`、`CHANGE_LOG.md`

## [2026-03-20]
- **Time**: 2026-03-20 10:56:01 +0800
- **Type**: Fix (Flat Grid Height Consistency)
- **Content**: 修复平铺模式右侧书签列表下拉时卡片高度不一致问题：为网格增加固定自动行高并统一卡片等高布局，补齐标题单行截断约束，消除滚动过程中的行高抖动与高低错位。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-20]
- **Time**: 2026-03-20 11:03:51 +0800
- **Type**: Fix (Flat Pane Sticky Header)
- **Content**: 修复平铺模式右侧书签列表滚动时顶部信息跟随上移问题：将右侧标题/面包屑区域改为 `sticky` 固定顶部，并补充半透明背景与模糊层，确保仅列表内容滚动、顶部保持稳定可见。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-20]
- **Time**: 2026-03-20 11:07:52 +0800
- **Type**: Fix (Flat Dual Sticky Header Polish)
- **Content**: 优化平铺模式双侧固定头部表现：右侧固定标题去除白底与模糊层，恢复透明无边框视觉；左侧“书签目录”标题同步改为 `sticky` 固定，滚动目录列表时头部不再上移。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-20]
- **Time**: 2026-03-20 11:18:20 +0800
- **Type**: Fix (Flat Pane Scroll Clipping)
- **Content**: 修复平铺模式头部“穿越叠层”问题：左右面板均改为“头部 + 独立滚动体”结构（目录头/书签头固定在面板上层，列表内容在内部容器滚动），实现到顶部即被头部下缘截断，不再穿过标题区域。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-03-20]
- **Time**: 2026-03-20 11:26:25 +0800
- **Type**: Release (v3.0.0)
- **Content**: 发布 `v3.0.0`。本版本包含：1) 插件与项目版本号统一升级至 `3.0.0`；2) 插件图标重绘（16/48/128 及源图）提升小尺寸识别度与品牌一致性；3) 平铺模式滚动交互修复与稳定性增强（右侧列表等高一致、左右标题固定、头部与内容分层滚动并到顶截断）；4) 构建与发布包产出流程校验通过。
- **Impact**: `manifest.json`、`package.json`、`package-lock.json`、`icon.png`、`icons/icon16.png`、`icons/icon48.png`、`icons/icon128.png`、`script.js`、`styles.css`、`CHANGE_LOG.md`、`release/小飞猪的书签_v3.0.0_20260320_1126.zip`
