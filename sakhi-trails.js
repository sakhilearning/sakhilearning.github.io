window.SakhiTrails=(function(){
'use strict';
var T={
 reading:{name:'Unicorn Rainbow Meadow',icon:'🦄',companion:'Luna the Unicorn',chapters:['Sound Meadow','Letter Bridge','Word Garden','Story Tower','Reading Crown'],palette:['#7c4dff','#ff72b6','#65d7ff'],objects:['rainbow stars','magic books','letter crystals']},
 math:{name:'Royal Number Academy',icon:'💎',companion:'Princess Nova',chapters:['Counting Garden','Number Courtyard','Addition Ballroom','Shape Tower','Crystal Crown Chamber'],palette:['#7856d8','#67c9ff','#ffd36e'],objects:['crystals','jewels','golden stars']},
 writing:{name:'Rainbow Storybook Studio',icon:'📖',companion:'Princess Mira',chapters:['Stroke Garden','Letter Atelier','Word Workshop','Sentence Gallery','Author Balcony'],palette:['#f06aa8','#ffb65c','#a987ff'],objects:['lanterns','ribbons','ink stars']},
 language:{name:'Royal Castle Academy',icon:'🏰',companion:'Princess Bellea',chapters:['Listening Gate','Word Hall','Sequence Stair','Story Library','Crown of Stories'],palette:['#b76be3','#f7a8c9','#f4d06f'],objects:['roses','books','story gems']},
 science:{name:'Mermaid Discovery Lagoon',icon:'🧜‍♀️',companion:'Coral the Mermaid',chapters:['Observation Cove','Living Reef','Experiment Bay','Weather Lighthouse','Starlight Sea'],palette:['#16b9c5','#6edbd1','#ff8fb8'],objects:['pearls','shells','sea stars']},
 logic:{name:'Ice Princess Palace',icon:'❄️',companion:'Faye the Fairy',chapters:['Sorting Path','Pattern Arbor','Sequence Pond','Puzzle Pavilion','Thinking Tree'],palette:['#9b67dc','#67c9ff','#dff7ff'],objects:['snow gems','crystals','puzzle stars']},
 wellbeing:{name:'Enchanted Forest Friends',icon:'🦌',companion:'Princess Amara',chapters:['Feelings Path','Kindness Grove','Routine Cottage','Safety Gate','Friendship Fountain'],palette:['#ef78a8','#9dd88b','#ffd57f'],objects:['flowers','hearts','kindness stars']},
 creative:{name:'Pixie Art Garden',icon:'🧚',companion:'Stella the Fairy',chapters:['Finger Gym','Art Studio','Music Stage','Imagination Cloud','Starlight Showcase'],palette:['#8a63d2','#ff7eb6','#63c8e8'],objects:['sparkles','ribbons','stars']}
};
Object.keys(T).forEach(function(k){Object.freeze(T[k]);}); Object.freeze(T);
function get(domain){return T[domain]||T.reading;}
function chapter(domain,percent){var t=get(domain),i=Math.min(4,Math.max(0,Math.floor((percent||0)/20)));return t.chapters[i];}
return{get:get,all:function(){return T;},chapter:chapter};
})();
