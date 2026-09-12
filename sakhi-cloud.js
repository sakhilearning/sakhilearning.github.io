window.SakhiCloud=(function(){
'use strict';
var CFG=window.SAKHI_CONFIG||window.RAINBOW_CONFIG||{};
var BASE=CFG.supabaseUrl||'',ANON=CFG.supabaseAnonKey||CFG.supabasePublishableKey||'',SPEECH_URL=CFG.speechFunctionUrl||CFG.ttsEndpoint||'';
var OUT='sakhi.v3.outbox',DEAD='sakhi.v3.deadletter',SESSION='sakhi.cloud.session',listeners=[],verified=false,flushing=false,lastError=null;
function read(k,f){try{var v=localStorage.getItem(k);return v?JSON.parse(v):f;}catch(e){return f;}}
function write(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}
function session(){return read(SESSION,null);}
function setSession(v){if(v)write(SESSION,v);else try{localStorage.removeItem(SESSION);}catch(e){}verified=false;emit();}
function configured(){return!!(BASE&&ANON);}
function status(){if(!configured())return'NOT_CONFIGURED';if(navigator.onLine===false)return'OFFLINE';var s=session();return s&&s.access_token&&verified?'CONNECTED':'NOT_CONNECTED';}
function state(){var s=session();return{status:status(),pending:read(OUT,[]).length,dead:read(DEAD,[]).length,configured:configured(),signedIn:!!(s&&s.access_token),error:lastError};}
function emit(){var s=state();listeners.forEach(function(fn){try{fn(s);}catch(e){}});}
function onChange(fn){listeners.push(fn);return function(){listeners=listeners.filter(function(x){return x!==fn;});};}
function uuid(){return crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16);});}
function headers(useAuth){var s=session(),token=useAuth!==false&&s&&s.access_token?s.access_token:ANON;return{'apikey':ANON,'Content-Type':'application/json','Authorization':'Bearer '+token};}
async function refresh(){var s=session();if(!s||!s.refresh_token)return false;try{var r=await fetch(BASE+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'apikey':ANON,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:s.refresh_token})});if(!r.ok)return false;setSession(await r.json());return true;}catch(e){return false;}}
async function request(path,opts){opts=opts||{};if(!configured())throw new Error('Supabase not configured');if(navigator.onLine===false)throw new Error('Offline');var r=await fetch(BASE+path,{method:opts.method||'GET',headers:Object.assign(headers(opts.auth!==false),opts.headers||{}),body:opts.body?JSON.stringify(opts.body):undefined});if((r.status===401||r.status===403)&&opts.auth!==false&&!opts._retried&&await refresh())return request(path,Object.assign({},opts,{_retried:true}));if(!r.ok)throw new Error('HTTP '+r.status+' '+await r.text());var t=await r.text();return t?JSON.parse(t):null;}
async function probe(){
  if(!configured()){verified=false;emit();return state();}
  if(navigator.onLine===false){verified=false;emit();return state();}
  var s=session();if(!s||!s.access_token){verified=false;emit();return state();}
  try{await request('/rest/v1/sakhi_v3_events?select=id&limit=1');verified=true;lastError=null;emit();flush();}
  catch(e){verified=false;lastError=String(e.message||e);emit();}
  return state();
}
function enqueue(batch){var q=read(OUT,[]);q.push({op_id:uuid(),at:new Date().toISOString(),batch:batch,tries:0});write(OUT,q);emit();flush();}
async function flush(){if(flushing||status()!=='CONNECTED')return;flushing=true;var q=read(OUT,[]),dead=read(DEAD,[]);try{while(q.length){var op=q[0];try{await request('/rest/v1/sakhi_v3_events',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:op.batch});q.shift();write(OUT,q);emit();}catch(e){op.tries=(op.tries||0)+1;if(/HTTP 4/.test(String(e.message))&&op.tries>=3){dead.push(Object.assign(op,{error:String(e.message)}));q.shift();write(DEAD,dead);write(OUT,q);emit();continue;}lastError=String(e.message||e);break;}}}finally{flushing=false;}}
async function signIn(email,password){if(!configured())throw new Error('Supabase not configured');var r=await fetch(BASE+'/auth/v1/token?grant_type=password',{method:'POST',headers:{'apikey':ANON,'Content-Type':'application/json'},body:JSON.stringify({email:email,password:password})});if(!r.ok)throw new Error('Sign-in failed');setSession(await r.json());await probe();if(status()!=='CONNECTED')throw new Error('Signed in, but learner sync could not be verified');return state();}
async function signUp(email,password){if(!configured())throw new Error('Supabase not configured');var r=await fetch(BASE+'/auth/v1/signup',{method:'POST',headers:{'apikey':ANON,'Content-Type':'application/json'},body:JSON.stringify({email:email,password:password})});if(!r.ok)throw new Error('Sign-up failed');var v=await r.json();if(v.access_token){setSession(v);await probe();}return{needsConfirmation:!v.access_token};}
async function signOut(){var s=session();try{if(s&&s.access_token)await fetch(BASE+'/auth/v1/logout',{method:'POST',headers:{'apikey':ANON,'Authorization':'Bearer '+s.access_token}});}catch(e){}setSession(null);}
async function speak(text){if(!configured())throw new Error('Speech service not configured');var s=session(),url=SPEECH_URL||(BASE+'/functions/v1/sakhi-speech');var h={'apikey':ANON,'Authorization':'Bearer '+((s&&s.access_token)||ANON),'Content-Type':'application/json'};var r=await fetch(url,{method:'POST',headers:h,body:JSON.stringify({text:text})});var mime=(r.headers&&r.headers.get?r.headers.get('content-type'):'')||'';if(!r.ok){var detail='';try{detail=await r.text();}catch(e){}throw new Error('Speech HTTP '+r.status+(detail?' · '+detail.slice(0,180):''));}if(mime&&mime.toLowerCase().indexOf('audio/')!==0)throw new Error('Speech returned unexpected content type '+mime);var bytes=await r.arrayBuffer();if(bytes.byteLength<100)throw new Error('Speech returned an empty audio response');return{bytes:bytes,httpStatus:r.status,mime:mime||'audio/mpeg'};}
window.addEventListener('online',probe);window.addEventListener('offline',function(){verified=false;emit();});
return{state:state,onChange:onChange,enqueue:enqueue,flush:flush,probe:probe,speak:speak,request:request,signIn:signIn,signUp:signUp,signOut:signOut};
})();
