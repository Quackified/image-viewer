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
    
    /* Resize handles appear on all corners */
    .image-viewer-resize {
      position: absolute;
      width: 12px;
      height: 12px;
      background: var(--lumiverse-accent);
      border-radius: 2px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    /* Show handles when hovering over the widget */
    .image-viewer-content:hover .image-viewer-resize {
      opacity: 0.7;
    }
    
    .image-viewer-resize:hover {
      opacity: 1 !important;
    }
    
    /* Position each handle in a corner */
    .image-viewer-resize-nw { top: 0; left: 0; cursor: nw-resize; }
    .image-viewer-resize-ne { top: 0; right: 0; cursor: ne-resize; }
    .image-viewer-resize-sw { bottom: 0; left: 0; cursor: sw-resize; }
    .image-viewer-resize-se { bottom: 0; right: 0; cursor: se-resize; }
    
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
      <div class="image-viewer-resize image-viewer-resize-nw" data-direction="nw"></div>
      <div class="image-viewer-resize image-viewer-resize-ne" data-direction="ne"></div>
      <div class="image-viewer-resize image-viewer-resize-sw" data-direction="sw"></div>
      <div class="image-viewer-resize image-viewer-resize-se" data-direction="se"></div>
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
  let resizeDirection = ''
  let startX = 0
  let startY = 0
  let startWidth = 0
  let startHeight = 0
  let startPos = { x: 0, y: 0 }

  // Get all resize handles
  const resizeHandles = widget.root.querySelectorAll('.image-viewer-resize')

  // When a resize handle is pressed
  resizeHandles.forEach((handle) => {
    handle.addEventListener('mousedown', (event: Event) => {
      const mouseEvent = event as MouseEvent
      mouseEvent.preventDefault()
      mouseEvent.stopPropagation()
      
      isResizing = true
      resizeDirection = (mouseEvent.target as HTMLElement).dataset.direction || ''
      
      // Remember starting positions
      startX = mouseEvent.clientX
      startY = mouseEvent.clientY
      startWidth = widget.root.offsetWidth
      startHeight = widget.root.offsetHeight
      startPos = widget.getPosition()
    })
  })

  // When mouse moves (while resizing) - attached to document for reliability
  document.addEventListener('mousemove', (event: MouseEvent) => {
    if (!isResizing) return
    
    // Calculate how much the mouse moved
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY
    
    let newWidth = startWidth
    let newHeight = startHeight
    let newX = startPos.x
    let newY = startPos.y
    
    // Calculate new size based on which handle was dragged
    // East handles (e, ne, se) - resize right edge
    if (resizeDirection.includes('e')) {
      newWidth = Math.max(200, startWidth + deltaX)
    }
    // West handles (w, nw, sw) - resize left edge, need to move position
    if (resizeDirection.includes('w')) {
      newWidth = Math.max(200, startWidth - deltaX)
      newX = startPos.x + (startWidth - newWidth)
    }
    // South handles (s, se, sw) - resize bottom edge
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(150, startHeight + deltaY)
    }
    // North handles (n, ne, nw) - resize top edge, need to move position
    if (resizeDirection.includes('n')) {
      newHeight = Math.max(150, startHeight - deltaY)
      newY = startPos.y + (startHeight - newHeight)
    }
    
    // Apply new size to the widget root (not just content)
    widget.root.style.width = newWidth + 'px'
    widget.root.style.height = newHeight + 'px'
    
    // Move widget if resized from left or top
    if (resizeDirection.includes('w') || resizeDirection.includes('n')) {
      widget.moveTo(newX, newY)
    }
  })

  // When mouse is released - attached to document for reliability
  document.addEventListener('mouseup', () => {
    isResizing = false
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