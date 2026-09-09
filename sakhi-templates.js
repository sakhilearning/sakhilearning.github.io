/* Sakhi interaction templates.
 *
 * Phase 15. Every template renders the same contract:
 *   - short readable text, always paired with a tap-to-hear button
 *   - large tap targets (min 64px), no drag required for anything essential
 *   - a persistent "Hear again" anchor supplied by the shell
 *   - progressive hints, revealed one at a time
 *   - the active manipulation stage is scrolled into view on selection
 *
 * render(container, question, opts) -> controller
 *   controller.check()      -> { correct, response }
 *   controller.reset()
 *   controller.isReady()    -> is there something to check
 *   opts.onImmediate(res)   -> fired by templates that answer on a single tap
 *   opts.onProgress()       -> fired whenever the child changes their answer
 */
window.SakhiTemplates = (function () {
  'use strict';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function same(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every(function (x, i) { return String(x) === String(b[i]); });
    return String(a) === String(b);
  }
  /* Keep the thing the child is working on in view without yanking the page. */
  function focusStage(node) {
    if (!node || !node.scrollIntoView) return;
    try { node.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    catch (e) { node.scrollIntoView(false); }
  }

  /* Media block shared by every template: picture / passage / worked model. */
  function renderMedia(q) {
    var m = q.media;
    if (!m) return null;
    var wrap = el('div', 'q-media');
    if (m.passage) {
      var p = el('div', 'q-passage', m.passage);
      if (m.listenOnly) p.classList.add('is-listen-only');
      wrap.appendChild(p);
    }
    if (m.emoji) {
      var e = el('div', 'q-emoji', m.emoji);
      wrap.appendChild(e);
    }
    if (m.caption) wrap.appendChild(el('div', 'q-caption', m.caption));
    if (m.repeat && m.count) {
      var row = el('div', 'q-objects');
      for (var i = 0; i < m.count; i++) {
        var o = el('span', 'q-object', m.repeat);
        if (m.crossOut && i >= m.count - m.crossOut) o.classList.add('is-crossed');
        row.appendChild(o);
      }
      for (var g = 0; g < (m.ghost || 0); g++) row.appendChild(el('span', 'q-object is-ghost', m.repeat));
      wrap.appendChild(row);
    }
    if (m.groups) {
      var gr = el('div', 'q-groups');
      m.groups.forEach(function (grp, idx) {
        var box = el('div', 'q-group');
        for (var i = 0; i < grp.count; i++) box.appendChild(el('span', 'q-object', grp.emoji));
        gr.appendChild(box);
        if (idx < m.groups.length - 1) gr.appendChild(el('div', 'q-plus', '+'));
      });
      wrap.appendChild(gr);
    }
    if (m.sequence) {
      var s = el('div', 'q-objects');
      m.sequence.forEach(function (x) { s.appendChild(el('span', 'q-object', x)); });
      s.appendChild(el('span', 'q-object is-slot', '?'));
      wrap.appendChild(s);
      if (m.rule) wrap.appendChild(el('div', 'q-caption', 'Rule: ' + m.rule));
    }
    if (m.row) {
      var r = el('div', 'q-objects');
      m.row.forEach(function (x) { r.appendChild(el('span', 'q-object', x)); });
      wrap.appendChild(r);
    }
    if (m.bond) {
      var b = el('div', 'q-bond');
      b.appendChild(el('div', 'q-bond-total', String(m.bond.total)));
      var parts = el('div', 'q-bond-parts');
      parts.appendChild(el('div', 'q-bond-part', String(m.bond.part)));
      parts.appendChild(el('div', 'q-bond-part is-unknown', '?'));
      b.appendChild(parts);
      wrap.appendChild(b);
    }
    if (m.tens != null) {
      var pv = el('div', 'q-objects');
      for (var t = 0; t < m.tens; t++) pv.appendChild(el('span', 'q-object is-ten', '🔟'));
      for (var o2 = 0; o2 < m.ones; o2++) pv.appendChild(el('span', 'q-object', '🔹'));
      wrap.appendChild(pv);
    }
    return wrap.childNodes.length ? wrap : null;
  }

  function shell(container, q, opts) {
    clear(container);
    var head = el('div', 'q-head');
    var prompt = el('h2', 'q-prompt', q.prompt);
    head.appendChild(prompt);
    var hear = el('button', 'q-hear');
    hear.type = 'button';
    hear.setAttribute('aria-label', 'Hear the question again');
    hear.textContent = '🔊';
    hear.onclick = function () { opts.onHear && opts.onHear(); };
    head.appendChild(hear);
    container.appendChild(head);
    var media = renderMedia(q);
    if (media) container.appendChild(media);
    var stage = el('div', 'q-stage');
    container.appendChild(stage);
    return stage;
  }

  /* ---- templates ---------------------------------------------------------- */

  var T = {};

  T.choice = function (container, q, opts) {
    var stage = shell(container, q, opts);
    var grid = el('div', 'choice-grid');
    grid.dataset.count = q.choices.length;
    q.choices.forEach(function (c) {
      var b = el('button', 'choice-card');
      b.type = 'button';
      b.dataset.value = String(c);
      b.textContent = String(c);
      b.onclick = function () {
        if (grid.dataset.locked) return;
        var correct = same(c, q.answer);
        b.classList.add(correct ? 'is-correct' : 'is-wrong');
        if (correct) grid.dataset.locked = '1';
        focusStage(b);
        opts.onImmediate && opts.onImmediate({ correct: correct, response: c, node: b });
      };
      grid.appendChild(b);
    });
    stage.appendChild(grid);
    return {
      isReady: function () { return true; },
      check: function () { return null; },
      reset: function () { delete grid.dataset.locked; grid.querySelectorAll('.choice-card').forEach(function (b) { b.classList.remove('is-correct', 'is-wrong'); }); },
      immediate: true
    };
  };

  T.count = T.choice;   // same interaction, richer media block

  /* Tap tokens in order to build a word or a sequence. */
  function ordered(cls, joiner) {
    return function (container, q, opts) {
      var stage = shell(container, q, opts);
      var answerBox = el('div', cls + '-answer');
      var tokenRow = el('div', cls + '-tokens');
      stage.appendChild(answerBox);
      stage.appendChild(tokenRow);
      var picked = [];   // indices into q.tokens, so duplicate tokens stay distinct

      function paint() {
        clear(answerBox);
        if (!picked.length) {
          answerBox.appendChild(el('span', 'placeholder', joiner === ' ' ? 'Tap the letters' : 'Tap them in order'));
        } else {
          picked.forEach(function (idx, pos) {
            var chip = el('button', 'answer-chip', String(q.tokens[idx]));
            chip.type = 'button';
            chip.setAttribute('aria-label', 'Remove ' + q.tokens[idx]);
            chip.onclick = function () { picked.splice(pos, 1); paint(); opts.onProgress && opts.onProgress(); };
            answerBox.appendChild(chip);
          });
        }
        clear(tokenRow);
        q.tokens.forEach(function (t, i) {
          var b = el('button', 'token');
          b.type = 'button';
          b.textContent = String(t);
          b.disabled = picked.indexOf(i) !== -1;
          b.onclick = function () {
            picked.push(i); paint();
            focusStage(answerBox);
            opts.onProgress && opts.onProgress();
          };
          tokenRow.appendChild(b);
        });
      }
      paint();

      return {
        isReady: function () { return picked.length > 0; },
        check: function () {
          var response = picked.map(function (i) { return q.tokens[i]; });
          var correct = same(response, q.answer);
          answerBox.classList.remove('is-correct', 'is-wrong');
          answerBox.classList.add(correct ? 'is-correct' : 'is-wrong');
          return { correct: correct, response: response };
        },
        reset: function () { picked = []; answerBox.classList.remove('is-correct', 'is-wrong'); paint(); },
        immediate: false
      };
    };
  }
  T.build = ordered('build', ' ');
  T.sequence = ordered('sequence', ' → ');

  /* Tap an item, then tap the bucket it belongs in. No drag: reliable on touch
   * and usable by a five-year-old on the first try. */
  T.sort = function (container, q, opts) {
    var stage = shell(container, q, opts);
    var placed = {};        // token -> bucket id
    var selected = null;
    var tray = el('div', 'sort-tray');
    var buckets = el('div', 'sort-buckets');
    stage.appendChild(tray);
    stage.appendChild(buckets);

    function paint() {
      clear(tray);
      q.tokens.forEach(function (t) {
        if (placed[t]) return;
        var b = el('button', 'token sort-token');
        b.type = 'button'; b.textContent = String(t);
        if (selected === t) b.classList.add('is-selected');
        b.onclick = function () { selected = (selected === t ? null : t); paint(); focusStage(buckets); opts.onProgress && opts.onProgress(); };
        tray.appendChild(b);
      });
      if (!tray.childNodes.length) tray.appendChild(el('span', 'placeholder', 'All sorted — tap Check'));
      clear(buckets);
      q.buckets.forEach(function (bk) {
        var box = el('div', 'sort-bucket');
        box.appendChild(el('div', 'sort-bucket-label', bk.label));
        var items = el('div', 'sort-bucket-items');
        Object.keys(placed).forEach(function (t) {
          if (placed[t] !== bk.id) return;
          var chip = el('button', 'answer-chip', String(t));
          chip.type = 'button';
          chip.onclick = function () { delete placed[t]; paint(); opts.onProgress && opts.onProgress(); };
          items.appendChild(chip);
        });
        box.appendChild(items);
        box.onclick = function () {
          if (!selected) return;
          placed[selected] = bk.id; selected = null; paint();
          opts.onProgress && opts.onProgress();
        };
        buckets.appendChild(box);
      });
    }
    paint();

    return {
      isReady: function () { return Object.keys(placed).length === q.tokens.length; },
      check: function () {
        var correct = q.tokens.every(function (t) { return placed[t] === q.answer[t]; });
        buckets.classList.add(correct ? 'is-correct' : 'is-wrong');
        return { correct: correct, response: Object.assign({}, placed) };
      },
      reset: function () { placed = {}; selected = null; buckets.classList.remove('is-correct', 'is-wrong'); paint(); },
      immediate: false
    };
  };

  /* Tap on the left, then tap its partner on the right. */
  T.match = function (container, q, opts) {
    var stage = shell(container, q, opts);
    var pairs = {};      // left id -> right id
    var selected = null;
    var cols = el('div', 'match-cols');
    var leftCol = el('div', 'match-col');
    var rightCol = el('div', 'match-col');
    cols.appendChild(leftCol); cols.appendChild(rightCol);
    stage.appendChild(cols);

    function paint() {
      clear(leftCol); clear(rightCol);
      q.left.forEach(function (l) {
        var b = el('button', 'match-item');
        b.type = 'button';
        b.innerHTML = '';
        b.appendChild(el('span', 'match-emoji', l.emoji || ''));
        b.appendChild(el('span', 'match-label', l.label));
        if (pairs[l.id]) b.classList.add('is-paired');
        if (selected === l.id) b.classList.add('is-selected');
        b.onclick = function () {
          if (pairs[l.id]) { delete pairs[l.id]; selected = null; }
          else selected = (selected === l.id ? null : l.id);
          paint(); focusStage(rightCol); opts.onProgress && opts.onProgress();
        };
        leftCol.appendChild(b);
      });
      q.right.forEach(function (r) {
        var takenBy = Object.keys(pairs).filter(function (k) { return pairs[k] === r.id; })[0];
        var b = el('button', 'match-item');
        b.type = 'button';
        b.appendChild(el('span', 'match-emoji', r.emoji || ''));
        b.appendChild(el('span', 'match-label', r.label));
        if (takenBy) b.classList.add('is-paired');
        b.onclick = function () {
          if (!selected) return;
          Object.keys(pairs).forEach(function (k) { if (pairs[k] === r.id) delete pairs[k]; });
          pairs[selected] = r.id; selected = null; paint(); opts.onProgress && opts.onProgress();
        };
        rightCol.appendChild(b);
      });
    }
    paint();

    return {
      isReady: function () { return Object.keys(pairs).length === q.left.length; },
      check: function () {
        var correct = q.left.every(function (l) { return pairs[l.id] === q.answer[l.id]; });
        cols.classList.add(correct ? 'is-correct' : 'is-wrong');
        return { correct: correct, response: Object.assign({}, pairs) };
      },
      reset: function () { pairs = {}; selected = null; cols.classList.remove('is-correct', 'is-wrong'); paint(); },
      immediate: false
    };
  };

  /* Letter formation: follow the stroke with a finger. Scored on coverage of the
   * guide path, generously, because this is motor practice not calligraphy. */
  T.trace = function (container, q, opts) {
    var stage = shell(container, q, opts);
    var letter = q.media.letter;
    var wrap = el('div', 'trace-wrap');
    var guide = el('div', 'trace-guide', letter);
    var canvas = el('canvas', 'trace-canvas');
    wrap.appendChild(guide); wrap.appendChild(canvas);
    stage.appendChild(wrap);

    var covered = 0, total = 0, drawing = false, ctx2 = null;
    function size() {
      var r = wrap.getBoundingClientRect();
      canvas.width = Math.max(240, r.width); canvas.height = Math.max(240, r.height);
      ctx2 = canvas.getContext('2d');
      ctx2.lineWidth = 18; ctx2.lineCap = 'round'; ctx2.lineJoin = 'round';
      ctx2.strokeStyle = 'rgba(155,93,229,.75)';
      total = 0; covered = 0;
    }
    setTimeout(size, 0);

    function pos(e) {
      var r = canvas.getBoundingClientRect();
      var p = e.touches ? e.touches[0] : e;
      return { x: p.clientX - r.left, y: p.clientY - r.top };
    }
    function start(e) { e.preventDefault(); drawing = true; var p = pos(e); ctx2.beginPath(); ctx2.moveTo(p.x, p.y); focusStage(wrap); }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      var p = pos(e); ctx2.lineTo(p.x, p.y); ctx2.stroke();
      total++;
      /* Coverage proxy: strokes landing inside the guide glyph's box. */
      var g = guide.getBoundingClientRect(), c = canvas.getBoundingClientRect();
      var gx = g.left - c.left, gy = g.top - c.top;
      if (p.x >= gx && p.x <= gx + g.width && p.y >= gy && p.y <= gy + g.height) covered++;
      opts.onProgress && opts.onProgress();
    }
    function end() { drawing = false; }
    canvas.addEventListener('pointerdown', start);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointerleave', end);

    return {
      isReady: function () { return total > 20; },
      check: function () {
        var ratio = total ? covered / total : 0;
        var correct = total > 20 && ratio >= 0.6;
        wrap.classList.add(correct ? 'is-correct' : 'is-wrong');
        return { correct: correct, response: { strokes: total, onGuide: covered, ratio: Math.round(ratio * 100) / 100 } };
      },
      reset: function () { wrap.classList.remove('is-correct', 'is-wrong'); size(); if (ctx2) ctx2.clearRect(0, 0, canvas.width, canvas.height); },
      immediate: false
    };
  };

  function render(container, q, opts) {
    var fn = T[q.template];
    if (!fn) throw new Error('No template renderer for "' + q.template + '"');
    return fn(container, q, opts || {});
  }

  return { render: render, templates: Object.keys(T), focusStage: focusStage };
})();
