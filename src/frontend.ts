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
      display: inline-flex;
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
      width: 100%;
      height: 100%;
      display: block;
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
    
    /* Resize grip - diagonal lines via gradient */
    .image-viewer-resize::after {
      content: '';
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      background: repeating-linear-gradient(
        -45deg,
        var(--lumiverse-text),
        var(--lumiverse-text) 1px,
        transparent 1px,
        transparent 4px
      );
      mask-image: linear-gradient(to top left, #000 50%, transparent 50%);
      -webkit-mask-image: linear-gradient(to top left, #000 50%, transparent 50%);
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

  // Track the current image's aspect ratio for proportional resizing
  let currentAspectRatio = 1
  // Track current widget dimensions (so we can re-assert after framework drag)
  let currentWidth = 400
  let currentHeight = 300

  // Function to show an image in the viewer with pop-in animation
  const showImage = (imageUrl: string) => {
    // Load image to get natural dimensions
    const tempImg = new Image()
    tempImg.onload = () => {
      const naturalWidth = tempImg.naturalWidth
      const naturalHeight = tempImg.naturalHeight
      currentAspectRatio = naturalWidth / naturalHeight
      
      // Calculate size that fits within viewport (max 80% of viewport)
      const maxViewportPercent = 0.8
      const maxWidth = window.innerWidth * maxViewportPercent
      const maxHeight = window.innerHeight * maxViewportPercent
      
      let width = naturalWidth
      let height = naturalHeight
      
      // Scale down if image is larger than max viewport size
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = width * ratio
        height = height * ratio
      }
      
      // Set the image source
      image.setAttribute('src', imageUrl)
      
      // Set widget size to match image dimensions
      widget.root.style.width = width + 'px'
      widget.root.style.height = height + 'px'
      content.style.width = width + 'px'
      content.style.height = height + 'px'
      
      // Track dimensions so we can re-assert after framework drag
      currentWidth = width
      currentHeight = height
      
      // Show the widget
      widget.setVisible(true)
      
      // Trigger pop-in animation
      content.classList.remove('pop-out')
      content.classList.add('pop-in')
    }
    tempImg.src = imageUrl
  }

  console.log('[Image Viewer] Extension loaded')

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


    })

    // Pointer move: resize the widget maintaining aspect ratio
    handle.addEventListener('pointermove', (e: PointerEvent) => {
      if (!isResizing) return

      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      // Use the larger delta to maintain aspect ratio
      const delta = Math.max(deltaX, deltaY)
      
      // Calculate new size maintaining aspect ratio, clamped to viewport
      const pos = widget.getPosition()
      const maxW = window.innerWidth - pos.x
      const maxH = window.innerHeight - pos.y
      let newWidth = Math.min(Math.max(200, startWidth + delta), maxW)
      let newHeight = newWidth / currentAspectRatio
      // If height-clamped, recalculate width to maintain aspect ratio
      if (newHeight > maxH) {
        newHeight = maxH
        newWidth = newHeight * currentAspectRatio
      }

      // Track and apply to both widget root and content
      currentWidth = newWidth
      currentHeight = newHeight

      widget.root.style.width = newWidth + 'px'
      widget.root.style.height = newHeight + 'px'
      content.style.width = newWidth + 'px'
      content.style.height = newHeight + 'px'
    })

    // Pointer up / lost capture: stop resizing, restore pointer-events
    const endResize = () => {
      if (!isResizing) return
      isResizing = false
      widget.root.style.pointerEvents = ''
      handle.style.pointerEvents = ''

    }

    handle.addEventListener('pointerup', endResize)
    handle.addEventListener('lostpointercapture', endResize)
  }

  // Avatar click detection using event delegation
  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement
    
    // Ignore clicks inside our own viewer widget
    if (widget.root.contains(target)) return
    
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
      

    }
  })

  // Cleanup function
  return () => {
    removeStyles()
    widget.destroy()
    console.log('[Image Viewer] Extension unloaded')
  }
}