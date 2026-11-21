import type { SpindleSettingsAPI } from 'lumiverse-spindle-types'
import type { AnchorPosition, LayoutMode } from './frontend'

/** Everything needed to put a window back exactly as it was. Coordinates are workspace px. */
export interface WindowState {
  url: string
  alt: string
  mode: LayoutMode
  x: number
  y: number
  /** Floating window outer size (viewport width, toolbar + viewport height). */
  w: number
  h: number
  anchor: AnchorPosition | null
  rotation: number
  flipH: boolean
}

/** An image window attached to one chat message. */
export interface PinRecord {
  id: string
  chatId: string
  messageId: string
  createdAt: number
  state: WindowState
}

interface PinsDoc {
  updatedAt: number
  pins: PinRecord[]
}

const SESSION_KEY = 'image_viewer_session_v1'
const PINS_KEY = 'image_viewer_pins_v1'
const REMOTE_PINS_KEY = 'pins'

const isMode = (m: unknown): m is LayoutMode =>
  m === 'float' || m === 'dock-left' || m === 'dock-right' || m === 'dock-top' || m === 'dock-bottom'
const ANCHORS = ['top-left', 'top-right', 'center-left', 'center-right', 'center', 'bottom-left', 'bottom-right']

/** Validates untrusted stored data; returns null for anything unusable. */
export function sanitizeWindowState(raw: unknown): WindowState | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (typeof r.url !== 'string' || !r.url) return null
  const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) ? v : d)
  return {
    url: r.url,
    alt: typeof r.alt === 'string' ? r.alt : 'Image Preview',
    mode: isMode(r.mode) ? r.mode : 'float',
    x: num(r.x, 0),
    y: num(r.y, 0),
    w: Math.max(0, num(r.w, 0)),
    h: Math.max(0, num(r.h, 0)),
    anchor: ANCHORS.includes(r.anchor as string) ? (r.anchor as AnchorPosition) : null,
    rotation: [0, 90, 180, 270].includes(r.rotation as number) ? (r.rotation as number) : 0,
    flipH: r.flipH === true,
  }
}

function sanitizePins(raw: unknown): PinsDoc {
  const doc = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const list = Array.isArray(doc.pins) ? doc.pins : []
  const pins: PinRecord[] = []
  for (const p of list) {
    if (!p || typeof p !== 'object') continue
    const r = p as Record<string, unknown>
    const state = sanitizeWindowState(r.state)
    if (!state || typeof r.id !== 'string' || typeof r.chatId !== 'string' || typeof r.messageId !== 'string') continue
    pins.push({
      id: r.id,
      chatId: r.chatId,
      messageId: r.messageId,
      createdAt: typeof r.createdAt === 'number' ? r.createdAt : 0,
      state,
    })
  }
  return { updatedAt: typeof doc.updatedAt === 'number' ? doc.updatedAt : 0, pins }
}

function readLocal(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable - state just won't persist
  }
}

/** Windows that were open on this device (geometry is screen-specific, so this stays local). */
export function loadSession(): WindowState[] {
  const raw = readLocal(SESSION_KEY) as { windows?: unknown } | null
  const list = Array.isArray(raw?.windows) ? raw!.windows : []
  return list.map(sanitizeWindowState).filter((w): w is WindowState => !!w)
}

export function saveSession(windows: WindowState[]) {
  writeLocal(SESSION_KEY, { windows })
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}

/**
 * Pin storage: localStorage for instant reads, mirrored to the host's per-user extension
 * settings (when available) so pins follow the user to other devices. Newest copy wins.
 */
export class PinStore {
  private doc: PinsDoc
  private listeners = new Set<() => void>()

  constructor(private remote: SpindleSettingsAPI | undefined) {
    this.doc = sanitizePins(readLocal(PINS_KEY))
  }

  /** Pulls the synced copy; notifies listeners if it was newer than the local one. */
  async sync(): Promise<void> {
    if (!this.remote) return
    try {
      const remote = sanitizePins(await this.remote.get(REMOTE_PINS_KEY))
      if (remote.updatedAt > this.doc.updatedAt) {
        this.doc = remote
        writeLocal(PINS_KEY, this.doc)
        this.emit()
      } else if (this.doc.updatedAt > remote.updatedAt) {
        void this.pushRemote()
      }
    } catch (err) {
      console.debug('[Image Viewer] Pin sync unavailable:', err)
    }
  }

  onChange(fn: () => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  all(): PinRecord[] {
    return [...this.doc.pins]
  }

  forChat(chatId: string | null): PinRecord[] {
    return chatId ? this.doc.pins.filter((p) => p.chatId === chatId) : []
  }

  get(id: string): PinRecord | undefined {
    return this.doc.pins.find((p) => p.id === id)
  }

  upsert(pin: PinRecord) {
    const i = this.doc.pins.findIndex((p) => p.id === pin.id)
    if (i >= 0) this.doc.pins[i] = pin
    else this.doc.pins.push(pin)
    this.commit()
  }

  /** Updates a pin's saved window state without notifying listeners (frequent, cosmetic). */
  updateState(id: string, state: WindowState) {
    const pin = this.get(id)
    if (!pin) return
    pin.state = state
    this.commit(false)
  }

  remove(id: string) {
    this.doc.pins = this.doc.pins.filter((p) => p.id !== id)
    this.commit()
  }

  removeWhere(pred: (p: PinRecord) => boolean) {
    const before = this.doc.pins.length
    this.doc.pins = this.doc.pins.filter((p) => !pred(p))
    if (this.doc.pins.length !== before) this.commit()
  }

  private commit(notify = true) {
    this.doc.updatedAt = Date.now()
    writeLocal(PINS_KEY, this.doc)
    void this.pushRemote()
    if (notify) this.emit()
  }

  private pushTimer: ReturnType<typeof setTimeout> | null = null
  private async pushRemote() {
    if (!this.remote) return
    // Coalesce bursts (dragging a pinned window saves its geometry repeatedly)
    if (this.pushTimer) clearTimeout(this.pushTimer)
    this.pushTimer = setTimeout(() => {
      this.pushTimer = null
      this.remote?.set(REMOTE_PINS_KEY, this.doc).catch((err) => {
        console.debug('[Image Viewer] Pin sync write failed:', err)
      })
    }, 800)
  }

  private emit() {
    for (const fn of this.listeners) fn()
  }

  dispose() {
    if (this.pushTimer) clearTimeout(this.pushTimer)
    this.listeners.clear()
  }
}

export function newPinId(): string {
  return `pin_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
