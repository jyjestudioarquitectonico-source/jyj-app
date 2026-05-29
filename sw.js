const VER='jyj-v4';
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(['/jyj-app/','/jyj-app/index.html','/jyj-app/manifest.json','/jyj-app/icons/icon-192.png','/jyj-app/icons/icon-512.png'])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  const nav=e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname==='/jyj-app/';
  if(nav){e.respondWith(fetch(e.request,{cache:'no-cache'}).then(res=>{if(res&&res.status===200){const cl=res.clone();caches.open(VER).then(c=>c.put(e.request,cl));}return res;}).catch(()=>caches.match(e.request)));return;}
  e.respondWith(caches.match(e.request).then(h=>{if(h)return h;return fetch(e.request).then(res=>{if(!res||res.status!==200)return res;caches.open(VER).then(c=>c.put(e.request,res.clone()));return res;});}));
});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});