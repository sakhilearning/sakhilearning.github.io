const BUILD_ID='__SAKHI_BUILD_ID__';
const CACHE='sakhi-magic-learning-'+BUILD_ID;
const APP_ASSETS=['./build-info.js','./design-tokens.css','./styles.css','./interactions.css','./runtime-stability.css','./visuals.css','./kid-upgrade.css','./sakhi-shell.css','./settings-controls.css','./pwa-update.css','./daily-journey.css','./supabase-config.js','./curriculum.js','./persistence.js','./phoneme-audio.js','./speech-service.js','./app.js','./settings-service.js','./adventure-service.js','./domain-theme-registry.js','./core-learning-services.js','./activity-contract.js','./reward-service.js','./scheduler.js','./interaction-engine.js','./challenge-bank.js','./foundation-verification-bank.js','./adaptive-acceleration-service.js','./ui-hooks.js','./progress-service.js','./parent-auth-service.js','./asset-service.js','./visuals.js','./kid-upgrade.js','./adaptive-engine.js','./backend-bridge.js','./sakhi-shell.js','./settings-ui.js','./pwa-update.js','./daily-journey-service.js','./assets/audio/phonemes/phoneme_t.ogg','./assets/audio/phonemes/phoneme_p.ogg','./unicorn-icon.svg'];
const REVALIDATE_PATHS=new Set(['/','/index.html','/sw.js','/version.json','/manifest.json']);
function isRevalidateRequest(url){return REVALIDATE_PATHS.has(url.pathname)||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/sw.js')||url.pathname.endsWith('/version.json')||url.pathname.endsWith('/manifest.json');}
function isSameOrigin(request){try{return new URL(request.url).origin===self.location.origin}catch{return false}}
async function deleteOldSakhiCaches(){const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('sakhi-magic-learning-')&&k!==CACHE).map(k=>caches.delete(k)));}
async function cacheAppShell(){const cache=await caches.open(CACHE);for(const asset of APP_ASSETS){try{await cache.add(new Request(asset,{cache:'reload'}));}catch(error){console.warn('Sakhi cache skip',asset,error?.message||error);}}}
self.addEventListener('install',event=>{event.waitUntil(cacheAppShell());});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([deleteOldSakhiCaches(),self.clients.claim()]));});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING'){self.skipWaiting();return;}if(event.data?.type==='SAKHI_PURGE_CACHES'){event.waitUntil(deleteOldSakhiCaches().then(()=>event.ports?.[0]?.postMessage({type:'SAKHI_CACHES_PURGED',cache:CACHE})));}});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||!isSameOrigin(request))return;
  const url=new URL(request.url);
  if(isRevalidateRequest(url)){
    event.respondWith(fetch(new Request(request,{cache:'no-store'})).catch(()=>caches.match(request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response&&response.ok&&response.type==='basic'){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;})).catch(()=>request.destination==='document'?caches.match('./index.html'):undefined));
});
