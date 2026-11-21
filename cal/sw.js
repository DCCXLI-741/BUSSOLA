/* Forma · Calendario: trasforma il link in un vero file .ics, senza inviare dati a nessun server */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||!u.pathname.endsWith('/forma.ics'))return;
 let t='';try{const b=atob((u.searchParams.get('d')||'').replace(/-/g,'+').replace(/_/g,'/'));t=new TextDecoder().decode(Uint8Array.from(b,c=>c.charCodeAt(0)))}catch(x){}
 e.respondWith(new Response(t,{status:t?200:400,headers:{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':'inline; filename="forma-allenamenti.ics"','Cache-Control':'no-store'}}))});
