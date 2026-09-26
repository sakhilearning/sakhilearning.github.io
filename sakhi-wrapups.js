(function(window){
'use strict';
var WRAP_UPS={
  reading:{prompt:'Reading finish: choose one word from today and show how you read it.',steps:['Say the word slowly.','Point out one sound, vowel, or word part that helped you.','Use the word in a new sentence.'],success:'The word is read and used in a meaningful sentence.'},
  math:{prompt:'Math finish: build one problem from today with toys, blocks, or crayons.',steps:['Choose a number idea you used today.','Build it and solve it once.','Change one number, solve again, and say what changed.'],success:'Two connected examples are solved and compared.'},
  writing:{prompt:'Writing finish: make one clear example from today on paper.',steps:['Write one letter, number, word, or sentence from the lesson.','Check its order, spacing, or shape.','Fix one part that could be clearer.'],success:'The work is checked and improved once.'},
  language:{prompt:'Listening finish: retell one idea you heard today in your own words.',steps:['Say what the idea was about.','Give one important detail.','Answer one how or why question about it.'],success:'The retell includes the main idea and one useful detail.'},
  science:{prompt:'Science finish: make one claim from today and support it with evidence.',steps:['Name what you observed or learned.','Say what you think it shows.','Give one fact or observation that supports your idea.'],success:'A clear claim is connected to evidence.'},
  logic:{prompt:'Thinking finish: make a small puzzle that uses today’s rule.',steps:['Build or draw an example.','Say the rule clearly.','Change one part and decide whether the rule still works.'],success:'The example, rule, and changed case all connect.'},
  wellbeing:{prompt:'Life-skill finish: practice one safe choice from today.',steps:['Name the situation.','Act out or describe the helpful choice.','Say when you could use that choice again.'],success:'The child connects a helpful choice to a real situation.'},
  creative:{prompt:'Creative finish: improve one thing you made, drew, built, or performed.',steps:['Choose one part to change.','Make the change.','Say why the new version works better or feels different.'],success:'One intentional change is made and explained.'},
  world:{prompt:'World finish: connect one idea from today to a real place, person, or time.',steps:['Name the idea.','Give one clue or fact about it.','Compare it with something you know today.'],success:'One world or history idea is supported and compared.'}
};
var FALLBACK={prompt:'Finish line: use one idea from today in a new example.',steps:['Choose the idea.','Make or explain one example.','Check that the example matches the idea.'],success:'The new example matches today’s learning.'};
function forDomain(domain){return WRAP_UPS[domain]||FALLBACK;}
window.SakhiWrapUps={all:WRAP_UPS,fallback:FALLBACK,forDomain:forDomain};
})(window);
