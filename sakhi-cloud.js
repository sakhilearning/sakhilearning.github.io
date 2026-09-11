window.SakhiCloud=(function(){
'use strict';
var CFG=window.SAKHI_CONFIG||window.RAINBOW_CONFIG||{};
var BASE=CFG.supabaseUrl||'', ANON=CFG.supabaseAnonKey||CFG.supabasePublishableKey||'';
var OUT='sakhi.v3.outbox', DEAD='sakhi.v3.deadletter', listeners=[];
function read(k,f){try{var v=localStorage.getItem(k);return v?JSON.parse(v):f;}catch(e){return f;}}
function write(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function session(){return read('sakhi.cloud.session',null);} function setSession(v){if(v)write('sakhi.cloud.session',v);else try{localStorage.removeItem('sakhi.cloud.session');}catch(e){}emit();}
function status(){if(!BASE||!ANON)return 'NOT_CONFIGURED';if(navigator.onLine===false)return 'OFFLINE';return session()&&session().access_token?'CONNECTED':'NOT_CONNECTED';}
function state(){return{status:status(),pending:read(OUT,[]).length,dead:read(DEAD,[]).length,configured:!!(BASE&&ANON)};}
function emit(){var s=state();listeners.forEach(function(fn){try{fn(s);}catch(e){}});}
function onChange(fn){listeners.push(fn);return function(){listeners=listeners.filter(function(x){return x!==fn;});};}
function uuid(){return crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16);});}
function enqueue(batch){var q=read(OUT,[]);q.push({op_id:uuid(),at:new Date().toISOString(),batch:batch,tries:0});write(OUT,q);emit();flush();}
async function request(path,opts){opts=opts||{};var s=session();var h={'apikey':ANON,'Content-Type':'application/json','Authorization':'Bearer '+((s&&s.access_token)||ANON)};var r=await fetch(BASE+path,{method:opts.method||'GET',headers:Object.assign(h,opts.headers||{}),body:opts.body?JSON.stringify(opts.body):undefined});if(!r.ok)throw new Error('HTTP '+r.status+' '+await r.text());var t=await r.text();return t?JSON.parse(t):null;}
var flushing=false;
async function flush(){if(flushing||status()!=='CONNECTED')return;flushing=true;var q=read(OUT,[]),dead=read(DEAD,[]);try{while(q.length){var op=q[0];try{await request('/rest/v1/sakhi_v3_events',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:op.batch});q.shift();write(OUT,q);emit();}catch(e){op.tries=(op.tries||0)+1;if(/HTTP 4/.test(String(e.message))&&op.tries>=3){dead.push(Object.assign(op,{error:String(e.message)}));q.shift();write(DEAD,dead);write(OUT,q);emit();continue;}break;}}}finally{flushing=false;}}
async function signIn(email,password){if(!BASE||!ANON)throw new Error('Supabase not configured');var r=await fetch(BASE+'/auth/v1/token?grant_type=password',{method:'POST',headers:{'apikey':ANON,'Content-Type':'application/json'},body:JSON.stringify({email:email,password:password})});if(!r.ok)throw new Error('Sign-in failed');var v=await r.json();setSession(v);flush();return state();}
async function signUp(email,password){if(!BASE||!ANON)throw new Error('Supabase not configured');var r=await fetch(BASE+'/auth/v1/signup',{method:'POST',headers:{'apikey':ANON,'Content-Type':'application/json'},body:JSON.stringify({email:email,password:password})});if(!r.ok)throw new Error('Sign-up failed');var v=await r.json();if(v.access_token)setSession(v);return{needsConfirmation:!v.access_token};}
async function signOut(){var s=session();try{if(s&&s.access_token)await fetch(BASE+'/auth/v1/logout',{method:'POST',headers:{'apikey':ANON,'Authorization':'Bearer '+s.access_token}});}catch(e){}setSession(null);}
async function speak(text){if(!BASE||!ANON)throw new Error('Speech service not configured');var s=session();var h={'apikey':ANON,'Authorization':'Bearer '+((s&&s.access_token)||ANON),'Content-Type':'application/json'};var r=await fetch(BASE+'/functions/v1/sakhi-speech',{method:'POST',headers:h,body:JSON.stringify({text:text})});if(!r.ok)throw new Error('Speech HTTP '+r.status);return await r.arrayBuffer();}
window.addEventListener('online',flush);
return{state:state,onChange:onChange,enqueue:enqueue,flush:flush,speak:speak,request:request,signIn:signIn,signUp:signUp,signOut:signOut};
})();
