const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const path=require('path');
const root=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(root,'sakhi-schoolwork.js'),'utf8');

function baseActivity(skillId){
  const qs=[];
  for(let i=0;i<4;i++){
    let q={template:'choice',prompt:'Base prompt '+i,answer:'A',choices:['A','B','C'],question_key:skillId+':base:'+i,content_id:skillId+':content:'+i,assessment_id:skillId+':q'+i,learning_objective:'Objective',difficulty:2,learning_phase:i===3?'transfer':'practice',coach_tip:'Tip',narration_policy:'prompt_only',spoken_instruction:'Look carefully.',hints:['Look carefully.']};
    if(skillId==='writing.uppercase'){q.template='trace';q.trace_target='letter:P';q.answer='done';q.evidence_mode='practice';q.prompt='Trace the dotted letter P.';q.spoken_instruction='Trace letter P. Follow the dotted shape.';}
    if(skillId==='writing.lowercase'){q.template='trace';q.trace_target='letter:p';q.answer='done';q.evidence_mode='practice';}
    if(skillId==='math.write_numerals'||skillId==='writing.numerals'){q.template='trace';q.trace_target='number:8';q.answer='done';q.evidence_mode='practice';}
    if(skillId==='reading.letter_names_upper'){q.answer='P';q.choices=['P','R','B'];q.prompt='Tap the letter P.';q.spoken_instruction='Find uppercase P.';}
    /* Deliberately mirror the core generator's historical defect here: the
       lowercase skill arrived with uppercase display data. The schoolwork
       layer must correct the visible case without inventing a new spoken line. */
    if(skillId==='reading.letter_names_lower'){q.answer='P';q.choices=['P','R','B'];q.prompt='Tap the letter P.';q.spoken_instruction='Find uppercase P.';}
    if(skillId==='math.cardinality_20'){q.answer=7;q.choices=[6,7,8];q.prompt='How many treasures do you see?';q.spoken_instruction='Count the treasures.';q.media={count:7};}
    if(skillId==='math.compare'){q.answer=19;q.choices=[13,19,20];q.prompt='Which number is greater: 13 or 19?';q.spoken_instruction=q.prompt;}
    if(skillId==='writing.name'){q.template='guided';q.answer='done';q.evidence_mode='practice';q.prompt='Write your name carefully.';q.spoken_instruction='Write your name carefully. Complete the three steps shown on screen.';}
    if(skillId==='writing.labels'){q.template='build';q.answer=['t','r','e','e'];q.tokens=['t','r','p','e','e','m'];q.media={visual:'tree',alt:'A tall green tree'};q.prompt='Build the label for this picture.';q.spoken_instruction=q.prompt;}
    if(skillId==='wellbeing.friendship'){q.answer='take turns';q.choices=['take turns','grab it','break it'];q.prompt='Two children want one toy. What is fair?';q.spoken_instruction=q.prompt;}
    qs.push(q);
  }
  return {activity_id:skillId+':2:seed',skill_id:skillId,domain_id:skillId.split('.')[0],band:2,evidence_mode:'objective',questions:qs};
}
const context={console};
context.window=context;
context.SakhiActivities={generate:(skillId)=>baseActivity(skillId),canGenerate:()=>true};
context.SakhiTemplates={render:()=>({base:true})};
context.SakhiProgress={snapshot:()=>({learner:{name:'Sakhi'}})};
vm.createContext(context);
vm.runInContext(src,context,{filename:'sakhi-schoolwork.js'});

function gen(id,avoid=[]){return context.SakhiActivities.generate(id,2,'seed',avoid,{});}
let a=gen('writing.uppercase');
assert(a.questions.every(q=>q.template==='school-trace-sheet'));
assert(a.questions.every(q=>q.evidence_mode==='practice'));
assert.strictEqual(a.questions[0].sheet.target,'P');
assert.strictEqual(a.questions[0].spoken_instruction,'Trace letter P. Follow the dotted shape.');

a=gen('reading.letter_names_upper');
assert(a.questions.every(q=>q.template==='school-letter-gap'));
assert.deepStrictEqual(Array.from([a.questions[0].sheet.before,a.questions[0].sheet.target,a.questions[0].sheet.after]),['O','P','Q']);
assert.strictEqual(a.questions[0].spoken_instruction,'Find uppercase P.');

a=gen('reading.letter_names_lower');
assert(a.questions.every(q=>q.template==='school-letter-gap'));
assert.deepStrictEqual(Array.from([a.questions[0].sheet.before,a.questions[0].sheet.target,a.questions[0].sheet.after]),['o','p','q']);
assert.strictEqual(a.questions[0].answer,'p');
assert(a.questions[0].choices.every(x=>x===String(x).toLowerCase()));
assert.strictEqual(a.questions[0].prompt,'Tap the letter p.');
assert.strictEqual(a.questions[0].spoken_instruction,'Tap the letter P.');
assert(!/uppercase/i.test(a.questions[0].spoken_instruction));

a=gen('math.cardinality_20');
assert(a.questions.every(q=>q.template==='school-count-match'));
assert.strictEqual(a.questions[0].sheet.count,7);
assert.strictEqual(a.questions[0].spoken_instruction,'Count the treasures.');

a=gen('math.compare');
assert(a.questions.every(q=>q.template==='school-number-compare'));
assert.deepStrictEqual(Array.from(a.questions[0].sheet.pair),[13,19]);
assert.strictEqual(a.questions[0].answer,19);

a=gen('writing.name');
assert.strictEqual(a.questions[1].template,'school-name-page');
assert.strictEqual(a.questions[0].template,'guided');

a=gen('wellbeing.friendship');
assert(a.questions.every(q=>q.template==='school-life-choice'));
assert.strictEqual(a.questions[0].answer,'take turns');

const schoolKey=a.questions[0].question_key;
const mapped=context.SakhiSchoolwork.mappedAvoid([schoolKey]);
assert(mapped.includes(schoolKey.replace(/\|school-v1$/,'')),'school keys must map back to base keys so repetition avoidance still works');

const untouched=gen('science.weather');
assert(untouched.questions.every(q=>q.template==='choice'));
assert.strictEqual(context.SakhiTemplates.render(null,{template:'choice'},{}).base,true,'non-school templates delegate to the core renderer');

for(const id of ['writing.uppercase','writing.lowercase','writing.numerals','math.write_numerals','reading.letter_names_upper','reading.letter_names_lower','math.cardinality_20','math.compare','writing.name','wellbeing.friendship']){
  const activity=gen(id);
  activity.questions.forEach(q=>{
    assert(q.prompt,'question keeps a visible prompt');
    assert(q.spoken_instruction,'question keeps an existing spoken instruction');
    assert(q.question_key,'question remains history-addressable');
  });
}

/* Integration: load the real content and generator, not a hand-built fixture.
   This is the regression gate for the exact lowercase defect that escaped the
   stub-only test: the core letter_name generator historically emits uppercase
   glyphs for both uppercase and lowercase curriculum skills. */
const curriculum=JSON.parse(fs.readFileSync(path.join(root,'data/curriculum-v3.json'),'utf8'));
const real={console};
real.window=real;
real.SakhiCurriculum={skill:id=>curriculum.skills.find(s=>s.skill_id===id)||null};
vm.createContext(real);
for(const file of ['sakhi-content.js','sakhi-activities.js','sakhi-schoolwork.js']){
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),real,{filename:file});
}
for(let seed=0;seed<16;seed++){
  const activity=real.SakhiActivities.generate('reading.letter_names_lower',2,'lowercase-real:'+seed,[],{teachFirst:seed===0});
  assert(activity.questions.length>=3);
  activity.questions.forEach(q=>{
    assert.strictEqual(q.template,'school-letter-gap');
    assert.strictEqual(q.answer,String(q.answer).toLowerCase());
    assert(q.choices.every(x=>x===String(x).toLowerCase()));
    assert(q.prompt.includes(String(q.answer)),'visible prompt must show the lowercase target');
    assert(!/uppercase/i.test(q.spoken_instruction),'lowercase lesson must never tell the child to find uppercase');
    assert(/^Tap the letter [A-Z]\.$/.test(q.spoken_instruction),'lowercase lesson should reuse an already-bundled neutral letter-name prompt');
  });
  const taught=activity.questions[0].teaching;
  if(taught&&taught.worked){
    assert(taught.worked.display_prompt,'lowercase worked example needs a lowercase visual prompt alias');
    assert.strictEqual(taught.worked.display_answer,String(taught.worked.display_answer).toLowerCase());
  }
}

/* "Write the Room" from her workbook: a picture, and she writes its word. The
   worksheet must not change what is asked -- same word, same tiles -- and must
   not grow its own tile board, since the core build activity already has one. */
{
  const sheet=context.window.SakhiSchoolwork.enhanceActivity(baseActivity('writing.labels'),[]).questions[0];
  assert.strictEqual(sheet.template,'school-write-room');
  assert.strictEqual(sheet.base_template,'build','the worksheet must delegate to the canonical build renderer');
  assert.strictEqual(sheet.sheet.word,'tree');
  assert.strictEqual(sheet.sheet.letters,4,'one box per letter of the word');
  assert.strictEqual(sheet.sheet.picture,'tree');
  /* Values cross the vm realm boundary, so compare by value rather than by
     prototype identity. */
  assert.strictEqual(JSON.stringify(sheet.answer),JSON.stringify(['t','r','e','e']),'the answer must be unchanged');
  assert.strictEqual(JSON.stringify(sheet.tokens),JSON.stringify(['t','r','p','e','e','m']),'the letter tiles must be unchanged');

  const schoolSrc=fs.readFileSync(path.join(root,'sakhi-schoolwork.js'),'utf8');
  const fn=schoolSrc.slice(schoolSrc.indexOf('function renderWriteRoom'),schoolSrc.indexOf('function renderSchool'));
  assert(/baseTemplateRender\(/.test(fn),'write-room must render the tile board through the canonical renderer');
  /* Scan code, not prose: the comment above the delegation names the tiles it
     deliberately does not re-implement. */
  const fnCode=fn.replace(/\/\*[\s\S]*?\*\//g,'');
  assert(!/draggable|addEventListener\('dragstart'|createElement\('button'\)[\s\S]{0,80}tile/i.test(fnCode),'write-room must not grow a second tile board');
  /* The picture comes from the one renderer the core questions use. */
  const tpl=fs.readFileSync(path.join(root,'sakhi-templates.js'),'utf8');
  assert(/assessmentVisual:assessmentVisual/.test(tpl),'sakhi-templates must export the shared visual renderer');
}

/* Stroke order. Her sheets put numbered arrows on the model letter; the pad
   draws its model from a font glyph, so the sequence is said instead -- shown
   and spoken. It must be a separate utterance, or every prompt-and-letter pair
   becomes its own recording. */
{
  const SW=context.window.SakhiSchoolwork;
  const sheet=SW.enhanceActivity(baseActivity('writing.uppercase'),[]).questions[0];
  assert.strictEqual(sheet.template,'school-trace-sheet');
  assert(sheet.sheet.strokeOrder,'a letter trace sheet needs its stroke order');
  assert(Array.isArray(sheet.audioSegments)&&sheet.audioSegments.length===2,'prompt and stroke order are two utterances');
  assert.strictEqual(sheet.audioSegments[1].text,sheet.sheet.strokeOrder);
  /* Every letter and numeral the trace sheets can ask for needs one. */
  const src=fs.readFileSync(path.join(root,'sakhi-schoolwork.js'),'utf8');
  for(const group of ['upper','lower','number']){
    const expected=group==='number'?10:26;
    const body=src.slice(src.indexOf(group+':{',src.indexOf('var STROKE_ORDER=')));
    const count=(body.slice(0,body.indexOf('}')).match(/'[^']+':'/g)||[]).length;
    assert.strictEqual(count,expected,`STROKE_ORDER.${group} should cover ${expected} glyphs, found ${count}`);
  }
}

/* Every letter page in the school workbook closes with three pictures that start
   with that letter, which is what links the shape being traced to its sound. A
   wrong word here teaches the wrong sound, so check all 26 rather than spot ones. */
{
  const pics=context.window.SakhiSchoolwork.LETTER_PICTURES;
  const alphabet='abcdefghijklmnopqrstuvwxyz'.split('');
  for(const letter of alphabet){
    const set=pics[letter];
    assert(Array.isArray(set)&&set.length===3,`letter ${letter} needs three picture cues`);
    for(const [art,word] of set){
      assert(art&&art.trim(),`letter ${letter} has a picture cue with no art`);
      assert(word&&/^[a-z- ]+$/.test(word),`letter ${letter} cue word "${word}" should be plain lowercase`);
      /* x is the documented exception: English gives a five-year-old no
         x-initial words, so that page uses the ending sound. */
      if(letter==='x')assert(word.endsWith('x')||/six/.test(word),`letter x cue "${word}" must end with the x sound`);
      else assert(word.startsWith(letter),`letter ${letter} cue "${word}" does not start with ${letter}`);
    }
    const words=set.map(p=>p[1]);
    assert(new Set(words).size===3,`letter ${letter} repeats a cue word`);
  }
  /* The cues are shown, not spoken, so they must not introduce narration. */
  const schoolSrc=fs.readFileSync(path.join(root,'sakhi-schoolwork.js'),'utf8');
  const cueFn=schoolSrc.slice(schoolSrc.indexOf('function pictureCues'),schoolSrc.indexOf('function referenceStrip'));
  assert(!/spoken_instruction|narration/.test(cueFn),'picture cues must not add spoken lines');
}

const appSource=fs.readFileSync(path.join(root,'sakhi-app.js'),'utf8');
/* Until the generic teaching panel consumes display aliases, the aliases are
   harmless metadata and audio remains correct. Keep this assertion descriptive
   rather than requiring a special-case lowercase branch in the app. */
assert(!/reading\.letter_names_lower/.test(appSource),'app presentation must stay generic; lowercase belongs in the schoolwork layer');

console.log('schoolwork-experience: ok');
