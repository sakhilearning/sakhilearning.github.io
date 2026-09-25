window.SakhiTemplates=(function(){
'use strict';
function clear(n){while(n&&n.firstChild)n.removeChild(n.firstChild);}
function btn(text,cls){var b=document.createElement('button');b.type='button';b.className=cls||'answer';b.textContent=text;return b;}
function notify(ctx){if(ctx&&typeof ctx.onProgress==='function')ctx.onProgress();}
function assessmentVisual(kind){
  if(kind==='leaves')return '<svg viewBox="0 0 640 210" aria-hidden="true"><defs><linearGradient id="leafLight" x1="0" x2="1"><stop stop-color="#b9ee83"/><stop offset="1" stop-color="#70bf5e"/></linearGradient><linearGradient id="leafDark" x1="0" x2="1"><stop stop-color="#247447"/><stop offset="1" stop-color="#0d4f35"/></linearGradient></defs><g transform="translate(38 18)"><path d="M250 88C174-2 45 18 18 94c61 64 174 78 232-6Z" fill="url(#leafLight)" stroke="#447e40" stroke-width="6"/><path d="M28 101 232 79M103 93l-28-36M157 87l-24-43" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="5" stroke-linecap="round"/></g><g transform="translate(348 18)"><path d="M250 88C174-2 45 18 18 94c61 64 174 78 232-6Z" fill="url(#leafDark)" stroke="#063d29" stroke-width="6"/><path d="M28 101 232 79M103 93l-28-36M157 87l-24-43" fill="none" stroke="#bce1c7" stroke-opacity=".62" stroke-width="5" stroke-linecap="round"/></g></svg>';
  if(kind==='ribbons')return '<svg viewBox="0 0 640 230" aria-hidden="true"><text x="28" y="52" class="visual-label">purple ribbon</text><path d="M36 82H576" stroke="#9a60dc" stroke-width="30" stroke-linecap="round"/><path d="m576 67 35 15-35 15Z" fill="#7340ae"/><text x="28" y="157" class="visual-label">gold ribbon</text><path d="M36 187H370" stroke="#f2bc45" stroke-width="30" stroke-linecap="round"/><path d="m370 172 35 15-35 15Z" fill="#ca9025"/></svg>';
  if(kind==='print-line')return '<svg viewBox="0 0 640 190" aria-hidden="true"><rect x="32" y="28" width="576" height="128" rx="24" fill="#fffdf6" stroke="#d8c7ea" stroke-width="4"/><text x="90" y="111" class="visual-sentence">Luna reads.</text><path d="M66 62v64M574 62v64" stroke="#a183bf" stroke-width="5" stroke-linecap="round"/><circle cx="66" cy="94" r="9" fill="#ff72b6"/><circle cx="574" cy="94" r="9" fill="#76cdd0"/></svg>';
  if(kind==='cat')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(216 15)"><path d="m40 75 18-52 43 35 45-35 18 52" fill="#f4b06f" stroke="#7e4b50" stroke-width="6" stroke-linejoin="round"/><circle cx="102" cy="116" r="78" fill="#f4b06f" stroke="#7e4b50" stroke-width="6"/><circle cx="74" cy="105" r="9" fill="#49364d"/><circle cx="130" cy="105" r="9" fill="#49364d"/><path d="m102 120-10 10h20Zm0 10c-5 19-22 21-31 12m31-12c5 19 22 21 31 12M55 132 8 120m47 31L8 160m141-28 47-12m-47 31 47 9" fill="none" stroke="#7e4b50" stroke-width="5" stroke-linecap="round"/></g></svg>';
  if(kind==='dog')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(210 16)"><path d="M48 72 13 36 24 116m151-44 36-36-12 80" fill="#9b633f" stroke="#573a36" stroke-width="7" stroke-linejoin="round"/><circle cx="112" cy="117" r="82" fill="#c98958" stroke="#573a36" stroke-width="7"/><circle cx="82" cy="102" r="9" fill="#30252d"/><circle cx="143" cy="102" r="9" fill="#30252d"/><ellipse cx="112" cy="137" rx="18" ry="13" fill="#30252d"/><path d="M112 150c0 25-32 26-39 7m39-7c0 25 32 26 39 7" fill="none" stroke="#573a36" stroke-width="6" stroke-linecap="round"/></g></svg>';
  if(kind==='sun')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(320 120)" stroke="#d99124" stroke-width="10" stroke-linecap="round"><path d="M0-102V-76M0 76v26M-102 0h26M76 0h26M-72-72l19 19M53 53l19 19M72-72 53-53M-53 53-72 72"/><circle r="67" fill="#ffd85e"/><circle cx="-24" cy="-7" r="7" fill="#6f4c3d" stroke="none"/><circle cx="24" cy="-7" r="7" fill="#6f4c3d" stroke="none"/><path d="M-26 23Q0 43 26 23" fill="none" stroke="#6f4c3d" stroke-width="6"/></g></svg>';
  if(kind==='memory')return '<svg viewBox="0 0 640 220" aria-hidden="true"><g transform="translate(65 20)"><path d="M104 20a74 74 0 1 0 54 124A82 82 0 0 1 104 20Z" fill="#ffd769" stroke="#b2852c" stroke-width="5"/></g><g transform="translate(266 34)"><path d="M98 12C30 27 7 100 45 158c34 22 75 22 109 0 38-58 15-131-56-146Z" fill="#ffd8c2" stroke="#bd718c" stroke-width="5"/><path d="M99 20v139M58 35c18 43 15 86 5 119m77-119c-18 43-15 86-5 119" fill="none" stroke="#fff" stroke-width="5"/></g><g transform="translate(470 25)"><path d="m83 7 20 52 56 3-44 35 15 55-47-31-47 31 15-55L7 62l56-3Z" fill="#ff9ac4" stroke="#9c4d92" stroke-width="5"/></g></svg>';
  return'';
}
function wireCountables(root){var tapped=0;root.querySelectorAll('[data-count-object]').forEach(function(b){b.onclick=function(){if(b.dataset.counted==='1')return;b.dataset.counted='1';b.setAttribute('aria-pressed','true');tapped++;b.classList.add('counted');var m=b.querySelector('.count-mark');if(m)m.textContent=String(tapped);};});}
function media(root,q,domain){
  if(!q.media)return;
  if(q.media.visual){var visual=document.createElement('div');visual.className='assessment-visual visual-'+q.media.visual;visual.setAttribute('role','img');visual.setAttribute('aria-label',q.media.alt||'Question illustration');visual.innerHTML=assessmentVisual(q.media.visual);root.appendChild(visual);}
  if(q.media.passage){var p=document.createElement('div');p.className='passage';p.textContent=q.media.passage;root.appendChild(p);}
  if(q.media.count){var d=document.createElement('div');d.className='object-field';d.innerHTML=SakhiPresentation.objectSet(domain,q.media.count);root.appendChild(d);wireCountables(d);var tip=document.createElement('small');tip.className='count-tip';tip.textContent='Tap each treasure as you count.';root.appendChild(tip);}
  if(q.media.shape){var wrap=document.createElement('div');wrap.className='shape-wrap';var im=document.createElement('img');im.className='shape-hero';im.src=q.media.shape.src;im.alt=q.media.shape.name;im.onerror=function(){im.hidden=true;wrap.dataset.fallback=q.media.shape.name;};wrap.appendChild(im);root.appendChild(wrap);}
  if(q.media.groups){var groups=document.createElement('div');groups.className='group-field';q.media.groups.forEach(function(n){var g=document.createElement('div');g.innerHTML=SakhiPresentation.objectSet(domain,n);groups.appendChild(g);wireCountables(g);});root.appendChild(groups);}
  if(q.media.subtract){var sub=document.createElement('div');sub.className='object-field';sub.innerHTML=SakhiPresentation.objectSet(domain,q.media.subtract[0]);root.appendChild(sub);wireCountables(sub);}
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
    function guide(){var target=String(q.trace_target||'stroke:curve'),parts=target.split(':'),kind=parts[0],value=parts.slice(1).join(':');g.clearRect(0,0,c.width,c.height);g.lineWidth=18;g.lineCap='round';g.strokeStyle='#d8caef';g.setLineDash([12,12]);if(kind==='letter'||kind==='number'){g.font='bold 190px system-ui, sans-serif';g.textAlign='center';g.textBaseline='middle';g.strokeText(value,300,132);}else{g.beginPath();if(value==='line'){g.moveTo(85,130);g.lineTo(515,130);}else if(value==='zigzag'){g.moveTo(80,190);g.lineTo(190,60);g.lineTo(300,190);g.lineTo(410,60);g.lineTo(520,190);}else if(value==='loop'){g.moveTo(110,135);g.bezierCurveTo(110,30,260,30,260,135);g.bezierCurveTo(260,235,410,235,410,135);g.bezierCurveTo(410,45,520,45,520,135);}else{g.moveTo(85,150);g.bezierCurveTo(160,30,240,230,315,110);g.bezierCurveTo(380,20,445,205,520,75);}g.stroke();}g.setLineDash([]);g.fillStyle='#ff72b6';g.beginPath();g.arc(82,kind==='letter'||kind==='number'?50:130,9,0,Math.PI*2);g.fill();}
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
