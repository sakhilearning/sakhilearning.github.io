(function(){
'use strict';
const SESSION_KEY='sakhiParentUnlocked';
const LAST_ACTIVE_KEY='sakhiParentLastActive';
const PARENT_HASH='8578956985bec6d251df470861420ae371eed8fb6e1f873014b2715f9327dbcc';
const INACTIVITY_MS=15*60*1000;
async function sha256(v){const bytes=new TextEncoder().encode(v);const hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');}
function expired(){const last=Number(sessionStorage.getItem(LAST_ACTIVE_KEY)||0);return !last||Date.now()-last>INACTIVITY_MS;}
function isUnlocked(){if(sessionStorage.getItem(SESSION_KEY)!=='1')return false;if(expired()){lock();return false}return true;}
function touch(){if(isUnlocked())sessionStorage.setItem(LAST_ACTIVE_KEY,String(Date.now()));}
async function unlock(passcode){const ok=(await sha256(String(passcode||'')))===PARENT_HASH;if(ok){sessionStorage.setItem(SESSION_KEY,'1');sessionStorage.setItem(LAST_ACTIVE_KEY,String(Date.now()));}return ok;}
function lock(){sessionStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(LAST_ACTIVE_KEY);}
function requireAccess(){if(isUnlocked()){touch();return true}window.dispatchEvent(new CustomEvent('sakhi-parent-auth-required'));return false;}
['pointerdown','keydown','touchstart'].forEach(type=>document.addEventListener(type,()=>touch(),{passive:true,capture:true}));
setInterval(()=>{if(sessionStorage.getItem(SESSION_KEY)==='1'&&expired()){lock();window.dispatchEvent(new CustomEvent('sakhi-parent-auth-expired'));}},60000);
const service=Object.freeze({unlock,lock,isUnlocked,touch,requireAccess,inactivityMinutes:15});
window.ParentAuthService=service;
})();
