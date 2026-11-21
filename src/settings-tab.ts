import type { SpindleFrontendContext, SpindleSettingsTabHandle } from 'lumiverse-spindle-types'
import type { PinRecord, PinStore } from './store'

/** User-facing settings shown in the Extensions settings tab. */
export interface ViewerSettings {
  multiWindow: boolean
  maxWindows: number
  restoreWindows: boolean
  pinsFollowMessage: boolean
  panLockedByDefault: boolean
  openSizePct: number
}

export interface SettingsTabOptions {
  getSettings(): ViewerSettings
  update(patch: Partial<ViewerSettings>): void
  pins: PinStore
  activeChatId(): string | null
  /** Opens (or focuses) a pin's window; only meaningful for pins in the active chat. */
  openPin(id: string): void
  removePin(id: string): void
  forgetWindows(): void
}

/** Core's Extensions settings tab; registering under its id adds our section to it. */
const EXTENSIONS_TAB_ID = 'extensions'
const SECTION_KEY = 'image-viewer'

const SETTINGS_CSS = `
  .ivs { display: flex; flex-direction: column; gap: 14px; padding: 4px 0 12px; color: var(--lumiverse-text, #e2e8f0); }
  .ivs h3 { margin: 0; font-size: 15px; font-weight: 600; }
  .ivs h4 { margin: 0 0 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--lumiverse-text-muted, #94a3b8); }
  .ivs-intro { margin: 2px 0 0; font-size: 12px; color: var(--lumiverse-text-muted, #94a3b8); }
  .ivs-group { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border: 1px solid var(--lumiverse-border, rgba(255,255,255,0.1)); border-radius: var(--lumiverse-radius, 8px); background: var(--lumiverse-fill-subtle, rgba(255,255,255,0.03)); }
  .ivs-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 6px 0; }
  .ivs-row + .ivs-row { border-top: 1px solid var(--lumiverse-border, rgba(255,255,255,0.06)); }
  .ivs-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .ivs-label { font-size: 13px; }
  .ivs-hint { font-size: 11px; color: var(--lumiverse-text-muted, #94a3b8); }
  .ivs input[type="checkbox"] { width: 18px; height: 18px; flex: none; accent-color: var(--lumiverse-primary, #38bdf8); cursor: pointer; }
  .ivs input[type="number"] { width: 64px; padding: 4px 6px; flex: none; color: inherit; background: var(--lumiverse-bg, #111); border: 1px solid var(--lumiverse-border, rgba(255,255,255,0.15)); border-radius: 6px; font: inherit; font-size: 13px; }
  .ivs-btn { padding: 6px 10px; font: inherit; font-size: 12px; color: inherit; background: var(--lumiverse-fill, rgba(255,255,255,0.06)); border: 1px solid var(--lumiverse-border, rgba(255,255,255,0.15)); border-radius: 6px; cursor: pointer; }
  .ivs-btn:hover { background: var(--lumiverse-fill-hover, rgba(255,255,255,0.12)); }
  .ivs-btn.danger:hover { color: var(--lumiverse-danger, #ef4444); border-color: var(--lumiverse-danger, #ef4444); }
  .ivs-actions { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 6px; }
  .ivs-pins { display: flex; flex-direction: column; gap: 6px; }
  .ivs-pin { display: flex; align-items: center; gap: 10px; padding: 6px; border-radius: 6px; background: var(--lumiverse-fill-subtle, rgba(255,255,255,0.03)); }
  .ivs-pin img { width: 40px; height: 40px; object-fit: cover; border-radius: 4px; flex: none; background: var(--lumiverse-bg, #111); }
  .ivs-pin .ivs-text { flex: 1; }
  .ivs-pin-title { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ivs-empty { font-size: 12px; color: var(--lumiverse-text-muted, #94a3b8); padding: 4px 0; }
`

type ToggleKey = 'multiWindow' | 'restoreWindows' | 'pinsFollowMessage' | 'panLockedByDefault'
type NumberKey = 'maxWindows' | 'openSizePct'

const TOGGLES: Array<{ key: ToggleKey; label: string; hint: string }> = [
  { key: 'multiWindow', label: 'Open images in new windows', hint: 'Off: clicking an image replaces the current window.' },
  { key: 'restoreWindows', label: 'Reopen windows after reload', hint: 'Windows open when the page closed come back with their size and position.' },
  { key: 'pinsFollowMessage', label: 'Pinned windows follow their message', hint: 'Show a pinned window only while its message is on screen. Off: show whenever its chat is open.' },
  { key: 'panLockedByDefault', label: 'Lock pan & zoom on open', hint: 'Dragging the image moves the window until you unlock pan & zoom.' },
]

const NUMBERS: Array<{ key: NumberKey; label: string; hint: string; min: number; max: number }> = [
  { key: 'maxWindows', label: 'Most windows at once', hint: 'Past this, the oldest window shows the new image. Pinned windows don’t count.', min: 1, max: 12 },
  { key: 'openSizePct', label: 'Opening size (% of screen)', hint: 'Desktop only; phones always use most of the screen.', min: 40, max: 95 },
]

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/**
 * Adds the Image Viewer section to the Extensions settings tab.
 * Returns a cleanup function, or null on hosts without settings tabs.
 */
export function mountSettingsTab(ctx: SpindleFrontendContext, opts: SettingsTabOptions): (() => void) | null {
  if (typeof ctx.ui.registerSettingsTab !== 'function') return null

  let tab: SpindleSettingsTabHandle
  try {
    tab = ctx.ui.registerSettingsTab({
      id: EXTENSIONS_TAB_ID,
      title: 'Image Viewer',
      description: 'Image Viewer windows, pins and restore settings',
      keywords: ['image', 'viewer', 'pin', 'window', 'gallery', 'zoom'],
      sections: [
        {
          key: SECTION_KEY,
          titleKey: 'imageViewer.settings.title',
          titleFallback: 'Image Viewer',
          keywords: ['image', 'viewer', 'pinned images', 'windows'],
        },
      ],
    })
  } catch (err) {
    console.warn('[Image Viewer] Could not register settings section:', err)
    return null
  }

  const removeStyle = ctx.dom.addStyle(SETTINGS_CSS)
  const root = document.createElement('div')
  root.className = 'ivs'
  root.id = `setsec-${EXTENSIONS_TAB_ID}-${SECTION_KEY}`
  tab.root.appendChild(root)

  const chatNames = new Map<string, string>()
  async function loadChatName(chatId: string) {
    if (chatNames.has(chatId) || typeof ctx.chats.get !== 'function') return
    chatNames.set(chatId, '')
    try {
      const chat = (await ctx.chats.get(chatId)) as { name?: string } | null
      if (chat?.name) {
        chatNames.set(chatId, chat.name)
        renderPins()
      }
    } catch {
      // name is cosmetic
    }
  }

  function pinRow(pin: PinRecord, inActiveChat: boolean): string {
    const name = (pin.state.alt && pin.state.alt !== 'Image Preview' ? pin.state.alt : '') || pin.state.url.split('/').pop() || 'Image'
    const when = new Date(pin.createdAt).toLocaleDateString()
    return `
      <div class="ivs-pin" data-pin="${esc(pin.id)}">
        <img src="${esc(pin.state.url)}" alt="" loading="lazy" />
        <div class="ivs-text">
          <span class="ivs-pin-title">${esc(name)}</span>
          <span class="ivs-hint">Pinned ${esc(when)}</span>
        </div>
        ${inActiveChat ? '<button class="ivs-btn" data-act="open-pin">Show</button>' : ''}
        <button class="ivs-btn danger" data-act="remove-pin">Unpin</button>
      </div>`
  }

  function renderPins() {
    const host = root.querySelector('.ivs-pin-list')
    if (!host) return
    const all = opts.pins.all()
    const active = opts.activeChatId()
    if (!all.length) {
      host.innerHTML = '<div class="ivs-empty">No pinned images. Use ⋮ → Pin to Message in an image window.</div>'
      return
    }
    const byChat = new Map<string, PinRecord[]>()
    for (const p of all) byChat.set(p.chatId, [...(byChat.get(p.chatId) ?? []), p])
    const chats = [...byChat.keys()].sort((a, b) => (a === active ? -1 : b === active ? 1 : 0))
    host.innerHTML = chats
      .map((chatId) => {
        void loadChatName(chatId)
        const label = chatId === active ? 'This chat' : chatNames.get(chatId) || 'Other chat'
        const rows = byChat.get(chatId)!.map((p) => pinRow(p, chatId === active)).join('')
        return `<h4>${esc(label)} (${byChat.get(chatId)!.length})</h4><div class="ivs-pins">${rows}</div>`
      })
      .join('')
  }

  function render() {
    const s = opts.getSettings()
    root.innerHTML = `
      <div>
        <h3>Image Viewer</h3>
        <p class="ivs-intro">Floating image windows, pins and restore behaviour.</p>
      </div>
      <div class="ivs-group">
        ${TOGGLES.map(
          (t) => `
          <label class="ivs-row">
            <span class="ivs-text"><span class="ivs-label">${t.label}</span><span class="ivs-hint">${t.hint}</span></span>
            <input type="checkbox" data-toggle="${t.key}" ${s[t.key] ? 'checked' : ''} />
          </label>`
        ).join('')}
        ${NUMBERS.map(
          (n) => `
          <label class="ivs-row">
            <span class="ivs-text"><span class="ivs-label">${n.label}</span><span class="ivs-hint">${n.hint}</span></span>
            <input type="number" data-number="${n.key}" min="${n.min}" max="${n.max}" step="1" value="${s[n.key]}" />
          </label>`
        ).join('')}
        <div class="ivs-actions">
          <button class="ivs-btn" data-act="forget-windows">Forget remembered windows</button>
        </div>
      </div>
      <div class="ivs-group">
        <h4>Pinned images</h4>
        <div class="ivs-pin-list"></div>
        <div class="ivs-actions">
          <button class="ivs-btn danger" data-act="clear-chat-pins">Unpin all in this chat</button>
          <button class="ivs-btn danger" data-act="clear-all-pins">Unpin everything</button>
        </div>
      </div>
    `
    renderPins()
  }

  root.addEventListener('change', (e) => {
    const el = e.target as HTMLInputElement
    if (el.dataset.toggle) {
      opts.update({ [el.dataset.toggle]: el.checked } as Partial<ViewerSettings>)
    } else if (el.dataset.number) {
      const n = NUMBERS.find((x) => x.key === el.dataset.number)!
      const v = Math.min(n.max, Math.max(n.min, Math.round(Number(el.value) || n.min)))
      el.value = String(v)
      opts.update({ [n.key]: v } as Partial<ViewerSettings>)
    }
  })

  root.addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-act]')
    if (!btn) return
    const pinId = btn.closest<HTMLElement>('[data-pin]')?.dataset.pin
    switch (btn.dataset.act) {
      case 'open-pin':
        if (pinId) opts.openPin(pinId)
        break
      case 'remove-pin':
        if (pinId) opts.removePin(pinId)
        break
      case 'forget-windows':
        opts.forgetWindows()
        btn.textContent = '✓ Forgotten'
        setTimeout(() => (btn.textContent = 'Forget remembered windows'), 1200)
        break
      case 'clear-chat-pins':
      case 'clear-all-pins': {
        const all = btn.dataset.act === 'clear-all-pins'
        const active = opts.activeChatId()
        const targets = opts.pins.all().filter((p) => all || p.chatId === active)
        if (!targets.length) break
        const { confirmed } = await ctx.ui.showConfirm({
          title: all ? 'Unpin every image?' : 'Unpin images in this chat?',
          message: `${targets.length} pinned image${targets.length === 1 ? '' : 's'} will be unpinned. The images themselves are not deleted.`,
          variant: 'danger',
          confirmLabel: 'Unpin',
        })
        if (confirmed) for (const p of targets) opts.removePin(p.id)
        break
      }
    }
  })

  const unsubPins = opts.pins.onChange(renderPins)
  const unsubActivate = tab.onActivate(render)
  render()

  return () => {
    unsubPins()
    unsubActivate()
    removeStyle()
    try {
      tab.destroy()
    } catch {
      // host already gone
    }
  }
}
