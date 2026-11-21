var Pn=(t)=>t==="float"||t==="dock-left"||t==="dock-right"||t==="dock-top"||t==="dock-bottom",zn=["top-left","top-right","center-left","center-right","center","bottom-left","bottom-right"];function Ut(t){if(!t||typeof t!=="object")return null;let i=t;if(typeof i.url!=="string"||!i.url)return null;let r=(l,u)=>typeof l==="number"&&Number.isFinite(l)?l:u;return{url:i.url,alt:typeof i.alt==="string"?i.alt:"Image Preview",mode:Pn(i.mode)?i.mode:"float",x:r(i.x,0),y:r(i.y,0),w:Math.max(0,r(i.w,0)),h:Math.max(0,r(i.h,0)),anchor:zn.includes(i.anchor)?i.anchor:null,rotation:[0,90,180,270].includes(i.rotation)?i.rotation:0,flipH:i.flipH===!0}}function qt(t){let i=t&&typeof t==="object"?t:{},r=Array.isArray(i.pins)?i.pins:[],l=[];for(let u of r){if(!u||typeof u!=="object")continue;let p=u,v=Ut(p.state);if(!v||typeof p.id!=="string"||typeof p.chatId!=="string"||typeof p.messageId!=="string")continue;l.push({id:p.id,chatId:p.chatId,messageId:p.messageId,createdAt:typeof p.createdAt==="number"?p.createdAt:0,state:v})}return{updatedAt:typeof i.updatedAt==="number"?i.updatedAt:0,pins:l}}function jt(t){try{let i=localStorage.getItem(t);return i?JSON.parse(i):null}catch{return null}}function bt(t,i){try{localStorage.setItem(t,JSON.stringify(i))}catch{}}function Gt(){let t=jt("image_viewer_session_v1");return(Array.isArray(t?.windows)?t.windows:[]).map(Ut).filter((r)=>!!r)}function Zt(t){bt("image_viewer_session_v1",{windows:t})}function wt(){try{localStorage.removeItem("image_viewer_session_v1")}catch{}}class xt{remote;doc;listeners=new Set;constructor(t){this.remote=t;this.doc=qt(jt("image_viewer_pins_v1"))}async sync(){if(!this.remote)return;try{let t=qt(await this.remote.get("pins"));if(t.updatedAt>this.doc.updatedAt)this.doc=t,bt("image_viewer_pins_v1",this.doc),this.emit();else if(this.doc.updatedAt>t.updatedAt)this.pushRemote()}catch(t){console.debug("[Image Viewer] Pin sync unavailable:",t)}}onChange(t){return this.listeners.add(t),()=>this.listeners.delete(t)}all(){return[...this.doc.pins]}forChat(t){return t?this.doc.pins.filter((i)=>i.chatId===t):[]}get(t){return this.doc.pins.find((i)=>i.id===t)}upsert(t){let i=this.doc.pins.findIndex((r)=>r.id===t.id);if(i>=0)this.doc.pins[i]=t;else this.doc.pins.push(t);this.commit()}updateState(t,i){let r=this.get(t);if(!r)return;r.state=i,this.commit(!1)}remove(t){this.doc.pins=this.doc.pins.filter((i)=>i.id!==t),this.commit()}removeWhere(t){let i=this.doc.pins.length;if(this.doc.pins=this.doc.pins.filter((r)=>!t(r)),this.doc.pins.length!==i)this.commit()}commit(t=!0){if(this.doc.updatedAt=Date.now(),bt("image_viewer_pins_v1",this.doc),this.pushRemote(),t)this.emit()}pushTimer=null;async pushRemote(){if(!this.remote)return;if(this.pushTimer)clearTimeout(this.pushTimer);this.pushTimer=setTimeout(()=>{this.pushTimer=null,this.remote?.set("pins",this.doc).catch((t)=>{console.debug("[Image Viewer] Pin sync write failed:",t)})},800)}emit(){for(let t of this.listeners)t()}dispose(){if(this.pushTimer)clearTimeout(this.pushTimer);this.listeners.clear()}}function Jt(){return`pin_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`}var Tn=[{key:"multiWindow",label:"Open images in new windows",hint:"Off: clicking an image replaces the current window."},{key:"restoreWindows",label:"Reopen windows after reload",hint:"Windows open when the page closed come back with their size and position."},{key:"pinsFollowMessage",label:"Pinned windows follow their message",hint:"Show a pinned window only while its message is on screen. Off: show whenever its chat is open."},{key:"panLockedByDefault",label:"Lock pan & zoom on open",hint:"Dragging the image moves the window until you unlock pan & zoom."}],Qt=[{key:"maxWindows",label:"Most windows at once",hint:"Past this, the oldest window shows the new image. Pinned windows don’t count.",min:1,max:12},{key:"openSizePct",label:"Opening size (% of screen)",hint:"Desktop only; phones always use most of the screen.",min:40,max:95}],Ve=(t)=>t.replace(/[&<>"']/g,(i)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[i]);function en(t,i){if(typeof t.ui.registerSettingsTab!=="function")return null;let r;try{r=t.ui.registerSettingsTab({id:"extensions",title:"Image Viewer",description:"Image Viewer windows, pins and restore settings",keywords:["image","viewer","pin","window","gallery","zoom"],sections:[{key:"image-viewer",titleKey:"imageViewer.settings.title",titleFallback:"Image Viewer",keywords:["image","viewer","pinned images","windows"]}]})}catch(y){return console.warn("[Image Viewer] Could not register settings section:",y),null}let l=t.dom.addStyle(`
  .ivs { display: flex; flex-direction: column; gap: 14px; padding: 4px 0 12px; color: var(--lumiverse-text, #e2e8f0); }
  .ivs h3 { margin: 0; font-size: 15px; font-weight: 600; }
  .ivs h4 { margin: 0 0 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--lumiverse-text-muted, #94a3b8); }
  .ivs-intro { margin: 2px 0 0; font-size: 12px; color: var(--lumiverse-text-muted, #94a3b8); }
  .ivs-group { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border: 1px solid var(--lumiverse-border, rgba(255,255,255,0.1)); border-radius: var(--lumiverse-radius, 8px); background: var(--lumiverse-fill-subtle, rgba(255,255,255,0.03)); }
  .ivs-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 6px 0; }
  .ivs-row + .ivs-row { border-top: 1px solid var(--lumiverse-border, rgba(255,255,255,0.06)); }
  .ivs-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .ivs-label { font-size: 13px; }
  .ivs-hint { font-size: 11px; color: var(--lumiverse-text-muted, #94a3b8); }
  .ivs input[type="checkbox"] { width: 18px; height: 18px; flex: none; accent-color: var(--lumiverse-primary, #38bdf8); cursor: pointer; }
  .ivs input[type="number"] { width: 64px; padding: 4px 6px; flex: none; color: inherit; background: var(--lumiverse-bg, #111); border: 1px solid var(--lumiverse-border, rgba(255,255,255,0.15)); border-radius: 6px; font: inherit; font-size: 13px; }
  .ivs-btn { padding: 6px 10px; font: inherit; font-size: 12px; color: inherit; background: var(--lumiverse-fill, rgba(255,255,255,0.06)); border: 1px solid var(--lumiverse-border, rgba(255,255,255,0.15)); border-radius: 6px; cursor: pointer; }
  .ivs-btn:hover { background: var(--lumiverse-fill-hover, rgba(255,255,255,0.12)); }
  .ivs-btn.danger:hover { color: var(--lumiverse-danger, #ef4444); border-color: var(--lumiverse-danger, #ef4444); }
  .ivs-actions { display: flex; flex-wrap: wrap; gap: 8px; padding-top: 6px; }
  .ivs-pins { display: flex; flex-direction: column; gap: 6px; }
  .ivs-pin { display: flex; align-items: center; gap: 10px; padding: 6px; border-radius: 6px; background: var(--lumiverse-fill-subtle, rgba(255,255,255,0.03)); }
  .ivs-pin img { width: 40px; height: 40px; object-fit: cover; border-radius: 4px; flex: none; background: var(--lumiverse-bg, #111); }
  .ivs-pin .ivs-text { flex: 1; }
  .ivs-pin-title { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ivs-empty { font-size: 12px; color: var(--lumiverse-text-muted, #94a3b8); padding: 4px 0; }
`),u=document.createElement("div");u.className="ivs",u.id="setsec-extensions-image-viewer",r.root.appendChild(u);let p=new Map;async function v(y){if(p.has(y)||typeof t.chats.get!=="function")return;p.set(y,"");try{let b=await t.chats.get(y);if(b?.name)p.set(y,b.name),k()}catch{}}function x(y,b){let L=(y.state.alt&&y.state.alt!=="Image Preview"?y.state.alt:"")||y.state.url.split("/").pop()||"Image",I=new Date(y.createdAt).toLocaleDateString();return`
      <div class="ivs-pin" data-pin="${Ve(y.id)}">
        <img src="${Ve(y.state.url)}" alt="" loading="lazy" />
        <div class="ivs-text">
          <span class="ivs-pin-title">${Ve(L)}</span>
          <span class="ivs-hint">Pinned ${Ve(I)}</span>
        </div>
        ${b?'<button class="ivs-btn" data-act="open-pin">Show</button>':""}
        <button class="ivs-btn danger" data-act="remove-pin">Unpin</button>
      </div>`}function k(){let y=u.querySelector(".ivs-pin-list");if(!y)return;let b=i.pins.all(),L=i.activeChatId();if(!b.length){y.innerHTML='<div class="ivs-empty">No pinned images. Use ⋮ → Pin to Message in an image window.</div>';return}let I=new Map;for(let z of b)I.set(z.chatId,[...I.get(z.chatId)??[],z]);let V=[...I.keys()].sort((z,N)=>z===L?-1:N===L?1:0);y.innerHTML=V.map((z)=>{v(z);let N=z===L?"This chat":p.get(z)||"Other chat",Y=I.get(z).map((Je)=>x(Je,z===L)).join("");return`<h4>${Ve(N)} (${I.get(z).length})</h4><div class="ivs-pins">${Y}</div>`}).join("")}function g(){let y=i.getSettings();u.innerHTML=`
      <div>
        <h3>Image Viewer</h3>
        <p class="ivs-intro">Floating image windows, pins and restore behaviour.</p>
      </div>
      <div class="ivs-group">
        ${Tn.map((b)=>`
          <label class="ivs-row">
            <span class="ivs-text"><span class="ivs-label">${b.label}</span><span class="ivs-hint">${b.hint}</span></span>
            <input type="checkbox" data-toggle="${b.key}" ${y[b.key]?"checked":""} />
          </label>`).join("")}
        ${Qt.map((b)=>`
          <label class="ivs-row">
            <span class="ivs-text"><span class="ivs-label">${b.label}</span><span class="ivs-hint">${b.hint}</span></span>
            <input type="number" data-number="${b.key}" min="${b.min}" max="${b.max}" step="1" value="${y[b.key]}" />
          </label>`).join("")}
        <div class="ivs-actions">
          <button class="ivs-btn" data-act="forget-windows">Forget remembered windows</button>
        </div>
      </div>
      <div class="ivs-group">
        <h4>Pinned images</h4>
        <div class="ivs-pin-list"></div>
        <div class="ivs-actions">
          <button class="ivs-btn danger" data-act="clear-chat-pins">Unpin all in this chat</button>
          <button class="ivs-btn danger" data-act="clear-all-pins">Unpin everything</button>
        </div>
      </div>
    `,k()}u.addEventListener("change",(y)=>{let b=y.target;if(b.dataset.toggle)i.update({[b.dataset.toggle]:b.checked});else if(b.dataset.number){let L=Qt.find((V)=>V.key===b.dataset.number),I=Math.min(L.max,Math.max(L.min,Math.round(Number(b.value)||L.min)));b.value=String(I),i.update({[L.key]:I})}}),u.addEventListener("click",async(y)=>{let b=y.target.closest("[data-act]");if(!b)return;let L=b.closest("[data-pin]")?.dataset.pin;switch(b.dataset.act){case"open-pin":if(L)i.openPin(L);break;case"remove-pin":if(L)i.removePin(L);break;case"forget-windows":i.forgetWindows(),b.textContent="✓ Forgotten",setTimeout(()=>b.textContent="Forget remembered windows",1200);break;case"clear-chat-pins":case"clear-all-pins":{let I=b.dataset.act==="clear-all-pins",V=i.activeChatId(),z=i.pins.all().filter((Y)=>I||Y.chatId===V);if(!z.length)break;let{confirmed:N}=await t.ui.showConfirm({title:I?"Unpin every image?":"Unpin images in this chat?",message:`${z.length} pinned image${z.length===1?"":"s"} will be unpinned. The images themselves are not deleted.`,variant:"danger",confirmLabel:"Unpin"});if(N)for(let Y of z)i.removePin(Y.id);break}}});let S=i.pins.onChange(k),C=r.onActivate(g);return g(),()=>{S(),C(),l();try{r.destroy()}catch{}}}function yt(t){if(!t)return t;try{let i=t.startsWith("/"),r=typeof window<"u"?window.location.origin:"http://localhost",l=new URL(t,r);if(l.searchParams.has("size")){if(l.searchParams.delete("size"),i||typeof window<"u"&&l.origin===window.location.origin)return l.pathname+(l.search?l.search:"")+l.hash;return l.toString()}}catch{}return t}function tn(t,i,r,l,u=39,p=280){let v=t>0&&i>0?t/i:1,x=Math.max(80,l-u),k=Math.max(p,r),g=t,S=i;if(g>k||S>x){let C=Math.min(k/g,x/S);g=Math.round(g*C),S=Math.round(g/v)}if(g<p)g=p,S=Math.round(g/v);if(S>x)S=x,g=Math.round(S*v);return{viewportWidth:Math.round(g),viewportHeight:Math.round(S),widgetWidth:Math.round(g),widgetHeight:Math.round(S+u)}}function Ge(t,i,r,l,u,p=39,v=280){let x=r>0?r:1,k=Math.max(v,t+i),g=Math.round(k/x);if(k>l)k=l,g=Math.round(k/x);if(g>u)g=u,k=Math.round(g*x);return{viewportWidth:Math.round(k),viewportHeight:Math.round(g),widgetWidth:Math.round(k),widgetHeight:Math.round(g+p)}}function Wn(t,i,r,l,u,p=0){let v=p,x=p;switch(t){case"top-left":v=p,x=p;break;case"top-right":v=Math.max(0,l-i-p),x=p;break;case"center-left":v=p,x=Math.max(0,Math.round((u-r)/2));break;case"center-right":v=Math.max(0,l-i-p),x=Math.max(0,Math.round((u-r)/2));break;case"center":v=Math.max(0,Math.round((l-i)/2)),x=Math.max(0,Math.round((u-r)/2));break;case"bottom-left":v=p,x=Math.max(0,u-r-p);break;case"bottom-right":v=Math.max(0,l-i-p),x=Math.max(0,u-r-p);break}return{x:v,y:x}}function Ye(t=document){if(!t.body)return 0;let i=t.createElement("div");i.style.cssText="position:fixed;top:0;left:0;width:0;visibility:hidden;pointer-events:none;height:var(--app-window-controls-overlay-top, 0px)",t.body.appendChild(i);let r=i.offsetHeight;return i.remove(),Number.isFinite(r)&&r>0?r:0}function Cn(t,i,r,l,u,p,v=12){let x=Math.max(0,Math.min(t,Math.max(0,u-r))),k=Math.max(0,Math.min(i,Math.max(0,p-l))),g=Math.max(v,u-r-v),S=Math.max(v,p-l-v),C=Math.max(v,Math.min(x,g)),y=Math.max(v,Math.min(k,S));return{hostX:C,hostY:y,offsetX:x-C,offsetY:k-y}}var sn=320,Dn=240,Ze=640;function An(t){let i=t<Ze?Math.max(140,Math.round(t*0.4)):sn;return Math.max(1,Math.min(i,t))}function St(t,i,r){return Math.min(Dn,Math.max(100,Math.floor((t==="left"||t==="right"?i:r)*0.22)))}function kt(t,i=0.85){return t<Ze?0.95:i}function Rn(t,i,r,l,u,p,v=16){let x=(S,C,y)=>{let b=Math.max(0,y-C),L=[[0,"start"],[b,"end"],[Math.round(b/2),"center"]],I=null;for(let[V,z]of L){let N=Math.abs(S-V);if(N<=v&&(!I||N<I.dist))I={value:V,kind:z,dist:N}}return I?{pos:I.value,kind:I.kind}:{pos:S,kind:null}},k=x(t,r,u),g=x(i,l,p);return{x:k.pos,y:g.pos,snapX:k.kind,snapY:g.kind}}function nn(t,i,r,l,u,p,v=1){let x=Math.max(0,u-r),k=Math.max(0,p-l),g=Math.abs(t)<=v,S=Math.abs(t-x)<=v,C=Math.abs(i)<=v,y=Math.abs(i-k)<=v,b=Math.abs(t-Math.round(x/2))<=v,L=Math.abs(i-Math.round(k/2))<=v;if(g&&C)return"top-left";if(S&&C)return"top-right";if(g&&y)return"bottom-left";if(S&&y)return"bottom-right";if(g&&L)return"center-left";if(S&&L)return"center-right";if(b&&L)return"center";return null}function Hn(t,i,r,l,u,p,v,x=39,k=sn){let g=u>0?u:1,S=t.includes("w"),C=t.includes("n"),y=S?-r:r,b=(C?-l:l)*g,L=Math.max(y,b),I=i.x+i.viewportWidth,V=i.y+i.widgetHeight,z=S?I:p-i.x,N=(C?V:v-i.y)-x,Y=Ge(i.viewportWidth,L,g,Math.max(1,z),Math.max(1,N),x,k);return{...Y,x:S?I-Y.widgetWidth:i.x,y:C?V-Y.widgetHeight:i.y}}function Oe(t,i,r,l){let u=i==="left"||i==="right"?r:l,p=St(i,r,l),v=Math.max(p,Math.floor(u*0.7));return Math.round(Math.min(v,Math.max(p,t)))}function Vn(t,i,r){let l=t==="left"||t==="right",u=i<Ze,p=l?Math.min(520,Math.max(u?0:320,Math.round(i*(u?0.42:0.3)))):Math.min(520,Math.max(u?0:260,Math.round(r*(u?0.35:0.38))));return Oe(p,t,i,r)}function Yn(t,i,r,l,u=!1){let p=u?i:t,v=u?t:i;if(p<=0||v<=0||r<=0||l<=0)return 1;let x=Math.min(r/p,l/v);return x>0?1/x:1}async function On(t){let i=await fetch(t,{credentials:"same-origin"});if(!i.ok)throw Error(`HTTP ${i.status}`);let r=await i.blob();if(r.type==="image/png")return r;let l,u,p;try{let k=await createImageBitmap(r);l=k,u=k.width,p=k.height}catch{let k=URL.createObjectURL(r);try{let g=new Image;g.src=k,await g.decode(),l=g,u=g.naturalWidth||512,p=g.naturalHeight||512}finally{setTimeout(()=>URL.revokeObjectURL(k),0)}}let v=document.createElement("canvas");v.width=u,v.height=p;let x=v.getContext("2d");if(!x)throw Error("Canvas unavailable");return x.drawImage(l,0,0),await new Promise((k,g)=>v.toBlob((S)=>S?k(S):g(Error("PNG encode failed")),"image/png"))}function on(t){if(typeof ClipboardItem>"u"||!navigator.clipboard?.write)return Promise.reject(Error("Image clipboard not supported"));let i=new URL(t,window.location.origin).toString();return navigator.clipboard.write([new ClipboardItem({"image/png":On(i)})])}var _n=`
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
      container-type: inline-size;
      container-name: iv;
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
      max-width: calc(100% - 12px);
      max-height: calc(100% - 48px);
      overflow-y: auto;
      overscroll-behavior: contain;
      /* Opaque so the menu stays readable over light images: the solid elevated theme colour
         with the translucent fill layered on top for the usual tint. */
      background: linear-gradient(var(--lumiverse-fill, transparent), var(--lumiverse-fill, transparent)),
                  var(--lumiverse-bg-elevated, var(--lumiverse-bg, #1c1f26));
      border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.15));
      border-radius: var(--lumiverse-radius, 8px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
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
    .iv-menu-btn:hover { background: var(--lumiverse-border, rgba(255, 255, 255, 0.15)); color: var(--lumiverse-text, #fff); }
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
    .iv-menu-item:hover { background: var(--lumiverse-border, rgba(255, 255, 255, 0.15)); color: var(--lumiverse-text, #fff); }
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
      touch-action: none;
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

    /* Pin chip injected into a message bubble */
    .iv-pin-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin: 6px 0 0;
      padding: 2px 8px;
      font-size: 11px;
      line-height: 18px;
      color: var(--lumiverse-text-muted, #94a3b8);
      background: var(--lumiverse-fill-subtle, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.12));
      border-radius: 999px;
      cursor: pointer;
      user-select: none;
      transition: color 0.15s, border-color 0.15s, background 0.15s;
    }
    .iv-pin-chip:hover { color: var(--lumiverse-text, #e2e8f0); }
    .iv-pin-chip.is-shown {
      color: var(--lumiverse-primary, #38bdf8);
      border-color: var(--lumiverse-primary, #38bdf8);
    }
    .iv-container.is-pinned .iv-toolbar { box-shadow: inset 0 -2px 0 var(--lumiverse-primary, #38bdf8); }

    /* Narrow-window fallbacks: overflow controls move into the More menu */
    .iv-narrow-only { display: none; }
    .iv-siblings-only { display: none; }
    .iv-container.has-siblings .iv-siblings-only { display: flex; }
    @container iv (max-width: 300px) {
      .iv-wide-only { display: none !important; }
      .iv-narrow-only { display: block; }
      .iv-toolbar { padding: 6px 4px; }
      .iv-menu { left: 6px; right: 6px; min-width: 0; max-width: none; }
    }
    @container iv (max-width: 220px) {
      .iv-menu-grid { grid-template-columns: 1fr; }
      .iv-anchor-grid button:last-child:nth-child(odd),
      .iv-mode-grid button[data-mode="float"] { grid-column: auto; }
      .iv-zoom-pill { min-width: 0; }
    }

    /* Touch screens: larger hit targets for buttons, resize corners and the dock splitter */
    @media (pointer: coarse) {
      .iv-toolbar { padding: 4px 6px; }
      .iv-btn { width: 30px; height: 30px; font-size: 15px; }
      .iv-menu-item, .iv-menu-btn { padding: 10px; }
      .iv-corner-nw, .iv-corner-ne { width: 22px; height: 22px; }
      .iv-corner-sw { width: 26px; height: 26px; }
      .image-viewer-resize { width: 30px; height: 30px; opacity: 0.85; }
      .iv-container.dock-right .iv-dock-resizer,
      .iv-container.dock-left .iv-dock-resizer { width: 14px; }
      .iv-container.dock-top .iv-dock-resizer,
      .iv-container.dock-bottom .iv-dock-resizer { height: 14px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .iv-container.pop-in, .iv-container.pop-out, .iv-menu { animation: none; }
      .iv-container.pop-out { opacity: 0; }
    }
`,ln="image_viewer_prefs_v1",rn=28,Nn=["dock-left","dock-right","dock-top","dock-bottom"],Mt={multiWindow:!0,maxWindows:8,restoreWindows:!0,pinsFollowMessage:!0,panLockedByDefault:!0,openSizePct:85},an=(t,i,r,l)=>typeof t==="number"&&Number.isFinite(t)?Math.min(r,Math.max(i,Math.round(t))):l;function Fn(){let t={mode:"float",lastDock:"dock-right",dockSizes:{},positionLocked:!1,anchor:null,...Mt};try{let i=localStorage.getItem(ln);if(!i)return t;let r=JSON.parse(i),l=(u)=>u==="float"||Nn.includes(u);return{mode:l(r.mode)?r.mode:t.mode,lastDock:l(r.lastDock)&&r.lastDock!=="float"?r.lastDock:t.lastDock,dockSizes:r.dockSizes&&typeof r.dockSizes==="object"?r.dockSizes:{},positionLocked:r.positionLocked===!0,anchor:["top-left","top-right","center-left","center-right","center","bottom-left","bottom-right"].includes(r.anchor)?r.anchor:null,multiWindow:r.multiWindow!==!1,maxWindows:an(r.maxWindows,1,12,Mt.maxWindows),restoreWindows:r.restoreWindows!==!1,pinsFollowMessage:r.pinsFollowMessage!==!1,panLockedByDefault:r.panLockedByDefault!==!1,openSizePct:an(r.openSizePct,40,95,Mt.openSizePct)}}catch{return t}}function Et(t){try{localStorage.setItem(ln,JSON.stringify(t))}catch{}}var Le=(t)=>t==="float"?null:t.slice(5);function qn(t){let i=t.dom.addStyle(_n),r=Fn(),l=[],u=null,p=null,v=0,x=()=>l.filter((e)=>e.isOpen());function k(e){u=e}function g(){if(u?.isOpen())return u;let e=x();return e[e.length-1]??null}function S(e,o){for(let s of[...l]){if(s===o||s.dockEdge()!==e)continue;if(s.isOpen())s.setMode("float");else s.destroy()}}function C(){let e=x().length>1;document.querySelectorAll(".iv-container").forEach((o)=>o.classList.toggle("has-siblings",e))}function y(e){let o=null,s=null,f,m=e.restore?.mode??(e.primary?r.mode:"float"),P=!1,D=!1,G=!1,T=e.pin??null,ce=e.pin?.messageId??null,de=e.restore??null,ne=!1,et=null,ue=null,Z="",Fe=600,Xe=400,tt=1,F=1,Q=0,ee=0,pe=0,be=!1,{positionLocked:me,panLockedByDefault:R}=r,q=e.restore?e.restore.anchor:e.primary?r.anchor:null,nt=e.cascadeFrom,ge=0,fe=0,ve=Ye(),H=()=>Math.max(0,window.innerHeight-ve),K=440,U=340,h=null,he=null,E=null,$e=null,ie=null,Be=null,it=null,ot=null,We=null,Ce=null,De=null,xe=!1,Ht=0,Vt=0,ye=null,se=null,vn=39,we=()=>{if(e.primary)r.mode=m,r.anchor=q;if(m!=="float")r.lastDock=m;r.positionLocked=me,Et(r),Y(f)};function Ae(){return he&&he.offsetHeight>0?he.offsetHeight:vn}let ke=()=>An(window.innerWidth);async function hn(){try{return(await t.permissions.getGranted()).includes("ui_panels")}catch{return!0}}function rt(){return pe%180!==0?1/(tt||1):tt||1}function Yt(){return pe%180!==0?{w:Xe,h:Fe}:{w:Fe,h:Xe}}function oe(){if(!$e)return;let n=be?-1:1;if($e.classList.toggle("is-side",pe%180!==0),$e.style.transform=`translate(${Q}px, ${ee}px) scale(${F}) rotate(${pe}deg) scaleX(${n})`,ot)ot.textContent=F===1&&Q===0&&ee===0?"Fit":`${Math.round(F*100)}%`}function Re(){F=1,Q=0,ee=0,oe()}function Ke(n){if(R)return;F=Math.min(10,Math.max(0.2,Math.round(F*n*100)/100)),oe()}function Ot(){if(R)return;if(F===1&&Q===0&&ee===0){if(!E)return;let n=Yt(),a=Yn(n.w,n.h,E.clientWidth,E.clientHeight,!1);F=a>1.05?Math.min(10,Math.round(a*100)/100):2,oe()}else Re()}function _t(n,a){let d=n.querySelector(".iv-action-label"),W=d?.dataset.label??d?.textContent??"";if(d)d.textContent="Working…";a.then(()=>{if(d)d.textContent="✓ Copied!"}).catch((O)=>{if(console.warn("[Image Viewer] Copy failed:",O),d)d.textContent="✕ Copy failed"}).finally(()=>{setTimeout(()=>{if(d)d.textContent=W;X()},900)})}function X(){if(Ce)Ce.style.display="none";if(De)De.style.display="none"}let bn=()=>Ce?.style.display==="flex"||De?.style.display==="flex";function at(n){me=typeof n==="boolean"?n:!me,st(),we()}function st(){h?.classList.toggle("is-locked",me);let n=h?.querySelector(".iv-lock-status-icon"),a=h?.querySelector(".iv-lock-status-text");if(n)n.textContent=me?"\uD83D\uDD12":"\uD83D\uDCCC";if(a)a.textContent=me?"Unlock Position":"Lock Position"}function lt(n){if(R=typeof n==="boolean"?n:!R,R)xe=!1,E?.classList.remove("panning");ct()}function ct(){if(E?.classList.toggle("is-image-locked",R),h?.classList.toggle("is-image-locked",R),We)We.textContent=R?"\uD83D\uDD12":"✋",We.title=R?"Pan & zoom locked - click to unlock (P)":"Pan & zoom unlocked - click to lock (P)",We.classList.toggle("active",!R)}function Me(n,a){if(!o)return;K=n,U=a,o.setSize(n,a),o.root.style.width=n+"px",o.root.style.height=a+"px"}function re(n,a){if(!o)return;let d=Cn(n,a,K,U,window.innerWidth,H(),12);ge=d.hostX+d.offsetX,fe=d.hostY+d.offsetY,o.moveTo(d.hostX,d.hostY+ve),o.root.style.transform=d.offsetX!==0||d.offsetY!==0?`translate3d(${d.offsetX}px, ${d.offsetY}px, 0)`:""}function Ee(n){if(!o)return;q=n;let{x:a,y:d}=Wn(n,K,U,window.innerWidth,H(),0);re(a,d)}function dt(){if(q)Ee(q);else re(ge,fe)}let Nt=()=>{let n=kt(window.innerWidth,r.openSizePct/100);return e.primary||window.innerWidth<Ze?n:Math.min(n,0.55)};function Ft(n){if(!o)return;let a=de;if(de=null,a&&a.w>0&&!n){let _=Ae(),A=Ge(a.w,0,rt(),window.innerWidth,Math.max(80,H()-_),_,ke());if(Me(A.widgetWidth,A.widgetHeight),q)Ee(q);else re(a.x,a.y);nt=null;return}let d=Yt(),W=tn(d.w,d.h,window.innerWidth*Nt(),H()*Nt(),Ae(),ke());Me(W.widgetWidth,W.widgetHeight);let O=nt;if(nt=null,q)Ee(q);else if(n)re(ge,fe);else if(O){let _=O.x+rn,A=O.y+rn;if(_+K>window.innerWidth)_=0;if(A+U>H())A=0;re(_,A)}else re(Math.max(0,Math.round((window.innerWidth-K)/2)),Math.max(0,Math.round((H()-U)/2)))}function Xt(){if(pe=(pe+90)%360,m==="float"&&o){let n=Ae(),a=K,d=Math.max(80,U-n),W=tn(d,a,window.innerWidth*Math.max(0.9,kt(window.innerWidth)),H()*Math.max(0.9,kt(window.innerWidth)),n,ke());Me(W.widgetWidth,W.widgetHeight),dt()}oe()}function wn(){if(!o)return;let n=Ae(),a=rt();if(K>window.innerWidth||U>H()){let d=Ge(K,0,a,window.innerWidth,Math.max(80,H()-n),n,ke());Me(d.widgetWidth,d.widgetHeight)}dt()}function xn(){if(q=null,m!=="float")He("float");else Ft(!1);X(),we()}function ut(n,a,d,W="se"){if(m!=="float"||!o||n.button!==0)return;ve=Ye(),n.preventDefault(),n.stopPropagation(),ye={kind:d,corner:W,pointerId:n.pointerId,el:a,startX:n.clientX,startY:n.clientY,startLX:ge,startLY:fe,startVW:K,startWH:U,ar:rt(),anchor:q};try{a.setPointerCapture(n.pointerId)}catch{}h?.classList.add(d==="move"?"is-moving":"is-resizing")}function yn(n){let a=ye;if(!a||!o||n.pointerId!==a.pointerId)return;let d=n.clientX-a.startX,W=n.clientY-a.startY,O=window.innerWidth,_=H(),A=Ae();if(a.kind==="move"){let j=a.startLX+d,c=a.startLY+W,w=!1;if(!n.shiftKey){let M=Rn(j,c,K,U,O,_,16);j=M.x,c=M.y,w=!!(M.snapX||M.snapY)}h?.classList.toggle("is-snapped",w),re(j,c)}else if(a.kind==="toolbar-resize"){let j=Math.abs(d)>=Math.abs(W)?d:W,c=a.anchor?O:O-a.startLX,w=(a.anchor?_:_-a.startLY)-A,M=Ge(a.startVW,j,a.ar,c,w,A,ke());if(Me(M.widgetWidth,M.widgetHeight),a.anchor)Ee(a.anchor);else re(a.startLX,a.startLY)}else{let j=Hn(a.corner,{x:a.startLX,y:a.startLY,viewportWidth:a.startVW,widgetHeight:a.startWH},d,W,a.ar,O,_,A,ke());Me(j.widgetWidth,j.widgetHeight),re(j.x,j.y)}}function pt(n){let a=ye;if(!a||n.pointerId!==a.pointerId)return;ye=null,h?.classList.remove("is-moving","is-resizing","is-snapped");try{if(a.el.hasPointerCapture(n.pointerId))a.el.releasePointerCapture(n.pointerId)}catch{}q=nn(ge,fe,K,U,window.innerWidth,H()),we()}function mt(n){n.addEventListener("pointermove",yn),n.addEventListener("pointerup",pt),n.addEventListener("pointercancel",pt),n.addEventListener("lostpointercapture",pt)}function kn(){if(o)return!0;try{o=t.ui.createFloatWidget({width:K,height:U,initialPosition:{x:Math.max(0,Math.round((window.innerWidth-K)/2)),y:ve+Math.max(0,Math.round((H()-U)/2))},snapToEdge:!1,tooltip:"Image Viewer",chromeless:!0})}catch(n){return console.error("[Image Viewer] Failed to create float widget:",n),!1}return o.setVisible(!1),o.onDragEnd((n)=>{q=null,re(n.x,n.y-ve),q=nn(ge,fe,K,U,window.innerWidth,H())}),!0}function $t(n){return Oe(r.dockSizes[n]??Vn(n,window.innerWidth,H()),n,window.innerWidth,H())}function qe(){if(!s)return;h?.remove();try{s.destroy()}catch{}s=null}function Ue(){if(!h)return;let n=Le(m);h.classList.toggle("is-docked",!!n);for(let a of["left","right","top","bottom"])h.classList.toggle("dock-"+a,n===a);h.querySelectorAll("[data-mode]").forEach((a)=>{a.classList.toggle("active",a.dataset.mode===m)})}function Se(n){if(!h)return!1;if(ue)clearTimeout(ue),ue=null;let a=Le(m);if(ve=Ye(),!a){if(qe(),!kn()||!o)return!1;let d=o.isVisible()&&P;if(h.parentElement!==o.root)o.root.appendChild(h);if(Ue(),h.classList.remove("pop-out"),Ft(d),o.setVisible(!0),n)h.classList.remove("pop-in"),h.offsetWidth,h.classList.add("pop-in")}else{if(o?.isVisible())o.setVisible(!1);if(typeof t.ui.requestDockPanel!=="function")return console.warn("[Image Viewer] This Lumiverse build has no dock panel API; staying in float mode"),m="float",Se(n);if(!s){S(a,f);try{s=t.ui.requestDockPanel({edge:a,title:"Image Viewer",size:$t(a),minSize:St(a,window.innerWidth,H()),maxSize:Oe(1/0,a,window.innerWidth,H()),resizable:!1,chromeless:!0})}catch(d){return console.warn("[Image Viewer] Dock panel unavailable, falling back to float:",d),m="float",Se(n)}s.root.style.cssText="display:flex;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;",s.onVisibilityChange((d)=>{P=d})}if(h.classList.remove("pop-in","pop-out"),h.parentElement!==s.root)s.root.appendChild(h);Ue(),s.expand()}return P=!0,!0}function He(n){if(n===m&&P){X();return}let a=m;if(m=n,m!=="float")r.lastDock=m;if(P){if(a!==m)qe();if(!Se(!1))m=a}else Ue();X(),we()}function Bt(){He(m==="float"?r.lastDock:"float")}function gt(){if(!P||!h)return;if(T){It(T.id),Kt();return}if(X(),P=!1,ye=null,m==="float"&&o)h.classList.remove("pop-in"),h.classList.add("pop-out"),ue=setTimeout(()=>{if(ue=null,!P)vt()},150);else vt();Y(f),C()}function Kt(){if(D||!P)return;if(D=!0,X(),ye=null,m==="float")o?.setVisible(!1);else qe();if(u===f)u=null;C()}function Mn(){if(!D)return;if(D=!1,G||m!=="float"||!o)G=!1,Se(!0);else ve=Ye(),dt(),o.setVisible(!0);C()}function ft(){h?.classList.toggle("is-pinned",!!T);let n=h?.querySelector(".iv-pin-label");if(n)n.textContent=T?"Unpin from Message":"Pin to Message"}function vt(){if(ne)return;if(ne=!0,P=!1,ue)clearTimeout(ue);ue=null,qe();try{o?.destroy()}catch{}o=null,h?.remove();let n=l.indexOf(f);if(n>=0)l.splice(n,1);if(u===f)u=null;C()}function En(){if(!o||m!=="float")return;let n=o.root;for(let a=0;a<4&&n;a++){let d=getComputedStyle(n).position;if(d==="fixed"||d==="absolute")break;n=n.parentElement}if(!n)return;if(et===null){let a=parseInt(getComputedStyle(n).zIndex,10);et=Number.isFinite(a)?a:1000}n.style.zIndex=String(et+ ++v)}function je(){if(k(f),x().length>1)En()}function Sn(){if(h)return;let n=document.createElement("div");if(n.style.cssText="display:contents;",n.innerHTML=`
        <div class="iv-container">
          <div class="iv-toolbar">
            <div class="iv-toolbar-group">
              <button class="iv-btn iv-zoom-ctl iv-wide-only" data-action="zoom-out" title="Zoom Out (-)">−</button>
              <span class="iv-zoom-pill iv-zoom-ctl" data-action="zoom-toggle" title="Click: Fit / 100% (0)">Fit</span>
              <button class="iv-btn iv-zoom-ctl iv-wide-only" data-action="zoom-in" title="Zoom In (+)">+</button>
              <button class="iv-btn iv-wide-only" data-action="rotate" title="Rotate 90° (R)">↻</button>
              <button class="iv-btn iv-wide-only" data-action="flip" title="Flip Horizontal (H)">⇄</button>
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
            <div class="iv-narrow-only">
              <div class="iv-menu-grid">
                <button class="iv-menu-btn iv-zoom-ctl" data-action="zoom-out">− Zoom Out</button>
                <button class="iv-menu-btn iv-zoom-ctl" data-action="zoom-in">+ Zoom In</button>
                <button class="iv-menu-btn" data-action="rotate">↻ Rotate</button>
                <button class="iv-menu-btn" data-action="flip">⇄ Flip</button>
              </div>
              <div class="iv-menu-divider"></div>
            </div>
            <button class="iv-menu-item" data-action="copy-image">
              <span class="iv-menu-icon">\uD83D\uDDBC</span>
              <span class="iv-action-label" data-label="Copy Image">Copy Image</span>
            </button>
            <button class="iv-menu-item" data-action="copy-url">
              <span class="iv-menu-icon">\uD83D\uDCCB</span>
              <span class="iv-action-label" data-label="Copy Image Link">Copy Image Link</span>
            </button>
            <button class="iv-menu-item" data-action="open-tab">
              <span class="iv-menu-icon">↗</span>
              <span>Open in New Tab</span>
            </button>
            <button class="iv-menu-item" data-action="download">
              <span class="iv-menu-icon">⬇</span>
              <span>Download Image</span>
            </button>
            <div class="iv-menu-divider"></div>
            <button class="iv-menu-item" data-action="toggle-pin" title="Attach this window to its chat message">
              <span class="iv-menu-icon">\uD83D\uDCCC</span>
              <span class="iv-pin-label">Pin to Message</span>
            </button>
            <button class="iv-menu-item" data-action="toggle-multi" title="Clicking another image opens a new window instead of replacing this one">
              <span class="iv-menu-icon iv-multi-icon">☑</span>
              <span>Open Images in New Windows</span>
            </button>
            <button class="iv-menu-item iv-siblings-only" data-action="close-all">
              <span class="iv-menu-icon">✕</span>
              <span>Close All Windows</span>
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
      `,h=n.firstElementChild,h.remove(),he=h.querySelector(".iv-toolbar"),E=h.querySelector(".iv-viewport"),$e=h.querySelector(".iv-img-wrapper"),ie=h.querySelector(".iv-img"),Be=h.querySelector(".iv-spinner"),it=h.querySelector(".iv-error"),ot=h.querySelector(".iv-zoom-pill"),We=h.querySelector(".iv-btn-imglock"),Ce=h.querySelector(".iv-layout-menu"),De=h.querySelector(".iv-more-menu"),he?.addEventListener("pointerdown",(c)=>{if(c.target.closest("button, input, select, .iv-zoom-pill, .iv-menu"))return;if(m!=="float")return;ut(c,he,me?"toolbar-resize":"move")}),he)mt(he);h.querySelectorAll(".iv-corner").forEach((c)=>{c.addEventListener("pointerdown",(w)=>{ut(w,c,"corner",c.dataset.corner||"se")}),mt(c)}),h.addEventListener("click",(c)=>{let w=c.target.closest("[data-action]");if(!w)return;switch(w.getAttribute("data-action")){case"zoom-in":Ke(1.25);break;case"zoom-out":Ke(0.8);break;case"zoom-toggle":Ot();break;case"rotate":Xt(),Y(f);break;case"flip":be=!be,oe(),Y(f);break;case"toggle-pin":X(),cn(f);break;case"layout-menu":case"more-menu":{let M=w.getAttribute("data-action")==="layout-menu"?Ce:De;if(!M)break;let ae=M.style.display==="flex";X(),M.style.display=ae?"none":"flex";break}case"set-mode":He(w.dataset.mode||"float");break;case"anchor":Ee(w.dataset.anchor),we(),X();break;case"toggle-lock":at(),X();break;case"reset-window":xn();break;case"toggle-image-lock":lt(),X();break;case"copy-url":if(Z)_t(w,navigator.clipboard.writeText(new URL(Z,window.location.origin).toString()));break;case"copy-image":if(Z)_t(w,on(Z));break;case"toggle-multi":r.multiWindow=!r.multiWindow,Et(r),b();break;case"close-all":L();break;case"open-tab":if(Z)window.open(Z,"_blank","noopener,noreferrer"),X();break;case"download":if(Z){let M=document.createElement("a");M.href=Z,M.download="",M.rel="noopener",document.body.appendChild(M),M.click(),M.remove(),X()}break;case"close":gt();break}}),E?.addEventListener("wheel",(c)=>{if(R||!E)return;c.preventDefault();let w=E.getBoundingClientRect(),M=c.clientX-w.left-w.width/2,ae=c.clientY-w.top-w.height/2,ht=c.deltaY<0?1.15:0.8695652173913044,Ie=Math.min(10,Math.max(0.2,F*ht));Q=M-(M-Q)*Ie/F,ee=ae-(ae-ee)*Ie/F,F=Math.round(Ie*1000)/1000,oe()},{passive:!1}),h.addEventListener("pointerdown",()=>je(),!0);let a=new Map,d=null,W=()=>{let[c,w]=[...a.values()],M=E.getBoundingClientRect();return{dist:Math.max(1,Math.hypot(c.x-w.x,c.y-w.y)),midX:(c.x+w.x)/2-M.left-M.width/2,midY:(c.y+w.y)/2-M.top-M.height/2}},O=(c)=>{if(a.delete(c.pointerId),a.size<2)d=null};E?.addEventListener("pointerdown",(c)=>{if(c.pointerType==="touch")a.set(c.pointerId,{x:c.clientX,y:c.clientY});if(a.size===2&&!R&&E){c.preventDefault(),xe=!1,E.classList.remove("panning"),d={...W(),scale:F,panX:Q,panY:ee};return}if(c.button!==0||!E)return;if(R){if(m==="float")if(!me)ut(c,E,"move");else c.preventDefault();return}c.preventDefault(),xe=!0,Ht=c.clientX-Q,Vt=c.clientY-ee,E.classList.add("panning"),E.setPointerCapture(c.pointerId)}),E?.addEventListener("pointermove",(c)=>{if(a.has(c.pointerId))a.set(c.pointerId,{x:c.clientX,y:c.clientY});if(d&&a.size>=2&&!R){let w=W(),M=Math.min(10,Math.max(0.2,d.scale*w.dist/d.dist));Q=w.midX-(d.midX-d.panX)*M/d.scale,ee=w.midY-(d.midY-d.panY)*M/d.scale,F=Math.round(M*1000)/1000,oe();return}if(!xe||R)return;Q=c.clientX-Ht,ee=c.clientY-Vt,oe()});let _=(c)=>{if(!xe)return;xe=!1,E?.classList.remove("panning");try{if(E?.hasPointerCapture(c.pointerId))E.releasePointerCapture(c.pointerId)}catch{}};if(E?.addEventListener("pointerup",O),E?.addEventListener("pointercancel",O),E?.addEventListener("pointerup",_),E?.addEventListener("pointercancel",_),E?.addEventListener("lostpointercapture",_),E)mt(E);E?.addEventListener("dblclick",(c)=>{if(R||!E)return;if(F===1&&Q===0&&ee===0){let w=E.getBoundingClientRect(),M=c.clientX-w.left-w.width/2,ae=c.clientY-w.top-w.height/2;F=2,Q=M-M*2,ee=ae-ae*2}else Re();oe()});let A=h.querySelector(".iv-dock-resizer");A?.addEventListener("pointerdown",(c)=>{let w=Le(m);if(!w||!s||c.button!==0)return;c.preventDefault(),c.stopPropagation(),se={pointerId:c.pointerId,startX:c.clientX,startY:c.clientY,startSize:$t(w)},A.classList.add("is-active"),A.setPointerCapture(c.pointerId)}),A?.addEventListener("pointermove",(c)=>{let w=Le(m);if(!se||!w||!s||c.pointerId!==se.pointerId)return;let M=c.clientX-se.startX,ae=c.clientY-se.startY,ht=w==="left"?M:w==="right"?-M:w==="top"?ae:-ae,Ie=Oe(se.startSize+ht,w,window.innerWidth,H());r.dockSizes[w]=Ie,s.setSize(Ie)});let j=(c)=>{if(!se||c.pointerId!==se.pointerId)return;se=null,A?.classList.remove("is-active");try{if(A?.hasPointerCapture(c.pointerId))A.releasePointerCapture(c.pointerId)}catch{}we()};A?.addEventListener("pointerup",j),A?.addEventListener("pointercancel",j),A?.addEventListener("lostpointercapture",j),st(),ct(),Ue(),b()}async function In(n,a="Image Preview",d=null){let W=yt(n);if(Z=W,!T)ce=d;if(!await hn())try{if(!(await t.permissions.request(["ui_panels"],{reason:"Image Viewer needs permission to open floating image panels."})).includes("ui_panels"))return}catch(_){console.warn("[Image Viewer] ui_panels permission request rejected:",_);return}if(ne)return;if(Sn(),!h)return;if(Be?.classList.add("active"),it?.classList.remove("active"),ie)ie.style.opacity="0";X();let O=new Image;O.onload=()=>{if(Z!==W)return;if(Be?.classList.remove("active"),Fe=O.naturalWidth||600,Xe=O.naturalHeight||400,tt=Fe/Xe,pe=de?.rotation??0,be=de?.flipH??!1,ie)ie.src=W,ie.alt=a,ie.style.opacity="1";if(Re(),st(),ct(),ne)return;if(D){G=!0,P=!0;return}if(!Se(!P))console.error("[Image Viewer] Could not mount viewer");ft(),je(),Y(f),C()},O.onerror=()=>{if(Z!==W)return;if(Be?.classList.remove("active"),it?.classList.add("active"),ie)ie.style.opacity="0";if(ne||D)return;Se(!P),ft(),je(),C()},O.src=W}function Ln(n){if(!P)return;switch(n.key){case"Escape":if(n.preventDefault(),bn())X();else gt();break;case"+":case"=":if(!R)n.preventDefault(),Ke(1.25);break;case"-":case"_":if(!R)n.preventDefault(),Ke(0.8);break;case"0":if(!R)n.preventDefault(),Re();break;case"1":if(!R)n.preventDefault(),Ot();break;case"r":case"R":n.preventDefault(),Xt(),Y(f);break;case"h":case"H":n.preventDefault(),be=!be,oe(),Y(f);break;case"l":case"L":if(m==="float")n.preventDefault(),at();break;case"p":case"P":n.preventDefault(),lt();break;case"d":case"D":n.preventDefault(),Bt();break}}return f={show:In,close:gt,destroy:vt,handleKey:Ln,onWindowResize(){if(ve=Ye(),!P)return;let n=Le(m);if(!n)wn();else if(s)s.setMinSize(St(n,window.innerWidth,H())),s.setMaxSize(Oe(1/0,n,window.innerWidth,H()))},contains:(n)=>!!h&&h.contains(n),closeMenus:X,focus:je,isOpen:()=>P&&!D,url:()=>Z,dockEdge:()=>s?Le(m):null,floatOrigin:()=>P&&m==="float"?{x:ge,y:fe}:null,setMode:He,toggleDock:Bt,toggleLock:at,toggleImageLock:lt,reset:Re,setAnchor(n){if(m!=="float")He("float");Ee(n),we()},getState:()=>({url:Z,alt:ie?.alt||"Image Preview",mode:m,x:Math.round(ge),y:Math.round(fe),w:Math.round(K),h:Math.round(U),anchor:q,rotation:pe,flipH:be}),sourceMessage:()=>ce,pinId:()=>T?.id??null,setPin(n){if(T=n,n)ce=n.messageId;ft()},suspend:Kt,resume:Mn,isSuspended:()=>D},f}function b(){document.querySelectorAll(".iv-multi-icon").forEach((e)=>{e.textContent=r.multiWindow?"☑":"☐"})}function L(){for(let e of[...l])e.close()}function I(e,o,s=null){let f=yt(e),m=x(),P=m.find((ne)=>ne.url()===f);if(P){P.focus();return}let D=m.filter((ne)=>!ne.pinId()),G=g(),T=G&&!G.pinId()?G:D[D.length-1];if(T&&!r.multiWindow){T.show(e,o,s);return}if(D.length>=r.maxWindows){D[0].show(e,o,s);return}let ce=G?.floatOrigin()??[...m].reverse().find((ne)=>ne.floatOrigin())?.floatOrigin()??null,de=y({primary:m.length===0,cascadeFrom:m.length?ce??{x:0,y:0}:null});l.push(de),k(de),de.show(e,o,s)}let V=null,z=!1;function N(){if(V)clearTimeout(V);if(V=null,z)return;if(!r.restoreWindows){wt();return}let e=l.filter((o)=>o.isOpen()&&!o.pinId()).map((o)=>o.getState());Zt(e.filter((o)=>!!o.url))}function Y(e){let o=e.pinId();if(o&&e.url())B.updateState(o,e.getState());if(V)clearTimeout(V);V=setTimeout(N,300)}function Je(){if(!r.restoreWindows)return;let e=Gt().slice(0,r.maxWindows);if(!e.length)return;z=!0,e.forEach((o,s)=>{let f=y({primary:s===0,cascadeFrom:null,restore:o});l.push(f),f.show(o.url,o.alt)}),setTimeout(()=>{z=!1,N()},2500)}let B=new xt(t.settings),J=t.getActiveChat?.()?.chatId??null,le=new Set,te=new Map,Pe=(e)=>l.find((o)=>o.pinId()===e);function It(e){le.add(e),_e(e)}function cn(e){let o=e.pinId();if(o){e.setPin(null),le.delete(o),B.remove(o),Y(e);return}let s=t.getActiveChat?.()?.chatId??J,f=e.sourceMessage()??t.messages.getLatestMessageId?.()??null;if(!s||!f){console.warn("[Image Viewer] No chat message to pin to");return}J=s;let m={id:Jt(),chatId:s,messageId:f,createdAt:Date.now(),state:e.getState()};e.setPin(m),B.upsert(m),Y(e)}function _e(e){let o=te.get(e);if(!o)return;let s=Pe(e),f=!!s&&s.isOpen();o.el.classList.toggle("is-shown",f),o.el.setAttribute("title",f?"Hide pinned image":"Show pinned image")}function Lt(e){if(te.get(e.id))return!0;let s=t.dom.findMessageElement(e.messageId);if(!s)return!1;let f=t.dom.inject(s,'<span class="iv-pin-chip" role="button" tabindex="0"><span class="iv-pin-chip-icon">\uD83D\uDCCC</span><span class="iv-pin-chip-text">Pinned image</span></span>',"beforeend"),m=f.getBoundingClientRect(),P=m.width>0&&m.bottom>0&&m.top<window.innerHeight,D={el:f,io:null,visible:P};te.set(e.id,D);let G=(T)=>{T.preventDefault(),T.stopPropagation(),dn(e.id)};if(f.addEventListener("click",G),f.addEventListener("keydown",(T)=>{let ce=T.key;if(ce==="Enter"||ce===" ")G(T)}),typeof IntersectionObserver==="function")D.io=new IntersectionObserver((T)=>{D.visible=T[T.length-1]?.isIntersecting??!1,ze(e.id)}),D.io.observe(f);else D.visible=!0;return _e(e.id),!0}function Qe(e){let o=te.get(e);if(!o)return;o.io?.disconnect();try{t.dom.uninject(o.el)}catch{o.el.remove()}te.delete(e)}function ze(e){let o=B.get(e);if(!o||o.chatId!==J)return;let s=te.get(e),f=Pe(e);if(r.pinsFollowMessage&&!s&&f?.isOpen()&&!le.has(e))return;if(!le.has(e)&&(!r.pinsFollowMessage||!!s?.visible))if(f)f.resume();else{let P=y({primary:!1,cascadeFrom:null,restore:o.state,pin:o});l.push(P),P.show(o.state.url,o.state.alt,o.messageId)}else if(f&&f.isOpen())f.suspend();_e(e)}function dn(e){let o=Pe(e);if(o&&o.isOpen()){It(e),o.suspend(),_e(e);return}le.delete(e);let s=te.get(e);if(s)s.visible=!0;ze(e),Pe(e)?.focus()}function Te(){let e=B.forChat(J),o=new Set(e.map((s)=>s.id));for(let s of[...te.keys()])if(!o.has(s))Qe(s);for(let s of[...l]){let f=s.pinId();if(!f)continue;let m=B.get(f);if(!m)s.setPin(null),s.close();else if(m.chatId!==J)s.destroy()}for(let s of e)Lt(s),ze(s.id)}function Pt(e){if(e===J)return;J=e,le.clear();for(let o of[...te.keys()])Qe(o);Te();for(let o of[300,1200])setTimeout(Te,o)}let un=B.onChange(Te),zt=[],Ne=(e,o)=>{try{zt.push(t.events.on(e,(s)=>o(s??{})))}catch{}};Ne("CHAT_SWITCHED",(e)=>Pt(typeof e.chatId==="string"?e.chatId:null));let Tt=(e)=>{if(typeof e.chatId==="string"&&e.chatId!==J)Pt(e.chatId);let o=typeof e.messageId==="string"?e.messageId:null;if(!o)return;for(let s of B.forChat(J))if(s.messageId===o&&Lt(s))ze(s.id)};Ne("CHARACTER_MESSAGE_RENDERED",Tt),Ne("USER_MESSAGE_RENDERED",Tt),Ne("MESSAGE_DELETED",(e)=>{if(typeof e.messageId==="string")B.removeWhere((o)=>o.messageId===e.messageId)});let pn=en(t,{getSettings:()=>({multiWindow:r.multiWindow,maxWindows:r.maxWindows,restoreWindows:r.restoreWindows,pinsFollowMessage:r.pinsFollowMessage,panLockedByDefault:r.panLockedByDefault,openSizePct:r.openSizePct}),update(e){if(Object.assign(r,e),Et(r),"multiWindow"in e)b();if("restoreWindows"in e)N();if("pinsFollowMessage"in e)for(let o of B.forChat(J))ze(o.id)},pins:B,activeChatId:()=>J,openPin(e){le.delete(e);let o=te.get(e);if(o)o.visible=!0;let s=B.get(e);if(!s||s.chatId!==J)return;let f=Pe(e);if(f)f.resume(),f.focus();else{let m=y({primary:!1,cascadeFrom:null,restore:s.state,pin:s});l.push(m),m.show(s.state.url,s.state.alt,s.messageId)}},removePin(e){le.delete(e),B.remove(e)},forgetWindows(){wt()}}),Wt=(e)=>{if(e.ctrlKey||e.metaKey||e.altKey)return;let o=document.activeElement;if(o&&(o.tagName==="INPUT"||o.tagName==="TEXTAREA"||o.tagName==="SELECT"||o.isContentEditable))return;g()?.handleKey(e)};document.addEventListener("keydown",Wt);let Ct=(e)=>{for(let o of l)if(!o.contains(e.target))o.closeMenus()};document.addEventListener("pointerdown",Ct);let Dt=(e)=>{let o=e.target;if(!o)return;if(l.some((T)=>T.contains(o)))return;let s=o.tagName==="IMG"?o:o.closest("img");if(!s)return;let f=s.getAttribute("src");if(!f)return;let m=f.includes("/avatar")||!!s.closest(".avatar, [data-avatar], .portrait"),P=f.includes("/api/v1/images")||f.includes("/api/v1/image-gen")||!!s.closest(".attachment, [data-attachment]"),D=!!s.closest(".message-content, .chat-message, [data-message-id]"),G=s.naturalWidth>=32&&s.naturalHeight>=32;if(m||P||D||G){e.preventDefault(),e.stopPropagation();let T=null;try{T=t.dom.getMessageId(s)}catch{}I(f,s.alt||"Image Preview",T)}};document.addEventListener("click",Dt,!0);let At=()=>{for(let e of l)e.onWindowResize()};window.addEventListener("resize",At);try{p=t.ui.registerInputBarAction({id:"view-character-avatar",label:"View Character Avatar",iconSvg:`
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="5"/>
          <path d="M20 21a8 8 0 1 0-16 0"/>
        </svg>
      `}),p.onClick(()=>{let e=t.getActiveChat?.();if(e?.characterId)I(`/api/v1/characters/${e.characterId}/avatar`,"Character Avatar");else{let o=document.querySelector('img[src*="/avatar"]');if(o?.src)I(o.src,"Avatar")}})}catch(e){console.debug("[Image Viewer] Input bar action registration skipped:",e)}let mn=t.events.on("PERMISSION_CHANGED",async(e)=>{let o=e;if(o?.permission==="ui_panels"&&!o.granted)for(let s of[...l])s.destroy()}),gn={show:I,close:()=>g()?.close(),closeAll:L,reset:()=>g()?.reset(),setAnchor:(e)=>g()?.setAnchor(e),setMode:(e)=>g()?.setMode(e),toggleDock:()=>g()?.toggleDock(),toggleLock:()=>g()?.toggleLock(),toggleImageLock:()=>g()?.toggleImageLock(),copyImage:()=>{let e=g()?.url();return e?on(e):Promise.resolve()},windowCount:()=>x().length,resolveUrl:yt};window.__lumiverseImageViewer=gn,window.testImageViewer=(e)=>{I(e||`https://picsum.photos/seed/${Date.now()}/800/600`)};let fn=[setTimeout(()=>{Je(),Te(),B.sync()},0),setTimeout(Te,800)],Rt=()=>N();return window.addEventListener("pagehide",Rt),console.log("[Image Viewer] Extension loaded"),()=>{if(document.removeEventListener("keydown",Wt),document.removeEventListener("click",Dt,!0),document.removeEventListener("pointerdown",Ct),window.removeEventListener("resize",At),mn?.(),p?.destroy(),fn.forEach(clearTimeout),window.removeEventListener("pagehide",Rt),V)N();z=!0,un(),zt.forEach((e)=>e());for(let e of[...te.keys()])Qe(e);pn?.();for(let e of[...l])e.destroy();B.dispose(),i(),delete window.__lumiverseImageViewer,delete window.testImageViewer,console.log("[Image Viewer] Extension unloaded")}}export{Mt as DEFAULT_PREFS,Dn as DOCK_MIN_SIZE,sn as MIN_VIEWPORT_WIDTH,Ze as NARROW_BREAKPOINT,Yn as calculateActualSizeScale,Wn as calculateAnchorPosition,Hn as calculateCornerResize,Cn as calculateEdgeFlushPlacement,tn as calculateFitDimensions,Ge as calculateResizeDimensions,Oe as clampDockSize,on as copyImageToClipboard,Vn as defaultDockSize,nn as detectAnchor,St as dockMinSize,kt as fitScreenFraction,On as imageUrlToPngBlob,Ye as measureTopInset,yt as resolveFullImageUrl,An as responsiveMinViewportWidth,qn as setup,Rn as snapPosition};
