function Ve(a){if(!a)return a;try{let u=a.startsWith("/"),s=typeof window<"u"?window.location.origin:"http://localhost",n=new URL(a,s);if(n.searchParams.has("size")){if(n.searchParams.delete("size"),u||typeof window<"u"&&n.origin===window.location.origin)return n.pathname+(n.search?n.search:"")+n.hash;return n.toString()}}catch{}return a}function Re(a,u,s,n,l=39,p=280){let o=a>0&&u>0?a/u:1,d=Math.max(80,n-l),f=Math.max(p,s),m=a,g=u;if(m>f||g>d){let L=Math.min(f/m,d/g);m=Math.round(m*L),g=Math.round(m/o)}if(m<p)m=p,g=Math.round(m/o);if(g>d)g=d,m=Math.round(g*o);return{viewportWidth:Math.round(m),viewportHeight:Math.round(g),widgetWidth:Math.round(m),widgetHeight:Math.round(g+l)}}function ye(a,u,s,n,l,p=39,o=280){let d=s>0?s:1,f=Math.max(o,a+u),m=Math.round(f/d);if(f>n)f=n,m=Math.round(f/d);if(m>l)m=l,f=Math.round(m*d);return{viewportWidth:Math.round(f),viewportHeight:Math.round(m),widgetWidth:Math.round(f),widgetHeight:Math.round(m+p)}}function Qe(a,u,s,n,l,p=0){let o=p,d=p;switch(a){case"top-left":o=p,d=p;break;case"top-right":o=Math.max(0,n-u-p),d=p;break;case"center-left":o=p,d=Math.max(0,Math.round((l-s)/2));break;case"center-right":o=Math.max(0,n-u-p),d=Math.max(0,Math.round((l-s)/2));break;case"center":o=Math.max(0,Math.round((n-u)/2)),d=Math.max(0,Math.round((l-s)/2));break;case"bottom-left":o=p,d=Math.max(0,l-s-p);break;case"bottom-right":o=Math.max(0,n-u-p),d=Math.max(0,l-s-p);break}return{x:o,y:d}}function et(a,u,s,n,l,p,o=12){let d=Math.max(0,Math.min(a,Math.max(0,l-s))),f=Math.max(0,Math.min(u,Math.max(0,p-n))),m=Math.max(o,l-s-o),g=Math.max(o,p-n-o),L=Math.max(o,Math.min(d,m)),P=Math.max(o,Math.min(f,g));return{hostX:L,hostY:P,offsetX:d-L,offsetY:f-P}}var Fe=320,Me=240;function tt(a,u,s,n,l,p,o=16){let d=(g,L,P)=>{let y=Math.max(0,P-L),z=[[0,"start"],[y,"end"],[Math.round(y/2),"center"]],M=null;for(let[H,W]of z){let I=Math.abs(g-H);if(I<=o&&(!M||I<M.dist))M={value:H,kind:W,dist:I}}return M?{pos:M.value,kind:M.kind}:{pos:g,kind:null}},f=d(a,s,l),m=d(u,n,p);return{x:f.pos,y:m.pos,snapX:f.kind,snapY:m.kind}}function qe(a,u,s,n,l,p,o=1){let d=Math.max(0,l-s),f=Math.max(0,p-n),m=Math.abs(a)<=o,g=Math.abs(a-d)<=o,L=Math.abs(u)<=o,P=Math.abs(u-f)<=o,y=Math.abs(a-Math.round(d/2))<=o,z=Math.abs(u-Math.round(f/2))<=o;if(m&&L)return"top-left";if(g&&L)return"top-right";if(m&&P)return"bottom-left";if(g&&P)return"bottom-right";if(m&&z)return"center-left";if(g&&z)return"center-right";if(y&&z)return"center";return null}function nt(a,u,s,n,l,p,o,d=39,f=Fe){let m=l>0?l:1,g=a.includes("w"),L=a.includes("n"),P=g?-s:s,y=(L?-n:n)*m,z=Math.max(P,y),M=u.x+u.viewportWidth,H=u.y+u.widgetHeight,W=g?M:p-u.x,I=(L?H:o-u.y)-d,x=ye(u.viewportWidth,z,m,Math.max(1,W),Math.max(1,I),d,f);return{...x,x:g?M-x.widgetWidth:u.x,y:L?H-x.widgetHeight:u.y}}function ae(a,u,s,n){let p=Math.max(Me,Math.floor((u==="left"||u==="right"?s:n)*0.7));return Math.round(Math.min(p,Math.max(Me,a)))}function ot(a,u,s){let l=a==="left"||a==="right"?Math.min(520,Math.max(320,Math.round(u*0.3))):Math.min(520,Math.max(260,Math.round(s*0.38)));return ae(l,a,u,s)}function it(a,u,s,n,l=!1){let p=l?u:a,o=l?a:u;if(p<=0||o<=0||s<=0||n<=0)return 1;let d=Math.min(s/p,n/o);return d>0?1/d:1}var rt=`
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
`,_e="image_viewer_prefs_v1",at=["dock-left","dock-right","dock-top","dock-bottom"];function st(){let a={mode:"float",lastDock:"dock-right",dockSizes:{},positionLocked:!1,anchor:null};try{let u=localStorage.getItem(_e);if(!u)return a;let s=JSON.parse(u),n=(l)=>l==="float"||at.includes(l);return{mode:n(s.mode)?s.mode:a.mode,lastDock:n(s.lastDock)&&s.lastDock!=="float"?s.lastDock:a.lastDock,dockSizes:s.dockSizes&&typeof s.dockSizes==="object"?s.dockSizes:{},positionLocked:s.positionLocked===!0,anchor:["top-left","top-right","center-left","center-right","center","bottom-left","bottom-right"].includes(s.anchor)?s.anchor:null}}catch{return a}}function ct(a){try{localStorage.setItem(_e,JSON.stringify(a))}catch{}}var re=(a)=>a==="float"?null:a.slice(5);function lt(a){let u=a.dom.addStyle(rt),s=st(),n=null,l=null,p=null,o=s.mode,d=!1,f=null,m="",g=600,L=400,P=1,y=1,z=0,M=0,H=0,W=!1,I=s.positionLocked,x=!0,T=s.anchor,O=0,N=0,S=440,D=340,c=null,R=null,h=null,se=null,Y=null,ce=null,me=null,pe=null,B=null,U=null,j=null,K=!1,Le=0,ze=0,G=null,A=null,Oe=39,F=()=>ct({mode:o,lastDock:o!=="float"?o:s.lastDock,dockSizes:s.dockSizes,positionLocked:I,anchor:T});function le(){return R&&R.offsetHeight>0?R.offsetHeight:Oe}let Z=()=>Math.min(Fe,window.innerWidth);async function Ne(){try{return(await a.permissions.getGranted()).includes("ui_panels")}catch{return!0}}function Ee(){return H%180!==0?1/(P||1):P||1}function Ie(){return H%180!==0?{w:L,h:g}:{w:g,h:L}}function X(){if(!se)return;let e=W?-1:1;if(se.classList.toggle("is-side",H%180!==0),se.style.transform=`translate(${z}px, ${M}px) scale(${y}) rotate(${H}deg) scaleX(${e})`,pe)pe.textContent=y===1&&z===0&&M===0?"Fit":`${Math.round(y*100)}%`}function J(){y=1,z=0,M=0,X()}function de(e){if(x)return;y=Math.min(10,Math.max(0.2,Math.round(y*e*100)/100)),X()}function Pe(){if(x)return;if(y===1&&z===0&&M===0){if(!h)return;let e=Ie(),t=it(e.w,e.h,h.clientWidth,h.clientHeight,!1);y=t>1.05?Math.min(10,Math.round(t*100)/100):2,X()}else J()}function E(){if(U)U.style.display="none";if(j)j.style.display="none"}let Be=()=>U?.style.display==="flex"||j?.style.display==="flex";function ve(e){I=typeof e==="boolean"?e:!I,be(),F()}function be(){c?.classList.toggle("is-locked",I);let e=c?.querySelector(".iv-lock-status-icon"),t=c?.querySelector(".iv-lock-status-text");if(e)e.textContent=I?"\uD83D\uDD12":"\uD83D\uDCCC";if(t)t.textContent=I?"Unlock Position":"Lock Position"}function fe(e){if(x=typeof e==="boolean"?e:!x,x)K=!1,h?.classList.remove("panning");ge()}function ge(){if(h?.classList.toggle("is-image-locked",x),c?.classList.toggle("is-image-locked",x),B)B.textContent=x?"\uD83D\uDD12":"✋",B.title=x?"Pan & zoom locked - click to unlock (P)":"Pan & zoom unlocked - click to lock (P)",B.classList.toggle("active",!x)}function Q(e,t){if(!n)return;S=e,D=t,n.setSize(e,t),n.root.style.width=e+"px",n.root.style.height=t+"px"}function q(e,t){if(!n)return;let i=et(e,t,S,D,window.innerWidth,window.innerHeight,12);O=i.hostX+i.offsetX,N=i.hostY+i.offsetY,n.moveTo(i.hostX,i.hostY),n.root.style.transform=i.offsetX!==0||i.offsetY!==0?`translate3d(${i.offsetX}px, ${i.offsetY}px, 0)`:""}function ee(e){if(!n)return;T=e;let{x:t,y:i}=Qe(e,S,D,window.innerWidth,window.innerHeight,0);q(t,i)}function He(){if(T)ee(T);else q(O,N)}function Se(e){if(!n)return;let t=Ie(),i=Re(t.w,t.h,window.innerWidth*0.85,window.innerHeight*0.85,le(),Z());if(Q(i.widgetWidth,i.widgetHeight),T)ee(T);else if(e)q(O,N);else q(Math.max(0,Math.round((window.innerWidth-S)/2)),Math.max(0,Math.round((window.innerHeight-D)/2)))}function De(){if(H=(H+90)%360,o==="float"&&n){let e=le(),t=S,i=Math.max(80,D-e),w=Re(i,t,window.innerWidth*0.9,window.innerHeight*0.9,e,Z());Q(w.widgetWidth,w.widgetHeight),He()}X()}function Ue(){if(!n)return;let e=le(),t=Ee();if(S>window.innerWidth||D>window.innerHeight){let i=ye(S,0,t,window.innerWidth,Math.max(80,window.innerHeight-e),e,Z());Q(i.widgetWidth,i.widgetHeight)}He()}function $e(){if(T=null,o!=="float")oe("float");else Se(!1);E(),F()}function he(e,t,i,w="se"){if(o!=="float"||!n||e.button!==0)return;e.preventDefault(),e.stopPropagation(),G={kind:i,corner:w,pointerId:e.pointerId,el:t,startX:e.clientX,startY:e.clientY,startLX:O,startLY:N,startVW:S,startWH:D,ar:Ee(),anchor:T};try{t.setPointerCapture(e.pointerId)}catch{}c?.classList.add(i==="move"?"is-moving":"is-resizing")}function je(e){let t=G;if(!t||!n||e.pointerId!==t.pointerId)return;let i=e.clientX-t.startX,w=e.clientY-t.startY,{innerWidth:r,innerHeight:v}=window,b=le();if(t.kind==="move"){let k=t.startLX+i,V=t.startLY+w,C=!1;if(!e.shiftKey){let _=tt(k,V,S,D,r,v,16);k=_.x,V=_.y,C=!!(_.snapX||_.snapY)}c?.classList.toggle("is-snapped",C),q(k,V)}else if(t.kind==="toolbar-resize"){let k=Math.abs(i)>=Math.abs(w)?i:w,V=t.anchor?r:r-t.startLX,C=(t.anchor?v:v-t.startLY)-b,_=ye(t.startVW,k,t.ar,V,C,b,Z());if(Q(_.widgetWidth,_.widgetHeight),t.anchor)ee(t.anchor);else q(t.startLX,t.startLY)}else{let k=nt(t.corner,{x:t.startLX,y:t.startLY,viewportWidth:t.startVW,widgetHeight:t.startWH},i,w,t.ar,r,v,b,Z());Q(k.widgetWidth,k.widgetHeight),q(k.x,k.y)}}function we(e){let t=G;if(!t||e.pointerId!==t.pointerId)return;G=null,c?.classList.remove("is-moving","is-resizing","is-snapped");try{if(t.el.hasPointerCapture(e.pointerId))t.el.releasePointerCapture(e.pointerId)}catch{}T=qe(O,N,S,D,window.innerWidth,window.innerHeight),F()}function ke(e){e.addEventListener("pointermove",je),e.addEventListener("pointerup",we),e.addEventListener("pointercancel",we),e.addEventListener("lostpointercapture",we)}function Ke(){if(n)return!0;try{n=a.ui.createFloatWidget({width:S,height:D,initialPosition:{x:Math.max(0,Math.round((window.innerWidth-S)/2)),y:Math.max(0,Math.round((window.innerHeight-D)/2))},snapToEdge:!1,tooltip:"Image Viewer",chromeless:!0})}catch(e){return console.error("[Image Viewer] Failed to create float widget:",e),!1}return n.setVisible(!1),n.onDragEnd((e)=>{T=null,q(e.x,e.y),T=qe(O,N,S,D,window.innerWidth,window.innerHeight)}),!0}function Te(e){return ae(s.dockSizes[e]??ot(e,window.innerWidth,window.innerHeight),e,window.innerWidth,window.innerHeight)}function te(){if(!l)return;c?.remove();try{l.destroy()}catch{}l=null}function ue(){if(!c)return;let e=re(o);c.classList.toggle("is-docked",!!e);for(let t of["left","right","top","bottom"])c.classList.toggle("dock-"+t,e===t);c.querySelectorAll("[data-mode]").forEach((t)=>{t.classList.toggle("active",t.dataset.mode===o)})}function ne(e){if(!c)return!1;if(f)clearTimeout(f),f=null;let t=re(o);if(!t){if(te(),!Ke()||!n)return!1;let i=n.isVisible()&&d;if(c.parentElement!==n.root)n.root.appendChild(c);if(ue(),c.classList.remove("pop-out"),Se(i),n.setVisible(!0),e)c.classList.remove("pop-in"),c.offsetWidth,c.classList.add("pop-in")}else{if(n?.isVisible())n.setVisible(!1);if(typeof a.ui.requestDockPanel!=="function")return console.warn("[Image Viewer] This Lumiverse build has no dock panel API; staying in float mode"),o="float",ne(e);if(!l){try{l=a.ui.requestDockPanel({edge:t,title:"Image Viewer",size:Te(t),minSize:Me,maxSize:ae(1/0,t,window.innerWidth,window.innerHeight),resizable:!1,chromeless:!0})}catch(i){return console.warn("[Image Viewer] Dock panel unavailable, falling back to float:",i),o="float",ne(e)}l.root.style.cssText="display:flex;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;",l.onVisibilityChange((i)=>{d=i})}if(c.classList.remove("pop-in","pop-out"),c.parentElement!==l.root)l.root.appendChild(c);ue(),l.expand()}return d=!0,!0}function oe(e){if(e===o&&d){E();return}let t=o;if(o=e,o!=="float")s.lastDock=o;if(d){if(t!==o)te();if(!ne(!1))o=t}else ue();E(),F()}function Ce(){oe(o==="float"?s.lastDock:"float")}function xe(){if(!d||!c)return;if(E(),d=!1,G=null,o==="float"&&n)c.classList.remove("pop-in"),c.classList.add("pop-out"),f=setTimeout(()=>{if(f=null,!d&&n)n.setVisible(!1),c?.classList.remove("pop-out")},150);else te()}function Ge(){if(c)return;let e=document.createElement("div");if(e.style.cssText="display:contents;",e.innerHTML=`
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
    `,c=e.firstElementChild,c.remove(),R=c.querySelector(".iv-toolbar"),h=c.querySelector(".iv-viewport"),se=c.querySelector(".iv-img-wrapper"),Y=c.querySelector(".iv-img"),ce=c.querySelector(".iv-spinner"),me=c.querySelector(".iv-error"),pe=c.querySelector(".iv-zoom-pill"),B=c.querySelector(".iv-btn-imglock"),U=c.querySelector(".iv-layout-menu"),j=c.querySelector(".iv-more-menu"),R?.addEventListener("pointerdown",(r)=>{if(r.target.closest("button, input, select, .iv-zoom-pill, .iv-menu"))return;if(o!=="float")return;he(r,R,I?"toolbar-resize":"move")}),R)ke(R);c.querySelectorAll(".iv-corner").forEach((r)=>{r.addEventListener("pointerdown",(v)=>{he(v,r,"corner",r.dataset.corner||"se")}),ke(r)}),c.addEventListener("click",(r)=>{let v=r.target.closest("[data-action]");if(!v)return;switch(v.getAttribute("data-action")){case"zoom-in":de(1.25);break;case"zoom-out":de(0.8);break;case"zoom-toggle":Pe();break;case"rotate":De();break;case"flip":W=!W,X();break;case"layout-menu":case"more-menu":{let b=v.getAttribute("data-action")==="layout-menu"?U:j;if(!b)break;let k=b.style.display==="flex";E(),b.style.display=k?"none":"flex";break}case"set-mode":oe(v.dataset.mode||"float");break;case"anchor":ee(v.dataset.anchor),F(),E();break;case"toggle-lock":ve(),E();break;case"reset-window":$e();break;case"toggle-image-lock":fe(),E();break;case"copy-url":if(m)navigator.clipboard.writeText(new URL(m,window.location.origin).toString()).then(()=>{let b=v.querySelector(".iv-copy-label");if(b)b.textContent="✓ Copied!";setTimeout(()=>{if(b)b.textContent="Copy Image Link";E()},800)}).catch(()=>E());break;case"open-tab":if(m)window.open(m,"_blank","noopener,noreferrer"),E();break;case"download":if(m){let b=document.createElement("a");b.href=m,b.download="",b.rel="noopener",document.body.appendChild(b),b.click(),b.remove(),E()}break;case"close":xe();break}}),h?.addEventListener("wheel",(r)=>{if(x||!h)return;r.preventDefault();let v=h.getBoundingClientRect(),b=r.clientX-v.left-v.width/2,k=r.clientY-v.top-v.height/2,V=r.deltaY<0?1.15:0.8695652173913044,C=Math.min(10,Math.max(0.2,y*V));z=b-(b-z)*C/y,M=k-(k-M)*C/y,y=Math.round(C*1000)/1000,X()},{passive:!1}),h?.addEventListener("pointerdown",(r)=>{if(r.button!==0||!h)return;if(x){if(o==="float")if(!I)he(r,h,"move");else r.preventDefault();return}r.preventDefault(),K=!0,Le=r.clientX-z,ze=r.clientY-M,h.classList.add("panning"),h.setPointerCapture(r.pointerId)}),h?.addEventListener("pointermove",(r)=>{if(!K||x)return;z=r.clientX-Le,M=r.clientY-ze,X()});let t=(r)=>{if(!K)return;K=!1,h?.classList.remove("panning");try{if(h?.hasPointerCapture(r.pointerId))h.releasePointerCapture(r.pointerId)}catch{}};if(h?.addEventListener("pointerup",t),h?.addEventListener("pointercancel",t),h?.addEventListener("lostpointercapture",t),h)ke(h);h?.addEventListener("dblclick",(r)=>{if(x||!h)return;if(y===1&&z===0&&M===0){let v=h.getBoundingClientRect(),b=r.clientX-v.left-v.width/2,k=r.clientY-v.top-v.height/2;y=2,z=b-b*2,M=k-k*2}else J();X()});let i=c.querySelector(".iv-dock-resizer");i?.addEventListener("pointerdown",(r)=>{let v=re(o);if(!v||!l||r.button!==0)return;r.preventDefault(),r.stopPropagation(),A={pointerId:r.pointerId,startX:r.clientX,startY:r.clientY,startSize:Te(v)},i.classList.add("is-active"),i.setPointerCapture(r.pointerId)}),i?.addEventListener("pointermove",(r)=>{let v=re(o);if(!A||!v||!l||r.pointerId!==A.pointerId)return;let b=r.clientX-A.startX,k=r.clientY-A.startY,V=v==="left"?b:v==="right"?-b:v==="top"?k:-k,C=ae(A.startSize+V,v,window.innerWidth,window.innerHeight);s.dockSizes[v]=C,l.setSize(C)});let w=(r)=>{if(!A||r.pointerId!==A.pointerId)return;A=null,i?.classList.remove("is-active");try{if(i?.hasPointerCapture(r.pointerId))i.releasePointerCapture(r.pointerId)}catch{}F()};i?.addEventListener("pointerup",w),i?.addEventListener("pointercancel",w),i?.addEventListener("lostpointercapture",w),be(),ge(),ue()}let We=(e)=>{if(c&&!c.contains(e.target))E()};document.addEventListener("pointerdown",We);async function ie(e,t="Image Preview"){let i=Ve(e);if(m=i,!await Ne())try{if(!(await a.permissions.request(["ui_panels"],{reason:"Image Viewer needs permission to open floating image panels."})).includes("ui_panels"))return}catch(r){console.warn("[Image Viewer] ui_panels permission request rejected:",r);return}if(Ge(),!c)return;if(ce?.classList.add("active"),me?.classList.remove("active"),Y)Y.style.opacity="0";E();let w=new Image;w.onload=()=>{if(m!==i)return;if(ce?.classList.remove("active"),g=w.naturalWidth||600,L=w.naturalHeight||400,P=g/L,H=0,W=!1,Y)Y.src=i,Y.alt=t,Y.style.opacity="1";if(J(),be(),ge(),!ne(!d))console.error("[Image Viewer] Could not mount viewer")},w.onerror=()=>{if(m!==i)return;if(ce?.classList.remove("active"),me?.classList.add("active"),Y)Y.style.opacity="0";ne(!d)},w.src=i}let Ye=(e)=>{if(!d)return;if(e.ctrlKey||e.metaKey||e.altKey)return;let t=document.activeElement;if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable))return;switch(e.key){case"Escape":if(e.preventDefault(),Be())E();else xe();break;case"+":case"=":if(!x)e.preventDefault(),de(1.25);break;case"-":case"_":if(!x)e.preventDefault(),de(0.8);break;case"0":if(!x)e.preventDefault(),J();break;case"1":if(!x)e.preventDefault(),Pe();break;case"r":case"R":e.preventDefault(),De();break;case"h":case"H":e.preventDefault(),W=!W,X();break;case"l":case"L":if(o==="float")e.preventDefault(),ve();break;case"p":case"P":e.preventDefault(),fe();break;case"d":case"D":e.preventDefault(),Ce();break}};document.addEventListener("keydown",Ye);let Ae=(e)=>{let t=e.target;if(!t)return;if(c&&c.contains(t))return;let i=t.tagName==="IMG"?t:t.closest("img");if(!i)return;let w=i.getAttribute("src");if(!w)return;let r=w.includes("/avatar")||!!i.closest(".avatar, [data-avatar], .portrait"),v=w.includes("/api/v1/images")||w.includes("/api/v1/image-gen")||!!i.closest(".attachment, [data-attachment]"),b=!!i.closest(".message-content, .chat-message, [data-message-id]"),k=i.naturalWidth>=32&&i.naturalHeight>=32;if(r||v||b||k)e.preventDefault(),e.stopPropagation(),ie(w,i.alt||"Image Preview")};document.addEventListener("click",Ae,!0);let Xe=()=>{if(!d)return;let e=re(o);if(!e)Ue();else if(l)l.setMaxSize(ae(1/0,e,window.innerWidth,window.innerHeight))};window.addEventListener("resize",Xe);try{p=a.ui.registerInputBarAction({id:"view-character-avatar",label:"View Character Avatar",iconSvg:`
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="5"/>
          <path d="M20 21a8 8 0 1 0-16 0"/>
        </svg>
      `}),p.onClick(()=>{let e=a.getActiveChat?.();if(e?.characterId)ie(`/api/v1/characters/${e.characterId}/avatar`,"Character Avatar");else{let t=document.querySelector('img[src*="/avatar"]');if(t?.src)ie(t.src,"Avatar")}})}catch(e){console.debug("[Image Viewer] Input bar action registration skipped:",e)}let Ze=a.events.on("PERMISSION_CHANGED",async(e)=>{let t=e;if(t?.permission==="ui_panels"&&!t.granted)te(),n?.destroy(),n=null,d=!1}),Je={show:ie,close:xe,reset:J,setAnchor:(e)=>{if(o!=="float")oe("float");ee(e),F()},setMode:oe,toggleDock:Ce,toggleLock:ve,toggleImageLock:fe,resolveUrl:Ve};return window.__lumiverseImageViewer=Je,window.testImageViewer=(e)=>{ie(e||"https://picsum.photos/800/600")},console.log("[Image Viewer] Extension loaded"),()=>{if(document.removeEventListener("keydown",Ye),document.removeEventListener("click",Ae,!0),document.removeEventListener("pointerdown",We),window.removeEventListener("resize",Xe),f)clearTimeout(f);Ze?.(),p?.destroy(),te(),n?.destroy(),u(),delete window.__lumiverseImageViewer,delete window.testImageViewer,console.log("[Image Viewer] Extension unloaded")}}export{Me as DOCK_MIN_SIZE,Fe as MIN_VIEWPORT_WIDTH,it as calculateActualSizeScale,Qe as calculateAnchorPosition,nt as calculateCornerResize,et as calculateEdgeFlushPlacement,Re as calculateFitDimensions,ye as calculateResizeDimensions,ae as clampDockSize,ot as defaultDockSize,qe as detectAnchor,Ve as resolveFullImageUrl,lt as setup,tt as snapPosition};
