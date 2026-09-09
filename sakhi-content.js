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
    { item: 'leaf', emoji: '🍃', a: 'float' }, { item: 'rock', emoji: '🪨', a: 'sink' },
    { item: 'cork', emoji: '🪵', a: 'float' }, { item: 'coin', emoji: '🪙', a: 'sink' },
    { item: 'apple', emoji: '🍎', a: 'float' }, { item: 'spoon', emoji: '🥄', a: 'sink' }
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
