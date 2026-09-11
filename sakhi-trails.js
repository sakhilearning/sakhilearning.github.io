/* Sakhi Learning Trails.
 *
 * The trail is a PRESENTATION MAP from an already-selected curriculum domain
 * to a consistent world, companion and set of landmarks. It never selects,
 * unlocks, reorders or scores curriculum skills.
 */
window.SakhiTrails = (function () {
  'use strict';

  var TRAILS = {
    reading: {
      id:'rainbow_reading', domain:'reading', theme_id:'unicorn_meadow', icon:'🌈',
      name:'Rainbow Reading Trail', short:'Reading', companion:'Luna the Unicorn',
      promise:'Follow sounds into words, sentences and little books.',
      landmarks:['Meadow Gate','Sound Bridge','Word Woods','Story Castle','Reading Sky'],
      props:{primary:'✨',secondary:'🌸',token:'📖',success:'🌈'}
    },
    math: {
      id:'crystal_numbers', domain:'math', theme_id:'ice_palace', icon:'💎',
      name:'Crystal Number Palace', short:'Math', companion:'Princess Neve & Nova',
      promise:'Wake crystals with counting, number stories, shapes and patterns.',
      landmarks:['Counting Courtyard','Gem Workshop','Number Tower','Shape Gallery','Aurora Summit'],
      props:{primary:'💎',secondary:'🔷',token:'❄️',success:'✨'}
    },
    writing: {
      id:'butterfly_letters', domain:'writing', theme_id:'butterfly_cottage', icon:'🦋',
      name:'Butterfly Letter Studio', short:'Writing', companion:'Mira the Lantern Fairy',
      promise:'Grow steady strokes into letters, words and your own stories.',
      landmarks:['Stroke Garden','Letter Lanterns','Word Workshop','Sentence Studio','Author Balcony'],
      props:{primary:'🦋',secondary:'🌷',token:'✏️',success:'✨'}
    },
    language: {
      id:'enchanted_stories', domain:'language', theme_id:'forest_glade', icon:'📚',
      name:'Enchanted Story Library', short:'Stories', companion:'Wren the Story Owl',
      promise:'Listen, wonder, talk, retell and discover what stories mean.',
      landmarks:['Listening Nook','Question Grove','Story Steps','Meaning Tree','Storyteller Stage'],
      props:{primary:'📖',secondary:'🍃',token:'🏮',success:'✨'}
    },
    logic: {
      id:'royal_puzzles', domain:'logic', theme_id:'royal_castle', icon:'👑',
      name:'Royal Puzzle Ballroom', short:'Puzzles', companion:'Princess Amara',
      promise:'Use memory, patterns, sequences and clever new rules.',
      landmarks:['Memory Fountain','Pattern Hall','Sequence Staircase','Puzzle Ballroom','Coding Crown'],
      props:{primary:'💠',secondary:'🌹',token:'👑',success:'✨'}
    },
    science: {
      id:'mermaid_discovery', domain:'science', theme_id:'mermaid_lagoon', icon:'🧜‍♀️',
      name:'Mermaid Discovery Lagoon', short:'Discovery', companion:'Coral the Mermaid',
      promise:'Observe the world, make predictions and test ideas.',
      landmarks:['Senses Shore','Nature Reef','Experiment Cove','Weather Lighthouse','Space Lookout'],
      props:{primary:'🐚',secondary:'🫧',token:'⭐',success:'🌊'}
    }
  };

  function all(){return Object.keys(TRAILS).map(function(k){return TRAILS[k];});}
  function forDomain(domain){return TRAILS[domain]||TRAILS.reading;}
  function forSkill(skillId){
    var c=window.SakhiCurriculum, sk=c&&c.skill(skillId);
    return forDomain(sk?sk.domain_id:String(skillId||'reading').split('.')[0]);
  }
  function stageForSkill(skillId){
    var c=window.SakhiCurriculum, sk=c&&c.skill(skillId); if(!sk)return 0;
    var list=c.skillsIn(sk.domain_id),idx=list.findIndex(function(x){return x.skill_id===skillId;});
    if(idx<0||!list.length)return 0;
    return Math.min(4,Math.floor(idx/list.length*5));
  }
  function landmarkForSkill(skillId){var t=forSkill(skillId);return t.landmarks[stageForSkill(skillId)]||t.landmarks[0];}
  function progress(domain,masteryOf){
    var c=window.SakhiCurriculum,list=c?c.skillsIn(domain):[]; if(!list.length)return{done:0,total:0,pct:0};
    var done=list.filter(function(s){var m=masteryOf(s.skill_id);return m==='MASTERED'||m==='MOSTLY_MASTERED';}).length;
    return{done:done,total:list.length,pct:Math.round(done/list.length*100)};
  }

  return{TRAILS:TRAILS,all:all,forDomain:forDomain,forSkill:forSkill,stageForSkill:stageForSkill,landmarkForSkill:landmarkForSkill,progress:progress};
})();
