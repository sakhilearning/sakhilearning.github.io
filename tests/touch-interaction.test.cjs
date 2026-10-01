const fs=require('fs'),vm=require('vm'),path=require('path');
class ClassList{constructor(){this.s=new Set()}add(x){this.s.add(x)}remove(x){this.s.delete(x)}toggle(x,v){if(v===undefined)v=!this.s.has(x);v?this.s.add(x):this.s.delete(x);return v}contains(x){return this.s.has(x)}}
class El{
  constructor(tag){this.tagName=tag;this.children=[];this.parentNode=null;this.dataset={};this.attrs={};this.listeners={};this.classList=new ClassList();this.disabled=false;this.textContent='';this.firstChild=null;}
  appendChild(c){this.children.push(c);c.parentNode=this;this.firstChild=this.children[0]||null;return c}
  removeChild(c){this.children=this.children.filter(x=>x!==c);this.firstChild=this.children[0]||null}
  setAttribute(k,v){this.attrs[k]=String(v)}
  getAttribute(k){return this.attrs[k]}
  addEventListener(type,fn){(this.listeners[type]||(this.listeners[type]=[])).push(fn)}
  dispatch(type,extra={}){const e=Object.assign({type,pointerType:'',preventDefault(){this.defaultPrevented=true}},extra);(this.listeners[type]||[]).forEach(fn=>fn(e));return e}
  querySelectorAll(sel){const out=[];const walk=n=>{n.children.forEach(c=>{if(sel==='.guided-step'&&c.className==='guided-step')out.push(c);walk(c)})};walk(this);return out}
  set className(v){this._className=v;String(v||'').split(/\s+/).filter(Boolean).forEach(x=>this.classList.add(x))}
  get className(){return this._className||''}
}
const document={createElement:t=>new El(t)};
const ctx={window:{},document,console,setTimeout,clearTimeout};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','sakhi-templates.js'),'utf8'),ctx);
let progress=0,root=new El('div');
let q={template:'choice',choices:['2','5','7'],answer:'5'};
let controller=ctx.SakhiTemplates.render(root,q,{domain:'math',onProgress:()=>progress++});
const buttons=root.children[0].children;
if(controller.isReady())throw new Error('Choice should begin incomplete');
buttons[1].dispatch('pointerup',{pointerType:'touch'});
buttons[1].dispatch('click');
if(!controller.isReady())throw new Error('Touch selection did not make choice ready');
if(controller.check().response!=='5')throw new Error('Touch selection did not preserve the selected response');
if(progress!==1)throw new Error('Touch pointerup plus synthetic click must activate exactly once');
root=new El('div');progress=0;
q={template:'guided',prompt:'Do both',steps:['one','two'],success_criteria:'both complete'};
controller=ctx.SakhiTemplates.render(root,q,{domain:'science',onProgress:()=>progress++});
const guided=root.children[0].children[1].children;
guided[0].dispatch('pointerup',{pointerType:'touch'});guided[0].dispatch('click');
if(progress!==1)throw new Error('Guided touch step toggled twice');
if(controller.isReady())throw new Error('Guided activity should wait for every step');
guided[1].dispatch('pointerup',{pointerType:'touch'});guided[1].dispatch('click');
if(!controller.isReady())throw new Error('Guided touch steps did not become ready');
console.log('Touch interaction passed: iPad-style pointer activation selects once and answer readiness updates.');
