// Reproducible curriculum import; never replaces existing IDs or progress.
const fs=require('fs'),path=require('path');const root=path.join(__dirname,'..');
function normalize(t){return t.toLowerCase().replace(/multilpes/g,'multiples').replace(/multipling/g,'multiplying').replace(/\(pre-k\)/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,' ').trim();}
function family(title){
 const t=normalize(title);
 if(/doubling/.test(t))return 'add';
 if(/two digit divisors/.test(t))return 'divide';
 if(/place value through thousandths/.test(t))return 'decimals';
 if(/counting sides and vertices of plane/.test(t))return 'shapes';
 if(t==='triangles')return 'shapes';
 if(/dividing with powers/.test(t))return 'decimals';
 if(/circle parts/.test(t))return 'circleParts';
 if(/circumference|area of a circle/.test(t))return 'circle';
 if(/surface area/.test(t))return 'surface';
 if(/volume/.test(t))return 'volume';
 if(/area/.test(t))return 'area';
 if(/perimeter/.test(t))return 'perimeter';
 if(/triangle angles|quadrilateral angles/.test(t))return 'angleSum';
 if(/angles/.test(t))return 'angles';
 if(/parallel|lines line|congruence/.test(t))return 'lines';
 if(/vertices|edges|faces/.test(t))return 'vertices';
 if(/shapes|solids|solid figures|polygons|triangles|quadrilaterals/.test(t))return 'shapes';
 if(/probability/.test(t))return 'probability';
 if(/mean median/.test(t))return 'statistics';
 if(/cross products/.test(t))return 'cross';
 if(/percent/.test(t))return 'percent';
 if(/prime factor/.test(t))return 'primeFactor';
 if(/prime and composite/.test(t))return 'prime';
 if(/greatest common/.test(t))return 'gcf';
 if(/least common/.test(t))return 'lcm';
 if(/factors vs|factoring|multiples/.test(t))return 'factors';
 if(/exponents|powers of ten/.test(t))return 'powers';
 if(/mixed numbers and decimals|fractions and decimals|fractions to decimals|equivalent fractions and decimals|tenths/.test(t))return 'fractionDecimal';
 if(/fraction|mixed numbers|simplest form/.test(t))return 'fractions';
 if(/decimal/.test(t))return 'decimals';
 if(/integer|rational/.test(t))return 'integers';
 if(/propert/.test(t))return 'properties';
 if(/order of operations|parentheses|all four operations/.test(t))return 'order';
 if(/algebra|equation|variable|expressions/.test(t))return 'algebra';
 if(/unit conversion|converting minutes|comparing units of time/.test(t))return 'conversion';
 if(/calendar|months|days of the week/.test(t))return 'calendar';
 if(/time|schedule/.test(t))return 'time';
 if(/money|coin|nickels|dimes|quarters|half dollars|change/.test(t))return 'money';
 if(/weight|capacity|distance|temperature|measur|length|height|big and small|size/.test(t))return 'measurement';
 if(/left vs/.test(t))return 'position';
 if(/grouping colors|same|different|associations/.test(t))return 'classify';
 if(/place value/.test(t))return 'place';
 if(/round/.test(t))return 'round';
 if(/even and odd/.test(t))return 'parity';
 if(/ordinal/.test(t))return 'ordinal';
 if(/pattern|counting by/.test(t))return 'patterns';
 if(/compar|ordering|greater than/.test(t))return 'compare';
 if(/remainders|divid|division/.test(t))return 'divide';
 if(/squares|multiply|multiplication/.test(t))return 'multiply';
 if(/subtract|less than/.test(t))return 'subtract';
 if(/number bonds|missing addend/.test(t))return 'bonds';
 if(/add|all together|one more/.test(t))return 'add';
 if(/number words/.test(t))return 'numberWords';
 return 'count';
}

const rows=JSON.parse(fs.readFileSync(path.join(root,'data/supplied-curriculum.json')));
const data=JSON.parse(fs.readFileSync(path.join(root,'data/curriculum-v3.json')));
data.skills=data.skills.filter(s=>s.kind!=='catalog_math');
const turns=['bbd6c1ce-e57e-4987-ac9f-f62f925106e7','856a71ab-1679-43c6-8e95-4ca24b040ac6','b74583bf-81b3-441f-a85c-460ac5869ca9','63574f21-2cf7-48a5-be95-4ba2284373e6','94ac36f3-fb2e-4218-af55-56661053ea98','99777f3b-602b-44c0-8a4c-2453907bd785','5b90a5c9-f2ce-4dd0-b949-12760db00e0b'];
const mapping={'counting to 10':'math.cardinality_20','counting to 20':'math.cardinality_20','counting to twenty':'math.cardinality_20','counting to 5':'math.cardinality_20','patterns':'math.patterns','number bonds':'math.number_bonds','addition below 10':'math.addition','subtraction below 10':'math.subtraction','add to 5':'math.addition_5','subtract from 5':'math.subtraction_5','2d shapes':'math.geometry','3d solids':'math.geometry','place value to 100':'math.place_value','addition sentences':'math.addition','subtraction sentences':'math.subtraction','counting to 100':'math.count_sequence','all together':'math.addition_5'};
const lookup=new Map(data.skills.map(s=>[normalize(s.title),s]));const byId=Object.fromEntries(data.skills.map(s=>[s.skill_id,s]));
for(const s of data.skills){s.grade_min=s.grade_min||0;s.grade_max=6;s.source_aliases=[];s.provenance='Existing Sakhi curriculum';}
const audit=[];
for(const row of [...rows].sort((a,b)=>Math.max(0,turns.indexOf(a.sourceTurn))-Math.max(0,turns.indexOf(b.sourceTurn)))){
 const grade=Math.max(0,turns.indexOf(row.sourceTurn));
 for(const title of row.titles){const key=normalize(title);let sk=byId[mapping[key]]||lookup.get(key);
 if(!sk){const f=family(title);sk={skill_id:'math.catalog.'+key.replaceAll(' ','_'),domain_id:'math',title:title.replace('Multilpes','Multiples').replace('Multipling','Multiplying'),kind:'catalog_math',generator_family:f,grade_min:grade,grade_max:6,difficulty_level:Math.min(5,Math.max(1,grade)),prerequisites:[],active:true,mastery_criteria:{min_attempts:4,target_accuracy:0.85,independent_evidence:3,multi_session:true},review_policy:{learning_days:1,developing_days:3,mostly_mastered_days:7,mastered_days:18},source_aliases:[],provenance:'Recovered supplied curriculum',teaching:{explain:'Use a model, an equation, and a real-world example to understand '+title.toLowerCase()+'.',because:'Explain each step and check it with a different representation.'}};data.skills.push(sk);byId[sk.skill_id]=sk;lookup.set(key,sk);}
 sk.source_aliases.push({title,grade,source_turn:row.sourceTurn});audit.push({source_title:title,source_turn:row.sourceTurn,grade,skill_id:sk.skill_id,generator:sk.generator_family||sk.kind});
 }
}
const foundations={add:'math.addition_5',subtract:'math.subtraction_5',multiply:'math.addition',divide:'math.catalog.basic_multiplication',fractions:'math.number_bonds',algebra:'math.unknown_addend',decimals:'math.catalog.equivalent_fractions',percent:'math.catalog.fractions_and_decimals',powers:'math.catalog.basic_multiplication',area:'math.catalog.basic_multiplication',gcf:'math.catalog.factoring',lcm:'math.catalog.multiples'};
const last={};for(const s of data.skills.filter(s=>s.kind==='catalog_math')){const key=s.generator_family;const prior=last[key];const base=foundations[key];if(prior)s.prerequisites=[prior];else if(base&&base!==s.skill_id&&byId[base]&&byId[base].grade_min<=s.grade_min)s.prerequisites=[base];last[key]=s.skill_id;}
data.curriculum_version='4.11.0';
fs.writeFileSync(path.join(root,'data/curriculum-v3.json'),JSON.stringify(data,null,2)+'\n');
fs.writeFileSync(path.join(root,'docs/curriculum-coverage.json'),JSON.stringify({source_rows:audit.length,canonical_skills:data.skills.length,original_skills:141,assignments:'Grade assignments inferred from the pasted sequence; parent can select any lesson.',missing_sources:'Original uploaded files and screenshots were unavailable; every recovered pasted lesson is retained.',rows:audit},null,2)+'\n');
console.log(audit.length+' supplied rows mapped; '+data.skills.length+' canonical skills.');
