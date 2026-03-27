// src/frontend.ts
function setup(ctx) {
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
  `);
  const widget = ctx.ui.createFloatWidget({
    width: 400,
    height: 300,
    initialPosition: { x: 100, y: 100 },
    snapToEdge: true,
    tooltip: "Image Viewer",
    chromeless: true
  });
  widget.root.innerHTML = `
    <div class="image-viewer-content">
      <button class="image-viewer-close" title="Close">×</button>
      <img src="" alt="Image preview" />
      <div class="image-viewer-resize" data-direction="se"></div>
    </div>
  `;
  const content = widget.root.querySelector(".image-viewer-content");
  const image = widget.root.querySelector("img");
  const closeBtn = widget.root.querySelector(".image-viewer-close");
  if (!content || !image || !closeBtn) {
    console.error("[Image Viewer] Failed to create widget content");
    widget.destroy();
    return;
  }
  widget.setVisible(false);
  closeBtn.addEventListener("click", () => {
    content.classList.remove("pop-in");
    content.classList.add("pop-out");
    setTimeout(() => {
      widget.setVisible(false);
      content.classList.remove("pop-out");
    }, 150);
  });
  let currentAspectRatio = 1;
  let currentWidth = 400;
  let currentHeight = 300;
  const showImage = (imageUrl) => {
    const tempImg = new Image;
    tempImg.onload = () => {
      const naturalWidth = tempImg.naturalWidth;
      const naturalHeight = tempImg.naturalHeight;
      currentAspectRatio = naturalWidth / naturalHeight;
      const maxViewportPercent = 0.8;
      const maxWidth = window.innerWidth * maxViewportPercent;
      const maxHeight = window.innerHeight * maxViewportPercent;
      let width = naturalWidth;
      let height = naturalHeight;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }
      image.setAttribute("src", imageUrl);
      widget.root.style.width = width + "px";
      widget.root.style.height = height + "px";
      content.style.width = width + "px";
      content.style.height = height + "px";
      currentWidth = width;
      currentHeight = height;
      widget.setVisible(true);
      content.classList.remove("pop-out");
      content.classList.add("pop-in");
    };
    tempImg.src = imageUrl;
  };
  console.log("[Image Viewer] Extension loaded");
  let isResizing = false;
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;
  const resizeHandle = widget.root.querySelector(".image-viewer-resize");
  if (resizeHandle) {
    const handle = resizeHandle;
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = widget.root.offsetWidth;
      startHeight = widget.root.offsetHeight;
      handle.setPointerCapture(e.pointerId);
      widget.root.style.pointerEvents = "none";
      handle.style.pointerEvents = "auto";
    });
    handle.addEventListener("pointermove", (e) => {
      if (!isResizing)
        return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const delta = Math.max(deltaX, deltaY);
      const pos = widget.getPosition();
      const maxW = window.innerWidth - pos.x;
      const maxH = window.innerHeight - pos.y;
      let newWidth = Math.min(Math.max(200, startWidth + delta), maxW);
      let newHeight = newWidth / currentAspectRatio;
      if (newHeight > maxH) {
        newHeight = maxH;
        newWidth = newHeight * currentAspectRatio;
      }
      currentWidth = newWidth;
      currentHeight = newHeight;
      widget.root.style.width = newWidth + "px";
      widget.root.style.height = newHeight + "px";
      content.style.width = newWidth + "px";
      content.style.height = newHeight + "px";
    });
    const endResize = () => {
      if (!isResizing)
        return;
      isResizing = false;
      widget.root.style.pointerEvents = "";
      handle.style.pointerEvents = "";
    };
    handle.addEventListener("pointerup", endResize);
    handle.addEventListener("lostpointercapture", endResize);
  }
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (widget.root.contains(target))
      return;
    if (target.tagName !== "IMG")
      return;
    const img = target;
    const src = img.getAttribute("src");
    if (src && (src.includes("/api/v1/images/") || src.includes("/avatar"))) {
      event.preventDefault();
      event.stopPropagation();
      showImage(src);
    }
  });
  return () => {
    removeStyles();
    widget.destroy();
    console.log("[Image Viewer] Extension unloaded");
  };
}
export {
  setup
};
