function re(l){if(!l)return l;try{let x=l.startsWith("/"),e=typeof window<"u"?window.location.origin:"http://localhost",c=new URL(l,e);if(c.searchParams.has("size")){if(c.searchParams.delete("size"),x||typeof window<"u"&&c.origin===window.location.origin)return c.pathname+(c.search?c.search:"")+c.hash;return c.toString()}}catch{}return l}function Z(l,x,e,c,b=39,d=260){let g=l>0&&x>0?l/x:1,p=Math.max(80,c-b),r=Math.max(d,e),a=l,m=x;if(a>r||m>p){let E=Math.min(r/a,p/m);a=Math.round(a*E),m=Math.round(a/g)}if(a<d)a=d,m=Math.round(a/g);if(m>p)m=p,a=Math.round(m*g);return{viewportWidth:Math.round(a),viewportHeight:Math.round(m),widgetWidth:Math.round(a),widgetHeight:Math.round(m+b)}}function pe(l,x,e,c,b,d=39,g=240){let p=e>0?e:1,r=Math.max(g,l+x),a=Math.round(r/p);if(r>c)r=c,a=Math.round(r/p);if(a>b)a=b,r=Math.round(a*p);return{viewportWidth:Math.round(r),viewportHeight:Math.round(a),widgetWidth:Math.round(r),widgetHeight:Math.round(a+d)}}function me(l,x,e,c,b,d=0){let g=d,p=d;switch(l){case"top-left":g=d,p=d;break;case"top-right":g=Math.max(0,c-x-d),p=d;break;case"center":g=Math.max(0,Math.round((c-x)/2)),p=Math.max(0,Math.round((b-e)/2));break;case"bottom-left":g=d,p=Math.max(0,b-e-d);break;case"bottom-right":g=Math.max(0,c-x-d),p=Math.max(0,b-e-d);break}return{x:g,y:p}}function ve(l){let x=l.dom.addStyle(`
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
      height: 39px;
      min-height: 39px;
      max-height: 39px;
      cursor: grab;
    }

    .iv-container.is-locked .iv-toolbar {
      cursor: default;
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
  `),e=null,c=null,b="",d=0,g=0,p=1,r=1,a=0,m=0,E=0,T=!1,H=!1,z=null,v=null,R=null,h=null,_=null,P=null,V=null,B=null,Y=null,A=null,I=null,S=null,q=!1,K=0,J=0,D=!1,Q=0,ee=0,te=0,ae=39;function F(){return R&&R.offsetHeight>0?R.offsetHeight:ae}async function se(){try{return(await l.permissions.getGranted()).includes("ui_panels")}catch{return!0}}function U(){if(E%180!==0)return 1/(p||1);return p||1}function w(){if(!_)return;let n=T?-1:1;if(_.style.transform=`translate(${a}px, ${m}px) scale(${r}) rotate(${E}deg) scaleX(${n})`,Y)if(r===1&&a===0&&m===0)Y.textContent="Fit";else Y.textContent=`${Math.round(r*100)}%`}function W(){r=1,a=0,m=0,w()}function y(){if(I)I.style.display="none";if(S)S.style.display="none"}function N(n){H=typeof n==="boolean"?n:!H,ne()}function ne(){if(A)A.textContent=H?"\uD83D\uDD12":"\uD83D\uDD13",A.title=H?"Window Locked (Click to unlock)":"Window Unlocked (Click to lock)",A.classList.toggle("active",H);if(v)v.classList.toggle("is-locked",H);let n=e?.root.querySelector(".iv-lock-status-icon"),o=e?.root.querySelector(".iv-lock-status-text");if(n)n.textContent=H?"\uD83D\uDD12":"\uD83D\uDD13";if(o)o.textContent=H?"Unlock Position":"Lock Position"}function L(n){if(!e)return;z=n;let o=e.root.offsetWidth||440,t=e.root.offsetHeight||340,{x:i,y:u}=me(n,o,t,window.innerWidth,window.innerHeight,0);e.moveTo(i,u),y()}function le(){if(e)return!0;try{e=l.ui.createFloatWidget({width:440,height:340,initialPosition:{x:Math.max(0,Math.round((window.innerWidth-440)/2)),y:Math.max(0,Math.round((window.innerHeight-340)/2))},snapToEdge:!1,tooltip:"Image Viewer",chromeless:!0})}catch(t){return console.error("[Image Viewer] Failed to create float widget:",t),!1}e.root.innerHTML=`
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
            <button class="iv-btn iv-btn-lock" data-action="toggle-lock" title="Window Unlocked (Click to lock)">\uD83D\uDD13</button>
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
          <button class="iv-menu-item" data-action="zoom-fit">
            <span class="iv-menu-icon">⊡</span>
            <span>Fit Aspect Ratio</span>
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
    `,v=e.root.querySelector(".iv-container"),R=e.root.querySelector(".iv-toolbar"),h=e.root.querySelector(".iv-viewport"),_=e.root.querySelector(".iv-img-wrapper"),P=e.root.querySelector(".iv-img"),V=e.root.querySelector(".iv-spinner"),B=e.root.querySelector(".iv-error"),Y=e.root.querySelector(".iv-zoom-pill"),A=e.root.querySelector(".iv-btn-lock"),I=e.root.querySelector(".iv-anchor-menu"),S=e.root.querySelector(".iv-more-menu"),e.setVisible(!1),v?.addEventListener("pointerdown",(t)=>{if(t.target.closest("button, input, select, .iv-zoom-pill, .image-viewer-resize, .iv-menu"))return;if(H)t.stopPropagation(),t.stopImmediatePropagation(),v?.setPointerCapture(t.pointerId);else z=null},!0),v?.addEventListener("pointerup",(t)=>{if(v?.hasPointerCapture(t.pointerId))v.releasePointerCapture(t.pointerId)},!0),document.addEventListener("pointerdown",(t)=>{if(v&&!v.contains(t.target))y()}),v?.addEventListener("click",(t)=>{let i=t.target.closest("[data-action]");if(!i)return;switch(i.getAttribute("data-action")){case"zoom-in":r=Math.min(10,Math.round(r*1.25*100)/100),w();break;case"zoom-out":r=Math.max(0.2,Math.round(r/1.25*100)/100),w();break;case"zoom-fit":W(),y();break;case"rotate":{if(E=(E+90)%360,e&&v){let s=F(),M=Math.max(80,e.root.offsetHeight-s),k=U(),f=Z(Math.round(M*k),M,window.innerWidth*0.85,window.innerHeight*0.85,s,260);if(e.setSize(f.widgetWidth,f.widgetHeight),e.root.style.width=f.widgetWidth+"px",e.root.style.height=f.widgetHeight+"px",z)L(z)}w();break}case"flip":T=!T,w();break;case"anchor-menu":if(I){let s=I.style.display!=="none";y(),I.style.display=s?"none":"flex"}break;case"more-menu":if(S){let s=S.style.display!=="none";y(),S.style.display=s?"none":"flex"}break;case"anchor-tl":L("top-left");break;case"anchor-tr":L("top-right");break;case"anchor-center":L("center");break;case"anchor-bl":L("bottom-left");break;case"anchor-br":L("bottom-right");break;case"toggle-lock":N(),y();break;case"copy-url":if(b)navigator.clipboard.writeText(b).then(()=>{i.textContent="✓ Copied!",setTimeout(()=>{y()},800)});break;case"open-tab":if(b)window.open(b,"_blank","noopener,noreferrer"),y();break;case"close":O();break}}),h?.addEventListener("wheel",(t)=>{if(t.preventDefault(),!h)return;let i=h.getBoundingClientRect(),u=t.clientX-i.left-i.width/2,s=t.clientY-i.top-i.height/2,M=t.deltaY<0?1.15:0.8695652173913044,k=Math.min(10,Math.max(0.2,r*M));a=u-(u-a)*k/r,m=s-(s-m)*k/r,r=Math.round(k*1000)/1000,w()},{passive:!1}),h?.addEventListener("pointerdown",(t)=>{if(t.button!==0)return;if(!h)return;q=!0,K=t.clientX-a,J=t.clientY-m,h.classList.add("panning"),h.setPointerCapture(t.pointerId)}),h?.addEventListener("pointermove",(t)=>{if(!q)return;a=t.clientX-K,m=t.clientY-J,w()});let n=()=>{if(!q)return;q=!1,h?.classList.remove("panning")};h?.addEventListener("pointerup",n),h?.addEventListener("lostpointercapture",n),h?.addEventListener("dblclick",(t)=>{if(r===1&&a===0&&m===0){if(r=2,h){let i=h.getBoundingClientRect(),u=t.clientX-i.left-i.width/2,s=t.clientY-i.top-i.height/2;a=u-u*2,m=s-s*2}}else W();w()});let o=e.root.querySelector(".image-viewer-resize");if(o){o.addEventListener("pointerdown",(i)=>{if(i.preventDefault(),i.stopPropagation(),i.stopImmediatePropagation(),!e)return;D=!0,Q=i.clientX,ee=i.clientY,te=e.root.offsetWidth,o.setPointerCapture(i.pointerId),e.root.style.pointerEvents="none",o.style.pointerEvents="auto"}),o.addEventListener("pointermove",(i)=>{if(!D||!e)return;let u=i.clientX-Q,s=i.clientY-ee,M=Math.max(u,s),k=e.getPosition(),f=F(),j=window.innerWidth-k.x,G=window.innerHeight-k.y-f,ue=U(),X=pe(te,M,ue,j,G,f,240);e.setSize(X.widgetWidth,X.widgetHeight),e.root.style.width=X.widgetWidth+"px",e.root.style.height=X.widgetHeight+"px"});let t=()=>{if(!D||!e)return;D=!1,e.root.style.pointerEvents="",o.style.pointerEvents=""};o.addEventListener("pointerup",t),o.addEventListener("lostpointercapture",t)}return!0}function O(){if(!e||!v)return;y(),v.classList.remove("pop-in"),v.classList.add("pop-out"),setTimeout(()=>{if(e)e.setVisible(!1),v?.classList.remove("pop-out")},150)}async function C(n,o="Image Preview"){let t=re(n);if(b=t,!await se())try{if(!(await l.permissions.request(["ui_panels"],{reason:"Image Viewer needs permission to open floating image panels."})).includes("ui_panels"))return}catch(s){console.warn("[Image Viewer] ui_panels permission request rejected:",s);return}if(!le()||!e)return;if(V?.classList.add("active"),B?.classList.remove("active"),P)P.style.opacity="0";y();let u=new Image;u.onload=()=>{V?.classList.remove("active"),d=u.naturalWidth||600,g=u.naturalHeight||400,p=d/g,E=0,T=!1;let s=F(),M=window.innerWidth*0.85,k=window.innerHeight*0.85,f=Z(d,g,M,k,s,260);if(e.setSize(f.widgetWidth,f.widgetHeight),e.root.style.width=f.widgetWidth+"px",e.root.style.height=f.widgetHeight+"px",z)L(z);else{let j=Math.max(0,Math.round((window.innerWidth-f.widgetWidth)/2)),G=Math.max(0,Math.round((window.innerHeight-f.widgetHeight)/2));e.moveTo(j,G)}if(P)P.src=t,P.alt=o,P.style.opacity="1";W(),ne(),e.setVisible(!0),v?.classList.remove("pop-out"),v?.classList.add("pop-in")},u.onerror=()=>{V?.classList.remove("active"),B?.classList.add("active"),e?.setVisible(!0)},u.src=t}let ie=(n)=>{if(!e||!e.isVisible())return;let o=document.activeElement;if(o&&(o.tagName==="INPUT"||o.tagName==="TEXTAREA"||o.isContentEditable))return;switch(n.key){case"Escape":if(n.preventDefault(),I?.style.display!=="none"||S?.style.display!=="none")y();else O();break;case"+":case"=":n.preventDefault(),r=Math.min(10,Math.round(r*1.25*100)/100),w();break;case"-":case"_":n.preventDefault(),r=Math.max(0.2,Math.round(r/1.25*100)/100),w();break;case"0":n.preventDefault(),W();break;case"r":case"R":{if(n.preventDefault(),E=(E+90)%360,e&&v){let t=F(),i=Math.max(80,e.root.offsetHeight-t),u=U(),s=Z(Math.round(i*u),i,window.innerWidth*0.85,window.innerHeight*0.85,t,260);if(e.setSize(s.widgetWidth,s.widgetHeight),e.root.style.width=s.widgetWidth+"px",e.root.style.height=s.widgetHeight+"px",z)L(z)}w();break}case"h":case"H":n.preventDefault(),T=!T,w();break;case"l":case"L":n.preventDefault(),N();break}};document.addEventListener("keydown",ie);let oe=(n)=>{let o=n.target;if(!o)return;if(e&&e.root.contains(o))return;let t=o.tagName==="IMG"?o:o.closest("img");if(!t)return;let i=t.getAttribute("src");if(!i)return;let u=i.includes("/avatar")||!!t.closest(".avatar, [data-avatar], .portrait"),s=i.includes("/api/v1/images")||i.includes("/api/v1/image-gen")||!!t.closest(".attachment, [data-attachment]"),M=!!t.closest(".message-content, .chat-message, [data-message-id]"),k=t.naturalWidth>=32&&t.naturalHeight>=32;if(u||s||M||k)n.preventDefault(),n.stopPropagation(),C(i,t.alt||"Image Preview")};document.addEventListener("click",oe,!0);try{c=l.ui.registerInputBarAction({id:"view-character-avatar",label:"View Character Avatar",iconSvg:`
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="5"/>
          <path d="M20 21a8 8 0 1 0-16 0"/>
        </svg>
      `}),c.onClick(()=>{let n=l.getActiveChat?.();if(n?.characterId)C(`/api/v1/characters/${n.characterId}/avatar`,"Character Avatar");else{let o=document.querySelector('img[src*="/avatar"]');if(o?.src)C(o.src,"Avatar")}})}catch(n){console.debug("[Image Viewer] Input bar action registration skipped:",n)}let ce=l.events.on("PERMISSION_CHANGED",async(n)=>{let o=n;if(o?.permission==="ui_panels"){if(!o.granted&&e)e.destroy(),e=null}}),de={show:C,close:O,reset:W,setAnchor:L,toggleLock:N,resolveUrl:re};return window.__lumiverseImageViewer=de,window.testImageViewer=(n)=>{C(n||"https://picsum.photos/800/600")},console.log("[Image Viewer] Extension loaded with anchor presets and manual locking"),()=>{document.removeEventListener("keydown",ie),document.removeEventListener("click",oe,!0),ce?.(),c?.destroy(),e?.destroy(),x(),delete window.__lumiverseImageViewer,delete window.testImageViewer,console.log("[Image Viewer] Extension unloaded")}}export{me as calculateAnchorPosition,Z as calculateFitDimensions,pe as calculateResizeDimensions,re as resolveFullImageUrl,ve as setup};
