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
  function byItem(items, name) { return items.filter(function (x) { return x.item === name; })[0]; }
  function tokenMeta(items) {
    return items.reduce(function (m, x) {
      m[x.item] = {
        label: x.item,
        emoji: x.emoji,
        image: x.image || null,
        alt: x.alt || x.item,
        caption: x.caption || ''
      };
      return m;
    }, {});
  }

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
        /* A tray the child fills by dragging or tapping jewels, rather than
         * picking a number off a card. Counting out the answer is the skill. */
        tray: { start: have, goal: target, emoji: '💎' },
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
      var n = B.band <= 2 ? 1 : (B.band >= 4 ? 3 : 2);
      var floats = bank.filter(function (x) { return x.a === 'float'; });
      var sinks = bank.filter(function (x) { return x.a === 'sink'; });
      var leaf = byItem(bank, 'leaf'), rock = byItem(bank, 'rock');
      var f = B.band <= 2 && leaf
        ? [leaf].concat(sample(rng, floats.filter(function (x) { return x.item !== 'leaf'; }), n - 1))
        : sample(rng, floats, n);
      var s = B.band <= 2 && rock
        ? [rock].concat(sample(rng, sinks.filter(function (x) { return x.item !== 'rock'; }), n - 1))
        : sample(rng, sinks, n);
      var items = f.concat(s);
      return {
        template: 'sort', prompt: 'Will it float or sink?',
        narration: 'Sort them. Will it float or will it sink.',
        buckets: [{ id: 'float', label: 'Floats' }, { id: 'sink', label: 'Sinks' }],
        tokens: shuffle(rng, items.map(function (x) { return x.item; })),
        tokenVisuals: tokenMeta(items),
        answer: items.reduce(function (m, x) { m[x.item] = x.a; return m; }, {}),
        hints: ['Look at each real object.', 'A leaf usually stays on top. A rock usually goes down.', 'Put leaf with floats and rock with sinks.']
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


  /* ---- V3 Kindergarten extension builders -------------------------------- */
  function choices(rng,answer,pool,count){
    var wrong=uniq(pool.filter(function(x){return String(x)!==String(answer);}));
    return shuffle(rng,[answer].concat(sample(rng,wrong,Math.max(1,count-1))));
  }
  function hint(answer,extra){var h=(extra||[]).slice(); if(!h.length) h.push('Look carefully and try one choice.'); while(h.length<2) h.push('Use the clue in the question and think again.'); h.push('The answer is '+String(answer)+'.'); return h.slice(0,3);}

  KINDS.v3_print=function(rng,bank,B){
    var set=[
      {prompt:'Where do we start reading this line?',answer:'on the left',options:['on the left','on the right','in the middle'],narration:'Where do we start reading this line? Start where reading begins.'},
      {prompt:'Which shows two separate words?',answer:'rain bow',options:['rain bow','rainbow','rain-bow'],narration:'Which one shows two words with a space between them?'},
      {prompt:'When we finish a line of print, where do we go next?',answer:'to the next line below',options:['to the next line below','back to the top','to the far right'],narration:'When we finish a line of print, where do our eyes go next?'},
      {prompt:'Which is one written word?',answer:'castle',options:['castle','c a s t l e','castle castle'],narration:'Which choice is one written word?'}
    ];
    var x=pick(rng,set);return{template:'choice',prompt:x.prompt,narration:x.narration,choices:shuffle(rng,x.options),answer:x.answer,hints:hint(x.answer,['Think about how books and sentences work.'])};
  };
  KINDS.v3_alphabet=function(rng,bank,B){
    var x=pick(rng,bank), mode=rng()<.5?'upper':'lower', answer=mode==='upper'?x.upper:x.letter;
    var pool=bank.map(function(y){return mode==='upper'?y.upper:y.letter;});
    return{template:'choice',prompt:'Find the '+(mode==='upper'?'uppercase':'lowercase')+' '+x.letter.toUpperCase()+'.',narration:'Find the '+(mode==='upper'?'uppercase':'lowercase')+' letter '+x.letter.toUpperCase()+'.',media:B.model?{emoji:x.emoji,caption:x.word}:null,choices:choices(rng,answer,pool,B.choices),answer:answer,hints:hint(answer,['Uppercase letters are the big letter shapes.'])};
  };
  KINDS.v3_rhyme=function(rng,bank,B){var x=pick(rng,bank);return{template:'choice',prompt:'Which word rhymes with “'+x.word+'”?',narration:'Which word rhymes with '+x.word+'? Listen for the same ending sound.',choices:shuffle(rng,x.options),answer:x.a,hints:hint(x.a,['Say the words slowly. Listen to the ending.'])};};
  KINDS.v3_syllable=function(rng,bank,B){var x=pick(rng,bank);return{template:'choice',prompt:'How many word beats are in “'+x.word+'”?',narration:'Clap the word '+x.word+'. How many word beats do you hear?',media:B.scaffold?{caption:x.beats}:null,choices:choices(rng,x.count,[1,2,3,4],B.choices),answer:x.count,hints:hint(x.count,['Clap once for each part of the word.',x.beats])};};
  KINDS.v3_initial_sound=function(rng,bank,B){var x=pick(rng,bank), pool=uniq(bank.map(function(y){return y.first;}));return{template:'choice',prompt:'What sound starts “'+x.word+'”?',narration:'What sound do you hear first in '+x.word+'?',media:{emoji:x.emoji,caption:B.model?x.word:''},choices:choices(rng,x.first,pool,B.choices),answer:x.first,audio:{phoneme:x.first,position:'answer'},hints:hint(x.first,['Stretch the beginning of '+x.word+'.'])};};
  KINDS.v3_final_sound=function(rng,bank,B){var x=pick(rng,bank), pool=uniq(bank.map(function(y){return y.last;}));return{template:'choice',prompt:'What sound ends “'+x.word+'”?',narration:'What sound do you hear at the end of '+x.word+'?',media:{emoji:x.emoji,caption:B.model?x.word:''},choices:choices(rng,x.last,pool,B.choices),answer:x.last,audio:{phoneme:x.last,position:'answer'},hints:hint(x.last,['Stretch the very end of '+x.word+'.'])};};
  KINDS.v3_oral_blend=function(rng,bank,B){var x=pick(rng,bank);return{template:'choice',prompt:'Blend the sounds. What word do they make?',narration:'Listen to the sounds, then blend them into one word.',media:{caption:x.sounds.map(function(s){return '/'+s+'/';}).join('  ')},choices:choices(rng,x.word,bank.map(function(y){return y.word;}),B.choices),answer:x.word,audio:{phonemes:x.sounds},hints:hint(x.word,['Say the sounds close together: '+x.sounds.join(' - '),x.emoji+' '+x.word])};};
  KINDS.v3_oral_segment=function(rng,bank,B){var x=pick(rng,bank);return{template:'choice',prompt:'How many sounds are in “'+x.word+'”?',narration:'Stretch the word '+x.word+'. How many sounds do you hear?',media:{emoji:x.emoji,caption:B.model?x.sounds.map(function(s){return '/'+s+'/';}).join('  '):x.word},choices:choices(rng,x.sounds.length,[2,3,4,5],B.choices),answer:x.sounds.length,audio:{phonemes:x.sounds},hints:hint(x.sounds.length,['Touch one finger for each sound.',x.sounds.join(' - ')])};};
  KINDS.v3_heart_word=function(rng,bank,B){var x=pick(rng,bank),pool=bank.map(function(y){return y.word;});return{template:'choice',prompt:'Find the heart word “'+x.word+'”.',narration:'Find the word '+x.word+'.',media:B.model?{caption:x.sentence}:null,choices:choices(rng,x.word,pool,B.choices),answer:x.word,hints:hint(x.word,['Look at every letter in the word.',x.sentence])};};
  KINDS.v3_vowel_team=function(rng,bank,B){var x=pick(rng,bank);return{template:'choice',prompt:'Which vowel team completes '+x.clue+' to make “'+x.word+'”?',narration:'Which vowel team completes the word '+x.word+'?',choices:shuffle(rng,x.options),answer:x.team,hints:hint(x.team,['Two vowels can work together to spell one vowel sound.'])};};

  KINDS.v3_count_sequence=function(rng,bank,B){var start=1+Math.floor(rng()*15),ans=start+1;return{template:'choice',prompt:'What number comes after '+start+'?',narration:'Count forward. What number comes after '+start+'?',choices:choices(rng,ans,[ans-2,ans-1,ans+1,ans+2].filter(function(n){return n>=0&&n<=20;}),B.choices),answer:ans,hints:hint(ans,['Say the count sequence from '+Math.max(1,start-2)+'.'])};};
  KINDS.v3_count_sequence_100=function(rng,bank,B){var byTens=rng()<.45;if(byTens){var n=(1+Math.floor(rng()*8))*10,ans=n+10;return{template:'choice',prompt:'Count by tens: '+Math.max(0,n-20)+', '+Math.max(10,n-10)+', '+n+', …',narration:'Count by tens. What comes after '+n+'?',choices:choices(rng,ans,[ans-10,ans+10,ans-1].filter(function(x){return x<=100;}),B.choices),answer:ans,hints:hint(ans,['Each number is ten more.'])};}var start=20+Math.floor(rng()*70),ans=start+1;return{template:'choice',prompt:'What number comes after '+start+'?',narration:'What number comes after '+start+'?',choices:choices(rng,ans,[start-1,start+2,start+10],B.choices),answer:ans,hints:hint(ans,['Count one more.'])};};
  KINDS.v3_numeral=function(rng,bank,B){var n=pick(rng,bank);return{template:'choice',prompt:'Find the number '+n+'.',narration:'Find the written number '+n+'.',choices:choices(rng,n,bank,B.choices),answer:n,hints:hint(n,['Look at the numeral shape.'])};};
  KINDS.v3_subitize=function(rng,bank,B){var n=1+Math.floor(rng()*Math.min(bank.max,B.band>=4?6:5));return{template:'count',prompt:'How many dots? Try to see it quickly.',narration:'How many dots do you see?',media:{repeat:'●',count:n,semanticRole:'countable.primary'},choices:choices(rng,n,[1,2,3,4,5,6],B.choices),answer:n,hints:hint(n,['Look for a familiar small group before counting one by one.'])};};
  KINDS.v3_count_objects=function(rng,bank,B){var cap=B.band>=4?bank.max:Math.min(12,bank.max),n=1+Math.floor(rng()*cap);return{template:'count',prompt:'Count the objects. How many?',narration:'Count each object once. How many are there?',media:{repeat:'◆',count:n,semanticRole:'countable.primary'},choices:choices(rng,n,[n-2,n-1,n+1,n+2].filter(function(x){return x>=0&&x<=20;}),B.choices),answer:n,hints:hint(n,['Touch each object once while you count.'])};};
  KINDS.v3_compare_groups=function(rng,bank,B){var a=1+Math.floor(rng()*bank.max),b=1+Math.floor(rng()*bank.max);if(a===b&&rng()<.7)b=Math.min(bank.max,b+1);var ans=a===b?'equal':(a>b?'first group':'second group');return{template:'choice',prompt:'Which group has more?',narration:'Compare the two groups. Which group has more, or are they equal?',media:{groups:[{emoji:'◆',count:a},{emoji:'◇',count:b}],semanticRole:'compare.groups'},choices:shuffle(rng,['first group','second group','equal']),answer:ans,hints:hint(ans,['Match one object from the first group to one from the second.'])};};
  KINDS.v3_compare_numerals=function(rng,bank,B){var a=1+Math.floor(rng()*bank.max),b=1+Math.floor(rng()*bank.max);if(a===b)b=(b%bank.max)+1;var ans=Math.max(a,b);return{template:'choice',prompt:'Which number is greater: '+a+' or '+b+'?',narration:'Which number is greater, '+a+' or '+b+'?',choices:shuffle(rng,[a,b]),answer:ans,hints:hint(ans,['Think about which number comes later when you count.'])};};
  KINDS.v3_data=function(rng,bank,B){var x=pick(rng,bank);var flat=[];x.groups.forEach(function(g){flat=flat.concat(g);});return{template:'choice',prompt:x.q,narration:x.q,media:{row:flat},choices:shuffle(rng,x.options),answer:x.answer,hints:hint(x.answer,['Sort the items into groups, then count each group.'])};};
  KINDS.v3_solid_shape=function(rng,bank,B){var x=pick(rng,bank),pool=bank.map(function(y){return y.name;});return{template:'choice',prompt:'Which solid shape is this?',narration:'Look at the solid shape. What is it called?',media:{image:x.image,alt:x.name,caption:B.scaffold?x.property:''},choices:choices(rng,x.name,pool,B.choices),answer:x.name,hints:hint(x.name,[x.property])};};
  KINDS.v3_shape_compose=function(rng,bank,B){var x=pick(rng,bank);return{template:'choice',prompt:x.prompt,narration:x.prompt,choices:shuffle(rng,x.options),answer:x.answer,hints:hint(x.answer,['Picture the smaller shapes touching edge to edge.'])};};

  KINDS.v3_scenario=function(rng,bank,B){var x=pick(rng,bank);return{template:'choice',prompt:x.q,narration:x.q,choices:shuffle(rng,x.options),answer:x.a,hints:hint(x.a,['Think about which answer best fits the situation.'])};};
  KINDS.v3_question_word=function(rng,bank,B){var x=pick(rng,bank);return{template:'choice',prompt:x.clue,narration:x.clue+' Which question word should we use?',choices:shuffle(rng,x.options),answer:x.a,hints:hint(x.a,['Who is for a person, where is for a place, and why is for a reason.'])};};
  KINDS.v3_memory=function(rng,bank,B){var x=pick(rng,bank),idx=1,shown=x.shown.slice(),answer=shown[idx];shown[idx]='?';return{template:'choice',prompt:'Remember the pattern. What was in the middle?',narration:'Look carefully. What belongs in the missing place?',media:{sequence:shown.slice(0,-1)},choices:shuffle(rng,x.options),answer:answer,hints:hint(answer,['Picture the three things in your mind.'])};};

  KINDS.v3_trace_symbol=function(rng,bank,B){var s=pick(rng,bank);return{template:'trace',prompt:'Trace the path slowly.',narration:'Trace the line with your finger. Start at the top or left and move smoothly.',media:{letter:s,guide:true},answer:s,hints:['Start at one end.','Stay close to the guide.','Slow is smooth.']};};
  KINDS.v3_trace_name=function(rng,bank,B){var s=pick(rng,bank);return{template:'trace',prompt:'Practice a letter from your name: '+s.toUpperCase(),narration:'Trace the letter '+s.toUpperCase()+'. It is a letter in your name.',media:{letter:s,guide:true},answer:s,hints:['Start at the top.','Follow the grey shape.','Try one smooth stroke at a time.']};};
  KINDS.v3_trace_lower=function(rng,bank,B){var s=pick(rng,bank);return{template:'trace',prompt:'Trace lowercase '+s+'.',narration:'Trace the lowercase letter '+s+'.',media:{letter:s,guide:true},answer:s,hints:['Start at the top when the letter begins there.','Follow the grey shape.','Keep your finger on the guide.']};};
  KINDS.v3_trace_numeral=function(rng,bank,B){var s=String(pick(rng,bank));return{template:'trace',prompt:'Trace the number '+s+'.',narration:'Trace the number '+s+'.',media:{letter:s,guide:true},answer:s,hints:['Start at the top.','Follow the grey number.','Move slowly and smoothly.']};};
  KINDS.v3_sentence_build=function(rng,bank,B){var x=pick(rng,bank);return{template:'sequence',prompt:'Put the words in order to make a sentence.',narration:'Put the words in order. The sentence is: '+x.sentence,media:B.model?{caption:x.sentence}:null,tokens:shuffle(rng,x.words),answer:x.words,hints:['A sentence starts with a capital letter.','Listen for the sentence that makes sense.',x.sentence]};};


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
