# Image Viewer

A Lumiverse extension that provides a floating image viewer with drag, resize, and avatar click detection.

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![Platform](https://img.shields.io/badge/platform-Lumiverse-purple)

## 📦 Installation

1. Open Lumiverse
2. Go to **Extensions** panel
3. Add extension from URL: `https://github.com/Quackified/image-viewer`

### File Structure

```
image-viewer/
├── src/
│   └── frontend.ts    # Main extension code
├── dist/
│   ├── frontend.js    # Built frontend bundle
│   └── backend.js     # Built backend bundle
├── spindle.json       # Extension manifest
├── package.json
└── README.md
```

## 🎮 Usage

| Action | How |
|--------|-----|
| **Open Image** | Click any character avatar in chat |
| **Move** | Drag anywhere on the panel |
| **Resize** | Drag the bottom-right grip handle |
| **Close** | Click X button |

## 🔧 Technical Details

### Built With

- **Lumiverse Spindle** – Extension framework
- **TypeScript** – Type-safe development
- **Bun** – Fast bundler and runtime

### Key Implementation

- Uses `ctx.ui.createFloatWidget()` for the floating panel
- Uses `setPointerCapture()` for reliable resize handling
- Aspect ratio preserved during resize using `naturalWidth/naturalHeight`
- Avatar detection via `src.includes('/avatar')` pattern

### Permissions

```json
{
  "permissions": ["ui_panels"]
}
```

## 📋 Changelog

### v1.0.0
- Initial release
- Floating widget with drag support
- Avatar click interception

### v1.0.1
- Pop-in/pop-out animations
- Proportional resize with aspect ratio lock

## 👤 Author

**Quackified**

- 🐙 GitHub: [@Quackified](https://github.com/Quackified)

---

Made for [Lumiverse](https://lumiverse.chat/)