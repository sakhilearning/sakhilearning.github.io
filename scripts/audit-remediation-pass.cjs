#!/usr/bin/env node
const fs=require('fs');
function r(f){return fs.readFileSync(f,'utf8')}
function w(f,s){fs.writeFileSync(f,s)}
function must(s,n,f){if(!s.includes(n))throw new Error(f+' missing '+n.slice(0,40))}
let a=r('sakhi-activities.js');
if(!a.includes('var ACTIVITY_ENHANCERS=[];')){
 const x="var BANDS={1:{name:'INTRO',choices:2,model:true},2:{name:'SUPPORTED',choices:3,model:false},3:{name:'INDEPENDENT',choices:3,model:false},4:{name:'MIXED',choices:4,model:false},5:{name:'CHALLENGE',choices:4,model:false}};";must(a,x,'activities');
 a=a.replace(x,x+"\nvar ACTIVITY_ENHANCERS=[];\nfunction registerEnhancer(fn){if(typeof fn==='function'&&ACTIVITY_ENHANCERS.indexOf(fn)<0)ACTIVITY_ENHANCERS.push(fn);}\nfunction applyEnhancers(activity,meta){var out=activity;for(var i=0;i<ACTIVITY_ENHANCERS.length;i++){var next=ACTIVITY_ENHANCERS[i](out,meta||{});if(next)out=next;}if(out&&Array.isArray(out.questions))out.evidence_mode=out.questions.every(function(q){return q.evidence_mode==='practice';})?'practice':'objective';return out;}\n");
}
const oldRet="}return{activity_id:skillId+':'+band+':'+seed,skill_id:skillId,skill_title:sk.title,domain_id:sk.domain_id,band:band,band_name:BANDS[band].name,evidence_mode:qs.every(function(q){return q.evidence_mode==='practice';})?'practice':'objective',questions:qs};}";
const newRet="}var activity={activity_id:skillId+':'+band+':'+seed,skill_id:skillId,skill_title:sk.title,domain_id:sk.domain_id,band:band,band_name:BANDS[band].name,evidence_mode:qs.every(function(q){return q.evidence_mode==='practice';})?'practice':'objective',questions:qs};return applyEnhancers(activity,{skillId:skillId,band:band,seed:seed,avoid:avoid||[],context:context||{}});}";
if(a.includes(oldRet))a=a.replace(oldRet,newRet);
a=a.replace('return{BANDS:BANDS,generate:generate,canGenerate:canGenerate};','return{BANDS:BANDS,generate:generate,canGenerate:canGenerate,registerEnhancer:registerEnhancer};');
w('sakhi-activities.js',a);
let t=r('sakhi-templates.js');
if(!t.includes('var TEMPLATE_RENDERERS=[];')){
 const x="function assessmentVisual(kind){";must(t,x,'templates');
 t=t.replace(x,"var TEMPLATE_RENDERERS=[];\nfunction registerRenderer(fn){if(typeof fn==='function'&&TEMPLATE_RENDERERS.indexOf(fn)<0)TEMPLATE_RENDERERS.push(fn);}\n"+x);
}
t=t.replace('function render(root,q,ctx){','function renderBase(root,q,ctx){');
if(!t.includes('function render(root,q,ctx){for(var i=0;i<TEMPLATE_RENDERERS.length;i++){')){
 const ex='return{render:render,assessmentVisual:assessmentVisual};';must(t,ex,'templates');
 t=t.replace(ex,"function render(root,q,ctx){for(var i=0;i<TEMPLATE_RENDERERS.length;i++){var rendered=TEMPLATE_RENDERERS[i](root,q,ctx,renderBase);if(rendered)return rendered;}return renderBase(root,q,ctx);}\nreturn{render:render,assessmentVisual:assessmentVisual,registerRenderer:registerRenderer};");
}
w('sakhi-templates.js',t);
let s=r('sakhi-schoolwork.js');
s=s.replace(/function install\(\)\{[\s\S]*?\n\}\ninstall\(\);/,"function schoolRenderer(root,q,ctx,baseRender){baseTemplateRender=function(innerRoot,innerQ,innerCtx){return baseRender(innerRoot,innerQ,innerCtx);};return renderSchool(root,q,ctx)||null;}\nfunction install(){\n  if(window.SakhiActivities&&typeof window.SakhiActivities.registerEnhancer==='function'&&!window.SakhiActivities.__schoolworkInstalled){\n    window.SakhiActivities.registerEnhancer(function(activity,meta){return enhanceActivity(activity,meta&&meta.avoid);});\n    Object.defineProperty(window.SakhiActivities,'__schoolworkInstalled',{value:true,configurable:true});\n  }\n  if(window.SakhiTemplates&&typeof window.SakhiTemplates.registerRenderer==='function'&&!window.SakhiTemplates.__schoolworkInstalled){\n    window.SakhiTemplates.registerRenderer(schoolRenderer);\n    Object.defineProperty(window.SakhiTemplates,'__schoolworkInstalled',{value:true,configurable:true});\n  }\n}\ninstall();");
w('sakhi-schoolwork.js',s);
let arch=r('tests/source-architecture.test.cjs');
if(!arch.includes('schoolwork must not monkey-patch')){
 arch=arch.replace("assert(/\\b__schoolworkInstalled\\b/.test(school),'schoolwork should use an explicit installed marker for its bridge');","assert(/\\b__schoolworkInstalled\\b/.test(school),'schoolwork should use an explicit installed marker for its bridge');\nassert(!/\\bA\\.generate\\s*=/.test(school),'schoolwork must not monkey-patch SakhiActivities.generate');\nassert(!/\\bA\\.canGenerate\\s*=/.test(school),'schoolwork must not monkey-patch SakhiActivities.canGenerate');\nassert(!/\\bT\\.render\\s*=/.test(school),'schoolwork must not monkey-patch SakhiTemplates.render');\nassert(/registerEnhancer\\(/.test(school),'schoolwork should use canonical extension hooks for activity enhancement');\nassert(/registerRenderer\\(/.test(school),'schoolwork should use canonical extension hooks for template rendering');\nconst activities=stripComments(read('sakhi-activities.js'));\nassert(/registerEnhancer:registerEnhancer/.test(activities),'SakhiActivities must export the canonical extension hook');\nconst templates=stripComments(read('sakhi-templates.js'));\nassert(/registerRenderer:registerRenderer/.test(templates),'SakhiTemplates must export the canonical extension hook');");
 w('tests/source-architecture.test.cjs',arch);
}
console.log('audit remediation source hooks complete');
// trigger 5
