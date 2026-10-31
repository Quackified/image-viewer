# Image Viewer

A modern floating image viewer extension for Lumiverse with pan, zoom, rotation, anchor presets, position locking, and avatar/attachment detection.

![Version](https://img.shields.io/badge/version-1.1.1-blue)
![Platform](https://img.shields.io/badge/platform-Lumiverse-purple)

## 📦 Installation

1. Open Lumiverse
2. Open the **Extensions** drawer tab
3. Click **Add Extension** and enter the repository URL: `https://github.com/Quackified/image-viewer`
4. Enable the extension and grant the `ui_panels` permission

### File Structure

```
image-viewer/
├── src/
│   ├── frontend.ts    # Main frontend module (pan, zoom, UI, events)
│   └── backend.ts     # Lightweight Bun worker backend
├── dist/
│   ├── frontend.js    # Bundled frontend browser module
│   └── backend.js     # Bundled backend Bun module
├── test/
│   └── image-viewer.test.ts # Self-check unit tests
├── spindle.json       # Extension manifest
├── package.json
├── tsconfig.json
└── README.md
```

## 🎮 Usage & Controls

| Action | How | Shortcut |
|---|---|---|
| **Open Image** | Click any avatar, attachment, or chat image | — |
| **Quick Avatar** | Extras menu (`+`) in input bar → *View Character Avatar* | — |
| **Move / Reposition** | Drag along toolbar when window is unlocked | — |
| **Resize via Toolbar** | Drag along toolbar when window is locked | — |
| **Strict Aspect Resize** | Drag corner grip lines in bottom-right | — |
| **Pan** | Click & drag inside the viewport (when image pan/zoom is unlocked) | — |
| **Zoom In / Out** | Mouse wheel over image or click `+` / `−` | `+` / `−` |
| **Fit Aspect Ratio** | Click `⊡`, click `Fit` pill, or double-click viewport | `0` |
| **Anchor Presets** | Click `⚓` in toolbar to dock flush to Top-Left, Top-Right, Center, Bottom-Left, or Bottom-Right | — |
| **Lock Position** | Click `🔓`/`🔒` in toolbar or More menu (switches toolbar drag to resize) | `L` |
| **Lock Pan / Zoom** | Click `⋮` → *Lock Image Pan/Zoom* to freeze zoom level and disable pan | — |
| **Rotate (Auto-Fit)** | Click `↻` in toolbar (window aspect ratio adapts) | `R` |
| **Flip Horizontal** | Click `⇄` in toolbar | `H` |
| **More Options** | Click `⋮` for Copy Image Link, Open in New Tab, Lock Pan/Zoom, and Lock Position | — |
| **Close** | Click `×` button or press Escape (closes menus first, then viewer) | `Esc` |

## 🔧 Technical Details

### Architecture & APIs

- **Lumiverse Spindle SDK** (`lumiverse-spindle-types@^0.6.75`):
  - Uses `ctx.ui.createFloatWidget()` with `chromeless: true` and `snapToEdge: false`
  - Uses `widget.setSize()` and `widget.moveTo()` to keep host placement in sync
  - Edge Flush Placement (`calculateEdgeFlushPlacement`): Offsets against host container clamp padding so the window can dock flush against screen edges (`0, 0`) with zero margin
  - Dual Toolbar Interaction: Custom drag interception on the toolbar allowing free screen repositioning when unlocked, and aspect-ratio-locked resizing when locked
  - Uses `ctx.ui.registerInputBarAction()` for quick avatar access from the chat composer
  - Uses `ctx.permissions.getGranted()`, `ctx.permissions.request()`, and `ctx.events.on('PERMISSION_CHANGED')` for dynamic permission lifecycle management
- **Resolution Enhancer**:
  - Automatically resolves full-resolution images from thumbnail URLs (e.g., strips `?size=sm` and `?size=lg` for `/api/v1/images/*` and `/api/v1/image-gen/*`)
- **Strict Aspect-Ratio Engine**:
  - Dynamically computes dimensions matching the exact natural aspect ratio while accounting for the 39px toolbar
  - Inset border styling guarantees the viewport content area matches calculated aspect ratios with zero border subtraction or letterbox canvas
  - Corner and toolbar resize engines strictly preserve aspect ratio throughout drag
- **Theming**:
  - Uses native Lumiverse CSS variables (`--lumiverse-fill`, `--lumiverse-border`, `--lumiverse-text`, `--lumiverse-radius`, etc.) with frosted glass backdrop blur and checkerboard transparency backing

### Permissions

```json
{
  "permissions": ["ui_panels"]
}
```

- `"ui_panels"`: Required by Lumiverse to create floating widgets that overlay the screen. If not yet granted, the extension prompts the user gracefully when opening an image.

## 📋 Changelog

### v1.1.1
- **Edge Flush Docking**: Added negative offset compensation against host 12px clamp padding so anchor presets and dragging dock flush to screen edges with zero margin
- **Toolbar Resize When Locked**: When window position is locked, dragging the toolbar resizes the window while strictly preserving the image aspect ratio
- **Lock Image Pan/Zoom**: Replaced redundant Fit button in dropdown with *Lock Image Pan/Zoom* toggle to freeze current zoom and disable panning/wheel zoom
- **Subpixel Fit & Letterbox Fix**: Changed container border to inset styling to eliminate inner dimension reduction and canvas space around drag handles
- **Window Resize Observer**: Automatically maintains anchor preset docking when the browser or host window is resized

### v1.1.0
- **Strict Fit Aspect Ratio**: Sizing calculations strictly lock viewport to image ratio, eliminating canvas letterboxing on initial load and window resizing
- **Full Viewport Movement**: Disabled edge snapping (`snapToEdge: false`) to eliminate screen movement clamping and allow dragging flush to all screen edges
- **Anchor Presets**: Added one-click anchor presets (`⚓`) to dock the window to Top-Left, Top-Right, Center, Bottom-Left, or Bottom-Right
- **Manual Position Locking**: Added `[🔓]`/`[🔒]` toolbar toggle and `L` shortcut to lock window drag in place
- **Streamlined Toolbar & More Menu**: Moved secondary actions into a neat dropdown menu (`⋮`)
- **Full Pan & Zoom**: Mouse wheel zoom centered on cursor, click-and-drag panning, double-click toggle
- **Rotation & Flip**: 90° rotation with auto-fitting window dimensions and horizontal flipping (`H`)
- **Resolution Enhancer**: Automatic resolution of full-res URLs from `/api/v1/images/*` and `/image-gen/` thumbnails
- **Composer Extras Action**: Registered "View Character Avatar" button in the chat input bar extras popover
- **Dynamic Permissions**: Live `PERMISSION_CHANGED` handling and graceful permission requests
- **Keyboard Shortcuts**: `Esc`, `+`, `-`, `0`, `L`, `R`, `H`
- **Updated Tech Stack**: Updated to `lumiverse-spindle-types@^0.6.75`, added `src/backend.ts`, removed unused dependencies, added Bun test suite

### v1.0.1
- Pop-in/pop-out animations
- Proportional resize with aspect ratio lock

### v1.0.0
- Initial release with avatar click interception

## 👤 Author

**Quackified**
- GitHub: [@Quackified](https://github.com/Quackified)

---

Made for [Lumiverse](https://lumiverse.chat/)
