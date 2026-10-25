window.SakhiTemplates=(function(){
'use strict';
function clear(n){while(n&&n.firstChild)n.removeChild(n.firstChild);}
function btn(text,cls){var b=document.createElement('button');b.type='button';b.className=cls||'answer';b.textContent=text;return b;}
function notify(ctx){if(ctx&&typeof ctx.onProgress==='function')ctx.onProgress();}
function activate(button,handler){
  var touchHandled=false,clearTimer=null;
  button.addEventListener('pointerup',function(e){
    if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;
    touchHandled=true;clearTimeout(clearTimer);handler(e);clearTimer=setTimeout(function(){touchHandled=false;},450);
  });
  button.addEventListener('click',function(e){
    if(touchHandled){e.preventDefault();return;}
    handler(e);
  });
}
function assessmentVisual(kind){
  if(kind==='leaves')return '<svg viewBox="0 0 640 210" aria-hidden="true"><defs><linearGradient id="leafLight" x1="0" x2="1"><stop stop-color="#b9ee83"/><stop offset="1" stop-color="#70bf5e"/></linearGradient><linearGradient id="leafDark" x1="0" x2="1"><stop stop-color="#247447"/><stop offset="1" stop-color="#0d4f35"/></linearGradient></defs><g transform="translate(38 18)"><path d="M250 88C174-2 45 18 18 94c61 64 174 78 232-6Z" fill="url(#leafLight)" stroke="#447e40" stroke-width="6"/><path d="M28 101 232 79M103 93l-28-36M157 87l-24-43" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="5" stroke-linecap="round"/></g><g transform="translate(348 18)"><path d="M250 88C174-2 45 18 18 94c61 64 174 78 232-6Z" fill="url(#leafDark)" stroke="#063d29" stroke-width="6"/><path d="M28 101 232 79M103 93l-28-36M157 87l-24-43" fill="none" stroke="#bce1c7" stroke-opacity=".62" stroke-width="5" stroke-linecap="round"/></g></svg>';
  if(kind==='ribbons')return '<svg viewBox="0 0 640 230" aria-hidden="true"><text x="28" y="52" class="visual-label">purple ribbon</text><path d="M36 82H576" stroke="#9a60dc" stroke-width="30" stroke-linecap="round"/><path d="m576 67 35 15-35 15Z" fill="#7340ae"/><text x="28" y="157" class="visual-label">gold ribbon</text><path d="M36 187H370" stroke="#f2bc45" stroke-width="30" stroke-linecap="round"/><path d="m370 172 35 15-35 15Z" fill="#ca9025"/></svg>';
  if(kind==='print-line')return '<svg viewBox="0 0 640 190" aria-hidden="true"><rect x="32" y="28" width="576" height="128" rx="24" fill="#fffdf6" stroke="#d8c7ea" stroke-width="4"/><text x="90" y="111" class="visual-sentence">Luna reads.</text><path d="M66 62v64M574 62v64" stroke="#a183bf" stroke-width="5" stroke-linecap="round"/><circle cx="66" cy="94" r="9" fill="#ff72b6"/><circle cx="574" cy="94" r="9" fill="#76cdd0"/></svg>';
  if(kind==='cat')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(216 15)"><path d="m40 75 18-52 43 35 45-35 18 52" fill="#f4b06f" stroke="#7e4b50" stroke-width="6" stroke-linejoin="round"/><circle cx="102" cy="116" r="78" fill="#f4b06f" stroke="#7e4b50" stroke-width="6"/><circle cx="74" cy="105" r="9" fill="#49364d"/><circle cx="130" cy="105" r="9" fill="#49364d"/><path d="m102 120-10 10h20Zm0 10c-5 19-22 21-31 12m31-12c5 19 22 21 31 12M55 132 8 120m47 31L8 160m141-28 47-12m-47 31 47 9" fill="none" stroke="#7e4b50" stroke-width="5" stroke-linecap="round"/></g></svg>';
  if(kind==='dog')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(210 16)"><path d="M48 72 13 36 24 116m151-44 36-36-12 80" fill="#9b633f" stroke="#573a36" stroke-width="7" stroke-linejoin="round"/><circle cx="112" cy="117" r="82" fill="#c98958" stroke="#573a36" stroke-width="7"/><circle cx="82" cy="102" r="9" fill="#30252d"/><circle cx="143" cy="102" r="9" fill="#30252d"/><ellipse cx="112" cy="137" rx="18" ry="13" fill="#30252d"/><path d="M112 150c0 25-32 26-39 7m39-7c0 25 32 26 39 7" fill="none" stroke="#573a36" stroke-width="6" stroke-linecap="round"/></g></svg>';
  if(kind==='sun')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(320 120)" stroke="#d99124" stroke-width="10" stroke-linecap="round"><path d="M0-102V-76M0 76v26M-102 0h26M76 0h26M-72-72l19 19M53 53l19 19M72-72 53-53M-53 53-72 72"/><circle r="67" fill="#ffd85e"/><circle cx="-24" cy="-7" r="7" fill="#6f4c3d" stroke="none"/><circle cx="24" cy="-7" r="7" fill="#6f4c3d" stroke="none"/><path d="M-26 23Q0 43 26 23" fill="none" stroke="#6f4c3d" stroke-width="6"/></g></svg>';
  if(kind==='memory')return '<svg viewBox="0 0 640 220" aria-hidden="true"><g transform="translate(65 20)"><path d="M104 20a74 74 0 1 0 54 124A82 82 0 0 1 104 20Z" fill="#ffd769" stroke="#b2852c" stroke-width="5"/></g><g transform="translate(266 34)"><path d="M98 12C30 27 7 100 45 158c34 22 75 22 109 0 38-58 15-131-56-146Z" fill="#ffd8c2" stroke="#bd718c" stroke-width="5"/><path d="M99 20v139M58 35c18 43 15 86 5 119m77-119c-18 43-15 86-5 119" fill="none" stroke="#fff" stroke-width="5"/></g><g transform="translate(470 25)"><path d="m83 7 20 52 56 3-44 35 15 55-47-31-47 31 15-55L7 62l56-3Z" fill="#ff9ac4" stroke="#9c4d92" stroke-width="5"/></g></svg>';
  if(kind==='star')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(236 20)"><path d="M84 6l24 50 55 8-40 39 10 55-49-27-49 27 10-55-40-39 55-8z" fill="#ffd34d" stroke="#b07d1c" stroke-width="6" stroke-linejoin="round"/><circle cx="64" cy="88" r="6" fill="#8a5f12"/><circle cx="104" cy="88" r="6" fill="#8a5f12"/><path d="M72 110c7 8 17 8 24 0" fill="none" stroke="#8a5f12" stroke-width="5" stroke-linecap="round"/></g></svg>';
  if(kind==='moon')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(248 18)"><path d="M112 14a92 92 0 100 176 74 74 0 010-176z" fill="#e7ddf7" stroke="#6d5a8f" stroke-width="6"/><circle cx="74" cy="78" r="12" fill="#cdbfe6"/><circle cx="58" cy="128" r="8" fill="#cdbfe6"/><circle cx="96" cy="150" r="7" fill="#cdbfe6"/></g></svg>';
  if(kind==='tree')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(252 14)"><rect x="60" y="140" width="28" height="66" rx="8" fill="#9c6b42" stroke="#6b4527" stroke-width="6"/><circle cx="74" cy="92" r="58" fill="#5fb46b" stroke="#2f7a42" stroke-width="6"/><circle cx="34" cy="122" r="34" fill="#5fb46b" stroke="#2f7a42" stroke-width="6"/><circle cx="114" cy="122" r="34" fill="#5fb46b" stroke="#2f7a42" stroke-width="6"/></g></svg>';
  if(kind==='fish')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(214 46)"><path d="M28 74c34-46 108-46 142 0-34 46-108 46-142 0z" fill="#f5894f" stroke="#9c4a22" stroke-width="6" stroke-linejoin="round"/><path d="M170 74l42-30v60z" fill="#f7b27d" stroke="#9c4a22" stroke-width="6" stroke-linejoin="round"/><circle cx="68" cy="66" r="8" fill="#49364d"/><path d="M104 44c0 20 0 40 0 60" fill="none" stroke="#9c4a22" stroke-width="5"/></g></svg>';
  if(kind==='cup')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(246 32)"><path d="M38 40h108l-14 118a16 16 0 01-16 14H68a16 16 0 01-16-14z" fill="#8fc4ef" stroke="#2f5f8c" stroke-width="6" stroke-linejoin="round"/><path d="M44 78h96" fill="none" stroke="#2f5f8c" stroke-width="5"/><path d="M146 66h20a22 22 0 010 44h-16" fill="none" stroke="#2f5f8c" stroke-width="6"/></g></svg>';
  if(kind==='book')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(206 50)"><path d="M114 32C92 18 54 14 22 20v112c32-6 70-2 92 12z" fill="#fdf6e6" stroke="#8a6a3a" stroke-width="6" stroke-linejoin="round"/><path d="M114 32c22-14 60-18 92-12v112c-32-6-70-2-92 12z" fill="#fdf6e6" stroke="#8a6a3a" stroke-width="6" stroke-linejoin="round"/><path d="M114 32v112" fill="none" stroke="#8a6a3a" stroke-width="6"/><path d="M40 52h52M40 76h52m32-24h52m-52 24h52" fill="none" stroke="#c0a471" stroke-width="5" stroke-linecap="round"/></g></svg>';
  if(kind==='bed')return '<svg viewBox="0 0 640 240" aria-hidden="true"><g transform="translate(196 54)"><rect x="18" y="96" width="212" height="24" rx="10" fill="#b98a5e" stroke="#7a5332" stroke-width="6"/><rect x="24" y="118" width="16" height="42" rx="6" fill="#7a5332"/><rect x="208" y="118" width="16" height="42" rx="6" fill="#7a5332"/><path d="M18 96V56a14 14 0 0114-14h30v54z" fill="#e9d6bb" stroke="#7a5332" stroke-width="6" stroke-linejoin="round"/><rect x="62" y="70" width="168" height="26" rx="10" fill="#f3a6bd" stroke="#a4546e" stroke-width="6"/><rect x="74" y="52" width="58" height="22" rx="10" fill="#fff" stroke="#a4546e" stroke-width="5"/></g></svg>';
  return'';
}
function wireCountables(root){var tapped=0;root.querySelectorAll('[data-count-object]').forEach(function(b){b.onclick=function(){if(b.dataset.counted==='1')return;b.dataset.counted='1';b.setAttribute('aria-pressed','true');tapped++;b.classList.add('counted');var m=b.querySelector('.count-mark');if(m)m.textContent=String(tapped);};});}
function catalogMedia(root,v){
 var box=document.createElement('div');box.className='catalog-visual';root.appendChild(box);
 function text(s,cls){var p=document.createElement('div');p.className=cls||'';p.textContent=s;box.appendChild(p);return p;}
 function svg(){var el=document.createElementNS('http://www.w3.org/2000/svg','svg');el.setAttribute('viewBox','0 0 400 230');el.setAttribute('role','img');box.appendChild(el);return el;}
 function shape(parent,kind,attrs,value){var node=document.createElementNS('http://www.w3.org/2000/svg',kind);Object.keys(attrs).forEach(function(k){node.setAttribute(k,attrs[k]);});if(value!==undefined)node.textContent=value;parent.appendChild(node);return node;}
 function objects(n,cross){var row=document.createElement('div');row.className='catalog-objects';for(var i=0;i<Math.min(100,n);i++){var b=document.createElement('button');b.type='button';b.textContent=cross&&i<n&&i>=n-cross?'◌':'★';b.className='catalog-counter';b.setAttribute('aria-label','Object '+(i+1)+(cross&&i>=n-cross?' given away':''));b.setAttribute('aria-pressed','false');b.onclick=function(){if(this.getAttribute('aria-pressed')==='true')return;this.setAttribute('aria-pressed','true');this.classList.add('counted');};row.appendChild(b);}box.appendChild(row);}
 if(v.type==='objects'||v.type==='takeaway'){objects(v.n===undefined?v.a:v.n,v.b);if(v.type==='takeaway')text(v.b+' objects were given away. Hollow counters show those objects.');}
 else if(v.type==='groups'){objects(v.a);text('+','catalog-symbol');objects(v.b);}
 else if(v.type==='tens'){text(Math.floor(v.n/10)+' groups of ten and '+v.n%10+' ones','catalog-number');objects(Math.floor(v.n/10));}
 else if(v.type==='array'){for(var i=0;i<Math.min(v.a,10);i++)objects(Math.min(v.b,10));text(v.a+' equal rows of '+v.b);}
 else if(v.type==='fraction'){var strip=document.createElement('div');strip.className='fraction-strip';strip.style.gridTemplateColumns='repeat('+Math.min(v.d,10)+',1fr)';strip.setAttribute('role','img');strip.setAttribute('aria-label',v.n+' shaded parts out of '+v.d+' equal parts');for(var i=0;i<v.d;i++){var cell=document.createElement('span');cell.className=i<v.n?'filled':'';strip.appendChild(cell);}box.appendChild(strip);}
 else if(v.type==='clock'){var s=svg();s.setAttribute('aria-label','Analog clock');shape(s,'circle',{cx:200,cy:115,r:100,fill:'#fff9ed',stroke:'#7953aa','stroke-width':5});for(var n=1;n<=12;n++){var angle=n*Math.PI/6;shape(s,'text',{x:200+80*Math.sin(angle),y:121-80*Math.cos(angle),'text-anchor':'middle',fill:'#493168','font-size':17},n);}[[v.minute*6,78,5],[(v.hour%12)*30+v.minute/2,53,8]].forEach(function(h){var angle=h[0]*Math.PI/180;shape(s,'line',{x1:200,y1:115,x2:200+h[1]*Math.sin(angle),y2:115-h[1]*Math.cos(angle),stroke:'#493168','stroke-width':h[2],'stroke-linecap':'round'});});shape(s,'circle',{cx:200,cy:115,r:6,fill:'#dd8254'});}
 else if(v.type==='coins'){var row=document.createElement('div');row.className='catalog-coins';v.values.forEach(function(n){var c=document.createElement('span');c.textContent=n+'¢';row.appendChild(c);});box.appendChild(row);}
 else if(v.type==='bars'){['a','b'].forEach(function(k){var bar=document.createElement('div');bar.className='catalog-bar';bar.style.width=(v[k]*9+10)+'%';bar.textContent=k.toUpperCase()+': '+v[k]+' units';box.appendChild(bar);});}
 else if(v.type==='lines'){var s=svg();s.setAttribute('aria-label',v.relationship+' line diagram');shape(s,'line',{x1:75,y1:130,x2:325,y2:130,stroke:'#7652ab','stroke-width':6});shape(s,'line',v.relationship==='Parallel'?{x1:75,y1:70,x2:325,y2:70,stroke:'#dd8254','stroke-width':6}:v.relationship==='Perpendicular'?{x1:200,y1:30,x2:200,y2:210,stroke:'#dd8254','stroke-width':6}:{x1:100,y1:40,x2:300,y2:200,stroke:'#dd8254','stroke-width':6});}
 else if(v.type==='angle'){var s=svg(),rad=v.degrees*Math.PI/180;s.setAttribute('aria-label','An angle with two rays');shape(s,'path',{d:'M '+(100+140*Math.cos(rad))+' '+(180-140*Math.sin(rad))+' L 100 180 L 290 180',fill:'none',stroke:'#7652ab','stroke-width':6});}
 else if(v.type==='circle'){var s=svg();s.setAttribute('aria-label','Circle with a labeled radius');shape(s,'circle',{cx:200,cy:115,r:90,fill:'#f0e8fa',stroke:'#7652ab','stroke-width':4});shape(s,'line',{x1:200,y1:115,x2:290,y2:115,stroke:'#dd8254','stroke-width':4});shape(s,'text',{x:230,y:100,'font-size':18},v.radius+' cm');}
 else if(v.type==='dimensions'){var s=svg();s.setAttribute('aria-label','Dimensions for the problem');shape(s,v.triangle?'polygon':'rect',v.triangle?{points:'90,180 310,180 200,40',fill:'#eee3fa',stroke:'#7652ab','stroke-width':3}:{x:90,y:40,width:220,height:140,fill:'#eee3fa',stroke:'#7652ab','stroke-width':3});shape(s,'text',{x:180,y:210,'font-size':18},v.a+' cm');shape(s,'text',{x:320,y:110,'font-size':18},v.b+' cm');}
 else if(v.type==='bonds'){text('Whole: '+(v.a+v.b),'catalog-number');text(v.a+' + ?','catalog-equation');}
 else if(v.type==='ordinal'){text(Array.from({length:10},function(_,i){return i+1===v.a?'★':'●';}).join('   '),'catalog-number');}
 else if(v.type==='shape'){text(v.symbol,'catalog-shape');}
 else if(v.type==='color'){box.style.background=v.color;box.style.minHeight='100px';box.setAttribute('role','img');box.setAttribute('aria-label','Color swatch');}
 else text(v.text||'','catalog-equation');
}

function media(root,q,domain){
  if(!q.media)return;
  if(q.media.mathModel&&window.SakhiScenePlayer&&SakhiScenePlayer.poster(root,q))return;
  if(q.media.catalog)catalogMedia(root,q.media.catalog);
  if(q.media.visual){var visual=document.createElement('div');visual.className='assessment-visual visual-'+q.media.visual;visual.setAttribute('role','img');visual.setAttribute('aria-label',q.media.alt||'Question illustration');visual.innerHTML=assessmentVisual(q.media.visual);root.appendChild(visual);}
  if(q.media.passage){var p=document.createElement('div');p.className='passage';p.textContent=q.media.passage;root.appendChild(p);}
  if(q.media.count){var d=document.createElement('div');d.className='object-field';d.innerHTML=SakhiPresentation.objectSet(domain,q.media.count);root.appendChild(d);wireCountables(d);var tip=document.createElement('small');tip.className='count-tip';tip.textContent='Tap each treasure as you count.';root.appendChild(tip);}
  if(q.media.shape){var wrap=document.createElement('div');wrap.className='shape-wrap';var im=document.createElement('img');im.className='shape-hero';im.src=q.media.shape.src;im.alt=q.media.shape.name;im.onerror=function(){im.hidden=true;wrap.dataset.fallback=q.media.shape.name;};wrap.appendChild(im);root.appendChild(wrap);}
  /* Place value and ten-frame questions are about a picture; without one the
     child has to hold the quantity in her head while reading a sentence she
     cannot read yet. The numbers already exist in the generator, so the frame
     is drawn from them rather than described in words. */
  if(q.media.tenFrame){
    var tf=q.media.tenFrame,frames=[],loose=0,label='';
    if(tf.tens!==undefined){for(var t=0;t<tf.tens;t++)frames.push(10);loose=tf.ones||0;label=tf.tens+' ten'+(tf.tens===1?'':'s')+' and '+loose+' one'+(loose===1?'':'s');}
    else{frames.push(Math.min(10,tf.total||10));loose=0;label=(tf.filled||0)+' of '+(tf.total||10)+' counters placed';}
    var frameWrap=document.createElement('div');frameWrap.className='ten-frame-field';
    frameWrap.setAttribute('role','img');frameWrap.setAttribute('aria-label',label);
    var filledLeft=tf.tens!==undefined?tf.tens*10:(tf.filled||0);
    frames.forEach(function(cells){
      var grid=document.createElement('div');grid.className='ten-frame';
      for(var c=0;c<cells;c++){
        var cell=document.createElement('span');cell.className='ten-frame-cell';
        if(filledLeft>0){cell.classList.add('is-filled');filledLeft--;}
        grid.appendChild(cell);
      }
      frameWrap.appendChild(grid);
    });
    for(var o=0;o<loose;o++){var one=document.createElement('span');one.className='ten-frame-one';frameWrap.appendChild(one);}
    root.appendChild(frameWrap);
  }
  /* The pattern lives in the prompt as emoji, which the voice reads as "red
     circle blue circle". Showing the run with an empty slot is what the
     question is actually asking about. */
  if(Array.isArray(q.media.patternStrip)&&q.media.patternStrip.length){
    var strip=document.createElement('div');strip.className='pattern-strip';
    strip.setAttribute('role','img');strip.setAttribute('aria-label','Pattern: '+q.media.patternStrip.join(', ')+', then what comes next?');
    q.media.patternStrip.forEach(function(item){
      var cell=document.createElement('span');cell.className='pattern-cell';cell.textContent=item;strip.appendChild(cell);
    });
    var next=document.createElement('span');next.className='pattern-cell is-next';next.textContent='?';strip.appendChild(next);
    root.appendChild(strip);
  }
  if(q.media.groups){var groups=document.createElement('div');groups.className='group-field';q.media.groups.forEach(function(n){var g=document.createElement('div');g.innerHTML=SakhiPresentation.objectSet(domain,n);groups.appendChild(g);wireCountables(g);});root.appendChild(groups);}
  if(q.media.subtract){var sub=document.createElement('div');sub.className='object-field';sub.innerHTML=SakhiPresentation.objectSet(domain,q.media.subtract[0]);root.appendChild(sub);wireCountables(sub);}
}
function renderBase(root,q,ctx){return render(root,q,ctx);}
function render(root,q,ctx){
  if(window.SakhiScenePlayer&&q.media&&q.media.mathModel){var scene=SakhiScenePlayer.render(root,q,ctx);if(scene)return scene;}
  var school=window.SakhiSchoolwork&&typeof window.SakhiSchoolwork.renderSchool==='function'?window.SakhiSchoolwork.renderSchool(root,q,ctx):null;if(school)return school;
  clear(root);media(root,q,ctx.domain);var state={response:null};
  if(q.template==='choice'){
    var grid=document.createElement('div');grid.className='answer-grid';
    var buttons=[];
    q.choices.forEach(function(c){var b=btn(c,'answer');buttons.push(b);b.setAttribute('aria-pressed','false');activate(b,function(){buttons.forEach(function(x){x.classList.remove('selected');x.setAttribute('aria-pressed','false');});b.classList.add('selected');b.setAttribute('aria-pressed','true');state.response=c;notify(ctx);});grid.appendChild(b);});
    root.appendChild(grid);
    return{immediate:false,isReady:function(){return state.response!==null;},check:function(){return{correct:String(state.response)===String(q.answer),response:state.response};},reset:function(){state.response=null;buttons.forEach(function(b){b.classList.remove('selected');b.setAttribute('aria-pressed','false');b.disabled=false;});notify(ctx);}};
  }
  if(q.template==='build'||q.template==='sequence'){
    var built=[],out=document.createElement('button'),bank=document.createElement('div'),buttons=[];
    out.type='button';out.className='build-out';out.setAttribute('aria-label','Built answer. Tap to clear.');bank.className='token-bank';
    function paint(doNotify){out.textContent=built.length?built.join(q.template==='sequence'?' ':''):'Tap pieces to build it';buttons.forEach(function(b){b.disabled=b.dataset.used==='1';});if(doNotify)notify(ctx);}
    q.tokens.forEach(function(tok){var b=btn(tok,'token');buttons.push(b);activate(b,function(){if(b.dataset.used==='1')return;b.dataset.used='1';built.push(tok);paint(true);});bank.appendChild(b);});
    activate(out,function(){built=[];buttons.forEach(function(b){delete b.dataset.used;b.disabled=false;});paint(true);});root.appendChild(out);root.appendChild(bank);paint(false);
    return{immediate:false,isReady:function(){return built.length===q.answer.length;},check:function(){return{correct:JSON.stringify(built)===JSON.stringify(q.answer),response:built.slice()};},reset:function(){built=[];buttons.forEach(function(b){delete b.dataset.used;b.disabled=false;});paint(true);}};
  }
  if(q.template==='trace'){
    var target=String(q.trace_target||'stroke:curve'),parts=target.split(':'),kind=parts[0],value=parts.slice(1).join(':'),helper=document.createElement('p'),c=document.createElement('canvas');helper.className='trace-guide';helper.textContent=kind==='stroke'?'Start at the pink dot. Follow the dotted path to the gold star.':'Use your finger or pencil to follow the dotted shape.';root.appendChild(helper);c.width=600;c.height=260;c.className='trace-canvas';root.appendChild(c);var g=c.getContext('2d'),drawing=false,marks=0;
    function guide(){var start={x:85,y:150},finish={x:520,y:75};g.clearRect(0,0,c.width,c.height);g.lineWidth=18;g.lineCap='round';g.strokeStyle='#d8caef';g.setLineDash([12,12]);if(kind==='letter'||kind==='number'){g.font='bold 190px system-ui, sans-serif';g.textAlign='center';g.textBaseline='middle';g.strokeText(value,300,132);}else{g.beginPath();if(value==='line'){start={x:85,y:130};finish={x:515,y:130};g.moveTo(start.x,start.y);g.lineTo(finish.x,finish.y);}else if(value==='zigzag'){start={x:80,y:190};finish={x:520,y:190};g.moveTo(start.x,start.y);g.lineTo(190,60);g.lineTo(300,190);g.lineTo(410,60);g.lineTo(finish.x,finish.y);}else if(value==='loop'){start={x:110,y:135};finish={x:520,y:135};g.moveTo(start.x,start.y);g.bezierCurveTo(110,30,260,30,260,135);g.bezierCurveTo(260,235,410,235,410,135);g.bezierCurveTo(410,45,520,45,finish.x,finish.y);}else{g.moveTo(start.x,start.y);g.bezierCurveTo(160,30,240,230,315,110);g.bezierCurveTo(380,20,445,205,finish.x,finish.y);}g.stroke();}g.setLineDash([]);if(kind==='stroke'){g.fillStyle='#ff72b6';g.beginPath();g.arc(start.x,start.y,10,0,Math.PI*2);g.fill();g.fillStyle='#d69b16';g.font='bold 30px system-ui, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('★',finish.x,finish.y);}}
    function pos(e){var r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height};}
    function start(e){drawing=true;if(c.setPointerCapture)try{c.setPointerCapture(e.pointerId);}catch(x){}var p=pos(e);g.beginPath();g.moveTo(p.x,p.y);e.preventDefault();}
    function move(e){if(!drawing)return;var p=pos(e);g.strokeStyle='#7c4dff';g.lineWidth=12;g.lineCap='round';g.lineTo(p.x,p.y);g.stroke();marks++;notify(ctx);e.preventDefault();}
    function end(){drawing=false;}
    guide();c.addEventListener('pointerdown',start);c.addEventListener('pointermove',move);c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
    return{immediate:false,isReady:function(){return marks>8;},check:function(){return{correct:true,response:'traced'};},reset:function(){marks=0;drawing=false;guide();notify(ctx);}};
  }
  if(q.template==='guided'){
    var card=document.createElement('div'),goal=document.createElement('p'),list=document.createElement('div'),done={};card.className='guided-card';goal.className='guided-goal';goal.textContent=q.success_criteria?'Goal: '+q.success_criteria:q.prompt;card.appendChild(goal);list.className='guided-steps';
    (q.steps||[]).forEach(function(step,index){var b=btn(''+(index+1)+'. '+step,'guided-step');b.setAttribute('aria-pressed','false');activate(b,function(){done[index]=!done[index];b.classList.toggle('done',!!done[index]);b.setAttribute('aria-pressed',done[index]?'true':'false');notify(ctx);});list.appendChild(b);});card.appendChild(list);root.appendChild(card);
    return{immediate:false,isReady:function(){return(q.steps||[]).length>0&&(q.steps||[]).every(function(_,i){return!!done[i];});},check:function(){return{correct:true,response:Object.keys(done).filter(function(k){return done[k];}).length+' steps completed'};},reset:function(){done={};list.querySelectorAll('.guided-step').forEach(function(b){b.classList.remove('done');b.setAttribute('aria-pressed','false');});notify(ctx);}};
  }
  var p=document.createElement('div');p.className='practice-card';var icon=document.createElement('div');icon.className='practice-icon';icon.textContent='✏️';var text=document.createElement('p');text.textContent=q.prompt;p.appendChild(icon);p.appendChild(text);root.appendChild(p);
  return{immediate:false,isReady:function(){return true;},check:function(){return{correct:true,response:'done'};},reset:function(){}};
}
return{render:render,renderBase:renderBase,renderMedia:media,assessmentVisual:assessmentVisual};
})();
