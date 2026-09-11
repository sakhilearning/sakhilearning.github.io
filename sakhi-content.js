/* Sakhi content banks — data only, no logic, no theme.
 *
 * One entry per curriculum skill_id. Each entry declares which interaction
 * templates the skill can be taught with, and a compact bank the generator
 * expands into items. Difficulty comes from the BAND applied on top (see
 * sakhi-activities.js), not from writing five copies of every question.
 *
 * Every bank is deliberately small and human-checkable. The generator produces
 * the variety.
 */
window.SakhiContent = (function () {
  'use strict';

  /* ---- shared phonics banks ---------------------------------------------- */

  var CVC = {
    a: ['mat', 'map', 'man', 'sat', 'sad', 'tap', 'tan', 'pan', 'pat', 'cat', 'can', 'cap', 'bat', 'bag', 'dad', 'fan', 'ham', 'hat', 'jam', 'lap', 'rat', 'van', 'wag'],
    e: ['bed', 'hen', 'jet', 'leg', 'net', 'pen', 'pet', 'red', 'ten', 'wet', 'yes', 'get', 'let', 'men'],
    i: ['big', 'bit', 'dig', 'fin', 'fit', 'hit', 'kid', 'lid', 'lip', 'pig', 'pin', 'sit', 'six', 'tin', 'win', 'zip', 'rib'],
    o: ['dog', 'dot', 'fox', 'got', 'hop', 'hot', 'log', 'mop', 'not', 'pot', 'top', 'box', 'cot', 'rod'],
    u: ['bug', 'bus', 'but', 'cup', 'cut', 'fun', 'hug', 'jug', 'mud', 'nut', 'run', 'rug', 'sun', 'tub', 'up']
  };
  var ALL_CVC = Object.keys(CVC).reduce(function (a, k) { return a.concat(CVC[k]); }, []);

  var LETTER_SOUNDS = [
    { letter: 'm', sound: '/m/', word: 'map', emoji: '🗺️' },
    { letter: 's', sound: '/s/', word: 'sun', emoji: '☀️' },
    { letter: 't', sound: '/t/', word: 'top', emoji: '🔝' },
    { letter: 'p', sound: '/p/', word: 'pig', emoji: '🐷' },
    { letter: 'n', sound: '/n/', word: 'net', emoji: '🥅' },
    { letter: 'k', sound: '/k/', word: 'kite', emoji: '🪁' },
    { letter: 'b', sound: '/b/', word: 'bus', emoji: '🚌' },
    { letter: 'd', sound: '/d/', word: 'dog', emoji: '🐶' },
    { letter: 'g', sound: '/g/', word: 'gate', emoji: '🚪' },
    { letter: 'f', sound: '/f/', word: 'fan', emoji: '🪭' },
    { letter: 'l', sound: '/l/', word: 'leg', emoji: '🦵' },
    { letter: 'r', sound: '/r/', word: 'rug', emoji: '🧶' },
    { letter: 'h', sound: '/h/', word: 'hat', emoji: '🎩' }
  ];

  var VOWELS = [
    { letter: 'a', sound: '/a/', word: 'cat', emoji: '🐱' },
    { letter: 'e', sound: '/e/', word: 'bed', emoji: '🛏️' },
    { letter: 'i', sound: '/i/', word: 'pig', emoji: '🐷' },
    { letter: 'o', sound: '/o/', word: 'dog', emoji: '🐶' },
    { letter: 'u', sound: '/u/', word: 'sun', emoji: '☀️' }
  ];

  var DIGRAPHS = {
    sh: ['ship', 'shop', 'fish', 'dish', 'shell', 'shed'],
    ch: ['chip', 'chin', 'chop', 'chick', 'much', 'lunch'],
    th: ['this', 'that', 'then', 'with', 'bath', 'moth'],
    wh: ['when', 'whip', 'whale', 'wheel'],
    ck: ['duck', 'sock', 'back', 'rock', 'lock', 'kick'],
    ng: ['ring', 'king', 'song', 'long', 'wing', 'bang']
  };

  var BLENDS = {
    st: ['stop', 'star', 'step', 'stick'],
    bl: ['black', 'block', 'blob', 'blend'],
    cl: ['clap', 'clip', 'clock', 'cloth'],
    fl: ['flag', 'flip', 'flat', 'flock'],
    gr: ['grab', 'grin', 'grass', 'grip'],
    tr: ['trip', 'truck', 'tree', 'track'],
    sn: ['snap', 'snip', 'snack'],
    sp: ['spin', 'spot', 'spell'],
    pl: ['plan', 'plus', 'plum'],
    cr: ['crab', 'crib', 'crop'],
    dr: ['drum', 'drip', 'dress'],
    fr: ['frog', 'from', 'fresh'],
    sl: ['sled', 'slip', 'slam'],
    sw: ['swim', 'swan', 'sweet']
  };

  var SILENT_E = [
    { base: 'cap', magic: 'cape' }, { base: 'kit', magic: 'kite' },
    { base: 'hop', magic: 'hope' }, { base: 'cub', magic: 'cube' },
    { base: 'pin', magic: 'pine' }, { base: 'tap', magic: 'tape' },
    { base: 'man', magic: 'mane' }, { base: 'rob', magic: 'robe' }
  ];

  var SENTENCES = [
    { text: 'The cat sat on the mat.', words: ['The', 'cat', 'sat', 'on', 'the', 'mat.'] },
    { text: 'A big dog ran to me.', words: ['A', 'big', 'dog', 'ran', 'to', 'me.'] },
    { text: 'I can see the sun.', words: ['I', 'can', 'see', 'the', 'sun.'] },
    { text: 'The pig is in the mud.', words: ['The', 'pig', 'is', 'in', 'the', 'mud.'] },
    { text: 'My red hat is wet.', words: ['My', 'red', 'hat', 'is', 'wet.'] },
    { text: 'We run up the hill.', words: ['We', 'run', 'up', 'the', 'hill.'] }
  ];

  var STORIES = [
    {
      id: 'lost-crown',
      text: 'Mina found a tiny crown by the tree. She asked the bunny who lost it. The bunny hopped to a sad little frog. The frog put the crown back on and smiled.',
      order: ['Mina found a crown', 'Mina asked the bunny', 'The bunny found the frog', 'The frog smiled'],
      questions: [
        { q: 'Who found the crown?', a: 'Mina', options: ['Mina', 'the frog', 'the bunny'] },
        { q: 'Why did Mina ask the bunny?', a: 'to find who lost it', options: ['to find who lost it', 'to eat lunch', 'to climb the tree'] },
        { q: 'How did the frog feel at the end?', a: 'happy', options: ['happy', 'angry', 'sleepy'] }
      ],
      predict: { q: 'The frog is holding the crown. What will happen next?', a: 'the frog will wear it', options: ['the frog will wear it', 'the tree will run', 'the crown will melt'] },
      cause: { q: 'The frog smiled BECAUSE...', a: 'he got his crown back', options: ['he got his crown back', 'it started raining', 'he was hungry'] },
      infer: { q: 'The crown was by the tree and the frog was sad. Who probably dropped it?', a: 'the frog', options: ['the frog', 'Mina', 'the bunny'] },
      main: { q: 'What is this story mostly about?', a: 'returning something lost', options: ['returning something lost', 'baking a cake', 'a rainy day'] }
    },
    {
      id: 'seed',
      text: 'Ravi put one seed in a pot. He gave it water every morning. He set the pot where the sun came in. After many days a small green leaf came up.',
      order: ['Ravi planted a seed', 'He watered it', 'He gave it sun', 'A leaf grew'],
      questions: [
        { q: 'What did Ravi plant?', a: 'a seed', options: ['a seed', 'a shoe', 'a stone'] },
        { q: 'What did he do every morning?', a: 'gave it water', options: ['gave it water', 'sang to it', 'moved it outside'] },
        { q: 'What came up at the end?', a: 'a green leaf', options: ['a green leaf', 'a flower', 'a bird'] }
      ],
      predict: { q: 'The leaf is growing. What will happen if Ravi keeps watering?', a: 'it will grow bigger', options: ['it will grow bigger', 'it will shrink', 'it will turn into a rock'] },
      cause: { q: 'The seed grew BECAUSE...', a: 'it had water and sun', options: ['it had water and sun', 'it was in the dark', 'Ravi shouted at it'] },
      infer: { q: 'Ravi checked the pot every day. He probably felt...', a: 'excited to see it grow', options: ['excited to see it grow', 'bored of the pot', 'afraid of the seed'] },
      main: { q: 'What is this story mostly about?', a: 'how a plant grows', options: ['how a plant grows', 'how to cook', 'a trip to school'] }
    }
  ];

  var VOCAB = [
    { word: 'enormous', a: 'very big', options: ['very big', 'very quiet', 'very cold'], sentence: 'The elephant was enormous.' },
    { word: 'gentle', a: 'soft and kind', options: ['soft and kind', 'loud and fast', 'wet and cold'], sentence: 'She gave the kitten a gentle pat.' },
    { word: 'delighted', a: 'very happy', options: ['very happy', 'very tired', 'very hungry'], sentence: 'He was delighted with his gift.' },
    { word: 'weary', a: 'very tired', options: ['very tired', 'very funny', 'very tall'], sentence: 'After the long walk they were weary.' },
    { word: 'brave', a: 'not afraid', options: ['not afraid', 'very small', 'very sleepy'], sentence: 'The brave girl went first.' }
  ];

  /* ---- science / logic concept banks -------------------------------------- */

  var HABITATS = [
    { animal: 'fish', emoji: '🐟', home: 'ocean', homeEmoji: '🌊' },
    { animal: 'bear', emoji: '🐻', home: 'forest', homeEmoji: '🌲' },
    { animal: 'camel', emoji: '🐫', home: 'desert', homeEmoji: '🏜️' },
    { animal: 'penguin', emoji: '🐧', home: 'ice', homeEmoji: '🧊' },
    { animal: 'frog', emoji: '🐸', home: 'pond', homeEmoji: '🪷' },
    { animal: 'monkey', emoji: '🐒', home: 'jungle', homeEmoji: '🌴' }
  ];
  var FLOAT_SINK = [
    {
      item: 'leaf', emoji: '🍃', a: 'float',
      image: './assets/learning/leaf-water.webp',
      alt: 'A green leaf floating on clear water',
      caption: 'A leaf rests on top of the water.'
    },
    {
      item: 'rock', emoji: '🪨', a: 'sink',
      image: './assets/learning/rock-water.webp',
      alt: 'A gray rock sinking under clear water',
      caption: 'A rock goes down under the water.'
    },
    {
      item: 'shell', emoji: '🐚', a: 'sink',
      image: './assets/learning/shell-water.webp',
      alt: 'A seashell resting on the sandy bottom under water',
      caption: 'A shell can settle on the sand below.'
    },
    { item: 'cork', emoji: '🪵', a: 'float' },
    { item: 'coin', emoji: '🪙', a: 'sink' },
    { item: 'apple', emoji: '🍎', a: 'float' },
    { item: 'spoon', emoji: '🥄', a: 'sink' }
  ];
  var MAGNETS = [
    { item: 'paperclip', emoji: '📎', a: 'sticks' }, { item: 'key', emoji: '🔑', a: 'sticks' },
    { item: 'paper', emoji: '📄', a: 'does not stick' }, { item: 'leaf', emoji: '🍃', a: 'does not stick' },
    { item: 'nail', emoji: '🔩', a: 'sticks' }, { item: 'cup', emoji: '🥤', a: 'does not stick' }
  ];
  var WEATHER = [
    { q: 'It is raining. What do you take?', a: 'umbrella', options: ['umbrella', 'sunglasses', 'sled'] },
    { q: 'Snow falls in which season?', a: 'winter', options: ['winter', 'summer', 'spring'] },
    { q: 'Leaves fall from trees in...', a: 'autumn', options: ['autumn', 'summer', 'winter'] },
    { q: 'It is hot and sunny. What do you wear?', a: 'a sun hat', options: ['a sun hat', 'a snow coat', 'rain boots'] }
  ];
  var PLANTS = { order: ['seed', 'sprout', 'small plant', 'flower'], needs: { q: 'What does a plant need to grow?', a: 'water and sun', options: ['water and sun', 'candy and rocks', 'shoes and hats'] } };
  var LIGHT_SOUND = [
    { q: 'Which one makes a sound?', a: 'drum', options: ['drum', 'rock', 'sock'] },
    { q: 'A shadow appears when something blocks...', a: 'light', options: ['light', 'water', 'wind'] },
    { q: 'Which is loudest?', a: 'thunder', options: ['thunder', 'a whisper', 'a leaf'] }
  ];
  var SPACE = [
    { q: 'What do we see in the sky at night?', a: 'the moon', options: ['the moon', 'the sun', 'a rainbow'] },
    { q: 'The sun gives us...', a: 'light and heat', options: ['light and heat', 'rain and snow', 'sand'] },
    { q: 'Day comes after...', a: 'night', options: ['night', 'lunch', 'winter'] }
  ];
  var OBSERVE = [
    { q: 'Which one is different?', items: ['🍎', '🍎', '🍌', '🍎'], a: '🍌' },
    { q: 'Which one is different?', items: ['⭐', '⭐', '⭐', '🌙'], a: '🌙' },
    { q: 'Which one is different?', items: ['🐟', '🐦', '🐟', '🐟'], a: '🐦' }
  ];

  var SORT_RULES = [
    { rule: 'Things that fly', yes: ['🦋', '🐦', '✈️'], no: ['🐟', '🚗', '🐢'] },
    { rule: 'Things you eat', yes: ['🍎', '🥕', '🍞'], no: ['👟', '📚', '🪑'] },
    { rule: 'Living things', yes: ['🌳', '🐶', '🦋'], no: ['🪨', '🥄', '🚗'] },
    { rule: 'Things with wheels', yes: ['🚗', '🚲', '🚌'], no: ['🐱', '🌲', '🎈'] }
  ];

  var PATTERNS = [
    { seq: ['🔴', '🔵', '🔴', '🔵', '🔴'], a: '🔵', rule: 'AB', options: ['🔵', '🔴', '🟡'] },
    { seq: ['⭐', '⭐', '🌙', '⭐', '⭐'], a: '🌙', rule: 'AAB', options: ['🌙', '⭐', '☀️'] },
    { seq: ['🟥', '🟦', '🟨', '🟥', '🟦'], a: '🟨', rule: 'ABC', options: ['🟨', '🟥', '🟩'] },
    { seq: ['🔺', '🔺', '🔵', '🔵', '🔺', '🔺'], a: '🔵', rule: 'AABB', options: ['🔵', '🔺', '🟢'] },
    { seq: ['🌸', '🌿', '🌸', '🌿', '🌸'], a: '🌿', rule: 'AB', options: ['🌿', '🌸', '🍄'] }
  ];

  var DEDUCTION = [
    { clue: 'It has four legs and says woof.', a: 'dog', options: ['dog', 'bird', 'fish'] },
    { clue: 'It is yellow, curved, and you peel it.', a: 'banana', options: ['banana', 'apple', 'grape'] },
    { clue: 'It is cold, white, and falls in winter.', a: 'snow', options: ['snow', 'sand', 'rain'] },
    { clue: 'It is not red and not blue. It is the colour of grass.', a: 'green', options: ['green', 'red', 'blue'] }
  ];

  var CODING = [
    { goal: 'Move the unicorn to the star', grid: '3x1', a: ['➡️', '➡️'], options: ['➡️', '⬅️', '⬆️'], steps: 2 },
    { goal: 'Get to the apple', grid: '2x2', a: ['➡️', '⬇️'], options: ['➡️', '⬇️', '⬅️'], steps: 2 },
    { goal: 'Reach the castle', grid: '3x2', a: ['➡️', '➡️', '⬇️'], options: ['➡️', '⬇️', '⬆️'], steps: 3 }
  ];

  var SPATIAL = [
    { q: 'Which shape fits the hole?', a: '🔺', options: ['🔺', '⬛', '⭕'] },
    { q: 'The ball is ___ the box.', a: 'inside', options: ['inside', 'under', 'behind'] },
    { q: 'Which one is upside down?', a: '🙃', options: ['🙃', '🙂', '😐'] }
  ];

  var STEP_SEQUENCES = [
    { task: 'Planting a seed', order: ['dig a hole', 'drop the seed', 'cover it', 'water it'] },
    { task: 'Getting ready for bed', order: ['put on pyjamas', 'brush teeth', 'read a story', 'go to sleep'] },
    { task: 'Making toast', order: ['take the bread', 'put it in the toaster', 'wait', 'eat it'] }
  ];

  /* ---- math banks --------------------------------------------------------- */

  var SHAPES = [
    { name: 'circle', emoji: '⭕', sides: 0 }, { name: 'triangle', emoji: '🔺', sides: 3 },
    { name: 'square', emoji: '🟥', sides: 4 }, { name: 'star', emoji: '⭐', sides: 5 }
  ];
  var MEASURE = [
    { q: 'Which is taller?', a: '🌳', options: ['🌳', '🌱'] },
    { q: 'Which is heavier?', a: '🐘', options: ['🐘', '🐭'] },
    { q: 'Which is longer?', a: '🚌', options: ['🚌', '🚲'] },
    { q: 'Which holds more?', a: '🪣', options: ['🪣', '🥄'] }
  ];

  /* ---- per-skill declarations --------------------------------------------- */
  /* template: which interaction to use. bank: the data the generator expands. */

  var SKILLS = {
    // ---------- reading ----------
    'reading.letter_sounds': { templates: ['choice'], bank: LETTER_SOUNDS, kind: 'letter_sound' },
    'reading.short_vowels': { templates: ['choice'], bank: VOWELS, kind: 'vowel' },
    'reading.blend_segment': { templates: ['build'], bank: ALL_CVC, kind: 'segment' },
    'reading.cvc_mixed': { templates: ['choice', 'build'], bank: CVC, kind: 'cvc_read' },
    'reading.cvc_encode': { templates: ['build'], bank: CVC, kind: 'cvc_spell' },
    'reading.digraphs': { templates: ['choice', 'build'], bank: DIGRAPHS, kind: 'digraph' },
    'reading.blends': { templates: ['choice', 'build'], bank: BLENDS, kind: 'blend' },
    'reading.sentences': { templates: ['sequence', 'choice'], bank: SENTENCES, kind: 'sentence' },
    'reading.stories': { templates: ['choice', 'sequence'], bank: STORIES, kind: 'story_read' },
    'reading.fluency': { templates: ['choice'], bank: SENTENCES, kind: 'fluency' },
    'reading.advanced': { templates: ['choice', 'build'], bank: SILENT_E, kind: 'silent_e' },

    // ---------- math ----------
    'math.number_sense': { templates: ['count'], bank: { max: 10 }, kind: 'count' },
    'math.compose_to_10': { templates: ['choice', 'count'], bank: { target: 10 }, kind: 'compose' },
    'math.addition': { templates: ['count', 'choice'], bank: { max: 10 }, kind: 'add' },
    'math.subtraction': { templates: ['count', 'choice'], bank: { max: 10 }, kind: 'sub' },
    'math.number_bonds': { templates: ['choice'], bank: { target: 10 }, kind: 'bond' },
    'math.missing_parts': { templates: ['choice'], bank: { target: 10 }, kind: 'missing' },
    'math.patterns': { templates: ['choice'], bank: PATTERNS, kind: 'pattern' },
    'math.geometry': { templates: ['choice', 'sort'], bank: SHAPES, kind: 'shape' },
    'math.measurement': { templates: ['choice'], bank: MEASURE, kind: 'measure' },
    'math.place_value': { templates: ['choice', 'count'], bank: { max: 20 }, kind: 'place_value' },

    // ---------- language ----------
    'language.listening': { templates: ['choice'], bank: STORIES, kind: 'listen' },
    'language.sequence': { templates: ['sequence'], bank: STORIES, kind: 'story_order' },
    'language.retell': { templates: ['sequence', 'choice'], bank: STORIES, kind: 'retell' },
    'language.prediction': { templates: ['choice'], bank: STORIES, kind: 'predict' },
    'language.cause_effect': { templates: ['choice'], bank: STORIES, kind: 'cause' },
    'language.inference': { templates: ['choice'], bank: STORIES, kind: 'infer' },
    'language.vocabulary': { templates: ['choice'], bank: VOCAB, kind: 'vocab' },
    'language.main_idea': { templates: ['choice'], bank: STORIES, kind: 'main_idea' },

    // ---------- logic ----------
    'logic.classify': { templates: ['sort'], bank: SORT_RULES, kind: 'classify' },
    'logic.patterns': { templates: ['choice'], bank: PATTERNS, kind: 'pattern' },
    'logic.sequence': { templates: ['sequence'], bank: STEP_SEQUENCES, kind: 'steps' },
    'logic.spatial': { templates: ['choice'], bank: SPATIAL, kind: 'spatial' },
    'logic.deduction': { templates: ['choice'], bank: DEDUCTION, kind: 'deduce' },
    'logic.coding': { templates: ['sequence'], bank: CODING, kind: 'code' },

    // ---------- science ----------
    'science.observe': { templates: ['choice'], bank: OBSERVE, kind: 'observe' },
    'science.habitats': { templates: ['match', 'choice'], bank: HABITATS, kind: 'habitat' },
    'science.float_sink': { templates: ['sort', 'choice'], bank: FLOAT_SINK, kind: 'float' },
    'science.weather': { templates: ['choice'], bank: WEATHER, kind: 'weather' },
    'science.plants': { templates: ['sequence', 'choice'], bank: PLANTS, kind: 'plant' },
    'science.magnets': { templates: ['sort', 'choice'], bank: MAGNETS, kind: 'magnet' },
    'science.light_sound': { templates: ['choice'], bank: LIGHT_SOUND, kind: 'light_sound' },
    'science.space': { templates: ['choice'], bank: SPACE, kind: 'space' },

    // ---------- writing ----------
    'writing.letter_formation': { templates: ['trace'], bank: LETTER_SOUNDS, kind: 'trace' },
    'writing.cvc_words': { templates: ['build'], bank: CVC, kind: 'cvc_spell' },
    'writing.labels': { templates: ['build', 'choice'], bank: LETTER_SOUNDS, kind: 'label' },
    'writing.sentence': { templates: ['sequence'], bank: SENTENCES, kind: 'sentence_build' },
    'writing.story': { templates: ['sequence'], bank: STORIES, kind: 'story_build' }
  };

  return {
    SKILLS: SKILLS,
    CVC: CVC, ALL_CVC: ALL_CVC, LETTER_SOUNDS: LETTER_SOUNDS, VOWELS: VOWELS,
    DIGRAPHS: DIGRAPHS, BLENDS: BLENDS, SILENT_E: SILENT_E,
    SENTENCES: SENTENCES, STORIES: STORIES, VOCAB: VOCAB,
    HABITATS: HABITATS, FLOAT_SINK: FLOAT_SINK, MAGNETS: MAGNETS,
    WEATHER: WEATHER, PLANTS: PLANTS, LIGHT_SOUND: LIGHT_SOUND, SPACE: SPACE,
    OBSERVE: OBSERVE, SORT_RULES: SORT_RULES, PATTERNS: PATTERNS,
    DEDUCTION: DEDUCTION, CODING: CODING, SPATIAL: SPATIAL,
    STEP_SEQUENCES: STEP_SEQUENCES, SHAPES: SHAPES, MEASURE: MEASURE,
    has: function (skillId) { return !!SKILLS[skillId]; },
    coverage: function () { return Object.keys(SKILLS); }
  };
})();


/* ---- V3 Kindergarten content extension (same SakhiContent owner) -------- */
/* Sakhi V3 extension content.
 *
 * This file only owns DATA. It extends the compact V2 banks without changing
 * curriculum selection, difficulty, themes, storage or mastery logic.
 */
window.SakhiContentV3 = (function () {
  'use strict';

  var C = window.SakhiContent;
  if (!C) throw new Error('SakhiContentV3 requires SakhiContent first.');

  var ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('').map(function (l, i) {
    var words = {
      a:['apple','🍎'],b:['ball','⚽'],c:['cat','🐱'],d:['dog','🐶'],e:['egg','🥚'],f:['fish','🐟'],g:['goat','🐐'],h:['hat','🎩'],i:['igloo','🧊'],j:['jam','🍓'],k:['kite','🪁'],l:['leaf','🍃'],m:['moon','🌙'],n:['nest','🪺'],o:['octopus','🐙'],p:['pig','🐷'],q:['queen','👑'],r:['rain','🌧️'],s:['sun','☀️'],t:['turtle','🐢'],u:['umbrella','☂️'],v:['van','🚐'],w:['web','🕸️'],x:['fox','🦊'],y:['yak','🐂'],z:['zip','🤐']
    }[l];
    return { letter:l, upper:l.toUpperCase(), word:words[0], emoji:words[1], index:i };
  });

  /* Add the consonants that the original V2 letter-sound bank did not cover. */
  var EXTRA_LETTER_SOUNDS = [
    { letter:'c', sound:'/k/', word:'cat', emoji:'🐱' },
    { letter:'j', sound:'/j/', word:'jam', emoji:'🍓' },
    { letter:'q', sound:'/kw/', word:'queen', emoji:'👑' },
    { letter:'v', sound:'/v/', word:'van', emoji:'🚐' },
    { letter:'w', sound:'/w/', word:'web', emoji:'🕸️' },
    { letter:'x', sound:'/ks/', word:'fox', emoji:'🦊' },
    { letter:'y', sound:'/y/', word:'yes', emoji:'✅' },
    { letter:'z', sound:'/z/', word:'zip', emoji:'🤐' }
  ];
  EXTRA_LETTER_SOUNDS.forEach(function (x) {
    if (!C.LETTER_SOUNDS.some(function (e) { return e.letter === x.letter; })) C.LETTER_SOUNDS.push(x);
  });

  var RHYMES = [
    { word:'cat', a:'hat', options:['hat','sun','pig'] },
    { word:'sun', a:'run', options:['run','bed','map'] },
    { word:'log', a:'dog', options:['dog','fin','cup'] },
    { word:'pig', a:'wig', options:['wig','top','hen'] },
    { word:'cake', a:'lake', options:['lake','fish','mud'] },
    { word:'star', a:'car', options:['car','moon','tree'] },
    { word:'bee', a:'tree', options:['tree','book','sock'] },
    { word:'light', a:'kite', options:['kite','rain','bell'] }
  ];

  var SYLLABLES = [
    { word:'cat', count:1, beats:'cat' }, { word:'rainbow', count:2, beats:'rain-bow' },
    { word:'unicorn', count:3, beats:'u-ni-corn' }, { word:'butterfly', count:3, beats:'but-ter-fly' },
    { word:'princess', count:2, beats:'prin-cess' }, { word:'castle', count:2, beats:'cas-tle' },
    { word:'elephant', count:3, beats:'el-e-phant' }, { word:'banana', count:3, beats:'ba-na-na' },
    { word:'octopus', count:3, beats:'oc-to-pus' }, { word:'rabbit', count:2, beats:'rab-bit' }
  ];

  var SOUND_WORDS = [
    { word:'map', first:'m', last:'p', emoji:'🗺️' }, { word:'sun', first:'s', last:'n', emoji:'☀️' },
    { word:'tap', first:'t', last:'p', emoji:'👆' }, { word:'pig', first:'p', last:'g', emoji:'🐷' },
    { word:'net', first:'n', last:'t', emoji:'🥅' }, { word:'kite', first:'k', last:'t', emoji:'🪁' },
    { word:'bus', first:'b', last:'s', emoji:'🚌' }, { word:'dog', first:'d', last:'g', emoji:'🐶' },
    { word:'fan', first:'f', last:'n', emoji:'🪭' }, { word:'leg', first:'l', last:'g', emoji:'🦵' },
    { word:'rug', first:'r', last:'g', emoji:'🧶' }, { word:'hat', first:'h', last:'t', emoji:'🎩' },
    { word:'van', first:'v', last:'n', emoji:'🚐' }, { word:'web', first:'w', last:'b', emoji:'🕸️' },
    { word:'zip', first:'z', last:'p', emoji:'🤐' }, { word:'yes', first:'y', last:'s', emoji:'✅' }
  ];

  var ORAL_WORDS = [
    { word:'map', sounds:['m','a','p'], emoji:'🗺️' }, { word:'sun', sounds:['s','u','n'], emoji:'☀️' },
    { word:'dog', sounds:['d','o','g'], emoji:'🐶' }, { word:'pig', sounds:['p','i','g'], emoji:'🐷' },
    { word:'bed', sounds:['b','e','d'], emoji:'🛏️' }, { word:'fish', sounds:['f','i','sh'], emoji:'🐟' },
    { word:'ship', sounds:['sh','i','p'], emoji:'🚢' }, { word:'chat', sounds:['ch','a','t'], emoji:'💬' },
    { word:'ring', sounds:['r','i','ng'], emoji:'💍' }, { word:'duck', sounds:['d','u','ck'], emoji:'🦆' }
  ];

  var HEART_WORDS = [
    { word:'the', sentence:'The cat can run.' }, { word:'is', sentence:'The sun is hot.' },
    { word:'a', sentence:'I see a dog.' }, { word:'I', sentence:'I can hop.' },
    { word:'to', sentence:'We go to the park.' }, { word:'my', sentence:'My hat is red.' },
    { word:'you', sentence:'You can do it.' }, { word:'we', sentence:'We can read.' },
    { word:'she', sentence:'She has a book.' }, { word:'he', sentence:'He can jump.' },
    { word:'was', sentence:'It was fun.' }, { word:'are', sentence:'We are ready.' },
    { word:'of', sentence:'A cup of milk.' }, { word:'do', sentence:'Do you see it?' },
    { word:'does', sentence:'Does it fit?' }
  ];

  var PHONEME_CHANGES = [
    { from:'cat', prompt:'Change /k/ in cat to /m/.', answer:'mat', options:['mat','map','sat'] },
    { from:'map', prompt:'Change /m/ in map to /t/.', answer:'tap', options:['tap','top','mat'] },
    { from:'pig', prompt:'Change /p/ in pig to /d/.', answer:'dig', options:['dig','dog','big'] },
    { from:'sun', prompt:'Change /s/ in sun to /r/.', answer:'run', options:['run','rug','sun'] }
  ];

  var VOWEL_TEAMS = [
    { team:'ai', word:'rain', clue:'r__n', options:['ai','ee','oa'] },
    { team:'ee', word:'seed', clue:'s__d', options:['ee','ai','oa'] },
    { team:'oa', word:'boat', clue:'b__t', options:['oa','ee','ay'] },
    { team:'ay', word:'play', clue:'pl__', options:['ay','ai','ee'] }
  ];

  var NUMERALS = Array.from({length:21}, function (_, i) { return i; });
  var COUNT_SEQUENCE = { max20:20, max100:100 };
  var SOLID_SHAPES = [
    { name:'sphere', image:'./assets/educational/shapes/sphere.svg', property:'round all over' },
    { name:'cube', image:'./assets/educational/shapes/cube.svg', property:'6 flat square faces' },
    { name:'cylinder', image:'./assets/educational/shapes/cylinder.svg', property:'2 flat circles and a curved side' },
    { name:'cone', image:'./assets/educational/shapes/cone.svg', property:'one point and one flat circle' }
  ];
  var SHAPE_COMPOSE = [
    { prompt:'Two triangles can join to make a…', answer:'rectangle', options:['rectangle','circle','cone'] },
    { prompt:'Two squares side by side can make a…', answer:'rectangle', options:['rectangle','triangle','sphere'] },
    { prompt:'Which shape can be made from two half-circles?', answer:'circle', options:['circle','square','cube'] }
  ];
  var DATA_SETS = [
    { q:'Which group has the most?', groups:[['🍎','🍎','🍎'],['🍐','🍐'],['🍓']], answer:'apples', options:['apples','pears','strawberries'] },
    { q:'Which group has the fewest?', groups:[['🦋','🦋'],['🐞'],['🐝','🐝','🐝']], answer:'ladybugs', options:['butterflies','ladybugs','bees'] },
    { q:'How many stars are in the star group?', groups:[['⭐','⭐','⭐','⭐'],['🌙','🌙']], answer:'4', options:['2','3','4'] }
  ];

  var CONVERSATION = [
    { q:'Your friend is talking. What should you do first?', a:'listen until they finish', options:['listen until they finish','talk over them','walk away'] },
    { q:'You did not hear the directions. What can you say?', a:'Can you please say it again?', options:['Can you please say it again?','I will just guess.','Never mind.'] },
    { q:'Someone asks what you like to play. What helps a conversation continue?', a:'answer and ask them a question too', options:['answer and ask them a question too','say nothing','change the subject'] }
  ];
  var QUESTION_WORDS = [
    { clue:'Ask about a person.', a:'who', options:['who','where','when'] },
    { clue:'Ask about a place.', a:'where', options:['where','why','who'] },
    { clue:'Ask about a reason.', a:'why', options:['why','when','what'] },
    { clue:'Ask about a time.', a:'when', options:['when','where','how'] },
    { clue:'Ask about a thing or action.', a:'what', options:['what','who','why'] },
    { clue:'Ask about the way something happens.', a:'how', options:['how','when','where'] }
  ];
  var DESCRIBE = [
    { q:'Which sentence gives the best detail about a butterfly?', a:'The orange butterfly has tiny black spots.', options:['The orange butterfly has tiny black spots.','It is there.','Butterfly.'] },
    { q:'Which sentence tells more about the castle?', a:'The tall castle has three silver towers.', options:['The tall castle has three silver towers.','Castle nice.','It is one.'] },
    { q:'Which sentence describes the puppy clearly?', a:'The small brown puppy is sleeping on a blue rug.', options:['The small brown puppy is sleeping on a blue rug.','Puppy.','It does stuff.'] }
  ];
  var GRAMMAR = [
    { q:'Which one is a complete sentence?', a:'The rabbit hops.', options:['The rabbit hops.','The rabbit','Hops quickly'] },
    { q:'Choose the sentence that sounds right.', a:'Two dogs run.', options:['Two dogs run.','Two dog runs.','Dog two running.'] },
    { q:'Which word completes the sentence? “The fish ___ in water.”', a:'swims', options:['swims','blue','under'] }
  ];

  var MEMORY = [
    { shown:['🌟','🦋','🌙'], missing:'🦋', options:['🦋','🌸','🐚'] },
    { shown:['👑','💎','🌹'], missing:'💎', options:['💎','⭐','🪄'] },
    { shown:['🐚','🐠','🫧'], missing:'🐠', options:['🐠','🦋','🌈'] }
  ];
  var FLEXIBILITY = [
    { q:'First sort by color. Now the rule changes: which two belong together by SHAPE?', a:'the two circles', options:['the two circles','the two red things','the two big things'] },
    { q:'The old rule was “things that fly.” New rule: “things that are animals.” Which belongs now?', a:'dog', options:['dog','airplane','kite'] },
    { q:'A pattern was red-blue-red-blue. New rule is red-red-blue. What comes after red, red?', a:'blue', options:['blue','red','green'] }
  ];

  var SENSES = [
    { q:'Which sense helps you hear a bell?', a:'hearing', options:['hearing','smell','taste'] },
    { q:'Which sense helps you notice a rose’s scent?', a:'smell', options:['smell','sight','hearing'] },
    { q:'Which sense helps you know ice feels cold?', a:'touch', options:['touch','taste','hearing'] },
    { q:'Which sense helps you see a rainbow?', a:'sight', options:['sight','smell','taste'] },
    { q:'Which sense helps you tell lemon is sour?', a:'taste', options:['taste','hearing','touch'] }
  ];
  var LIVING_NEEDS = [
    { q:'What does a plant need to stay alive?', a:'water and light', options:['water and light','stickers and music','shoes and blocks'] },
    { q:'What do animals need?', a:'food, water and a safe place', options:['food, water and a safe place','toys only','paint and paper'] },
    { q:'Which is a living thing?', a:'tree', options:['tree','rock','spoon'] }
  ];
  var MATERIALS = [
    { q:'Which material is usually transparent?', a:'clear glass', options:['clear glass','wood','rock'] },
    { q:'Which object is flexible?', a:'rubber band', options:['rubber band','brick','glass jar'] },
    { q:'Which material soaks up water?', a:'sponge', options:['sponge','metal spoon','plastic block'] },
    { q:'Which material feels hard and smooth?', a:'metal', options:['metal','cotton','sponge'] }
  ];
  var EARTH_MATERIALS = [
    { q:'Which earth material is made of tiny loose grains?', a:'sand', options:['sand','water','leaf'] },
    { q:'What can soil help plants do?', a:'grow', options:['grow','fly','shine'] },
    { q:'Which is a natural earth material?', a:'rock', options:['rock','plastic toy','paper clip'] }
  ];

  var PREWRITING = ['|','—','/','\\','○','∩','∪','~','+'];
  var NAME_LETTERS = 'sakhi'.split('');
  var LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'.split('');
  var SENTENCE_CONVENTIONS = [
    { q:'Which sentence is ready for a book?', a:'The cat is soft.', options:['The cat is soft.','the cat is soft','Thecatissoft'] },
    { q:'Which sentence has spaces in the right places?', a:'I see a red fox.', options:['I see a red fox.','Iseearedfox.','I  seeared fox.'] },
    { q:'Which mark finishes a telling sentence?', a:'.', options:['.','?','!'] },
    { q:'Which mark finishes a question?', a:'?', options:['?','.','!'] }
  ];
  var INFORMATIVE = [
    { sentence:'A frog can jump.', words:['A','frog','can','jump.'] },
    { sentence:'A plant needs water.', words:['A','plant','needs','water.'] },
    { sentence:'The moon shines at night.', words:['The','moon','shines','at','night.'] }
  ];
  var OPINION = [
    { sentence:'I like rainbows because they are colorful.', words:['I','like','rainbows','because','they','are','colorful.'] },
    { sentence:'I like butterflies because they are beautiful.', words:['I','like','butterflies','because','they','are','beautiful.'] },
    { sentence:'I like stories because they take me on adventures.', words:['I','like','stories','because','they','take','me','on','adventures.'] }
  ];

  var EXT = {
    'reading.print_concepts': { templates:['choice'], bank:{}, kind:'v3_print' },
    'reading.alphabet_names': { templates:['choice'], bank:ALPHABET, kind:'v3_alphabet' },
    'reading.rhyme': { templates:['choice'], bank:RHYMES, kind:'v3_rhyme' },
    'reading.syllables': { templates:['choice'], bank:SYLLABLES, kind:'v3_syllable' },
    'reading.initial_sounds': { templates:['choice'], bank:SOUND_WORDS, kind:'v3_initial_sound' },
    'reading.final_sounds': { templates:['choice'], bank:SOUND_WORDS, kind:'v3_final_sound' },
    'reading.oral_blending': { templates:['choice'], bank:ORAL_WORDS, kind:'v3_oral_blend' },
    'reading.oral_segmenting': { templates:['choice'], bank:ORAL_WORDS, kind:'v3_oral_segment' },
    'reading.high_frequency': { templates:['choice'], bank:HEART_WORDS, kind:'v3_heart_word' },
    'reading.vowel_teams': { templates:['choice'], bank:VOWEL_TEAMS, kind:'v3_vowel_team' },

    'math.count_sequence_20': { templates:['choice'], bank:{max:20}, kind:'v3_count_sequence' },
    'math.numeral_recognition_20': { templates:['choice'], bank:NUMERALS, kind:'v3_numeral' },
    'math.subitize': { templates:['count'], bank:{max:6}, kind:'v3_subitize' },
    'math.count_objects_20': { templates:['count'], bank:{max:20}, kind:'v3_count_objects' },
    'math.compare_quantities': { templates:['choice'], bank:{max:10}, kind:'v3_compare_groups' },
    'math.compare_numerals': { templates:['choice'], bank:{max:10}, kind:'v3_compare_numerals' },
    'math.count_sequence_100': { templates:['choice'], bank:{max:100}, kind:'v3_count_sequence_100' },
    'math.data': { templates:['choice'], bank:DATA_SETS, kind:'v3_data' },
    'math.solid_shapes': { templates:['choice'], bank:SOLID_SHAPES, kind:'v3_solid_shape' },
    'math.compose_shapes': { templates:['choice'], bank:SHAPE_COMPOSE, kind:'v3_shape_compose' },

    'language.conversation': { templates:['choice'], bank:CONVERSATION, kind:'v3_scenario' },
    'language.questions': { templates:['choice'], bank:QUESTION_WORDS, kind:'v3_question_word' },
    'language.describe': { templates:['choice'], bank:DESCRIBE, kind:'v3_scenario' },
    'language.grammar': { templates:['choice'], bank:GRAMMAR, kind:'v3_scenario' },

    'logic.memory': { templates:['choice'], bank:MEMORY, kind:'v3_memory' },
    'logic.flexibility': { templates:['choice'], bank:FLEXIBILITY, kind:'v3_scenario' },

    'science.senses': { templates:['choice'], bank:SENSES, kind:'v3_scenario' },
    'science.living_needs': { templates:['choice'], bank:LIVING_NEEDS, kind:'v3_scenario' },
    'science.materials': { templates:['choice'], bank:MATERIALS, kind:'v3_scenario' },
    'science.earth_materials': { templates:['choice'], bank:EARTH_MATERIALS, kind:'v3_scenario' },

    'writing.prewriting_strokes': { templates:['trace'], bank:PREWRITING, kind:'v3_trace_symbol' },
    'writing.name': { templates:['trace'], bank:NAME_LETTERS, kind:'v3_trace_name' },
    'writing.lowercase_letters': { templates:['trace'], bank:LOWERCASE, kind:'v3_trace_lower' },
    'writing.numerals': { templates:['trace'], bank:NUMERALS, kind:'v3_trace_numeral' },
    'writing.spacing_punctuation': { templates:['choice'], bank:SENTENCE_CONVENTIONS, kind:'v3_scenario' },
    'writing.informative': { templates:['sequence'], bank:INFORMATIVE, kind:'v3_sentence_build' },
    'writing.opinion': { templates:['sequence'], bank:OPINION, kind:'v3_sentence_build' }
  };

  Object.keys(EXT).forEach(function (id) { C.SKILLS[id] = EXT[id]; });

  return {
    ALPHABET:ALPHABET, RHYMES:RHYMES, SYLLABLES:SYLLABLES, SOUND_WORDS:SOUND_WORDS,
    ORAL_WORDS:ORAL_WORDS, HEART_WORDS:HEART_WORDS, PHONEME_CHANGES:PHONEME_CHANGES,
    VOWEL_TEAMS:VOWEL_TEAMS, NUMERALS:NUMERALS, SOLID_SHAPES:SOLID_SHAPES,
    extensions:Object.keys(EXT)
  };
})();


/* ---- V3 depth pack -------------------------------------------------------
 * Human-readable, controlled language expansion so six months of practice is
 * not built on the same two stories, five vocabulary words and six sentences.
 * These remain data only and reuse the same content owner/interaction engine.
 */
(function deepenV3Content(){
  'use strict';
  var C=window.SakhiContent;if(!C)return;
  var EXTRA_SENTENCES=[
    'The red fox can hop.','A wet hen sat on a log.','I can pack my bag.','The frog is on the rock.','We can clap and sing.',
    'The duck went in the pond.','A crab hid in the sand.','The fish swam past the ship.','The chick ran to the shed.','I wish for a big shell.',
    'The black cat slept on the rug.','The frog jumps from the grass.','We stop at the red flag.','The crab rests by the rock.','The plum is on the plate.',
    'I made a kite with tape.','The cute mule ate a cube of hay.','We hope to ride a bike.','The brave fox ran home.','The pine tree is tall.',
    'The moon shines at night.','A seed can grow into a plant.','The small bird built a nest.','Rain falls from dark clouds.','My friend and I share books.',
    'The blue butterfly rests on a leaf.','We count the shells on the sand.','The little boat floats on the pond.','I write my name at the top.','The bright star is above the hill.'
  ].map(function(text){return{text:text,words:text.split(' ')};});
  EXTRA_SENTENCES.forEach(function(s){if(!C.SENTENCES.some(function(x){return x.text===s.text;}))C.SENTENCES.push(s);});

  var EXTRA_VOCAB=[
    ['tiny','very small','The tiny seed fit in her hand.'],['gigantic','very large','A gigantic cloud covered the hill.'],['swift','moving fast','The swift rabbit ran home.'],
    ['calm','peaceful and quiet','The pond was calm in the morning.'],['curious','wanting to learn more','The curious child looked under the leaf.'],['patient','able to wait calmly','She was patient while the seed grew.'],
    ['careful','paying close attention','He was careful with the glass jar.'],['observe','look closely to notice details','We observe the ants near the tree.'],['predict','say what you think may happen next','I predict the ice will melt.'],
    ['compare','look for what is the same or different','Compare the two shells.'],['equal','the same amount','Both plates have an equal number of berries.'],['pattern','something that repeats in a rule','The beads make a red-blue pattern.'],
    ['smooth','not rough','The pebble felt smooth.'],['rough','bumpy or uneven','The tree bark felt rough.'],['transparent','letting light pass through','The clear window is transparent.'],
    ['flexible','able to bend without breaking','The ribbon is flexible.'],['habitat','a living thing’s home','A pond is a frog habitat.'],['shelter','a safe place that protects','The nest gives the bird shelter.'],
    ['sprout','a new little plant','A green sprout came out of the soil.'],['moist','a little wet','The soil was moist after watering.'],['shadow','a dark shape made when light is blocked','Her shadow stretched across the path.'],
    ['reflect','send light back','The mirror can reflect light.'],['vibrate','move back and forth quickly','The drum skin can vibrate.'],['season','one part of the year','Winter is a cold season.'],
    ['sequence','an order of steps or events','Put the pictures in sequence.'],['beginning','the first part','The beginning tells how the story starts.'],['middle','the part between the start and end','The problem happened in the middle.'],
    ['ending','the last part','The ending tells how the problem was solved.'],['clue','a detail that helps you figure something out','The wet boots were a clue that it rained.'],['reason','why something happened','She gave a reason for her choice.'],
    ['solution','a way to solve a problem','Sharing was a good solution.'],['proud','happy about doing something with effort','She felt proud after writing her name.'],['frustrated','upset because something is difficult','He felt frustrated when the block tower fell.'],
    ['cooperate','work together','The children cooperate to clean the table.'],['responsible','taking care of what you should do','Putting books away is responsible.']
  ];
  EXTRA_VOCAB.forEach(function(v){var opts=[v[1],'the opposite meaning','a kind of color'];if(!C.VOCAB.some(function(x){return x.word===v[0];}))C.VOCAB.push({word:v[0],a:v[1],options:opts,sentence:v[2]});});

  var STORIES=[
    {id:'rainbow-kite',text:'Maya made a small kite with red and blue paper. The wind was soft, so the kite stayed low. Maya waited. A stronger breeze came, and the kite lifted above the garden.',order:['Maya made a kite','The wind was soft','Maya waited','The kite lifted high'],questions:[{q:'What did Maya make?',a:'a kite',options:['a kite','a boat','a cake']},{q:'Why did the kite stay low at first?',a:'the wind was soft',options:['the wind was soft','it was raining','the string broke']},{q:'What happened after a stronger breeze came?',a:'the kite lifted',options:['the kite lifted','the kite melted','Maya went to sleep']}],predict:{q:'The breeze is getting stronger. What is likely to happen next?',a:'the kite may fly higher',options:['the kite may fly higher','the paper will turn to stone','the garden will disappear']},cause:{q:'The kite lifted BECAUSE...',a:'a stronger breeze came',options:['a stronger breeze came','Maya whispered','the grass was green']},infer:{q:'Maya waited instead of giving up. She was probably...',a:'patient',options:['patient','angry at the kite','asleep']},main:{q:'What is the story mostly about?',a:'waiting for the right wind to fly a kite',options:['waiting for the right wind to fly a kite','cooking lunch','washing a car']}},
    {id:'butterfly-garden',text:'Nora planted flowers beside the fence. She watered them each morning. Soon purple and yellow blossoms opened. Butterflies began visiting the garden for nectar.',order:['Nora planted flowers','She watered them','The flowers opened','Butterflies visited'],questions:[{q:'Where did Nora plant flowers?',a:'beside the fence',options:['beside the fence','inside a shoe','under the bed']},{q:'What did she do each morning?',a:'watered the flowers',options:['watered the flowers','picked every flower','covered them with boxes']},{q:'Who visited the blossoms?',a:'butterflies',options:['butterflies','penguins','whales']}],predict:{q:'More flowers are opening. What may happen next?',a:'more butterflies may visit',options:['more butterflies may visit','the fence may swim','the flowers may bark']},cause:{q:'Butterflies visited BECAUSE...',a:'the flowers had nectar',options:['the flowers had nectar','the fence was tall','Nora wore shoes']},infer:{q:'Nora cared for the flowers every day. She was...',a:'responsible',options:['responsible','forgetful','afraid of water']},main:{q:'What is the story mostly about?',a:'growing a garden that attracts butterflies',options:['growing a garden that attracts butterflies','building a snowman','learning to skate']}},
    {id:'shell-sort',text:'Leena found shells on the beach. Some were smooth and some were bumpy. She made two groups and counted each one. The smooth-shell group had one more shell.',order:['Leena found shells','She noticed two textures','She sorted them','She counted the groups'],questions:[{q:'Where did Leena find shells?',a:'on the beach',options:['on the beach','in a tree','in a classroom drawer']},{q:'How did she sort them?',a:'smooth and bumpy',options:['smooth and bumpy','big and flying','hot and cold']},{q:'Which group had more?',a:'smooth shells',options:['smooth shells','bumpy shells','they were equal']}],predict:{q:'Leena finds another bumpy shell. What should she do?',a:'put it with the bumpy group',options:['put it with the bumpy group','hide it in her shoe','put it with the smooth group']},cause:{q:'Leena knew which group had more BECAUSE...',a:'she counted both groups',options:['she counted both groups','the waves told her','one shell was blue']},infer:{q:'Leena was looking closely at texture. She was...',a:'observing',options:['observing','sleeping','guessing without looking']},main:{q:'What is the story mostly about?',a:'sorting and counting shells',options:['sorting and counting shells','baking bread','feeding a horse']}},
    {id:'lost-mitten',text:'Ava could not find one mitten. She looked by the door, under the bench, and in her backpack. Then she saw a little red corner under her coat. The missing mitten was in the coat sleeve.',order:['Ava noticed a mitten was missing','She searched several places','She saw a red corner','She found the mitten'],questions:[{q:'What was missing?',a:'a mitten',options:['a mitten','a spoon','a book']},{q:'Where did Ava finally find it?',a:'in her coat sleeve',options:['in her coat sleeve','in the garden','on the roof']},{q:'What color clue did she see?',a:'red',options:['red','green','black']}],predict:{q:'Ava sees a red corner under her coat. What will she probably do?',a:'look under the coat',options:['look under the coat','leave the house','plant a seed']},cause:{q:'Ava found the mitten BECAUSE...',a:'she kept looking carefully',options:['she kept looking carefully','the mitten called her name','it started to snow']},infer:{q:'Ava checked several places. She was...',a:'persistent',options:['persistent','careless','not interested']},main:{q:'What is the story mostly about?',a:'using clues to find a missing mitten',options:['using clues to find a missing mitten','making soup','flying a kite']}},
    {id:'ice-cup',text:'Sam put two cups of water on a tray. One cup went into the freezer. The other stayed on the table. Later, the freezer cup was solid ice, but the table cup was still liquid water.',order:['Sam filled two cups','One went in the freezer','He waited','One cup became ice'],questions:[{q:'Where did one cup go?',a:'in the freezer',options:['in the freezer','under a pillow','outside in the sun']},{q:'What happened to the freezer water?',a:'it became ice',options:['it became ice','it became sand','it disappeared']},{q:'Was the table cup solid?',a:'no',options:['no','yes','it became a rock']}],predict:{q:'If the ice cup sits in a warm room, what may happen?',a:'the ice may melt',options:['the ice may melt','it may grow leaves','it may turn to paper']},cause:{q:'The water became ice BECAUSE...',a:'it got very cold',options:['it got very cold','Sam sang','the cup was blue']},infer:{q:'Sam used two cups to compare what happened. He was doing...',a:'an experiment',options:['an experiment','a dance','a drawing']},main:{q:'What is the story mostly about?',a:'water changing when it gets cold',options:['water changing when it gets cold','a trip to the beach','making a sandwich']}},
    {id:'helping-friend',text:'Zoe saw her friend Eli drop a box of crayons. Crayons rolled across the floor. Zoe picked up the yellow and blue crayons while Eli gathered the red ones. Together they put every crayon back.',order:['Eli dropped the crayons','The crayons rolled','Zoe helped','They put them all back'],questions:[{q:'What fell on the floor?',a:'crayons',options:['crayons','apples','shoes']},{q:'Who helped Eli?',a:'Zoe',options:['Zoe','a dog','no one']},{q:'How did they finish faster?',a:'they worked together',options:['they worked together','they hid the crayons','they left the room']}],predict:{q:'One green crayon is still on the floor. What should they do?',a:'pick it up',options:['pick it up','step on it','leave it there']},cause:{q:'The crayons were put away quickly BECAUSE...',a:'Zoe and Eli cooperated',options:['Zoe and Eli cooperated','the box moved itself','the floor was shiny']},infer:{q:'Zoe noticed a friend needed help. Zoe was...',a:'kind',options:['kind','selfish','asleep']},main:{q:'What is the story mostly about?',a:'friends helping each other',options:['friends helping each other','painting a wall','watching clouds']}},
    {id:'moon-shadow',text:'Priya went outside before bedtime with a flashlight. She pointed the light at her toy dragon. A dark dragon shape appeared on the wall. When she moved the flashlight closer, the shadow changed size.',order:['Priya took a flashlight','She lit the toy','A shadow appeared','She moved the light'],questions:[{q:'What made the light?',a:'a flashlight',options:['a flashlight','a spoon','a pillow']},{q:'What appeared on the wall?',a:'a shadow',options:['a shadow','a rainbow','a puddle']},{q:'What happened when the light moved?',a:'the shadow changed size',options:['the shadow changed size','the wall melted','the toy flew']}],predict:{q:'Priya moves the light again. What might happen?',a:'the shadow may change again',options:['the shadow may change again','the toy will grow real wings','the wall will become water']},cause:{q:'A shadow appeared BECAUSE...',a:'the toy blocked some light',options:['the toy blocked some light','the toy was green','it was bedtime']},infer:{q:'Priya kept changing one thing and watching the result. She was...',a:'investigating',options:['investigating','forgetting','sleeping']},main:{q:'What is the story mostly about?',a:'exploring light and shadows',options:['exploring light and shadows','planting corn','sorting socks']}},
    {id:'snail-race',text:'Two snails crawled across a flat stone. Mina guessed the striped snail would reach the leaf first. She watched without touching either snail. The plain snail reached the leaf first, so Mina changed her idea.',order:['Mina saw two snails','She made a prediction','She watched','She changed her idea'],questions:[{q:'What did Mina predict?',a:'the striped snail would arrive first',options:['the striped snail would arrive first','both snails would fly','the leaf would move away']},{q:'Did her prediction match what happened?',a:'no',options:['no','yes','there was no race']},{q:'What did Mina do after observing?',a:'changed her idea',options:['changed her idea','pretended she was right','moved the snails']}],predict:{q:'If Mina watches another race, what should she do first?',a:'make a prediction',options:['make a prediction','choose the winner after it ends','hide the leaf']},cause:{q:'Mina changed her idea BECAUSE...',a:'the evidence was different from her prediction',options:['the evidence was different from her prediction','the stone was gray','she was hungry']},infer:{q:'Mina accepted what she observed. She was...',a:'flexible in her thinking',options:['flexible in her thinking','unwilling to learn','not paying attention']},main:{q:'What is the story mostly about?',a:'using evidence to check a prediction',options:['using evidence to check a prediction','drawing a castle','making music']}},
    {id:'number-picnic',text:'Four friends sat at a picnic table. Mia brought five strawberries. She gave one strawberry to each friend, including herself. One strawberry was left, so they saved it for later.',order:['Four friends sat down','Mia brought five strawberries','Each friend got one','One strawberry was left'],questions:[{q:'How many friends were there?',a:'four',options:['four','five','one']},{q:'How many strawberries did Mia bring?',a:'five',options:['five','four','six']},{q:'How many strawberries were left?',a:'one',options:['one','two','none']}],predict:{q:'Another friend joins and gets the saved strawberry. How many are left?',a:'none',options:['none','one','five']},cause:{q:'One strawberry was left BECAUSE...',a:'there were five strawberries for four friends',options:['there were five strawberries for four friends','the strawberries rolled away','nobody wanted fruit']},infer:{q:'Mia gave everyone one before taking more. She was...',a:'fair',options:['fair','greedy','confused']},main:{q:'What is the story mostly about?',a:'sharing five strawberries among four friends',options:['sharing five strawberries among four friends','building a tower','feeding ducks']}},
    {id:'little-library',text:'Omar wanted a quiet place for his books. He stacked two low crates beside a cushion. He sorted animal books on one shelf and space books on another. Then he invited his sister to choose a book.',order:['Omar chose a place','He stacked crates','He sorted the books','He invited his sister'],questions:[{q:'What did Omar build?',a:'a little library',options:['a little library','a boat','a garden']},{q:'How did he organize the books?',a:'by topic',options:['by topic','by weight only','without any order']},{q:'Who did he invite?',a:'his sister',options:['his sister','a whale','a teacher from another city']}],predict:{q:'His sister likes planets. Which shelf may she choose?',a:'the space shelf',options:['the space shelf','the animal shelf','the empty floor']},cause:{q:'The books were easy to find BECAUSE...',a:'Omar sorted them',options:['Omar sorted them','the cushion was soft','the crates were brown']},infer:{q:'Omar wanted others to enjoy the books too. He was...',a:'thoughtful',options:['thoughtful','unfriendly','careless']},main:{q:'What is the story mostly about?',a:'making and organizing a home library',options:['making and organizing a home library','washing dishes','building a snow fort']}},
    {id:'rain-boots',text:'The sky turned gray before the walk. Ana checked the weather and saw rain was coming. She put on boots and carried an umbrella. When the rain began, Ana stayed dry enough to enjoy the puddles.',order:['The sky turned gray','Ana checked the weather','She took rain gear','Rain began'],questions:[{q:'What weather was coming?',a:'rain',options:['rain','snow','a heat wave']},{q:'What did Ana carry?',a:'an umbrella',options:['an umbrella','a sled','a beach towel']},{q:'Why did she wear boots?',a:'to keep her feet drier',options:['to keep her feet drier','to make it sunny','to climb a tree']}],predict:{q:'The rain stops and the sun comes out. What might Ana do?',a:'close the umbrella',options:['close the umbrella','open a snow shovel','put on skates']},cause:{q:'Ana was prepared BECAUSE...',a:'she checked the weather',options:['she checked the weather','she guessed without looking','the puddles told her later']},infer:{q:'Ana used information before going outside. She was...',a:'planning ahead',options:['planning ahead','forgetting everything','being unsafe']},main:{q:'What is the story mostly about?',a:'getting ready for rainy weather',options:['getting ready for rainy weather','making ice cream','learning a song']}},
    {id:'magnet-hunt',text:'Kai had a magnet and a tray of objects. The magnet pulled a paper clip and a steel washer. It did not pull the wooden block or plastic button. Kai made a chart of what happened.',order:['Kai got a magnet','He tested objects','Some were attracted','He made a chart'],questions:[{q:'Which object did the magnet pull?',a:'paper clip',options:['paper clip','wooden block','plastic button']},{q:'Did it pull the plastic button?',a:'no',options:['no','yes','the button melted']},{q:'What did Kai record?',a:'what happened in each test',options:['what happened in each test','a bedtime story','the weather forecast']}],predict:{q:'Kai tests another steel object. What is a reasonable prediction?',a:'the magnet may attract it',options:['the magnet may attract it','it will grow leaves','it will become water']},cause:{q:'Kai made a chart BECAUSE...',a:'he wanted to remember and compare results',options:['he wanted to remember and compare results','the magnet asked him','the tray was round']},infer:{q:'Kai tested one object at a time. He was being...',a:'careful',options:['careful','random','asleep']},main:{q:'What is the story mostly about?',a:'testing which materials a magnet attracts',options:['testing which materials a magnet attracts','painting a picture','feeding fish']}},
    {id:'bridge-blocks',text:'Ivy built a bridge from blocks for a toy rabbit. The first bridge tipped over. Ivy made the base wider and tried again. This time the bridge stayed up while the rabbit crossed.',order:['Ivy built a bridge','It tipped over','She changed the base','The bridge stayed up'],questions:[{q:'Why did Ivy build a bridge?',a:'for a toy rabbit',options:['for a toy rabbit','for a real car','for a fish']},{q:'What happened the first time?',a:'the bridge tipped over',options:['the bridge tipped over','the rabbit flew','the blocks disappeared']},{q:'What change helped?',a:'a wider base',options:['a wider base','fewer blocks under it','closing her eyes']}],predict:{q:'Ivy builds another bridge. What can she remember?',a:'a wide base can help it stay stable',options:['a wide base can help it stay stable','all bridges must be tiny','blocks always float']},cause:{q:'The second bridge stayed up BECAUSE...',a:'Ivy improved the base',options:['Ivy improved the base','the rabbit became lighter','the room got darker']},infer:{q:'Ivy tried again after a failure. She was...',a:'persistent',options:['persistent','giving up','not interested']},main:{q:'What is the story mostly about?',a:'improving a design after testing it',options:['improving a design after testing it','cooking soup','reading a map']}},
    {id:'seed-measure',text:'Lina planted three bean seeds in cups. Each week she drew the sprouts and used blocks to measure their height. One plant grew six blocks tall. Another grew four blocks tall.',order:['Lina planted seeds','Sprouts appeared','She drew and measured','She compared heights'],questions:[{q:'What did Lina use to measure?',a:'blocks',options:['blocks','spoons of sugar','shoes']},{q:'How tall was one plant?',a:'six blocks',options:['six blocks','one block','ten feet']},{q:'Which is taller, six blocks or four blocks?',a:'six blocks',options:['six blocks','four blocks','they are equal']}],predict:{q:'Lina measures again next week. What may she notice?',a:'the plants may be taller',options:['the plants may be taller','the cups may turn into birds','the seeds may become rocks']},cause:{q:'Lina could compare growth BECAUSE...',a:'she measured the plants the same way',options:['she measured the plants the same way','the cups were colorful','the table was flat']},infer:{q:'Lina drew what she saw each week. She was keeping...',a:'a record',options:['a record','a secret','a recipe']},main:{q:'What is the story mostly about?',a:'measuring how plants grow',options:['measuring how plants grow','learning to swim','sorting clothes']}},
    {id:'star-map',text:'Noor looked at the evening sky with her dad. They found the moon first. Then they noticed three bright stars shaped like a triangle. Noor drew the pattern so she could look for it another night.',order:['Noor looked at the sky','They found the moon','They noticed a star pattern','Noor drew it'],questions:[{q:'When did Noor look at the sky?',a:'in the evening',options:['in the evening','at lunchtime indoors','under the ocean']},{q:'What shape did three stars make?',a:'a triangle',options:['a triangle','a square','a cube']},{q:'Why did Noor draw the pattern?',a:'to remember it',options:['to remember it','to erase the stars','to make the moon brighter']}],predict:{q:'Noor looks another clear night. What might she try to find?',a:'the same star pattern',options:['the same star pattern','a fish in the sky','a tree on the moon']},cause:{q:'Noor could remember the pattern BECAUSE...',a:'she drew what she observed',options:['she drew what she observed','the stars followed her home','the moon spoke']},infer:{q:'Noor wanted to look again another night. She was...',a:'curious',options:['curious','bored','angry']},main:{q:'What is the story mostly about?',a:'observing and recording a pattern in the night sky',options:['observing and recording a pattern in the night sky','buying groceries','washing a bike']}},
    {id:'turn-taking-game',text:'Three children wanted to use the same glitter pen. They decided each person could use it for one picture before passing it on. Everyone got a turn, and no one had to grab the pen.',order:['Three children wanted the pen','They made a turn-taking rule','Each used it once','Everyone got a turn'],questions:[{q:'What did all three children want?',a:'the glitter pen',options:['the glitter pen','the same shoe','a bowl of soup']},{q:'What rule did they make?',a:'one picture, then pass it',options:['one picture, then pass it','grab it first','hide it']},{q:'Did everyone get a turn?',a:'yes',options:['yes','no','only one child did']}],predict:{q:'A fourth child joins. What is a fair choice?',a:'add the child to the turn-taking order',options:['add the child to the turn-taking order','never let them use it','throw the pen away']},cause:{q:'No one needed to grab the pen BECAUSE...',a:'they agreed on turns',options:['they agreed on turns','the pen disappeared','the pictures were small']},infer:{q:'The children solved the problem together. They...',a:'cooperated',options:['cooperated','ignored each other','cheated']},main:{q:'What is the story mostly about?',a:'using turn-taking to share',options:['using turn-taking to share','making breakfast','watching snow']}},
    {id:'sound-string',text:'Rina stretched a rubber band over a small box. She plucked the band and heard a sound. She watched the band move back and forth very quickly. When she stopped the band with her finger, the sound stopped too.',order:['Rina stretched a band','She plucked it','She saw it vibrate','She stopped the band'],questions:[{q:'What did Rina pluck?',a:'a rubber band',options:['a rubber band','a leaf','a spoon of water']},{q:'What did the band do while making sound?',a:'vibrated',options:['vibrated','grew','froze']},{q:'What happened when the band stopped moving?',a:'the sound stopped',options:['the sound stopped','the sound got louder','the box floated']}],predict:{q:'Rina plucks the band again. What will likely happen?',a:'it will vibrate and make sound',options:['it will vibrate and make sound','it will become a flower','it will stay completely still and sound loudly']},cause:{q:'The sound stopped BECAUSE...',a:'the vibration stopped',options:['the vibration stopped','the box was small','Rina smiled']},infer:{q:'Rina watched movement and listened to sound together. She was...',a:'connecting evidence',options:['connecting evidence','guessing without testing','drawing a map']},main:{q:'What is the story mostly about?',a:'how vibration can make sound',options:['how vibration can make sound','how plants grow','how to share crayons']}},
    {id:'recipe-steps',text:'Ben helped make fruit cups. First he washed his hands. Next he rinsed the berries. Then he put fruit into four cups. Last, he carried the cups carefully to the table.',order:['Ben washed his hands','He rinsed the berries','He filled four cups','He carried them to the table'],questions:[{q:'What did Ben do first?',a:'washed his hands',options:['washed his hands','filled cups','ate all the berries']},{q:'How many cups did he fill?',a:'four',options:['four','one','ten']},{q:'What did he do last?',a:'carried the cups to the table',options:['carried the cups to the table','washed his hands','bought shoes']}],predict:{q:'The family is ready to eat. What may happen next?',a:'they may eat the fruit cups',options:['they may eat the fruit cups','the cups may sprout leaves','the berries may fly']},cause:{q:'The fruit cups were ready BECAUSE...',a:'Ben followed the steps in order',options:['Ben followed the steps in order','he skipped every step','the table moved']},infer:{q:'Ben carried the cups carefully. He did not want to...',a:'spill them',options:['spill them','read them','plant them']},main:{q:'What is the story mostly about?',a:'following steps to make fruit cups',options:['following steps to make fruit cups','building a kite','studying the moon']}}
  ];
  STORIES.forEach(function(s){if(!C.STORIES.some(function(x){return x.id===s.id;}))C.STORIES.push(s);});
})();
