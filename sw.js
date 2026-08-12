const CACHE='empire-forge-v36-3';
const ASSETS=['./','./index.html','./config.js','./manifest.json','./assets/icon.svg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))),self.clients.claim()]));});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(u.origin==='https://empireforge-pwa-v35-2.onrender.com'){e.respondWith(fetch(r,{cache:'no-store'}));return;}if(r.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/config.js')){e.respondWith(fetch(r,{cache:'no-store'}).then(x=>{const c=x.clone();caches.open(CACHE).then(k=>k.put(r,c));return x;}).catch(()=>caches.match(r).then(x=>x||caches.match('./index.html'))));return;}e.respondWith(caches.match(r).then(x=>x||fetch(r)));});
