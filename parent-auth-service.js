(function(){
'use strict';
const SESSION_KEY='sakhiParentUnlocked',LAST_ACTIVE_KEY='sakhiParentLastActive';
const PARENT_HASH='d97fc2ca5296caa7e98d686eaaaefa1fa385b0f868ea0c78419db0cb2bd3475f';
const INACTIVITY_MS=15*60*1000;
async function sha256(v){const bytes=new TextEncoder().encode(v),hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('')}
function expired(){const last=Number(sessionStorage.getItem(LAST_ACTIVE_KEY)||0);return !last||Date.now()-last>INACTIVITY_MS}
function isUnlocked(){if(sessionStorage.getItem(SESSION_KEY)!=='1')return false;if(expired()){lock();return false}return true}
function touch(){if(isUnlocked())sessionStorage.setItem(LAST_ACTIVE_KEY,String(Date.now()))}
async function unlock(passcode){const ok=(await sha256(String(passcode||'')))===PARENT_HASH;if(ok){sessionStorage.setItem(SESSION_KEY,'1');sessionStorage.setItem(LAST_ACTIVE_KEY,String(Date.now()))}return ok}
function lock(){sessionStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(LAST_ACTIVE_KEY)}
function requireAccess(){if(isUnlocked()){touch();return true}window.dispatchEvent(new CustomEvent('sakhi-parent-auth-required'));return false}
['pointerdown','keydown','touchstart'].forEach(type=>document.addEventListener(type,()=>touch(),{passive:true,capture:true}));setInterval(()=>{if(sessionStorage.getItem(SESSION_KEY)==='1'&&expired()){lock();window.dispatchEvent(new CustomEvent('sakhi-parent-auth-expired'))}},60000);
window.ParentAuthService=Object.freeze({unlock,lock,isUnlocked,touch,requireAccess,inactivityMinutes:15});
})();
