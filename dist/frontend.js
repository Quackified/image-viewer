function Fe(r){if(!r)return r;try{let c=r.startsWith("/"),s=typeof window<"u"?window.location.origin:"http://localhost",n=new URL(r,s);if(n.searchParams.has("size")){if(n.searchParams.delete("size"),c||typeof window<"u"&&n.origin===window.location.origin)return n.pathname+(n.search?n.search:"")+n.hash;return n.toString()}}catch{}return r}function _e(r,c,s,n,d=39,p=280){let o=r>0&&c>0?r/c:1,u=Math.max(80,n-d),f=Math.max(p,s),m=r,g=c;if(m>f||g>u){let L=Math.min(f/m,u/g);m=Math.round(m*L),g=Math.round(m/o)}if(m<p)m=p,g=Math.round(m/o);if(g>u)g=u,m=Math.round(g*o);return{viewportWidth:Math.round(m),viewportHeight:Math.round(g),widgetWidth:Math.round(m),widgetHeight:Math.round(g+d)}}function ze(r,c,s,n,d,p=39,o=280){let u=s>0?s:1,f=Math.max(o,r+c),m=Math.round(f/u);if(f>n)f=n,m=Math.round(f/u);if(m>d)m=d,f=Math.round(m*u);return{viewportWidth:Math.round(f),viewportHeight:Math.round(m),widgetWidth:Math.round(f),widgetHeight:Math.round(m+p)}}function nt(r,c,s,n,d,p=0){let o=p,u=p;switch(r){case"top-left":o=p,u=p;break;case"top-right":o=Math.max(0,n-c-p),u=p;break;case"center-left":o=p,u=Math.max(0,Math.round((d-s)/2));break;case"center-right":o=Math.max(0,n-c-p),u=Math.max(0,Math.round((d-s)/2));break;case"center":o=Math.max(0,Math.round((n-c)/2)),u=Math.max(0,Math.round((d-s)/2));break;case"bottom-left":o=p,u=Math.max(0,d-s-p);break;case"bottom-right":o=Math.max(0,n-c-p),u=Math.max(0,d-s-p);break}return{x:o,y:u}}function ve(r=document){if(!r.body)return 0;let c=r.createElement("div");c.style.cssText="position:fixed;top:0;left:0;width:0;visibility:hidden;pointer-events:none;height:var(--app-window-controls-overlay-top, 0px)",r.body.appendChild(c);let s=c.offsetHeight;return c.remove(),Number.isFinite(s)&&s>0?s:0}function ot(r,c,s,n,d,p,o=12){let u=Math.max(0,Math.min(r,Math.max(0,d-s))),f=Math.max(0,Math.min(c,Math.max(0,p-n))),m=Math.max(o,d-s-o),g=Math.max(o,p-n-o),L=Math.max(o,Math.min(u,m)),S=Math.max(o,Math.min(f,g));return{hostX:L,hostY:S,offsetX:u-L,offsetY:f-S}}var Ne=320,Ee=240;function it(r,c,s,n,d,p,o=16){let u=(g,L,S)=>{let y=Math.max(0,S-L),z=[[0,"start"],[y,"end"],[Math.round(y/2),"center"]],M=null;for(let[D,Y]of z){let P=Math.abs(g-D);if(P<=o&&(!M||P<M.dist))M={value:D,kind:Y,dist:P}}return M?{pos:M.value,kind:M.kind}:{pos:g,kind:null}},f=u(r,s,d),m=u(c,n,p);return{x:f.pos,y:m.pos,snapX:f.kind,snapY:m.kind}}function Oe(r,c,s,n,d,p,o=1){let u=Math.max(0,d-s),f=Math.max(0,p-n),m=Math.abs(r)<=o,g=Math.abs(r-u)<=o,L=Math.abs(c)<=o,S=Math.abs(c-f)<=o,y=Math.abs(r-Math.round(u/2))<=o,z=Math.abs(c-Math.round(f/2))<=o;if(m&&L)return"top-left";if(g&&L)return"top-right";if(m&&S)return"bottom-left";if(g&&S)return"bottom-right";if(m&&z)return"center-left";if(g&&z)return"center-right";if(y&&z)return"center";return null}function rt(r,c,s,n,d,p,o,u=39,f=Ne){let m=d>0?d:1,g=r.includes("w"),L=r.includes("n"),S=g?-s:s,y=(L?-n:n)*m,z=Math.max(S,y),M=c.x+c.viewportWidth,D=c.y+c.widgetHeight,Y=g?M:p-c.x,P=(L?D:o-c.y)-u,w=ze(c.viewportWidth,z,m,Math.max(1,Y),Math.max(1,P),u,f);return{...w,x:g?M-w.widgetWidth:c.x,y:L?D-w.widgetHeight:c.y}}function ce(r,c,s,n){let p=Math.max(Ee,Math.floor((c==="left"||c==="right"?s:n)*0.7));return Math.round(Math.min(p,Math.max(Ee,r)))}function at(r,c,s){let d=r==="left"||r==="right"?Math.min(520,Math.max(320,Math.round(c*0.3))):Math.min(520,Math.max(260,Math.round(s*0.38)));return ce(d,r,c,s)}function st(r,c,s,n,d=!1){let p=d?c:r,o=d?r:c;if(p<=0||o<=0||s<=0||n<=0)return 1;let u=Math.min(s/p,n/o);return u>0?1/u:1}var ct=`
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

    @keyframes ivPopIn {
      from { opacity: 0; transform: scale(0.92) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes ivPopOut {
      from { opacity: 1; transform: scale(1) translateY(0); }
      to { opacity: 0; transform: scale(0.92) translateY(8px); }
    }
    @keyframes ivSpin { to { transform: rotate(360deg); } }

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
      transition: box-shadow 0.12s;
    }

    .iv-container.pop-in { animation: ivPopIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .iv-container.pop-out { animation: ivPopOut 0.15s cubic-bezier(0.7, 0, 0.84, 0) forwards; }

    /* Magnetic-snap feedback while dragging a floating window */
    .iv-container.is-snapped {
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), inset 0 0 0 2px var(--lumiverse-accent, #38bdf8);
    }

    /* Docked: occupies layout space owned by the host, so no float chrome */
    .iv-container.is-docked {
      border-radius: 0;
      backdrop-filter: none;
      animation: none;
      box-shadow: none;
    }
    .iv-container.dock-right { border-left: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.12)); }
    .iv-container.dock-left { border-right: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.12)); }
    .iv-container.dock-top { border-bottom: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.12)); }
    .iv-container.dock-bottom { border-top: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.12)); }
    .iv-container.is-docked .iv-float-only { display: none !important; }

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
    .iv-container.is-moving .iv-toolbar { cursor: grabbing; }
    .iv-container.is-locked .iv-toolbar { cursor: nwse-resize; }
    .iv-container.is-docked .iv-toolbar { cursor: default; }

    .iv-toolbar-group { display: flex; align-items: center; gap: 2px; }

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
    .iv-btn:hover { opacity: 1; background: var(--lumiverse-border, rgba(255, 255, 255, 0.12)); }
    .iv-btn:active { transform: scale(0.94); }
    .iv-btn.active {
      color: var(--lumiverse-accent, #38bdf8);
      background: rgba(56, 189, 248, 0.15);
      opacity: 1;
    }
    .iv-btn-close { font-size: 16px; line-height: 1; }
    .iv-btn-close:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

    .iv-zoom-pill {
      min-width: 34px;
      text-align: center;
      box-sizing: border-box;
      font-size: 11px;
      font-variant-numeric: tabular-nums;
      padding: 2px 4px;
      color: var(--lumiverse-text-muted, #94a3b8);
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid transparent;
      transition: color 0.15s, background 0.15s;
    }
    .iv-zoom-pill:hover { color: var(--lumiverse-text, #fff); background: var(--lumiverse-border, rgba(255, 255, 255, 0.08)); }

    /* Pan/zoom lock dims the controls that would otherwise do nothing */
    .iv-container.is-image-locked .iv-zoom-ctl { opacity: 0.3; cursor: not-allowed; }
    .iv-container.is-image-locked .iv-zoom-ctl:hover { background: transparent; }

    /* Dropdown Menus */
    .iv-menu {
      position: absolute;
      top: 42px;
      right: 6px;
      min-width: 190px;
      max-height: calc(100% - 48px);
      overflow-y: auto;
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
      padding: 4px 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .iv-menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
    .iv-anchor-grid button:last-child:nth-child(odd) { grid-column: span 2; }
    .iv-mode-grid button[data-mode="float"] { grid-column: span 2; }

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
    .iv-menu-btn:hover { background: var(--lumiverse-border, rgba(255, 255, 255, 0.15)); color: #fff; }
    .iv-menu-btn.active {
      color: var(--lumiverse-accent, #38bdf8);
      border-color: var(--lumiverse-accent, #38bdf8);
      background: rgba(56, 189, 248, 0.12);
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
    .iv-menu-item:hover { background: var(--lumiverse-border, rgba(255, 255, 255, 0.15)); color: #fff; }
    .iv-menu-icon { font-size: 13px; width: 16px; text-align: center; }
    .iv-menu-divider { height: 1px; background: var(--lumiverse-border, rgba(255, 255, 255, 0.08)); margin: 4px 0; }

    /* Main Viewport Area. container-type lets the rotated image size itself in cq units. */
    .iv-viewport {
      flex: 1;
      min-height: 0;
      min-width: 0;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      container-type: size;
      background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.03) 75%);
      background-size: 16px 16px;
      background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
    }
    .iv-viewport.panning { cursor: grabbing; }
    .iv-viewport.is-image-locked { cursor: default; touch-action: none; }
    /* Pan locked: grabbing anywhere moves the window instead (unless position is locked too) */
    .iv-container:not(.is-docked):not(.is-locked) .iv-viewport.is-image-locked { cursor: grab; }
    .iv-container.is-moving .iv-viewport.is-image-locked { cursor: grabbing; }

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
    /* A 90/270deg image is laid out with swapped box dimensions so, once rotated, it fills the viewport */
    .iv-img-wrapper.is-side .iv-img {
      width: 100cqh;
      height: 100cqw;
      flex: none;
      max-width: none;
    }

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
    .iv-spinner.active { display: block; }

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
    .iv-error.active { display: block; }

    /* Resize handles (floating only). SE carries the visible grip; the others are invisible hit areas. */
    .iv-corner { position: absolute; z-index: 30; touch-action: none; }
    .iv-corner-nw { top: 0; left: 0; width: 8px; height: 8px; cursor: nwse-resize; }
    .iv-corner-ne { top: 0; right: 0; width: 8px; height: 8px; cursor: nesw-resize; }
    .iv-corner-sw { bottom: 0; left: 0; width: 14px; height: 14px; cursor: nesw-resize; }
    .iv-container.is-locked .iv-corner-nw,
    .iv-container.is-locked .iv-corner-ne,
    .iv-container.is-locked .iv-corner-sw { pointer-events: none; }
    .iv-container.is-docked .iv-corner { display: none; }

    .image-viewer-resize {
      bottom: 0;
      right: 0;
      width: 22px;
      height: 22px;
      cursor: se-resize;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    .image-viewer-resize:hover { opacity: 1; }
    .image-viewer-resize::after {
      content: '';
      position: absolute;
      bottom: 3px;
      right: 3px;
      width: 12px;
      height: 12px;
      background: repeating-linear-gradient(-45deg, var(--lumiverse-text, #fff), var(--lumiverse-text, #fff) 1px, transparent 1px, transparent 4px);
      mask-image: linear-gradient(to top left, #000 50%, transparent 50%);
      -webkit-mask-image: linear-gradient(to top left, #000 50%, transparent 50%);
    }

    /* Dock splitter on the panel's inner edge */
    .iv-dock-resizer { display: none; position: absolute; z-index: 40; touch-action: none; background: transparent; transition: background 0.15s; }
    .iv-dock-resizer:hover, .iv-dock-resizer.is-active { background: var(--lumiverse-accent, #38bdf8); opacity: 0.55; }
    .iv-container.is-docked .iv-dock-resizer { display: block; }
    .iv-container.dock-right .iv-dock-resizer { left: 0; top: 0; bottom: 0; width: 5px; cursor: ew-resize; }
    .iv-container.dock-left .iv-dock-resizer { right: 0; top: 0; bottom: 0; width: 5px; cursor: ew-resize; }
    .iv-container.dock-top .iv-dock-resizer { bottom: 0; left: 0; right: 0; height: 5px; cursor: ns-resize; }
    .iv-container.dock-bottom .iv-dock-resizer { top: 0; left: 0; right: 0; height: 5px; cursor: ns-resize; }

    @media (prefers-reduced-motion: reduce) {
      .iv-container.pop-in, .iv-container.pop-out, .iv-menu { animation: none; }
      .iv-container.pop-out { opacity: 0; }
    }
`,Be="image_viewer_prefs_v1",lt=["dock-left","dock-right","dock-top","dock-bottom"];function dt(){let r={mode:"float",lastDock:"dock-right",dockSizes:{},positionLocked:!1,anchor:null};try{let c=localStorage.getItem(Be);if(!c)return r;let s=JSON.parse(c),n=(d)=>d==="float"||lt.includes(d);return{mode:n(s.mode)?s.mode:r.mode,lastDock:n(s.lastDock)&&s.lastDock!=="float"?s.lastDock:r.lastDock,dockSizes:s.dockSizes&&typeof s.dockSizes==="object"?s.dockSizes:{},positionLocked:s.positionLocked===!0,anchor:["top-left","top-right","center-left","center-right","center","bottom-left","bottom-right"].includes(s.anchor)?s.anchor:null}}catch{return r}}function ut(r){try{localStorage.setItem(Be,JSON.stringify(r))}catch{}}var se=(r)=>r==="float"?null:r.slice(5);function mt(r){let c=r.dom.addStyle(ct),s=dt(),n=null,d=null,p=null,o=s.mode,u=!1,f=null,m="",g=600,L=400,S=1,y=1,z=0,M=0,D=0,Y=!1,P=s.positionLocked,w=!0,C=s.anchor,B=0,U=0,_=ve(),E=()=>Math.max(0,window.innerHeight-_),H=440,T=340,l=null,q=null,h=null,le=null,A=null,de=null,be=null,fe=null,j=null,K=null,G=null,Z=!1,Ie=0,Pe=0,J=null,X=null,Ue=39,O=()=>ut({mode:o,lastDock:o!=="float"?o:s.lastDock,dockSizes:s.dockSizes,positionLocked:P,anchor:C});function ue(){return q&&q.offsetHeight>0?q.offsetHeight:Ue}let Q=()=>Math.min(Ne,window.innerWidth);async function $e(){try{return(await r.permissions.getGranted()).includes("ui_panels")}catch{return!0}}function Se(){return D%180!==0?1/(S||1):S||1}function De(){return D%180!==0?{w:L,h:g}:{w:g,h:L}}function V(){if(!le)return;let e=Y?-1:1;if(le.classList.toggle("is-side",D%180!==0),le.style.transform=`translate(${z}px, ${M}px) scale(${y}) rotate(${D}deg) scaleX(${e})`,fe)fe.textContent=y===1&&z===0&&M===0?"Fit":`${Math.round(y*100)}%`}function ee(){y=1,z=0,M=0,V()}function me(e){if(w)return;y=Math.min(10,Math.max(0.2,Math.round(y*e*100)/100)),V()}function He(){if(w)return;if(y===1&&z===0&&M===0){if(!h)return;let e=De(),t=st(e.w,e.h,h.clientWidth,h.clientHeight,!1);y=t>1.05?Math.min(10,Math.round(t*100)/100):2,V()}else ee()}function I(){if(K)K.style.display="none";if(G)G.style.display="none"}let je=()=>K?.style.display==="flex"||G?.style.display==="flex";function ge(e){P=typeof e==="boolean"?e:!P,he(),O()}function he(){l?.classList.toggle("is-locked",P);let e=l?.querySelector(".iv-lock-status-icon"),t=l?.querySelector(".iv-lock-status-text");if(e)e.textContent=P?"\uD83D\uDD12":"\uD83D\uDCCC";if(t)t.textContent=P?"Unlock Position":"Lock Position"}function xe(e){if(w=typeof e==="boolean"?e:!w,w)Z=!1,h?.classList.remove("panning");ke()}function ke(){if(h?.classList.toggle("is-image-locked",w),l?.classList.toggle("is-image-locked",w),j)j.textContent=w?"\uD83D\uDD12":"✋",j.title=w?"Pan & zoom locked - click to unlock (P)":"Pan & zoom unlocked - click to lock (P)",j.classList.toggle("active",!w)}function te(e,t){if(!n)return;H=e,T=t,n.setSize(e,t),n.root.style.width=e+"px",n.root.style.height=t+"px"}function F(e,t){if(!n)return;let i=ot(e,t,H,T,window.innerWidth,E(),12);B=i.hostX+i.offsetX,U=i.hostY+i.offsetY,n.moveTo(i.hostX,i.hostY+_),n.root.style.transform=i.offsetX!==0||i.offsetY!==0?`translate3d(${i.offsetX}px, ${i.offsetY}px, 0)`:""}function ne(e){if(!n)return;C=e;let{x:t,y:i}=nt(e,H,T,window.innerWidth,E(),0);F(t,i)}function Te(){if(C)ne(C);else F(B,U)}function Ce(e){if(!n)return;let t=De(),i=_e(t.w,t.h,window.innerWidth*0.85,E()*0.85,ue(),Q());if(te(i.widgetWidth,i.widgetHeight),C)ne(C);else if(e)F(B,U);else F(Math.max(0,Math.round((window.innerWidth-H)/2)),Math.max(0,Math.round((E()-T)/2)))}function We(){if(D=(D+90)%360,o==="float"&&n){let e=ue(),t=H,i=Math.max(80,T-e),x=_e(i,t,window.innerWidth*0.9,E()*0.9,e,Q());te(x.widgetWidth,x.widgetHeight),Te()}V()}function Ke(){if(!n)return;let e=ue(),t=Se();if(H>window.innerWidth||T>E()){let i=ze(H,0,t,window.innerWidth,Math.max(80,E()-e),e,Q());te(i.widgetWidth,i.widgetHeight)}Te()}function Ge(){if(C=null,o!=="float")re("float");else Ce(!1);I(),O()}function we(e,t,i,x="se"){if(o!=="float"||!n||e.button!==0)return;_=ve(),e.preventDefault(),e.stopPropagation(),J={kind:i,corner:x,pointerId:e.pointerId,el:t,startX:e.clientX,startY:e.clientY,startLX:B,startLY:U,startVW:H,startWH:T,ar:Se(),anchor:C};try{t.setPointerCapture(e.pointerId)}catch{}l?.classList.add(i==="move"?"is-moving":"is-resizing")}function Ze(e){let t=J;if(!t||!n||e.pointerId!==t.pointerId)return;let i=e.clientX-t.startX,x=e.clientY-t.startY,a=window.innerWidth,v=E(),b=ue();if(t.kind==="move"){let k=t.startLX+i,R=t.startLY+x,W=!1;if(!e.shiftKey){let N=it(k,R,H,T,a,v,16);k=N.x,R=N.y,W=!!(N.snapX||N.snapY)}l?.classList.toggle("is-snapped",W),F(k,R)}else if(t.kind==="toolbar-resize"){let k=Math.abs(i)>=Math.abs(x)?i:x,R=t.anchor?a:a-t.startLX,W=(t.anchor?v:v-t.startLY)-b,N=ze(t.startVW,k,t.ar,R,W,b,Q());if(te(N.widgetWidth,N.widgetHeight),t.anchor)ne(t.anchor);else F(t.startLX,t.startLY)}else{let k=rt(t.corner,{x:t.startLX,y:t.startLY,viewportWidth:t.startVW,widgetHeight:t.startWH},i,x,t.ar,a,v,b,Q());te(k.widgetWidth,k.widgetHeight),F(k.x,k.y)}}function ye(e){let t=J;if(!t||e.pointerId!==t.pointerId)return;J=null,l?.classList.remove("is-moving","is-resizing","is-snapped");try{if(t.el.hasPointerCapture(e.pointerId))t.el.releasePointerCapture(e.pointerId)}catch{}C=Oe(B,U,H,T,window.innerWidth,E()),O()}function Me(e){e.addEventListener("pointermove",Ze),e.addEventListener("pointerup",ye),e.addEventListener("pointercancel",ye),e.addEventListener("lostpointercapture",ye)}function Je(){if(n)return!0;try{n=r.ui.createFloatWidget({width:H,height:T,initialPosition:{x:Math.max(0,Math.round((window.innerWidth-H)/2)),y:_+Math.max(0,Math.round((E()-T)/2))},snapToEdge:!1,tooltip:"Image Viewer",chromeless:!0})}catch(e){return console.error("[Image Viewer] Failed to create float widget:",e),!1}return n.setVisible(!1),n.onDragEnd((e)=>{C=null,F(e.x,e.y-_),C=Oe(B,U,H,T,window.innerWidth,E())}),!0}function Ye(e){return ce(s.dockSizes[e]??at(e,window.innerWidth,E()),e,window.innerWidth,E())}function oe(){if(!d)return;l?.remove();try{d.destroy()}catch{}d=null}function pe(){if(!l)return;let e=se(o);l.classList.toggle("is-docked",!!e);for(let t of["left","right","top","bottom"])l.classList.toggle("dock-"+t,e===t);l.querySelectorAll("[data-mode]").forEach((t)=>{t.classList.toggle("active",t.dataset.mode===o)})}function ie(e){if(!l)return!1;if(f)clearTimeout(f),f=null;let t=se(o);if(_=ve(),!t){if(oe(),!Je()||!n)return!1;let i=n.isVisible()&&u;if(l.parentElement!==n.root)n.root.appendChild(l);if(pe(),l.classList.remove("pop-out"),Ce(i),n.setVisible(!0),e)l.classList.remove("pop-in"),l.offsetWidth,l.classList.add("pop-in")}else{if(n?.isVisible())n.setVisible(!1);if(typeof r.ui.requestDockPanel!=="function")return console.warn("[Image Viewer] This Lumiverse build has no dock panel API; staying in float mode"),o="float",ie(e);if(!d){try{d=r.ui.requestDockPanel({edge:t,title:"Image Viewer",size:Ye(t),minSize:Ee,maxSize:ce(1/0,t,window.innerWidth,E()),resizable:!1,chromeless:!0})}catch(i){return console.warn("[Image Viewer] Dock panel unavailable, falling back to float:",i),o="float",ie(e)}d.root.style.cssText="display:flex;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;",d.onVisibilityChange((i)=>{u=i})}if(l.classList.remove("pop-in","pop-out"),l.parentElement!==d.root)d.root.appendChild(l);pe(),d.expand()}return u=!0,!0}function re(e){if(e===o&&u){I();return}let t=o;if(o=e,o!=="float")s.lastDock=o;if(u){if(t!==o)oe();if(!ie(!1))o=t}else pe();I(),O()}function Ae(){re(o==="float"?s.lastDock:"float")}function Le(){if(!u||!l)return;if(I(),u=!1,J=null,o==="float"&&n)l.classList.remove("pop-in"),l.classList.add("pop-out"),f=setTimeout(()=>{if(f=null,!u&&n)n.setVisible(!1),l?.classList.remove("pop-out")},150);else oe()}function Qe(){if(l)return;let e=document.createElement("div");if(e.style.cssText="display:contents;",e.innerHTML=`
      <div class="iv-container">
        <div class="iv-toolbar">
          <div class="iv-toolbar-group">
            <button class="iv-btn iv-zoom-ctl" data-action="zoom-out" title="Zoom Out (-)">−</button>
            <span class="iv-zoom-pill iv-zoom-ctl" data-action="zoom-toggle" title="Click: Fit / 100% (0)">Fit</span>
            <button class="iv-btn iv-zoom-ctl" data-action="zoom-in" title="Zoom In (+)">+</button>
            <button class="iv-btn" data-action="rotate" title="Rotate 90° (R)">↻</button>
            <button class="iv-btn" data-action="flip" title="Flip Horizontal (H)">⇄</button>
          </div>
          <div class="iv-toolbar-group">
            <button class="iv-btn iv-btn-imglock" data-action="toggle-image-lock" title="Pan & zoom locked - click to unlock (P)">\uD83D\uDD12</button>
            <button class="iv-btn" data-action="layout-menu" title="Layout, docking & anchors (D toggles dock)">⊞</button>
            <button class="iv-btn" data-action="more-menu" title="More options">⋮</button>
            <button class="iv-btn iv-btn-close" data-action="close" title="Close (Esc)">×</button>
          </div>
        </div>

        <div class="iv-menu iv-layout-menu" style="display: none;">
          <div class="iv-menu-header">Mode</div>
          <div class="iv-menu-grid iv-mode-grid">
            <button class="iv-menu-btn" data-action="set-mode" data-mode="float" title="Free-floating window">▢ Float</button>
            <button class="iv-menu-btn" data-action="set-mode" data-mode="dock-left" title="Dock left of the chat">◧ Dock Left</button>
            <button class="iv-menu-btn" data-action="set-mode" data-mode="dock-right" title="Dock right of the chat">◨ Dock Right</button>
            <button class="iv-menu-btn" data-action="set-mode" data-mode="dock-top" title="Dock above the chat">⬒ Dock Top</button>
            <button class="iv-menu-btn" data-action="set-mode" data-mode="dock-bottom" title="Dock below the chat">⬓ Dock Bottom</button>
          </div>
          <div class="iv-float-only">
            <div class="iv-menu-divider"></div>
            <div class="iv-menu-header">Anchor</div>
            <div class="iv-menu-grid iv-anchor-grid">
              <button class="iv-menu-btn" data-action="anchor" data-anchor="top-left">↖ Top Left</button>
              <button class="iv-menu-btn" data-action="anchor" data-anchor="top-right">↗ Top Right</button>
              <button class="iv-menu-btn" data-action="anchor" data-anchor="center-left">← Center Left</button>
              <button class="iv-menu-btn" data-action="anchor" data-anchor="center-right">→ Center Right</button>
              <button class="iv-menu-btn" data-action="anchor" data-anchor="bottom-left">↙ Bottom Left</button>
              <button class="iv-menu-btn" data-action="anchor" data-anchor="bottom-right">↘ Bottom Right</button>
              <button class="iv-menu-btn" data-action="anchor" data-anchor="center">✛ Center</button>
            </div>
            <div class="iv-menu-divider"></div>
            <button class="iv-menu-item" data-action="toggle-lock" title="Locked: toolbar drag resizes instead of moving (L)">
              <span class="iv-menu-icon iv-lock-status-icon">\uD83D\uDCCC</span>
              <span class="iv-lock-status-text">Lock Position</span>
            </button>
            <button class="iv-menu-item" data-action="reset-window">
              <span class="iv-menu-icon">⟲</span>
              <span>Reset Window</span>
            </button>
          </div>
        </div>

        <div class="iv-menu iv-more-menu" style="display: none;">
          <button class="iv-menu-item" data-action="copy-url">
            <span class="iv-menu-icon">\uD83D\uDCCB</span>
            <span class="iv-copy-label">Copy Image Link</span>
          </button>
          <button class="iv-menu-item" data-action="open-tab">
            <span class="iv-menu-icon">↗</span>
            <span>Open in New Tab</span>
          </button>
          <button class="iv-menu-item" data-action="download">
            <span class="iv-menu-icon">⬇</span>
            <span>Download Image</span>
          </button>
        </div>

        <div class="iv-viewport">
          <div class="iv-spinner"></div>
          <div class="iv-error">Failed to load image</div>
          <div class="iv-img-wrapper">
            <img class="iv-img" src="" alt="Preview" draggable="false" />
          </div>
        </div>

        <div class="iv-corner iv-corner-nw" data-corner="nw"></div>
        <div class="iv-corner iv-corner-ne" data-corner="ne"></div>
        <div class="iv-corner iv-corner-sw" data-corner="sw"></div>
        <div class="iv-corner image-viewer-resize" data-corner="se" title="Resize"></div>
        <div class="iv-dock-resizer" title="Drag to resize"></div>
      </div>
    `,l=e.firstElementChild,l.remove(),q=l.querySelector(".iv-toolbar"),h=l.querySelector(".iv-viewport"),le=l.querySelector(".iv-img-wrapper"),A=l.querySelector(".iv-img"),de=l.querySelector(".iv-spinner"),be=l.querySelector(".iv-error"),fe=l.querySelector(".iv-zoom-pill"),j=l.querySelector(".iv-btn-imglock"),K=l.querySelector(".iv-layout-menu"),G=l.querySelector(".iv-more-menu"),q?.addEventListener("pointerdown",(a)=>{if(a.target.closest("button, input, select, .iv-zoom-pill, .iv-menu"))return;if(o!=="float")return;we(a,q,P?"toolbar-resize":"move")}),q)Me(q);l.querySelectorAll(".iv-corner").forEach((a)=>{a.addEventListener("pointerdown",(v)=>{we(v,a,"corner",a.dataset.corner||"se")}),Me(a)}),l.addEventListener("click",(a)=>{let v=a.target.closest("[data-action]");if(!v)return;switch(v.getAttribute("data-action")){case"zoom-in":me(1.25);break;case"zoom-out":me(0.8);break;case"zoom-toggle":He();break;case"rotate":We();break;case"flip":Y=!Y,V();break;case"layout-menu":case"more-menu":{let b=v.getAttribute("data-action")==="layout-menu"?K:G;if(!b)break;let k=b.style.display==="flex";I(),b.style.display=k?"none":"flex";break}case"set-mode":re(v.dataset.mode||"float");break;case"anchor":ne(v.dataset.anchor),O(),I();break;case"toggle-lock":ge(),I();break;case"reset-window":Ge();break;case"toggle-image-lock":xe(),I();break;case"copy-url":if(m)navigator.clipboard.writeText(new URL(m,window.location.origin).toString()).then(()=>{let b=v.querySelector(".iv-copy-label");if(b)b.textContent="✓ Copied!";setTimeout(()=>{if(b)b.textContent="Copy Image Link";I()},800)}).catch(()=>I());break;case"open-tab":if(m)window.open(m,"_blank","noopener,noreferrer"),I();break;case"download":if(m){let b=document.createElement("a");b.href=m,b.download="",b.rel="noopener",document.body.appendChild(b),b.click(),b.remove(),I()}break;case"close":Le();break}}),h?.addEventListener("wheel",(a)=>{if(w||!h)return;a.preventDefault();let v=h.getBoundingClientRect(),b=a.clientX-v.left-v.width/2,k=a.clientY-v.top-v.height/2,R=a.deltaY<0?1.15:0.8695652173913044,W=Math.min(10,Math.max(0.2,y*R));z=b-(b-z)*W/y,M=k-(k-M)*W/y,y=Math.round(W*1000)/1000,V()},{passive:!1}),h?.addEventListener("pointerdown",(a)=>{if(a.button!==0||!h)return;if(w){if(o==="float")if(!P)we(a,h,"move");else a.preventDefault();return}a.preventDefault(),Z=!0,Ie=a.clientX-z,Pe=a.clientY-M,h.classList.add("panning"),h.setPointerCapture(a.pointerId)}),h?.addEventListener("pointermove",(a)=>{if(!Z||w)return;z=a.clientX-Ie,M=a.clientY-Pe,V()});let t=(a)=>{if(!Z)return;Z=!1,h?.classList.remove("panning");try{if(h?.hasPointerCapture(a.pointerId))h.releasePointerCapture(a.pointerId)}catch{}};if(h?.addEventListener("pointerup",t),h?.addEventListener("pointercancel",t),h?.addEventListener("lostpointercapture",t),h)Me(h);h?.addEventListener("dblclick",(a)=>{if(w||!h)return;if(y===1&&z===0&&M===0){let v=h.getBoundingClientRect(),b=a.clientX-v.left-v.width/2,k=a.clientY-v.top-v.height/2;y=2,z=b-b*2,M=k-k*2}else ee();V()});let i=l.querySelector(".iv-dock-resizer");i?.addEventListener("pointerdown",(a)=>{let v=se(o);if(!v||!d||a.button!==0)return;a.preventDefault(),a.stopPropagation(),X={pointerId:a.pointerId,startX:a.clientX,startY:a.clientY,startSize:Ye(v)},i.classList.add("is-active"),i.setPointerCapture(a.pointerId)}),i?.addEventListener("pointermove",(a)=>{let v=se(o);if(!X||!v||!d||a.pointerId!==X.pointerId)return;let b=a.clientX-X.startX,k=a.clientY-X.startY,R=v==="left"?b:v==="right"?-b:v==="top"?k:-k,W=ce(X.startSize+R,v,window.innerWidth,E());s.dockSizes[v]=W,d.setSize(W)});let x=(a)=>{if(!X||a.pointerId!==X.pointerId)return;X=null,i?.classList.remove("is-active");try{if(i?.hasPointerCapture(a.pointerId))i.releasePointerCapture(a.pointerId)}catch{}O()};i?.addEventListener("pointerup",x),i?.addEventListener("pointercancel",x),i?.addEventListener("lostpointercapture",x),he(),ke(),pe()}let Xe=(e)=>{if(l&&!l.contains(e.target))I()};document.addEventListener("pointerdown",Xe);async function ae(e,t="Image Preview"){let i=Fe(e);if(m=i,!await $e())try{if(!(await r.permissions.request(["ui_panels"],{reason:"Image Viewer needs permission to open floating image panels."})).includes("ui_panels"))return}catch(a){console.warn("[Image Viewer] ui_panels permission request rejected:",a);return}if(Qe(),!l)return;if(de?.classList.add("active"),be?.classList.remove("active"),A)A.style.opacity="0";I();let x=new Image;x.onload=()=>{if(m!==i)return;if(de?.classList.remove("active"),g=x.naturalWidth||600,L=x.naturalHeight||400,S=g/L,D=0,Y=!1,A)A.src=i,A.alt=t,A.style.opacity="1";if(ee(),he(),ke(),!ie(!u))console.error("[Image Viewer] Could not mount viewer")},x.onerror=()=>{if(m!==i)return;if(de?.classList.remove("active"),be?.classList.add("active"),A)A.style.opacity="0";ie(!u)},x.src=i}let Ve=(e)=>{if(!u)return;if(e.ctrlKey||e.metaKey||e.altKey)return;let t=document.activeElement;if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable))return;switch(e.key){case"Escape":if(e.preventDefault(),je())I();else Le();break;case"+":case"=":if(!w)e.preventDefault(),me(1.25);break;case"-":case"_":if(!w)e.preventDefault(),me(0.8);break;case"0":if(!w)e.preventDefault(),ee();break;case"1":if(!w)e.preventDefault(),He();break;case"r":case"R":e.preventDefault(),We();break;case"h":case"H":e.preventDefault(),Y=!Y,V();break;case"l":case"L":if(o==="float")e.preventDefault(),ge();break;case"p":case"P":e.preventDefault(),xe();break;case"d":case"D":e.preventDefault(),Ae();break}};document.addEventListener("keydown",Ve);let Re=(e)=>{let t=e.target;if(!t)return;if(l&&l.contains(t))return;let i=t.tagName==="IMG"?t:t.closest("img");if(!i)return;let x=i.getAttribute("src");if(!x)return;let a=x.includes("/avatar")||!!i.closest(".avatar, [data-avatar], .portrait"),v=x.includes("/api/v1/images")||x.includes("/api/v1/image-gen")||!!i.closest(".attachment, [data-attachment]"),b=!!i.closest(".message-content, .chat-message, [data-message-id]"),k=i.naturalWidth>=32&&i.naturalHeight>=32;if(a||v||b||k)e.preventDefault(),e.stopPropagation(),ae(x,i.alt||"Image Preview")};document.addEventListener("click",Re,!0);let qe=()=>{if(_=ve(),!u)return;let e=se(o);if(!e)Ke();else if(d)d.setMaxSize(ce(1/0,e,window.innerWidth,E()))};window.addEventListener("resize",qe);try{p=r.ui.registerInputBarAction({id:"view-character-avatar",label:"View Character Avatar",iconSvg:`
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="5"/>
          <path d="M20 21a8 8 0 1 0-16 0"/>
        </svg>
      `}),p.onClick(()=>{let e=r.getActiveChat?.();if(e?.characterId)ae(`/api/v1/characters/${e.characterId}/avatar`,"Character Avatar");else{let t=document.querySelector('img[src*="/avatar"]');if(t?.src)ae(t.src,"Avatar")}})}catch(e){console.debug("[Image Viewer] Input bar action registration skipped:",e)}let et=r.events.on("PERMISSION_CHANGED",async(e)=>{let t=e;if(t?.permission==="ui_panels"&&!t.granted)oe(),n?.destroy(),n=null,u=!1}),tt={show:ae,close:Le,reset:ee,setAnchor:(e)=>{if(o!=="float")re("float");ne(e),O()},setMode:re,toggleDock:Ae,toggleLock:ge,toggleImageLock:xe,resolveUrl:Fe};return window.__lumiverseImageViewer=tt,window.testImageViewer=(e)=>{ae(e||"https://picsum.photos/800/600")},console.log("[Image Viewer] Extension loaded"),()=>{if(document.removeEventListener("keydown",Ve),document.removeEventListener("click",Re,!0),document.removeEventListener("pointerdown",Xe),window.removeEventListener("resize",qe),f)clearTimeout(f);et?.(),p?.destroy(),oe(),n?.destroy(),c(),delete window.__lumiverseImageViewer,delete window.testImageViewer,console.log("[Image Viewer] Extension unloaded")}}export{Ee as DOCK_MIN_SIZE,Ne as MIN_VIEWPORT_WIDTH,st as calculateActualSizeScale,nt as calculateAnchorPosition,rt as calculateCornerResize,ot as calculateEdgeFlushPlacement,_e as calculateFitDimensions,ze as calculateResizeDimensions,ce as clampDockSize,at as defaultDockSize,Oe as detectAnchor,ve as measureTopInset,Fe as resolveFullImageUrl,mt as setup,it as snapPosition};
