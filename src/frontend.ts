import type {
  SpindleFrontendContext,
  SpindleFloatWidgetHandle,
  SpindleInputBarActionHandle,
  SpindleDockPanelHandle,
} from 'lumiverse-spindle-types'

export type AnchorPosition = 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right'

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
  minViewportWidth = 280
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
  minViewportWidth = 280
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

/**
 * Calculates exact screen coordinates for preset anchor locations with zero edge clamping.
 */
export function calculateAnchorPosition(
  anchor: AnchorPosition,
  widgetWidth: number,
  widgetHeight: number,
  windowWidth: number,
  windowHeight: number,
  margin = 0
): { x: number; y: number } {
  let x = margin
  let y = margin

  switch (anchor) {
    case 'top-left':
      x = margin
      y = margin
      break
    case 'top-right':
      x = Math.max(0, windowWidth - widgetWidth - margin)
      y = margin
      break
    case 'center':
      x = Math.max(0, Math.round((windowWidth - widgetWidth) / 2))
      y = Math.max(0, Math.round((windowHeight - widgetHeight) / 2))
      break
    case 'bottom-left':
      x = margin
      y = Math.max(0, windowHeight - widgetHeight - margin)
      break
    case 'bottom-right':
      x = Math.max(0, windowWidth - widgetWidth - margin)
      y = Math.max(0, windowHeight - widgetHeight - margin)
      break
  }

  return { x, y }
}

/**
 * Calculates host coordinate and root transform offset to compensate for
 * host container padding (e.g. Lumiverse's 12px clamp) so the window can sit flush against viewport edges.
 */
export function calculateEdgeFlushPlacement(
  targetX: number,
  targetY: number,
  widgetWidth: number,
  widgetHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  hostPadding = 12
): { hostX: number; hostY: number; offsetX: number; offsetY: number } {
  const clampedTargetX = Math.max(0, Math.min(targetX, Math.max(0, viewportWidth - widgetWidth)))
  const clampedTargetY = Math.max(0, Math.min(targetY, Math.max(0, viewportHeight - widgetHeight)))

  const maxHostX = Math.max(hostPadding, viewportWidth - widgetWidth - hostPadding)
  const maxHostY = Math.max(hostPadding, viewportHeight - widgetHeight - hostPadding)

  const hostX = Math.max(hostPadding, Math.min(clampedTargetX, maxHostX))
  const hostY = Math.max(hostPadding, Math.min(clampedTargetY, maxHostY))

  return {
    hostX,
    hostY,
    offsetX: clampedTargetX - hostX,
    offsetY: clampedTargetY - hostY,
  }
}


export type ResizeCorner = 'nw' | 'ne' | 'sw' | 'se'
export type DockEdge = 'left' | 'right' | 'top' | 'bottom'
export type LayoutMode = 'float' | 'dock-left' | 'dock-right' | 'dock-top' | 'dock-bottom'

export const MIN_VIEWPORT_WIDTH = 320
export const DOCK_MIN_SIZE = 240

/**
 * Magnetic edge/center snapping for a dragged window. Returns the snapped position and
 * which axis (if any) latched, so callers can show feedback and derive anchors.
 */
export function snapPosition(
  x: number,
  y: number,
  widgetWidth: number,
  widgetHeight: number,
  windowWidth: number,
  windowHeight: number,
  threshold = 16
): { x: number; y: number; snapX: 'start' | 'center' | 'end' | null; snapY: 'start' | 'center' | 'end' | null } {
  const axis = (pos: number, size: number, bound: number) => {
    const max = Math.max(0, bound - size)
    const candidates: Array<[number, 'start' | 'center' | 'end']> = [
      [0, 'start'],
      [max, 'end'],
      [Math.round(max / 2), 'center'],
    ]
    let best: { value: number; kind: 'start' | 'center' | 'end'; dist: number } | null = null
    for (const [value, kind] of candidates) {
      const dist = Math.abs(pos - value)
      if (dist <= threshold && (!best || dist < best.dist)) best = { value, kind, dist }
    }
    return best ? { pos: best.value, kind: best.kind } : { pos, kind: null }
  }
  const ax = axis(x, widgetWidth, windowWidth)
  const ay = axis(y, widgetHeight, windowHeight)
  return { x: ax.pos, y: ay.pos, snapX: ax.kind, snapY: ay.kind }
}

/**
 * Derives which anchor preset (if any) a window currently sits on, so anchors stay
 * correct state derived from geometry rather than a flag that goes stale after a drag/resize.
 */
export function detectAnchor(
  x: number,
  y: number,
  widgetWidth: number,
  widgetHeight: number,
  windowWidth: number,
  windowHeight: number,
  tolerance = 1
): AnchorPosition | null {
  const maxX = Math.max(0, windowWidth - widgetWidth)
  const maxY = Math.max(0, windowHeight - widgetHeight)
  const left = Math.abs(x) <= tolerance
  const right = Math.abs(x - maxX) <= tolerance
  const top = Math.abs(y) <= tolerance
  const bottom = Math.abs(y - maxY) <= tolerance
  const midX = Math.abs(x - Math.round(maxX / 2)) <= tolerance
  const midY = Math.abs(y - Math.round(maxY / 2)) <= tolerance

  if (left && top) return 'top-left'
  if (right && top) return 'top-right'
  if (left && bottom) return 'bottom-left'
  if (right && bottom) return 'bottom-right'
  if (midX && midY) return 'center'
  return null
}

/**
 * Corner resize that keeps the opposite corner pinned and the image aspect ratio exact.
 * Growth is clamped to the room available on the side the window is expanding into, which
 * is what makes right/bottom-docked windows resizable from their free corners without jitter.
 */
export function calculateCornerResize(
  corner: ResizeCorner,
  start: { x: number; y: number; viewportWidth: number; widgetHeight: number },
  dx: number,
  dy: number,
  aspectRatio: number,
  windowWidth: number,
  windowHeight: number,
  toolbarHeight = 39,
  minViewportWidth = MIN_VIEWPORT_WIDTH
): { x: number; y: number; widgetWidth: number; widgetHeight: number; viewportWidth: number; viewportHeight: number } {
  const ar = aspectRatio > 0 ? aspectRatio : 1
  const west = corner.includes('w')
  const north = corner.includes('n')

  const growX = west ? -dx : dx
  const growY = (north ? -dy : dy) * ar
  const delta = Math.max(growX, growY)

  const right = start.x + start.viewportWidth
  const bottom = start.y + start.widgetHeight
  const availW = west ? right : windowWidth - start.x
  const availVH = (north ? bottom : windowHeight - start.y) - toolbarHeight

  const dims = calculateResizeDimensions(
    start.viewportWidth,
    delta,
    ar,
    Math.max(1, availW),
    Math.max(1, availVH),
    toolbarHeight,
    minViewportWidth
  )

  return {
    ...dims,
    x: west ? right - dims.widgetWidth : start.x,
    y: north ? bottom - dims.widgetHeight : start.y,
  }
}

/** Clamps a dock panel size to sane bounds for its edge (never more than 70% of the axis). */
export function clampDockSize(size: number, edge: DockEdge, windowWidth: number, windowHeight: number): number {
  const axis = edge === 'left' || edge === 'right' ? windowWidth : windowHeight
  const max = Math.max(DOCK_MIN_SIZE, Math.floor(axis * 0.7))
  return Math.round(Math.min(max, Math.max(DOCK_MIN_SIZE, size)))
}

/** Default dock size: roughly a third of the screen along the docked axis. */
export function defaultDockSize(edge: DockEdge, windowWidth: number, windowHeight: number): number {
  const horizontal = edge === 'left' || edge === 'right'
  const raw = horizontal
    ? Math.min(520, Math.max(320, Math.round(windowWidth * 0.3)))
    : Math.min(520, Math.max(260, Math.round(windowHeight * 0.38)))
  return clampDockSize(raw, edge, windowWidth, windowHeight)
}

/** Scale factor (relative to the "Fit" zoom) at which the image shows at 1:1 natural pixels. */
export function calculateActualSizeScale(
  naturalWidth: number,
  naturalHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  rotated = false
): number {
  const w = rotated ? naturalHeight : naturalWidth
  const h = rotated ? naturalWidth : naturalHeight
  if (w <= 0 || h <= 0 || viewportWidth <= 0 || viewportHeight <= 0) return 1
  const fit = Math.min(viewportWidth / w, viewportHeight / h)
  return fit > 0 ? 1 / fit : 1
}

const VIEWER_CSS = `
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

    @keyframes ivPopIn {
      from { opacity: 0; transform: scale(0.92) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes ivPopOut {
      from { opacity: 1; transform: scale(1) translateY(0); }
      to { opacity: 0; transform: scale(0.92) translateY(8px); }
    }
    @keyframes ivSpin { to { transform: rotate(360deg); } }

    .iv-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--lumiverse-fill, #16181d);
      border: none;
      border-radius: var(--lumiverse-radius, 8px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), inset 0 0 0 1px var(--lumiverse-border, rgba(255, 255, 255, 0.12));
      overflow: hidden;
      position: relative;
      user-select: none;
      backdrop-filter: blur(16px);
      box-sizing: border-box;
      transition: box-shadow 0.12s;
    }

    .iv-container.pop-in { animation: ivPopIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .iv-container.pop-out { animation: ivPopOut 0.15s cubic-bezier(0.7, 0, 0.84, 0) forwards; }

    /* Magnetic-snap feedback while dragging a floating window */
    .iv-container.is-snapped {
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), inset 0 0 0 2px var(--lumiverse-accent, #38bdf8);
    }

    /* Docked: occupies layout space owned by the host, so no float chrome */
    .iv-container.is-docked {
      border-radius: 0;
      backdrop-filter: none;
      animation: none;
      box-shadow: none;
    }
    .iv-container.dock-right { border-left: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.12)); }
    .iv-container.dock-left { border-right: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.12)); }
    .iv-container.dock-top { border-bottom: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.12)); }
    .iv-container.dock-bottom { border-top: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.12)); }
    .iv-container.is-docked .iv-float-only { display: none !important; }

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
      height: 39px;
      min-height: 39px;
      max-height: 39px;
      cursor: grab;
      touch-action: none;
    }
    .iv-container.is-moving .iv-toolbar { cursor: grabbing; }
    .iv-container.is-locked .iv-toolbar { cursor: nwse-resize; }
    .iv-container.is-docked .iv-toolbar { cursor: default; }

    .iv-toolbar-group { display: flex; align-items: center; gap: 2px; }

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
    .iv-btn:hover { opacity: 1; background: var(--lumiverse-border, rgba(255, 255, 255, 0.12)); }
    .iv-btn:active { transform: scale(0.94); }
    .iv-btn.active {
      color: var(--lumiverse-accent, #38bdf8);
      background: rgba(56, 189, 248, 0.15);
      opacity: 1;
    }
    .iv-btn-close { font-size: 16px; line-height: 1; }
    .iv-btn-close:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

    .iv-zoom-pill {
      min-width: 34px;
      text-align: center;
      box-sizing: border-box;
      font-size: 11px;
      font-variant-numeric: tabular-nums;
      padding: 2px 4px;
      color: var(--lumiverse-text-muted, #94a3b8);
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid transparent;
      transition: color 0.15s, background 0.15s;
    }
    .iv-zoom-pill:hover { color: var(--lumiverse-text, #fff); background: var(--lumiverse-border, rgba(255, 255, 255, 0.08)); }

    /* Pan/zoom lock dims the controls that would otherwise do nothing */
    .iv-container.is-image-locked .iv-zoom-ctl { opacity: 0.3; cursor: not-allowed; }
    .iv-container.is-image-locked .iv-zoom-ctl:hover { background: transparent; }

    /* Dropdown Menus */
    .iv-menu {
      position: absolute;
      top: 42px;
      right: 6px;
      min-width: 190px;
      max-height: calc(100% - 48px);
      overflow-y: auto;
      background: var(--lumiverse-fill, #16181d);
      border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.15));
      border-radius: var(--lumiverse-radius, 8px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(20px);
      z-index: 50;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      box-sizing: border-box;
      animation: ivPopIn 0.12s ease-out forwards;
    }
    .iv-menu-header {
      font-size: 10px;
      font-weight: 600;
      color: var(--lumiverse-text-muted, #94a3b8);
      padding: 4px 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .iv-menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
    .iv-anchor-grid button:last-child:nth-child(odd) { grid-column: span 2; }
    .iv-mode-grid button[data-mode="float"] { grid-column: span 2; }

    .iv-menu-btn {
      padding: 6px 8px;
      border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.08));
      background: var(--lumiverse-fill-subtle, rgba(255, 255, 255, 0.04));
      color: var(--lumiverse-text, #e2e8f0);
      border-radius: calc(var(--lumiverse-radius, 6px) - 2px);
      font-size: 11px;
      cursor: pointer;
      text-align: left;
      transition: background 0.15s, color 0.15s;
    }
    .iv-menu-btn:hover { background: var(--lumiverse-border, rgba(255, 255, 255, 0.15)); color: #fff; }
    .iv-menu-btn.active {
      color: var(--lumiverse-accent, #38bdf8);
      border-color: var(--lumiverse-accent, #38bdf8);
      background: rgba(56, 189, 248, 0.12);
    }

    .iv-menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      border: none;
      background: transparent;
      color: var(--lumiverse-text, #e2e8f0);
      border-radius: calc(var(--lumiverse-radius, 6px) - 2px);
      font-size: 12px;
      cursor: pointer;
      text-align: left;
      width: 100%;
      box-sizing: border-box;
      transition: background 0.15s, color 0.15s;
    }
    .iv-menu-item:hover { background: var(--lumiverse-border, rgba(255, 255, 255, 0.15)); color: #fff; }
    .iv-menu-icon { font-size: 13px; width: 16px; text-align: center; }
    .iv-menu-divider { height: 1px; background: var(--lumiverse-border, rgba(255, 255, 255, 0.08)); margin: 4px 0; }

    /* Main Viewport Area. container-type lets the rotated image size itself in cq units. */
    .iv-viewport {
      flex: 1;
      min-height: 0;
      min-width: 0;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      container-type: size;
      background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%);
      background-size: 16px 16px;
      background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
    }
    .iv-viewport.panning { cursor: grabbing; }
    .iv-viewport.is-image-locked { cursor: default; touch-action: none; }
    /* Pan locked: grabbing anywhere moves the window instead (unless position is locked too) */
    .iv-container:not(.is-docked):not(.is-locked) .iv-viewport.is-image-locked { cursor: grab; }
    .iv-container.is-moving .iv-viewport.is-image-locked { cursor: grabbing; }

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
    /* A 90/270deg image is laid out with swapped box dimensions so, once rotated, it fills the viewport */
    .iv-img-wrapper.is-side .iv-img {
      width: 100cqh;
      height: 100cqw;
      flex: none;
      max-width: none;
    }

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
    .iv-spinner.active { display: block; }

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
    .iv-error.active { display: block; }

    /* Resize handles (floating only). SE carries the visible grip; the others are invisible hit areas. */
    .iv-corner { position: absolute; z-index: 30; touch-action: none; }
    .iv-corner-nw { top: 0; left: 0; width: 8px; height: 8px; cursor: nwse-resize; }
    .iv-corner-ne { top: 0; right: 0; width: 8px; height: 8px; cursor: nesw-resize; }
    .iv-corner-sw { bottom: 0; left: 0; width: 14px; height: 14px; cursor: nesw-resize; }
    .iv-container.is-locked .iv-corner-nw,
    .iv-container.is-locked .iv-corner-ne,
    .iv-container.is-locked .iv-corner-sw { pointer-events: none; }
    .iv-container.is-docked .iv-corner { display: none; }

    .image-viewer-resize {
      bottom: 0;
      right: 0;
      width: 22px;
      height: 22px;
      cursor: se-resize;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    .image-viewer-resize:hover { opacity: 1; }
    .image-viewer-resize::after {
      content: '';
      position: absolute;
      bottom: 3px;
      right: 3px;
      width: 12px;
      height: 12px;
      background: repeating-linear-gradient(-45deg, var(--lumiverse-text, #fff), var(--lumiverse-text, #fff) 1px, transparent 1px, transparent 4px);
      mask-image: linear-gradient(to top left, #000 50%, transparent 50%);
      -webkit-mask-image: linear-gradient(to top left, #000 50%, transparent 50%);
    }

    /* Dock splitter on the panel's inner edge */
    .iv-dock-resizer { display: none; position: absolute; z-index: 40; touch-action: none; background: transparent; transition: background 0.15s; }
    .iv-dock-resizer:hover, .iv-dock-resizer.is-active { background: var(--lumiverse-accent, #38bdf8); opacity: 0.55; }
    .iv-container.is-docked .iv-dock-resizer { display: block; }
    .iv-container.dock-right .iv-dock-resizer { left: 0; top: 0; bottom: 0; width: 5px; cursor: ew-resize; }
    .iv-container.dock-left .iv-dock-resizer { right: 0; top: 0; bottom: 0; width: 5px; cursor: ew-resize; }
    .iv-container.dock-top .iv-dock-resizer { bottom: 0; left: 0; right: 0; height: 5px; cursor: ns-resize; }
    .iv-container.dock-bottom .iv-dock-resizer { top: 0; left: 0; right: 0; height: 5px; cursor: ns-resize; }

    @media (prefers-reduced-motion: reduce) {
      .iv-container.pop-in, .iv-container.pop-out, .iv-menu { animation: none; }
      .iv-container.pop-out { opacity: 0; }
    }
`

const PREFS_KEY = 'image_viewer_prefs_v1'
const DOCK_MODES: LayoutMode[] = ['dock-left', 'dock-right', 'dock-top', 'dock-bottom']

interface ViewerPrefs {
  mode: LayoutMode
  lastDock: LayoutMode
  dockSizes: Partial<Record<DockEdge, number>>
  positionLocked: boolean
  anchor: AnchorPosition | null
}

function loadPrefs(): ViewerPrefs {
  const fallback: ViewerPrefs = { mode: 'float', lastDock: 'dock-right', dockSizes: {}, positionLocked: false, anchor: null }
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<ViewerPrefs>
    const isMode = (m: unknown): m is LayoutMode => m === 'float' || DOCK_MODES.includes(m as LayoutMode)
    return {
      mode: isMode(parsed.mode) ? parsed.mode : fallback.mode,
      lastDock: isMode(parsed.lastDock) && parsed.lastDock !== 'float' ? parsed.lastDock : fallback.lastDock,
      dockSizes: parsed.dockSizes && typeof parsed.dockSizes === 'object' ? parsed.dockSizes : {},
      positionLocked: parsed.positionLocked === true,
      anchor: (['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'] as const).includes(parsed.anchor as AnchorPosition)
        ? (parsed.anchor as AnchorPosition)
        : null,
    }
  } catch {
    return fallback
  }
}

function savePrefs(prefs: ViewerPrefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    // storage unavailable (private mode / blocked) - preferences just won't persist
  }
}

const edgeOf = (mode: LayoutMode): DockEdge | null => (mode === 'float' ? null : (mode.slice(5) as DockEdge))

export function setup(ctx: SpindleFrontendContext) {
  const removeStyles = ctx.dom.addStyle(VIEWER_CSS)

  const prefs = loadPrefs()

  // Host surfaces. The same container element is re-parented between them.
  let widget: SpindleFloatWidgetHandle | null = null
  let dockPanel: SpindleDockPanelHandle | null = null
  let inputAction: SpindleInputBarActionHandle | null = null

  // Layout state
  let mode: LayoutMode = prefs.mode
  let isOpen = false
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  // Image display state
  let currentImageUrl = ''
  let naturalWidth = 600
  let naturalHeight = 400
  let currentAspectRatio = 1

  // Pan & Zoom state
  let scale = 1
  let panX = 0
  let panY = 0
  let rotation = 0
  let flipH = false

  // Lock and anchor state. Pan/zoom starts locked; the window itself starts movable.
  let isLocked = prefs.positionLocked
  let isImageLocked = true
  let currentAnchor: AnchorPosition | null = prefs.anchor
  let logicalX = 0
  let logicalY = 0
  let floatW = 440
  let floatH = 340

  // DOM references (the container lives inside either the float widget root or the dock panel root)
  let containerEl: HTMLElement | null = null
  let toolbarEl: HTMLElement | null = null
  let viewportEl: HTMLElement | null = null
  let wrapperEl: HTMLElement | null = null
  let imgEl: HTMLImageElement | null = null
  let spinnerEl: HTMLElement | null = null
  let errorEl: HTMLElement | null = null
  let zoomPill: HTMLElement | null = null
  let imageLockBtn: HTMLElement | null = null
  let layoutMenuEl: HTMLElement | null = null
  let moreMenuEl: HTMLElement | null = null

  // Pan tracking
  let isPanning = false
  let panStartX = 0
  let panStartY = 0

  // Window interaction tracking (move / toolbar resize / corner resize)
  interface Interaction {
    kind: 'move' | 'toolbar-resize' | 'corner'
    corner: ResizeCorner
    pointerId: number
    el: HTMLElement
    startX: number
    startY: number
    startLX: number
    startLY: number
    startVW: number
    startWH: number
    ar: number
    anchor: AnchorPosition | null
  }
  let interaction: Interaction | null = null

  // Dock splitter tracking
  let dockDrag: { pointerId: number; startX: number; startY: number; startSize: number } | null = null

  const TOOLBAR_HEIGHT = 39

  const persist = () =>
    savePrefs({
      mode,
      lastDock: mode !== 'float' ? mode : prefs.lastDock,
      dockSizes: prefs.dockSizes,
      positionLocked: isLocked,
      anchor: currentAnchor,
    })

  // Safe measurement of toolbar height, even when the container is detached or hidden
  function getToolbarHeight(): number {
    return toolbarEl && toolbarEl.offsetHeight > 0 ? toolbarEl.offsetHeight : TOOLBAR_HEIGHT
  }

  const minViewportW = () => Math.min(MIN_VIEWPORT_WIDTH, window.innerWidth)

  async function hasUiPanelsPermission(): Promise<boolean> {
    try {
      const granted = await ctx.permissions.getGranted()
      return granted.includes('ui_panels')
    } catch {
      return true
    }
  }

  // Aspect ratio accounting for the current 90/270 degree rotation
  function getEffectiveAspectRatio(): number {
    return rotation % 180 !== 0 ? 1 / (currentAspectRatio || 1) : currentAspectRatio || 1
  }

  function getEffectiveNatural(): { w: number; h: number } {
    return rotation % 180 !== 0 ? { w: naturalHeight, h: naturalWidth } : { w: naturalWidth, h: naturalHeight }
  }

  // ---------------------------------------------------------------------------
  // Transform / zoom
  // ---------------------------------------------------------------------------

  function updateTransform() {
    if (!wrapperEl) return
    const flip = flipH ? -1 : 1
    wrapperEl.classList.toggle('is-side', rotation % 180 !== 0)
    wrapperEl.style.transform = `translate(${panX}px, ${panY}px) scale(${scale}) rotate(${rotation}deg) scaleX(${flip})`
    if (zoomPill) {
      zoomPill.textContent = scale === 1 && panX === 0 && panY === 0 ? 'Fit' : `${Math.round(scale * 100)}%`
    }
  }

  function resetTransform() {
    scale = 1
    panX = 0
    panY = 0
    updateTransform()
  }

  function zoomBy(factor: number) {
    if (isImageLocked) return
    scale = Math.min(10, Math.max(0.2, Math.round(scale * factor * 100) / 100))
    updateTransform()
  }

  // Click on the zoom pill: Fit -> 1:1 natural pixels -> Fit
  function toggleActualSize() {
    if (isImageLocked) return
    if (scale === 1 && panX === 0 && panY === 0) {
      if (!viewportEl) return
      const eff = getEffectiveNatural()
      const actual = calculateActualSizeScale(eff.w, eff.h, viewportEl.clientWidth, viewportEl.clientHeight, false)
      scale = actual > 1.05 ? Math.min(10, Math.round(actual * 100) / 100) : 2
      updateTransform()
    } else {
      resetTransform()
    }
  }

  function closeMenus() {
    if (layoutMenuEl) layoutMenuEl.style.display = 'none'
    if (moreMenuEl) moreMenuEl.style.display = 'none'
  }

  const menusOpen = () => layoutMenuEl?.style.display === 'flex' || moreMenuEl?.style.display === 'flex'

  // ---------------------------------------------------------------------------
  // Lock state
  // ---------------------------------------------------------------------------

  function toggleLock(force?: boolean) {
    isLocked = typeof force === 'boolean' ? force : !isLocked
    updateLockState()
    persist()
  }

  function updateLockState() {
    containerEl?.classList.toggle('is-locked', isLocked)
    const icon = containerEl?.querySelector('.iv-lock-status-icon')
    const text = containerEl?.querySelector('.iv-lock-status-text')
    if (icon) icon.textContent = isLocked ? '🔒' : '📌'
    if (text) text.textContent = isLocked ? 'Unlock Position' : 'Lock Position'
  }

  function toggleImageLock(force?: boolean) {
    isImageLocked = typeof force === 'boolean' ? force : !isImageLocked
    if (isImageLocked) {
      isPanning = false
      viewportEl?.classList.remove('panning')
    }
    updateImageLockState()
  }

  function updateImageLockState() {
    viewportEl?.classList.toggle('is-image-locked', isImageLocked)
    containerEl?.classList.toggle('is-image-locked', isImageLocked)
    if (imageLockBtn) {
      imageLockBtn.textContent = isImageLocked ? '🔒' : '✋'
      imageLockBtn.title = isImageLocked
        ? 'Pan & zoom locked - click to unlock (P)'
        : 'Pan & zoom unlocked - click to lock (P)'
      imageLockBtn.classList.toggle('active', !isImageLocked)
    }
  }

  // ---------------------------------------------------------------------------
  // Floating window geometry
  // ---------------------------------------------------------------------------

  function setFloatSize(widgetWidth: number, widgetHeight: number) {
    if (!widget) return
    floatW = widgetWidth
    floatH = widgetHeight
    widget.setSize(widgetWidth, widgetHeight)
    widget.root.style.width = widgetWidth + 'px'
    widget.root.style.height = widgetHeight + 'px'
  }

  // Places the window at (x, y) in screen space, using a transform to cover the host's 12px clamp padding
  function placeFloat(x: number, y: number) {
    if (!widget) return
    const placement = calculateEdgeFlushPlacement(x, y, floatW, floatH, window.innerWidth, window.innerHeight, 12)
    logicalX = placement.hostX + placement.offsetX
    logicalY = placement.hostY + placement.offsetY
    widget.moveTo(placement.hostX, placement.hostY)
    widget.root.style.transform =
      placement.offsetX !== 0 || placement.offsetY !== 0
        ? `translate3d(${placement.offsetX}px, ${placement.offsetY}px, 0)`
        : ''
  }

  function applyAnchor(anchor: AnchorPosition) {
    if (!widget) return
    currentAnchor = anchor
    const { x, y } = calculateAnchorPosition(anchor, floatW, floatH, window.innerWidth, window.innerHeight, 0)
    placeFloat(x, y)
  }

  // Re-places the window after a size/viewport change without disturbing where the user put it
  function replaceFloat() {
    if (currentAnchor) applyAnchor(currentAnchor)
    else placeFloat(logicalX, logicalY)
  }

  // Sizes the window to the image (fit within 85% of the screen), keeping or recomputing the position
  function fitFloatToImage(keepPosition: boolean) {
    if (!widget) return
    const eff = getEffectiveNatural()
    const dims = calculateFitDimensions(
      eff.w,
      eff.h,
      window.innerWidth * 0.85,
      window.innerHeight * 0.85,
      getToolbarHeight(),
      minViewportW()
    )
    setFloatSize(dims.widgetWidth, dims.widgetHeight)
    if (currentAnchor) {
      applyAnchor(currentAnchor)
    } else if (keepPosition) {
      placeFloat(logicalX, logicalY)
    } else {
      placeFloat(
        Math.max(0, Math.round((window.innerWidth - floatW) / 2)),
        Math.max(0, Math.round((window.innerHeight - floatH) / 2))
      )
    }
  }

  // Swaps the window's viewport dimensions on rotation so it reshapes in place instead of drifting
  function rotateView() {
    rotation = (rotation + 90) % 360
    if (mode === 'float' && widget) {
      const tb = getToolbarHeight()
      const oldVW = floatW
      const oldVH = Math.max(80, floatH - tb)
      const dims = calculateFitDimensions(
        oldVH,
        oldVW,
        window.innerWidth * 0.9,
        window.innerHeight * 0.9,
        tb,
        minViewportW()
      )
      setFloatSize(dims.widgetWidth, dims.widgetHeight)
      replaceFloat()
    }
    updateTransform()
  }

  // Keeps the window inside the screen after the browser window changes size
  function reflowFloat() {
    if (!widget) return
    const tb = getToolbarHeight()
    const ar = getEffectiveAspectRatio()
    if (floatW > window.innerWidth || floatH > window.innerHeight) {
      const dims = calculateResizeDimensions(
        floatW,
        0,
        ar,
        window.innerWidth,
        Math.max(80, window.innerHeight - tb),
        tb,
        minViewportW()
      )
      setFloatSize(dims.widgetWidth, dims.widgetHeight)
    }
    replaceFloat()
  }

  function resetWindow() {
    currentAnchor = null
    if (mode !== 'float') setMode('float')
    else fitFloatToImage(false)
    closeMenus()
    persist()
  }

  // ---------------------------------------------------------------------------
  // Window interactions (move / toolbar resize / corner resize)
  // ---------------------------------------------------------------------------

  function beginInteraction(e: PointerEvent, el: HTMLElement, kind: Interaction['kind'], corner: ResizeCorner = 'se') {
    if (mode !== 'float' || !widget || e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    interaction = {
      kind,
      corner,
      pointerId: e.pointerId,
      el,
      startX: e.clientX,
      startY: e.clientY,
      startLX: logicalX,
      startLY: logicalY,
      startVW: floatW,
      startWH: floatH,
      ar: getEffectiveAspectRatio(),
      anchor: currentAnchor,
    }
    try {
      el.setPointerCapture(e.pointerId)
    } catch {
      // capture can fail if the pointer is already gone
    }
    containerEl?.classList.add(kind === 'move' ? 'is-moving' : 'is-resizing')
  }

  function moveInteraction(e: PointerEvent) {
    const it = interaction
    if (!it || !widget || e.pointerId !== it.pointerId) return
    const dx = e.clientX - it.startX
    const dy = e.clientY - it.startY
    const vw = window.innerWidth
    const vh = window.innerHeight
    const tb = getToolbarHeight()

    if (it.kind === 'move') {
      let x = it.startLX + dx
      let y = it.startLY + dy
      let snapped = false
      if (!e.shiftKey) {
        const s = snapPosition(x, y, floatW, floatH, vw, vh, 16)
        x = s.x
        y = s.y
        snapped = !!(s.snapX || s.snapY)
      }
      containerEl?.classList.toggle('is-snapped', snapped)
      placeFloat(x, y)
    } else if (it.kind === 'toolbar-resize') {
      const delta = Math.abs(dx) >= Math.abs(dy) ? dx : dy
      const maxW = it.anchor ? vw : vw - it.startLX
      const maxVH = (it.anchor ? vh : vh - it.startLY) - tb
      const dims = calculateResizeDimensions(it.startVW, delta, it.ar, maxW, maxVH, tb, minViewportW())
      setFloatSize(dims.widgetWidth, dims.widgetHeight)
      if (it.anchor) applyAnchor(it.anchor)
      else placeFloat(it.startLX, it.startLY)
    } else {
      const r = calculateCornerResize(
        it.corner,
        { x: it.startLX, y: it.startLY, viewportWidth: it.startVW, widgetHeight: it.startWH },
        dx,
        dy,
        it.ar,
        vw,
        vh,
        tb,
        minViewportW()
      )
      setFloatSize(r.widgetWidth, r.widgetHeight)
      placeFloat(r.x, r.y)
    }
  }

  function endInteraction(e: PointerEvent) {
    const it = interaction
    if (!it || e.pointerId !== it.pointerId) return
    interaction = null
    containerEl?.classList.remove('is-moving', 'is-resizing', 'is-snapped')
    try {
      if (it.el.hasPointerCapture(e.pointerId)) it.el.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
    // Anchor is derived from where the window actually ended up
    currentAnchor = detectAnchor(logicalX, logicalY, floatW, floatH, window.innerWidth, window.innerHeight)
    persist()
  }

  function bindInteractionEvents(el: HTMLElement) {
    el.addEventListener('pointermove', moveInteraction)
    el.addEventListener('pointerup', endInteraction)
    el.addEventListener('pointercancel', endInteraction)
    el.addEventListener('lostpointercapture', endInteraction)
  }

  // ---------------------------------------------------------------------------
  // Hosting: float widget vs. DOM-aware dock panel
  // ---------------------------------------------------------------------------

  function ensureWidget(): boolean {
    if (widget) return true
    try {
      widget = ctx.ui.createFloatWidget({
        width: floatW,
        height: floatH,
        initialPosition: {
          x: Math.max(0, Math.round((window.innerWidth - floatW) / 2)),
          y: Math.max(0, Math.round((window.innerHeight - floatH) / 2)),
        },
        snapToEdge: false,
        tooltip: 'Image Viewer',
        chromeless: true,
      })
    } catch (err) {
      console.error('[Image Viewer] Failed to create float widget:', err)
      return false
    }
    widget.setVisible(false)
    // Safety net: if the host ever drags the widget itself, adopt its position as ours
    widget.onDragEnd((pos) => {
      currentAnchor = null
      placeFloat(pos.x, pos.y)
      currentAnchor = detectAnchor(logicalX, logicalY, floatW, floatH, window.innerWidth, window.innerHeight)
    })
    return true
  }

  function dockSizeFor(edge: DockEdge): number {
    return clampDockSize(
      prefs.dockSizes[edge] ?? defaultDockSize(edge, window.innerWidth, window.innerHeight),
      edge,
      window.innerWidth,
      window.innerHeight
    )
  }

  function unmountDock() {
    if (!dockPanel) return
    containerEl?.remove()
    try {
      dockPanel.destroy()
    } catch {
      // already gone
    }
    dockPanel = null
  }

  function applyModeClasses() {
    if (!containerEl) return
    const edge = edgeOf(mode)
    containerEl.classList.toggle('is-docked', !!edge)
    for (const e of ['left', 'right', 'top', 'bottom'] as const) {
      containerEl.classList.toggle('dock-' + e, edge === e)
    }
    containerEl.querySelectorAll<HTMLElement>('[data-mode]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode)
    })
  }

  // Mounts the container into the surface for the current mode and shows it
  function mountLayout(animate: boolean): boolean {
    if (!containerEl) return false
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
    const edge = edgeOf(mode)

    if (!edge) {
      unmountDock()
      if (!ensureWidget() || !widget) return false
      const wasVisible = widget.isVisible() && isOpen
      if (containerEl.parentElement !== widget.root) widget.root.appendChild(containerEl)
      applyModeClasses()
      containerEl.classList.remove('pop-out')
      fitFloatToImage(wasVisible)
      widget.setVisible(true)
      if (animate) {
        containerEl.classList.remove('pop-in')
        void containerEl.offsetWidth // restart the animation
        containerEl.classList.add('pop-in')
      }
    } else {
      if (widget?.isVisible()) widget.setVisible(false)
      if (typeof ctx.ui.requestDockPanel !== 'function') {
        console.warn('[Image Viewer] This Lumiverse build has no dock panel API; staying in float mode')
        mode = 'float'
        return mountLayout(animate)
      }
      if (!dockPanel) {
        try {
          // Distinct title per edge so the host can't reuse a remembered placement from another edge
          console.debug('[Image Viewer] Requesting dock panel on edge:', edge)
          dockPanel = ctx.ui.requestDockPanel({
            edge,
            title: `Image Viewer (${edge})`,
            size: dockSizeFor(edge),
            minSize: DOCK_MIN_SIZE,
            maxSize: clampDockSize(Infinity, edge, window.innerWidth, window.innerHeight),
            resizable: false,
            chromeless: true,
          })
        } catch (err) {
          console.warn('[Image Viewer] Dock panel unavailable, falling back to float:', err)
          mode = 'float'
          return mountLayout(animate)
        }
        dockPanel.root.style.cssText =
          'display:flex;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;'
        dockPanel.onVisibilityChange((visible) => {
          isOpen = visible
        })
      }
      containerEl.classList.remove('pop-in', 'pop-out')
      if (containerEl.parentElement !== dockPanel.root) dockPanel.root.appendChild(containerEl)
      applyModeClasses()
      dockPanel.expand()
    }
    isOpen = true
    return true
  }

  function setMode(next: LayoutMode) {
    if (next === mode && isOpen) {
      closeMenus()
      return
    }
    const prev = mode
    mode = next
    if (mode !== 'float') prefs.lastDock = mode
    if (isOpen) {
      // Switching docks: the old dock edge must go before the new one is requested
      if (prev !== mode) unmountDock()
      if (!mountLayout(false)) {
        mode = prev
      }
    } else {
      applyModeClasses()
    }
    closeMenus()
    persist()
  }

  function toggleDock() {
    setMode(mode === 'float' ? prefs.lastDock : 'float')
  }

  function closeViewer() {
    if (!isOpen || !containerEl) return
    closeMenus()
    isOpen = false
    interaction = null
    if (mode === 'float' && widget) {
      containerEl.classList.remove('pop-in')
      containerEl.classList.add('pop-out')
      closeTimer = setTimeout(() => {
        closeTimer = null
        if (!isOpen && widget) {
          widget.setVisible(false)
          containerEl?.classList.remove('pop-out')
        }
      }, 150)
    } else {
      unmountDock()
    }
  }

  // ---------------------------------------------------------------------------
  // Container (built once, re-parented between host surfaces)
  // ---------------------------------------------------------------------------

  function ensureContainer() {
    if (containerEl) return

    const root = document.createElement('div')
    root.style.cssText = 'display:contents;'
    root.innerHTML = `
      <div class="iv-container">
        <div class="iv-toolbar">
          <div class="iv-toolbar-group">
            <button class="iv-btn iv-zoom-ctl" data-action="zoom-out" title="Zoom Out (-)">−</button>
            <span class="iv-zoom-pill iv-zoom-ctl" data-action="zoom-toggle" title="Click: Fit / 100% (0)">Fit</span>
            <button class="iv-btn iv-zoom-ctl" data-action="zoom-in" title="Zoom In (+)">+</button>
            <button class="iv-btn" data-action="rotate" title="Rotate 90° (R)">↻</button>
            <button class="iv-btn" data-action="flip" title="Flip Horizontal (H)">⇄</button>
          </div>
          <div class="iv-toolbar-group">
            <button class="iv-btn iv-btn-imglock" data-action="toggle-image-lock" title="Pan & zoom locked - click to unlock (P)">🔒</button>
            <button class="iv-btn" data-action="layout-menu" title="Layout, docking & anchors (D toggles dock)">⊞</button>
            <button class="iv-btn" data-action="more-menu" title="More options">⋮</button>
            <button class="iv-btn iv-btn-close" data-action="close" title="Close (Esc)">×</button>
          </div>
        </div>

        <div class="iv-menu iv-layout-menu" style="display: none;">
          <div class="iv-menu-header">Mode</div>
          <div class="iv-menu-grid iv-mode-grid">
            <button class="iv-menu-btn" data-action="set-mode" data-mode="float" title="Free-floating window">▢ Float</button>
            <button class="iv-menu-btn" data-action="set-mode" data-mode="dock-left" title="Dock left of the chat">◧ Dock Left</button>
            <button class="iv-menu-btn" data-action="set-mode" data-mode="dock-right" title="Dock right of the chat">◨ Dock Right</button>
            <button class="iv-menu-btn" data-action="set-mode" data-mode="dock-top" title="Dock above the chat">⬒ Dock Top</button>
            <button class="iv-menu-btn" data-action="set-mode" data-mode="dock-bottom" title="Dock below the chat">⬓ Dock Bottom</button>
          </div>
          <div class="iv-float-only">
            <div class="iv-menu-divider"></div>
            <div class="iv-menu-header">Anchor</div>
            <div class="iv-menu-grid iv-anchor-grid">
              <button class="iv-menu-btn" data-action="anchor" data-anchor="top-left">↖ Top Left</button>
              <button class="iv-menu-btn" data-action="anchor" data-anchor="top-right">↗ Top Right</button>
              <button class="iv-menu-btn" data-action="anchor" data-anchor="center">✛ Center</button>
              <button class="iv-menu-btn" data-action="anchor" data-anchor="bottom-left">↙ Bottom Left</button>
              <button class="iv-menu-btn" data-action="anchor" data-anchor="bottom-right">↘ Bottom Right</button>
            </div>
            <div class="iv-menu-divider"></div>
            <button class="iv-menu-item" data-action="toggle-lock" title="Locked: toolbar drag resizes instead of moving (L)">
              <span class="iv-menu-icon iv-lock-status-icon">📌</span>
              <span class="iv-lock-status-text">Lock Position</span>
            </button>
            <button class="iv-menu-item" data-action="reset-window">
              <span class="iv-menu-icon">⟲</span>
              <span>Reset Window</span>
            </button>
          </div>
        </div>

        <div class="iv-menu iv-more-menu" style="display: none;">
          <button class="iv-menu-item" data-action="copy-url">
            <span class="iv-menu-icon">📋</span>
            <span class="iv-copy-label">Copy Image Link</span>
          </button>
          <button class="iv-menu-item" data-action="open-tab">
            <span class="iv-menu-icon">↗</span>
            <span>Open in New Tab</span>
          </button>
          <button class="iv-menu-item" data-action="download">
            <span class="iv-menu-icon">⬇</span>
            <span>Download Image</span>
          </button>
        </div>

        <div class="iv-viewport">
          <div class="iv-spinner"></div>
          <div class="iv-error">Failed to load image</div>
          <div class="iv-img-wrapper">
            <img class="iv-img" src="" alt="Preview" draggable="false" />
          </div>
        </div>

        <div class="iv-corner iv-corner-nw" data-corner="nw"></div>
        <div class="iv-corner iv-corner-ne" data-corner="ne"></div>
        <div class="iv-corner iv-corner-sw" data-corner="sw"></div>
        <div class="iv-corner image-viewer-resize" data-corner="se" title="Resize"></div>
        <div class="iv-dock-resizer" title="Drag to resize"></div>
      </div>
    `
    containerEl = root.firstElementChild as HTMLElement
    containerEl.remove()

    toolbarEl = containerEl.querySelector('.iv-toolbar')
    viewportEl = containerEl.querySelector('.iv-viewport')
    wrapperEl = containerEl.querySelector('.iv-img-wrapper')
    imgEl = containerEl.querySelector('.iv-img')
    spinnerEl = containerEl.querySelector('.iv-spinner')
    errorEl = containerEl.querySelector('.iv-error')
    zoomPill = containerEl.querySelector('.iv-zoom-pill')
    imageLockBtn = containerEl.querySelector('.iv-btn-imglock')
    layoutMenuEl = containerEl.querySelector('.iv-layout-menu')
    moreMenuEl = containerEl.querySelector('.iv-more-menu')

    // Toolbar: moves the window when unlocked, resizes it (aspect locked) when locked
    toolbarEl?.addEventListener('pointerdown', (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, input, select, .iv-zoom-pill, .iv-menu')) return
      if (mode !== 'float') return
      beginInteraction(e, toolbarEl!, isLocked ? 'toolbar-resize' : 'move')
    })
    if (toolbarEl) bindInteractionEvents(toolbarEl)

    // Corner handles
    containerEl.querySelectorAll<HTMLElement>('.iv-corner').forEach((handle) => {
      handle.addEventListener('pointerdown', (e: PointerEvent) => {
        beginInteraction(e, handle, 'corner', (handle.dataset.corner as ResizeCorner) || 'se')
      })
      bindInteractionEvents(handle)
    })

    // Click handling for buttons and menu items
    containerEl.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('[data-action]') as HTMLElement | null
      if (!target) return
      switch (target.getAttribute('data-action')) {
        case 'zoom-in':
          zoomBy(1.25)
          break
        case 'zoom-out':
          zoomBy(1 / 1.25)
          break
        case 'zoom-toggle':
          toggleActualSize()
          break
        case 'rotate':
          rotateView()
          break
        case 'flip':
          flipH = !flipH
          updateTransform()
          break
        case 'layout-menu':
        case 'more-menu': {
          const menu = target.getAttribute('data-action') === 'layout-menu' ? layoutMenuEl : moreMenuEl
          if (!menu) break
          const wasShown = menu.style.display === 'flex'
          closeMenus()
          menu.style.display = wasShown ? 'none' : 'flex'
          break
        }
        case 'set-mode':
          setMode((target.dataset.mode as LayoutMode) || 'float')
          break
        case 'anchor':
          applyAnchor(target.dataset.anchor as AnchorPosition)
          persist()
          closeMenus()
          break
        case 'toggle-lock':
          toggleLock()
          closeMenus()
          break
        case 'reset-window':
          resetWindow()
          break
        case 'toggle-image-lock':
          toggleImageLock()
          closeMenus()
          break
        case 'copy-url':
          if (currentImageUrl) {
            navigator.clipboard
              .writeText(new URL(currentImageUrl, window.location.origin).toString())
              .then(() => {
                const label = target.querySelector('.iv-copy-label')
                if (label) label.textContent = '✓ Copied!'
                setTimeout(() => {
                  if (label) label.textContent = 'Copy Image Link'
                  closeMenus()
                }, 800)
              })
              .catch(() => closeMenus())
          }
          break
        case 'open-tab':
          if (currentImageUrl) {
            window.open(currentImageUrl, '_blank', 'noopener,noreferrer')
            closeMenus()
          }
          break
        case 'download':
          if (currentImageUrl) {
            const a = document.createElement('a')
            a.href = currentImageUrl
            a.download = ''
            a.rel = 'noopener'
            document.body.appendChild(a)
            a.click()
            a.remove()
            closeMenus()
          }
          break
        case 'close':
          closeViewer()
          break
      }
    })

    // Wheel zoom, centered on the pointer. While pan/zoom is locked the wheel is left alone.
    viewportEl?.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        if (isImageLocked || !viewportEl) return
        e.preventDefault()
        const rect = viewportEl.getBoundingClientRect()
        const mouseX = e.clientX - rect.left - rect.width / 2
        const mouseY = e.clientY - rect.top - rect.height / 2
        const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15
        const newScale = Math.min(10, Math.max(0.2, scale * factor))
        panX = mouseX - ((mouseX - panX) * newScale) / scale
        panY = mouseY - ((mouseY - panY) * newScale) / scale
        scale = Math.round(newScale * 1000) / 1000
        updateTransform()
      },
      { passive: false }
    )

    // Viewport drag: pans when unlocked; when pan is locked it drags the window instead
    viewportEl?.addEventListener('pointerdown', (e: PointerEvent) => {
      if (e.button !== 0 || !viewportEl) return
      if (isImageLocked) {
        if (mode === 'float') {
          if (!isLocked) beginInteraction(e, viewportEl, 'move')
          else e.preventDefault()
        }
        return
      }
      e.preventDefault()
      isPanning = true
      panStartX = e.clientX - panX
      panStartY = e.clientY - panY
      viewportEl.classList.add('panning')
      viewportEl.setPointerCapture(e.pointerId)
    })

    viewportEl?.addEventListener('pointermove', (e: PointerEvent) => {
      if (!isPanning || isImageLocked) return
      panX = e.clientX - panStartX
      panY = e.clientY - panStartY
      updateTransform()
    })

    const endPan = (e: PointerEvent) => {
      if (!isPanning) return
      isPanning = false
      viewportEl?.classList.remove('panning')
      try {
        if (viewportEl?.hasPointerCapture(e.pointerId)) viewportEl.releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    }
    viewportEl?.addEventListener('pointerup', endPan)
    viewportEl?.addEventListener('pointercancel', endPan)
    viewportEl?.addEventListener('lostpointercapture', endPan)
    if (viewportEl) bindInteractionEvents(viewportEl)

    // Double click: Fit <-> 200% at the cursor
    viewportEl?.addEventListener('dblclick', (e: MouseEvent) => {
      if (isImageLocked || !viewportEl) return
      if (scale === 1 && panX === 0 && panY === 0) {
        const rect = viewportEl.getBoundingClientRect()
        const mouseX = e.clientX - rect.left - rect.width / 2
        const mouseY = e.clientY - rect.top - rect.height / 2
        scale = 2
        panX = mouseX - mouseX * 2
        panY = mouseY - mouseY * 2
      } else {
        resetTransform()
      }
      updateTransform()
    })

    // Dock splitter on the panel's inner edge
    const splitter = containerEl.querySelector('.iv-dock-resizer') as HTMLElement | null
    splitter?.addEventListener('pointerdown', (e: PointerEvent) => {
      const edge = edgeOf(mode)
      if (!edge || !dockPanel || e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      dockDrag = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, startSize: dockSizeFor(edge) }
      splitter.classList.add('is-active')
      splitter.setPointerCapture(e.pointerId)
    })
    splitter?.addEventListener('pointermove', (e: PointerEvent) => {
      const edge = edgeOf(mode)
      if (!dockDrag || !edge || !dockPanel || e.pointerId !== dockDrag.pointerId) return
      const dx = e.clientX - dockDrag.startX
      const dy = e.clientY - dockDrag.startY
      const grow = edge === 'left' ? dx : edge === 'right' ? -dx : edge === 'top' ? dy : -dy
      const size = clampDockSize(dockDrag.startSize + grow, edge, window.innerWidth, window.innerHeight)
      prefs.dockSizes[edge] = size
      dockPanel.setSize(size)
    })
    const endDockDrag = (e: PointerEvent) => {
      if (!dockDrag || e.pointerId !== dockDrag.pointerId) return
      dockDrag = null
      splitter?.classList.remove('is-active')
      try {
        if (splitter?.hasPointerCapture(e.pointerId)) splitter.releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
      persist()
    }
    splitter?.addEventListener('pointerup', endDockDrag)
    splitter?.addEventListener('pointercancel', endDockDrag)
    splitter?.addEventListener('lostpointercapture', endDockDrag)

    updateLockState()
    updateImageLockState()
    applyModeClasses()
  }

  // Close dropdown menus on outside press
  const outsidePointerHandler = (e: PointerEvent) => {
    if (containerEl && !containerEl.contains(e.target as Node)) closeMenus()
  }
  document.addEventListener('pointerdown', outsidePointerHandler)

  // ---------------------------------------------------------------------------
  // Opening an image
  // ---------------------------------------------------------------------------

  async function showImage(rawUrl: string, altText = 'Image Preview') {
    const fullUrl = resolveFullImageUrl(rawUrl)
    currentImageUrl = fullUrl

    if (!(await hasUiPanelsPermission())) {
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

    ensureContainer()
    if (!containerEl) return

    spinnerEl?.classList.add('active')
    errorEl?.classList.remove('active')
    if (imgEl) imgEl.style.opacity = '0'
    closeMenus()

    // Preload to learn intrinsic dimensions
    const loader = new Image()
    loader.onload = () => {
      // A newer request may have replaced this one while it loaded
      if (currentImageUrl !== fullUrl) return
      spinnerEl?.classList.remove('active')
      naturalWidth = loader.naturalWidth || 600
      naturalHeight = loader.naturalHeight || 400
      currentAspectRatio = naturalWidth / naturalHeight
      rotation = 0
      flipH = false

      if (imgEl) {
        imgEl.src = fullUrl
        imgEl.alt = altText
        imgEl.style.opacity = '1'
      }
      resetTransform()
      updateLockState()
      updateImageLockState()

      if (!mountLayout(!isOpen)) {
        console.error('[Image Viewer] Could not mount viewer')
      }
    }

    loader.onerror = () => {
      if (currentImageUrl !== fullUrl) return
      spinnerEl?.classList.remove('active')
      errorEl?.classList.add('active')
      if (imgEl) imgEl.style.opacity = '0'
      mountLayout(!isOpen)
    }

    loader.src = fullUrl
  }

  // ---------------------------------------------------------------------------
  // Global listeners
  // ---------------------------------------------------------------------------

  const keyHandler = (e: KeyboardEvent) => {
    if (!isOpen) return
    // Never swallow browser/app shortcuts like Ctrl+R, Ctrl+L, Ctrl+H, Cmd+-
    if (e.ctrlKey || e.metaKey || e.altKey) return

    const active = document.activeElement as HTMLElement | null
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || active.isContentEditable)) {
      return
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        if (menusOpen()) closeMenus()
        else closeViewer()
        break
      case '+':
      case '=':
        if (!isImageLocked) {
          e.preventDefault()
          zoomBy(1.25)
        }
        break
      case '-':
      case '_':
        if (!isImageLocked) {
          e.preventDefault()
          zoomBy(1 / 1.25)
        }
        break
      case '0':
        if (!isImageLocked) {
          e.preventDefault()
          resetTransform()
        }
        break
      case '1':
        if (!isImageLocked) {
          e.preventDefault()
          toggleActualSize()
        }
        break
      case 'r':
      case 'R':
        e.preventDefault()
        rotateView()
        break
      case 'h':
      case 'H':
        e.preventDefault()
        flipH = !flipH
        updateTransform()
        break
      case 'l':
      case 'L':
        if (mode === 'float') {
          e.preventDefault()
          toggleLock()
        }
        break
      case 'p':
      case 'P':
        e.preventDefault()
        toggleImageLock()
        break
      case 'd':
      case 'D':
        e.preventDefault()
        toggleDock()
        break
    }
  }
  document.addEventListener('keydown', keyHandler)

  // Intercept clicks on avatars and chat images
  const clickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null
    if (!target) return
    if (containerEl && containerEl.contains(target)) return

    const img = target.tagName === 'IMG' ? (target as HTMLImageElement) : target.closest('img')
    if (!img) return
    const src = img.getAttribute('src')
    if (!src) return

    const isAvatar = src.includes('/avatar') || !!img.closest('.avatar, [data-avatar], .portrait')
    const isAttachment = src.includes('/api/v1/images') || src.includes('/api/v1/image-gen') || !!img.closest('.attachment, [data-attachment]')
    const isMessageImg = !!img.closest('.message-content, .chat-message, [data-message-id]')
    const isContentImage = img.naturalWidth >= 32 && img.naturalHeight >= 32

    if (isAvatar || isAttachment || isMessageImg || isContentImage) {
      e.preventDefault()
      e.stopPropagation()
      showImage(src, img.alt || 'Image Preview')
    }
  }
  document.addEventListener('click', clickHandler, true)

  // Browser window resized: keep the floating window on screen / anchored, and re-bound the dock
  const handleWindowResize = () => {
    if (!isOpen) return
    const edge = edgeOf(mode)
    if (!edge) {
      reflowFloat()
    } else if (dockPanel) {
      dockPanel.setMaxSize(clampDockSize(Infinity, edge, window.innerWidth, window.innerHeight))
    }
  }
  window.addEventListener('resize', handleWindowResize)

  // Composer extras action
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
        if (chatAvatar?.src) showImage(chatAvatar.src, 'Avatar')
      }
    })
  } catch (err) {
    console.debug('[Image Viewer] Input bar action registration skipped:', err)
  }

  // Permission revoked: tear down both host surfaces
  const unsubPerm = ctx.events.on('PERMISSION_CHANGED', async (payload) => {
    const detail = payload as { permission?: string; granted?: boolean } | undefined
    if (detail?.permission === 'ui_panels' && !detail.granted) {
      unmountDock()
      widget?.destroy()
      widget = null
      isOpen = false
    }
  })

  const helper = {
    show: showImage,
    close: closeViewer,
    reset: resetTransform,
    setAnchor: (anchor: AnchorPosition) => {
      if (mode !== 'float') setMode('float')
      applyAnchor(anchor)
      persist()
    },
    setMode,
    toggleDock,
    toggleLock,
    toggleImageLock,
    resolveUrl: resolveFullImageUrl,
  }

  ;(window as unknown as Record<string, unknown>).__lumiverseImageViewer = helper
  ;(window as unknown as Record<string, unknown>).testImageViewer = (url?: string) => {
    showImage(url || 'https://picsum.photos/800/600')
  }

  console.log('[Image Viewer] Extension loaded')

  return () => {
    document.removeEventListener('keydown', keyHandler)
    document.removeEventListener('click', clickHandler, true)
    document.removeEventListener('pointerdown', outsidePointerHandler)
    window.removeEventListener('resize', handleWindowResize)
    if (closeTimer) clearTimeout(closeTimer)
    unsubPerm?.()
    inputAction?.destroy()
    unmountDock()
    widget?.destroy()
    removeStyles()

    delete (window as unknown as Record<string, unknown>).__lumiverseImageViewer
    delete (window as unknown as Record<string, unknown>).testImageViewer

    console.log('[Image Viewer] Extension unloaded')
  }
}
