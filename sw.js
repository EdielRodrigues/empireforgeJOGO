const CACHE='empire-forge-v35-4';
const ASSETS=['./','./index.html','./config.js','./manifest.json','./assets/icon.svg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]));});
self.addEventListener('fetch',e=>{
  const req=e.request,url=new URL(req.url);
  if(url.origin==='https://empireforge-pwa-v35-2.onrender.com'){e.respondWith(fetch(req,{cache:'no-store'}));return;}
  if(req.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/config.js')){
    e.respondWith(fetch(req,{cache:'no-store'}).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));return r;}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));return;
  }
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));return r;})));
});
