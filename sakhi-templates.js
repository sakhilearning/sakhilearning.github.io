window.SakhiTemplates=(function(){
'use strict';
function clear(n){while(n&&n.firstChild)n.removeChild(n.firstChild);}
function btn(text,cls){var b=document.createElement('button');b.type='button';b.className=cls||'answer';b.textContent=text;return b;}
function notify(ctx){if(ctx&&typeof ctx.onProgress==='function')ctx.onProgress();}
function media(root,q,domain){
  if(!q.media)return;
  if(q.media.passage){var p=document.createElement('div');p.className='passage';p.textContent=q.media.passage;root.appendChild(p);}
  if(q.media.count){var d=document.createElement('div');d.className='object-field';d.innerHTML=SakhiPresentation.objectSet(domain,q.media.count);root.appendChild(d);}
  if(q.media.shape){var wrap=document.createElement('div');wrap.className='shape-wrap';var im=document.createElement('img');im.className='shape-hero';im.src=q.media.shape.src;im.alt=q.media.shape.name;im.onerror=function(){im.hidden=true;wrap.dataset.fallback=q.media.shape.name;};wrap.appendChild(im);root.appendChild(wrap);}
  if(q.media.groups){var groups=document.createElement('div');groups.className='group-field';q.media.groups.forEach(function(n){var g=document.createElement('div');g.innerHTML=SakhiPresentation.objectSet(domain,n);groups.appendChild(g);});root.appendChild(groups);}
  if(q.media.subtract){var sub=document.createElement('div');sub.className='object-field';sub.innerHTML=SakhiPresentation.objectSet(domain,q.media.subtract[0]);root.appendChild(sub);}
}
function render(root,q,ctx){
  clear(root);media(root,q,ctx.domain);var state={response:null};
  if(q.template==='choice'){
    var grid=document.createElement('div');grid.className='answer-grid';
    var buttons=[];
    q.choices.forEach(function(c){var b=btn(c,'answer');buttons.push(b);b.onclick=function(){buttons.forEach(function(x){x.classList.remove('selected');});b.classList.add('selected');state.response=c;notify(ctx);};grid.appendChild(b);});
    root.appendChild(grid);
    return{immediate:false,isReady:function(){return state.response!==null;},check:function(){return{correct:String(state.response)===String(q.answer),response:state.response};},reset:function(){state.response=null;buttons.forEach(function(b){b.classList.remove('selected');b.disabled=false;});notify(ctx);}};
  }
  if(q.template==='build'||q.template==='sequence'){
    var built=[],out=document.createElement('button'),bank=document.createElement('div'),buttons=[];
    out.type='button';out.className='build-out';out.setAttribute('aria-label','Built answer. Tap to clear.');bank.className='token-bank';
    function paint(doNotify){out.textContent=built.length?built.join(q.template==='sequence'?' ':''):'Tap pieces to build it';buttons.forEach(function(b){b.disabled=b.dataset.used==='1';});if(doNotify)notify(ctx);}
    q.tokens.forEach(function(tok){var b=btn(tok,'token');buttons.push(b);b.onclick=function(){if(b.dataset.used==='1')return;b.dataset.used='1';built.push(tok);paint(true);};bank.appendChild(b);});
    out.onclick=function(){built=[];buttons.forEach(function(b){delete b.dataset.used;b.disabled=false;});paint(true);};root.appendChild(out);root.appendChild(bank);paint(false);
    return{immediate:false,isReady:function(){return built.length===q.answer.length;},check:function(){return{correct:JSON.stringify(built)===JSON.stringify(q.answer),response:built.slice()};},reset:function(){built=[];buttons.forEach(function(b){delete b.dataset.used;b.disabled=false;});paint(true);}};
  }
  if(q.template==='trace'){
    var c=document.createElement('canvas');c.width=600;c.height=260;c.className='trace-canvas';root.appendChild(c);var g=c.getContext('2d'),drawing=false,marks=0;
    function guide(){g.clearRect(0,0,c.width,c.height);g.lineWidth=18;g.lineCap='round';g.strokeStyle='#d8caef';g.setLineDash([12,12]);g.beginPath();g.moveTo(100,55);g.bezierCurveTo(160,20,240,220,310,80);g.bezierCurveTo(360,20,430,200,510,65);g.stroke();g.setLineDash([]);}
    function pos(e){var r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height};}
    function start(e){drawing=true;if(c.setPointerCapture)try{c.setPointerCapture(e.pointerId);}catch(x){}var p=pos(e);g.beginPath();g.moveTo(p.x,p.y);e.preventDefault();}
    function move(e){if(!drawing)return;var p=pos(e);g.strokeStyle='#7c4dff';g.lineWidth=12;g.lineCap='round';g.lineTo(p.x,p.y);g.stroke();marks++;notify(ctx);e.preventDefault();}
    function end(){drawing=false;}
    guide();c.addEventListener('pointerdown',start);c.addEventListener('pointermove',move);c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
    return{immediate:false,isReady:function(){return marks>8;},check:function(){return{correct:true,response:'traced'};},reset:function(){marks=0;drawing=false;guide();notify(ctx);}};
  }
  var p=document.createElement('div');p.className='practice-card';var icon=document.createElement('div');icon.className='practice-icon';icon.textContent='✏️';var text=document.createElement('p');text.textContent=q.prompt;p.appendChild(icon);p.appendChild(text);root.appendChild(p);
  return{immediate:false,isReady:function(){return true;},check:function(){return{correct:true,response:'done'};},reset:function(){}};
}
return{render:render};
})();
