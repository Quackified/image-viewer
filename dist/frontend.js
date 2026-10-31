function we(u){if(!u)return u;try{let w=u.startsWith("/"),e=typeof window<"u"?window.location.origin:"http://localhost",d=new URL(u,e);if(d.searchParams.has("size")){if(d.searchParams.delete("size"),w||typeof window<"u"&&d.origin===window.location.origin)return d.pathname+(d.search?d.search:"")+d.hash;return d.toString()}}catch{}return u}function se(u,w,e,d,f=39,p=280){let m=u>0&&w>0?u/w:1,g=Math.max(80,d-f),o=Math.max(p,e),s=u,v=w;if(s>o||v>g){let E=Math.min(o/s,g/v);s=Math.round(s*E),v=Math.round(s/m)}if(s<p)s=p,v=Math.round(s/m);if(v>g)v=g,s=Math.round(v*m);return{viewportWidth:Math.round(s),viewportHeight:Math.round(v),widgetWidth:Math.round(s),widgetHeight:Math.round(v+f)}}function ke(u,w,e,d,f,p=39,m=280){let g=e>0?e:1,o=Math.max(m,u+w),s=Math.round(o/g);if(o>d)o=d,s=Math.round(o/g);if(s>f)s=f,o=Math.round(s*g);return{viewportWidth:Math.round(o),viewportHeight:Math.round(s),widgetWidth:Math.round(o),widgetHeight:Math.round(s+p)}}function ze(u,w,e,d,f,p=0){let m=p,g=p;switch(u){case"top-left":m=p,g=p;break;case"top-right":m=Math.max(0,d-w-p),g=p;break;case"center":m=Math.max(0,Math.round((d-w)/2)),g=Math.max(0,Math.round((f-e)/2));break;case"bottom-left":m=p,g=Math.max(0,f-e-p);break;case"bottom-right":m=Math.max(0,d-w-p),g=Math.max(0,f-e-p);break}return{x:m,y:g}}function Ie(u,w,e,d,f,p,m=12){let g=Math.max(0,Math.min(u,Math.max(0,f-e))),o=Math.max(0,Math.min(w,Math.max(0,p-d))),s=Math.max(m,f-e-m),v=Math.max(m,p-d-m),E=Math.max(m,Math.min(g,s)),S=Math.max(m,Math.min(o,v));return{hostX:E,hostY:S,offsetX:g-E,offsetY:o-S}}function Pe(u){let w=u.dom.addStyle(`
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

    /* Pop-in animation */
    @keyframes ivPopIn {
      from {
        opacity: 0;
        transform: scale(0.92) translateY(8px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    /* Pop-out animation */
    @keyframes ivPopOut {
      from {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      to {
        opacity: 0;
        transform: scale(0.92) translateY(8px);
      }
    }

    @keyframes ivSpin {
      to { transform: rotate(360deg); }
    }

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
    }

    .iv-container.pop-in {
      animation: ivPopIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .iv-container.pop-out {
      animation: ivPopOut 0.15s cubic-bezier(0.7, 0, 0.84, 0) forwards;
    }

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

    .iv-toolbar.is-dragging {
      cursor: grabbing;
    }

    .iv-container.is-locked .iv-toolbar {
      cursor: nwse-resize;
    }

    .iv-container.is-locked .iv-toolbar.is-resizing {
      cursor: nwse-resize;
    }

    .iv-toolbar-group {
      display: flex;
      align-items: center;
      gap: 2px;
    }

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

    .iv-btn:hover {
      opacity: 1;
      background: var(--lumiverse-border, rgba(255, 255, 255, 0.12));
    }

    .iv-btn:active {
      transform: scale(0.94);
    }

    .iv-btn.active {
      color: var(--lumiverse-accent, #38bdf8);
      background: rgba(56, 189, 248, 0.15);
      opacity: 1;
    }

    .iv-btn-close {
      color: var(--lumiverse-text, #e2e8f0);
      font-size: 16px;
      line-height: 1;
    }

    .iv-btn-close:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .iv-zoom-pill {
      font-size: 11px;
      font-variant-numeric: tabular-nums;
      padding: 2px 6px;
      color: var(--lumiverse-text-muted, #94a3b8);
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid transparent;
      transition: color 0.15s, background 0.15s;
    }

    .iv-zoom-pill:hover {
      color: var(--lumiverse-text, #fff);
      background: var(--lumiverse-border, rgba(255, 255, 255, 0.08));
    }

    /* Dropdown Menus */
    .iv-menu {
      position: absolute;
      top: 42px;
      right: 6px;
      min-width: 175px;
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
      padding: 4px 6px 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .iv-menu-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
    }

    .iv-menu-grid button:last-child:nth-child(odd) {
      grid-column: span 2;
    }

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

    .iv-menu-btn:hover {
      background: var(--lumiverse-border, rgba(255, 255, 255, 0.15));
      color: #fff;
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

    .iv-menu-item:hover {
      background: var(--lumiverse-border, rgba(255, 255, 255, 0.15));
      color: #fff;
    }

    .iv-menu-icon {
      font-size: 13px;
      width: 16px;
      text-align: center;
    }

    .iv-menu-divider {
      height: 1px;
      background: var(--lumiverse-border, rgba(255, 255, 255, 0.08));
      margin: 4px 0;
    }

    /* Main Viewport Area */
    .iv-viewport {
      flex: 1;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      /* Subtle checkerboard pattern for transparency */
      background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%);
      background-size: 16px 16px;
      background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
    }

    .iv-viewport.panning {
      cursor: grabbing;
    }

    .iv-viewport.is-image-locked {
      cursor: default !important;
    }

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

    /* Loading Spinner */
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

    .iv-spinner.active {
      display: block;
    }

    /* Error Message */
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

    .iv-error.active {
      display: block;
    }

    /* Resize Handle */
    .image-viewer-resize {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 22px;
      height: 22px;
      cursor: se-resize;
      opacity: 0.6;
      transition: opacity 0.2s;
      touch-action: none;
      z-index: 30;
    }

    .image-viewer-resize:hover {
      opacity: 1;
    }

    .image-viewer-resize::after {
      content: '';
      position: absolute;
      bottom: 3px;
      right: 3px;
      width: 12px;
      height: 12px;
      background: repeating-linear-gradient(
        -45deg,
        var(--lumiverse-text, #fff),
        var(--lumiverse-text, #fff) 1px,
        transparent 1px,
        transparent 4px
      );
      mask-image: linear-gradient(to top left, #000 50%, transparent 50%);
      -webkit-mask-image: linear-gradient(to top left, #000 50%, transparent 50%);
    }
  `),e=null,d=null,f="",p=0,m=0,g=1,o=1,s=0,v=0,E=0,S=!1,T=!1,k=!1,y=null,R=0,D=0,M=null,h=null,b=null,Q=null,W=null,U=null,ee=null,N=null,V=null,A=null,C=null,O=!1,le=0,ce=0,j=!1,de=0,ue=0,pe=0,Z=!1,G=!1,te=0,ne=0,ie=0,oe=0,me=0,ye=39;function q(){return h&&h.offsetHeight>0?h.offsetHeight:ye}async function Me(){try{return(await u.permissions.getGranted()).includes("ui_panels")}catch{return!0}}function K(){if(E%180!==0)return 1/(g||1);return g||1}function H(){if(!Q)return;let n=S?-1:1;if(Q.style.transform=`translate(${s}px, ${v}px) scale(${o}) rotate(${E}deg) scaleX(${n})`,N)if(o===1&&s===0&&v===0)N.textContent="Fit";else N.textContent=`${Math.round(o*100)}%`}function F(){o=1,s=0,v=0,H()}function z(){if(A)A.style.display="none";if(C)C.style.display="none"}function re(n){T=typeof n==="boolean"?n:!T,ge()}function ge(){if(V)V.textContent=T?"\uD83D\uDD12":"\uD83D\uDD13",V.title=T?"Window Locked (Drag toolbar to resize)":"Window Unlocked (Drag toolbar to move)",V.classList.toggle("active",T);if(M)M.classList.toggle("is-locked",T);let n=e?.root.querySelector(".iv-lock-status-icon"),r=e?.root.querySelector(".iv-lock-status-text");if(n)n.textContent=T?"\uD83D\uDD12":"\uD83D\uDD13";if(r)r.textContent=T?"Unlock Position":"Lock Position"}function ve(n){k=typeof n==="boolean"?n:!k,be()}function be(){if(b)b.classList.toggle("is-image-locked",k);let n=e?.root.querySelector(".iv-imglock-status-icon"),r=e?.root.querySelector(".iv-imglock-status-text");if(n)n.textContent=k?"\uD83D\uDD12":"\uD83D\uDD13";if(r)r.textContent=k?"Unlock Image Pan/Zoom":"Lock Image Pan/Zoom"}function Y(n,r){if(!e)return;let l=e.root.offsetWidth||440,t=e.root.offsetHeight||340,{innerWidth:i,innerHeight:c}=window,a=Ie(n,r,l,t,i,c,12);R=a.hostX+a.offsetX,D=a.hostY+a.offsetY,e.moveTo(a.hostX,a.hostY),e.root.style.transform=a.offsetX!==0||a.offsetY!==0?`translate3d(${a.offsetX}px, ${a.offsetY}px, 0)`:""}function I(n){if(!e)return;y=n;let r=e.root.offsetWidth||440,l=e.root.offsetHeight||340,{x:t,y:i}=ze(n,r,l,window.innerWidth,window.innerHeight,0);Y(t,i),z()}function Le(){if(e)return!0;try{e=u.ui.createFloatWidget({width:440,height:340,initialPosition:{x:Math.max(0,Math.round((window.innerWidth-440)/2)),y:Math.max(0,Math.round((window.innerHeight-340)/2))},snapToEdge:!1,tooltip:"Image Viewer",chromeless:!0})}catch(t){return console.error("[Image Viewer] Failed to create float widget:",t),!1}e.root.innerHTML=`
      <div class="iv-container">
        <div class="iv-toolbar">
          <div class="iv-toolbar-group">
            <button class="iv-btn" data-action="zoom-out" title="Zoom Out (-)">−</button>
            <span class="iv-zoom-pill" data-action="zoom-fit" title="Click to Fit Aspect Ratio (0)">Fit</span>
            <button class="iv-btn" data-action="zoom-in" title="Zoom In (+)">+</button>
            <button class="iv-btn" data-action="zoom-fit" title="Fit Aspect Ratio (0)">⊡</button>
            <button class="iv-btn" data-action="rotate" title="Rotate 90° (R)">↻</button>
            <button class="iv-btn" data-action="flip" title="Flip Horizontal (H)">⇄</button>
          </div>
          <div class="iv-toolbar-group">
            <button class="iv-btn" data-action="anchor-menu" title="Anchor Presets (↖, ↗, ✛, ↙, ↘)">⚓</button>
            <button class="iv-btn iv-btn-lock" data-action="toggle-lock" title="Window Unlocked (Drag toolbar to move)">\uD83D\uDD13</button>
            <button class="iv-btn" data-action="more-menu" title="More options">⋮</button>
            <button class="iv-btn iv-btn-close" data-action="close" title="Close (Esc)">×</button>
          </div>
        </div>

        <!-- Anchor Presets Dropdown -->
        <div class="iv-menu iv-anchor-menu" style="display: none;">
          <div class="iv-menu-header">Anchor Presets</div>
          <div class="iv-menu-grid">
            <button class="iv-menu-btn" data-action="anchor-tl" title="Top Left">↖ Top Left</button>
            <button class="iv-menu-btn" data-action="anchor-tr" title="Top Right">↗ Top Right</button>
            <button class="iv-menu-btn" data-action="anchor-center" title="Center">✛ Center</button>
            <button class="iv-menu-btn" data-action="anchor-bl" title="Bottom Left">↙ Bottom Left</button>
            <button class="iv-menu-btn" data-action="anchor-br" title="Bottom Right">↘ Bottom Right</button>
          </div>
        </div>

        <!-- More Options Dropdown -->
        <div class="iv-menu iv-more-menu" style="display: none;">
          <button class="iv-menu-item" data-action="copy-url">
            <span class="iv-menu-icon">\uD83D\uDCCB</span>
            <span>Copy Image Link</span>
          </button>
          <button class="iv-menu-item" data-action="open-tab">
            <span class="iv-menu-icon">↗</span>
            <span>Open in New Tab</span>
          </button>
          <div class="iv-menu-divider"></div>
          <button class="iv-menu-item" data-action="toggle-image-lock">
            <span class="iv-menu-icon iv-imglock-status-icon">\uD83D\uDD13</span>
            <span class="iv-imglock-status-text">Lock Image Pan/Zoom</span>
          </button>
          <button class="iv-menu-item" data-action="toggle-lock">
            <span class="iv-menu-icon iv-lock-status-icon">\uD83D\uDD13</span>
            <span class="iv-lock-status-text">Lock Position</span>
          </button>
        </div>

        <div class="iv-viewport">
          <div class="iv-spinner"></div>
          <div class="iv-error">Failed to load image</div>
          <div class="iv-img-wrapper">
            <img class="iv-img" src="" alt="Preview" draggable="false" />
          </div>
        </div>
        <div class="image-viewer-resize" data-direction="se" title="Resize"></div>
      </div>
    `,M=e.root.querySelector(".iv-container"),h=e.root.querySelector(".iv-toolbar"),b=e.root.querySelector(".iv-viewport"),Q=e.root.querySelector(".iv-img-wrapper"),W=e.root.querySelector(".iv-img"),U=e.root.querySelector(".iv-spinner"),ee=e.root.querySelector(".iv-error"),N=e.root.querySelector(".iv-zoom-pill"),V=e.root.querySelector(".iv-btn-lock"),A=e.root.querySelector(".iv-anchor-menu"),C=e.root.querySelector(".iv-more-menu"),e.setVisible(!1),h?.addEventListener("pointerdown",(t)=>{if(t.target.closest("button, input, select, .iv-zoom-pill, .iv-menu"))return;if(t.preventDefault(),t.stopPropagation(),!e||!h)return;if(te=t.clientX,ne=t.clientY,ie=R,oe=D,me=e.root.offsetWidth,h.setPointerCapture(t.pointerId),T)G=!0,h.classList.add("is-resizing");else Z=!0,h.classList.add("is-dragging")}),h?.addEventListener("pointermove",(t)=>{if(!e)return;if(Z){let i=t.clientX-te,c=t.clientY-ne;Y(ie+i,oe+c),y=null}else if(G){let i=t.clientX-te,c=t.clientY-ne,a=Math.abs(i)>=Math.abs(c)?i:c,L=q(),x=K(),{innerWidth:P,innerHeight:B}=window,X=ke(me,a,x,P,B-L,L,280);if(e.setSize(X.widgetWidth,X.widgetHeight),e.root.style.width=X.widgetWidth+"px",e.root.style.height=X.widgetHeight+"px",y)I(y);else Y(ie,oe)}});let n=(t)=>{if(Z)Z=!1,h?.classList.remove("is-dragging");if(G)G=!1,h?.classList.remove("is-resizing");if(h&&h.hasPointerCapture(t.pointerId))try{h.releasePointerCapture(t.pointerId)}catch{}};h?.addEventListener("pointerup",n),h?.addEventListener("lostpointercapture",n),document.addEventListener("pointerdown",(t)=>{if(M&&!M.contains(t.target))z()}),M?.addEventListener("click",(t)=>{let i=t.target.closest("[data-action]");if(!i)return;switch(i.getAttribute("data-action")){case"zoom-in":if(!k)o=Math.min(10,Math.round(o*1.25*100)/100),H();break;case"zoom-out":if(!k)o=Math.max(0.2,Math.round(o/1.25*100)/100),H();break;case"zoom-fit":if(!k)F();z();break;case"rotate":{if(E=(E+90)%360,e&&M){let a=q(),L=Math.max(80,e.root.offsetHeight-a),x=K(),P=se(Math.round(L*x),L,window.innerWidth*0.85,window.innerHeight*0.85,a,280);if(e.setSize(P.widgetWidth,P.widgetHeight),e.root.style.width=P.widgetWidth+"px",e.root.style.height=P.widgetHeight+"px",y)I(y)}H();break}case"flip":S=!S,H();break;case"anchor-menu":if(A){let a=A.style.display!=="none";z(),A.style.display=a?"none":"flex"}break;case"more-menu":if(C){let a=C.style.display!=="none";z(),C.style.display=a?"none":"flex"}break;case"anchor-tl":I("top-left");break;case"anchor-tr":I("top-right");break;case"anchor-center":I("center");break;case"anchor-bl":I("bottom-left");break;case"anchor-br":I("bottom-right");break;case"toggle-lock":re(),z();break;case"toggle-image-lock":ve(),z();break;case"copy-url":if(f)navigator.clipboard.writeText(f).then(()=>{i.textContent="✓ Copied!",setTimeout(()=>{z()},800)});break;case"open-tab":if(f)window.open(f,"_blank","noopener,noreferrer"),z();break;case"close":ae();break}}),b?.addEventListener("wheel",(t)=>{if(k)return;if(t.preventDefault(),!b)return;let i=b.getBoundingClientRect(),c=t.clientX-i.left-i.width/2,a=t.clientY-i.top-i.height/2,L=t.deltaY<0?1.15:0.8695652173913044,x=Math.min(10,Math.max(0.2,o*L));s=c-(c-s)*x/o,v=a-(a-v)*x/o,o=Math.round(x*1000)/1000,H()},{passive:!1}),b?.addEventListener("pointerdown",(t)=>{if(t.button!==0||k)return;if(!b)return;t.preventDefault(),O=!0,le=t.clientX-s,ce=t.clientY-v,b.classList.add("panning"),b.setPointerCapture(t.pointerId)}),b?.addEventListener("pointermove",(t)=>{if(!O||k)return;s=t.clientX-le,v=t.clientY-ce,H()});let r=(t)=>{if(!O)return;if(O=!1,b?.classList.remove("panning"),b&&b.hasPointerCapture(t.pointerId))try{b.releasePointerCapture(t.pointerId)}catch{}};b?.addEventListener("pointerup",r),b?.addEventListener("lostpointercapture",r),b?.addEventListener("dblclick",(t)=>{if(k)return;if(o===1&&s===0&&v===0){if(o=2,b){let i=b.getBoundingClientRect(),c=t.clientX-i.left-i.width/2,a=t.clientY-i.top-i.height/2;s=c-c*2,v=a-a*2}}else F();H()});let l=e.root.querySelector(".image-viewer-resize");if(l){l.addEventListener("pointerdown",(i)=>{if(i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation(),!e)return;j=!0,de=i.clientX,ue=i.clientY,pe=e.root.offsetWidth,l.setPointerCapture(i.pointerId),e.root.style.pointerEvents="none",l.style.pointerEvents="auto"}),l.addEventListener("pointermove",(i)=>{if(!j||!e)return;let c=i.clientX-de,a=i.clientY-ue,L=Math.max(c,a),x=q(),P=window.innerWidth-R,B=window.innerHeight-D-x,X=K(),J=ke(pe,L,X,P,B,x,280);if(e.setSize(J.widgetWidth,J.widgetHeight),e.root.style.width=J.widgetWidth+"px",e.root.style.height=J.widgetHeight+"px",y)I(y);else Y(R,D)});let t=(i)=>{if(!j||!e)return;if(j=!1,e.root.style.pointerEvents="",l.style.pointerEvents="",l.hasPointerCapture(i.pointerId))try{l.releasePointerCapture(i.pointerId)}catch{}};l.addEventListener("pointerup",t),l.addEventListener("lostpointercapture",t)}return!0}function ae(){if(!e||!M)return;z(),M.classList.remove("pop-in"),M.classList.add("pop-out"),setTimeout(()=>{if(e)e.setVisible(!1),M?.classList.remove("pop-out")},150)}async function _(n,r="Image Preview"){let l=we(n);if(f=l,!await Me())try{if(!(await u.permissions.request(["ui_panels"],{reason:"Image Viewer needs permission to open floating image panels."})).includes("ui_panels"))return}catch(c){console.warn("[Image Viewer] ui_panels permission request rejected:",c);return}if(!Le()||!e)return;if(U?.classList.add("active"),ee?.classList.remove("active"),W)W.style.opacity="0";z();let i=new Image;i.onload=()=>{U?.classList.remove("active"),p=i.naturalWidth||600,m=i.naturalHeight||400,g=p/m,E=0,S=!1;let c=q(),a=window.innerWidth*0.85,L=window.innerHeight*0.85,x=se(p,m,a,L,c,280);if(e.setSize(x.widgetWidth,x.widgetHeight),e.root.style.width=x.widgetWidth+"px",e.root.style.height=x.widgetHeight+"px",y)I(y);else{let P=Math.max(0,Math.round((window.innerWidth-x.widgetWidth)/2)),B=Math.max(0,Math.round((window.innerHeight-x.widgetHeight)/2));Y(P,B)}if(W)W.src=l,W.alt=r,W.style.opacity="1";F(),ge(),be(),e.setVisible(!0),M?.classList.remove("pop-out"),M?.classList.add("pop-in")},i.onerror=()=>{U?.classList.remove("active"),ee?.classList.add("active"),e?.setVisible(!0)},i.src=l}let fe=(n)=>{if(!e||!e.isVisible())return;let r=document.activeElement;if(r&&(r.tagName==="INPUT"||r.tagName==="TEXTAREA"||r.isContentEditable))return;switch(n.key){case"Escape":if(n.preventDefault(),A?.style.display!=="none"||C?.style.display!=="none")z();else ae();break;case"+":case"=":if(!k)n.preventDefault(),o=Math.min(10,Math.round(o*1.25*100)/100),H();break;case"-":case"_":if(!k)n.preventDefault(),o=Math.max(0.2,Math.round(o/1.25*100)/100),H();break;case"0":if(!k)n.preventDefault(),F();break;case"r":case"R":{if(n.preventDefault(),E=(E+90)%360,e&&M){let l=q(),t=Math.max(80,e.root.offsetHeight-l),i=K(),c=se(Math.round(t*i),t,window.innerWidth*0.85,window.innerHeight*0.85,l,280);if(e.setSize(c.widgetWidth,c.widgetHeight),e.root.style.width=c.widgetWidth+"px",e.root.style.height=c.widgetHeight+"px",y)I(y)}H();break}case"h":case"H":n.preventDefault(),S=!S,H();break;case"l":case"L":n.preventDefault(),re();break}};document.addEventListener("keydown",fe);let he=(n)=>{let r=n.target;if(!r)return;if(e&&e.root.contains(r))return;let l=r.tagName==="IMG"?r:r.closest("img");if(!l)return;let t=l.getAttribute("src");if(!t)return;let i=t.includes("/avatar")||!!l.closest(".avatar, [data-avatar], .portrait"),c=t.includes("/api/v1/images")||t.includes("/api/v1/image-gen")||!!l.closest(".attachment, [data-attachment]"),a=!!l.closest(".message-content, .chat-message, [data-message-id]"),L=l.naturalWidth>=32&&l.naturalHeight>=32;if(i||c||a||L)n.preventDefault(),n.stopPropagation(),_(t,l.alt||"Image Preview")};document.addEventListener("click",he,!0);let xe=()=>{if(!e||!e.isVisible())return;if(y)I(y);else Y(R,D)};window.addEventListener("resize",xe);try{d=u.ui.registerInputBarAction({id:"view-character-avatar",label:"View Character Avatar",iconSvg:`
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="5"/>
          <path d="M20 21a8 8 0 1 0-16 0"/>
        </svg>
      `}),d.onClick(()=>{let n=u.getActiveChat?.();if(n?.characterId)_(`/api/v1/characters/${n.characterId}/avatar`,"Character Avatar");else{let r=document.querySelector('img[src*="/avatar"]');if(r?.src)_(r.src,"Avatar")}})}catch(n){console.debug("[Image Viewer] Input bar action registration skipped:",n)}let Ee=u.events.on("PERMISSION_CHANGED",async(n)=>{let r=n;if(r?.permission==="ui_panels"){if(!r.granted&&e)e.destroy(),e=null}}),He={show:_,close:ae,reset:F,setAnchor:I,toggleLock:re,toggleImageLock:ve,resolveUrl:we};return window.__lumiverseImageViewer=He,window.testImageViewer=(n)=>{_(n||"https://picsum.photos/800/600")},console.log("[Image Viewer] Extension loaded with anchor presets, flush placement, and toolbar resize"),()=>{document.removeEventListener("keydown",fe),document.removeEventListener("click",he,!0),window.removeEventListener("resize",xe),Ee?.(),d?.destroy(),e?.destroy(),w(),delete window.__lumiverseImageViewer,delete window.testImageViewer,console.log("[Image Viewer] Extension unloaded")}}export{ze as calculateAnchorPosition,Ie as calculateEdgeFlushPlacement,se as calculateFitDimensions,ke as calculateResizeDimensions,we as resolveFullImageUrl,Pe as setup};
