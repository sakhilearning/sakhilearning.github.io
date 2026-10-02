/* The single enumeration of every line the app can speak.
 *
 * The collector that writes texts-v5.json and the suite that guards it must
 * agree exactly: if the collector samples less than the runtime can reach, the
 * pack is short and the iPad throws on a line it was never given; if the suite
 * samples differently from the collector, the two argue forever about lines
 * neither is wrong about. So both import this.
 *
 * Enumeration runs each skill, band and teach/no-teach shape until the seeds
 * stop producing anything new, which terminates because the item banks are
 * finite. That matters now: the banks used to hold about four distinct tasks
 * per skill, so a small sample happened to cover them, and deepening them broke
 * that unstated assumption.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function runtime() {
  const curriculum = JSON.parse(read('data/curriculum-v3.json'));
  const context = { console };
  context.window = context;
  context.self = context;
  /* sakhi-audio.js is a browser module. Nothing used here touches the network
   * or the audio device; these only let it evaluate. */
  context.document = { addEventListener() {}, readyState: 'complete', baseURI: 'http://localhost/' };
  context.navigator = { onLine: false, userAgent: 'node' };
  context.fetch = () => Promise.reject(new Error('offline during enumeration'));
  context.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  context.setTimeout = setTimeout;
  context.clearTimeout = clearTimeout;
  context.AbortController = AbortController;
  context.URL = URL;
  context.SakhiCurriculum = { skill: id => curriculum.skills.find(s => s.skill_id === id) || null };
  vm.createContext(context);
  for (const file of ['sakhi-content.js', 'sakhi-activities.js', 'sakhi-wrapups.js', 'sakhi-audio.js']) {
    vm.runInContext(read(file), context, { filename: file });
  }
  return { curriculum, context, Audio: context.window.SakhiAudio, Activities: context.SakhiActivities };
}

/* Lines the app speaks outside a question. */
const STATIC_LINES = [
  'Hello, little explorer. Shall we make a little magic? Take your time. I am right here with you.',
  'Look carefully.', 'Take your time.', 'You can do this one step at a time.',
  'Try saying or counting it slowly.', 'Complete each step in order.',
  'Complete one step at a time. Ask for help only if you need it.'
];

function collect({ quietSeeds = 60, maxSeeds = 400 } = {}) {
  const { curriculum, context, Audio, Activities } = runtime();
  const lines = new Set(STATIC_LINES);
  /* Everything reaches the voice through speakText, which splits first, so the
   * pack is keyed on chunks rather than on whole utterances. */
  const add = value => {
    for (const chunk of Audio.childChunks(String(value || ''))) {
      const text = chunk.trim();
      if (text) lines.add(text);
    }
  };
  for (const wrap of [...Object.values(context.SakhiWrapUps.all), context.SakhiWrapUps.fallback]) add(wrap.prompt);

  for (const skill of curriculum.skills) {
    for (let band = 1; band <= 5; band++) {
      /* A first meeting teaches before testing, so it speaks an explanation and
       * a worked example that a later sitting never asks for. */
      for (const teachFirst of [false, true]) {
        let quiet = 0;
        for (let seed = 0; seed < maxSeeds && quiet < quietSeeds; seed++) {
          const before = lines.size;
          const activity = Activities.generate(skill.skill_id, band, 'narration-v5:' + seed, [], { teachFirst });
          for (const question of activity.questions) {
            for (const segment of Audio.questionSegments(question, false)) add(segment);
            for (const segment of Audio.questionSegments(question, true)) add(segment);
            for (const hint of question.hints || []) add(hint);
          }
          quiet = lines.size === before ? quiet + 1 : 0;
        }
      }
    }
  }
  return [...lines].filter(Boolean).sort((a, b) => a.localeCompare(b));
}

module.exports = { collect, runtime, STATIC_LINES };
