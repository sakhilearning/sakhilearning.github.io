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
  /* Drag support, ported from the single-file runtime.
   *
   * Drag is ADDITIVE to tap: every one of these interactions still works by
   * tapping alone, which matters because drag is genuinely hard for a
   * five-year-old and impossible with a switch or keyboard. A pointer that
   * moves less than 10px is treated as a tap.
   *
   * `commit(target)` is called with the drop target the pointer was released
   * over, matched by `selector`. */
  var draggedButton = null;
  function bindDrag(button, selector, commit) {
    var origin = null, ghost = null, moved = false;

    button.addEventListener('pointerdown', function (e) {
      if (button.disabled || e.button !== 0) return;
      origin = { x: e.clientX, y: e.clientY };
      moved = false;
      try { button.setPointerCapture(e.pointerId); } catch (err) {}
    });

    button.addEventListener('pointermove', function (e) {
      if (!origin) return;
      if (!moved && Math.hypot(e.clientX - origin.x, e.clientY - origin.y) < 10) return;
      moved = true;
      if (!ghost) {
        ghost = button.cloneNode(true);
        ghost.removeAttribute('id');
        ghost.setAttribute('aria-hidden', 'true');
        ghost.disabled = true;
        ghost.className = button.className + ' drag-ghost';
        document.body.appendChild(ghost);
      }
      ghost.style.left = e.clientX + 'px';
      ghost.style.top = e.clientY + 'px';
    });

    button.addEventListener('pointerup', function (e) {
      if (!origin) return;
      var wasDrag = moved;
      origin = null;
      if (ghost) { ghost.remove(); ghost = null; }
      if (!wasDrag) return;
      e.preventDefault();
      /* Suppress the click the browser fires after a drag, or the tap handler
       * would place the same token twice. */
      draggedButton = button;
      var suppress = function (c) { c.preventDefault(); c.stopImmediatePropagation(); };
      document.addEventListener('click', suppress, { capture: true, once: true });
      setTimeout(function () { document.removeEventListener('click', suppress, true); }, 0);
      var el = document.elementFromPoint(e.clientX, e.clientY);
      var target = el && el.closest(selector);
      if (target) commit(target);
    });

    function cancel() {
      origin = null;
      if (ghost) { ghost.remove(); ghost = null; }
    }
    button.addEventListener('pointercancel', cancel);
    button.addEventListener('lostpointercapture', function () { if (!moved) cancel(); });
  }

  /* Keep the thing the child is working on in view without yanking the page. */
  function focusStage(node) {
    if (!node || !node.scrollIntoView) return;
    try { node.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    catch (e) { node.scrollIntoView(false); }
  }

  function objectInfo(q, token) {
    var m = q.tokenVisuals && q.tokenVisuals[String(token)];
    if (!m) return { label: String(token), alt: String(token) };
    return {
      label: m.label || String(token),
      emoji: m.emoji || '',
      image: m.image || '',
      alt: m.alt || m.label || String(token),
      caption: m.caption || ''
    };
  }

  function appendObject(node, info) {
    if (info.image) {
      var img = document.createElement('img');
      img.className = 'object-img';
      img.src = info.image;
      img.alt = info.alt || info.label;
      img.loading = 'lazy';
      img.decoding = 'async';
      node.appendChild(img);
    } else if (info.emoji) {
      node.appendChild(el('span', 'object-emoji', info.emoji));
    }
    node.appendChild(el('span', 'object-label', info.label));
    if (info.caption) node.appendChild(el('small', 'object-caption', info.caption));
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
    if (m.image) {
      var fig = document.createElement('figure');
      fig.className = 'q-picture';
      var img = document.createElement('img');
      img.src = m.image;
      img.alt = m.alt || m.caption || q.prompt;
      img.decoding = 'async';
      img.loading = 'lazy';
      fig.appendChild(img);
      if (m.caption) fig.appendChild(el('figcaption', null, m.caption));
      wrap.appendChild(fig);
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
      for (var t = 0; t < m.tens; t++) pv.appendChild(el('span', 'q-object is-ten', m.tenSymbol || '🔟'));
      for (var o2 = 0; o2 < m.ones; o2++) pv.appendChild(el('span', 'q-object', m.oneSymbol || '🔹'));
      wrap.appendChild(pv);
    }
    return wrap.childNodes.length ? wrap : null;
  }

  /* What to DO, in words a five-year-old can act on. Shown on every question and
   * spoken with the prompt, because "Which word says map?" tells her what the
   * question is but not what to touch. */
  var ACTION = {
    choice:   'Tap the right one.',
    count:    'Tap the right number.',
    build:    'Tap or drag the letters to build the word.',
    sequence: 'Put them in the right order.',
    sort:     'Tap something, then tap the box it belongs in.',
    match:    'Tap one on the left, then tap its partner on the right.',
    trace:    'Trace the letter with your finger.'
  };
  function actionFor(q) {
    if (q.template === 'count' && q.tray) return 'Add jewels until the tray reaches the goal.';
    return ACTION[q.template] || 'Choose your answer.';
  }

  function shell(container, q, opts) {
    clear(container);
    var head = el('div', 'q-head');
    head.appendChild(el('h2', 'q-prompt', q.prompt));
    var hear = el('button', 'q-hear');
    hear.type = 'button';
    hear.setAttribute('aria-label', 'Hear it again');
    hear.textContent = '🔊';
    hear.onclick = function () { opts.onHear && opts.onHear(); };
    head.appendChild(hear);
    container.appendChild(head);
    container.appendChild(el('p', 'q-action', actionFor(q)));
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

  /* Counting: fill the treasure tray to the goal by dragging or tapping jewels.
   * Falls back to the choice card for count questions that have no tray (plain
   * "how many?", addition, subtraction), where picking the number IS the task. */
  T.count = function (container, q, opts) {
    if (!q.tray) return T.choice(container, q, opts);
    var stage = shell(container, q, opts);
    var goal = q.tray.goal, start = q.tray.start, gem = q.tray.emoji || '💎';
    var added = [];   // indices of jewels moved into the tray

    var hint = el('p', 'play-instruction', 'Tap a jewel in the tray to send it back.');
    var tray = el('div', 'counting-tray');
    tray.dataset.dropTray = 'true';
    tray.setAttribute('aria-label', 'Treasure tray');
    var trayJewels = el('div', 'tray-jewels');
    var tally = el('strong', 'tray-tally');
    tray.appendChild(trayJewels);
    tray.appendChild(tally);
    var supply = el('div', 'token-row');
    stage.appendChild(hint);
    stage.appendChild(tray);
    stage.appendChild(supply);

    function addJewel(i) {
      if (added.indexOf(i) !== -1 || start + added.length >= goal + 3) return;
      added.push(i);
      paint(); focusStage(tray);
      opts.onProgress && opts.onProgress();
    }
    function removeJewel(pos) {
      added.splice(pos, 1);
      paint();
      opts.onProgress && opts.onProgress();
    }

    function paint() {
      clear(trayJewels);
      for (var i = 0; i < start; i++) {
        trayJewels.appendChild(el('span', 'jewel fixed-jewel', gem));
      }
      added.forEach(function (_, pos) {
        var b = el('button', 'jewel-button', gem);
        b.type = 'button';
        b.setAttribute('aria-label', 'Return jewel ' + (pos + 1) + ' to the pile');
        b.onclick = function () { removeJewel(pos); };
        trayJewels.appendChild(b);
      });
      var total = start + added.length;
      tally.textContent = total + (total === 1 ? ' jewel' : ' jewels') + ' in the tray  ·  Goal: ' + goal;
      tray.classList.toggle('is-at-goal', total === goal);

      clear(supply);
      for (var j = 0; j < goal; j++) {
        (function (index) {
          var b = el('button', 'jewel-button', gem);
          b.type = 'button';
          b.dataset.jewel = String(index);
          b.disabled = added.indexOf(index) !== -1;
          b.setAttribute('aria-label', 'Add a jewel to the tray');
          b.onclick = function () { addJewel(index); };
          bindDrag(b, '[data-drop-tray]', function () { addJewel(index); });
          supply.appendChild(b);
        })(j);
      }
    }
    paint();

    return {
      isReady: function () { return added.length > 0; },
      check: function () {
        var correct = added.length === (goal - start);
        tray.classList.remove('is-correct', 'is-wrong');
        tray.classList.add(correct ? 'is-correct' : 'is-wrong');
        return { correct: correct, response: added.length };
      },
      reset: function () { added = []; tray.classList.remove('is-correct', 'is-wrong'); paint(); },
      immediate: false
    };
  };

  /* Build a word or order a sequence by filling slots.
   *
   * Two ways in, both always available: tap a tile and it drops into the next
   * empty slot, or drag it into a specific slot. Tap a filled slot to take it
   * back. Selection is tracked by token index, so repeated tokens (two arrows
   * in a coding sequence, a doubled letter) stay distinct. */
  function ordered(cls, isSequence) {
    return function (container, q, opts) {
      var stage = shell(container, q, opts);
      var slotCount = q.answer.length;
      var picked = [];   // token indices, in placement order

      var hint = el('p', 'play-instruction', 'Tap a filled space to take a tile back.');
      var board = el('div', 'magic-board' + (isSequence ? ' sequence-board' : ''));
      board.setAttribute('aria-label', 'Your answer');
      var tokenRow = el('div', 'token-row');
      stage.appendChild(hint);
      stage.appendChild(board);
      stage.appendChild(tokenRow);

      function firstEmpty() {
        for (var k = 0; k < slotCount; k++) if (picked[k] == null) return k;
        return -1;
      }

      function placeAt(tokenIndex, slotIndex) {
        if (picked.indexOf(tokenIndex) !== -1) return;
        /* A tap goes to the first EMPTY slot, not the end. Appending meant that
         * after taking a tile back out of the middle, the next tap jumped over
         * the hole it had just left. */
        if (slotIndex == null || slotIndex >= slotCount) slotIndex = firstEmpty();
        if (slotIndex < 0 || picked[slotIndex] != null) return;
        while (picked.length <= slotIndex) picked.push(null);
        picked[slotIndex] = tokenIndex;
        paint();
        focusStage(board);
        opts.onProgress && opts.onProgress();
      }

      function removeAt(slotIndex) {
        if (picked[slotIndex] == null) return;
        /* Clear the slot in place. Splicing shifted every later tile one to the
         * left, which silently rewrote an answer the child had already placed. */
        picked[slotIndex] = null;
        paint();
        opts.onProgress && opts.onProgress();
      }

      function paint() {
        clear(board);
        for (var i = 0; i < slotCount; i++) {
          var tokenIndex = picked[i];
          var slot = el('button', 'magic-slot' + (tokenIndex != null ? ' filled' : ''));
          slot.type = 'button';
          slot.dataset.slot = String(i);
          if (tokenIndex != null) {
            slot.textContent = String(q.tokens[tokenIndex]);
            slot.setAttribute('aria-label', 'Space ' + (i + 1) + ', holding ' + q.tokens[tokenIndex] + '. Tap to take it back.');
            slot.onclick = (function (idx) { return function () { removeAt(idx); }; })(i);
          } else {
            slot.appendChild(el('span', null, String(i + 1)));
            slot.setAttribute('aria-label', 'Empty space ' + (i + 1));
          }
          board.appendChild(slot);
        }
        clear(tokenRow);
        q.tokens.forEach(function (t, i) {
          var b = el('button', 'token' + (isSequence ? ' story-token' : ''));
          b.type = 'button';
          b.dataset.token = String(i);
          b.textContent = String(t);
          b.disabled = picked.indexOf(i) !== -1;
          b.onclick = function () { placeAt(i, null); };
          bindDrag(b, '[data-slot]', function (target) {
            placeAt(i, Number(target.dataset.slot));
          });
          tokenRow.appendChild(b);
        });
      }
      paint();

      return {
        isReady: function () { return picked.filter(function (x) { return x != null; }).length === slotCount; },
        check: function () {
          var response = [];
          for (var i = 0; i < slotCount; i++) {
            response.push(picked[i] == null ? null : q.tokens[picked[i]]);
          }
          var correct = same(response, q.answer);
          board.classList.remove('is-correct', 'is-wrong');
          board.classList.add(correct ? 'is-correct' : 'is-wrong');
          return { correct: correct, response: response };
        },
        reset: function () { picked = []; board.classList.remove('is-correct', 'is-wrong'); paint(); },
        immediate: false
      };
    };
  }
  T.build = ordered('build', false);
  T.sequence = ordered('sequence', true);

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
        var info = objectInfo(q, t);
        var b = el('button', 'token sort-token object-token');
        b.type = 'button';
        b.setAttribute('aria-label', info.label);
        appendObject(b, info);
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
          var chip = el('button', 'answer-chip object-token placed-object');
          chip.type = 'button';
          chip.setAttribute('aria-label', 'Move ' + objectInfo(q, t).label + ' back');
          appendObject(chip, objectInfo(q, t));
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

  return { render: render, templates: Object.keys(T), focusStage: focusStage, actionFor: actionFor };
})();
