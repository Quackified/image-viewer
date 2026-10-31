declare const spindle: import('lumiverse-spindle-types').SpindleAPI

spindle.log.info('[Image Viewer] Extension backend initialized')

spindle.onFrontendMessage((payload: unknown, userId?: string) => {
  if (payload && typeof payload === 'object' && (payload as Record<string, unknown>).type === 'ping') {
    spindle.sendToFrontend({ type: 'pong', timestamp: Date.now() }, userId)
  }
})
