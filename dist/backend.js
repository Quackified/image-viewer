// @bun
spindle.log.info("[Image Viewer] Extension backend initialized");spindle.onFrontendMessage((e,n)=>{if(e&&typeof e==="object"&&e.type==="ping")spindle.sendToFrontend({type:"pong",timestamp:Date.now()},n)});
