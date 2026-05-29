const VER='jyj-v6';
self.addEventListener('install',e=>{e.waitUntil(self.skipWaiting());});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(function(ks){return Promise.all(ks.map(function(k){return caches.delete(k);}));})
    .then(function(){return self.clients.claim();})
    .then(function(){return self.clients.matchAll({includeUncontrolled:true,type:'window'});})
    .then(function(cls){cls.forEach(function(c){try{c.navigate(c.url);}catch(e){c.postMessage({type:'FORCE_RELOAD'});}});})
  );
});
self.addEventListener('fetch',e=>{
  var u=new URL(e.request.url);
  if(u.pathname.endsWith('.html')||u.pathname.endsWith('/')||u.pathname.includes('version.json')){
    e.respondWith(fetch(e.request,{cache:'no-cache'}).catch(function(){return caches.match(e.request);}));return;
  }
  e.respondWith(caches.match(e.request).then(function(h){if(h)return h;return fetch(e.request).then(function(res){if(res&&res.status===200)caches.open(VER).then(function(c){c.put(e.request,res.clone());});return res;});}));
});