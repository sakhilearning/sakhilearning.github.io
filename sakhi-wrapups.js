(function(window){
'use strict';
var WRAP_UPS={
  reading:{label:'Reading treasure',prompt:'Reading finish: choose one word from today and show how you read it.',steps:['Say the word slowly.','Point out one sound, vowel, or word part that helped you.','Use the word in a silly new sentence.'],success:'The word is read and used in a meaningful new sentence.'},
  math:{label:'Math treasure',prompt:'Math finish: build one problem from today with toys, blocks, or crayons.',steps:['Choose a number idea you used today.','Build it and solve it once.','Change one number, solve again, and say what changed.'],success:'Two connected examples are solved and compared.'},
  writing:{label:'Proud writing treasure',prompt:'Writing finish: make one clear example from today on paper.',steps:['Write one letter, number, word, or sentence from the lesson.','Check its order, spacing, shape, or punctuation like a detective.','Fix one small part that could be clearer.'],success:'The work is checked and improved once.'},
  language:{label:'Storyteller treasure',prompt:'Listening finish: retell one idea you heard today in your own words.',steps:['Say what the idea was mostly about.','Give one important detail.','Add one thing you wondered, predicted, or figured out.'],success:'The retell includes the main idea and one useful detail.'},
  science:{label:'Mini scientist mission',prompt:'Science finish: make one claim from today and support it with evidence.',steps:['Find a safe real example or remember one from today.','Say what you notice or learned.','Tell how that observation supports your idea.'],success:'A clear claim is connected to evidence.'},
  logic:{label:'Puzzle-maker mission',prompt:'Thinking finish: make a small puzzle that uses today’s rule.',steps:['Build, draw, or say your puzzle.','Say the rule clearly.','Change one part and decide whether the rule still works.'],success:'The example, rule, and changed case all connect.'},
  wellbeing:{label:'Kindness mission',prompt:'Life-skill finish: practice one safe choice from today.',steps:['Think of one everyday situation.','Show or say the helpful choice.','Say when you could use that choice again.'],success:'The child connects a helpful choice to a real situation.'},
  creative:{label:'Creator upgrade',prompt:'Creative finish: improve one thing you made, drew, built, or performed.',steps:['Choose one part to change.','Make the change.','Give the new version a name or say why you like it better.'],success:'One intentional change is made and explained.'},
  world:{label:'Explorer mission',prompt:'World finish: connect one idea from today to a real place, person, or time.',steps:['Name the place, person, time, map clue, or invention.','Give one clue or fact about it.','Compare it with something you know today.'],success:'One world or history idea is supported and compared.'}
};
var FALLBACK={label:'Finish-line treasure',prompt:'Finish line: use one idea from today in a new example.',steps:['Choose the idea.','Make or explain one example.','Check that the example matches the idea.'],success:'The new example matches today’s learning.'};
function forDomain(domain){return WRAP_UPS[domain]||FALLBACK;}
window.SakhiWrapUps={all:WRAP_UPS,fallback:FALLBACK,forDomain:forDomain};
})(window);
