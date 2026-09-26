const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'data/curriculum-v3.json'), 'utf8'));
const context = { window: {}, console };
context.window = context;
context.SakhiCurriculum = { skill: id => curriculum.skills.find(skill => skill.skill_id === id) || null };
vm.createContext(context);
for (const file of ['sakhi-content.js', 'sakhi-activities.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}

const replacements = {
  '🌸': 'flower', '🦋': 'butterfly', '⭐': 'star', '🌈': 'rainbow',
  '🌙': 'moon', '🔴': 'red circle', '🔵': 'blue circle', '🟡': 'yellow circle',
  '🦄': 'unicorn', '🐚': 'shell', '🐠': 'fish', '⬜': 'empty square',
  '➡️': 'right arrow', '⬅️': 'left arrow', '⬆️': 'up arrow'
};
function spokenValue(value) {
  let text = String(value || '');
  for (const [symbol, word] of Object.entries(replacements)) text = text.split(symbol).join(word);
  return text.replace(/\/([a-z]+)\//gi, '$1 sound').replace(/\s*=\s*\?/g, ' equals what number?').replace(/−/g, ' minus ').replace(/\+/g, ' plus ').replace(/\s+/g, ' ').trim();
}
function narration(question) {
  return spokenValue(question.spoken_instruction || question.narration || question.prompt || '');
}

const texts = new Set([
  'Hello, little explorer. Shall we make a little magic? Take your time. I am right here with you.',
  'Look carefully.', 'Take your time.', 'You can do this one step at a time.',
  'Try saying or counting it slowly.', 'Complete each step in order.'
]);
for (const skill of curriculum.skills) {
  const perSkill = new Set();
  const perBandLimit = skill.domain_id === 'math' ? 30 : ['science', 'language', 'reading', 'writing'].includes(skill.domain_id) ? 20 : 12;
  for (let band = 1; band <= 5; band++) {
    const perBand = new Set();
    for (let seed = 0; seed < 240 && perBand.size < perBandLimit; seed++) {
      const activity = context.SakhiActivities.generate(skill.skill_id, band, `narration-v5:${seed}`);
      for (const question of activity.questions) {
        const text = narration(question);
        if (text) { perBand.add(text); perSkill.add(text); }
        for (const hint of question.hints || []) texts.add(spokenValue(hint));
        if (perBand.size >= perBandLimit) break;
      }
    }
  }
  for (const text of perSkill) texts.add(text);
}
const output = [...texts].filter(Boolean).sort((a, b) => a.localeCompare(b));
fs.writeFileSync(path.join(root, 'assets/audio/narration/texts-v5.json'), JSON.stringify(output, null, 2));
console.log(`Collected ${output.length} stable narration lines.`);
