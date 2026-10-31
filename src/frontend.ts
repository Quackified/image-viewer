import type {
  SpindleFrontendContext,
  SpindleFloatWidgetHandle,
  SpindleInputBarActionHandle,
} from 'lumiverse-spindle-types'

/**
 * Resolves full resolution URLs from Lumiverse thumbnail URLs
 * (e.g., strips `?size=sm` or `&size=lg`).
 */
export function resolveFullImageUrl(url: string): string {
  if (!url) return url
  try {
    const isRelative = url.startsWith('/')
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
    const parsed = new URL(url, origin)
    if (parsed.searchParams.has('size')) {
      parsed.searchParams.delete('size')
      if (isRelative || (typeof window !== 'undefined' && parsed.origin === window.location.origin)) {
        return parsed.pathname + (parsed.search ? parsed.search : '') + parsed.hash
      }
      return parsed.toString()
    }
  } catch {
    // fallback if URL parsing fails
  }
  return url
}

/**
 * Calculates window and viewport dimensions to strictly fit the image aspect ratio
 * within the maximum available screen space.
 */
export function calculateFitDimensions(
  naturalWidth: number,
  naturalHeight: number,
  maxAvailableWidth: number,
  maxAvailableHeight: number,
  toolbarHeight = 39,
  minViewportWidth = 260
): { widgetWidth: number; widgetHeight: number; viewportWidth: number; viewportHeight: number } {
  const ar = naturalWidth > 0 && naturalHeight > 0 ? naturalWidth / naturalHeight : 1
  const maxViewportH = Math.max(80, maxAvailableHeight - toolbarHeight)
  const maxViewportW = Math.max(minViewportWidth, maxAvailableWidth)

  let viewportW = naturalWidth
  let viewportH = naturalHeight

  if (viewportW > maxViewportW || viewportH > maxViewportH) {
    const ratio = Math.min(maxViewportW / viewportW, maxViewportH / viewportH)
    viewportW = Math.round(viewportW * ratio)
    viewportH = Math.round(viewportW / ar)
  }

  if (viewportW < minViewportWidth) {
    viewportW = minViewportWidth
    viewportH = Math.round(viewportW / ar)
  }

  if (viewportH > maxViewportH) {
    viewportH = maxViewportH
    viewportW = Math.round(viewportH * ar)
  }

  return {
    viewportWidth: Math.round(viewportW),
    viewportHeight: Math.round(viewportH),
    widgetWidth: Math.round(viewportW),
    widgetHeight: Math.round(viewportH + toolbarHeight),
  }
}

/**
 * Calculates window and viewport dimensions during resize dragging,
 * guaranteeing the viewport strictly maintains the image aspect ratio.
 */
export function calculateResizeDimensions(
  startViewportW: number,
  delta: number,
  aspectRatio: number,
  maxViewportW: number,
  maxViewportH: number,
  toolbarHeight = 39,
  minViewportWidth = 240
): { widgetWidth: number; widgetHeight: number; viewportWidth: number; viewportHeight: number } {
  const ar = aspectRatio > 0 ? aspectRatio : 1
  let viewportW = Math.max(minViewportWidth, startViewportW + delta)
  let viewportH = Math.round(viewportW / ar)

  if (viewportW > maxViewportW) {
    viewportW = maxViewportW
    viewportH = Math.round(viewportW / ar)
  }

  if (viewportH > maxViewportH) {
    viewportH = maxViewportH
    viewportW = Math.round(viewportH * ar)
  }

  return {
    viewportWidth: Math.round(viewportW),
    viewportHeight: Math.round(viewportH),
    widgetWidth: Math.round(viewportW),
    widgetHeight: Math.round(viewportH + toolbarHeight),
  }
}

export function setup(ctx: SpindleFrontendContext) {
  // Inject CSS styles matching Lumiverse theme system
  const removeStyles = ctx.dom.addStyle(`
    /* Hover affordance for clickable avatars & chat images */
    img[src*="/avatar"],
    .avatar img,
    [data-avatar] img,
    .message-content img,
    .attachment img,
    img[src*="/api/v1/images"],
    img[src*="/api/v1/image-gen"] {
      cursor: zoom-in !important;
    }

    /* Pop-in animation */
    @keyframes ivPopIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(8px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    /* Pop-out animation */
    @keyframes ivPopOut {
      from {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      to {
        opacity: 0;
        transform: scale(0.9) translateY(8px);
      }
    }

    @keyframes ivSpin {
      to { transform: rotate(360deg); }
    }

    .iv-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--lumiverse-fill, #16181d);
      border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.12));
      border-radius: var(--lumiverse-radius, 8px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
      overflow: hidden;
      position: relative;
      user-select: none;
      backdrop-filter: blur(16px);
      box-sizing: border-box;
    }

    .iv-container.pop-in {
      animation: ivPopIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .iv-container.pop-out {
      animation: ivPopOut 0.15s cubic-bezier(0.7, 0, 0.84, 0) forwards;
    }

    /* Top Controls Toolbar */
    .iv-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      padding: 6px 8px;
      background: var(--lumiverse-fill-subtle, rgba(255, 255, 255, 0.05));
      border-bottom: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.08));
      z-index: 10;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    .iv-toolbar-group {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .iv-btn {
      width: 26px;
      height: 26px;
      border: none;
      background: transparent;
      color: var(--lumiverse-text, #e2e8f0);
      border-radius: calc(var(--lumiverse-radius, 6px) - 2px);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      opacity: 0.8;
      transition: background 0.15s, opacity 0.15s, color 0.15s;
      padding: 0;
    }

    .iv-btn:hover {
      opacity: 1;
      background: var(--lumiverse-border, rgba(255, 255, 255, 0.12));
    }

    .iv-btn:active {
      transform: scale(0.94);
    }

    .iv-btn-close {
      color: var(--lumiverse-text, #e2e8f0);
      font-size: 16px;
      line-height: 1;
    }

    .iv-btn-close:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .iv-zoom-pill {
      font-size: 11px;
      font-variant-numeric: tabular-nums;
      padding: 2px 6px;
      color: var(--lumiverse-text-muted, #94a3b8);
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid transparent;
      transition: color 0.15s, background 0.15s;
    }

    .iv-zoom-pill:hover {
      color: var(--lumiverse-text, #fff);
      background: var(--lumiverse-border, rgba(255, 255, 255, 0.08));
    }

    /* Main Viewport Area */
    .iv-viewport {
      flex: 1;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      /* Subtle checkerboard pattern for transparency */
      background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%);
      background-size: 16px 16px;
      background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
    }

    .iv-viewport.panning {
      cursor: grabbing;
    }

    .iv-img-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      will-change: transform;
      transform-origin: center center;
      transition: transform 0.05s ease-out;
      pointer-events: none;
    }

    .iv-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      user-select: none;
      -webkit-user-drag: none;
      pointer-events: none;
      transition: opacity 0.15s ease-out;
    }

    /* Loading Spinner */
    .iv-spinner {
      position: absolute;
      width: 32px;
      height: 32px;
      border: 3px solid var(--lumiverse-border, rgba(255, 255, 255, 0.1));
      border-top-color: var(--lumiverse-accent, #38bdf8);
      border-radius: 50%;
      animation: ivSpin 0.8s linear infinite;
      display: none;
      z-index: 5;
    }

    .iv-spinner.active {
      display: block;
    }

    /* Error Message */
    .iv-error {
      display: none;
      position: absolute;
      padding: 12px 16px;
      color: #ef4444;
      font-size: 12px;
      text-align: center;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: var(--lumiverse-radius, 6px);
      z-index: 5;
    }

    .iv-error.active {
      display: block;
    }

    /* Resize Handle */
    .image-viewer-resize {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 22px;
      height: 22px;
      cursor: se-resize;
      opacity: 0.6;
      transition: opacity 0.2s;
      touch-action: none;
      z-index: 30;
    }

    .image-viewer-resize:hover {
      opacity: 1;
    }

    .image-viewer-resize::after {
      content: '';
      position: absolute;
      bottom: 3px;
      right: 3px;
      width: 12px;
      height: 12px;
      background: repeating-linear-gradient(
        -45deg,
        var(--lumiverse-text, #fff),
        var(--lumiverse-text, #fff) 1px,
        transparent 1px,
        transparent 4px
      );
      mask-image: linear-gradient(to top left, #000 50%, transparent 50%);
      -webkit-mask-image: linear-gradient(to top left, #000 50%, transparent 50%);
    }
  `)

  // References and state
  let widget: SpindleFloatWidgetHandle | null = null
  let inputAction: SpindleInputBarActionHandle | null = null

  // Image display state
  let currentImageUrl = ''
  let naturalWidth = 0
  let naturalHeight = 0
  let currentAspectRatio = 1

  // Pan & Zoom state
  let scale = 1
  let panX = 0
  let panY = 0
  let rotation = 0
  let flipH = false

  // Dom element references inside the widget
  let containerEl: HTMLElement | null = null
  let toolbarEl: HTMLElement | null = null
  let viewportEl: HTMLElement | null = null
  let wrapperEl: HTMLElement | null = null
  let imgEl: HTMLImageElement | null = null
  let spinnerEl: HTMLElement | null = null
  let errorEl: HTMLElement | null = null
  let zoomPill: HTMLElement | null = null

  // Panning tracking
  let isPanning = false
  let panStartX = 0
  let panStartY = 0

  // Resizing tracking
  let isResizing = false
  let resizeStartX = 0
  let resizeStartY = 0
  let resizeStartW = 0

  // Check if ui_panels permission is currently granted
  async function hasUiPanelsPermission(): Promise<boolean> {
    try {
      const granted = await ctx.permissions.getGranted()
      return granted.includes('ui_panels')
    } catch {
      return true
    }
  }

  // Returns aspect ratio accounting for current 90° / 270° rotation
  function getEffectiveAspectRatio(): number {
    if (rotation % 180 !== 0) {
      return 1 / (currentAspectRatio || 1)
    }
    return currentAspectRatio || 1
  }

  // Update image transform matrix
  function updateTransform() {
    if (!wrapperEl) return
    const flip = flipH ? -1 : 1
    wrapperEl.style.transform = `translate(${panX}px, ${panY}px) scale(${scale}) rotate(${rotation}deg) scaleX(${flip})`
    if (zoomPill) {
      if (scale === 1 && panX === 0 && panY === 0) {
        zoomPill.textContent = 'Fit'
      } else {
        zoomPill.textContent = `${Math.round(scale * 100)}%`
      }
    }
  }

  // Reset transform to 100% Fit Aspect Ratio and centered
  function resetTransform() {
    scale = 1
    panX = 0
    panY = 0
    updateTransform()
  }

  // Initialize the floating widget
  function initWidget(): boolean {
    if (widget) return true

    try {
      widget = ctx.ui.createFloatWidget({
        width: 440,
        height: 340,
        initialPosition: {
          x: Math.max(20, Math.round((window.innerWidth - 440) / 2)),
          y: Math.max(20, Math.round((window.innerHeight - 340) / 2)),
        },
        snapToEdge: true,
        tooltip: 'Image Viewer',
        chromeless: true,
      })
    } catch (err) {
      console.error('[Image Viewer] Failed to create float widget:', err)
      return false
    }

    widget.root.innerHTML = `
      <div class="iv-container">
        <div class="iv-toolbar">
          <div class="iv-toolbar-group">
            <button class="iv-btn" data-action="zoom-out" title="Zoom Out (-)">−</button>
            <span class="iv-zoom-pill" data-action="zoom-fit" title="Click to Fit Aspect Ratio (0)">Fit</span>
            <button class="iv-btn" data-action="zoom-in" title="Zoom In (+)">+</button>
            <button class="iv-btn" data-action="zoom-fit" title="Fit Aspect Ratio (0)">⊡</button>
            <button class="iv-btn" data-action="rotate" title="Rotate 90° (R)">↻</button>
            <button class="iv-btn" data-action="flip" title="Flip Horizontal (H)">⇄</button>
          </div>
          <div class="iv-toolbar-group">
            <button class="iv-btn" data-action="fullscreen" title="Toggle Fullscreen (F)">⛶</button>
            <button class="iv-btn" data-action="copy-url" title="Copy Image URL">📋</button>
            <button class="iv-btn" data-action="open-tab" title="Open in New Tab">↗</button>
            <button class="iv-btn iv-btn-close" data-action="close" title="Close (Esc)">×</button>
          </div>
        </div>
        <div class="iv-viewport">
          <div class="iv-spinner"></div>
          <div class="iv-error">Failed to load image</div>
          <div class="iv-img-wrapper">
            <img class="iv-img" src="" alt="Preview" draggable="false" />
          </div>
        </div>
        <div class="image-viewer-resize" data-direction="se" title="Resize"></div>
      </div>
    `

    containerEl = widget.root.querySelector('.iv-container')
    toolbarEl = widget.root.querySelector('.iv-toolbar')
    viewportEl = widget.root.querySelector('.iv-viewport')
    wrapperEl = widget.root.querySelector('.iv-img-wrapper')
    imgEl = widget.root.querySelector('.iv-img')
    spinnerEl = widget.root.querySelector('.iv-spinner')
    errorEl = widget.root.querySelector('.iv-error')
    zoomPill = widget.root.querySelector('.iv-zoom-pill')

    // Start hidden
    widget.setVisible(false)

    // Toolbar button clicks
    toolbarEl?.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null
      if (!target) return
      const action = target.getAttribute('data-action')

      switch (action) {
        case 'zoom-in':
          scale = Math.min(10, Math.round(scale * 1.25 * 100) / 100)
          updateTransform()
          break
        case 'zoom-out':
          scale = Math.max(0.2, Math.round((scale / 1.25) * 100) / 100)
          updateTransform()
          break
        case 'zoom-fit':
          resetTransform()
          break
        case 'rotate': {
          rotation = (rotation + 90) % 360
          // Adjust window dimensions to match the rotated aspect ratio
          if (widget && containerEl) {
            const currentW = widget.root.offsetWidth
            const toolbarH = toolbarEl ? toolbarEl.offsetHeight : 39
            const currentViewportH = Math.max(80, widget.root.offsetHeight - toolbarH)
            const effectiveAR = getEffectiveAspectRatio()

            const dims = calculateFitDimensions(
              Math.round(currentViewportH * effectiveAR),
              currentViewportH,
              window.innerWidth * 0.85,
              window.innerHeight * 0.85,
              toolbarH,
              260
            )

            widget.setSize(dims.widgetWidth, dims.widgetHeight)
            widget.root.style.width = dims.widgetWidth + 'px'
            widget.root.style.height = dims.widgetHeight + 'px'
          }
          updateTransform()
          break
        }
        case 'flip':
          flipH = !flipH
          updateTransform()
          break
        case 'fullscreen':
          if (widget) {
            const isFs = widget.isFullscreen?.() ?? false
            widget.setFullscreen?.(!isFs)
          }
          break
        case 'copy-url':
          if (currentImageUrl) {
            navigator.clipboard.writeText(currentImageUrl).then(() => {
              target.textContent = '✓'
              setTimeout(() => {
                target.textContent = '📋'
              }, 1200)
            })
          }
          break
        case 'open-tab':
          if (currentImageUrl) {
            window.open(currentImageUrl, '_blank', 'noopener,noreferrer')
          }
          break
        case 'close':
          closeViewer()
          break
      }
    })

    // Viewport mouse wheel zoom (centered on pointer)
    viewportEl?.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault()
      if (!viewportEl) return

      const rect = viewportEl.getBoundingClientRect()
      const mouseX = e.clientX - rect.left - rect.width / 2
      const mouseY = e.clientY - rect.top - rect.height / 2

      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15
      const newScale = Math.min(10, Math.max(0.2, scale * factor))

      // Zoom towards mouse pointer
      panX = mouseX - ((mouseX - panX) * newScale) / scale
      panY = mouseY - ((mouseY - panY) * newScale) / scale
      scale = Math.round(newScale * 1000) / 1000

      updateTransform()
    }, { passive: false })

    // Viewport drag-to-pan
    viewportEl?.addEventListener('pointerdown', (e: PointerEvent) => {
      if (e.button !== 0) return
      if (!viewportEl) return

      isPanning = true
      panStartX = e.clientX - panX
      panStartY = e.clientY - panY
      viewportEl.classList.add('panning')
      viewportEl.setPointerCapture(e.pointerId)
    })

    viewportEl?.addEventListener('pointermove', (e: PointerEvent) => {
      if (!isPanning) return
      panX = e.clientX - panStartX
      panY = e.clientY - panStartY
      updateTransform()
    })

    const endPan = () => {
      if (!isPanning) return
      isPanning = false
      viewportEl?.classList.remove('panning')
    }

    viewportEl?.addEventListener('pointerup', endPan)
    viewportEl?.addEventListener('lostpointercapture', endPan)

    // Double click to toggle Fit Aspect Ratio vs 200% zoom
    viewportEl?.addEventListener('dblclick', (e: MouseEvent) => {
      if (scale === 1 && panX === 0 && panY === 0) {
        scale = 2
        if (viewportEl) {
          const rect = viewportEl.getBoundingClientRect()
          const mouseX = e.clientX - rect.left - rect.width / 2
          const mouseY = e.clientY - rect.top - rect.height / 2
          panX = mouseX - mouseX * 2
          panY = mouseY - mouseY * 2
        }
      } else {
        resetTransform()
      }
      updateTransform()
    })

    // Corner resize handle: strictly preserves image aspect ratio at every step
    const resizeHandle = widget.root.querySelector('.image-viewer-resize') as HTMLElement | null
    if (resizeHandle) {
      resizeHandle.addEventListener('pointerdown', (e: PointerEvent) => {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()

        if (!widget) return

        isResizing = true
        resizeStartX = e.clientX
        resizeStartY = e.clientY
        resizeStartW = widget.root.offsetWidth

        resizeHandle.setPointerCapture(e.pointerId)
        widget.root.style.pointerEvents = 'none'
        resizeHandle.style.pointerEvents = 'auto'
      })

      resizeHandle.addEventListener('pointermove', (e: PointerEvent) => {
        if (!isResizing || !widget) return

        const deltaX = e.clientX - resizeStartX
        const deltaY = e.clientY - resizeStartY
        const delta = Math.max(deltaX, deltaY)

        const pos = widget.getPosition()
        const toolbarH = toolbarEl ? toolbarEl.offsetHeight : 39
        const maxViewportW = window.innerWidth - pos.x - 16
        const maxViewportH = window.innerHeight - pos.y - 16 - toolbarH

        const effectiveAR = getEffectiveAspectRatio()

        const dims = calculateResizeDimensions(
          resizeStartW,
          delta,
          effectiveAR,
          maxViewportW,
          maxViewportH,
          toolbarH,
          240
        )

        widget.setSize(dims.widgetWidth, dims.widgetHeight)
        widget.root.style.width = dims.widgetWidth + 'px'
        widget.root.style.height = dims.widgetHeight + 'px'
      })

      const endResize = () => {
        if (!isResizing || !widget) return
        isResizing = false
        widget.root.style.pointerEvents = ''
        resizeHandle.style.pointerEvents = ''
      }

      resizeHandle.addEventListener('pointerup', endResize)
      resizeHandle.addEventListener('lostpointercapture', endResize)
    }

    return true
  }

  // Close the viewer with a pop-out animation
  function closeViewer() {
    if (!widget || !containerEl) return
    containerEl.classList.remove('pop-in')
    containerEl.classList.add('pop-out')

    setTimeout(() => {
      if (widget) {
        widget.setVisible(false)
        containerEl?.classList.remove('pop-out')
      }
    }, 150)
  }

  // Display an image in the viewer
  async function showImage(rawUrl: string, altText = 'Image Preview') {
    const fullUrl = resolveFullImageUrl(rawUrl)
    currentImageUrl = fullUrl

    // Ensure permission is granted
    const hasPerm = await hasUiPanelsPermission()
    if (!hasPerm) {
      try {
        const granted = await ctx.permissions.request(['ui_panels'], {
          reason: 'Image Viewer needs permission to open floating image panels.',
        })
        if (!granted.includes('ui_panels')) return
      } catch (err) {
        console.warn('[Image Viewer] ui_panels permission request rejected:', err)
        return
      }
    }

    if (!initWidget() || !widget) return

    // Show loading spinner
    spinnerEl?.classList.add('active')
    errorEl?.classList.remove('active')
    if (imgEl) imgEl.style.opacity = '0'

    // Preload to get intrinsic dimensions
    const loader = new Image()
    loader.onload = () => {
      spinnerEl?.classList.remove('active')
      naturalWidth = loader.naturalWidth || 600
      naturalHeight = loader.naturalHeight || 400
      currentAspectRatio = naturalWidth / naturalHeight
      rotation = 0
      flipH = false

      const toolbarH = toolbarEl ? toolbarEl.offsetHeight : 39
      const maxW = window.innerWidth * 0.85
      const maxH = window.innerHeight * 0.85

      const dims = calculateFitDimensions(
        naturalWidth,
        naturalHeight,
        maxW,
        maxH,
        toolbarH,
        260
      )

      widget!.setSize(dims.widgetWidth, dims.widgetHeight)
      widget!.root.style.width = dims.widgetWidth + 'px'
      widget!.root.style.height = dims.widgetHeight + 'px'

      // Center widget in viewport
      const posX = Math.max(16, Math.round((window.innerWidth - dims.widgetWidth) / 2))
      const posY = Math.max(16, Math.round((window.innerHeight - dims.widgetHeight) / 2))
      widget!.moveTo(posX, posY)

      // Set image source and reset transforms to fit aspect ratio
      if (imgEl) {
        imgEl.src = fullUrl
        imgEl.alt = altText
        imgEl.style.opacity = '1'
      }

      resetTransform()

      // Show widget with pop-in
      widget!.setVisible(true)
      containerEl?.classList.remove('pop-out')
      containerEl?.classList.add('pop-in')
    }

    loader.onerror = () => {
      spinnerEl?.classList.remove('active')
      errorEl?.classList.add('active')
      widget?.setVisible(true)
    }

    loader.src = fullUrl
  }

  // Keyboard shortcut handler
  const keyHandler = (e: KeyboardEvent) => {
    if (!widget || !widget.isVisible()) return

    // Do not intercept if typing in an input / textarea
    const active = document.activeElement
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable)) {
      return
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        closeViewer()
        break
      case '+':
      case '=':
        e.preventDefault()
        scale = Math.min(10, Math.round(scale * 1.25 * 100) / 100)
        updateTransform()
        break
      case '-':
      case '_':
        e.preventDefault()
        scale = Math.max(0.2, Math.round((scale / 1.25) * 100) / 100)
        updateTransform()
        break
      case '0':
        e.preventDefault()
        resetTransform()
        break
      case 'f':
      case 'F':
        e.preventDefault()
        if (widget) {
          const isFs = widget.isFullscreen?.() ?? false
          widget.setFullscreen?.(!isFs)
        }
        break
      case 'r':
      case 'R': {
        e.preventDefault()
        rotation = (rotation + 90) % 360
        if (widget && containerEl) {
          const currentW = widget.root.offsetWidth
          const toolbarH = toolbarEl ? toolbarEl.offsetHeight : 39
          const currentViewportH = Math.max(80, widget.root.offsetHeight - toolbarH)
          const effectiveAR = getEffectiveAspectRatio()

          const dims = calculateFitDimensions(
            Math.round(currentViewportH * effectiveAR),
            currentViewportH,
            window.innerWidth * 0.85,
            window.innerHeight * 0.85,
            toolbarH,
            260
          )

          widget.setSize(dims.widgetWidth, dims.widgetHeight)
          widget.root.style.width = dims.widgetWidth + 'px'
          widget.root.style.height = dims.widgetHeight + 'px'
        }
        updateTransform()
        break
      }
      case 'h':
      case 'H':
        e.preventDefault()
        flipH = !flipH
        updateTransform()
        break
    }
  }

  document.addEventListener('keydown', keyHandler)

  // Document click interception for avatars and chat images
  const clickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null
    if (!target) return

    // Ignore clicks inside our own viewer
    if (widget && widget.root.contains(target)) return

    // Find nearest clicked image
    const img = target.tagName === 'IMG' ? (target as HTMLImageElement) : target.closest('img')
    if (!img) return

    const src = img.getAttribute('src')
    if (!src) return

    // Check if this image should be opened
    const isAvatar = src.includes('/avatar') || !!img.closest('.avatar, [data-avatar], .portrait')
    const isAttachment = src.includes('/api/v1/images') || src.includes('/api/v1/image-gen') || !!img.closest('.attachment, [data-attachment]')
    const isMessageImg = !!img.closest('.message-content, .chat-message, [data-message-id]')

    // Content images with reasonable size
    const isContentImage = img.naturalWidth >= 32 && img.naturalHeight >= 32

    if (isAvatar || isAttachment || isMessageImg || isContentImage) {
      e.preventDefault()
      e.stopPropagation()
      showImage(src, img.alt || 'Image Preview')
    }
  }

  document.addEventListener('click', clickHandler, true)

  // Register chat input bar action in the Extras popover
  try {
    inputAction = ctx.ui.registerInputBarAction({
      id: 'view-character-avatar',
      label: 'View Character Avatar',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="5"/>
          <path d="M20 21a8 8 0 1 0-16 0"/>
        </svg>
      `,
    })

    inputAction.onClick(() => {
      const activeChat = ctx.getActiveChat?.()
      if (activeChat?.characterId) {
        showImage(`/api/v1/characters/${activeChat.characterId}/avatar`, 'Character Avatar')
      } else {
        const chatAvatar = document.querySelector('img[src*="/avatar"]') as HTMLImageElement | null
        if (chatAvatar?.src) {
          showImage(chatAvatar.src, 'Avatar')
        }
      }
    })
  } catch (err) {
    console.debug('[Image Viewer] Input bar action registration skipped:', err)
  }

  // Listen for permission changes (grant / revoke)
  const unsubPerm = ctx.events.on('PERMISSION_CHANGED', async (payload) => {
    const detail = payload as { permission?: string; granted?: boolean } | undefined
    if (detail?.permission === 'ui_panels') {
      if (!detail.granted && widget) {
        widget.destroy()
        widget = null
      }
    }
  })

  // Global helper for testing & programmatic access
  const helper = {
    show: showImage,
    close: closeViewer,
    reset: resetTransform,
    resolveUrl: resolveFullImageUrl,
  }

  ;(window as unknown as Record<string, unknown>).__lumiverseImageViewer = helper
  ;(window as unknown as Record<string, unknown>).testImageViewer = (url?: string) => {
    showImage(url || 'https://picsum.photos/800/600')
  }

  console.log('[Image Viewer] Extension loaded with strict fit aspect ratio mechanics')

  // Cleanup function
  return () => {
    document.removeEventListener('keydown', keyHandler)
    document.removeEventListener('click', clickHandler, true)
    unsubPerm?.()
    inputAction?.destroy()
    widget?.destroy()
    removeStyles()

    delete (window as unknown as Record<string, unknown>).__lumiverseImageViewer
    delete (window as unknown as Record<string, unknown>).testImageViewer

    console.log('[Image Viewer] Extension unloaded')
  }
}
