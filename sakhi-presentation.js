/* Sakhi presentation decorator.
 *
 * Converts semantic visual roles into props from the fixed subject trail.
 * It is deliberately downstream of activity generation: answers, difficulty,
 * item choice and curriculum selection are never changed here.
 */
window.SakhiPresentation = (function(){
  'use strict';
  function clone(x){return JSON.parse(JSON.stringify(x));}
  function decorateQuestion(question,trail){
    var q=clone(question),m=q.media;
    if(!m)return q;
    if(m.semanticRole==='countable.primary' && m.repeat) m.repeat=trail.props.primary;
    if(m.semanticRole==='compare.groups' && m.groups){
      if(m.groups[0])m.groups[0].emoji=trail.props.primary;
      if(m.groups[1])m.groups[1].emoji=trail.props.secondary;
    }
    /* V2 math activities predate semantic roles. Theme them here because the
       domain/trail has already been chosen; the underlying number is untouched. */
    if(trail.domain==='math'){
      if(m.repeat && ['⭐','💎','🌸','🐚','❄️'].indexOf(m.repeat)!==-1)m.repeat=trail.props.primary;
      if(m.groups)m.groups.forEach(function(g,i){if(g.emoji==='⭐')g.emoji=i?trail.props.secondary:trail.props.primary;});
      if(m.tens!=null){m.tenSymbol='🔷';m.oneSymbol='💎';}
    }
    return q;
  }
  function decorateActivity(activity,trail){
    var a=clone(activity);a.questions=a.questions.map(function(q){return decorateQuestion(q,trail);});return a;
  }
  function storyPrompt(trail,skillTitle,index){
    var frames={
      reading:['A page is glowing at '+trail.landmarks[index]+'!','Luna found a sound clue.','A story door is waiting for the right words.'],
      math:['The crystal palace needs your number magic.','Nova found a gem puzzle.','Light the next crystal with your math thinking.'],
      writing:['A butterfly brought a message for the studio.','Mira needs your careful hand.','Add one more mark to the author gallery.'],
      language:['Wren opened a story with a mystery inside.','Listen for the clue hidden in the story.','Your words can help the library grow.'],
      logic:['The ballroom puzzle doors are locked.','Princess Amara spotted a secret rule.','One clever choice will light the next chandelier.'],
      science:['Coral found something curious in the lagoon.','Make a scientist choice: look, predict, then decide.','A discovery shell is waiting to open.']
    };
    var a=frames[trail.domain]||frames.reading; return a[(index||0)%a.length]+' Today: '+skillTitle+'.';
  }
  return{decorateQuestion:decorateQuestion,decorateActivity:decorateActivity,storyPrompt:storyPrompt};
})();
