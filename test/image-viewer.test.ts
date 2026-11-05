import { describe, expect, it } from 'bun:test'
import {
  resolveFullImageUrl,
  calculateFitDimensions,
  calculateResizeDimensions,
  calculateAnchorPosition,
  calculateEdgeFlushPlacement,
  snapPosition,
  detectAnchor,
  calculateCornerResize,
  clampDockSize,
  defaultDockSize,
  calculateActualSizeScale,
} from '../src/frontend'
import manifest from '../spindle.json'
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

describe('Image Viewer Extension', () => {
  describe('Manifest (spindle.json)', () => {
    it('has valid manifest identifier and required fields', () => {
      expect(manifest.identifier).toMatch(/^[a-z][a-z0-9_]*$/)
      expect(manifest.name).toBe('Image Viewer')
      expect(manifest.version).toBeDefined()
      expect(manifest.author).toBeDefined()
      expect(manifest.permissions).toContain('ui_panels')
    })

    it('has valid build artifacts for entry points', () => {
      const baseDir = join(import.meta.dir, '..')
      const backendPath = join(baseDir, manifest.entry_backend)
      const frontendPath = join(baseDir, manifest.entry_frontend)

      expect(existsSync(backendPath)).toBe(true)
      expect(statSync(backendPath).size).toBeGreaterThan(0)

      expect(existsSync(frontendPath)).toBe(true)
      expect(statSync(frontendPath).size).toBeGreaterThan(0)
    })
  })

  describe('resolveFullImageUrl', () => {
    it('strips ?size=sm from image asset URLs', () => {
      const thumb = '/api/v1/images/abc-123?size=sm'
      expect(resolveFullImageUrl(thumb)).toBe('/api/v1/images/abc-123')
    })

    it('strips size parameter while preserving other query params', () => {
      const thumb = '/api/v1/image-gen/results/xyz-789?size=lg&v=2'
      expect(resolveFullImageUrl(thumb)).toBe('/api/v1/image-gen/results/xyz-789?v=2')
    })

    it('leaves non-sized URLs unchanged', () => {
      const avatar = '/api/v1/characters/char-1/avatar'
      expect(resolveFullImageUrl(avatar)).toBe('/api/v1/characters/char-1/avatar')
    })

    it('handles absolute URLs properly', () => {
      const external = 'https://example.com/assets/photo.jpg?size=sm&token=abc'
      expect(resolveFullImageUrl(external)).toBe('https://example.com/assets/photo.jpg?token=abc')
    })

    it('handles empty or invalid inputs gracefully', () => {
      expect(resolveFullImageUrl('')).toBe('')
      expect(resolveFullImageUrl('invalid-url-path')).toBe('invalid-url-path')
    })
  })

  describe('Fit Aspect Ratio Mechanics', () => {
    it('calculates initial fit dimensions strictly matching aspect ratio', () => {
      // 16:9 Landscape image
      const landscape = calculateFitDimensions(1920, 1080, 1200, 800, 39)
      const expectedAR = 1920 / 1080
      const actualAR = landscape.viewportWidth / landscape.viewportHeight
      expect(Math.abs(actualAR - expectedAR)).toBeLessThan(0.01)
      expect(landscape.widgetHeight).toBe(landscape.viewportHeight + 39)
      expect(landscape.widgetWidth).toBe(landscape.viewportWidth)

      // 9:16 Portrait image
      const portrait = calculateFitDimensions(1080, 1920, 1200, 800, 39)
      const expectedPortraitAR = 1080 / 1920
      const actualPortraitAR = portrait.viewportWidth / portrait.viewportHeight
      expect(Math.abs(actualPortraitAR - expectedPortraitAR)).toBeLessThan(0.01)
      expect(portrait.widgetHeight).toBe(portrait.viewportHeight + 39)

      // 1:1 Square avatar
      const square = calculateFitDimensions(512, 512, 1200, 800, 39)
      expect(square.viewportWidth).toBe(square.viewportHeight)
      expect(square.widgetHeight).toBe(square.viewportHeight + 39)
    })

    it('resizes window strictly preserving aspect ratio', () => {
      const ar = 16 / 9
      const toolbarH = 39

      // Drag resize by delta = +100
      const resized = calculateResizeDimensions(640, 100, ar, 1200, 900, toolbarH)
      const actualAR = resized.viewportWidth / resized.viewportHeight
      expect(Math.abs(actualAR - ar)).toBeLessThan(0.01)
      expect(resized.widgetHeight).toBe(resized.viewportHeight + toolbarH)
      expect(resized.widgetWidth).toBe(resized.viewportWidth)

      // Clamps properly to max available height without breaking aspect ratio
      const clamped = calculateResizeDimensions(640, 800, ar, 800, 400, toolbarH)
      const clampedAR = clamped.viewportWidth / clamped.viewportHeight
      expect(Math.abs(clampedAR - ar)).toBeLessThan(0.01)
      expect(clamped.viewportHeight).toBeLessThanOrEqual(400)
    })
  })

  describe('Anchor Presets', () => {
    it('calculates exact top-left coordinates with zero margin', () => {
      const pos = calculateAnchorPosition('top-left', 400, 300, 1920, 1080, 0)
      expect(pos).toEqual({ x: 0, y: 0 })
    })

    it('calculates top-right coordinates correctly', () => {
      const pos = calculateAnchorPosition('top-right', 400, 300, 1920, 1080, 0)
      expect(pos).toEqual({ x: 1520, y: 0 })
    })

    it('calculates center coordinates correctly', () => {
      const pos = calculateAnchorPosition('center', 400, 300, 1920, 1080, 0)
      expect(pos).toEqual({ x: 760, y: 390 })
    })

    it('calculates bottom-left coordinates correctly', () => {
      const pos = calculateAnchorPosition('bottom-left', 400, 300, 1920, 1080, 0)
      expect(pos).toEqual({ x: 0, y: 780 })
    })

    it('calculates bottom-right coordinates correctly', () => {
      const pos = calculateAnchorPosition('bottom-right', 400, 300, 1920, 1080, 0)
      expect(pos).toEqual({ x: 1520, y: 780 })
    })
  })

  describe('Edge Flush Placement', () => {
    it('compensates for host padding at top-left origin', () => {
      const placement = calculateEdgeFlushPlacement(0, 0, 400, 300, 1920, 1080, 12)
      expect(placement.hostX).toBe(12)
      expect(placement.hostY).toBe(12)
      expect(placement.offsetX).toBe(-12)
      expect(placement.offsetY).toBe(-12)
      expect(placement.hostX + placement.offsetX).toBe(0)
      expect(placement.hostY + placement.offsetY).toBe(0)
    })

    it('compensates for host padding at top-right edge', () => {
      const placement = calculateEdgeFlushPlacement(1520, 0, 400, 300, 1920, 1080, 12)
      expect(placement.hostX).toBe(1508)
      expect(placement.hostY).toBe(12)
      expect(placement.offsetX).toBe(12)
      expect(placement.offsetY).toBe(-12)
      expect(placement.hostX + placement.offsetX).toBe(1520)
      expect(placement.hostY + placement.offsetY).toBe(0)
    })

    it('leaves unconstrained center positions un-offset', () => {
      const placement = calculateEdgeFlushPlacement(760, 390, 400, 300, 1920, 1080, 12)
      expect(placement.hostX).toBe(760)
      expect(placement.hostY).toBe(390)
      expect(placement.offsetX).toBe(0)
      expect(placement.offsetY).toBe(0)
    })
  })

  describe('snapPosition', () => {
    it('snaps to screen edges within the threshold', () => {
      const r = snapPosition(10, 770, 400, 300, 1920, 1080, 16)
      expect(r.x).toBe(0)
      expect(r.snapX).toBe('start')
      expect(r.y).toBe(780)
      expect(r.snapY).toBe('end')
    })

    it('snaps to center and leaves distant positions alone', () => {
      const r = snapPosition(765, 200, 400, 300, 1920, 1080, 16)
      expect(r.x).toBe(760)
      expect(r.snapX).toBe('center')
      expect(r.y).toBe(200)
      expect(r.snapY).toBeNull()
    })
  })

  describe('detectAnchor', () => {
    it('derives corner and center anchors from geometry', () => {
      expect(detectAnchor(0, 0, 400, 300, 1920, 1080)).toBe('top-left')
      expect(detectAnchor(1520, 780, 400, 300, 1920, 1080)).toBe('bottom-right')
      expect(detectAnchor(760, 390, 400, 300, 1920, 1080)).toBe('center')
      expect(detectAnchor(300, 300, 400, 300, 1920, 1080)).toBeNull()
    })
  })

  describe('calculateCornerResize', () => {
    const start = { x: 1520, y: 780, viewportWidth: 400, widgetHeight: 339 }

    it('grows a bottom-right docked window from its NW corner while pinning the opposite corner', () => {
      const r = calculateCornerResize('nw', start, -100, -75, 4 / 3, 1920, 1080, 39, 320)
      expect(r.viewportWidth).toBe(500)
      expect(r.x + r.widgetWidth).toBe(1920)
      expect(r.y + r.widgetHeight).toBe(1119)
      expect(r.viewportWidth / r.viewportHeight).toBeCloseTo(4 / 3, 1)
    })

    it('cannot grow past the screen edge from the SE corner', () => {
      const r = calculateCornerResize('se', start, 300, 300, 4 / 3, 1920, 1080, 39, 320)
      expect(r.x).toBe(1520)
      expect(r.x + r.widgetWidth).toBeLessThanOrEqual(1920)
      expect(r.y + r.widgetHeight).toBeLessThanOrEqual(1119)
    })

    it('respects the minimum width', () => {
      const r = calculateCornerResize('se', { x: 0, y: 0, viewportWidth: 600, widgetHeight: 489 }, -900, -900, 4 / 3, 1920, 1080, 39, 320)
      expect(r.viewportWidth).toBe(320)
    })
  })

  describe('dock sizing', () => {
    it('clamps to minimum and 70% of the docked axis', () => {
      expect(clampDockSize(10, 'right', 1920, 1080)).toBe(240)
      expect(clampDockSize(5000, 'right', 1920, 1080)).toBe(1344)
      expect(clampDockSize(5000, 'top', 1920, 1080)).toBe(756)
    })

    it('picks sensible defaults per axis', () => {
      expect(defaultDockSize('left', 1920, 1080)).toBe(520)
      expect(defaultDockSize('bottom', 1920, 1080)).toBe(410)
      expect(defaultDockSize('right', 800, 600)).toBe(320)
    })
  })

  describe('calculateActualSizeScale', () => {
    it('returns the zoom at which natural pixels map 1:1', () => {
      expect(calculateActualSizeScale(2000, 1000, 1000, 500)).toBeCloseTo(2, 5)
    })

    it('accounts for rotated images', () => {
      expect(calculateActualSizeScale(2000, 1000, 500, 1000, true)).toBeCloseTo(2, 5)
    })
  })
})
