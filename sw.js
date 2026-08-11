const CACHE='empire-forge-v35-3';
const ASSETS=['./','./index.html','./config.js','./manifest.json','./assets/icon.svg'];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache=>cache.addAll(ASSETS))
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  const url=new URL(req.url);

  // API nunca entra no cache.
  if(url.origin==='https://empireforge-pwa-v35-2.onrender.com'){
    event.respondWith(fetch(req,{cache:'no-store'}));
    return;
  }

  // Navegação/config: network-first para receber atualização imediatamente.
  if(req.mode==='navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/config.js')){
    event.respondWith(
      fetch(req,{cache:'no-store'}).then(resp=>{
        const copy=resp.clone();
        caches.open(CACHE).then(c=>c.put(req,copy));
        return resp;
      }).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached=>cached || fetch(req).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put(req,copy));
      return resp;
    }))
  );
});
