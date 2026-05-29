const VER='jyj-v3';
self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(VER).then(c=>c.addAll([
      '/jyj-app/','/jyj-app/index.html','/jyj-app/manifest.json',
      '/jyj-app/icons/icon-192.png','/jyj-app/icons/icon-512.png'
    ])).then(()=>self.skipWaiting())
  );
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==VER).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  const isNav=e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname==='/jyj-app/';
  if(isNav){
    e.respondWith(
      fetch(e.request,{cache:'no-cache'}).then(res=>{
        if(res&&res.status===200){
          const cl=res.clone();
          caches.open(VER).then(c=>c.put(e.request,cl));
          self.clients.matchAll({includeUncontrolled:true}).then(cls=>{
            cls.forEach(c=>c.postMessage({type:'SW_UPDATED'}));
          });
        }
        return res;
      }).catch(()=>caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit=>{
      if(hit)return hit;
      return fetch(e.request).then(res=>{
        if(!res||res.status!==200)return res;
        const cl=res.clone();
        caches.open(VER).then(c=>c.put(e.request,cl));
        return res;
      });
    })
  );
});
self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();
});