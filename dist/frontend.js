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
      <div class="image-viewer-resize image-viewer-resize-nw" data-direction="nw"></div>
      <div class="image-viewer-resize image-viewer-resize-ne" data-direction="ne"></div>
      <div class="image-viewer-resize image-viewer-resize-sw" data-direction="sw"></div>
      <div class="image-viewer-resize image-viewer-resize-se" data-direction="se"></div>
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
  const showImage = (imageUrl) => {
    image.setAttribute("src", imageUrl);
    widget.setVisible(true);
    content.classList.remove("pop-out");
    content.classList.add("pop-in");
  };
  window.testImageViewer = () => {
    showImage("https://picsum.photos/400/300");
  };
  console.log("[Image Viewer] Extension loaded! Test with: window.testImageViewer()");
  let isResizing = false;
  let resizeDirection = "";
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;
  let startPos = { x: 0, y: 0 };
  const resizeHandles = widget.root.querySelectorAll(".image-viewer-resize");
  resizeHandles.forEach((handle) => {
    handle.addEventListener("mousedown", (event) => {
      const mouseEvent = event;
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
      isResizing = true;
      resizeDirection = mouseEvent.target.dataset.direction || "";
      startX = mouseEvent.clientX;
      startY = mouseEvent.clientY;
      startWidth = widget.root.offsetWidth;
      startHeight = widget.root.offsetHeight;
      startPos = widget.getPosition();
    });
  });
  document.addEventListener("mousemove", (event) => {
    if (!isResizing)
      return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newX = startPos.x;
    let newY = startPos.y;
    if (resizeDirection.includes("e")) {
      newWidth = Math.max(200, startWidth + deltaX);
    }
    if (resizeDirection.includes("w")) {
      newWidth = Math.max(200, startWidth - deltaX);
      newX = startPos.x + (startWidth - newWidth);
    }
    if (resizeDirection.includes("s")) {
      newHeight = Math.max(150, startHeight + deltaY);
    }
    if (resizeDirection.includes("n")) {
      newHeight = Math.max(150, startHeight - deltaY);
      newY = startPos.y + (startHeight - newHeight);
    }
    widget.root.style.width = newWidth + "px";
    widget.root.style.height = newHeight + "px";
    if (resizeDirection.includes("w") || resizeDirection.includes("n")) {
      widget.moveTo(newX, newY);
    }
  });
  document.addEventListener("mouseup", () => {
    isResizing = false;
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName !== "IMG")
      return;
    const img = target;
    const src = img.getAttribute("src");
    if (src && src.includes("/avatar")) {
      event.preventDefault();
      event.stopPropagation();
      showImage(src);
      console.log("[Image Viewer] Avatar clicked, showing:", src);
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
