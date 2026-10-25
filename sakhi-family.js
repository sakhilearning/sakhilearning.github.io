/* Device-local parent gate and an active-learning clock. Progress/account ownership
 * stays with SakhiProgress; no PIN or authentication secret is cloud-synced. */
window.SakhiFamily=(function(){
'use strict';
var unlockedUntil=0,lastTick=null,dirty=0;
function key(){return'sakhi.parent-pin.v1';}
function configured(){return!!localStorage.getItem(key());}
function localDay(now){var d=new Date(now===undefined?Date.now():now);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function budget(now){var date=localDay(now),s=SakhiProgress.load().settings,b=s.daily_budget;if(!b||b.date!==date){b={date:date,used_ms:0,extra_ms:0};s.daily_budget=b;}return b;}
function limit(){return Math.max(5,Math.min(120,Number(SakhiProgress.load().settings.daily_limit_minutes)||30))*60000;}
function remaining(now){var b=budget(now);return Math.max(0,limit()+(b.extra_ms||0)-(b.used_ms||0));}
function tick(active,now){now=now===undefined?Date.now():now;var elapsed=lastTick===null?0:Math.max(0,Math.min(2000,now-lastTick));lastTick=now;if(!active)return remaining(now);var b=budget(now);b.used_ms=Math.max(0,Number(b.used_ms)||0)+elapsed;dirty+=elapsed;if(dirty>=5000||remaining(now)===0){SakhiProgress.persist();dirty=0;}return remaining(now);}
function flush(){SakhiProgress.persist();dirty=0;lastTick=null;}
async function derive(pin,salt){var bytes=new TextEncoder().encode(pin),material=await crypto.subtle.importKey('raw',bytes,'PBKDF2',false,['deriveBits']);var bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new Uint8Array(salt),iterations:100000,hash:'SHA-256'},material,256);return Array.from(new Uint8Array(bits)).map(function(n){return n.toString(16).padStart(2,'0');}).join('');}
async function setPin(pin,confirmation){if(!/^\d{4,8}$/.test(pin)||pin!==confirmation)throw new Error('Enter matching PINs with 4–8 digits.');if(configured()&&!isOpen())throw new Error('Unlock the parent dashboard before changing the PIN.');var salt=Array.from(crypto.getRandomValues(new Uint8Array(16))),hash=await derive(pin,salt);localStorage.setItem(key(),JSON.stringify({salt:salt,hash:hash}));open();}
function open(){unlockedUntil=Date.now()+5*60000;}
function isOpen(){return configured()&&Date.now()<unlockedUntil;}
function lock(){unlockedUntil=0;}
async function verify(pin){var failKey=key()+'.fail',fail=JSON.parse(localStorage.getItem(failKey)||'null')||{count:0,until:0};if(fail.until>Date.now())throw new Error('Too many tries. Wait one minute before trying again.');var saved=JSON.parse(localStorage.getItem(key())||'null');if(!saved)return false;var hash=await derive(pin,saved.salt);if(hash!==saved.hash){fail.count++;if(fail.count>=5){fail.until=Date.now()+60000;fail.count=0;}localStorage.setItem(failKey,JSON.stringify(fail));return false;}localStorage.removeItem(failKey);open();return true;}
function extend(minutes){if(!isOpen())throw new Error('Parent PIN required.');var b=budget();b.extra_ms=(b.extra_ms||0)+Math.max(1,Math.min(30,Number(minutes)||5))*60000;SakhiProgress.persist();}
return{configured:configured,setPin:setPin,verify:verify,isOpen:isOpen,lock:lock,remaining:remaining,tick:tick,flush:flush,extend:extend,localDay:localDay};
})();
