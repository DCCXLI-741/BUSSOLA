// GE.S.PER. – l'app funziona anche senza rete. Con la rete prende SEMPRE la versione più recente
// (chiede al server se è cambiata, senza fidarsi della cache), senza rete usa la copia nel telefono.
// I DATI non passano mai di qui: restano nel dispositivo (IndexedDB).
const C="gesper-v3.8";
const FILES=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("gesper")&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{if(e.data==="skip")self.skipWaiting()});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);if(r.method!=="GET"||u.origin!==location.origin)return;
  const page=r.mode==="navigate"||/\/(index\.html)?$/.test(u.pathname);
  if(page){
    // prima la rete (versione aggiornata), poi la copia salvata
    e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put("index.html",cp))}return res})
      .catch(()=>caches.match("index.html").then(x=>x||caches.match("./"))));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})));
});
