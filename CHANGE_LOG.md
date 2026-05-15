# Change Log

## [2026-05-15 16:15:30]
- **Type**: Fix (AI Sidebar Layout)
- **Content**: 将 AI 侧边栏从视口级固定浮层改为主容器内部覆盖层。通过把 `#ai-sidebar` 移入 `.container`，并使用 `position: absolute; inset: 0; width: 100%; height: 100%;` 铺满容器，彻底消除主容器边缘露底问题；同时提升 AI 打开时的容器层级，避免遮罩覆盖侧栏。
- **Impact**: `newtab.html`, `styles.css`

## [2026-05-15 16:07:32]
- **Type**: Fix (AI Sidebar Layout)
- **Content**: 修复 AI 侧边栏未铺满主容器的问题。移除侧栏宽屏下的 `max-width` 限制，修正重复 `.ai-sidebar.active` 规则导致的位移覆盖，并在响应式断点中同步侧栏与主容器的宽度、顶部位置和高度，确保打开后完整覆盖主容器。
- **Impact**: `styles.css`

## [2026-05-15 15:40:00]
- **Type**: UI/UX Refactor & Robustness
- **Content**: AI 侧边栏“容器化”重构。1) 几何对齐：将 AI 侧栏调整为与主容器 `.container` 完全一致的尺寸、位置、圆角和阴影，展开后完美覆盖主容器，视觉上实现“容器模式切换”效果；2) Grid 布局加固：将侧栏结构从 Flex 重构为 Grid（auto 1fr），从底层逻辑上杜绝了 Iframe 内容加载时顶部选项卡被挤出或覆盖的 Bug；3) 材质升级：强化了顶部选项栏的背景材质与层级，确保交互的稳定性。
- **Impact**: `styles.css`

## [2026-05-15 15:05:00]
- **Type**: Interaction/UI Fix
- **Content**: 优化 AI 管理列表的交互细节。1) 修复拖拽排序：改用“手柄按下触发”逻辑（Handle-based dragging），解决了原生拖拽在复合组件上的触发失效问题，并增大了手柄点击热区；2) 视觉归一化：固定“启用”与“默认”开关的标签文字，不再随状态变动，仅通过开关颜色和位移表达状态，视觉上更显稳重。
- **Impact**: `script.js`, `styles.css`

## [2026-05-15 14:40:00]
- **Type**: Fix (Stability / Null Check)
- **Content**: 修复 AI 侧边栏、搜索功能及设置面板在 DOM 元素缺失时可能导致的 JavaScript 崩溃。通过在 `initAiSidebar`、`initSearch` 和 `initSettingsUI` 中增加防御性判空，提升了插件在不同布局下的健壮性。
- **Impact**: `script.js`

## [2026-05-15 09:24:00]
- **Type**: Fix/UI (Search Interaction)
- **Content**: 优化搜索交互体验。1) 移除了搜索引擎切换时的黑色蒙版和背景模糊效果，保持页面清晰；2) 将 Tab 键切换引擎功能扩展至全场景支持；3) 修复了搜索建议框在不同模式下宽度失控或位置偏移（被隐藏）的问题，通过 DOM 结构重组实现了全模式下的对齐。
- **Impact**: `styles.css`, `script.js`, `newtab.html`


## [2026-05-14 23:24:00]
- **Type**: Feature (Search Engine)
- **Content**: 新增 Yandex 搜索引擎支持。在搜索栏引擎下拉列表（及纯净模式的引擎快捷切换列表）中添加了 Yandex 作为可选的默认搜索引擎。
- **Impact**: `newtab.html`


## [2026-05-14 23:16:00]
- **Type**: Style (Ambient Time Spacing)
- **Content**: 修复非纯净模式下问候时钟与搜索框间距过小的问题。将 `@media (max-height: 920px)` 下 `.ambient-time` 的 `margin-bottom` 从 `10px` 放宽至 `28px`，恢复合理的视觉呼吸感。
- **Impact**: `styles.css`


## [2026-05-14 22:53:00]
- **Type**: Fix (Pure Mode Centering)
- **Content**: 彻底修复纯净模式下居中失效的问题。添加了 `!important` 提高纯净模式布局权重，避免受到平铺模式遗留的高权重规则强行左对齐的干扰；为底部提示语添加了文本居中；增加底部 10vh 内边距将整体视觉中心微调偏上，符合设计美学。
- **Impact**: `styles.css`


## [2026-05-14 22:02:00]
- **Type**: Fix (AI Sidebar)
- **Content**: 修复点击 AI 侧边栏报错的问题。由于 `newtab.html` 缺少 `ai-tabs` 等必要容器，导致 `script.js` 初始化时出现 null 引用错误。已恢复完整的 AI 侧边栏 HTML 结构。
- **Impact**: `newtab.html`

## [2026-05-14 21:53:00]
- **Type**: Fix (Settings UI)
- **Content**: 彻底修复设置弹窗 UI 样式丢失及不可滚动的问题。1) 修正错误的类名映射（`settings-content` -> `modal-content` 等）；2) 消除重复的 HTML 标签并补全缺失的“纯净模式”选项；3) 恢复移动端惯性滚动支持。
- **Impact**: `newtab.html`, `styles.css`


## [2026-05-14]
- **Time**: 2026-05-14 21:22:00 +0800
- **Type**: Style (Pure Mode Centering)
- **Content**: 优化纯净模式下的整体垂直居中布局：1) 移除搜索容器顶部的固定 `18vh` 内边距；2) 使用 `justify-content: center` 将「问候语、搜索框、底部提示」作为一个整体在屏幕垂直居中；3) 调整组内元素间距，去除多余的外边距，确保相对搜索框上下均匀分布，精准还原参考图结构。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 18:07:50 +0800
- **Type**: Feature (Pure Mode)
- **Content**: 新增“纯净模式”页面状态。1) 在右下角布局切换按钮上方增加纯净模式按钮，并持久化当前开关状态；2) 进入纯净模式后隐藏书签树与设置/布局浮动按钮，仅保留日期组件和中央搜索区；3) 将纯净模式下的搜索框重排为更接近参考图的双层暖白搜索岛布局，退出后恢复原有树状或平铺模式。
- **Impact**: `newtab.html`、`script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 17:40:00 +0800
- **Type**: Design (Settings UI)
- **Content**: 优化设置页面的视觉比例与透明度。1) 将设置弹窗的最大宽度从 `1040px` 缩小至 `820px`，使其在视觉上更聚拢，减少大面积留白带来的违和感；2) 将弹窗背景从接近实色调整为半透明玻璃态（`0.65`），使其与主界面的书签卡片风格保持一致。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 17:36:00 +0800
- **Type**: Design (Search Typography)
- **Content**: 优化搜索栏输入文本的视觉样式。将搜索框内的字体调整为**粗体（Bold）**与**斜体（Italic）**，并显著增大了字间距（`0.6px`），使其视觉风格与占位符（Placeholder）及整体精致美学更加契合。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 17:34:00 +0800
- **Type**: Design (Typography Standardization)
- **Content**: 统一全站字体规范，以“平铺模式”为基准。将全局正文字体大小（`--font-size-body`）从 `14px` 下调至 `12px`，并将字重统一设置为 `500`。同步更新了左侧导航栏（`tree-folder-item`）和目录模式下的书签标签，确保两种布局模式下的文字视觉重量完全一致，提升整体精致感。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 17:28:00 +0800
- **Type**: Design (Visual Consistency)
- **Content**: 统一目录模式（Tree Mode）与平铺模式（Flat Mode）下的卡片透明度。在启用背景图后，将目录模式下的文件夹卡片背景从实色 `#ffffff` 调整为与平铺模式一致的半透明玻璃态（`rgba(255, 255, 255, 0.55)`），并重新启用了 `backdrop-filter` 模糊效果，确保视觉语言的全局统一。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 17:24:00 +0800
- **Type**: Fix (Layout Alignment Correction)
- **Content**: 再次修正搜索栏对齐逻辑：根据用户图片标注，将搜索栏左边缘与右侧内容面板的标题（如“常用入口”）精确对齐。计算公式调整为 `var(--flat-side-gutter) + 284px (左侧栏宽度) + 24px (间距)`。此前因对“常用入口”指代理解偏差导致对齐到了左侧栏，现已修正。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 17:21:00 +0800
- **Type**: Fix (Layout Alignment)
- **Content**: 修复搜索栏与左侧“常用入口”目录没有精确左对齐的 Bug。由于此前 `--flat-side-gutter` CSS 变量作用域仅限于 `#bookmarks-tree`，导致顶部 `#search-container` 无法继承该留白变量，从而在 `flex-start` 时对齐到了视口的极左侧。现已将栅格系统变量提升至 `.container` 级别，使搜索栏与时间完美对齐至左侧目录面板（“常用入口”所在区域）的真实左边缘。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 17:16:00 +0800
- **Type**: Design (Search & Layout Typography)
- **Content**: 优化顶部搜索区域及时间组件的布局排版：1) 平铺模式下，将时间与搜索栏整体**左对齐**至右侧内容区，使视觉重心从全局居中变为与主内容网格（如 Linux.do 卡片左边缘）精确对齐，实现排版平衡；2) 将搜索栏高度增大（通过增加内边距至 20px）；3) 将搜索栏占位符文字缩小至 `14px` 并采用斜体（`italic`），增强占位符与输入文字的层次感；4) 将搜索栏与上方时间的间距从 `20px` 扩大到 `40px`，增加头部的呼吸感。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 17:09:00 +0800
- **Type**: Feature (Information Architecture)
- **Content**: 优化平铺模式下的信息层级结构：在右侧书签网格中，当出现“子目录”与“书签”混合的情况时，优先将所有“子目录卡片”渲染在前面，随后再排列“书签卡片”。这符合操作系统的经典文件管理逻辑，能有效提升用户的导航效率与视觉可预测性。
- **Impact**: `script.js`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 16:41:00 +0800
- **Type**: Design (Interaction Polish)
- **Content**: 强化右侧书签卡片的悬停感知并提升顺滑度：1) 将悬停动画的 `transition` 时间变量从 `--motion-fast` (150ms) 放缓至 `--motion-medium` (240ms)，使平移（`translateX`）与阴影的变化更加丝滑柔和；2) 将卡片 Hover 时的背景色提取为纯白 `#ffffff`，并引入更强的内发光（`inset 0 1px 0 rgba(255, 255, 255, 0.8)`）和微妙的立体投影（`0 4px 12px`），从而在不改变基础透明度的情况下，大幅增强了“被光照亮”和“浮出水面”的物理感知。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 16:37:00 +0800
- **Type**: Design (Interaction Consistency)
- **Content**: 统一左右侧悬停交互动效：将右侧书签卡片网格的 hover 效果调整为与左侧目录完全一致。移除了原有的上浮效果（`translateY(-1px)`）和外发光阴影，改为平移效果（`translateX(3px)`）与内部微光阴影（`inset 0 1px 0 rgba(255, 255, 255, 0.36)`）。深色模式也做了相应的内部高光适配。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 16:34:00 +0800
- **Type**: Design (Layout Density Optimization)
- **Content**: 优化右侧书签网格的视觉密度：将垂直间距从过宽的 `46px` 回调至更符合视觉工程学的 `24px`。24px（3个 8px 基础网格单元）能为 84px 高度的卡片提供约 28% 的留白比例，这是 UI 设计中最舒适的格式塔（Gestalt）临近原则比例。既避免了 8px 时的拥挤感，也消除了 46px 时的断层感。水平间距保持 `20px`，卡片高度保持 `84px`。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 16:32:00 +0800
- **Type**: Design (Layout Rhythm Alignment)
- **Content**: 优化右侧书签网格的视觉密度：将卡片的垂直间距从 `8px` 增加到 `46px`。这个数值完美等于“1 个左侧目录项的高度 (38px) + 1 个间距 (8px)”。通过此调整，第一排书签卡片对齐左侧第 1、2 个目录，而垂直间距占据了第 3 个目录的位置，使得第二排书签卡片完美对齐左侧第 4 个目录，实现了模块化网格节奏。水平间距同步回调至 `20px` 以平衡纵横比例。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 16:28:00 +0800
- **Type**: Design (Layout Alignment)
- **Content**: 统一左右侧网格布局的垂直节奏：1) 左侧目录：移除单项的 `margin-bottom: 2px`，统一由父容器使用 `gap: 8px` 控制间距，单项高度维持 `38px`；2) 右侧书签网格：卡片间距由 `20px 20px` 调整为 `8px 16px`（垂直间距对齐左侧的 8px），卡片高度从 `80px` 调整为 `84px`（完美对齐左侧“2 个目录项 + 1 个间距”的总高度：38+38+8=84px），实现严格的横向基线对齐。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 16:23:00 +0800
- **Type**: Design (Active State Subtraction)
- **Content**: 修复左侧目录选中状态下视觉冗余问题：移除 `.tree-folder-item.active` 的 `::before`（底部高光横线）和 `::after`（左侧指示竖线）伪元素装饰，只保留选中时的背景色与文字颜色高亮，使选中状态更加干净纯粹。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 16:19:00 +0800
- **Type**: Refactor (Subfolder Grid Unification)
- **Content**: 将平铺模式右侧内容区底部的“子目录全宽列表”融入书签卡片网格：1) JS 层将子目录从独立的 `bookmarks-pane-subfolder-list` 容器移入 `bookmarks-pane-grid`，与书签共享同一个网格布局；2) 子目录卡片复用 `.leaf-wrapper` 基础样式并增加 `--folder` 变体，通过文件夹图标底色和“N 项”角标与书签卡片区分；3) 移除原有的全宽子目录样式（`subfolder-list/item/icon/name/meta`），解决书签网格与目录列表视觉语言不统一的问题。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 16:10:00 +0800
- **Type**: Design (Visual Subtraction Overhaul)
- **Content**: 遵循 r4.chat "极致克制" 设计哲学，对界面执行全面视觉减法：1) **背景净化**：将 3 个径向渐变光斑透明度从 0.22/0.20/0.14 降至 0.04，顶部蓝光从 0.06 降至 0.02，暗角从 0.08~0.22 降至 0.02~0.06，背景色调整为更中性的 `#F7F7F5`；2) **容器拍平**：移除主容器的高光渐变层（`::before`）、内边框线（`::after`）和斜线纹理装饰，将毛玻璃模糊从 18px 降至 6px，背景改为轻量半透明白，阴影大幅弱化；3) **卡片条带移除**：移除所有书签卡片顶部的陶土色渐变装饰条（`::before`），卡片阴影从多层叠加改为极淡单层（`0 1px 3px rgba(0,0,0,0.04)`），边框混合比从 90% 降至 50%；4) **分割线弱化**：时间信息组分割线透明度从 0.06 降至 0.03；5) **Hover 克制化**：悬停上浮从 -2px 收至 -1px，移除 hover 时的主题色边框高亮，移除"未悬停项变暗"效果，所有阴影改为微增模式。深色模式同步适配。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 15:58:00 +0800
- **Type**: Design (Revert Settings Repositioning)
- **Content**: 响应用户反馈，将设置按钮重新放回屏幕右下角，位于平铺/树状模式切换按钮正下方，恢复原有的右下角悬浮控件组合堆叠顺序。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 15:56:00 +0800
- **Type**: Design (UI Polish & Layout Alignment)
- **Content**: 搜索区视觉与布局深度优化：1) 引入 `:has()` 伪类实现平铺模式下搜索栏的**动态居右对齐**，使其与右侧书签网格严格对齐中轴线，强化左栏导航、右栏搜索的分栏空间感；2) 彻底拍平 `.search-wrapper`，移除厚重的渐变高光与 Inset 阴影，重构为现代扁平纯净背景，并增加右侧呼吸边距；3) 重塑搜索引擎选择器，移除生硬的垂直分割线，改造成浅色圆角标签态，消减视觉干扰；4) 将 AI 星星按钮微调至 34px，完美嵌套于胶囊容器内。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-14]
- **Time**: 2026-05-14 15:44:00 +0800
- **Type**: Design (UI Redesign)
- **Content**: 界面视觉风格向 r4.chat 靠拢：1) 将主色调调整为更低饱和度的陶土色/灰玫瑰色，背景改为更纯净的暖白/米白色（亮色模式），并在屏幕顶部增加微弱的蓝色环境光晕；2) 增大搜索框、卡片及弹窗的圆角，使其更接近胶囊状，并使用更扩散的弥散阴影；3) 将搜索框内的 AI 按钮改造成类似 r4.chat 的圆形发送主操作按钮；4) 将右下角的设置按钮移动到右上角；5) 放大中心问候语字号并加粗，使其更具视觉焦点。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-13]
- **Time**: 2026-05-13 09:47:57 +0800
- **Type**: Chore (Merge)
- **Content**: 将分支 `sidebar-directory-polish` 合并至 `main`，同步纳入侧栏目录视觉优化、分辨率自适应与图标清晰度修复相关改动，并完成主干收敛。
- **Impact**: `styles.css`、`script.js`、`CHANGE_LOG.md`

## [2026-05-11]
- **Time**: 2026-05-11 09:56:33 +0800
- **Type**: Fix (Favicon HiDPI Sharpness)
- **Content**: 修复书签图标在 2K/4K 高分屏下模糊不精致的问题（方案 B+C）：1) 将所有书签图标的 CSS 显示尺寸从 18~26px 统一缩小至 16px，确保在 DPR=2 时物理像素（32px）不超过 favicon 源图分辨率；2) 平铺模式图标背景环 padding 从 5px 增至 8px、圆角从 10px 增至 12px，补偿缩小后的视觉面积；3) 搜索建议图标从 24px 缩至 18px；4) 移除 HiDPI 媒体查询中的 `crisp-edges` 渲染模式（会放大低分辨率图的锯齿），改为 `smooth` / `high-quality` 平滑插值；5) 字母回退头像同步缩至 16px。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-05-11]
- **Time**: 2026-05-11 09:47:49 +0800
- **Type**: Fix (Responsive Layout Overhaul)
- **Content**: 全面修复多分辨率自适应问题：1) 新增 9 个响应式 CSS 变量 token（container-padding/radius/min-h、clock-size、search-min-w、card-height/padding、search-margin-top/bottom），将容器、搜索栏、时钟、卡片等核心组件的硬编码 px 值替换为可覆盖变量；2) 补充 5 个新媒体查询断点（1280px/1024px/640px 宽度 + 800px/680px 高度），填补原有断点间的适配间隙；3) 重构现有断点（1440px/920px/1800px/1320px/899px）为统一的 token 覆盖模式；4) 设置弹窗在 1024px/640px 下增加宽度和 padding 适配；5) 极短视口（<680px 高度）自动隐藏时钟区域。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-09]
- **Time**: 2026-05-09 10:26:52 +0800
- **Type**: Fix (Resolution Adaptive Layout)
- **Content**: 修复切换屏幕分辨率后新标签页布局失衡问题：1) 搜索栏宽度由固定百分比改为 `clamp` 响应式宽度；2) 为 1440 宽度级别优化主容器边距、左右分栏与卡片网格密度；3) 增加低高度窗口（`max-height: 920px`）自适应规则，动态压缩顶部区域、树状卡片高度与间距，避免内容异常稀疏或拥挤。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-04-30]
- **Time**: 2026-04-30 17:50:00 +0800
- **Type**: Design (Flat Mode Polish)
- **Content**: 平铺模式（Card Mode）呼吸感优化：1) 网格间距从 24px 增加至 32px，列宽改为自适应流式布局（min 300px），杜绝拥挤感；2) 增大卡片圆角（28px）与内边距（24px），并将物理边框替换为更柔和的弥散投影，显著提升页面的轻盈感与高端质感。
- **Impact**: `styles.css`、`CHANGE_LOG.md`
## [2026-04-30]
- **Time**: 2026-04-30 17:46:00 +0800
- **Type**: Design (Clock Layout Refinement)
- **Content**: 空间利用率优化：将原本纵向排列的日期和格言移至大号时钟右侧并排展示。引入 `ambient-time-info-group` 容器实现细线分隔的横向排版，显著降低了顶部的垂直空间占用，使视觉锚点更加紧致、专业。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`
## [2026-04-30]
- **Time**: 2026-04-30 17:42:00 +0800
- **Type**: Design (Clock UI Upgrade)
- **Content**: 视觉重心升级：将顶部时间显示重构为“大号数字时钟”（72px），采用更现代的字体间距与投影效果，使其成为页面的核心视觉锚点，显著提升 4K 屏幕下的精致感与品牌辨识度。
- **Impact**: `styles.css`、`CHANGE_LOG.md`
## [2026-04-30]
- **Time**: 2026-04-30 17:40:00 +0800
- **Type**: Feature (Empty State UX)
- **Content**: 优化右侧面板“空文件夹”展示：当用户点击一个仅包含子文件夹、但没有直接书签的目录时，不再显示空白页面，而是展示一个精致的“空状态”引导页（包含淡化图标与操作指引），引导用户点击左侧树结构展开更深层级，提升交互闭环感。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`
## [2026-04-30]
- **Time**: 2026-04-30 17:30:00 +0800
- **Type**: Refactor (Grid Density Polish)
- **Content**: 优化满屏状态下右侧卡片的拥挤感：1) 废弃强制的 4 列硬编码布局，改用 `repeat(auto-fill, minmax(220px, 1fr))` 纯自适应流式网格，杜绝卡片过度挤压；2) 水平间距提升至 24px，垂直间距提升至 20px，赋予卡片之间充足的呼吸空间；3) 基础行高微调压缩至 86px，缩小卡片单体绝对体积；4) 为网格容器添加右侧内边距（`padding-right: 12px`），彻底解决书签过多触发下拉滚动时，最右侧卡片与滚动条边缘紧贴造成的局促感。
- **Impact**: `styles.css`、`CHANGE_LOG.md`
## [2026-04-30]
- **Time**: 2026-04-30 17:26:00 +0800
- **Type**: Refactor (Tree UI Design Polish)
- **Content**: 全面升级左侧树状目录样式以匹配右侧卡片的精致质感：1) 放弃原有的半透明叠加背景，改为“纯白高亮+微妙阴影”的微光悬浮卡片外观；2) 增大列表项圆角至 12px 并增加上下内边距，提升呼吸感；3) Hover 态增加右移 2px、Active 态增加右移 4px 的微动效，活跃指示条由渐变条改为干脆的左侧重点色线条；4) 深色模式同步适配玻璃态背景，确保对比度通透。
- **Impact**: `styles.css`、`CHANGE_LOG.md`
## [2026-04-30]
- **Time**: 2026-04-30 17:15:00 +0800
- **Type**: Refactor (Bookmark Tree List & Split View)
- **Content**: 响应用户需求，将左侧平铺模式的“书签目录”重构为“层级书签树列表”：1) 废弃原先展平的目录列表逻辑与独立的拖拽排序状态；2) 左侧使用递归 `renderFolderTree`，引入 Finder 侧边栏式折叠/展开与空文件夹显示，状态支持 `localStorage` 记忆；3) 更新样式 `.tree-folder-item` 与图标折叠按钮；4) 修改右侧视图逻辑，目前仅显示该文件夹下的直接书签（隐藏子文件夹卡片），保持界面清爽；5) 重写 Drag & Drop，左侧树与右侧网格现在直接复用 Case 3 排序逻辑，支持真实反向修改 Chrome 书签原生结构。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`
## [2026-04-30]
- **Time**: 2026-04-30 16:58:00 +0800
- **Type**: Feature (Design Enhancement — 7 Visual Upgrades)
- **Content**: 页面设计感全面提升，共 7 项改进：1) 时间显示升级为「时钟+日期+格言问候」三行结构，每日更换一句格言，时段自动切换问候语；2) 书签卡片顶部新增陶土橙色渐变条带（`::before`），hover 时条带增强，打破卡片千篇一律感；3) 平铺模式书签图标从 18px 升级至 26px 并新增圆角方形浅色背景环，增强图标存在感；4) 活跃目录项左侧指示条由 `border-left` 升级为渐变呼吸脉动条带（`activeBarPulse` 动画）；5) 搜索框升级为浮岛设计（圆角 20px、品牌色微光外环、focus 时扩散发光）；6) 主容器叠加极低不透明度 -45° 斜线纹理装饰，提升"被设计过"质感；7) 右下角浮动按钮增加品牌色微光环、hover 时设置齿轮 60° 旋转动画。所有改进已同步适配深色模式。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-04-30]
- **Time**: 2026-04-30 16:36:00 +0800
- **Type**: Fix (4K / HiDPI Sharpness Enhancement)
- **Content**: 修复 4K/Retina 屏幕下页面精致感不足的问题，共 5 项改进：1) Favicon 分辨率从硬编码 32px 改为 DPI 感知动态尺寸（`32 × devicePixelRatio`，最高 128px），消除图标在高分屏上的模糊拉伸；2) 提升边框对比度（border-color opacity 0.12→0.18），让卡片边界在高 DPI 下更清晰；3) 减少容器半透明叠加层级（bg-overlay 0.82→0.88，高光层强度降低），提升内容锐度；4) 新增 `@media (min-resolution: 192dpi)` 媒体查询，收紧阴影扩散半径、降低毛玻璃强度、启用 favicon `crisp-edges` 渲染；5) 全局 font-weight 标准化（520→500, 540→500, 620→600, 640→600, 650→700, 680→700），确保系统字体正确匹配粗细档位。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-04-25]
- **Time**: 2026-04-25 16:08:30 +0800
- **Type**: Refactor (Remove Delete Button & Auto Favicon for Custom AI)
- **Content**: 移除自定义 AI 服务卡片的"删除"按钮；为未设置图标的自定义 AI 自动从 URL 提取域名并通过 Google Favicon 服务加载原生图标。
- **Impact**: `script.js`、`CHANGE_LOG.md`

## [2026-04-25]
- **Time**: 2026-04-25 16:05:15 +0800
- **Type**: Refactor (Remove DeepSeek & Native Favicon Icons)
- **Content**: 移除 DeepSeek 预置 AI 服务（其服务端禁止 iframe 嵌入，无法在侧边栏打开）；将剩余 5 个预置 AI 的图标从手绘 SVG 改为通过 Google Favicon 服务加载的网站原生 favicon（32px），并补充 `img` 元素在图标容器与 tab 中的尺寸/圆角适配。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-04-25]
- **Time**: 2026-04-25 15:44:51 +0800
- **Type**: Fix (AI Switch Centering — Specificity Root Cause)
- **Content**: 修复"启用"开关文字始终无法居中的根因：`.setting-item label`（优先级 0,1,1）覆盖了 `.ai-provider-switch`（优先级 0,1,0）的 `display: flex` → `block`、`font-size: 12px` → `14px`，并注入了 `margin-bottom: 10px`，导致 flex 居中完全失效。修复方式：选择器提升为 `label.ai-provider-switch`（0,1,1 + 后定义赢级联），并显式补充 `margin: 0`。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-04-25]
- **Time**: 2026-04-25 11:26:40 +0800
- **Type**: Fix (AI Card Drag Handle Removal & Switch Style Unification)
- **Content**: 移除 AI 服务卡片左侧拖拽句柄元素（保留上移/下移按钮排序）；将"启用"开关从深色胶囊改为与"设为默认"按钮一致的浅色边框风格（dark: 半透明白 / light: 暖白底 + 陶土文字），修复 `inline-flex` → `flex` 确保文字水平垂直居中，补充浅色主题下 switch-indicator 可见性。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-04-25]
- **Time**: 2026-04-25 10:59:36 +0800
- **Type**: Fix (AI Settings Layout & Alignment)
- **Content**: 修复设置页 AI 服务管理区域版式混乱问题：头部 intro 区改为垂直居中对齐（`align-items: center`）；provider-item 三列 grid 右侧控制列由 `auto` 改为固定 `264px`，消除各卡片按钮宽度不一致；移除 controls 上无效的 `flex: 0 0 264px`（父级为 grid 布局），改为 `align-items: stretch` + `width: 100%` 填满 grid 单元格；endpoint 间距由 8px 收紧至 4px；按钮组 gap 由 10px 收紧至 8px，整体对齐与视觉节奏更统一。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-04-25]
- **Time**: 2026-04-25 10:45:57 +0800
- **Type**: Refactor (AI Action Controls Alignment)
- **Content**: 将 AI 服务卡片右侧操作区收敛为统一按钮系统：把“已启用/已停用”文案调整为“启用/停用”，同步统一启用开关、设为默认、上移、下移的宽度、高度、字重与网格对齐规则，避免同组控件在视觉上出现基线漂移和重心不一致的问题。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-04-25]
- **Time**: 2026-04-25 10:07:56 +0800
- **Type**: Fix (AI Panel Light Theme Contrast & Action Alignment)
- **Content**: 修复自动/浅色主题下 AI 服务管理区显色异常的问题：为头部摘要、服务卡片、说明文案、标签、URL 与新增区补充浅色主题专属对比度方案；同时统一“已启用”和“设为默认”胶囊控件的高度、内边距、盒模型与居中对齐方式，解决相邻操作按钮不在同一水平线的问题。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-04-24]
- **Time**: 2026-04-24 23:37:47 +0800
- **Type**: Fix (AI Switch Visual Centering)
- **Content**: 将 AI 服务卡片中的启用开关改为“真实 input + 自定义视觉标记”的实现方式，移除浏览器原生 checkbox 的基线干扰，确保勾选图标与“已启用/已停用”文案在胶囊按钮中真正居中对齐。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-04-24]
- **Time**: 2026-04-24 23:26:10 +0800
- **Type**: Fix (AI Toggle Alignment & DeepSeek Sidebar Fallback)
- **Content**: 修正 AI 服务卡片中“已启用/已停用”开关的图标与文字未落在同一中心线的问题；同时为 DeepSeek 增加侧边栏专属回退策略，不再尝试内嵌其会拒绝 iframe 的聊天页，而是直接展示引导说明并允许一键在新窗口打开。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-04-24]
- **Time**: 2026-04-24 23:19:00 +0800
- **Type**: Refactor (AI Settings Console Layout)
- **Content**: 将设置面板中的 AI 配置区重排为“居中控制台”版式：新增顶部摘要区显示服务总数与启用数，AI 卡片重构为身份信息 / 站点地址 / 控制操作三段式，底部新增区独立成工具面板，整体改为更稳定的单栏版心与暗色玻璃秩序布局，缓解原先横向拥挤、重心偏移和信息层级混乱的问题。
- **Impact**: `newtab.html`、`script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-04-24]
- **Time**: 2026-04-24 18:22:42 +0800
- **Type**: Refactor (Settings Modal Width Rebalance)
- **Content**: 继续放宽设置弹窗宽度策略，桌面端升级为更适合 AI 服务管理区的宽版弹窗，并为平板与小屏补充分级宽度与内边距规则，缓解服务卡片与输入表单横向空间不足、整体观感过窄的问题。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-04-24]
- **Time**: 2026-04-24 17:57:33
- **Type**: Refactor
- **Content**: 优化设置弹窗 UI：将弹窗宽度从 420px 增加至 560px；同时优化 AI 服务列表的网址显示，采用单行截断方案防止长链接破坏布局。
- **Impact**: `styles.css`

## [2026-04-24]
- **Time**: 2026-04-24 17:53:52
- **Type**: Fix
- **Content**: 修复 DeepSeek 的默认对话网址，从 `https://deepseek.com/chat` 更新为官方推荐的 `https://chat.deepseek.com/`，并同步更新权限与网络请求规则。
- **Impact**: `script.js`, `newtab.html`, `manifest.json`, `rules.json`

## [2026-04-24]
- **Time**: 2026-04-24 17:51:14 +0800
- **Type**: Refactor (AI Settings Drag Sort & Toast Feedback)
- **Content**: 为设置弹窗中的 AI 配置区补充更顺滑的交互反馈：新增卡片拖拽句柄与拖拽排序高亮，保留上移/下移按钮作为兜底；同时引入底部轻提示 toast，替代新增 AI、启停、设默认、排序、权限拒绝等场景下会打断操作流的 `alert` 提示。
- **Impact**: `newtab.html`、`script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-04-24]
- **Time**: 2026-04-24 17:38:54 +0800
- **Type**: Refactor (AI Settings Panel Polish)
- **Content**: 对设置弹窗中的 AI 配置区做一轮精修：补充“AI 服务管理”信息头，优化自定义 AI 表单层级与字段标题；同时重构 AI 服务卡片的主次操作区、标签徽标、启用开关与按钮形态，统一圆角、间距和 hover 阴影，小屏下也保持更稳定的纵向排版与按钮对齐。
- **Impact**: `newtab.html`、`script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-04-24]
- **Time**: 2026-04-24 17:07:28 +0800
- **Type**: Feature (Configurable AI Sidebar)
- **Content**: 将 AI 侧边栏从硬编码入口改为配置驱动：新增 DeepSeek 预置项，设置弹窗支持启用/停用、默认项、排序和自定义 AI 网站新增；同步接入运行时站点权限与动态 DNR 规则，使后续新增 AI 站点无需继续改源码，若目标站点无法嵌入则自动回退为弹窗打开。
- **Impact**: `manifest.json`、`newtab.html`、`rules.json`、`script.js`、`styles.css`、`CHANGE_LOG.md`

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

## [2026-04-28]
- **Time**: 2026-04-28 15:13:33 +0800
- **Type**: Chore (Merge)
- **Content**: 将分支 `feature/ai-sidebar-configurable` 合并至 `main`，同步 AI 侧栏可配置化、交互与样式相关改动，并准备主干发布。
- **Impact**: `manifest.json`、`newtab.html`、`rules.json`、`script.js`、`styles.css`、`_metadata/generated_indexed_rulesets/_ruleset1`、`CHANGE_LOG.md`

## [2026-05-06]
- **Time**: 2026-05-06 15:32:20 +0800
- **Type**: Feature (Flat Layout Content Rendering)
- **Content**: 调整右侧目录内容渲染：当当前目录无直接书签时显示可点击子目录；进入目录后同步展示“直接书签 + 子目录”（直接书签优先），并统一子目录项图标与列表视觉样式，避免空白态割裂。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-05-06]
- **Time**: 2026-05-06 15:36:43 +0800
- **Type**: Refactor (Flat Layout Visual Cleanup)
- **Content**: 移除右侧内容区“直接书签/子目录”分组提示文案，保留原有内容顺序与交互，仅做视觉减法以提升整体简洁度与一致性。
- **Impact**: `script.js`、`styles.css`、`CHANGE_LOG.md`

## [2026-05-07]
- **Time**: 2026-05-07 17:22:02 +0800
- **Type**: Refactor (Flat Layout Sidebar Visual Polish)
- **Content**: 优化左侧书签目录与右侧卡片风格一致性：重塑目录项 hover/active 的胶囊高亮、弱化激进指示条、统一图标底板与标题视觉语言，并微调目录滚动区间距与层级权重，降低“系统文件树”观感。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-07]
- **Time**: 2026-05-07 17:36:09 +0800
- **Type**: Refactor (Flat Layout Card Scale Tuning)
- **Content**: 按“小一档”方案收紧右侧书签卡片尺寸体系：下调网格最小列宽与行高，压缩卡片内边距、图标容器与文字尺寸，保持交互逻辑与信息层级不变，提升左右视觉平衡与信息密度。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-07]
- **Time**: 2026-05-07 17:45:41 +0800
- **Type**: Fix (Flat Layout Card Spacing)
- **Content**: 修正右侧书签卡片纵向间距过小导致的拥挤感：恢复网格上下间距节奏，仅保留卡片缩尺，不改变交互与信息结构。
- **Impact**: `styles.css`、`CHANGE_LOG.md`

## [2026-05-07]
- **Time**: 2026-05-07 18:19:04 +0800
- **Type**: Refactor (Ambient Time Spacing)
- **Content**: 调整搜索框上方时间区排版，增大“时间”与“日期/语录”信息组之间的水平间距与内缩，改善顶部留白节奏与可读性。
- **Impact**: `styles.css`、`CHANGE_LOG.md`
