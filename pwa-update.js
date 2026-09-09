(function(){
'use strict';
const TEST_NO_RELOAD='__SAKHI_TEST_DISABLE_RELOAD';
let registrationRef=null;
let pendingRegistration=null;
let updateCheckAt=null;
let refreshing=false;
let refreshRequested=false;
let reloadCount=0;
let registered=false;
function buildInfo(){return window.SAKHI_BUILD_INFO||{build:window.SAKHI_BUILD_ID||'dev-local',commit:'unknown',built_at:'unknown'};}
function emit(name,detail={}){window.dispatchEvent(new CustomEvent(name,{detail}));}
function isStandalone(){return window.matchMedia?.('(display-mode: standalone)')?.matches||window.navigator.standalone===true;}
function isIOS(){const ua=navigator.userAgent||'';return /iPad|iPhone|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}
function isSafari(){const ua=navigator.userAgent||'';return /Safari/i.test(ua)&&!/CriOS|FxiOS|EdgiOS|Chrome|Chromium|Android/i.test(ua);}
function installStatus(){
  const standalone=isStandalone(),ios=isIOS(),safari=isSafari();
  let guidance='Use your browser install option to add Sakhi to this device.';
  if(standalone)guidance='Installed on this device';
  else if(ios&&safari)guidance='iPhone/iPad: Tap Share → Add to Home Screen.';
  else if(safari)guidance='Safari: use Share → Add to Dock or Add to Home Screen when available.';
  else guidance='Use the browser install button or menu to install Sakhi.';
  return {standalone,installed:standalone,isIOS:ios,isSafari:safari,guidance,display:standalone?'Installed on this device':guidance};
}
function activeChildActivity(){
  const current=window.ActivityRenderer?.current?.();
  const state=current?.status||window.ActivityRenderer?.state?.();
  return !!current&&!['SAVED','ERROR',null,undefined].includes(state);
}
function banner(){
  let el=document.querySelector('[data-pwa-update-banner]');
  if(el)return el;
  el=document.createElement('aside');
  el.className='sakhi-update-banner';
  el.setAttribute('data-pwa-update-banner','');
  el.setAttribute('role','status');
  el.setAttribute('aria-live','polite');
  el.hidden=true;
  el.innerHTML='<div><strong>✨ A new Sakhi version is ready.</strong><span data-pwa-update-copy>Refresh to get the latest learning updates and fixes.</span></div><div class="sakhi-update-actions"><button type="button" class="sakhi-update-refresh" data-pwa-refresh>Refresh now</button><button type="button" class="sakhi-update-later" data-pwa-later>Later</button></div>';
  el.querySelector('[data-pwa-refresh]').addEventListener('click',()=>applyUpdate());
  el.querySelector('[data-pwa-later]').addEventListener('click',()=>dismissUpdate());
  document.body.appendChild(el);
  return el;
}
function updateBannerContext(){
  const el=document.querySelector('[data-pwa-update-banner]');
  if(!el)return;
  const active=activeChildActivity();
  el.classList.toggle('active-session',active);
  const copy=el.querySelector('[data-pwa-update-copy]');
  if(copy)copy.textContent=active?'Refresh when this activity is safely finished. Sakhi will not interrupt learning.':'Refresh to get the latest learning updates and fixes.';
}
function showUpdateAvailable(registration){
  pendingRegistration=registration||pendingRegistration||registrationRef;
  const el=banner();
  updateBannerContext();
  el.hidden=false;
  document.body.classList.add('sakhi-update-available');
  emit('sakhi-pwa-update-available',{build:buildInfo(),active_activity:activeChildActivity()});
  return true;
}
function dismissUpdate(){
  const el=document.querySelector('[data-pwa-update-banner]');
  if(el)el.hidden=true;
  document.body.classList.remove('sakhi-update-available');
  emit('sakhi-pwa-update-later',{build:buildInfo()});
  return true;
}
function applyUpdate(registration=pendingRegistration||registrationRef){
  const worker=registration?.waiting;
  refreshRequested=true;
  emit('sakhi-pwa-refresh-requested',{build:buildInfo(),has_waiting_worker:!!worker});
  if(worker){worker.postMessage({type:'SKIP_WAITING',build:buildInfo().build});return true;}
  registration?.update?.().catch(()=>{});
  return false;
}
function handleControllerChange(){
  if(!refreshRequested||refreshing)return;
  refreshing=true;
  reloadCount++;
  emit('sakhi-pwa-controllerchange',{build:buildInfo(),reload_count:reloadCount});
  if(window[TEST_NO_RELOAD])return;
  const key='sakhi-sw-reloaded-'+String(buildInfo().build||'unknown');
  if(sessionStorage.getItem(key)==='1')return;
  sessionStorage.setItem(key,'1');
  window.location.reload();
}
async function checkForUpdate(registration=registrationRef){
  if(!registration?.update)return {checked:false,reason:'no_registration'};
  updateCheckAt=Date.now();
  emit('sakhi-pwa-update-check',{build:buildInfo(),checked_at:updateCheckAt});
  try{const out=await registration.update();if(registration.waiting&&navigator.serviceWorker.controller)showUpdateAvailable(registration);return {checked:true,result:out};}
  catch(error){emit('sakhi-pwa-update-check-failed',{error:String(error?.message||error)});return {checked:false,error};}
}
async function fetchVersion(){
  try{const r=await fetch('./version.json',{cache:'no-store',headers:{'Cache-Control':'no-cache'}});if(!r.ok)throw new Error('version '+r.status);return await r.json();}
  catch(error){return {error:String(error?.message||error),...buildInfo()};}
}
async function registerSakhiSW(){
  if(registered&&registrationRef)return {supported:true,registration:registrationRef,duplicate:true};
  if(!('serviceWorker' in navigator))return {supported:false,reason:'unsupported'};
  try{
    const registration=await navigator.serviceWorker.register('./sw.js');
    registered=true;registrationRef=registration;
    checkForUpdate(registration);
    if(registration.waiting&&navigator.serviceWorker.controller)showUpdateAvailable(registration);
    registration.addEventListener('updatefound',()=>{
      const worker=registration.installing;
      if(!worker)return;
      worker.addEventListener('statechange',()=>{
        if(worker.state==='installed'&&navigator.serviceWorker.controller)showUpdateAvailable(registration);
      });
    });
    return {supported:true,registration};
  }catch(error){emit('sakhi-pwa-registration-failed',{error:String(error?.message||error)});return {supported:false,error};}
}
if('serviceWorker' in navigator){navigator.serviceWorker.addEventListener('controllerchange',handleControllerChange);}
window.addEventListener('sakhi-activity-opened',updateBannerContext);
window.addEventListener('sakhi-activity-saved',updateBannerContext);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&registrationRef)checkForUpdate(registrationRef);});
function status(){return {supported:'serviceWorker' in navigator,registered,hasRegistration:!!registrationRef,hasWaiting:!!(pendingRegistration?.waiting||registrationRef?.waiting),updateCheckAt,refreshRequested,refreshing,reloadCount,build:buildInfo(),install:installStatus()};}
window.SakhiPWAUpdateService=Object.freeze({register:registerSakhiSW,checkForUpdate,showUpdateAvailable,dismissUpdate,applyUpdate,fetchVersion,getStatus:status,getInstallStatus:installStatus,getBuildInfo:buildInfo,__test:{showUpdateAvailable,dismissUpdate,applyUpdate,handleControllerChange,status,setRefreshRequested:v=>{refreshRequested=!!v},reset:()=>{refreshRequested=false;refreshing=false;reloadCount=0;pendingRegistration=null;document.querySelector('[data-pwa-update-banner]')?.remove();document.body.classList.remove('sakhi-update-available');}}});
function start(){registerSakhiSW();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,0),{once:true});else setTimeout(start,0);
})();
