function G(s){if(!s)return s;try{let x=s.startsWith("/"),e=typeof window<"u"?window.location.origin:"http://localhost",u=new URL(s,e);if(u.searchParams.has("size")){if(u.searchParams.delete("size"),x||typeof window<"u"&&u.origin===window.location.origin)return u.pathname+(u.search?u.search:"")+u.hash;return u.toString()}}catch{}return s}function D(s,x,e,u,f=39,y=260){let H=s>0&&x>0?s/x:1,v=Math.max(80,u-f),n=Math.max(y,e),o=s,l=x;if(o>n||l>v){let k=Math.min(n/o,v/l);o=Math.round(o*k),l=Math.round(o/H)}if(o<y)o=y,l=Math.round(o/H);if(l>v)l=v,o=Math.round(l*H);return{viewportWidth:Math.round(o),viewportHeight:Math.round(l),widgetWidth:Math.round(o),widgetHeight:Math.round(l+f)}}function te(s,x,e,u,f,y=39,H=240){let v=e>0?e:1,n=Math.max(H,s+x),o=Math.round(n/v);if(n>u)n=u,o=Math.round(n/v);if(o>f)o=f,n=Math.round(o*v);return{viewportWidth:Math.round(n),viewportHeight:Math.round(o),widgetWidth:Math.round(n),widgetHeight:Math.round(o+y)}}function ie(s){let x=s.dom.addStyle(`
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
        transform: scale(0.9) translateY(8px);
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
        transform: scale(0.9) translateY(8px);
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
      border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.12));
      border-radius: var(--lumiverse-radius, 8px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
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
      transition: transform 0.05s ease-out;
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
  `),e=null,u=null,f="",y=0,H=0,v=1,n=1,o=0,l=0,k=0,L=!1,M=null,w=null,p=null,C=null,z=null,S=null,F=null,P=null,T=!1,q=0,_=0,R=!1,U=0,j=0,N=0;async function Z(){try{return(await s.permissions.getGranted()).includes("ui_panels")}catch{return!0}}function V(){if(k%180!==0)return 1/(v||1);return v||1}function h(){if(!C)return;let r=L?-1:1;if(C.style.transform=`translate(${o}px, ${l}px) scale(${n}) rotate(${k}deg) scaleX(${r})`,P)if(n===1&&o===0&&l===0)P.textContent="Fit";else P.textContent=`${Math.round(n*100)}%`}function I(){n=1,o=0,l=0,h()}function K(){if(e)return!0;try{e=s.ui.createFloatWidget({width:440,height:340,initialPosition:{x:Math.max(20,Math.round((window.innerWidth-440)/2)),y:Math.max(20,Math.round((window.innerHeight-340)/2))},snapToEdge:!0,tooltip:"Image Viewer",chromeless:!0})}catch(t){return console.error("[Image Viewer] Failed to create float widget:",t),!1}e.root.innerHTML=`
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
            <button class="iv-btn" data-action="fullscreen" title="Toggle Fullscreen (F)">⛶</button>
            <button class="iv-btn" data-action="copy-url" title="Copy Image URL">\uD83D\uDCCB</button>
            <button class="iv-btn" data-action="open-tab" title="Open in New Tab">↗</button>
            <button class="iv-btn iv-btn-close" data-action="close" title="Close (Esc)">×</button>
          </div>
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
    `,M=e.root.querySelector(".iv-container"),w=e.root.querySelector(".iv-toolbar"),p=e.root.querySelector(".iv-viewport"),C=e.root.querySelector(".iv-img-wrapper"),z=e.root.querySelector(".iv-img"),S=e.root.querySelector(".iv-spinner"),F=e.root.querySelector(".iv-error"),P=e.root.querySelector(".iv-zoom-pill"),e.setVisible(!1),w?.addEventListener("click",(t)=>{let i=t.target.closest("[data-action]");if(!i)return;switch(i.getAttribute("data-action")){case"zoom-in":n=Math.min(10,Math.round(n*1.25*100)/100),h();break;case"zoom-out":n=Math.max(0.2,Math.round(n/1.25*100)/100),h();break;case"zoom-fit":I();break;case"rotate":{if(k=(k+90)%360,e&&M){let d=e.root.offsetWidth,g=w?w.offsetHeight:39,m=Math.max(80,e.root.offsetHeight-g),b=V(),E=D(Math.round(m*b),m,window.innerWidth*0.85,window.innerHeight*0.85,g,260);e.setSize(E.widgetWidth,E.widgetHeight),e.root.style.width=E.widgetWidth+"px",e.root.style.height=E.widgetHeight+"px"}h();break}case"flip":L=!L,h();break;case"fullscreen":if(e){let d=e.isFullscreen?.()??!1;e.setFullscreen?.(!d)}break;case"copy-url":if(f)navigator.clipboard.writeText(f).then(()=>{i.textContent="✓",setTimeout(()=>{i.textContent="\uD83D\uDCCB"},1200)});break;case"open-tab":if(f)window.open(f,"_blank","noopener,noreferrer");break;case"close":Y();break}}),p?.addEventListener("wheel",(t)=>{if(t.preventDefault(),!p)return;let i=p.getBoundingClientRect(),c=t.clientX-i.left-i.width/2,d=t.clientY-i.top-i.height/2,g=t.deltaY<0?1.15:0.8695652173913044,m=Math.min(10,Math.max(0.2,n*g));o=c-(c-o)*m/n,l=d-(d-l)*m/n,n=Math.round(m*1000)/1000,h()},{passive:!1}),p?.addEventListener("pointerdown",(t)=>{if(t.button!==0)return;if(!p)return;T=!0,q=t.clientX-o,_=t.clientY-l,p.classList.add("panning"),p.setPointerCapture(t.pointerId)}),p?.addEventListener("pointermove",(t)=>{if(!T)return;o=t.clientX-q,l=t.clientY-_,h()});let r=()=>{if(!T)return;T=!1,p?.classList.remove("panning")};p?.addEventListener("pointerup",r),p?.addEventListener("lostpointercapture",r),p?.addEventListener("dblclick",(t)=>{if(n===1&&o===0&&l===0){if(n=2,p){let i=p.getBoundingClientRect(),c=t.clientX-i.left-i.width/2,d=t.clientY-i.top-i.height/2;o=c-c*2,l=d-d*2}}else I();h()});let a=e.root.querySelector(".image-viewer-resize");if(a){a.addEventListener("pointerdown",(i)=>{if(i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation(),!e)return;R=!0,U=i.clientX,j=i.clientY,N=e.root.offsetWidth,a.setPointerCapture(i.pointerId),e.root.style.pointerEvents="none",a.style.pointerEvents="auto"}),a.addEventListener("pointermove",(i)=>{if(!R||!e)return;let c=i.clientX-U,d=i.clientY-j,g=Math.max(c,d),m=e.getPosition(),b=w?w.offsetHeight:39,E=window.innerWidth-m.x-16,X=window.innerHeight-m.y-16-b,ee=V(),A=te(N,g,ee,E,X,b,240);e.setSize(A.widgetWidth,A.widgetHeight),e.root.style.width=A.widgetWidth+"px",e.root.style.height=A.widgetHeight+"px"});let t=()=>{if(!R||!e)return;R=!1,e.root.style.pointerEvents="",a.style.pointerEvents=""};a.addEventListener("pointerup",t),a.addEventListener("lostpointercapture",t)}return!0}function Y(){if(!e||!M)return;M.classList.remove("pop-in"),M.classList.add("pop-out"),setTimeout(()=>{if(e)e.setVisible(!1),M?.classList.remove("pop-out")},150)}async function W(r,a="Image Preview"){let t=G(r);if(f=t,!await Z())try{if(!(await s.permissions.request(["ui_panels"],{reason:"Image Viewer needs permission to open floating image panels."})).includes("ui_panels"))return}catch(d){console.warn("[Image Viewer] ui_panels permission request rejected:",d);return}if(!K()||!e)return;if(S?.classList.add("active"),F?.classList.remove("active"),z)z.style.opacity="0";let c=new Image;c.onload=()=>{S?.classList.remove("active"),y=c.naturalWidth||600,H=c.naturalHeight||400,v=y/H,k=0,L=!1;let d=w?w.offsetHeight:39,g=window.innerWidth*0.85,m=window.innerHeight*0.85,b=D(y,H,g,m,d,260);e.setSize(b.widgetWidth,b.widgetHeight),e.root.style.width=b.widgetWidth+"px",e.root.style.height=b.widgetHeight+"px";let E=Math.max(16,Math.round((window.innerWidth-b.widgetWidth)/2)),X=Math.max(16,Math.round((window.innerHeight-b.widgetHeight)/2));if(e.moveTo(E,X),z)z.src=t,z.alt=a,z.style.opacity="1";I(),e.setVisible(!0),M?.classList.remove("pop-out"),M?.classList.add("pop-in")},c.onerror=()=>{S?.classList.remove("active"),F?.classList.add("active"),e?.setVisible(!0)},c.src=t}let B=(r)=>{if(!e||!e.isVisible())return;let a=document.activeElement;if(a&&(a.tagName==="INPUT"||a.tagName==="TEXTAREA"||a.isContentEditable))return;switch(r.key){case"Escape":r.preventDefault(),Y();break;case"+":case"=":r.preventDefault(),n=Math.min(10,Math.round(n*1.25*100)/100),h();break;case"-":case"_":r.preventDefault(),n=Math.max(0.2,Math.round(n/1.25*100)/100),h();break;case"0":r.preventDefault(),I();break;case"f":case"F":if(r.preventDefault(),e){let t=e.isFullscreen?.()??!1;e.setFullscreen?.(!t)}break;case"r":case"R":{if(r.preventDefault(),k=(k+90)%360,e&&M){let t=e.root.offsetWidth,i=w?w.offsetHeight:39,c=Math.max(80,e.root.offsetHeight-i),d=V(),g=D(Math.round(c*d),c,window.innerWidth*0.85,window.innerHeight*0.85,i,260);e.setSize(g.widgetWidth,g.widgetHeight),e.root.style.width=g.widgetWidth+"px",e.root.style.height=g.widgetHeight+"px"}h();break}case"h":case"H":r.preventDefault(),L=!L,h();break}};document.addEventListener("keydown",B);let O=(r)=>{let a=r.target;if(!a)return;if(e&&e.root.contains(a))return;let t=a.tagName==="IMG"?a:a.closest("img");if(!t)return;let i=t.getAttribute("src");if(!i)return;let c=i.includes("/avatar")||!!t.closest(".avatar, [data-avatar], .portrait"),d=i.includes("/api/v1/images")||i.includes("/api/v1/image-gen")||!!t.closest(".attachment, [data-attachment]"),g=!!t.closest(".message-content, .chat-message, [data-message-id]"),m=t.naturalWidth>=32&&t.naturalHeight>=32;if(c||d||g||m)r.preventDefault(),r.stopPropagation(),W(i,t.alt||"Image Preview")};document.addEventListener("click",O,!0);try{u=s.ui.registerInputBarAction({id:"view-character-avatar",label:"View Character Avatar",iconSvg:`
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="5"/>
          <path d="M20 21a8 8 0 1 0-16 0"/>
        </svg>
      `}),u.onClick(()=>{let r=s.getActiveChat?.();if(r?.characterId)W(`/api/v1/characters/${r.characterId}/avatar`,"Character Avatar");else{let a=document.querySelector('img[src*="/avatar"]');if(a?.src)W(a.src,"Avatar")}})}catch(r){console.debug("[Image Viewer] Input bar action registration skipped:",r)}let J=s.events.on("PERMISSION_CHANGED",async(r)=>{let a=r;if(a?.permission==="ui_panels"){if(!a.granted&&e)e.destroy(),e=null}}),Q={show:W,close:Y,reset:I,resolveUrl:G};return window.__lumiverseImageViewer=Q,window.testImageViewer=(r)=>{W(r||"https://picsum.photos/800/600")},console.log("[Image Viewer] Extension loaded with strict fit aspect ratio mechanics"),()=>{document.removeEventListener("keydown",B),document.removeEventListener("click",O,!0),J?.(),u?.destroy(),e?.destroy(),x(),delete window.__lumiverseImageViewer,delete window.testImageViewer,console.log("[Image Viewer] Extension unloaded")}}export{D as calculateFitDimensions,te as calculateResizeDimensions,G as resolveFullImageUrl,ie as setup};
