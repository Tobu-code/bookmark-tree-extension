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
