# Changelog

All notable changes to this project will be documented in this file.

## [2.1.1] - 2026-03-17

### Enhancements
- **Layout**: 平铺模式下左侧目录面板变更为双列网格布局，更有效地利用屏幕空间。
- **Feature**: 支持在平铺模式下使用拖拽（Drag & Drop）自由排序左侧文件夹和右侧书签。
- **Feature**: 自动隐藏没有书签内容的空文件夹，避免产生无效点击。
- **Feature**: 新增低频书签目录的折叠/隐藏功能。鼠标悬停在左侧文件夹可点击“眼睛”图标隐藏，并在左侧底部统一管理已隐藏的目录。
- **UI/UX (平铺模式)**: 深度重构平铺模式视觉质感。移除右侧大面积遮罩，增加书签独立玻璃态发光卡片效果。
- **UI/UX (平铺模式)**: 全面极致打磨——共计 12 项视觉优化：① 左侧增加柔和垂直分隔线建立区域归属感 ② 文件夹图标放大至 22px ③ 隐藏按钮仅在悬停时显示 ④ 左侧底部渐隐提示滚动 ⑤ 面包屑路径层级化着色（中间灰色、末级加粗） ⑥ 标题底部分隔线改为左右渐隐渐变线 ⑦ 右侧书签卡片背景降低透明度回归真正玻璃质感 ⑧ 书签卡片下方新增域名预览行 ⑨ 缺失图标的书签自动生成彩色字母头像 ⑩ 悬停卡片增加主题色发光边框 ⑪ 左右区域首行垂直对齐 ⑫ 滚动条轨道完全透明且更纤细。

### Bug Fixes
- **Performance**: 优化了自定义背景图片的上传逻辑。现在当上传超过 1.5MB 的高清大图时，插件会自动在本地利用 Canvas 将其压缩并缩小尺寸（上限 2560px），彻底解决了因为图片过大导致的“保存失败”报错，同时保证每次打开新标签页依然能秒开不卡顿。

## [2.1.0] - 2026-03-17

### Features
- **Layout**: 新增“平铺模式” (Tile Mode) 布局选项，采用左右分栏设计（左侧目录卡片，右侧直接展示书签），提高无缝浏览体验。

## [2.0.0] - 2026-01-26

### Major Update
- **Performance**: Significant performance improvements for large bookmark collections.
- **UI/UX**: Refined user interface with smoother animations and improved responsiveness.
- **New Features**: Enhanced search capabilities and additional customization options.

## [1.0.0] - 2026-01-04

### Official Release
- **Brand Identity**: Launched new "Bookmark Tree" minimalist icon with fresh green branding.
- **Visuals**: Introduced modern gradient background presets (Fresh, Deep Blue, Midnight).
- **Themes**: Full support for Light, Dark, System, and custom Deep/Midnight themes.

### Features
- **Tree View**: Hierarchical bookmark navigation with Mac-style hover expansion.
- **Search**: Integrated search engine picker (Drum style) and quick bookmark search.
- **Customization**: 
    - 5+ Background presets + Custom Image support.
    - Adjustable blur and opacity.
    - Multiple icon styles (Native Favicon, Animal Emojis, Work Emojis).
- **UX**: Smooth drag-and-drop sorting and responsive grid layout.

## [0.3.0] - 2025-12-31

### Features
- **Settings Panel**: New options for "Open in New Tab" and "Appearance".
- **Theme**: Support for Light, Dark, and System modes.
- **Link Behavior**: Configurable link opening (New Tab vs Current Tab).

## [0.2.0] - 2025-12-31

### Features
- **UI Optimization**: Adjusted bookmark tree spacing and alignment for a balanced layout.
- **Search**: Added search engine switching support (Google/Bing).
- **Visuals**: Refined bookmark hover effect with rounded corners (Mac Dock style) and fixed overflow issues.
- **Identity**: Renamed extension to "小飞猪的书签".

### Changes
- **Layout**: Increased gap between items to 60px and centered the container.
- **Styles**: Optimized hover animations to prevent content overflow.

## [0.1.0] - 2025-12-31

### Features
- **Tree View**: Display bookmarks in a hierarchical tree structure.
- **Drag & Drop**: reorganize bookmarks with intuitive drag and drop interface.
- **Search**: Fast search function to filter bookmarks.
- **Custom Background**: Set a custom background image or color for the new tab page.
- **Settings**: Adjust background opacity and manage settings via a modal.

### Optimization
- **Emoji Icons**: Replaced external favicon requests with random emoji icons for better performance and visual consistency.
