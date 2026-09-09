/* Sakhi activity generator.
 *
 * generate(skillId, band, seed) -> one activity of 3 questions on that skill at
 * that difficulty band. Deterministic for a given seed, so a test can replay an
 * exact activity and the child never gets a different task on a reload.
 *
 * The five bands are applied uniformly on top of every template, which is what
 * stops this from becoming hundreds of hardcoded question files:
 *
 *   1 INTRO       2 choices, worked model shown, hint offered up front
 *   2 SUPPORTED   3 choices, partial scaffold (first sound / part given)
 *   3 INDEPENDENT 3 choices, no scaffold
 *   4 MIXED       4 choices, items drawn across the whole skill bank
 *   5 CHALLENGE   4 choices, near-miss distractors, longer items
 *
 * No theme is read here. Difficulty and item choice come from the curriculum
 * band only.
 */
window.SakhiActivities = (function () {
  'use strict';

  var C = window.SakhiContent;

  var BANDS = {
    1: { name: 'INTRO', choices: 2, model: true, scaffold: true, hintUpFront: true, nearMiss: false },
    2: { name: 'SUPPORTED', choices: 3, model: false, scaffold: true, hintUpFront: false, nearMiss: false },
    3: { name: 'INDEPENDENT', choices: 3, model: false, scaffold: false, hintUpFront: false, nearMiss: false },
    4: { name: 'MIXED', choices: 4, model: false, scaffold: false, hintUpFront: false, nearMiss: false, mixed: true },
    5: { name: 'CHALLENGE', choices: 4, model: false, scaffold: false, hintUpFront: false, nearMiss: true, mixed: true }
  };

  /* deterministic RNG so the same (skill, band, seed) always rebuilds the same
   * activity — required for replayable tests and for reload safety */
  function rngFrom(seedStr) {
    var h = 2166136261;
    for (var i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
    var a = h >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function shuffle(rng, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function sample(rng, arr, n) { return shuffle(rng, arr).slice(0, n); }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }

  /* Build a choice set of exactly B.choices options containing `answer`.
   * `pool` supplies distractors; `near` supplies deliberately close ones. */
  function choiceSet(rng, answer, pool, B, near) {
    var wrong = (B.nearMiss && near && near.length ? near : pool)
      .filter(function (x) { return String(x) !== String(answer); });
    wrong = uniq(wrong);
    var need = Math.max(1, B.choices - 1);
    var chosen = sample(rng, wrong, need);
    while (chosen.length < need && pool.length) {
      var extra = pool.filter(function (x) { return String(x) !== String(answer) && chosen.indexOf(x) === -1; });
      if (!extra.length) break;
      chosen.push(extra[0]);
    }
    return shuffle(rng, chosen.concat([answer]));
  }

  function letters(word) { return word.split(''); }

  /* Distractor letters for a build task: the real letters plus plausible extras */
  function letterTokens(rng, word, B) {
    var extraPool = 'mstpncbdgflrhaeiou'.split('');
    var need = B.choices >= 4 ? 3 : 2;
    var extras = sample(rng, extraPool.filter(function (l) { return word.indexOf(l) === -1; }), need);
    return shuffle(rng, letters(word).concat(extras));
  }

  function cvcNear(word) {
    /* words differing by one letter — the real confusions for a 5-year-old */
    return C.ALL_CVC.filter(function (w) {
      if (w === word || w.length !== word.length) return false;
      var diff = 0;
      for (var i = 0; i < w.length; i++) if (w[i] !== word[i]) diff++;
      return diff === 1;
    });
  }

  /* ---- question builders, one per content `kind` -------------------------- */

  var KINDS = {

    letter_sound: function (rng, bank, B) {
      var t = pick(rng, bank);
      return {
        template: 'choice',
        prompt: 'Which letter says ' + t.sound + '?',
        narration: 'Which letter says ' + t.sound + '. As in ' + t.word + '.',
        media: B.model ? { emoji: t.emoji, caption: t.word } : (B.scaffold ? { emoji: t.emoji } : null),
        choices: choiceSet(rng, t.letter, bank.map(function (x) { return x.letter; }), B),
        answer: t.letter,
        hints: ['Listen again: ' + t.sound, 'It is the first sound in "' + t.word + '".', 'The letter is "' + t.letter + '".']
      };
    },

    vowel: function (rng, bank, B) {
      var v = pick(rng, bank);
      return {
        template: 'choice',
        prompt: 'Which vowel do you hear in "' + v.word + '"?',
        narration: 'Which vowel do you hear in ' + v.word + '.',
        media: B.model ? { emoji: v.emoji, caption: v.word } : { emoji: v.emoji },
        choices: choiceSet(rng, v.letter, bank.map(function (x) { return x.letter; }), B),
        answer: v.letter,
        hints: ['Say it slowly: ' + v.word.split('').join(' - '), 'The middle sound is ' + v.sound, 'It is "' + v.letter + '".']
      };
    },

    segment: function (rng, bank, B) {
      var w = pick(rng, bank);
      return {
        template: 'build',
        prompt: 'Build the word: ' + (B.model || B.scaffold ? w : '🔊'),
        narration: 'Build the word ' + w + '. ' + w.split('').join('. '),
        media: null,
        tokens: letterTokens(rng, w, B),
        answer: letters(w),
        hints: ['First sound is /' + w[0] + '/', 'It is ' + w.split('').join(' - '), 'The word is "' + w + '".']
      };
    },

    cvc_read: function (rng, bank, B) {
      var fam = pick(rng, Object.keys(bank));
      var w = pick(rng, bank[fam]);
      return {
        template: 'choice',
        prompt: 'Which word says "' + w + '"?',
        narration: 'Which word says ' + w + '.',
        media: null,
        choices: choiceSet(rng, w, C.ALL_CVC, B, cvcNear(w)),
        answer: w,
        hints: ['Sound it out: ' + w.split('').join(' - '), 'It starts with /' + w[0] + '/', 'It is "' + w + '".']
      };
    },

    cvc_spell: function (rng, bank, B) {
      var fam = pick(rng, Object.keys(bank));
      var w = pick(rng, bank[fam]);
      return {
        template: 'build',
        prompt: 'Spell the word: ' + (B.scaffold ? w[0] + '_'.repeat(w.length - 1) : '🔊'),
        narration: 'Spell the word ' + w + '.',
        media: null,
        tokens: letterTokens(rng, w, B),
        answer: letters(w),
        hints: ['It starts with "' + w[0] + '"', 'The middle sound is /' + w[1] + '/', 'The word is "' + w + '".']
      };
    },

    digraph: function (rng, bank, B) {
      var dg = pick(rng, Object.keys(bank));
      var w = pick(rng, bank[dg]);
      var others = Object.keys(bank).filter(function (d) { return d !== dg; });
      return {
        template: 'choice',
        prompt: 'Which two letters make the sound you hear in "' + w + '"?',
        narration: 'Which two letters make the sound in ' + w + '.',
        media: B.scaffold ? { caption: w } : null,
        choices: choiceSet(rng, dg, Object.keys(bank), B, others),
        answer: dg,
        hints: ['Say "' + w + '" slowly.', 'Two letters make one sound.', 'It is "' + dg + '".']
      };
    },

    blend: function (rng, bank, B) {
      var bl = pick(rng, Object.keys(bank));
      var w = pick(rng, bank[bl]);
      return {
        template: 'choice',
        prompt: 'Which blend does "' + w + '" start with?',
        narration: 'Which blend does ' + w + ' start with.',
        media: B.scaffold ? { caption: w } : null,
        choices: choiceSet(rng, bl, Object.keys(bank), B),
        answer: bl,
        hints: ['Listen to the first two sounds.', 'You hear both letters.', 'It is "' + bl + '".']
      };
    },

    silent_e: function (rng, bank, B) {
      var p = pick(rng, bank);
      return {
        template: 'choice',
        prompt: 'Add a magic "e" to "' + p.base + '". What word is it now?',
        narration: 'Add a magic e to ' + p.base + '. What word is it now.',
        media: null,
        choices: choiceSet(rng, p.magic, bank.map(function (x) { return x.magic; }), B, [p.base + 'e', p.base]),
        answer: p.magic,
        hints: ['The magic e makes the vowel say its name.', '"' + p.base + '" becomes a long vowel.', 'It is "' + p.magic + '".']
      };
    },

    sentence: function (rng, bank, B) {
      var s = pick(rng, bank);
      return {
        template: 'sequence',
        prompt: 'Put the words in order.',
        narration: 'Put the words in order to make the sentence. ' + s.text,
        media: B.model ? { caption: s.text } : null,
        tokens: shuffle(rng, s.words),
        answer: s.words,
        hints: ['Sentences start with a capital letter.', 'The first word is "' + s.words[0] + '".', 'It says: ' + s.text]
      };
    },
    sentence_build: function (rng, bank, B) { return KINDS.sentence(rng, bank, B); },

    fluency: function (rng, bank, B) {
      var s = pick(rng, bank);
      var missingIdx = 1 + Math.floor(rng() * (s.words.length - 1));
      var missing = s.words[missingIdx].replace('.', '');
      var shown = s.words.map(function (w, i) { return i === missingIdx ? '____' : w; }).join(' ');
      var pool = [].concat.apply([], bank.map(function (x) { return x.words; }))
        .map(function (w) { return w.replace('.', ''); });
      return {
        template: 'choice',
        prompt: shown,
        narration: 'Which word is missing. ' + shown.replace('____', 'blank'),
        media: null,
        choices: choiceSet(rng, missing, pool, B),
        answer: missing,
        hints: ['Read the whole sentence first.', 'Which word makes sense there?', 'It is "' + missing + '".']
      };
    },

    story_read: function (rng, bank, B) {
      var st = pick(rng, bank);
      var q = pick(rng, st.questions);
      return {
        template: 'choice',
        prompt: q.q, narration: st.text + ' ' + q.q,
        media: { passage: st.text },
        choices: choiceSet(rng, q.a, q.options, B), answer: q.a,
        hints: ['Read the story again.', 'The answer is in the story.', 'It is "' + q.a + '".']
      };
    },
    listen: function (rng, bank, B) {
      var st = pick(rng, bank); var q = pick(rng, st.questions);
      return {
        template: 'choice', prompt: q.q, narration: st.text + ' ' + q.q,
        media: B.model ? { passage: st.text } : { listenOnly: true, passage: st.text },
        choices: choiceSet(rng, q.a, q.options, B), answer: q.a,
        hints: ['Listen to the story again.', 'Think about what happened.', 'It is "' + q.a + '".']
      };
    },
    story_order: function (rng, bank, B) {
      var st = pick(rng, bank);
      return {
        template: 'sequence', prompt: 'Put the story in order.',
        narration: st.text + ' Now put the story in order.',
        media: { passage: st.text },
        tokens: shuffle(rng, st.order), answer: st.order,
        hints: ['What happened first?', 'Think beginning, middle, end.', 'It starts with "' + st.order[0] + '".']
      };
    },
    retell: function (rng, bank, B) { return (rng() < 0.5 ? KINDS.story_order : KINDS.story_read)(rng, bank, B); },
    predict: function (rng, bank, B) {
      var st = pick(rng, bank);
      return {
        template: 'choice', prompt: st.predict.q, narration: st.text + ' ' + st.predict.q,
        media: { passage: st.text },
        choices: choiceSet(rng, st.predict.a, st.predict.options, B), answer: st.predict.a,
        hints: ['What makes sense next?', 'Use what already happened.', 'It is "' + st.predict.a + '".']
      };
    },
    cause: function (rng, bank, B) {
      var st = pick(rng, bank);
      return {
        template: 'choice', prompt: st.cause.q, narration: st.text + ' ' + st.cause.q,
        media: { passage: st.text },
        choices: choiceSet(rng, st.cause.a, st.cause.options, B), answer: st.cause.a,
        hints: ['"Because" tells you why.', 'What happened just before?', 'It is "' + st.cause.a + '".']
      };
    },
    infer: function (rng, bank, B) {
      var st = pick(rng, bank);
      return {
        template: 'choice', prompt: st.infer.q, narration: st.text + ' ' + st.infer.q,
        media: { passage: st.text },
        choices: choiceSet(rng, st.infer.a, st.infer.options, B), answer: st.infer.a,
        hints: ['The story does not say it directly.', 'Use the clues.', 'It is "' + st.infer.a + '".']
      };
    },
    main_idea: function (rng, bank, B) {
      var st = pick(rng, bank);
      return {
        template: 'choice', prompt: st.main.q, narration: st.text + ' ' + st.main.q,
        media: { passage: st.text },
        choices: choiceSet(rng, st.main.a, st.main.options, B), answer: st.main.a,
        hints: ['What is the WHOLE story about?', 'Not just one small part.', 'It is "' + st.main.a + '".']
      };
    },
    vocab: function (rng, bank, B) {
      var v = pick(rng, bank);
      return {
        template: 'choice', prompt: 'What does "' + v.word + '" mean?',
        narration: v.sentence + ' What does ' + v.word + ' mean.',
        media: B.scaffold ? { caption: v.sentence } : null,
        choices: choiceSet(rng, v.a, v.options, B), answer: v.a,
        hints: ['Read the sentence again.', 'Which meaning fits?', 'It means "' + v.a + '".']
      };
    },

    /* ---- math ---- */
    count: function (rng, bank, B) {
      var max = B.band >= 4 ? bank.max : Math.min(bank.max, 6);
      var n = 1 + Math.floor(rng() * max);
      var emoji = pick(rng, ['⭐', '💎', '🌸', '🐚', '❄️']);
      return {
        template: 'count', prompt: 'How many?', narration: 'Count them. How many are there.',
        media: { repeat: emoji, count: n },
        choices: choiceSet(rng, n, [n - 1, n + 1, n + 2, n - 2].filter(function (x) { return x > 0; }), B),
        answer: n,
        hints: ['Touch each one as you count.', 'Count out loud.', 'There are ' + n + '.']
      };
    },
    compose: function (rng, bank, B) {
      var target = B.band >= 4 ? bank.target : 5 + Math.floor(rng() * 3);
      var have = 1 + Math.floor(rng() * (target - 1));
      var need = target - have;
      return {
        template: 'count', prompt: 'There are ' + have + '. How many more make ' + target + '?',
        narration: 'There are ' + have + '. How many more do you need to make ' + target + '.',
        media: { repeat: '💎', count: have, ghost: B.scaffold ? need : 0 },
        choices: choiceSet(rng, need, [need - 1, need + 1, need + 2, target].filter(function (x) { return x > 0; }), B),
        answer: need,
        hints: ['Count up from ' + have + '.', 'Use your fingers to reach ' + target + '.', 'The answer is ' + need + '.']
      };
    },
    add: function (rng, bank, B) {
      var cap = B.band >= 4 ? bank.max : 5;
      var a = 1 + Math.floor(rng() * cap), b = 1 + Math.floor(rng() * cap);
      return {
        template: 'count', prompt: a + ' + ' + b + ' = ?',
        narration: 'What is ' + a + ' plus ' + b + '.',
        media: { groups: [{ emoji: '⭐', count: a }, { emoji: '⭐', count: b }] },
        choices: choiceSet(rng, a + b, [a + b - 1, a + b + 1, a + b + 2, a], B),
        answer: a + b,
        hints: ['Count them all together.', 'Start at ' + a + ' and count on ' + b + '.', 'It is ' + (a + b) + '.']
      };
    },
    sub: function (rng, bank, B) {
      var cap = B.band >= 4 ? bank.max : 6;
      var a = 2 + Math.floor(rng() * (cap - 1)), b = 1 + Math.floor(rng() * (a - 1));
      return {
        template: 'count', prompt: a + ' - ' + b + ' = ?',
        narration: 'What is ' + a + ' take away ' + b + '.',
        media: { repeat: '🌸', count: a, crossOut: b },
        choices: choiceSet(rng, a - b, [a - b - 1, a - b + 1, a, b], B),
        answer: a - b,
        hints: ['Take ' + b + ' away.', 'Count what is left.', 'It is ' + (a - b) + '.']
      };
    },
    bond: function (rng, bank, B) {
      var t = B.band >= 4 ? 10 : 5 + Math.floor(rng() * 3);
      var a = 1 + Math.floor(rng() * (t - 1));
      return {
        template: 'choice', prompt: a + ' and ? make ' + t,
        narration: a + ' and what makes ' + t + '.',
        media: { bond: { total: t, part: a } },
        choices: choiceSet(rng, t - a, [t - a - 1, t - a + 1, t, a], B), answer: t - a,
        hints: ['Think of ' + t + ' split into two parts.', 'One part is ' + a + '.', 'The other part is ' + (t - a) + '.']
      };
    },
    missing: function (rng, bank, B) {
      var t = B.band >= 4 ? 10 : 8;
      var a = 1 + Math.floor(rng() * (t - 2));
      return {
        template: 'choice', prompt: a + ' + ___ = ' + t,
        narration: a + ' plus what equals ' + t + '.',
        media: { bond: { total: t, part: a } },
        choices: choiceSet(rng, t - a, [t - a - 1, t - a + 1, t + a, a], B), answer: t - a,
        hints: ['What is missing to reach ' + t + '?', 'Count on from ' + a + '.', 'It is ' + (t - a) + '.']
      };
    },
    place_value: function (rng, bank, B) {
      var tens = 1, ones = 1 + Math.floor(rng() * 9);
      var n = tens * 10 + ones;
      return {
        template: 'choice', prompt: '1 ten and ' + ones + ' ones is...',
        narration: 'One ten and ' + ones + ' ones. What number is that.',
        media: { tens: tens, ones: ones },
        choices: choiceSet(rng, n, [n - 1, n + 1, ones, n + 10], B), answer: n,
        hints: ['A ten is 10.', 'Add ' + ones + ' more.', 'It is ' + n + '.']
      };
    },
    pattern: function (rng, bank, B) {
      var p = pick(rng, bank);
      return {
        template: 'choice', prompt: p.seq.join(' ') + '  ?',
        narration: 'What comes next in the pattern.',
        media: { sequence: p.seq, rule: B.scaffold ? p.rule : null },
        choices: choiceSet(rng, p.a, p.options, B), answer: p.a,
        hints: ['Say the pattern out loud.', 'The rule is ' + p.rule + '.', 'It is ' + p.a + '.']
      };
    },
    shape: function (rng, bank, B) {
      var s = pick(rng, bank);
      return {
        template: 'choice', prompt: 'Which one is a ' + s.name + '?',
        narration: 'Which one is a ' + s.name + '.',
        media: null,
        choices: choiceSet(rng, s.emoji, bank.map(function (x) { return x.emoji; }), B), answer: s.emoji,
        hints: [s.sides ? 'It has ' + s.sides + ' sides.' : 'It is round.', 'Look at the corners.', 'It is ' + s.emoji + '.']
      };
    },
    measure: function (rng, bank, B) {
      var m = pick(rng, bank);
      return {
        template: 'choice', prompt: m.q, narration: m.q,
        media: null, choices: shuffle(rng, m.options), answer: m.a,
        hints: ['Compare them side by side.', 'Which takes up more space?', 'It is ' + m.a + '.']
      };
    },

    /* ---- logic / science ---- */
    classify: function (rng, bank, B) {
      var r = pick(rng, bank);
      var n = B.band >= 4 ? 3 : 2;
      var yes = sample(rng, r.yes, n), no = sample(rng, r.no, n);
      return {
        template: 'sort', prompt: r.rule,
        narration: 'Sort them. Which ones are: ' + r.rule + '.',
        buckets: [{ id: 'yes', label: r.rule }, { id: 'no', label: 'Not ' + r.rule.toLowerCase() }],
        tokens: shuffle(rng, yes.concat(no)),
        answer: yes.reduce(function (m, x) { m[x] = 'yes'; return m; }, no.reduce(function (m, x) { m[x] = 'no'; return m; }, {})),
        hints: ['Look at one at a time.', 'Ask: does it match "' + r.rule + '"?', 'Start with the easy ones.']
      };
    },
    steps: function (rng, bank, B) {
      var s = pick(rng, bank);
      return {
        template: 'sequence', prompt: s.task + ' — put the steps in order.',
        narration: 'Put the steps in order for ' + s.task + '.',
        media: null, tokens: shuffle(rng, s.order), answer: s.order,
        hints: ['What do you do first?', 'Picture yourself doing it.', 'Start with "' + s.order[0] + '".']
      };
    },
    spatial: function (rng, bank, B) {
      var s = pick(rng, bank);
      return {
        template: 'choice', prompt: s.q, narration: s.q, media: null,
        choices: shuffle(rng, s.options), answer: s.a,
        hints: ['Look carefully at the shape.', 'Turn it in your head.', 'It is ' + s.a + '.']
      };
    },
    deduce: function (rng, bank, B) {
      var d = pick(rng, bank);
      return {
        template: 'choice', prompt: d.clue, narration: d.clue + ' What is it.',
        media: null, choices: shuffle(rng, d.options), answer: d.a,
        hints: ['Read the clue again.', 'Rule out what does not fit.', 'It is ' + d.a + '.']
      };
    },
    code: function (rng, bank, B) {
      var c = pick(rng, bank);
      return {
        template: 'sequence', prompt: c.goal,
        narration: c.goal + '. Put the arrows in order.',
        media: { grid: c.grid },
        tokens: shuffle(rng, c.a.concat(sample(rng, c.options.filter(function (o) { return c.a.indexOf(o) === -1; }), 1))),
        answer: c.a,
        hints: ['Which way first?', 'Follow the path with your finger.', 'Start with ' + c.a[0] + '.']
      };
    },
    observe: function (rng, bank, B) {
      var o = pick(rng, bank);
      return {
        template: 'choice', prompt: o.q, narration: o.q,
        media: { row: o.items }, choices: shuffle(rng, uniq(o.items)), answer: o.a,
        hints: ['Look at each one.', 'Three are the same.', 'It is ' + o.a + '.']
      };
    },
    habitat: function (rng, bank, B) {
      var n = B.band >= 4 ? 4 : 3;
      var set = sample(rng, bank, n);
      return {
        template: 'match', prompt: 'Match each animal to its home.',
        narration: 'Match each animal to the place it lives.',
        left: set.map(function (h) { return { id: h.animal, label: h.animal, emoji: h.emoji }; }),
        right: shuffle(rng, set.map(function (h) { return { id: h.home, label: h.home, emoji: h.homeEmoji }; })),
        answer: set.reduce(function (m, h) { m[h.animal] = h.home; return m; }, {}),
        hints: ['Where would it be safe?', 'Think about what it needs.', 'Start with the one you know.']
      };
    },
    float: function (rng, bank, B) {
      var n = B.band >= 4 ? 3 : 2;
      var f = sample(rng, bank.filter(function (x) { return x.a === 'float'; }), n);
      var s = sample(rng, bank.filter(function (x) { return x.a === 'sink'; }), n);
      return {
        template: 'sort', prompt: 'Will it float or sink?',
        narration: 'Sort them. Will it float or will it sink.',
        buckets: [{ id: 'float', label: 'Floats' }, { id: 'sink', label: 'Sinks' }],
        tokens: shuffle(rng, f.concat(s).map(function (x) { return x.emoji + ' ' + x.item; })),
        answer: f.concat(s).reduce(function (m, x) { m[x.emoji + ' ' + x.item] = x.a; return m; }, {}),
        hints: ['Heavy things usually sink.', 'Light things usually float.', 'Think about a leaf and a rock.']
      };
    },
    magnet: function (rng, bank, B) {
      var n = B.band >= 4 ? 3 : 2;
      var y = sample(rng, bank.filter(function (x) { return x.a === 'sticks'; }), n);
      var no = sample(rng, bank.filter(function (x) { return x.a !== 'sticks'; }), n);
      return {
        template: 'sort', prompt: 'Will the magnet pick it up?',
        narration: 'Sort them. Will the magnet pick it up or not.',
        buckets: [{ id: 'sticks', label: 'Magnet picks it up' }, { id: 'does not stick', label: 'It does not' }],
        tokens: shuffle(rng, y.concat(no).map(function (x) { return x.emoji + ' ' + x.item; })),
        answer: y.concat(no).reduce(function (m, x) { m[x.emoji + ' ' + x.item] = x.a; return m; }, {}),
        hints: ['Magnets like metal.', 'Paper and leaves are not metal.', 'Try the keys first.']
      };
    },
    weather: function (rng, bank, B) {
      var w = pick(rng, bank);
      return {
        template: 'choice', prompt: w.q, narration: w.q, media: null,
        choices: shuffle(rng, w.options), answer: w.a,
        hints: ['Picture that kind of day.', 'What would keep you comfy?', 'It is ' + w.a + '.']
      };
    },
    plant: function (rng, bank, B) {
      if (rng() < 0.5) {
        return {
          template: 'sequence', prompt: 'Put the plant in order as it grows.',
          narration: 'Put the plant in order as it grows.',
          media: null, tokens: shuffle(rng, bank.order), answer: bank.order,
          hints: ['What is smallest first?', 'A seed comes before a leaf.', 'Start with "seed".']
        };
      }
      return {
        template: 'choice', prompt: bank.needs.q, narration: bank.needs.q, media: null,
        choices: shuffle(rng, bank.needs.options), answer: bank.needs.a,
        hints: ['Think about a garden.', 'Two things are needed.', 'It is ' + bank.needs.a + '.']
      };
    },
    light_sound: function (rng, bank, B) {
      var l = pick(rng, bank);
      return {
        template: 'choice', prompt: l.q, narration: l.q, media: null,
        choices: shuffle(rng, l.options), answer: l.a,
        hints: ['Think about what you hear or see.', 'Try it in your head.', 'It is ' + l.a + '.']
      };
    },
    space: function (rng, bank, B) {
      var s = pick(rng, bank);
      return {
        template: 'choice', prompt: s.q, narration: s.q, media: null,
        choices: shuffle(rng, s.options), answer: s.a,
        hints: ['Think about the sky.', 'Day or night?', 'It is ' + s.a + '.']
      };
    },

    /* ---- writing ---- */
    trace: function (rng, bank, B) {
      var t = pick(rng, bank);
      return {
        template: 'trace', prompt: 'Trace the letter ' + t.letter,
        narration: 'Trace the letter ' + t.letter + '. It says ' + t.sound + ', as in ' + t.word + '.',
        media: { letter: t.letter, emoji: t.emoji, guide: B.scaffold },
        answer: t.letter,
        hints: ['Start at the dot.', 'Follow the grey line.', 'Take it slowly.']
      };
    },
    label: function (rng, bank, B) {
      var t = pick(rng, bank);
      return {
        template: 'build', prompt: 'Label the picture.',
        narration: 'Label the picture. The word is ' + t.word + '.',
        media: { emoji: t.emoji },
        tokens: letterTokens(rng, t.word, B), answer: letters(t.word),
        hints: ['What is the picture?', 'It starts with /' + t.word[0] + '/', 'The word is "' + t.word + '".']
      };
    },
    story_build: function (rng, bank, B) {
      var st = pick(rng, bank);
      return {
        template: 'sequence', prompt: 'Build your story in order.',
        narration: 'Put your story in order: beginning, middle, end.',
        media: null, tokens: shuffle(rng, st.order), answer: st.order,
        hints: ['Every story has a beginning.', 'Then the middle.', 'Start with "' + st.order[0] + '".']
      };
    }
  };

  /* ---- public API --------------------------------------------------------- */

  function bandOf(n) {
    var b = BANDS[Math.max(1, Math.min(5, n | 0))] || BANDS[3];
    return Object.assign({}, b, { band: Math.max(1, Math.min(5, n | 0)) });
  }

  function generate(skillId, band, seed) {
    var entry = C.SKILLS[skillId];
    if (!entry) throw new Error('No content bank for skill "' + skillId + '"');
    var B = bandOf(band);
    var rng = rngFrom(skillId + '|' + B.band + '|' + (seed == null ? 'default' : seed));
    var builder = KINDS[entry.kind];
    if (!builder) throw new Error('No builder for kind "' + entry.kind + '" (skill ' + skillId + ')');

    var questions = [], guard = 0;
    while (questions.length < 3 && guard++ < 40) {
      var q = builder(rng, entry.bank, B);
      /* avoid asking the identical prompt twice in one activity */
      if (!questions.some(function (x) { return x.prompt === q.prompt; })) questions.push(q);
    }
    while (questions.length < 3) questions.push(builder(rng, entry.bank, B));

    var skill = window.SakhiCurriculum && window.SakhiCurriculum.skill(skillId);
    return {
      activity_id: skillId + '@b' + B.band + '#' + (seed == null ? 'default' : seed),
      skill_id: skillId,
      domain_id: skill ? skill.domain_id : skillId.split('.')[0],
      skill_title: skill ? skill.title : skillId,
      band: B.band,
      band_name: B.name,
      support: { choices: B.choices, model: B.model, scaffold: B.scaffold, hintUpFront: B.hintUpFront },
      questions: questions
    };
  }

  return { BANDS: BANDS, generate: generate, bandOf: bandOf, KINDS: Object.keys(KINDS) };
})();
