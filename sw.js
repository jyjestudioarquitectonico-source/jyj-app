const V='jyj-v5';
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(['/jyj-app/icons/icon-192.png','/jyj-app/icons/icon-512.png','/jyj-app/manifest.json'])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.pathname.endsWith('.html')||u.pathname.endsWith('/')||u.pathname.includes('version.json')){
    e.respondWith(fetch(e.request,{cache:'no-cache'}).catch(()=>caches.match(e.request)));return;
  }
  e.respondWith(caches.match(e.request).then(h=>{if(h)return h;return fetch(e.request).then(res=>{if(res&&res.status===200)caches.open(V).then(c=>c.put(e.request,res.clone()));return res;});}));
});