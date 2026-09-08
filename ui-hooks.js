(function(){
'use strict';

const listeners=new Map();
function on(event,handler){
  if(typeof handler!=='function')throw new TypeError('UIHooks handler must be a function');
  const set=listeners.get(event)||new Set();set.add(handler);listeners.set(event,set);
  return()=>set.delete(handler);
}
function emit(event,payload){for(const fn of listeners.get(event)||[]){try{fn(payload)}catch(e){console.error('UIHooks',event,e)}}}
function allow(event,payload){for(const fn of listeners.get(event)||[]){try{if(fn(payload)===false)return false}catch(e){console.error('UIHooks',event,e)}}return true}
function wrap(name,beforeEvent,afterEvent){
  const base=window[name];if(typeof base!=='function')return;
  window[name]=function(...args){
    const payload={name,args};
    if(beforeEvent&&!allow(beforeEvent,payload))return false;
    const result=base.apply(this,args);
    if(afterEvent)emit(afterEvent,{...payload,result});
    return result;
  };
}

wrap('go','beforeNavigate','navigate');
wrap('setTheme',null,'themeChanged');
wrap('renderQuest',null,'questRendered');
wrap('renderDomains',null,'domainsRendered');
wrap('openDomain',null,'domainOpened');
wrap('openStructuredActivity',null,'activityOpened');
wrap('finishSuccess',null,'activitySucceeded');
wrap('finishAttempt',null,'activityAttemptFinished');

window.UIHooks=Object.freeze({on,emit});
window.ActivityRenderer=Object.freeze({
  open:(activity,containerId,source)=>window.openStructuredActivity(activity,containerId,source),
  close:()=>window.closeStructuredActivity?.(),
  retry:()=>{const r=window.interactionRuntime;if(r)window.openStructuredActivity(r.activity,r.containerId,r.source)},
  onOpen:fn=>on('activityOpened',fn),
  onSuccess:fn=>on('activitySucceeded',fn),
  onAttempt:fn=>on('activityAttemptFinished',fn)
});
})();
