import { beforeEach, describe, expect, it } from 'bun:test'
import { PinStore, sanitizeWindowState, loadSession, saveSession, clearSession, newPinId } from '../src/store'
import type { PinRecord, WindowState } from '../src/store'

// Minimal in-memory localStorage for the Bun test runtime
const mem = new Map<string, string>()
;(globalThis as Record<string, unknown>).localStorage = {
  getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
  setItem: (k: string, v: string) => void mem.set(k, String(v)),
  removeItem: (k: string) => void mem.delete(k),
  clear: () => mem.clear(),
}

const state = (url = '/api/v1/images/a'): WindowState => ({
  url,
  alt: 'A',
  mode: 'float',
  x: 10,
  y: 20,
  w: 400,
  h: 339,
  anchor: null,
  rotation: 90,
  flipH: true,
})

const pin = (id: string, chatId = 'chat1', messageId = 'm1'): PinRecord => ({
  id,
  chatId,
  messageId,
  createdAt: 1,
  state: state(),
})

function fakeRemote(initial?: unknown) {
  const data = new Map<string, unknown>()
  if (initial !== undefined) data.set('pins', initial)
  return {
    data,
    get: async (k: string) => data.get(k),
    set: async (k: string, v: unknown) => void data.set(k, JSON.parse(JSON.stringify(v))),
    remove: async (k: string) => void data.delete(k),
    watch: () => () => {},
    core: { get: () => undefined, watch: () => () => {}, list: () => [], isReady: () => true },
  }
}

beforeEach(() => mem.clear())

describe('sanitizeWindowState', () => {
  it('keeps a valid state', () => {
    expect(sanitizeWindowState(state())).toEqual(state())
  })

  it('rejects entries without a url', () => {
    expect(sanitizeWindowState({ x: 1 })).toBeNull()
    expect(sanitizeWindowState(null)).toBeNull()
  })

  it('repairs bad fields with safe defaults', () => {
    const s = sanitizeWindowState({ url: '/x', mode: 'sideways', rotation: 45, anchor: 'nowhere', x: 'a', w: -5 })!
    expect(s.mode).toBe('float')
    expect(s.rotation).toBe(0)
    expect(s.anchor).toBeNull()
    expect(s.x).toBe(0)
    expect(s.w).toBe(0)
  })
})

describe('session', () => {
  it('round-trips open windows and clears them', () => {
    saveSession([state('/a'), state('/b')])
    expect(loadSession().map((w) => w.url)).toEqual(['/a', '/b'])
    clearSession()
    expect(loadSession()).toEqual([])
  })

  it('drops corrupt entries', () => {
    mem.set('image_viewer_session_v1', JSON.stringify({ windows: [state('/ok'), { nope: true }] }))
    expect(loadSession().map((w) => w.url)).toEqual(['/ok'])
  })
})

describe('PinStore', () => {
  it('adds, filters by chat, updates and removes pins', () => {
    const store = new PinStore(undefined)
    store.upsert(pin('p1', 'chat1'))
    store.upsert(pin('p2', 'chat2'))
    expect(store.forChat('chat1').map((p) => p.id)).toEqual(['p1'])
    expect(store.forChat(null)).toEqual([])

    store.updateState('p1', { ...state(), x: 99 })
    expect(store.get('p1')!.state.x).toBe(99)

    store.removeWhere((p) => p.messageId === 'm1')
    expect(store.all()).toEqual([])
  })

  it('persists to localStorage', () => {
    new PinStore(undefined).upsert(pin('p1'))
    expect(new PinStore(undefined).get('p1')?.chatId).toBe('chat1')
  })

  it('notifies listeners on structural changes only', () => {
    const store = new PinStore(undefined)
    let calls = 0
    store.onChange(() => calls++)
    store.upsert(pin('p1'))
    store.updateState('p1', state('/moved'))
    store.remove('p1')
    expect(calls).toBe(2)
  })

  it('adopts a newer synced copy', async () => {
    const remote = fakeRemote({ updatedAt: Date.now() + 10_000, pins: [pin('remote')] })
    const store = new PinStore(remote as never)
    let changed = false
    store.onChange(() => (changed = true))
    await store.sync()
    expect(store.all().map((p) => p.id)).toEqual(['remote'])
    expect(changed).toBe(true)
  })

  it('keeps a newer local copy over an older synced one', async () => {
    new PinStore(undefined).upsert(pin('local'))
    const remote = fakeRemote({ updatedAt: 1, pins: [pin('old')] })
    const store = new PinStore(remote as never)
    await store.sync()
    expect(store.all().map((p) => p.id)).toEqual(['local'])
  })

  it('survives a failing remote', async () => {
    const store = new PinStore({ get: async () => { throw new Error('denied') } } as never)
    await store.sync()
    expect(store.all()).toEqual([])
  })
})

describe('newPinId', () => {
  it('is unique', () => {
    expect(newPinId()).not.toBe(newPinId())
  })
})
