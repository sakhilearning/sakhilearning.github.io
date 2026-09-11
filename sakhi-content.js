window.SakhiContent=(function(){
'use strict';
var LETTERS='abcdefghijklmnopqrstuvwxyz'.split('');
var UPPER=LETTERS.map(function(x){return x.toUpperCase();});
var CVC=['cat','map','sun','pig','dog','hen','jet','lip','rug','top','bed','fan','sit','mop','run','cap','pin','fox','mud','van'];
var DIGRAPHS={sh:['ship','fish','shop','shell'],ch:['chip','chop','chin','lunch'],th:['thin','moth','bath','this'],wh:['when','whip','whale','wheel'],ck:['duck','sock','rock','back'],ng:['ring','song','king','wing']};
var BLENDS={st:['star','stop','step'],bl:['black','blue','block'],cl:['clap','clip','clock'],gr:['green','grab','grin'],tr:['tree','trip','truck'],pl:['plan','plum','plug']};
var SIGHT=['the','is','a','I','to','you','we','my','was','said','are','of'];
var SENTENCES=['The cat sat on the mat.','I can see a red sun.','The pig is in the mud.','We run to the big hill.','My dog can hop.','A fish can swim fast.','The shell is on the sand.','I like the green tree.'];
var STORIES=[
 {text:'Mia has a red hat. The wind lifts it up. A kind bird sees the hat and drops it near Mia. Mia smiles and says thank you.',q:'Who helped Mia?',a:'the bird',options:['the bird','a fish','a frog']},
 {text:'Lina plants a seed in a pot. She gives it water and puts it by a sunny window. A tiny green sprout appears.',q:'What helped the seed grow?',a:'water and sun',options:['water and sun','candy','snow']},
 {text:'A little crab finds a shiny shell. It is too big for the crab. The crab leaves it beside a rock for another animal.',q:'What did the crab find?',a:'a shell',options:['a shell','a crown','a kite']},
 {text:'Nora builds a tower with four blocks. Her kitten bumps it and the tower falls. Nora takes a breath and builds it again.',q:'What did Nora do after the tower fell?',a:'built it again',options:['built it again','went to sleep','ate it']}
];
var VOCAB=[
 {w:'enormous',m:'very big',o:['very big','very cold','very quiet']},
 {w:'gentle',m:'soft and kind',o:['soft and kind','loud and rough','very fast']},
 {w:'delighted',m:'very happy',o:['very happy','very tired','very wet']},
 {w:'brave',m:'ready to try even when nervous',o:['ready to try even when nervous','always sleepy','very small']},
 {w:'tiny',m:'very small',o:['very small','very loud','very bright']}
];
var SHAPES=[
 {name:'circle',src:'./assets/educational/shapes/circle.svg'},
 {name:'triangle',src:'./assets/educational/shapes/triangle.svg'},
 {name:'square',src:'./assets/educational/shapes/square.svg'},
 {name:'cube',src:'./assets/educational/shapes/cube.svg'},
 {name:'sphere',src:'./assets/educational/shapes/sphere.svg'}
];
var SCI=[
 {q:'Which animal lives in the ocean?',a:'fish',options:['fish','camel','bear']},
 {q:'What does a plant need to grow?',a:'water and light',options:['water and light','shoes and hats','candy and rocks']},
 {q:'What should we do before deciding if an object floats?',a:'make a prediction and test it',options:['make a prediction and test it','guess and stop','throw it away']},
 {q:'What can a magnet attract?',a:'some metal objects',options:['some metal objects','every object','only water']},
 {q:'What gives Earth light during the day?',a:'the sun',options:['the sun','the moon','a cloud']}
];
var LOGIC=[
 {q:'What comes next? 🔴 🔵 🔴 🔵',a:'🔴',options:['🔴','🔵','🟡']},
 {q:'Which one does not belong?',a:'banana',options:['banana','cat','dog']},
 {q:'If you put on socks before shoes, what comes first?',a:'socks',options:['socks','shoes','hat']},
 {q:'Which arrow moves right?',a:'➡️',options:['➡️','⬅️','⬆️']}
];
var WELL=[
 {q:'A friend is sad. What is a kind choice?',a:'ask if they want help',options:['ask if they want help','laugh at them','take their toy']},
 {q:'You feel frustrated. What can help?',a:'pause and take a slow breath',options:['pause and take a slow breath','throw something','shout at everyone']},
 {q:'What should you do before crossing a street with a grown-up?',a:'stop and look both ways',options:['stop and look both ways','run quickly','close your eyes']}
];
return {LETTERS:LETTERS,UPPER:UPPER,CVC:CVC,DIGRAPHS:DIGRAPHS,BLENDS:BLENDS,SIGHT:SIGHT,SENTENCES:SENTENCES,STORIES:STORIES,VOCAB:VOCAB,SHAPES:SHAPES,SCI:SCI,LOGIC:LOGIC,WELL:WELL};
})();
