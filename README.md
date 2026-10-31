# Image Viewer

A modern floating image viewer extension for Lumiverse with pan, zoom, rotation, anchor presets, position locking, and avatar/attachment detection.

![Version](https://img.shields.io/badge/version-1.1.0-blue)
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
| **Move / Reposition** | Drag anywhere along the toolbar or window background (when unlocked) | — |
| **Pan** | Click & drag inside the viewport | — |
| **Zoom In / Out** | Mouse wheel over the image or click `+` / `−` | `+` / `−` |
| **Fit Aspect Ratio** | Click `⊡`, click `Fit` pill, or double-click viewport | `0` |
| **Anchor Presets** | Click `⚓` in toolbar to dock to Top-Left, Top-Right, Center, Bottom-Left, or Bottom-Right | — |
| **Lock / Unlock** | Click `🔓`/`🔒` toggle button in toolbar or More menu | `L` |
| **Rotate (Auto-Fit)** | Click `↻` in toolbar (window aspect ratio adapts) | `R` |
| **Flip Horizontal** | Click `⇄` in toolbar | `H` |
| **More Options** | Click `⋮` for Copy Image Link, Open in New Tab, Fit Aspect Ratio, and Lock | — |
| **Strict Aspect Resize** | Drag corner grip lines (window strictly fits image ratio) | — |
| **Close** | Click `×` button or press Escape (closes menus first, then viewer) | `Esc` |

## 🔧 Technical Details

### Architecture & APIs

- **Lumiverse Spindle SDK** (`lumiverse-spindle-types@^0.6.75`):
  - Uses `ctx.ui.createFloatWidget()` with `chromeless: true` and `snapToEdge: false` for unconstrained screen movement
  - Uses `widget.setSize()` and `widget.moveTo()` to keep host placement in sync
  - Zero-margin anchor calculations (`calculateAnchorPosition`) allowing flush docking to all screen corners
  - Intercepting pointer events to lock window position without conflict with Spindle's parent wrapper drag
  - Uses `ctx.ui.registerInputBarAction()` for quick avatar access from the chat composer
  - Uses `ctx.permissions.getGranted()`, `ctx.permissions.request()`, and `ctx.events.on('PERMISSION_CHANGED')` for dynamic permission lifecycle management
- **Resolution Enhancer**:
  - Automatically resolves full-resolution images from thumbnail URLs (e.g., strips `?size=sm` and `?size=lg` for `/api/v1/images/*` and `/api/v1/image-gen/*`)
- **Strict Aspect-Ratio Engine**:
  - Dynamically computes dimensions matching the exact natural aspect ratio while accounting for the 39px toolbar
  - Eliminates initial-load letterboxing by factoring toolbar dimensions even when hidden
  - Pointer capture handle for corner resizing with aspect ratio preservation
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

### v1.1.0
- **Strict Fit Aspect Ratio**: Sizing calculations strictly lock viewport to image ratio, eliminating canvas letterboxing on initial load and window resizing
- **Full Viewport Movement**: Disabled edge snapping (`snapToEdge: false`) to eliminate screen movement clamping and allow dragging flush to all screen edges
- **Anchor Presets**: Added one-click anchor presets (`⚓`) to dock the window to Top-Left, Top-Right, Center, Bottom-Left, or Bottom-Right with zero margin
- **Manual Position Locking**: Added `[🔓]`/`[🔒]` toolbar toggle and `L` shortcut to lock window drag in place
- **Streamlined Toolbar & More Menu**: Moved secondary actions ("Copy Image Link", "Open in New Tab", "Fit Aspect Ratio", "Lock Position") into a neat dropdown menu (`⋮`)
- **Full Pan & Zoom**: Mouse wheel zoom centered on cursor, click-and-drag panning, double-click toggle
- **Rotation & Flip**: 90° rotation with auto-fitting window dimensions and horizontal flipping (`H`)
- **Resolution Enhancer**: Automatic resolution of full-res URLs from `/api/v1/images/*` and `/image-gen/` thumbnails
- **Composer Extras Action**: Registered "View Character Avatar" button in the chat input bar extras popover
- **Dynamic Permissions**: Live `PERMISSION_CHANGED` handling and graceful permission requests
- **Keyboard Shortcuts**: `Esc`, `+`, `-`, `0`, `L`, `R`, `H`
- **Updated Tech Stack**: Updated to `lumiverse-spindle-types@^0.6.75`, added `src/backend.ts`, removed unused dependencies, added Bun test suite (14 automated tests)

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
