# Walkthrough: Resize Handle Fix

## Problem
The resize handle (`.image-viewer-resize`) in the bottom-right corner triggered the widget's **built-in drag** instead of resizing. All attempts with `stopPropagation()` and capture-phase listeners failed.

## Root Cause
Spindle's [createFloatWidget()](file:///c:/Users/Quacky/Documents/Coding/TS/image-viewer/node_modules/lumiverse-spindle-types/src/dom.ts#178-179) attaches drag handlers on a **wrapper element above `widget.root`**, outside the extension's DOM tree. Child-level `stopPropagation()` cannot prevent a parent wrapper from receiving the initial pointer event.

## Solution

```diff:frontend.ts
import type { SpindleFrontendContext } from 'lumiverse-spindle-types'

export function setup(ctx: SpindleFrontendContext) {
  // Inject CSS styles for the widget
  const removeStyles = ctx.dom.addStyle(`
    /* Pop-in animation */
    @keyframes imageViewerPopIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    /* Pop-out animation */
    @keyframes imageViewerPopOut {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.8);
      }
    }
    
    .image-viewer-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--lumiverse-fill);
      border-radius: var(--lumiverse-radius);
      overflow: hidden;
      position: relative;
    }
    
    .image-viewer-content.pop-in {
      animation: imageViewerPopIn 0.2s ease-out forwards;
    }
    
    .image-viewer-content.pop-out {
      animation: imageViewerPopOut 0.15s ease-in forwards;
    }
    
    .image-viewer-content img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .image-viewer-close {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 24px;
      height: 24px;
      border: none;
      background: var(--lumiverse-fill-subtle);
      color: var(--lumiverse-text);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      opacity: 0.7;
      transition: opacity 0.2s;
      z-index: 10;
    }
    
    .image-viewer-close:hover {
      opacity: 1;
    }
    
    /* Resize handle - bottom right corner with grip lines */
    .image-viewer-resize {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 20px;
      height: 20px;
      cursor: se-resize;
      opacity: 0.5;
      transition: opacity 0.2s;
    }
    
    .image-viewer-resize:hover {
      opacity: 1;
    }
    
    /* Grip lines using CSS */
    .image-viewer-resize::before,
    .image-viewer-resize::after {
      content: '';
      position: absolute;
      background: var(--lumiverse-text);
      border-radius: 1px;
    }
    
    /* First grip line */
    .image-viewer-resize::before {
      width: 10px;
      height: 2px;
      bottom: 6px;
      right: 4px;
      transform: rotate(-45deg);
    }
    
    /* Second grip line */
    .image-viewer-resize::after {
      width: 6px;
      height: 2px;
      bottom: 9px;
      right: 4px;
      transform: rotate(-45deg);
    }
    
    /* Avatar hover indicator - shows the avatar is clickable */
    .image-viewer-avatar-hover {
      cursor: zoom-in !important;
    }
  `)

  // Create the float widget
  const widget = ctx.ui.createFloatWidget({
    width: 400,
    height: 300,
    initialPosition: { x: 100, y: 100 },
    snapToEdge: true,
    tooltip: 'Image Viewer',
    chromeless: true
  })

  // Render HTML content into the widget
  widget.root.innerHTML = `
    <div class="image-viewer-content">
      <button class="image-viewer-close" title="Close">×</button>
      <img src="" alt="Image preview" />
      <div class="image-viewer-resize" data-direction="se"></div>
    </div>
  `

  // Get references to elements inside the widget
  const content = widget.root.querySelector('.image-viewer-content') as HTMLElement | null
  const image = widget.root.querySelector('img')
  const closeBtn = widget.root.querySelector('.image-viewer-close')
  
  // Check elements exist
  if (!content || !image || !closeBtn) {
    console.error('[Image Viewer] Failed to create widget content')
    widget.destroy()
    return
  }

  // Hide widget by default
  widget.setVisible(false)

  // Close button click handler with pop-out animation
  closeBtn.addEventListener('click', () => {
    content.classList.remove('pop-in')
    content.classList.add('pop-out')
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      widget.setVisible(false)
      content.classList.remove('pop-out')
    }, 150)
  })

  // Function to show an image in the viewer with pop-in animation
  const showImage = (imageUrl: string) => {
    image.setAttribute('src', imageUrl)
    widget.setVisible(true)
    
    // Trigger pop-in animation
    content.classList.remove('pop-out')
    content.classList.add('pop-in')
  }

  // Test function for development
  ;(window as any).testImageViewer = () => {
    showImage('https://picsum.photos/400/300')
  }
  
  console.log('[Image Viewer] Extension loaded! Test with: window.testImageViewer()')

  // Track resize state
  let isResizing = false
  let startX = 0
  let startY = 0
  let startWidth = 0
  let startHeight = 0

  // Get the resize handle
  const resizeHandle = widget.root.querySelector('.image-viewer-resize')

  if (resizeHandle) {
    // Resize handler - mousedown on the handle starts resize
    resizeHandle.addEventListener('mousedown', (event: Event) => {
      const mouseEvent = event as MouseEvent
      event.preventDefault()
      event.stopPropagation()
      
      isResizing = true
      startX = mouseEvent.clientX
      startY = mouseEvent.clientY
      startWidth = widget.root.offsetWidth
      startHeight = widget.root.offsetHeight
      
      console.log('[Image Viewer] Resize started')
    })
  }

  // Mouse move handler for resizing
  document.addEventListener('mousemove', (event: MouseEvent) => {
    if (!isResizing) return
    
    // Calculate new size (dragging bottom-right corner)
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY
    
    const newWidth = Math.max(200, startWidth + deltaX)
    const newHeight = Math.max(150, startHeight + deltaY)
    
    // Apply new size to the widget
    widget.root.style.width = newWidth + 'px'
    widget.root.style.height = newHeight + 'px'
  })

  // Mouse up handler - stop resizing
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false
      console.log('[Image Viewer] Resize ended')
    }
  })

  // Avatar click detection using event delegation
  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement
    
    // Check if clicked element is an image
    if (target.tagName !== 'IMG') return
    
    const img = target as HTMLImageElement
    const src = img.getAttribute('src')
    
    // Check if this is an avatar image (src contains /avatar)
    // This matches Lumiverse character avatars: /api/v1/characters/{id}/avatar
    if (src && src.includes('/avatar')) {
      // Prevent default behavior
      event.preventDefault()
      event.stopPropagation()
      
      // Show the image in our viewer
      showImage(src)
      
      console.log('[Image Viewer] Avatar clicked, showing:', src)
    }
  })

  // Cleanup function
  return () => {
    removeStyles()
    widget.destroy()
    console.log('[Image Viewer] Extension unloaded')
  }
}
===
import type { SpindleFrontendContext } from 'lumiverse-spindle-types'

export function setup(ctx: SpindleFrontendContext) {
  // Inject CSS styles for the widget
  const removeStyles = ctx.dom.addStyle(`
    /* Pop-in animation */
    @keyframes imageViewerPopIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    /* Pop-out animation */
    @keyframes imageViewerPopOut {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.8);
      }
    }
    
    .image-viewer-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--lumiverse-fill);
      border-radius: var(--lumiverse-radius);
      overflow: hidden;
      position: relative;
    }
    
    .image-viewer-content.pop-in {
      animation: imageViewerPopIn 0.2s ease-out forwards;
    }
    
    .image-viewer-content.pop-out {
      animation: imageViewerPopOut 0.15s ease-in forwards;
    }
    
    .image-viewer-content img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .image-viewer-close {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 24px;
      height: 24px;
      border: none;
      background: var(--lumiverse-fill-subtle);
      color: var(--lumiverse-text);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      opacity: 0.7;
      transition: opacity 0.2s;
      z-index: 10;
    }
    
    .image-viewer-close:hover {
      opacity: 1;
    }
    
    /* Resize handle - bottom right corner with grip lines */
    .image-viewer-resize {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 20px;
      height: 20px;
      cursor: se-resize;
      opacity: 0.5;
      transition: opacity 0.2s;
      touch-action: none;
      z-index: 20;
    }
    
    .image-viewer-resize:hover {
      opacity: 1;
    }
    
    /* Grip lines using CSS */
    .image-viewer-resize::before,
    .image-viewer-resize::after {
      content: '';
      position: absolute;
      background: var(--lumiverse-text);
      border-radius: 1px;
    }
    
    /* First grip line */
    .image-viewer-resize::before {
      width: 10px;
      height: 2px;
      bottom: 6px;
      right: 4px;
      transform: rotate(-45deg);
    }
    
    /* Second grip line */
    .image-viewer-resize::after {
      width: 6px;
      height: 2px;
      bottom: 9px;
      right: 4px;
      transform: rotate(-45deg);
    }
    
    /* Avatar hover indicator - shows the avatar is clickable */
    .image-viewer-avatar-hover {
      cursor: zoom-in !important;
    }
  `)

  // Create the float widget
  const widget = ctx.ui.createFloatWidget({
    width: 400,
    height: 300,
    initialPosition: { x: 100, y: 100 },
    snapToEdge: true,
    tooltip: 'Image Viewer',
    chromeless: true
  })

  // Render HTML content into the widget
  widget.root.innerHTML = `
    <div class="image-viewer-content">
      <button class="image-viewer-close" title="Close">×</button>
      <img src="" alt="Image preview" />
      <div class="image-viewer-resize" data-direction="se"></div>
    </div>
  `

  // Get references to elements inside the widget
  const content = widget.root.querySelector('.image-viewer-content') as HTMLElement | null
  const image = widget.root.querySelector('img')
  const closeBtn = widget.root.querySelector('.image-viewer-close')
  
  // Check elements exist
  if (!content || !image || !closeBtn) {
    console.error('[Image Viewer] Failed to create widget content')
    widget.destroy()
    return
  }

  // Hide widget by default
  widget.setVisible(false)

  // Close button click handler with pop-out animation
  closeBtn.addEventListener('click', () => {
    content.classList.remove('pop-in')
    content.classList.add('pop-out')
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      widget.setVisible(false)
      content.classList.remove('pop-out')
    }, 150)
  })

  // Function to show an image in the viewer with pop-in animation
  const showImage = (imageUrl: string) => {
    image.setAttribute('src', imageUrl)
    widget.setVisible(true)
    
    // Trigger pop-in animation
    content.classList.remove('pop-out')
    content.classList.add('pop-in')
  }

  // Test function for development
  ;(window as any).testImageViewer = () => {
    showImage('https://picsum.photos/400/300')
  }
  
  console.log('[Image Viewer] Extension loaded! Test with: window.testImageViewer()')

  // Track resize state
  let isResizing = false
  let startX = 0
  let startY = 0
  let startWidth = 0
  let startHeight = 0

  // Get the resize handle
  const resizeHandle = widget.root.querySelector('.image-viewer-resize')

  if (resizeHandle) {
    const handle = resizeHandle as HTMLElement

    // Pointer down: start resize, capture pointer, block framework drag
    handle.addEventListener('pointerdown', (e: PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()

      isResizing = true
      startX = e.clientX
      startY = e.clientY
      startWidth = widget.root.offsetWidth
      startHeight = widget.root.offsetHeight

      // Route all future pointer events to this handle
      handle.setPointerCapture(e.pointerId)

      // Disable pointer-events on widget root so the framework wrapper
      // never sees the drag and doesn't initiate its built-in move
      widget.root.style.pointerEvents = 'none'
      handle.style.pointerEvents = 'auto'

      console.log('[Image Viewer] Resize started')
    })

    // Pointer move: resize the widget (events routed here by capture)
    handle.addEventListener('pointermove', (e: PointerEvent) => {
      if (!isResizing) return

      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      const newWidth = Math.max(200, startWidth + deltaX)
      const newHeight = Math.max(150, startHeight + deltaY)

      widget.root.style.width = newWidth + 'px'
      widget.root.style.height = newHeight + 'px'
    })

    // Pointer up / lost capture: stop resizing, restore pointer-events
    const endResize = () => {
      if (!isResizing) return
      isResizing = false
      widget.root.style.pointerEvents = ''
      handle.style.pointerEvents = ''
      console.log('[Image Viewer] Resize ended')
    }

    handle.addEventListener('pointerup', endResize)
    handle.addEventListener('lostpointercapture', endResize)
  }

  // Avatar click detection using event delegation
  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement
    
    // Check if clicked element is an image
    if (target.tagName !== 'IMG') return
    
    const img = target as HTMLImageElement
    const src = img.getAttribute('src')
    
    // Check if this is an avatar image (src contains /avatar)
    // This matches Lumiverse character avatars: /api/v1/characters/{id}/avatar
    if (src && src.includes('/avatar')) {
      // Prevent default behavior
      event.preventDefault()
      event.stopPropagation()
      
      // Show the image in our viewer
      showImage(src)
      
      console.log('[Image Viewer] Avatar clicked, showing:', src)
    }
  })

  // Cleanup function
  return () => {
    removeStyles()
    widget.destroy()
    console.log('[Image Viewer] Extension unloaded')
  }
}
```

**Key technique — Pointer Capture + pointer-events bypass:**

1. **`handle.setPointerCapture(e.pointerId)`** — routes all subsequent pointer events directly to the resize handle element, regardless of cursor position
2. **`widget.root.style.pointerEvents = 'none'`** — makes the widget root invisible to pointer events, so the framework wrapper never sees the drag gesture
3. **`handle.style.pointerEvents = 'auto'`** — keeps the handle itself responsive (it has capture)
4. On pointer up / lost capture, both styles are restored

## Build Verification
```
$ bun run build:frontend
Bundled 1 module in 42ms
  frontend.js  6.22 KB  (entry point)
```
No errors. Ready for manual testing in Lumiverse.

## Manual Testing Steps
1. Load the extension in Lumiverse
2. Open the image viewer (click avatar or `window.testImageViewer()`)
3. **Resize**: drag the bottom-right grip lines → widget should resize
4. **Drag**: click anywhere else on widget → widget should move
5. **Close**: click × → should animate out
