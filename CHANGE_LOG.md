# Change Log

## [2026-07-05 12:27:05]
- **Type**: Fix (收敛 Soft Masonry 视觉秩序)
- **Content**: 1) 收敛平铺默认随机卡片尺寸分布，减少过宽长条和不稳定比例导致的凌乱感，同时保留用户手动尺寸优先；2) 降低背景渐变雾感、顶部时间框和搜索框视觉权重，让书签列表成为主焦点；3) 调整卡片网格单元、间距、边界、阴影、图标尺寸和标题字重，使 masonry 卡片更有排布秩序；4) 降噪左侧目录选中态，减少大面积渐变，强化导航轨道稳定性；5) 同步设置模块透明度变量，避免切换主题或磨砂强度后卡片重新发白。
- **Impact**: `styles.css`, `src/03-bookmarks-items.js`, `src/06-settings.js`, `script.js`

## [2026-07-04 23:21:48]
- **Type**: Refactor (基于 Soft UI 与 Masonry Flow 彻底重构界面)
- **Content**: 1) 用全新的 soft/masonry token 化样式体系重建主页视觉，移除旧 Notion/Bento/分屏调参遗留样式层；2) 将平铺模式重构为左侧柔和目录导航与右侧 masonry 卡片流，统一卡片圆角、阴影、呼吸间距、悬停反馈和深浅色变量；3) 将树状模式同步纳入 soft card/masonry 视觉语言，覆盖目录卡、书签条目、弹窗、设置面板、AI 侧栏、浮动按钮和空状态；4) 清理平铺模式旧标题栏与域名预览 DOM，并优化默认随机卡片尺寸分布，继续保留用户手动尺寸优先；5) 纳入新增 Soft UI 与 Masonry Flow 设计资源目录。
- **Impact**: `styles.css`, `src/02-bookmarks-core.js`, `src/03-bookmarks-items.js`, `src/06-settings.js`, `script.js`, `design/soft-ui-style-pack`, `design/masonry-flow-style-pack`

## [2026-07-04 22:43:47]
- **Type**: Release (升级项目版本至 v4.0.0 并更新 README)
- **Content**: 1) 将扩展与项目版本号统一更新为 `4.0.0`；2) 重写 README，补充 v4.0.0 的平铺分屏布局、稳定默认随机卡片尺寸、主题即时切换、AI 侧栏、卡片比例优化和书签管理能力说明；3) 同步 package lock 顶部版本元数据，保持构建配置一致。
- **Impact**: `manifest.json`, `package.json`, `package-lock.json`, `README.md`

## [2026-07-04 22:27:47]
- **Type**: Fix (增强平铺右侧卡片呼吸感)
- **Content**: 将平铺模式右侧卡片网格单元从 168px 增大到 180px，gap 从 16px 增加到 18px，并同步将行高调整为 81px 以保持 `1*2` 卡片 `81*2+18=180px` 的正方形比例；同时将卡片内边距提升到 10px 12px。
- **Impact**: `styles.css`

## [2026-07-04 22:16:51]
- **Type**: Fix (对齐平铺目录与卡片顶部)
- **Content**: 移除平铺模式左侧目录滚动区的 6px 顶部补偿，使目录第一项与右侧书签卡片网格顶部基线保持一致，修复左侧目录明显偏低的问题。
- **Impact**: `styles.css`

## [2026-07-04 00:19:34]
- **Type**: Fix (放大平铺卡片网格间距)
- **Content**: 将平铺模式卡片网格 gap 从 12px 增加到 16px，并同步将行高从 78px 调整为 76px，使 `1*2` 卡片仍保持 `76*2+16=168px` 的正方形比例，同时降低卡片列表过密感。
- **Impact**: `styles.css`

## [2026-07-04 00:15:38]
- **Type**: Fix (修正平铺卡片正方比例与标题可见性)
- **Content**: 1) 将平铺网格列宽、行高和间距调整为 168px / 78px / 12px，使 `1*2` 卡片高度等于列宽，恢复正方形比例；2) 收敛平铺小卡图标尺寸和内部间距，避免图标挤压标题；3) 为高卡保留专用图标尺寸，并补全标题 line-clamp 的 overflow/line-height 规则，提升名称显示稳定性。
- **Impact**: `styles.css`

## [2026-07-04 00:04:30]
- **Type**: Feature (为平铺卡片增加稳定默认随机尺寸并修正视觉细节)
- **Content**: 1) 为平铺模式中未手动设置尺寸的目录卡片和书签卡片加入基于 ID hash 的稳定默认随机尺寸，避免卡片列表全部为标准卡片，同时不写入存储、不覆盖用户自定义尺寸；2) 将平铺时间数字改为横向居中，并继续放大日期与标语字号；3) 收敛平铺卡片图标尺寸，避免图标过大挤掉标题，并将平铺卡片圆角提升到 16px。
- **Impact**: `styles.css`, `src/02-bookmarks-core.js`, `src/03-bookmarks-items.js`, `script.js`

## [2026-07-03 23:51:04]
- **Type**: Fix (收紧平铺卡片密度并优化时间区层级)
- **Content**: 1) 增加平铺模式时间框高度并让时间数字垂直居中；2) 将日期和标语改为搜索框上方同一行展示，日期在前并提升字号与字重；3) 为平铺书签网格单独收紧列最小宽度、行高、间距和卡片内边距，降低卡片偏大的松散感，同时保留窄屏回退布局。
- **Impact**: `styles.css`

## [2026-07-03 23:42:00]
- **Type**: Fix (移动平铺日期标语并对齐目录顶部)
- **Content**: 1) 将平铺模式日期和标语从时间卡片内移到搜索框上方，使左侧时间卡片只保留大号时间；2) 让日期标语跟随右侧搜索列起点定位，并在窄屏平铺模式恢复静态布局；3) 将平铺目录顶部 padding 调整为 6px，与右侧书签卡片网格顶部基线对齐。
- **Impact**: `styles.css`

## [2026-07-03 23:32:34]
- **Type**: Fix (修正平铺顶部底边对齐与目录居中)
- **Content**: 1) 将平铺模式顶部 grid 改为底边对齐，使搜索框底边与左侧时间框底边一致；2) 将左侧目录从 padding 偏移改为内容块定宽并自动居中，避免目录在左列内偏左；3) 在 899px 以下重置目录内容宽度，保持窄屏堆叠目录可用。
- **Impact**: `styles.css`

## [2026-07-03 23:05:19]
- **Type**: Fix (将平铺时间框改为竖向多行布局)
- **Content**: 1) 修复平铺模式时间框因横向加宽导致左侧被截断的问题；2) 将平铺模式时间框改为时间单独一行、日期和标语在下方两行展示；3) 将时间框宽度限制在左列内部，并移除信息组左侧分隔线以适配竖向结构。
- **Impact**: `styles.css`

## [2026-07-03 22:55:30]
- **Type**: Fix (按截图修正平铺分屏间距与时间框换行)
- **Content**: 1) 将平铺模式左右列间距收紧约 50%，降低目录与书签卡片之间的中部空白；2) 增大平铺模式时间框宽度并禁止日期、问候文字换行；3) 为平铺目录滚动区增加左侧内缩，让目录与左边缘距离更稳，并在 899px 以下重置该缩进以保持窄屏堆叠可用。
- **Impact**: `styles.css`

## [2026-07-03 22:49:28]
- **Type**: Revert (回滚平铺分屏内容驱动宽度方案)
- **Content**: 回滚提交 `5aa442a Make flat split content-driven`，恢复平铺模式左列百分比分屏、搜索框宽度上限和原有移动端覆盖规则，撤销内容驱动左列与时间信息不换行保护相关改动。
- **Impact**: `styles.css`, `CHANGE_LOG.md`

## [2026-07-03 22:30:09]
- **Type**: Refactor (优化平铺分屏比例与顶部主体间距)
- **Content**: 1) 将平铺模式分屏比例从 30/70 调整为 28/72，让右侧书签卡片区域获得更多宽度；2) 增大左右分区间距，缓解分屏中线附近的拥挤感；3) 新增 `--flat-main-offset` 控制主体整体下移，统一增加时间框到左侧目录、搜索框到右侧卡片列表的纵向距离，并保持左右主体起始基线一致；4) 为窄屏堆叠模式单独收敛主体上间距。
- **Impact**: `styles.css`

## [2026-07-03 22:13:42]
- **Type**: Refactor (将平铺模式重构为 30/70 分屏布局)
- **Content**: 1) 新增平铺模式分屏变量，统一 `--flat-shell-width`、左列 30%、右列 70% 和左右间距；2) 将平铺模式顶部区域改为同一套两列 grid，时间卡片进入左列、搜索框进入右列并齐平；3) 将平铺模式主体区域同步改为同一套两列 grid，左侧目录占左列，右侧只保留书签卡片网格；4) 为 899px 以下视口提供上下堆叠回退，避免窄屏继续分屏。
- **Impact**: `styles.css`

## [2026-07-03 21:55:44]
- **Type**: Fix (移除平铺内容标题横线并上移卡片网格)
- **Content**: 1) 移除平铺模式 `.bookmarks-pane-header` 的背景分隔线，避免标题区形成多余横条；2) 收紧标题区域高度和底部间距，并清除网格顶部额外 padding，使下方卡片整体上移。
- **Impact**: `styles.css`

## [2026-07-03 21:50:41]
- **Type**: Fix (修复主题切换后卡片与目录颜色需刷新才更新的问题)
- **Content**: 1) 在 `applyTheme()` 写入 `data-theme` 后同步调用 `applyContainerOpacity()`，让运行时切换深浅色时立即重算 `--card-bg`、`--glass-bg` 等内联主题变量；2) 同步覆盖 `system` 模式的系统主题变化监听，避免系统深浅色变化时卡片和目录继续沿用旧主题颜色；3) 同步更新根目录运行文件 `script.js`，使本地加载扩展无需重新构建 release 包即可验证。
- **Impact**: `src/06-settings.js`, `script.js`

## [2026-07-03 21:45:00]
- **Type**: Fix (删除平铺左栏标题并修正顶部时间搜索对齐轴)
- **Content**: 1) 隐藏平铺模式左侧目录的 `.directory-pane-header`，移除“书签目录”标题行，只保留实际目录树；2) 将左侧目录内容向右微调，并去掉目录滚动区额外内边距，让目录起点更贴近主内容节奏；3) 将平铺模式顶部时间卡片和搜索框改为共享同一个内容宽度轴，使两者左边缘对齐。
- **Impact**: `styles.css`

## [2026-07-03 21:37:55]
- **Type**: Fix (移除平铺左栏容器感并统一顶部与卡片内容展示)
- **Content**: 1) 移除平铺模式左侧 `.directory-pane` 的淡底、圆角和外容器感，只保留目录项自身的选中状态；2) 调整平铺模式顶部时间卡片的横向定位，使其左边缘与搜索框左边缘对齐，同时避免影响时间卡片的脉冲动画；3) 统一平铺卡片内容为“图标 + 名称”居中展示，隐藏域名/链接预览，宽卡不再显示右侧域名胶囊。
- **Impact**: `styles.css`

## [2026-07-03 21:30:46]
- **Type**: Fix (为平铺模式左栏补回轻轨道结构并重做选中态)
- **Content**: 1) 将平铺模式左栏从完全裸露的文字列调整为轻量导航轨道，为 `.directory-pane` 补回淡底、圆角和更收敛的宽度，使左栏重新具备结构承接但不回到大白盒；2) 重做当前目录项激活样式，废弃输入框式描边，改为浅底填充加左侧细强调条，强化导航感；3) 同步微调目录头部和行高节奏，让左栏与右侧卡片区的视觉重量更接近而不脱节。
- **Impact**: `styles.css`

## [2026-07-03 21:23:44]
- **Type**: Fix (修正平铺模式左栏覆盖样式导致的白盒残留与常驻操作图标问题)
- **Content**: 1) 直接收敛 `#bookmarks-tree.layout-flat .directory-pane` 的专用覆盖层，去掉平铺模式左栏的白底、模糊和暗色渐变，让目录真正回到轻导航骨架；2) 恢复平铺模式目录项的浅底 active 态，并同步统一圆角、内边距和标题头部节奏，避免左侧继续像第二块内容面板；3) 平铺模式下的眼睛、编辑图标改为仅在 hover 或 focus 时显示，active 状态不再常驻操作入口，降低目录躁动感。
- **Impact**: `styles.css`

## [2026-07-03 21:11:10]
- **Type**: Fix (收敛小屏树状布局左侧目录体积并弱化编辑删除操作入口)
- **Content**: 1) 左侧目录去卡片化：移除了树状模式 `.directory-pane` 的外边框、厚背景、毛玻璃和悬浮阴影，收窄侧栏宽度与内边距，让目录从独立大白盒回归轻量导航骨架；2) 目录层级重建：为 `.tree-folder-item.active` 恢复浅底选中态，并同步收紧行高、图标尺寸和标题头部间距，使小屏下目录密度更稳；3) 操作入口降权：将目录项操作、目录卡片头部按钮、书签卡片编辑删除按钮统一改为 hover 或 focus 才显现，缩小按钮尺寸并降低默认对比度，删除操作继续保留但视觉上退到次级层。
- **Impact**: `styles.css`

## [2026-07-03 20:42:00]
- **Type**: Feature (为小屏幕重构全站容器高度与网格间距的百分比自适应体系)
- **Content**: 1) 侧边栏与布局解耦：废弃了左侧 `.directory-pane` 固定的 260px 宽度、40px 固定高度计算与 20px 硬编码边距，改为基于视口百分比的 `width: clamp(200px, 18vw, 260px)`、`height: calc(100% - 4vh)` 以及 `margin: 2vh 0 2vh 2.5vw` 弹性呼吸布局；2) 网页头部微缩自适应：时钟与搜索框容器 `#search-container` 的 `padding-top` 改为基于视口高度的 `clamp(24px, 6.5vh, 80px)`，在小高度屏幕下自动收缩，释放主网格展示空间；3) 响应式 Gap 间距体系：平铺网格与树状卡片网格的 gap 均升级为 `clamp(12px, 1.8vw, 24px)`，并将平铺网格设为 `width: 100%` 以 `4vw` 百分比内边距提供侧边留白，彻底消除了小屏幕下布局拥挤、错落凌乱的视觉痛点。
- **Impact**: `styles.css`

## [2026-07-03 18:23:00]
- **Type**: Fix (修复嵌套3D悬浮冲突引起的卡片内书签高频震颤抽搐Bug)
- **Content**: 1) 解决嵌套物理悬浮冲突：在 `initMagneticHover` 中将 `.leaf-wrapper` 范围限定为 `.bookmarks-pane-grid .leaf-wrapper`，排除了嵌套在树状大卡片（`.bookmark-card`）内部的书签条目（`.leaf-wrapper`），避免了子级与父级 3D 变换相互拉扯；2) 引入无抖动静态缓存：在鼠标移入目标时，通过 `getBoundingClientRect()` 缓存下其未发生倾斜的 pristine 初始包围盒坐标，避免在 `mousemove` 周期中高频计算跳变的相对坐标，彻底消除了反馈振荡环，使得 3D 偏转极度平滑顺畅。
- **Impact**: `src/09-ui-widgets.js`, `styles.css`

## [2026-07-03 18:19:00]
- **Type**: Fix (修复首次进入页面右侧书签栏为空白而没有激活首个目录的Bug)
- **Content**: 1) 首个目录默认激活：在初始化激活 ID 时，不再写死为 `1`（因为 `bookmarksBar` 仅为大容器并不实际渲染在侧边栏上，子节点如“常用入口”才是首个渲染目录）。重构后会自动获取子目录树中的绝对首个渲染节点 `bookmarksBar.children.find(child => child.children)` 并提取其 ID 作为默认激活项；2) 解决了用户进入页面后无任何选中项、右侧面板呈全白色的逻辑漏洞。
- **Impact**: `src/02-bookmarks-core.js`

## [2026-07-03 18:17:00]
- **Type**: Fix (修复多层渐变背景下的描边遮挡与修改布局后重回常用目录问题)
- **Content**: 1) 解耦多背景语法陷阱：在 `.search-wrapper` 中将 `background-color` 与多重 `linear-gradient` 背景图完全拆开声明，使输入框底色不再被 background-size 影响，彻底修复了描边不生效的问题；2) 全局激活目录持久化：在 `window.CURRENT_ACTIVE_FOLDER_ID` 中缓存了当前正在浏览的文件夹 ID。并在 `renderFlatBookmarks` 开始阶段先进行存在性校验，重绘时自动导航回之前浏览的深层子目录节点，彻底解决了修改卡片大小时页面被强行刷新跳转回顶层常用入口的痛点。
- **Impact**: `src/02-bookmarks-core.js`, `styles.css`

## [2026-07-03 18:13:00]
- **Type**: Feature (为搜索框聚焦状态引入顺时针流光边框描边特效)
- **Content**: 1) 搜索框流光描边：在 `.search-wrapper:focus-within` 聚焦时，通过 CSS background-size 将 top-right-bottom-left 四个边的 linear-gradient 背景线在 600ms 内平滑展开，完成极具呼吸科技感的顺时针边框描边环绕；2) 智能主题色彩适配：废弃了案例中的固定蓝色，改用自适应当前主题主基调的 `--primary-color`（珊瑚橙），并搭配柔和的 `color-mix` 扩散发光圈，使描边效果与系统 UI 高度和谐统一。
- **Impact**: `styles.css`

## [2026-07-03 18:10:00]
- **Type**: Fix (将3D悬浮复用到侧边栏书签目录并彻底修复卡片图标模糊Bug)
- **Content**: 1) 书签目录 3D 悬浮复用：将左侧侧边栏 `.tree-folder-item` 全面纳入 3D 倾斜和伪元素跟手扫光动画体系，并专门针对其扁长盒模型特异化微调了偏转角度（限制为最大 4 度）及磁吸位移因子（限制为 0.05 倍），确保平滑舒适；2) 彻底修复卡片图标拉伸模糊：移除了 `createBookmarkIcon` 在 DOM 生成阶段写死 `width: 16px; height: 16px` 的行内 Style 限制，使其能完全采用从 chrome favicon 获取的 64px 高清源，并在大卡片（36px）和普通卡片（16px）上实现高保真 Retina 超采样渲染。
- **Impact**: `src/03-bookmarks-items.js`, `src/09-ui-widgets.js`, `styles.css`

## [2026-07-03 18:07:00]
- **Type**: Feature (实现卡片3D Perspective透视倾斜和鼠标跟随扫光动效)
- **Content**: 1) 引入 3D 物理倾斜：在卡片和文件夹网格容器上加入 `perspective: 1000px`，并将磁吸平移与基于 dx/dy 的 3D rotateX/rotateY 偏转夹角（最大 8 度）以及 `scale3d(1.02, 1.02, 1.02)` 缩放进行矩阵叠加；2) 实现 ::after 伪元素扫光：免除 DOM 修改，使用 CSS 变量 `--mouse-x` 和 `--mouse-y` 结合 `radial-gradient` 伪元素实现了跟手白润扫光；3) 浅色主题暗光优化：浅色模式下扫光自动切换为黑色光芒阴影（rgba(0, 0, 0, 0.04)），并为 `prefers-reduced-motion` 提供降级重置。
- **Impact**: `src/09-ui-widgets.js`, `styles.css`

## [2026-07-03 18:03:00]
- **Type**: Feature (为顶部时间和标语容器引入毛玻璃胶囊卡片与脉搏跳动呼吸光晕特效)
- **Content**: 1) 引入 @keyframes pulse 动画：定义了 `0% -> 50% -> 100%` 的 scale 及蓝色 rgba(59, 130, 246) box-shadow 发光圈扩散扩散动画；2) 升级毛玻璃胶囊容器：将原有纯文字 `.ambient-time` 升级为物理实体的微磨砂半透明圆角胶囊卡片（`padding: 10px 18px`），以支撑脉搏光晕从胶囊边缘完美、顺滑地向外晕染扩散；3) 视觉与可访问性调优：优化了时间数字与标语信息的高度居中对齐，并加入了 `prefers-reduced-motion` 减弱动效响应。
- **Impact**: `styles.css`

## [2026-07-03 17:59:00]
- **Type**: Feature (实现卡片和网址项的苹果级高阻尼磁吸悬浮物理动效)
- **Content**: 1) 全局事件委托磁吸监听：在 `src/09-ui-widgets.js` 中利用 document 高频 mousemove 事件委托，实时计算光标与最近 `.leaf-wrapper` 或 `.bookmark-card` 中心的偏离偏移，乘以 0.12 的系数驱动元素在悬停时发生磁吸移位；2) 引入物理阻尼回弹过渡：为卡片配置了 `0.4s cubic-bezier(0.25, 1, 0.5, 1)` 的黄金阻尼曲线，让鼠标离开卡片时的回弹平滑优美；3) 移动端与帧率优化：通过 `will-change: transform` 降低重排开销，并在移动状态下强行覆盖为极短的跟手 `0.08s ease-out` 渐变，达成流畅饱满的悬浮磁吸动效。
- **Impact**: `src/09-ui-widgets.js`, `styles.css`

## [2026-07-03 17:54:00]
- **Type**: Fix (恢复 1*1 卡片默认分行展示并升级九宫格数字大小布局体系)
- **Content**: 1) 恢复默认分行对齐：移除了对 `1*1` 尺寸强制 `row` 横向排列的局限设定，使手动设定 `1*1` 以及默认尺寸卡片完美回归“图标在上、名称和域名在下”的精美纵向分行对齐，彻底解决了普通书签拥挤在单行的问题；2) 升级九宫格尺寸体系：下拉菜单与 CSS 样式集升级为“1*1, 1*2, 2*1, 2*2, 1*3, 3*1, 3*2, 2*3, 3*3”九种规格；3) 宽长卡片大图标渲染：令 1*3 纵向高度卡片同样共享 Rule 3 大图标居中纵向排版规范。
- **Impact**: `newtab.html`, `styles.css`

## [2026-07-03 17:48:00]
- **Type**: Fix (使用!important强特异度样式确保手动设定尺寸绝对生效不被默认自动布局覆盖)
- **Content**: 1) 修复优先级覆盖冲突：由于 CSS 特异度规则，原本的自动 Bento 网格规则（如 `7n+1`、`7n+5` 和文件夹默认卡片样式）拥有更高的选择器特异度，这强行重写了手动选择 of `layout-size-X-Y` 类名；2) 引入 !important 强力隔离：为所有手动指定的 `.layout-size-X-Y` 宽高网格样式追加了 `!important` 设定，直接屏蔽了所有默认自动 Bento 规则的干扰；3) 横向卡片对齐强力纠偏：为高度为 1 的自定义尺寸卡片（`1*1`, `2*1`, `3*1`, `4*1`）引入了完整的 `!important` 横向 row 弹性布局重置，彻底纠正了“卡片被改小了但里面的大图标依然按纵向拉伸”的排版 Bug。
- **Impact**: `styles.css`

## [2026-07-03 17:41:00]
- **Type**: Feature (将卡片布局模式升级为以宽为标准的 1*1 至 4*2 数字栅格选择)
- **Content**: 1) 栅格体系数字重构：抛弃以往“大/小/正方形”模糊代称，改用以常规卡片宽为标准单位的直观比例标识。在编辑下拉框中提供了“1*1, 1*2, 2*1, 2*2, 3*1, 3*2, 4*1, 4*2”共八种 Bento 数字栅格组合；2) 精确样式绑定：将类名规范生成为 `layout-size-X-Y` 格式。平铺模式和树形模式下的所有大小映射通过 CSS Grid 精准承接；3) 纵向排版绑定：将 1*2 卡片（即原 Z.ai 正方形长宽比）完全绑定至高 Retina 大图标纵向居中排版规则。
- **Impact**: `newtab.html`, `styles.css`, `src/02-bookmarks-core.js`, `src/03-bookmarks-items.js`, `script.js`

## [2026-07-03 17:35:00]
- **Type**: Fix (修复正方形卡片尺寸和纵向排版以保持与Z.ai设计规格一致)
- **Content**: 1) 融合正方形排版：将自定义 `.card--square` 正方形卡片样式无缝融入到 `7n+5` 大图标的纵向布局规则中；2) 实现美观的纵向对齐：令设置为正方形的书签或文件夹卡片自动拥有大图标居中显示、标题换行以及微小域名居中的精美纵向排版（等同于 Z.ai 规格），拒绝空旷的大文本横铺排列。
- **Impact**: `styles.css`

## [2026-07-03 17:32:00]
- **Type**: Fix (打通 build.js 编译链对根目录 script.js 的实时同步并修复重绘逻辑)
- **Content**: 1) 修复编译链同步：在 `build.js` 合并 `src/` 模块后，自动执行 `fs.writeFile` 写回项目根目录下的 `script.js` 开发版文件，解决了此前因 Chrome 扩展直接加载根目录文件而导致“改动无法在解压版扩展程序中生效”的底层编译 Bug；2) 修复重绘未触发：补全了 `src/03-bookmarks-items.js` 中保存布局尺寸后未向 `refreshBookmarkTreeCache` 传参的回调，正式传入 `(tree) => renderBookmarks(tree)`，实现了编辑后秒级无缝重绘卡片；3) 正方形布局入库：添加了各选项下对 `square` 的解析支持，清除了每次更新时的多余类名干扰。
- **Impact**: `build.js`, `src/03-bookmarks-items.js`, `script.js`

## [2026-07-03 17:27:00]
- **Type**: Feature (实现卡片自定义正方形布局大小并修复编辑重绘和入口遮挡)
- **Content**: 1) 新增正方形卡片尺寸选项：在编辑弹窗的“卡片布局大小”中新增“正方形卡片”选项。树形模式下占 1×1 保持经典比率，平铺模式下占 1×2（`grid-row: span 2`）呈现真正的 Bento 正方形；2) 彻底修复重绘未生效：在保存自定义大小修改并更新 `chrome.storage.local` 后，将 `renderBookmarks(tree)` 作为回调传入 `refreshBookmarkTreeCache` 执行，保证大小切换瞬间生效，无需手动刷新页面；3) 解决大卡片右上角操作入口缺失：用 FlexBox 按钮组（`.card-header-actions`）重新实现大卡片右上角的对齐，彻底废除绝对定位（`position: absolute`）的重叠布局，将“编辑目录”按钮和“放大查看”按钮规范放置在 Header 右侧，彻底解决了操作按钮被遮挡和尺寸失效的问题。
- **Impact**: `newtab.html`, `styles.css`, `src/02-bookmarks-core.js`, `src/03-bookmarks-items.js`, `script.js`

## [2026-07-03 17:18:00]
- **Type**: Feature (实现卡片自定义布局大小控制功能并下放到编辑弹窗)
- **Content**: 1) 卡片尺寸选项下放：在编辑弹窗（`newtab.html`）中新增“卡片布局大小”下拉菜单，提供“默认 / 小卡片（占1列） / 大卡片（占2列）”选项；2) 智能数据持久化：采用 `chrome.storage.local` 持久化存储每个卡片的尺寸（`BOOKMARK_CARD_SIZES`），并实现了与原书签重命名/修改操作在 AbortController 控制下的统一保存与实时刷新重绘；3) 顶层卡片与平铺卡片布局扩展：支持树形布局的文件夹大卡片（`.bookmark-card`）与平铺布局的普通书签/文件夹项（`.leaf-wrapper`）对自定义尺寸的渲染，平铺模式下的大卡片会自动占 2 列（`grid-column: span 2`）；4) 目录树操作闭环：在左侧目录树中的每一项（`.tree-folder-item`）右侧新增“编辑目录”按钮，并可在右上角点击大卡片的“编辑目录”图标，在任何地方快捷调整标题或大小。
- **Impact**: `newtab.html`, `styles.css`, `src/01-constants.js`, `src/02-bookmarks-core.js`, `src/03-bookmarks-items.js`, `script.js`

## [2026-07-03 17:03:00]
- **Type**: Fix (彻底根除卡片磨砂层在进入页面和切换模式时的透明闪烁)
- **Content**: 1) 取消页面加载的 opacity 渐变：将 `.container` 初始 `opacity` 锁定为 `1` 并去除渐变属性，移除了 `body.loaded .container` 对透明度的干预，从而确保初始渲染时卡片的 `backdrop-filter` 立即显示，不会在页面载入时产生闪烁；2) 取消切换模式和区域的 opacity 渐变：移除了 `#bookmarks-tree` 基础定义中的 `opacity` 过渡属性，并删除了 `body.layout-switching #bookmarks-tree` 的 `opacity: 0.88` 状态。由于完全解除了过渡期透明度非 1 的设定，浏览器不会在切换时卸载毛玻璃合成层，彻底消灭了“模式切换时卡片瞬间变透明再还原”的违和感。
- **Impact**: `styles.css`

## [2026-07-03 16:58:00]
- **Type**: Fix (修复布局切换和搜索激活时的磨砂层闪烁并扩展搜索栏宽度)
- **Content**: 1) 消除模式切换透明闪烁：移除 `@keyframes layoutSwitchFadeIn` 中将透明度从 0 到 1 渐变的代码，使磨砂材质在切换时连贯显示，只保留顺滑的小像素上升（`translateY(4px)`）与微弱缩放；2) 消除搜索激活毛玻璃失效：移除了 `body.search-active #bookmarks-tree` 的 `opacity: 0.95` 规则，完美规避了现代浏览器“半透明下 backdrop-filter 失效变成透明”的合成层 Bug，点击搜索框时磨砂感保持完好；3) 搜索框拉宽：将 `.search-wrapper` 基础宽度上限从 `620px` 拓宽至 `780px`（`clamp(var(--search-min-w), 50vw, 780px)`），平铺模式同步扩展，大屏视觉更舒展、大气。
- **Impact**: `styles.css`

## [2026-07-03 16:52:00]
- **Type**: Feature (彻底修复树形模式滚动局限与平铺模式胶囊目录舱升级)
- **Content**: 1) 双保险解开全局滚动：不仅对根容器 `.container` 设置自适应，还在有 `#bookmarks-tree.layout-tree` 存在时将 `html` 和 `body` 元素的 `overflow-y` 设置为 `auto !important`，彻底消除了深层嵌套导致的整页滚动死锁；2) 悬浮胶囊目录舱：重构平铺模式下左侧的书签目录面板 `.directory-pane`，取消了原本和右侧直切的 `border-right` 直线边界，为面板上下留空各 `20px`（`height: calc(100% - 40px)`）、增加 `margin`、统一应用 `border-radius: 20px` 四周细框线与磨砂投影，改造成一个独立精致的圆角胶囊悬浮舱，并为右侧留出 `20px` 呼吸间距，视觉融合度大幅跃升。
- **Impact**: `styles.css`

## [2026-07-03 16:46:30]
- **Type**: Feature (实现树形模式全屏滚动与全局自适应卡片磨砂感调节)
- **Content**: 1) 解锁全屏滚动：重构树状模式下的滚动机制，将滚动条外提到网页根容器 `.container` 上（`overflow-y: auto; height: auto;`），并将 `#bookmarks-tree` 高度和内卷滚动限制移除（`overflow-y: visible;`），实现鼠标在屏幕任何位置均能使用滚轮滑动网页；2) 全局柔和磨砂底色：将原本纯白的硬背景调整为半透明柔和色，并在 `.bookmark-card`、`.directory-pane` 和网格卡片上挂载毛玻璃模糊（`backdrop-filter: blur(var(--glass-blur))`），使卡片美观透气；3) 滑块磨砂绑定：修改透明度滑块在 `src/06-settings.js` 和 `script.js` 中的逻辑，使其直接通过改变 `:root` 变量（`--card-bg`, `--glass-bg`, `--glass-blur`）来动态遥控全局所有卡片和左侧目录树的透明度与模糊程度，彻底解决主容器被弃用后滑块失效的问题。
- **Impact**: `newtab.html`, `styles.css`, `src/06-settings.js`, `script.js`

## [2026-07-03 16:34:00]
- **Type**: Fix (修复右下角设置按钮的拟物化遗留风格)
- **Content**: 统一右下角悬浮控制台质感：在 `styles.css` 中，彻底清除了 `#settings-btn` 针对 dark 主题和系统 dark 媒体查询的紫色硬编码有色渐变覆盖；重构设置按钮的基础样式，移除金属古铜金盘、粗边框和高亮投影，将其重构为与其他控制按钮高度统一的 12px 圆角正方形、白色磨砂玻璃背景（`var(--glass-bg)`）及轻柔阴影，实现高档磨砂视觉的绝对统一。
- **Impact**: `styles.css`

## [2026-07-03 16:30:50]
- **Type**: Feature (实现树形模式下包含子目录时自动变大卡片的智能自适应排版)
- **Content**: 智能判定与卡片自适应：1) 在 `src/03-bookmarks-items.js` 和 `script.js` 的 `createBookmarkCard` 方法中，新增对子文件夹的动态探测逻辑。如果当前渲染 of 顶层文件夹包含任何下一级目录，则自动为卡片容器添加 `.card--large` 类；若只含有普通书签，则不添加类，以此自动识别目录层级深度；2) 重构 `styles.css`，废弃原本机械的 `.top-level-container .bookmark-card:nth-child(4n+1)` 顺序大卡片规则，改为按动态类名生效：`.top-level-container .bookmark-card.card--large { grid-column: span 2; }`，完成自适应大卡片重映射。
- **Impact**: `src/03-bookmarks-items.js`, `script.js`, `styles.css`

## [2026-07-03 16:26:30]
- **Type**: Refactor (优化右侧卡片网格间距以增强呼吸感)
- **Content**: 提升视觉呼吸感：在 `styles.css` 中，将右侧 `.bookmarks-pane-grid` 的默认卡片间距由 `16px` 增大为 `20px`；同时在小于 1440px 宽的小分辨率下，将卡片间距由 `16px` 微调为 `18px`，让整个 Bento 网格更加透气美观。
- **Impact**: `styles.css`

## [2026-07-03 16:22:30]
- **Type**: Fix (彻底删除拟物遗留代码并修复背景自适应)
- **Content**: 1) 背景图自适应贴合：在 `#background-layer` 的 CSS 定义中补齐 `background-size: cover; background-position: center; background-repeat: no-repeat;`，彻底解决了用户上传自定义高清壁纸被局部放大且不贴合屏幕边缘的问题；2) 彻底剔除拟物设计残留：清理并废弃 `.tree-folder-item` 原本的 `Skeuomorphic`（拟物风格）背景纸张渐变、1px 褐色框线和立体投影阴影，将其默认态重构为干净透明、无缝融入壁纸的 Notion 极简玻璃风；3) 简化平铺覆盖：移除平铺模式下左侧项额外的拟物暖黄色背景覆盖，使得悬浮高亮指示器能够完美显示而不被遮挡。
- **Impact**: `styles.css`

## [2026-07-03 15:03:00]
- **Type**: Fix (修复右侧面板起始高度随卡片数量抖动不平齐的问题)
- **Content**: 锁定起始排版：1) 在 `styles.css` 中将 `.bookmarks-pane` 容器的 `justify-content` 属性由 `center` 修改为 `flex-start`。彻底消除了因不同文件夹下书签卡片数量不一导致的内容区整体垂直居中、起始高度上下抖动跳跃的视觉缺陷，使其恒久固定在顶部与左侧的“书签目录”Header 处于同一条 32px 的水平线上对齐开始渲染；2) 将书签卡片与文件夹卡片完整恢复为饱满的 82px 固定高度垂直排版（Bento 经典 12px 圆角、图标居中在上、文字在下、url 预览全部恢复），保留了大卡片的方块质感。
- **Impact**: `styles.css`

## [2026-07-03 14:55:00]
- **Type**: Fix (精细校准卡片高度与重写请求头权限支持)
- **Content**: 1) 将 `styles.css` 中平铺网格的行高由自适应的 `minmax(78px, auto)` 彻底修改为固定的 `grid-auto-rows: 82px;`，解决了因长文字卡片折行导致百分比高度失效、高度参差不齐的问题，强制所有卡片高度绝对固定为 82px 对齐；2) 在 `manifest.json` 中补齐了 `"declarativeNetRequestWithHostAccess"` 权限，用以在底层完全授权对 Origin 和 Referer 等安全请求头的修改。
- **Impact**: `manifest.json`, `styles.css`

## [2026-07-03 14:49:00]
- **Type**: Fix (修复 Claude.ai 侧栏401错误、卡片固定高度与左右标题水平对齐)
- **Content**: 视觉与引擎双重提效：1) 在 `rules.json` 中，针对 `claude.ai` 的两条 DNR 规则新增 `requestHeaders` 拦截改写，强行伪装请求头中的 `Origin` 为 `https://claude.ai`，`Referer` 为 `https://claude.ai/`，绕过了服务端的跨域 401 盾牌，彻底恢复侧栏中 Claude 会话与模型加载；2) 从 `styles.css` 中完全删除了常规书签第 `6n+4` 项的纵向 span 2 高窄卡片属性及相应排版，使右侧卡片高度完全统一为常规单倍高度（78px）；3) 将左侧 `.directory-pane` 的 `padding-top` 修正为与右侧一致 the `32px`，底 `padding` 修正为 `8px`，实现左侧“书签目录”标题与右侧分类目录标题的 Y 轴完全平齐对齐。
- **Impact**: `rules.json`, `styles.css`

## [2026-07-03 14:39:00]
- **Type**: Fix (恢复搜索框通用Flex排版并追加Bento尾部缓冲对齐)
- **Content**: 完美样式校准：1) 补回通用的 `.search-top-row` 的 `display: contents;` 规则，修复因删除纯净模式时遗漏的子容器块级阻断，使其完美恢复为单行胶囊搜索框；2) 在 `styles.css` 的 Bento 网格定义中，为文件夹卡片、`6n+1` 扁卡片、`6n+4` 高卡片追加安全防护过滤 `:not(:last-child):not(:nth-last-child(-n+4))`，强制倒数末尾几项退化为规整的 `1x1` 常规卡片，彻底消灭末端产生单独一行突出或跳格的不齐瑕疵。
- **Impact**: `styles.css`

## [2026-07-03 14:31:00]
- **Type**: Fix (修复 initGreeting 缺失导致的白屏报错)
- **Content**: 消除遗漏的失效调用：在 `src/01-constants.js` 的 DOMContentLoaded 加载事件中删除了已被解耦清除的 `initGreeting()` 函数调用，解决了由于找不到引用导致的 JS Uncaught ReferenceError 页面阻断报错。
- **Impact**: `src/01-constants.js`, `script.js`

## [2026-07-03 14:28:00]
- **Type**: Chore (彻底删除纯净模式相关代码与UI元素)
- **Content**: 满足极简减法重构：1) 在 `newtab.html` 中移除 `.pure-greeting-group` 时钟问候容器、`#pure-engine-list` 底部搜索行、`#pure-memo` 备忘录及 `.pure-footer-hint`；2) 在 `styles.css` 中清除约 800 行以 `body.pure-mode` 开头的隐藏控制、组件布局和移动端覆盖样式；3) 在 `src/` JS 模块中彻底剥离 `PURE_MODE_ENABLED` 变量、`togglePureMode` 及 `applyPureModeState` 函数，并清空了 `initPureTime` / `initPureShortcuts` / `initPureMemo` 备忘录核心业务逻辑；4) 重新打包构建生成完全瘦身的 `script.js`。
- **Impact**: `newtab.html`, `styles.css`, `script.js`, `src/01-constants.js`, `src/05-modal-search.js`, `src/09-ui-widgets.js`

## [2026-07-03 14:08:00]
- **Type**: Fix (优化Bento高宽比与时间搜索框胶囊设计)
- **Content**: 持续迭代版式体验：1) 将平铺模式中庞大笨重的 `2x2` 书签卡片重组为 `1x2` 高窄书签卡片（`span 1` 宽且 `span 2` 高），与文件夹 `2x1` 及普通 `1x1` 书签形成高低错落拼图，视觉更加紧凑；2) 加宽左侧目录栏平铺 `padding-left` 至 `48px`，拉开侧栏树安全缓冲；3) 搜索顶栏整体下移（`padding-top: 76px;`）开阔留白；4) 搜索框做高大/宽窄药丸胶囊化改造（`min-height: 52px; border-radius: 26px; max-width: 620px;`）。
- **Impact**: `styles.css`

## [2026-07-03 14:01:25]
- **Type**: Fix (优化侧栏呼吸间距与2x2方形卡片回填对齐)
- **Content**: 满足精细版式微调：1) 增加平铺侧栏 `#bookmarks-tree.layout-flat .directory-pane` 的左边距（`padding-left: 36px; padding-right: 18px;`），拉开与浏览器物理边缘的距离，解决点击局促感；2) 在右侧平铺网格中恢复第 `6n+4` 项的 `2x2` 方形大卡片规则（`span 2` 宽且 `span 2` 高），并将 Favicon 图标放大 2 倍至 `32px` 纵向居中，丰富网格韵律；3) 结合 `grid-auto-flow: dense;` 自动排版填充，保证多规格卡片高度对齐，绝不错行产生零散间隙。
- **Impact**: `styles.css`

## [2026-07-03 13:55:30]
- **Type**: Fix (修复Bento网格错行并统一树形模式间距)
- **Content**: 消除动态卡片混排中的错行瑕疵，并规范树状模式两侧白边：1) 开启 `.bookmarks-pane-grid` 和 `.top-level-container` 的 `grid-auto-flow: dense;` 紧凑流动定位，使漏空自动被小卡片回填；2) 剔除所有导致高低错位、产生空洞断层的纵向 `span 2` 跨行高卡片，仅保留横向 `span 2` 跨列宽卡片（如平铺下的文件夹与首个书签、树形下的重点盒子），确保行内高度永远精确对齐；3) 树形外容器 `#bookmarks-tree.layout-tree` 限制为 `max-width: 1400px; margin: 0 auto; width: 90%`，使其在大屏下的左右物理边距与平铺模式完全一致。
- **Impact**: `styles.css`

## [2026-07-03 12:00:40]
- **Type**: Design (Bento Grid 便当盒布局重构)
- **Content**: 优化平铺模式和树状模式的网格排版，重塑为参差错落、充满设计灵动的 Bento Grid 拼图卡片：1) 将右侧卡片网格 `.bookmarks-pane-grid` 改为 Bento Grid，格宽 `190px`，间隙 `16px`，圆角统升为 `12px` 大圆角；2) 注入 Bento 自动排版逻辑：平铺下的子目录 `.leaf-wrapper--folder` 横跨两列；第 `6n+1` 个常规书签横跨两列；第 `6n+4` 个书签纵向跨两行，自动转为 `flex-col` 纵向流，并将图标自动放大 2 倍至 `32px`，化为Favicon重点应用卡片；3) 树形模式大卡片 `.top-level-container` 重置为 `280px` 行高的 Bento 栅格，`:nth-child(4n+1)` 跨 2 列，`:nth-child(4n+3)` 跨 2 行且内容支持内部滚动；4) 全局注入微物理动效，包括微悬浮 `translateY(-4px) scale(1.01)`，Hover Favicon 联动微放大，以及 Active 弹性压感 `scale(0.98)`。
- **Impact**: `styles.css`

## [2026-07-03 11:49:40]
- **Type**: Design (Notion圣杯对齐与垂直居中重构)
- **Content**: 彻底优化全屏画布下的美学比例与重心稳定性，解决左侧挤压和右侧空洞的痛点：1) 清理 `:root .container` 的高优先级覆盖样式段，使全屏无框架构彻底生效；2) 将左侧目录栏 `.directory-pane` 宽度扩至 `260px`，加入 `padding-left: 24px` 消除靠边压抑感，应用实灰色背景（Light `#f7f7f8` / Dark `#18191c`）建立高档系统侧栏分区；3) 书签主内容区与搜索顶栏的最大宽度从 `1140px` 拓宽至 `1400px` 并严格水平居中，平铺搜索框 `padding-left` 步进至 `260px`；4) 引入收缩自适应与垂直居中布局（`justify-content: center`），使右侧内容在卡片稀少时自动整体垂直居中，完美消除顶部和底部的大片空洞。
- **Impact**: `styles.css`

## [2026-07-03 11:41:30]
- **Type**: Refactor (平铺模式居中对齐与AI侧栏宽度升级)
- **Content**: 解决平铺模式在大屏幕下布局整体偏左、缺乏中轴对称美感的体验缺陷，并大幅升级 AI 侧栏展现画幅：1) 调整平铺模式下顶栏 `#search-container` 的 padding-left 偏置，时钟大字与搜索框在右侧主视口内绝对水平居中；2) 面包屑标题 `.bookmarks-pane-header` 与卡片网格 `.bookmarks-pane-grid` 引入 `max-width: 1140px; margin: 0 auto;` 限制，建立垂直中轴对齐体系，彻底解决右侧大面积空余偏斜问题；3) 卡片网格的列最小宽度优化至 180px，卡片间隙收窄，还原 Notion 高品质紧凑格调；4) AI 侧栏 `.ai-sidebar` 的宽度从 420px 跃升至 `66vw`（占屏幕 2/3 宽），设定合理的 min-width / max-width 保护阈值，提供开阔的会话渲染画幅。
- **Impact**: `styles.css`

## [2026-07-03 11:35:10]
- **Type**: Design (全屏化画布与边缘贴合侧栏重构)
- **Content**: 彻底页框扁平化，移除中间的嵌套悬浮玻璃框体，改用无缝铺满浏览器的全屏 Canvas 布局：1) 将 `.container` 改为 transparent 全屏，彻底清除外壁的阴影、边框、毛玻璃背景与 border-radius；2) 重构平铺模式为贴边尺寸，目录栏 `.directory-pane` 升级为顶天立地、左贴边缘、带有 Notion 透明淡灰背景的系统级左侧栏；3) 调整右侧书签网格面板 `.bookmarks-pane` 边距，使其在顶部、右侧与左边分割线处保留更透气的 Notion 呼吸空隙；4) 顶栏 `#search-container` 增加舒适顶边距以适配全屏模式。
- **Impact**: `styles.css`

## [2026-07-03 11:29:45]
- **Type**: Fix (修复AI侧栏溢出裁剪与宽度过窄问题)
- **Content**: 解决绝对定位的 AI 侧栏在容器 padding 及 `overflow: hidden` 下边缘被裁剪、直角外露的视觉缺陷：1) 将 `.ai-sidebar` 定位重构为贴合大盒子的 `top: 0; bottom: 0; right: 0; height: 100%`；2) 宽度拓宽至 420px，赋予 iframe 内嵌 AI 面板足够的自适应宽度，避免标签和内容在右侧被截断；3) 引入右侧圆角继承，使其与大盒子自身的圆角弧度完美贴合，左侧保留主面板景深大圆角；4) 简化边框，仅保留左侧极细分割线。
- **Impact**: `styles.css`

## [2026-07-03 11:25:30]
- **Type**: Refactor (Notion与圣杯布局重构)
- **Content**: 引入 Notion 浅色风格与 Holy Grail 深色风格及圣杯布局框架：1) 升级外层容器 `.container` 为全屏、极简微距卡片的 Notion 风格容器 `.app-shell`；2) 重构时钟与搜索顶栏 `#search-container` / `.search-wrapper` 为精细 Notion 的形态，去除所有 text-shadow 和 linear-gradient；3) 重构平铺模式下左侧目录 `.directory-pane` 宽度至 240px，应用 Notion 极简 hover/active 导航条目样式；4) 重构平铺模式卡片 `.leaf-wrapper` 和树状模式卡片 `.bookmark-card` 为纯粹 Notion 白底灰色细边框卡片，且将图标改为了扁平极简图标底座，去除一切拟物金属外圈和羊皮纸质感；5) 优化 AI 侧栏 `.ai-sidebar` 为极具高级感的磨砂极光（aurora neon glow）侧边栏，优化景深微模糊过渡效果；6) 移除 styles.css 尾部冗余复杂的 `:root` 覆盖样式段。
- **Impact**: `newtab.html`, `styles.css`

## [2026-07-03 11:20:00]
- **Type**: Chore (彻底删除拟物主题)
- **Content**: 彻底移除拟物（skeuomorphic）主题配置及相关代码：1) 从设置单选按钮中移除拟物选项；2) 删除 `applyTheme()` 中对 `skeuomorphic` 的分支逻辑，并对 localStorage 的旧 `skeuomorphic` 主题值做自动 fallback 降级处理；3) 清理 `styles.css` 中所有拟物专属变量与 pass 样式（包括平铺目录面板、设置面板、纯净模式皮纹等）；4) 全局将 `:root:not([data-theme="skeuomorphic"])` 替换为常规 `:root`，恢复非拟物普通模式为唯一基础默认态。
- **Impact**: `newtab.html`, `script.js`, `styles.css`

## [2026-06-11 10:00:00]
- **Type**: Chore (移除 Yandex 搜索引擎)
- **Content**: 从搜索栏引擎下拉列表中移除 Yandex 选项。已设置为 Yandex 的用户在刷新后将自动切换回默认引擎。
- **Impact**: `newtab.html`

## [2026-05-20 20:58:51]
- **Type**: Fix (拟物主题隔离)
- **Content**: 修正拟物样式全局泄漏问题：1) 将默认主题 token 恢复为原生玻璃质感；2) 增加非拟物主题覆盖层，恢复背景、主容器、搜索框、目录、书签卡片、设置弹窗和纯净模式的玻璃表现；3) 保留 `data-theme="skeuomorphic"` 下的拟物整套样式，使只有选择「拟物」时才显示皮革/羊皮纸/木纹效果。
- **Impact**: `styles.css`

## [2026-05-20 17:54:06]
- **Type**: Feature (拟物主题切换)
- **Content**: 在设置页「色彩主题」中新增「拟物」选项，并接入 `skeuomorphic` 主题值：1) 设置单选项新增拟物主题；2) `applyTheme()` 支持显式写入 `data-theme="skeuomorphic"`；3) 为拟物主题补充完整暖皮革/羊皮纸/古铜金 token；4) 系统深色媒体查询排除拟物主题，避免用户选择拟物后被系统深色覆盖；5) 修正顶部系统深色 token 块为有效媒体查询结构。
- **Impact**: `newtab.html`, `src/06-settings.js`, `styles.css`, `script.js`

## [2026-05-20 17:46:02]
- **Type**: Design (书签目录内部去线框)
- **Content**: 进一步简化平铺布局左侧书签目录内部视觉：1) 移除目录标题底部压印线与阴影；2) 移除目录项默认、hover、active 状态的边框与阴影；3) 移除 active 项左侧金色竖线；4) 隐藏目录面板内部右侧压痕伪元素，仅保留低对比背景明暗区分；5) 同步覆盖显式深色与跟随系统深色模式。
- **Impact**: `styles.css`

## [2026-05-20 17:38:03]
- **Type**: Design (左侧目录拟物侧页优化)
- **Content**: 调整平铺布局左侧目录面板的拟物表现：1) 移除右侧明显实线/虚线分割，改为柔和侧页压痕渐变与内阴影；2) 目录标题下方从硬线改为压印阴影；3) 目录项降低边框存在感，保留轻微纸质凸起、hover 与 active 反馈；4) 深色模式同步改为暗皮革压痕效果，避免线框感过强。
- **Impact**: `styles.css`

## [2026-05-20 17:33:14]
- **Type**: Design (设置界面拟物风格接入)
- **Content**: 将设置弹窗内部从玻璃/扁平控件统一接入当前拟物体系：1) 设置面板改为羊皮纸与皮革质感背景，增加边缘缝线、内外立体阴影和顶部高光；2) 分段单选控件改为凹陷底槽 + 凸起选中按钮；3) 上传/清除按钮、AI 服务操作按钮改为拟物按键，并补充 hover/active 按压反馈；4) 滑块轨道改为内嵌金属槽，滑块旋钮改为古铜金属质感；5) AI 服务管理区块、服务卡片、统计块同步改为纸质/皮革卡片质感；6) 补齐显式深色和跟随系统深色模式覆盖。
- **Impact**: `styles.css`

## [2026-05-20 17:17:00]
- **Type**: Design (木纹书桌背景)
- **Content**: 背景从冷灰白色 `#F7F7F5` + 蓝紫光晕改为拟物胡桃木书桌纹理：1) CSS `repeating-linear-gradient` 模拟木纹条纹（178°微斜 + 双间距变化）；2) `linear-gradient` 颜色带模拟木材色差（深棕/浅棕交替）；3) `::before` 台灯暖光光斑 + 木节暗点；4) `::after` 顶部货架投影 + 桌面清漆光泽渐变。暗色模式改为乌木书桌（`#1E120A`），同步修复 `@media prefers-color-scheme: dark` 中的旧紫灰底色。
- **Impact**: `styles.css`

## [2026-05-20 17:14:00]
- **Type**: Design (主容器 3D 立体增强)
- **Content**: 主容器 `.container` 增强 3D 拟物效果：1) 三层外投影（远距大阴影 + 中距环境阴影 + 接触阴影），模拟厚皮革笔记本放在桌面上的物理深度；2) 四向内嵌阴影（顶部高光 + 左侧高光 + 右侧暗边 + 底部厚度），模拟皮革边缘的 3D 倒角；3) `::before` 叠加层增加台灯光斑（左上角径向高光）和暗角（边缘渐暗），增强立体纵深感；4) `outline` 亮度提升为外缘高光环。暗色模式同步增强。
- **Impact**: `styles.css`

## [2026-05-20 17:11:00]
- **Type**: Design (目录条目默认拟物状态)
- **Content**: 未选中的目录文件夹条目从完全透明改为拟物"羊皮纸标签"默认态：浅米色渐变背景 + 细边框 + 微阴影凸起 + 顶部内嵌高光。hover 时增强为更强的凸起效果。暗色模式同步添加深棕皮革默认态。清理了重复的暗色 hover 和 active 样式块。
- **Impact**: `styles.css`

## [2026-05-20 17:09:00]
- **Type**: Fix (书签卡片首行 hover 上浮裁切)
- **Content**: 书签网格容器 `.bookmarks-pane-grid` 增加 `padding-top: 6px`，防止第一行卡片 `translateY(-3px)` 上浮时顶部阴影和高光被父容器 `overflow: hidden` 裁切。
- **Impact**: `styles.css`

## [2026-05-20 16:59:00]
- **Type**: Fix (拟物风格补全 — 目录/时间/纯净模式)
- **Content**: 修复4处遗漏的拟物风格覆盖：1) 左侧目录面板增加缝线分割线（`border-right` 实线 + `::after` 虚线缝线）和微妙顶部高光渐变；2) 时钟数字增加 `text-shadow` 浮雕效果（高光 + 投影双层），问候语和日期同步增加拟物文字阴影；3) 纯净模式容器从 `transparent` 改为完整皮革笔记本表面（含缝线 + 立体阴影）；4) 纯净模式搜索栏改为拟物凹陷输入槽，问候语菱形图标颜色改为古铜金并增加阴影；5) 同步修复 `@media prefers-color-scheme: dark` 块中的旧版 Glassmorphism token 为拟物暗色皮革 token。
- **Impact**: `styles.css`

## [2026-05-20 16:54:00]
- **Type**: Design (书签卡片拟物风格强化)
- **Content**: 将书签网格卡片（`.leaf-wrapper`）和面板卡片（`.bookmark-card`）从扁平白色方块改造为拟物纸质便签效果：1) 羊皮纸底色 + 顶部高光渐变模拟纸张受光；2) 多层 `box-shadow` 实现物理凸起感（外投影 + 内顶高光 + 内底阴影）；3) `::before` 叠加纸纹纹理；4) hover 上浮 `translateY(-3px)` + 阴影增强模拟拿起卡片；5) active 下压 `translateY(1px) + scale(0.97)` + 内嵌阴影模拟按入桌面；6) 图标环改为金属浮雕效果（径向高光 + 边框 + 内嵌阴影）。
- **Impact**: `styles.css`

## [2026-05-20 16:45:00]
- **Type**: Design (Skeuomorphic UI 拟物风格实验)
- **Content**: 将整体 UI 从 Glassmorphism 透明磨砂风格改造为拟物质感设计：1) 设计 Token 全面替换（皮革棕/羊皮纸/古铜金配色体系）；2) 主容器改造为皮质笔记本外观（皮革渐变表面 + 虚线缝线 + 立体凸起光影）；3) 搜索栏改为凹陷内嵌金属镶边输入槽；4) 文件夹条目增加立体凸起高光标签页效果；5) 设置按钮改造为金属旋钮（径向高光 + 环形边框 + 按压凹陷反馈）；6) 暗色主题适配为黑色皮革 + 拉丝金属配色。纯 CSS 变更，无 JS/HTML 改动。
- **Impact**: `styles.css`

## [2026-05-20 16:13:00]
- **Type**: Fix (全站点裸域审计加固)
- **Content**: 全面审计所有内置 AI 站点的权限与 DNR 规则覆盖：1) 在 `manifest.json` 中为 ChatGPT、通义千问、Kimi 补充裸域 `host_permissions`（`*://chatgpt.com/*`、`*://chat.qwen.ai/*`、`*://kimi.moonshot.cn/*`），消除 `*://*.domain/*` 模式不匹配裸域的权限盲区；2) 在 `rules.json` 中新增规则 ID 21（`*://kimi.moonshot.cn/*`），修复 Kimi 静态 DNR 规则完全无法命中裸域的缺陷，消除冷启动时序竞争导致的偶发加载失败风险。
- **Impact**: `manifest.json`, `rules.json`

## [2026-05-20 15:58:00]
- **Type**: Fix (Claude bare-domain DNR rule mismatch)
- **Content**: 修复 Claude 无法在侧栏 iframe 中加载的问题：`*://*.claude.ai/*` 仅匹配子域名，但 Claude 使用裸域 `claude.ai`（无 www 前缀），导致 DNR 规则未命中、安全头未被移除。新增规则 ID 20 精确匹配 `*://claude.ai/*` 裸域，同时在 `manifest.json` 中补充 `*://claude.ai/*` 的 host_permissions 声明。
- **Impact**: `manifest.json`, `rules.json`

## [2026-05-20 15:54:00]
- **Type**: Feature (Add Gemini & Claude to AI sidebar)
- **Content**: 1) 在 `BUILTIN_AI_PROVIDERS` 默认站点列表中新增 Google Gemini 和 Anthropic Claude 选项，并配置其高清 Favicon 与入口 URL；2) 在 `manifest.json` 中配置了必要的 `host_permissions` 网络请求拦截域名；3) 在 `rules.json` 中新增 ID 19 规则以支持 `claude.ai` 解除 `X-Frame-Options` 和 `Content-Security-Policy` 嵌入限制，从而在侧栏 Iframe 中完美加载。
- **Impact**: `src/01-constants.js`, `manifest.json`, `rules.json`, `script.js`

## [2026-05-20 15:50:00]
- **Type**: Optimization (AI sidebar iframe 100% original scale sharpness)
- **Content**: 废弃 AI 侧栏 iframe 缩放策略（方案 A）：移除了硬编码的 `width: 111.11%; height: 111.11%` 和 `transform: scale(0.9)` 缩放效果，恢复 1:1 原生高清显示，彻底解决非整数缩放引发的文字发虚与右侧滚动条边缘截断问题。
- **Impact**: `styles.css`, `script.js`

## [2026-05-20 15:42:00]
- **Type**: Fix (AI sidebar tabs high-precision indicator alignment)
- **Content**: 解决 AI 侧栏打开后，高亮指示滑块定位不准向下位移的问题：1) 为 `.ai-tabs` 增加 `position: relative` 作为子元素 `.ai-tabs-indicator` 绝对定位的参考基准；2) 重构 `syncAiTabsIndicator()` 偏移量计算逻辑，使用现代高精度 `getBoundingClientRect()` 并融入 `.scrollLeft`，彻底避免 flex 布局与 offsetParent 实现差异导致的滑块跑偏脱节问题。
- **Impact**: `src/08-ai-sidebar.js`, `styles.css`, `script.js`

## [2026-05-20 15:35:00]
- **Type**: Fix & Design (Restore source sync & AI Sidebar glassmorphism)
- **Content**: 1) 修复分模块同步丢失导致的白屏：将原本直接修改在 `script.js` 中的 890 多行核心初始化入口（如 `DOMContentLoaded` 监听器）和备忘录逻辑规范同步归位至 `src/01-constants.js` 和 `src/09-ui-widgets.js`，重新打包拼接彻底恢复页面加载和备忘录功能；2) AI 侧栏透明磨砂化：调低侧栏背景色透明度（浅色模式 0.68，深色模式 0.65），提高侧边栏背景毛玻璃模糊度至 `30px`，并将侧栏顶部 Tab 头部 `background` 设置为 `transparent`，实现一体化的苹果 VisionOS 级悬浮磨砂玻璃交互感。
- **Impact**: `src/01-constants.js`, `src/09-ui-widgets.js`, `styles.css`, `script.js`

## [2026-05-20 14:47:00]
- **Type**: Fix (Avoid ReferenceError on debounce)
- **Content**: 将 `debounce` 通用防抖函数移至首个加载模块 `src/01-constants.js`，解决打包合并后 `src/08-ai-sidebar.js` 引用该函数时因加载时差导致的 `debounce is not defined` 报错。
- **Impact**: `src/01-constants.js`, `script.js`

## [2026-05-20 14:45:00]
- **Type**: Design (AI Sidebar aesthetic & UX enhancements)
- **Content**: 1) AI Tabs 高亮漂移：实现 `.ai-tabs-indicator` 滑块垫片，使 AI 侧栏的 Tabs 在切换和 resize 时支持平滑吸附过渡，统一全局动效语言；2) 3D 景深模糊视差：拉开侧栏时，为主页面（#bookmarks-tree 和 #search-container）加设 scale(0.96) 深度回退与 blur(8px) 模糊，塑造极致的前后台纵深分割；3) 控制按钮微动效：关闭按钮悬浮时 90° 旋转，新窗口打开按钮悬浮时 45° 斜向弹跳；4) Iframe 保活与内存安全：侧栏打开期间切换 AI 时仅通过 CSS 隐藏 iframe，避免销毁造成的冷启动会话丢失；仅在侧栏关闭时循环 unloadIframe 完整回收内存；5) 极光占位屏：引入 `#ai-sidebar-loading` 加载器和极光脉冲微光（.aurora-glow）与骨架闪烁线，彻底告别 iframe 载入期的空白闪烁。
- **Impact**: `newtab.html`, `styles.css`, `src/08-ai-sidebar.js`, `script.js`

## [2026-05-20 14:28:40]
- **Type**: Design (Fluid selection animations)
- **Content**: 1) 引入侧栏主动式滑动轨垫片（`.sidebar-active-indicator`）：为左侧目录树在平铺模式和树状模式下添加绝对定位的高亮滑块，配合弹性 transition，在切换目录项时实现背景的丝滑漂移；2) 剥离静态背景色：移除原 `.tree-folder-item.active` 的硬编码背景和边框，将其完全移交给滑动指示器，使漂移过渡连贯无闪烁；3) 边缘光追流光效果：利用 `@property --glow-angle` 和 `@keyframes conic-glow-rotate` 在选中的书签卡片（`.leaf-wrapper.is-selected` / `.bookmark-card.is-selected`）四周生成 360° 发光旋转边框；4) 弹性点击反馈：结合 `spring-pop` 弹性微缩反弹动画，在卡片点击时提供丝滑回弹与流光闪烁反馈，并配有 1.4 秒自动销毁机制，确保极佳的日常交互性能。
- **Impact**: `styles.css`, `script.js`, `src/02-bookmarks-core.js`, `src/09-ui-widgets.js`

## [2026-05-20 11:25:00]
- **Type**: Fix (HD Background & Transparency overlays)
- **Content**: 1) 解除存储限制（提清）：在 manifest.json 申请 unlimitedStorage 权限，允许 4K/超清壁纸无损原图写入 IndexedDB，避免触发降级压缩算法；2) 消除壁纸变色遮罩（去遮罩）：激活自定义背景时在 body 挂载 .has-custom-bg，在 styles.css 中将背景伪元素的 opacity 设为 0，100% 还原壁纸原本色彩；3) 容器彻底透明：优化 applyContainerOpacity 逻辑，若透明度滑块拉满至 10，则完全清除主容器的毛玻璃模糊、背景色、边框以及阴影，展现极度清爽的悬浮书签体验。
- **Impact**: `manifest.json`, `styles.css`, `script.js`, `src/01-constants.js`, `src/06-settings.js`

## [2026-05-18 17:15:00]
- **Type**: Refactor (Pure Mode Memo UX)
- **Content**: 1) 输入区改为「幽灵光标」模式：移除所有可见输入框边框/背景，只保留 1.5px 跳动光标 (`step-end` 1.1s 动画)，focus 时原生光标接管，失焦且为空时自动恢复跳动光标；2) 待办条目前圆点改为可交互 checkbox：勾选时 checkbox 填充品牌色 + 打钩 SVG 出现 + 文字删除线，320ms 后条目淡出删除；保留右侧 ✕ 快速删除按钮。
- **Impact**: `newtab.html`（重构 input row 为 ghost-wrap + cursor-blink span）、`script.js`（buildItemEl 改用 checkbox，新增 cursor blink 控制逻辑）、`styles.css`（新增 ghost input/cursor blink/checkbox/is-completing 样式，删除 submit-btn）

## [2026-05-18 17:10:00]
- **Type**: Refactor (Pure Mode Memo layout)
- **Content**: 将备忘录从「弹出浮层」改为「内联卡片」布局。备忘列表和输入框直接展示在搜索框正下方，不再遮挡搜索框；添加一条备忘后输入框自动清空并保持 focus，光标就绪以供连续输入；有待办时卡片展示分割线+列表+输入行，无待办时仅显示输入行（外观与搜索框平级的轻量卡片）。
- **Impact**: `newtab.html`（重构 `#pure-memo` 区块）、`script.js`（删除 openPanel/closePanel/updateTrigger/searchFocus 等浮层逻辑，简化为纯内联渲染）、`styles.css`（删除所有浮层弹出样式，替换为内联卡片样式）

## [2026-05-18 16:53:00]
- **Type**: Feature (Pure Mode Memo)
- **Content**: 在纯净模式下新增轻量备忘录功能。设计决策：1) 有待办时自动展开并按视口高度自适应显示条数（calcMemoInitialCount：可用高度/40px，区间 [3,8]）；无待办时折叠为淡显"记点什么..."入口；2) 条目无数量限制，采用分页渲染（MEMO_CHUNK_SIZE=15），避免大量数据一次性挂载 DOM；3) 清空操作复用已有 `showConfirmDialog`；4) 搜索框 focus 时自动收起面板；持久化使用 `chrome.storage.local`，key: `pure_memo_items`，数据结构 `{id, text, createdAt}`，新条目置顶。
- **Impact**: `newtab.html`（新增 `#pure-memo` 区块）、`script.js`（新增 `initPureMemo`、`calcMemoInitialCount` 函数，`DOMContentLoaded` 中注册调用）、`styles.css`（新增约 280 行备忘录组件样式，含动画、深色模式、移动端适配）

## [2026-05-18 16:40:00]
- **Type**: Design (Icon Redesign)
- **Content**: 重新设计插件图标为高质感"书签树层级"风格。采用深海蓝渐变背景（#111827 → #1e2a4a），中心图形为三层书签层级结构（1-2-3 书签标志连线呈树形），以电光蓝青渐变（#38BDF8 → #818CF8）加霓虹发光效果渲染。整体视觉语言符合现代高端工具类扩展（Arc/Raycast 同款风格），替换旧版普通绿色卡通树图标。
- **Impact**: `icons/icon16.png`、`icons/icon48.png`、`icons/icon128.png`、`icon.png`

## [2026-05-18 11:34:00]
- **Type**: Refactor (Low Priority Optimizations #8/#12/#15/#17)
- **Content**:
  1. **Fix #8** — `renderBookmarksWithLayoutTransition` 从固定 220ms `setTimeout` 改为 `transitionend` 事件驱动移除 `layout-switching` class，动画时长与 CSS 完全同步，避免 CSS 改变后需手动同步 JS 延迟值的维护问题；保留 350ms fallback 防止 `transitionend` 不触发。
  2. **Fix #12** — `preloadImage` 添加 5s 超时保护（`settled + clearTimeout` 模式），避免背景图加载失败/超慢时永久阻塞初始化流程；同时优化 `decode()` 调用为统一 `finish` 回调模式，消除原先 `.then(resolve).catch(()=>resolve())` 的重复代码。
  3. **Fix #15** — 新增通用 `debounce(fn, delayMs)` 工具函数；替换 `initSearch` 中的手动 `clearTimeout/setTimeout` 防抖模式，统一搜索防抖为 120ms 并删除冗余的 `inputDebounceTimer` 变量。
  4. **Fix #17** — 为 `createBookmarkActions` 中的编辑/删除按钮添加完整的 `aria-label`（包含书签名）、`role="group"` 操作区域语义、`type="button"` 防止表单提交误触、SVG 装饰元素添加 `aria-hidden="true"`，提升屏幕阅读器可访问性。
- **Impact**: `script.js`

## [2026-05-18 11:31:00]
- **Type**: Refactor (Medium Priority Optimizations #3/#4/#5/#6/#7/#10/#11/#16)
- **Content**:
  1. **Fix #3** — 抽取 `DAILY_QUOTES`、`getTimePrefix()`、`getDailyGreeting()` 为顶层共享常量/函数，消除 `initAmbientTime` 和 `initGreeting` 中完全相同的问候语数组和时间段判断重复代码。
  2. **Fix #4** — 将 `toggleHiddenBtn`、`createBookmarkIcon`、`createSimpleTile` 中的内联 style 赋值全部改为 CSS class（新增 `.toggle-hidden-btn`、`.bookmark-card--auto`、`.leaf-node--no-padding`、`.bookmark-label--bold`、`.bookmark-icon`、`.bookmark-icon--svg`）。
  3. **Fix #5** — `initAmbientTime` 改为初始化时一次性建立静态 DOM 子树，定时更新只修改 `textContent`，避免每分钟 `innerHTML` 全量重建 DOM 导致的布局抖动。
  4. **Fix #6** — `initPureTime` 和 `initAmbientTime` 均改为精准 `setTimeout`（锚点到下一分钟的边界），替代固定 60s `setInterval`，时钟显示误差从 ±1000ms 降至 ±1ms。
  5. **Fix #7** — `deleteBookmark` 将 `refreshBookmarkTreeCache()` 移到动画结束回调内执行，避免 DOM 移除与缓存刷新并发引发的双重渲染问题；同时为 `animationend` 添加 `once: true`。
  6. **Fix #10** — 将 20 个分散的全局 `let` 变量归拢至 `AppState` 对象，清晰展示应用状态全貌；保留向后兼容别名，现有代码无需改动。
  7. **Fix #11** — 合并 `[data-theme="dark"]` 与 `@media (prefers-color-scheme: dark)` 中约 30 个重复的 CSS 自定义属性声明，结构更清晰，减少维护时遗漏同步更新的风险。
  8. **Fix #16** — 背景图存储从 `chrome.storage.local`（8MB/item 上限）迁移到 `IndexedDB`（无实际上限）；新增 `openBgDB/bgIdbGet/bgIdbSet/bgIdbRemove` 辅助函数；初始化时自动将旧有数据迁移到 IndexedDB 并清除 chrome.storage 中的副本。
- **Impact**: `script.js`, `styles.css`

## [2026-05-18 11:26:00]
- **Type**: Fix + Refactor (High Priority Optimizations #1/#2/#9/#13/#14)
- **Content**:
  1. **Fix #13** — 修复 `editBookmark()` 引用的 `#edit-bookmark-dialog` 等 4 个 DOM 元素在 `newtab.html` 中完全缺失导致书签编辑功能静默失效的严重 Bug；在 HTML 中添加完整的编辑书签弹窗 DOM，并在 `styles.css` 中补充对应的玻璃态样式。
  2. **Fix #14** — 同步重写 `editBookmark()` 函数，改用 `AbortController` 统一管理所有事件监听器，彻底替代原有 `cloneNode` hack；验证错误反馈改为 CSS class（`input-error`）代替内联 style。
  3. **Fix #1** — 合并 `renderTreeItem` 与 `renderTreeItemForModal` 为统一工厂函数 `renderTreeNode(node, options)`，通过 `options.defaultExpanded` 区分普通树 / 文件夹弹窗两种行为，消除约 120 行重复代码；两个原函数保留为向后兼容 shim。
  4. **Fix #2** — 提取子文件夹 hover-expand 逻辑为独立辅助函数 `bindSubFolderHoverExpand(wrapper, childrenContainer)`，消除原先两处完全相同的 hoverTimer 实现。
  5. **Fix #9** — 将 `script.js`（3763 行）拆分为 `src/` 目录下 9 个职责清晰的模块文件（01~09 前缀数字确保加载顺序）；更新 `build.js`，构建时优先检测 `src/` 目录并自动按序拼接，否则回退到旧 `script.js`，无需改动现有开发/发布流程。
- **Impact**: `newtab.html`, `styles.css`, `script.js`, `build.js`, `src/`（新增 9 个模块文件）

## [2026-05-15 17:05:06]
- **Type**: Fix (AI Sidebar DOM)
- **Content**: 修复 AI 侧边栏被错误嵌套在隐藏的设置弹窗内导致无法显示的问题。补齐 `#settings-modal` 的关闭标签，使 `#ai-sidebar` 成为 `.container` 的直接子级，避免被父级 `.hidden { display: none !important; }` 影响。
- **Impact**: `newtab.html`

## [2026-05-15 16:24:24]
- **Type**: Fix (AI Sidebar Visibility)
- **Content**: 修复 AI 侧边栏移入主容器后只显示蒙版、不显示面板的问题。新增 `body.ai-sidebar-open .ai-sidebar` 显示兜底规则，使页面进入 AI 打开状态时侧栏必定回到可视位置，并将主容器层级提升到遮罩之上。
- **Impact**: `styles.css`

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

## 2026-05-26 14:03:00
- **变更类型**: Chore / Design
- **变更内容**: 替换扩展图标为精致小飞猪+书签风格新图标（粉色渐变玻璃态风格），覆盖 16/48/128px 三种尺寸及根目录 icon.png
- **影响范围**: icons/icon16.png, icons/icon48.png, icons/icon128.png, icon.png
