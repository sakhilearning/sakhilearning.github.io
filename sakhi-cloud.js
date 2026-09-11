/* Sakhi cloud transport.
 *
 * Supabase is the durable authority when a parent is authenticated. Browser
 * storage is only a read cache and an offline outbox. The transport never calls
 * a write "synced" until an authenticated learner-data request has succeeded.
 *
 * V3 hardening:
 *  - CONNECTED is probe-confirmed, never optimistic after receiving an auth token.
 *  - One logical learning completion can be queued as one batch envelope.
 *  - Permanently rejected writes move to a dead-letter queue; they are never
 *    silently discarded.
 *  - Replays use merge-duplicates upserts with client-generated ids.
 */
window.SakhiCloud = (function(){
  'use strict';

  var CFG=window.RAINBOW_CONFIG||{};
  var URL_BASE=CFG.supabaseUrl||'';
  var ANON=CFG.supabaseAnonKey||'';
  var SESSION_KEY='sakhi.cloud.session';
  var OUTBOX_KEY='sakhi.cloud.outbox';
  var DEAD_KEY='sakhi.cloud.deadletter';
  var CACHE_PREFIX='sakhi.cache.';
  var STATUS={NOT_CONFIGURED:'NOT_CONFIGURED',OFFLINE:'OFFLINE',NOT_CONNECTED:'NOT_CONNECTED',CONNECTED:'CONNECTED'};
  var session=readJSON(SESSION_KEY,null),status=STATUS.NOT_CONNECTED,lastError=null,listeners=[],flushing=false;

  function readJSON(k,f){try{var v=localStorage.getItem(k);return v?JSON.parse(v):f;}catch(e){return f;}}
  function writeJSON(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}
  function uuid(){return (crypto.randomUUID&&crypto.randomUUID())||'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16);});}
  function configured(){return !!(URL_BASE&&ANON);}
  function outbox(){return readJSON(OUTBOX_KEY,[])||[];}
  function deadLetters(){return readJSON(DEAD_KEY,[])||[];}
  function state(){return{status:status,configured:configured(),signedIn:!!(session&&session.access_token),email:session&&session.user&&session.user.email||null,userId:session&&session.user&&session.user.id||null,pending:outbox().length,failed:deadLetters().length,error:lastError};}
  function emit(){var s=state();listeners.forEach(function(fn){try{fn(s);}catch(e){console.warn(e);}});}
  function setStatus(next,err){err=err||null;if(next===status&&err===lastError)return;status=next;lastError=err;emit();}
  function onChange(fn){listeners.push(fn);return function(){listeners=listeners.filter(function(x){return x!==fn;});};}
  function setOutbox(v){writeJSON(OUTBOX_KEY,v);emit();}
  function setDead(v){writeJSON(DEAD_KEY,v);emit();}
  function headers(auth){var h={apikey:ANON,'Content-Type':'application/json'};h.Authorization='Bearer '+(auth&&session&&session.access_token?session.access_token:ANON);return h;}
  function cloudError(code,message,cause){var e=new Error(message);e.code=code;e.cause=cause;return e;}

  async function request(path,opts){
    opts=opts||{};
    if(!configured()){setStatus(STATUS.NOT_CONFIGURED);throw cloudError('NOT_CONFIGURED','No Supabase credentials in this build.');}
    if(typeof navigator!=='undefined'&&navigator.onLine===false){setStatus(STATUS.OFFLINE);throw cloudError('OFFLINE','This device is offline.');}
    var res;
    try{res=await fetch(URL_BASE+path,{method:opts.method||'GET',headers:Object.assign(headers(opts.auth!==false),opts.headers||{}),body:opts.body!==undefined?JSON.stringify(opts.body):undefined});}
    catch(e){setStatus(STATUS.OFFLINE,e.message);throw cloudError('NETWORK','Could not reach the Sakhi cloud.',e);}
    if(res.status===401||res.status===403){
      if(opts.auth!==false&&session&&session.refresh_token&&!opts._retried){var ok=await refresh();if(ok)return request(path,Object.assign({},opts,{_retried:true}));}
      if(opts.auth!==false)signOutLocal();
      throw cloudError('UNAUTHORIZED','Cloud sign-in is required.');
    }
    if(!res.ok){var detail=await res.text().catch(function(){return'';});throw cloudError('HTTP_'+res.status,detail||('Request failed ('+res.status+')'));}
    if(res.status===204)return null;var text=await res.text();return text?JSON.parse(text):null;
  }

  function persistSession(s){session=s;if(s)writeJSON(SESSION_KEY,s);else try{localStorage.removeItem(SESSION_KEY);}catch(e){}}
  async function signIn(email,password){
    var data=await request('/auth/v1/token?grant_type=password',{method:'POST',auth:false,body:{email:email,password:password}});
    persistSession(data);setStatus(STATUS.NOT_CONNECTED);await probe();return state();
  }
  async function signUp(email,password){
    var data=await request('/auth/v1/signup',{method:'POST',auth:false,body:{email:email,password:password}});
    if(data&&data.access_token){persistSession(data);setStatus(STATUS.NOT_CONNECTED);await probe();}
    return{needsConfirmation:!(data&&data.access_token),state:state()};
  }
  async function refresh(){if(!session||!session.refresh_token)return false;try{var data=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',auth:false,body:{refresh_token:session.refresh_token}});persistSession(data);return true;}catch(e){signOutLocal();return false;}}
  function signOutLocal(){persistSession(null);setStatus(STATUS.NOT_CONNECTED);}
  async function signOut(){try{await request('/auth/v1/logout',{method:'POST'});}catch(e){}signOutLocal();}
  async function probe(){
    if(!configured()){setStatus(STATUS.NOT_CONFIGURED);return state();}
    if(typeof navigator!=='undefined'&&navigator.onLine===false){setStatus(STATUS.OFFLINE);return state();}
    if(!session||!session.access_token){setStatus(STATUS.NOT_CONNECTED);return state();}
    try{await request('/rest/v1/learner_profiles?select=learner_id&limit=1');setStatus(STATUS.CONNECTED);}
    catch(e){if(e.code==='OFFLINE'||e.code==='NETWORK')setStatus(STATUS.OFFLINE,e.message);else if(e.code==='UNAUTHORIZED')setStatus(STATUS.NOT_CONNECTED);else setStatus(STATUS.NOT_CONNECTED,e.message);}
    return state();
  }

  function cacheGet(n){return readJSON(CACHE_PREFIX+n,null);}
  function cachePut(n,v){writeJSON(CACHE_PREFIX+n,{at:new Date().toISOString(),value:v});return v;}
  function cacheValue(n){var c=cacheGet(n);return c?c.value:null;}
  async function readThrough(n,path){try{var fresh=await request(path);cachePut(n,fresh);return{value:fresh,fromCache:false,cachedAt:null};}catch(e){var c=cacheGet(n);if(c)return{value:c.value,fromCache:true,cachedAt:c.at,error:e};throw e;}}

  function enqueue(op){var list=outbox();op.op_id=op.op_id||uuid();op.queued_at=op.queued_at||new Date().toISOString();list.push(op);setOutbox(list);flush();return op.op_id;}
  function upsert(table,rows){return enqueue({kind:'upsert',table:table,rows:Array.isArray(rows)?rows:[rows]});}
  function batch(ops,meta){return enqueue({kind:'batch',ops:(ops||[]).map(function(x){return{table:x.table,rows:Array.isArray(x.rows)?x.rows:[x.rows]};}),meta:meta||{}});}
  function isTransient(e){return e&&(e.code==='OFFLINE'||e.code==='NETWORK'||e.code==='UNAUTHORIZED');}
  var CONFLICT_KEYS={
    learner_profiles:'learner_id',learner_skill_progress:'learner_id,skill_id',
    learning_sessions:'session_id',learning_attempts:'attempt_id',
    review_schedule:'learner_id,skill_id,due_at',reward_transactions:'transaction_id'
  };
  async function sendUpsert(op){
    var conflict=CONFLICT_KEYS[op.table],path='/rest/v1/'+op.table+(conflict?'?on_conflict='+encodeURIComponent(conflict):'');
    await request(path,{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:op.rows});
  }
  async function sendEnvelope(op){if(op.kind==='batch'){for(var i=0;i<op.ops.length;i++)await sendUpsert(op.ops[i]);}else await sendUpsert(op);}
  function deadLetter(op,e){var d=deadLetters();d.push({dead_id:uuid(),failed_at:new Date().toISOString(),error_code:e&&e.code||'UNKNOWN',error_message:e&&e.message||String(e),operation:op});setDead(d.slice(-100));}
  function retryDeadLetter(deadId){var d=deadLetters(),hit=d.filter(function(x){return x.dead_id===deadId;})[0];if(!hit)return false;setDead(d.filter(function(x){return x.dead_id!==deadId;}));enqueue(hit.operation);return true;}
  function clearDeadLetter(deadId){var d=deadLetters();setDead(deadId?d.filter(function(x){return x.dead_id!==deadId;}):[]);}

  function rewriteLearnerId(oldId,newId){
    if(!oldId||!newId||oldId===newId)return;
    function rewrite(v){
      if(Array.isArray(v))return v.map(rewrite);
      if(v&&typeof v==='object'){Object.keys(v).forEach(function(k){if(k==='learner_id'&&v[k]===oldId)v[k]=newId;else v[k]=rewrite(v[k]);});}
      return v;
    }
    setOutbox(rewrite(outbox()));
    setDead(rewrite(deadLetters()));
  }

  async function flush(){
    if(flushing||!configured()||!session||(typeof navigator!=='undefined'&&navigator.onLine===false))return;
    var list=outbox();if(!list.length)return;flushing=true;
    try{
      while(list.length){
        var op=list[0];
        try{await sendEnvelope(op);}
        catch(e){if(isTransient(e))break;deadLetter(op,e);console.warn('[SakhiCloud] write moved to dead-letter queue',e.message);}
        list.shift();setOutbox(list);
      }
    }finally{flushing=false;/* only probe(), never an empty queue, may establish CONNECTED */}
  }

  if(typeof window!=='undefined'&&window.addEventListener){window.addEventListener('online',function(){probe();});window.addEventListener('offline',function(){setStatus(STATUS.OFFLINE);});}

  return{STATUS:STATUS,state:state,onChange:onChange,probe:probe,signIn:signIn,signUp:signUp,signOut:signOut,request:request,readThrough:readThrough,cacheValue:cacheValue,cachePut:cachePut,upsert:upsert,batch:batch,flush:flush,outbox:outbox,deadLetters:deadLetters,retryDeadLetter:retryDeadLetter,clearDeadLetter:clearDeadLetter,rewriteLearnerId:rewriteLearnerId,uuid:uuid};
})();
