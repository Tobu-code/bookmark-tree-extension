# Change Log

## [2026-03-26]
- **Time**: 2026-03-26 17:21:06 +0800
- **Type**: Refactor (Flat Directory Width Fine-tune)
- **Content**: 按反馈对平铺模式左侧书签目录做小幅收窄微调：`directory-pane` 宽度由 `300px` 调整为 `284px`，在不改变交互结构的前提下释放右侧书签内容区空间，优化左右视觉权重。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-26]
- **Time**: 2026-03-26 17:10:20 +0800
- **Type**: Revert (Tree Header Style Alignment)
- **Content**: 按反馈回滚“树状模式顶部去分隔线”改动，恢复树状书签卡片头部原有分隔线与间距表现。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-26]
- **Time**: 2026-03-26 16:57:13 +0800
- **Type**: Fix (Flat Bookmark Title Truncation)
- **Content**: 修复平铺模式下书签标题被明显截断的问题：将书签网格行高从固定值改为 `minmax` 自适应，标题由单行省略改为两行限高显示（`line-clamp: 2`），并提前在更常见桌面宽度切换为 3 列；同时为平铺/树状/弹窗中的书签标题补充 `title` 提示，确保截断时仍可查看完整名称。
- **Impact**: `styles.css`、`script.js`、`CHANGE_LOG.md`

## [2026-03-26]
- **Time**: 2026-03-26 16:36:29 +0800
- **Type**: Refactor (Flat/Tree Density Rebalance)
- **Content**: 完成平铺与树状两种模式的密度重平衡：平铺模式收窄左侧目录列、提升外边距并限制右侧书签区最大宽度，同时拉开书签网格与卡片内间距；树状模式提高顶部与底部留白、增大卡片间距并提前在更大屏宽切换到 3 列布局，缓解左右与上下拥挤感，整体阅读节奏更松弛。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-26]
- **Time**: 2026-03-26 15:31:35 +0800
- **Type**: Fix (Tree Fullscreen Scroll White Flash)
- **Content**: 修复树状模式全屏目录在书签数量较多时上下滚动偶发白屏后延迟恢复的问题：为树状卡片增加性能护栏，滚动场景下关闭卡片毛玻璃合成并改用更稳定背景；同时移除 `card-content` 中 `translateZ/backface-visibility` 强制 3D 合成链路，保留局部绘制隔离以降低 Chrome 滚动重绘抖动。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-26]
- **Time**: 2026-03-26 15:24:27 +0800
- **Type**: Refactor (AI Sidebar Branding & Golden Ratio Width)
- **Content**: 按部署要求恢复 AI 侧栏顶部品牌一致性：调整 Google 标签名为原生命名，升级通义千问/豆包标签为更贴近原生语义的图标表达，并将“千问”文案改为“通义千问”；同时将桌面端 AI 侧栏宽度从 `60vw` 调整为 `61.8vw`（黄金分割），并适当放宽上限以匹配大屏视觉占比。
- **Impact**: `newtab.html`、`styles.css`、`script.js`、`CHANGE_LOG.md`

## [2026-03-25]
- **Time**: 2026-03-25 18:07:41 +0800
- **Type**: Fix (Tree Mode Floating Actions Overlap)
- **Content**: 修复树状模式在小屏幕下右下角操作按钮与书签目录重叠的问题：为布局切换/设置按钮引入统一安全区变量（含 `safe-area-inset-bottom`），并为 `#bookmarks-tree.layout-tree` 增加底部滚动留白与 `scroll-padding-bottom`，确保底部书签项可滚动到按钮上方完整可见；同时补充小屏与低高度窗口的按钮偏移自适应参数。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-25]
- **Time**: 2026-03-25 17:16:30 +0800
- **Type**: Fix (Tree Scroll Paint & AI Sidebar Density)
- **Content**: 修复树状模式下书签卡片滚动时偶发空白后延迟渲染问题：降低卡片毛玻璃强度，给 `card-content` 增加独立绘制上下文并移除列表项 3D/位移链路，减轻滚动中的合成压力；同时优化 AI 侧边栏融合性，收紧侧栏宽度与顶部密度（tab 间距、padding、操作按钮尺寸），缓解去缩放后“顶部过宽、割裂感强”的问题。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-25]
- **Time**: 2026-03-25 17:08:10 +0800
- **Type**: Refactor (PC Sidebar & Accessibility Polish)
- **Content**: 完成本轮 PC 端精修：AI 侧栏改为 iframe 原生 1:1 渲染（移除 0.8 缩放补偿），并同步收紧侧栏宽度、玻璃强度与头部节奏，降低嵌入割裂感；主容器高度改为 `clamp` 桌面视口策略以提升小高度窗口鲁棒性；搜索输入框补齐 `aria-autocomplete/controls/expanded`，建议列表项补充稳定 id 与 `aria-activedescendant` 联动，完善键盘选中状态的可访问性同步。
- **Impact**: `newtab.html`、`script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-03-25]
- **Time**: 2026-03-25 16:55:48 +0800
- **Type**: Refactor (PC UI Semantics & Visual Hierarchy)
- **Content**: 面向 PC 端 Chrome 新标签页场景完成一轮 UI 精修：将搜索引擎切换、搜索建议与 AI 标签改为更规范的可聚焦交互元素，补充键盘导航和 `aria` 状态同步；移除设置区与面包屑渲染中的内联样式/脚本拼接样式，改为统一类名体系；收敛悬浮按钮与 AI 侧栏视觉权重，统一焦点可见性样式，并清理未使用的遗留主题分支，提升一致性与可维护性。
- **Impact**: `newtab.html`、`script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-03-25]
- **Time**: 2026-03-25 15:55:03 +0800
- **Type**: Refactor (UI Consistency & Motion Polish)
- **Content**: 对新标签页书签界面做一轮收束型改版：统一中英文文案与 `lang` 标识，新增书签区域加载/空状态/错误状态，移除 AI 占位与图标回退中的 emoji 表达；同时统一暖色视觉语言，削弱 AI 面板、搜索框、书签卡片与悬浮按钮中过强的蓝紫色和夸张动效，补强 `prefers-reduced-motion` 与交互焦点细节，提升整体一致性与完成度。
- **Impact**: `newtab.html`、`script.js`、`styles.css`、`CHANGE_LOG.md`

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

## [2026-03-26]
- **Time**: 2026-03-26 10:24:16 +0800
- **Type**: Refactor (UI Polish / Motion System)
- **Content**: 完成作品级质感第一轮优化：新增全局动效与阴影设计令牌（时长、曲线、层级阴影、焦点环），统一搜索区/树状卡片/平铺卡片/目录项/右下浮动按钮/AI 侧栏/确认按钮的过渡节奏；收敛 hover 与 active 的位移与缩放幅度，降低高亮叠加强度，增强页面主次层级稳定性与整体高级感。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-26]
- **Time**: 2026-03-26 10:27:00 +0800
- **Type**: Refactor (Visual Hierarchy / Focus Mode)
- **Content**: 完成第二轮信息层级重排：新增搜索沉浸态与 AI 侧栏沉浸态（`search-active` / `ai-sidebar-open`）的视觉降噪规则；搜索激活时弱化书签区与浮动操作按钮，侧栏打开时自动降低主内容竞争强度并隐藏右下浮动按钮；同步优化浮动控件默认存在感（默认半低透明，hover 恢复全强度），让主焦点更稳定。
- **Impact**: `styles.css`、`script.js`、`CHANGE_LOG.md`

## [2026-03-26]
- **Time**: 2026-03-26 10:32:32 +0800
- **Type**: Refactor (Typography Density & Spacing Rhythm)
- **Content**: 完成第三轮排版密度与留白节奏优化：统一搜索区与主内容区的垂直间距；压缩平铺模式网格行高与卡片内边距，降低目录项与标题区体积；树状模式卡片尺寸、头部间距与列表行高同步收敛；并细化 `1650/1280/899/768` 断点下的密度渐进策略，提升跨尺寸浏览稳定性与高级感。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-26]
- **Time**: 2026-03-26 10:38:12 +0800
- **Type**: Refactor (Typography Hierarchy & Contrast Tuning)
- **Content**: 完成第四轮字体层级与对比度微调：新增文本层级变量（title/body/caption/micro、muted/subtle）；统一搜索输入、内容标题、目录标题、面包屑、书签标题与 URL 辅助信息的字号/字重/字距；提升弱信息在深浅主题下的可读性并降低生硬对比，整体阅读层级更清晰稳定。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-26]
- **Time**: 2026-03-26 10:43:15 +0800
- **Type**: Refactor (Interaction Final Polish)
- **Content**: 完成交互细节收官：统一焦点可视化体系（`focus-outline` + `focus-ring`）并覆盖主要交互控件；优化拖拽反馈（拖拽中、投放目标、文件夹吸附）的强度与阴影层次，降低生硬边框感；微调确认弹窗与编辑弹窗的标题权重、正文行高和阴影强度，提升可读性与操作确认感。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-26]
- **Time**: 2026-03-26 11:22:39 +0800
- **Type**: Revert
- **Content**: 按用户要求回滚提交 `0bb914f`（`fix(ui): 修复小屏浮动按钮遮挡并统一视觉细节`），撤销该次对小屏底部安全区、标题一致性与滚动条 token 的调整。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-03-26]
- **Time**: 2026-03-26 18:01:28 +0800
- **Type**: Chore (Merge)
- **Content**: 将分支 `feature/feature-ui-anlaysis-0325` 合并至 `main`，同步纳入界面分析与样式调优相关变更，并完成主干收敛。
- **Impact**: `styles.css`、`script.js`、`newtab.html`、`CHANGE_LOG.md`

## [2026-04-21]
- **Time**: 2026-04-21 21:42:38 +0800
- **Type**: Fix (Theme / Auto Mode)
- **Content**: 修复“外观选择=自动”在夜间主题下卡片与文字色彩未正确切换的问题：系统主题模式改为显式同步 `data-theme=dark|light`，并重构系统主题监听与清理逻辑，确保夜间切换即时生效且无残留监听。
- **Impact**: `script.js`、`CHANGE_LOG.md`

## [2026-04-21]
- **Time**: 2026-04-21 21:57:09 +0800
- **Type**: Feature (AI Sidebar) / Refactor (Dark Theme Tokens)
- **Content**: 新增 AI 侧栏 Kimi 入口（标签与 iframe 映射）；同步优化深色主题主色与次级文字对比度、发光色值，并提升书签标题在深色背景下可读性；调整 AI 侧栏宽度上限以提升大屏使用空间。
- **Impact**: `newtab.html`、`script.js`、`styles.css`、`CHANGE_LOG.md`
