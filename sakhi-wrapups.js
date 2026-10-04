(function(window){
'use strict';
var WRAP_UPS={
  reading:{prompt:'Reading treasure: pick one favorite word from today and make it yours.',steps:['Say the word slowly.','Tap or point to the sound or word part that helped you read it.','Make a silly new sentence with the word.'],success:'The word is read, one helpful clue is noticed, and the word is used in a new sentence.'},
  math:{prompt:'Math treasure: build a tiny puzzle with blocks, toys, or crayons.',steps:['Build one number idea from today.','Solve your little puzzle.','Change one number and discover what changes.'],success:'Two connected math examples are built, solved, and compared.'},
  writing:{prompt:'Writing treasure: make one tiny piece you are proud to keep.',steps:['Write one letter, word, number, or sentence from today.','Look at it like a detective: check shape, order, spacing, or punctuation.','Choose one tiny part to make even clearer.'],success:'One piece of writing is created, checked, and improved.'},
  language:{prompt:'Story treasure: tell one idea from today like you are the storyteller.',steps:['Tell what it was mostly about.','Add one important detail.','Tell one thing you wondered, predicted, or figured out.'],success:'The child retells the main idea, includes a detail, and adds one thoughtful connection.'},
  science:{prompt:'Mini scientist mission: find one real thing near you that connects to today’s discovery.',steps:['Look for a safe example around you.','Say what you notice.','Tell how your observation connects to what you learned.'],success:'A real observation is connected to the science idea from the lesson.'},
  logic:{prompt:'Puzzle-maker mission: invent one tiny puzzle using today’s rule.',steps:['Build, draw, or say your puzzle.','Tell the rule.','Change one part and decide if the rule still works.'],success:'The child creates a puzzle, states the rule, and tests a changed example.'},
  wellbeing:{prompt:'Kindness mission: choose one helpful move you could really use today.',steps:['Think of one everyday situation.','Show or say the helpful choice.','Tell when you might try it.'],success:'A helpful choice is connected to one realistic situation.'},
  creative:{prompt:'Creator mission: give one thing you made a magical upgrade.',steps:['Pick one part to change.','Make the change.','Give your new version a name or tell why you like it better.'],success:'One intentional creative change is made and described.'},
  world:{prompt:'Explorer mission: connect today’s world idea to something you know or can find.',steps:['Name the place, person, time, map clue, or invention.','Tell one fact or clue about it.','Compare it with something in your life today.'],success:'One history or world idea is supported by a clue and connected to the present.'}
};
var FALLBACK={prompt:'Finish-line treasure: use one thing you learned in a brand-new way.',steps:['Pick your favorite idea.','Make, show, or explain one new example.','Check that your example really matches the idea.'],success:'The new example clearly uses today’s learning.'};
function forDomain(domain){return WRAP_UPS[domain]||FALLBACK;}
window.SakhiWrapUps={all:WRAP_UPS,fallback:FALLBACK,forDomain:forDomain};
})(window);
