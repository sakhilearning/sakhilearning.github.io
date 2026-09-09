(function () {
  "use strict";
  const BUILD = "2026.09.09-playful-activities",
    KEY = "sakhi.learning.state",
    OLD = [
      "sakhi.v3.state",
      "sakhi.v2.state",
      "sakhiMagicLearningV3",
      "rainbowMagicLearningV2",
    ],
    PASS = "071621";
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)],
    D = () => new Date().toISOString().slice(0, 10),
    id = () =>
      crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now() + "-" + Math.random();
  const safe = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const T = {
    reading: [
      "🦄",
      "Unicorn Reading Meadow",
      "Reading & Phonics",
      "Sakhi Unicorn",
      "#fff0fb",
      "#eee3ff",
      "#ddf7ff",
      "#f04ca6",
      "sounds → words → stories",
      "./assets/scenes/story-castle.webp",
    ],
    math: [
      "👑",
      "Royal Castle Academy",
      "Math & Number Sense",
      "Gem Princess",
      "#fff2fb",
      "#f5e5ff",
      "#fff2c5",
      "#9b56df",
      "counting → parts → problems",
      "./assets/scenes/royal-ballroom.webp",
    ],
    logic: [
      "❄️",
      "Ice Princess Palace",
      "Logic & Patterns",
      "Snow Princess",
      "#eaf8ff",
      "#dff1ff",
      "#f0e8ff",
      "#4aa8e8",
      "patterns → memory → reasoning",
      "./assets/scenes/frozen-palace.webp",
    ],
    science: [
      "🧜‍♀️",
      "Mermaid Lagoon",
      "Science & Curiosity",
      "Coral Mermaid",
      "#e2ffff",
      "#d4f7ff",
      "#ffe6f2",
      "#22b5c4",
      "predict → observe → explain",
      "./assets/scenes/mermaid-lagoon.webp",
    ],
    language: [
      "🌳",
      "Enchanted Forest Friends",
      "Stories & Comprehension",
      "Book Princess",
      "#f0ffe8",
      "#fff0d9",
      "#ffe6f1",
      "#5ead68",
      "listen → retell → explain",
      "./assets/scenes/forest-library.webp",
    ],
    writing: [
      "🧚",
      "Pixie Art Garden",
      "Writing & Creativity",
      "Lantern Princess",
      "#fff0f7",
      "#f3e7ff",
      "#e7fff1",
      "#df73b9",
      "letters → words → ideas",
      "./assets/scenes/tower-art-studio.webp",
    ],
  };
  const A = [
    {
      id: "read-cvc",
      d: "reading",
      n: "Unicorn Reading Meadow — Build the Word",
      s: "Build the Word",
      k: "CVC word building",
      i: "Listen to the word. Tap the letters in order.",
      c: "Sakhi Unicorn says: first sound, middle sound, last sound.",
      q: [
        [
          "word",
          "Build map.",
          ["m", "a", "p"],
          ["m", "s", "a", "p", "t"],
          "Build the word map.",
        ],
        [
          "word",
          "Build sun.",
          ["s", "u", "n"],
          ["s", "m", "u", "n", "p"],
          "Build the word sun.",
        ],
        [
          "pick",
          "Which word says tap?",
          "tap",
          ["tap", "pat", "sat"],
          "Which word says tap?",
        ],
      ],
    },
    {
      id: "math-seven",
      d: "math",
      n: "Royal Math Quest — Make 7",
      s: "Make 7",
      k: "number composition",
      i: "Count the royal gems. Choose what makes the crown complete.",
      c: "Gem Princess says: count carefully, then choose.",
      q: [
        [
          "num",
          "There are 4 gems. How many more make 7?",
          3,
          [2, 3, 4],
          "There are four gems. How many more make seven?",
          4,
          7,
        ],
        [
          "num",
          "There are 5 gems. How many more make 8?",
          3,
          [1, 2, 3],
          "There are five gems. How many more make eight?",
          5,
          8,
        ],
        [
          "pick",
          "Which pair makes 10?",
          "6 + 4",
          ["6 + 4", "7 + 2", "5 + 3"],
          "Which pair makes ten?",
        ],
      ],
    },
    {
      id: "logic-pattern",
      d: "logic",
      n: "Ice Princess Pattern Play — What Comes Next?",
      s: "Snowflake Pattern",
      k: "multi-step patterns",
      i: "Find the icy pattern. Choose what comes next.",
      c: "Snow Princess says: find the rule before you tap.",
      q: [
        [
          "pick",
          "❄️ 💎 ❄️ 💎 ❄️ ?",
          "💎",
          ["💎", "❄️", "🌙"],
          "What comes next?",
        ],
        [
          "pick",
          "❄️ ❄️ 👑 ❄️ ❄️ ?",
          "👑",
          ["❄️", "👑", "💎"],
          "Find the pattern.",
        ],
        [
          "seq",
          "Put the icy steps in order.",
          ["listen", "think", "tap"],
          ["tap", "listen", "think"],
          "Put the icy steps in order.",
        ],
      ],
    },
    {
      id: "science-float",
      d: "science",
      n: "Mermaid Science Lab — Float or Sink",
      s: "Float or Sink",
      k: "prediction and observation",
      i: "Predict what will happen in Mermaid Lagoon.",
      c: "Coral Mermaid says: make a smart guess, then notice.",
      q: [
        [
          "pick",
          "A leaf in water will...",
          "float",
          ["float", "sink", "melt"],
          "A leaf in water will...",
        ],
        [
          "pick",
          "A rock in water will...",
          "sink",
          ["float", "sink", "fly"],
          "A rock in water will...",
        ],
        [
          "pick",
          "A shell might sink because it is...",
          "heavier than water pushes up",
          ["heavier than water pushes up", "full of rainbow", "too sleepy"],
          "Why might a shell sink?",
        ],
      ],
    },
    {
      id: "story-order",
      d: "language",
      n: "Forest Story Adventure — What Happened First?",
      s: "Story Order",
      k: "story sequencing and why",
      i: "Listen to the tiny story. Put what happened in order.",
      c: "Book Princess says: stories have a beginning, middle, and end.",
      story:
        "Mina found a tiny crown near the tree. She asked the bunny who lost it. The bunny smiled and gave it back to the princess.",
      q: [
        [
          "seq",
          "Put the story in order.",
          ["Mina found a crown", "Mina asked the bunny", "The crown went back"],
          ["The crown went back", "Mina found a crown", "Mina asked the bunny"],
          "Put the story in order.",
        ],
        [
          "pick",
          "Why did Mina ask the bunny?",
          "to find who lost the crown",
          ["to find who lost the crown", "to eat lunch", "to hide the tree"],
          "Why did Mina ask the bunny?",
        ],
        [
          "pick",
          "How did Mina act?",
          "helpful",
          ["helpful", "mean", "sleepy"],
          "How did Mina act?",
        ],
      ],
    },
    {
      id: "write-label",
      d: "writing",
      n: "Pixie Writing Garden — Finish the Label",
      s: "Finish the Label",
      k: "spelling and labels",
      i: "Choose the missing letter to finish the word label.",
      c: "Lantern Princess says: say the word slowly and listen.",
      q: [
        ["pick", "_un  (sun)", "s", ["s", "m", "t"], "What letter starts sun?"],
        ["pick", "ma_  (map)", "p", ["p", "s", "n"], "What letter ends map?"],
        [
          "word",
          "Build pen.",
          ["p", "e", "n"],
          ["p", "t", "e", "n", "m"],
          "Build the word pen.",
        ],
      ],
    },
  ];
  let S = load(),
    view = "home",
    plan = null,
    act = null,
    qi = 0,
    sel = [],
    ok = 0,
    unlocked = sessionStorage.sakhiParent === "1",
    timer = null,
    announceNext = false,
    answerLocked = false,
    runId = null,
    draggedToken = null;
  function blank() {
    return {
      build: BUILD,
      stars: 0,
      gems: 0,
      hearts: 0,
      hist: [],
      skills: {},
      sessions: [],
      rewards: [],
      settings: { audio: true },
      legacy: { checked: false, imports: [] },
    };
  }
  function parse(x) {
    try {
      return JSON.parse(x);
    } catch {
      return null;
    }
  }
  function load() {
    let s = { ...blank(), ...(parse(localStorage[KEY]) || {}) };
    s.settings = { ...blank().settings, ...(s.settings || {}) };
    for (const k of ["hist", "sessions", "rewards"])
      if (!Array.isArray(s[k])) s[k] = [];
    if (!s.skills || typeof s.skills !== "object") s.skills = {};
    return migrate(s);
  }
  function save() {
    S.build = BUILD;
    S.updated_at = new Date().toISOString();
    try {
      localStorage[KEY] = JSON.stringify(S);
    } catch (e) {
      console.warn(e);
    }
  }
  function migrate(s) {
    if (s.legacy?.checked) return s;
    let imports = [];
    for (const k of OLD) {
      let raw = localStorage[k],
        o = parse(raw);
      if (!o) continue;
      try {
        localStorage["sakhi.backup." + k + "." + Date.now()] = raw;
      } catch {}
      let stars = find(o, /star|shiny/i),
        gems = find(o, /gem/i),
        hearts = find(o, /heart/i);
      s.stars = Math.max(s.stars || 0, stars);
      s.gems = Math.max(s.gems || 0, gems);
      s.hearts = Math.max(s.hearts || 0, hearts);
      let h = harvest(o).slice(-80);
      s.hist.push(...h);
      imports.push({
        key: k,
        stars,
        gems,
        hearts,
        history: h.length,
        at: new Date().toISOString(),
      });
    }
    s.legacy = { checked: true, imports };
    s.hist = s.hist.slice(-250);
    return s;
  }
  function find(o, re, seen = new Set(), d = 0) {
    if (!o || typeof o !== "object" || seen.has(o) || d > 4) return 0;
    seen.add(o);
    let m = 0;
    for (const [k, v] of Object.entries(o)) {
      if (re.test(k) && typeof v === "number") m = Math.max(m, v);
      m = Math.max(m, find(v, re, seen, d + 1));
    }
    return m;
  }
  function harvest(o, out = [], seen = new Set(), d = 0) {
    if (!o || typeof o !== "object" || seen.has(o) || d > 5 || out.length > 120)
      return out;
    seen.add(o);
    if (Array.isArray(o))
      o.forEach((x) => {
        if (
          x &&
          typeof x === "object" &&
          (x.activityId || x.activity_id || x.domain || x.score || x.result)
        )
          out.push({
            date: String(x.date || x.completed_at || x.timestamp || D()).slice(
              0,
              10,
            ),
            activityTitle: String(
              x.activityId ||
                x.activity_id ||
                x.title ||
                "Previous Sakhi activity",
            ),
            domain: String(x.domain || "legacy"),
            migrated: true,
          });
        harvest(x, out, seen, d + 1);
      });
    else Object.values(o).forEach((v) => harvest(v, out, seen, d + 1));
    return out;
  }
  function th(d) {
    return T[d] || T.reading;
  }
  function theme(d) {
    let t = th(d);
    document.body.dataset.world = d;
    ["--theme-a", "--theme-b", "--theme-c", "--theme-accent"].forEach((p, i) =>
      document.documentElement.style.setProperty(p, t[i + 4]),
    );
    document.documentElement.style.setProperty(
      "--world-image",
      `url("${t[9]}")`,
    );
  }
  function art(d) {
    const t = th(d);
    return `<img class="scene-image" src="${t[9]}" alt="${safe(t[1])}" width="1536" height="1024" decoding="async">`;
  }
  function meadowArt() {
    return '<img class="scene-image" src="./assets/scenes/rainbow-meadow.webp" alt="Rainbow Unicorn Meadow" width="1536" height="1024" decoding="async">';
  }
  const AUDIO = {
    endpoint: "https://okzmrlrijovbuatjcgqi.supabase.co/functions/v1/sakhi-tts",
    key: "sb_publishable_2rp84hm1GThThM-V5-s4jA_3Z_090ne",
  };
  const audioCache = new Map();
  let audioRequest = null,
    audioUrl = "",
    audioState = "ready",
    audioGeneration = 0;
  function setAudioState(state, message = "") {
    audioState = state;
    const status = $("#audioStatus");
    if (status) status.textContent = message || state;
    const replay = $("#hearAgain");
    if (replay) {
      replay.disabled = state === "loading";
      replay.textContent =
        state === "loading" ? "Loading Sakhi’s voice…" : "Hear Sakhi again";
    }
  }
  async function fetchVoice(text, kind) {
    const cacheKey = `${kind}|${text}`;
    if (audioCache.has(cacheKey)) return audioCache.get(cacheKey);
    audioRequest?.abort();
    audioRequest = new AbortController();
    const response = await fetch(AUDIO.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: AUDIO.key,
        "x-client-info": "sakhi-storybook/2",
      },
      body: JSON.stringify({
        text,
        kind,
        profile: kind === "story" ? "book" : "sakhi",
      }),
      signal: audioRequest.signal,
    });
    if (!response.ok)
      throw new Error(`voice service returned ${response.status}`);
    if (!(response.headers.get("content-type") || "").includes("audio/"))
      throw new Error("voice service returned invalid audio");
    const blob = await response.blob();
    if (blob.size < 500) throw new Error("voice response was empty");
    audioCache.set(cacheKey, blob);
    return blob;
  }
  async function speak(x, kind = "instruction") {
    const text = String(x || "").trim();
    if (!S.settings.audio || !text) return false;
    stop();
    const generation = audioGeneration;
    setAudioState("loading", "Loading Sakhi’s natural voice…");
    try {
      const blob = await fetchVoice(text, kind);
      if (generation !== audioGeneration) return false;
      const player = $("#sakhiAudio");
      audioUrl = URL.createObjectURL(blob);
      player.src = audioUrl;
      player.onended = () => stop();
      player.onerror = () =>
        setAudioState(
          "error",
          "Audio could not play. Tap Test Sakhi voice in Parents.",
        );
      await player.play();
      if (generation !== audioGeneration) return false;
      setAudioState("playing", "Sakhi is speaking");
      return true;
    } catch (error) {
      if (generation !== audioGeneration) return false;
      if (error.name !== "AbortError") {
        console.error("Sakhi audio:", error);
        setAudioState(
          "error",
          "Voice unavailable. Check the connection and try again.",
        );
      }
      return false;
    }
  }
  function stop() {
    audioGeneration++;
    audioRequest?.abort();
    audioRequest = null;
    const player = $("#sakhiAudio");
    if (player) {
      player.pause();
      player.removeAttribute("src");
      player.load();
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioUrl = "";
    setAudioState("ready", "Natural voice ready");
  }
  function show(v) {
    if (v === "parents" && !unlocked) {
      if (prompt("Parent passcode") !== PASS) return;
      unlocked = true;
      sessionStorage.sakhiParent = "1";
    }
    stop();
    clearTimeout(timer);
    view = v;
    $$(".view").forEach((x) =>
      x.classList.toggle("active", x.dataset.view === v),
    );
    render();
    scrollTo({ top: 0, behavior: "smooth" });
  }
  function render() {
    save();
    $$("[data-nav]").forEach((b) =>
      b.classList.toggle(
        "active",
        b.dataset.nav === view ||
          (view === "activity" && b.dataset.nav === "adventure"),
      ),
    );
    $("#starsCount").textContent = S.stars;
    $("#gemsCount").textContent = S.gems;
    $("#syncBadge").textContent = S.legacy.imports.length
      ? "History kept: " + S.legacy.imports.length
      : "This device";
    (({ home, adventure, activity, rewards, parents, story })[view] || home)();
  }
  function makePlan() {
    let done = new Set(
      S.hist.filter((h) => h.date === D()).map((h) => h.activityId),
    );
    let r = ["logic", "science", "language", "writing"],
      day = new Date().getDay(),
      order = ["reading", "math", r[day % 4], r[(day + 1) % 4]];
    return [...new Set(order)]
      .map(
        (d) =>
          A.find((a) => a.d === d && !done.has(a.id)) ||
          A.find((a) => a.d === d),
      )
      .filter(Boolean)
      .slice(0, 4);
  }
  function ensure() {
    if (!plan || plan.date !== D())
      plan = { id: id(), date: D(), list: makePlan(), i: 0, done: [] };
    return plan.list;
  }
  function home() {
    theme("reading");
    $("#homeHeroArt").innerHTML = meadowArt();
    let p = ensure();
    $("#homeGoal").textContent = p[0]
      ? th(p[0].d)[2] + ": " + p[0].k
      : "Balanced learning";
    $("#homeWhy").textContent = S.hist.length
      ? "Sakhi is preserving saved history and continuing with quick review plus next-ready practice."
      : "Sakhi starts with a stable age-appropriate plan and adapts from today’s answers.";
    $("#homeNext").textContent = p[1] ? th(p[1].d)[1] : "Rewards";
    $("#kingdomGrid").innerHTML = Object.keys(T)
      .map((d) => {
        let t = th(d);
        return `<button class="kingdom-card" data-d="${d}"><div class="kingdom-image">${art(d)}</div><div class="kingdom-copy"><small>${t[2]}</small><b>${t[1]}</b><p>${t[3]} guides ${t[8]}.</p><em>${t[8]}</em></div></button>`;
      })
      .join("");
    $$(".kingdom-card").forEach(
      (b) => (b.onclick = () => openDomain(b.dataset.d)),
    );
  }
  function adventure() {
    let p = ensure();
    theme(p[plan.i]?.d || "reading");
    $("#trailIntro").textContent =
      "One clear page opens at a time, then Sakhi saves and moves forward.";
    $("#trail").innerHTML = p
      .map((a, i) => {
        let t = th(a.d),
          done = S.hist.some(
            (h) => h.date === D() && h.activityId === a.id && h.final,
          );
        return `<button class="trail-stop ${done ? "done" : ""} ${i === plan.i ? "current" : ""}" style="--trail-image:url('${t[9]}')" data-i="${i}"><span>${t[0]}</span><b>${safe(a.s)}</b><small>${safe(t[1])}</small><em>${done ? "Done" : i + 1 + " of " + p.length}</em></button>`;
      })
      .join("");
    $$(".trail-stop").forEach(
      (b) => (b.onclick = () => start(ensure()[+b.dataset.i], +b.dataset.i)),
    );
  }
  function startAdventure() {
    plan = { id: id(), date: D(), list: makePlan(), i: 0, done: [] };
    S.sessions.push({
      id: plan.id,
      date: D(),
      started_at: new Date().toISOString(),
      plan: plan.list.map((a) => a.id),
      status: "IN_PROGRESS",
    });
    start(plan.list[0], 0);
  }
  function openDomain(d) {
    plan = {
      id: id(),
      date: D(),
      list: [A.find((a) => a.d === d)],
      i: 0,
      done: [],
    };
    start(plan.list[0], 0);
  }
  function start(a, i) {
    runId = id();
    answerLocked = false;
    act = a;
    qi = 0;
    sel = [];
    ok = 0;
    announceNext = true;
    plan.i = i || 0;
    show("activity");
  }
  function activity() {
    if (!act) return show("adventure");
    let t = th(act.d),
      q = act.q[qi];
    theme(act.d);
    $("#activityWorld").textContent = t[1];
    $("#activityType").textContent = t[2] + " • " + act.k;
    $("#activityProgress").textContent = qi + 1 + " of " + act.q.length;
    $("#activityTitle").textContent = act.n;
    $("#activityInstruction").textContent = act.i;
    $("#activityGuide").innerHTML = art(act.d);
    $("#activityCharacter").textContent = act.c;
    $("#interactionArea").innerHTML = question(q);
    $("#hearAgain").onclick = () => speak(activityNarration(q));
    $("#hintBtn").onclick = hint;
    wire(q);
    if (announceNext) {
      announceNext = false;
      void speak(activityNarration(q));
    }
  }
  const treasures = {
    reading: ["Rainbow Gem", "rainbow"],
    math: ["Royal Diamond", "diamond"],
    logic: ["Ice Crystal", "crystal"],
    science: ["Ocean Pearl", "pearl"],
    language: ["Kindness Jewel", "heart"],
    writing: ["Creativity Gem", "rainbow"],
  };
  function jewel(domain, extra = "") {
    return `<span aria-hidden="true" class="treasure treasure-${treasures[domain][1]} ${extra}"></span>`;
  }
  function activityNarration(q) {
    return (act.story && qi === 0 ? act.story + " " : "") + (q[4] || act.i);
  }
  function question(q) {
    const story = act.story
      ? `<div class="story-strip"><b>A little story to think about</b><p>${safe(act.story)}</p><button id="hearScene" class="soft-btn">Listen to the story</button></div>`
      : "";
    const banner = `<div class="mission-ribbon">${jewel(act.d)}<span>Mission ${qi + 1} of ${act.q.length} · Earn a ${treasures[act.d][0]}</span></div>`;
    const start = `${banner}${story}<div class="question"><h2>${safe(q[0] === "word" ? "Build the word you hear" : q[1])}</h2>`;
    const controls =
      '<div class="center-row"><button class="soft-btn" id="reset">Start over</button><button class="magic-btn" id="check">Check my creation</button></div>';
    const feedback =
      '<div id="learningFeedback" class="learning-feedback" role="status"></div>';
    if (q[0] === "word" || q[0] === "seq") {
      const slots = q[2]
        .map(
          (_, index) =>
            `<button class="magic-slot ${sel[index] !== undefined ? "filled" : ""}" data-slot="${index}" aria-label="Place ${index + 1}${sel[index] ? ": " + safe(sel[index]) + ". Tap to remove" : ": empty"}">${sel[index] === undefined ? `<span>${index + 1}</span>` : safe(sel[index])}</button>`,
        )
        .join("");
      const tokens = q[3]
        .map(
          (value, index) =>
            `<button class="${q[0] === "word" ? "token" : "story-token"}" data-token="${index}" ${sel.includes(value) ? "disabled" : ""}>${safe(value)}</button>`,
        )
        .join("");
      return `${start}<p class="play-instruction">Drag a tile into a space, or tap a tile to place it. Tap a filled space to undo.</p><div class="magic-board ${q[0] === "seq" ? "sequence-board" : ""}" aria-label="Your creation">${slots}</div><div class="token-row">${tokens}</div>${controls}${feedback}</div>`;
    }
    if (q[0] === "num") {
      const count = q[5] + sel.length;
      return `${start}<p class="play-instruction">Drag jewels to the treasure tray, or tap to add. Tap an added jewel to return it.</p><div class="counting-tray" data-drop-tray="true" aria-label="Treasure tray"><div class="tray-jewels">${Array.from({ length: q[5] }, () => jewel("math", "fixed-jewel")).join("")}${sel.map((_, i) => `<button class="jewel-button" data-remove-jewel="${i}" aria-label="Return added jewel ${i + 1}">${jewel("math")}</button>`).join("")}</div><strong>${count} jewels in the tray · Goal: ${q[6]}</strong></div><div class="token-row">${Array.from({ length: q[6] }, (_, i) => `<button class="jewel-button" data-jewel="${i}" ${sel.includes(i) ? "disabled" : ""} aria-label="Add jewel ${i + 1}">${jewel("math")}</button>`).join("")}</div>${controls}${feedback}</div>`;
    }
    return `${start}<p class="play-instruction">Think it through. Choose your answer.</p><div class="choice-grid">${q[3].map((value) => `<button class="choice-card" data-a="${safe(value)}">${jewel(act.d)}<span>${safe(value)}</span></button>`).join("")}</div>${feedback}</div>`;
  }
  function wire(q) {
    const insert = (value, slot = sel.length) => {
      if (
        answerLocked ||
        sel.includes(value) ||
        slot > sel.length ||
        sel.length >= q[2].length
      )
        return;
      sel.splice(slot, slot < sel.length ? 1 : 0, value);
      activity();
    };
    const bindDrag = (button, commit) => {
      let origin = null,
        ghost = null,
        moved = false;
      button.onpointerdown = (event) => {
        if (button.disabled || answerLocked || event.button !== 0) return;
        origin = { x: event.clientX, y: event.clientY };
        moved = false;
        button.setPointerCapture(event.pointerId);
      };
      button.onpointermove = (event) => {
        if (!origin) return;
        if (
          !moved &&
          Math.hypot(event.clientX - origin.x, event.clientY - origin.y) < 10
        )
          return;
        moved = true;
        if (!ghost) {
          ghost = button.cloneNode(true);
          ghost.removeAttribute("id");
          ghost.setAttribute("aria-hidden", "true");
          ghost.classList.add("drag-ghost");
          document.body.append(ghost);
        }
        ghost.style.left = event.clientX + "px";
        ghost.style.top = event.clientY + "px";
      };
      button.onpointerup = (event) => {
        if (!origin) return;
        const wasDrag = moved;
        origin = null;
        ghost?.remove();
        ghost = null;
        if (wasDrag) {
          event.preventDefault();
          const suppressClick = (click) => {
            click.preventDefault();
            click.stopImmediatePropagation();
          };
          document.addEventListener("click", suppressClick, {
            capture: true,
            once: true,
          });
          setTimeout(
            () => document.removeEventListener("click", suppressClick, true),
            0,
          );
          draggedToken = button;
          const target = document
            .elementFromPoint(event.clientX, event.clientY)
            ?.closest("[data-slot], [data-drop-tray]");
          if (target) commit(target);
        }
      };
      button.onpointercancel = () => {
        origin = null;
        ghost?.remove();
        ghost = null;
      };
      button.addEventListener(
        "click",
        (event) => {
          if (draggedToken === button) {
            event.preventDefault();
            event.stopImmediatePropagation();
            draggedToken = null;
          }
        },
        true,
      );
    };
    $$("[data-token]").forEach((button) => {
      const value = q[3][Number(button.dataset.token)];
      button.onclick = () => insert(value);
      bindDrag(button, (target) => {
        if (target.dataset.slot !== undefined)
          insert(value, Number(target.dataset.slot));
      });
    });
    $$("[data-slot]").forEach(
      (button) =>
        (button.onclick = () => {
          if (answerLocked) return;
          sel.splice(Number(button.dataset.slot), 1);
          activity();
        }),
    );
    const addJewel = (index) => {
      if (answerLocked || sel.includes(index)) return;
      sel.push(index);
      activity();
    };
    $$("[data-jewel]").forEach((button) => {
      const index = Number(button.dataset.jewel);
      button.onclick = () => addJewel(index);
      bindDrag(button, (target) => {
        if (target.dataset.dropTray) addJewel(index);
      });
    });
    $$("[data-remove-jewel]").forEach(
      (button) =>
        (button.onclick = () => {
          if (answerLocked) return;
          sel.splice(Number(button.dataset.removeJewel), 1);
          activity();
        }),
    );
    $$("[data-a]").forEach(
      (button) => (button.onclick = () => answer(q, button.dataset.a, button)),
    );
    if ($("#reset"))
      $("#reset").onclick = () => {
        if (answerLocked) return;
        sel = [];
        activity();
      };
    if ($("#check"))
      $("#check").onclick = () => {
        if ((q[0] === "word" || q[0] === "seq") && sel.length !== q[2].length) {
          $("#learningFeedback").textContent =
            "Fill each space before checking. You can do it one step at a time.";
          return;
        }
        answer(q, q[0] === "num" ? sel.length : sel);
      };
    if ($("#hearScene"))
      $("#hearScene").onclick = () => speak(act.story, "story");
  }
  function norm(x) {
    return Array.isArray(x)
      ? x.map(String).join("|").toLowerCase()
      : String(x).toLowerCase();
  }
  function answer(q, a, b) {
    if (answerLocked) return;
    answerLocked = true;
    const activeRun = runId;
    $$("#interactionArea button").forEach((button) => (button.disabled = true));
    let correct = norm(a) === norm(q[2]);
    if (b) b.classList.add(correct ? "correct" : "wrong");
    S.hist.push({
      id: id(),
      date: D(),
      at: new Date().toISOString(),
      sessionId: plan.id,
      activityId: act.id,
      activityTitle: act.n,
      domain: act.d,
      skill: act.k,
      question: qi + 1,
      correct,
      answer: Array.isArray(a) ? [...a] : a,
      expected: q[2],
    });
    let key = act.d + ":" + act.k,
      sk = S.skills[key] || {
        domain: act.d,
        skill: act.k,
        attempts: 0,
        correct: 0,
        state: "Learning",
      };
    sk.attempts++;
    if (correct) {
      sk.correct++;
      S.stars++;
      ok++;
    } else {
      S.hearts++;
    }
    sk.state =
      sk.attempts >= 6 && sk.correct / sk.attempts >= 0.85
        ? "Mostly Mastered"
        : sk.attempts >= 3 && sk.correct / sk.attempts >= 0.65
          ? "Developing"
          : "Learning";
    sk.last_practiced = new Date().toISOString();
    S.skills[key] = sk;
    save();
    const explanation = correct
      ? q[0] === "word"
        ? `You put the sounds in order to spell ${q[2].join("")}.`
        : q[0] === "num"
          ? `${q[5]} and ${q[2]} make ${q[6]}. You counted the missing part!`
          : act.d === "language"
            ? "You thought about how someone else feels. Kind choices help everyone belong."
            : q[0] === "seq"
              ? "You found the beginning, middle, and end. Order helps us understand."
              : `You worked it out: ${q[2]}.`
      : q[0] === "num"
        ? `Your tray has ${q[5] + sel.length}. The goal is ${q[6]}. Add or return jewels and check again.`
        : "That choice did not fit yet. Listen again, then try a different idea. Mistakes help us learn.";
    $("#learningFeedback").innerHTML =
      `<div class="feedback-card ${correct ? "success" : "retry"}"><b>${correct ? "Your thinking shines!" : "Let’s try another way"}</b><p>${safe(explanation)}</p><button class="magic-btn" id="continueQuestion">${correct ? "Continue the adventure" : "Try again"}</button></div>`;
    void speak(explanation, "feedback");
    $("#continueQuestion").onclick = () => {
      if (runId !== activeRun || view !== "activity") return;
      answerLocked = false;
      stop();
      correct ? next() : activity();
    };
    $("#learningFeedback").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "nearest",
    });
  }

  function next() {
    sel = [];
    if (qi < act.q.length - 1) {
      qi++;
      announceNext = true;
      activity();
    } else complete();
  }
  function complete() {
    if (S.rewards.some((reward) => reward.completionId === runId)) return;
    S.gems++;
    S.rewards.push({
      id: id(),
      completionId: runId,
      date: D(),
      type: treasures[act.d][0],
      domain: act.d,
      reason: act.n,
    });
    S.hist.push({
      id: id(),
      date: D(),
      at: new Date().toISOString(),
      activityId: act.id,
      activityTitle: act.n,
      domain: act.d,
      skill: act.k,
      final: true,
      correct: true,
    });
    let ses = S.sessions.find((x) => x.id === plan.id);
    if (ses) {
      ses.completed = [...new Set([...(ses.completed || []), act.id])];
      ses.status =
        ses.completed.length >= plan.list.length ? "COMPLETED" : "IN_PROGRESS";
    }
    save();
    $("#completionTitle").textContent = act.s + " complete!";
    $("#completionText").textContent =
      `You earned a ${treasures[act.d][0]} by practicing ${act.k}! Your collection now has ${S.gems} treasures.`;
    $("#nextActivity").textContent = nextAct()
      ? "Next: " + th(nextAct().d)[1] + " →"
      : "Go to Rewards ⭐";
    $("#completionOverlay").classList.add("show");
    $("#completionTreasure").innerHTML = jewel(act.d, "earned-treasure");
    $("#completionOverlay").setAttribute("aria-label", act.s + " complete");
    $("#nextActivity").focus();
    void speak(
      `Mission complete! You earned a ${treasures[act.d][0]}. Take a moment to enjoy your treasure.`,
      "feedback",
    );
  }
  function nextAct() {
    return plan.list.find(
      (a, i) =>
        i > plan.i &&
        !S.hist.some((h) => h.date === D() && h.activityId === a.id && h.final),
    );
  }
  function goNext() {
    clearTimeout(timer);
    $("#completionOverlay").classList.remove("show");
    let n = nextAct();
    if (n) {
      plan.i = plan.list.indexOf(n);
      start(n, plan.i);
    } else show("rewards");
  }
  function rewards() {
    theme("reading");
    $("#rewardArt").innerHTML = meadowArt();
    $("#treasureCollection").innerHTML =
      S.rewards
        .slice(-12)
        .reverse()
        .map(
          (reward) =>
            `<div class="collection-item">${jewel(reward.domain || "reading")}<b>${safe(reward.domain ? reward.type : "Rainbow Gem")}</b><small>${safe(reward.reason)}</small></div>`,
        )
        .join("") ||
      "<p>Your first treasure is waiting at the end of a mission.</p>";
    $("#rewardStars").textContent = S.stars;
    $("#rewardGems").textContent = S.gems;
    $("#rewardHearts").textContent = S.hearts;
    let ds = [
      ...new Set(
        S.hist
          .filter((h) => h.date === D() && h.domain && h.final)
          .map((h) => th(h.domain)[2]),
      ),
    ];
    $("#rewardSummary").innerHTML = ds.length
      ? `<h2>Look what you practiced!</h2><p>You practiced ${ds.join(", ")}.</p>`
      : "<h2>Your Magic Collection</h2><p>Start an adventure to earn stars and gems.</p>";
  }
  function story() {
    theme("language");
    let worlds =
      [
        ...new Set(
          S.hist
            .filter((h) => h.date === D() && h.domain)
            .map((h) => th(h.domain)[1]),
        ),
      ].join(", ") || "Rainbow Meadow";
    const stories = [
      `The Pearl That Wouldn’t Shine\n\nIn ${worlds}, Mina and Luna found one beautiful pearl. “Mine!” said Mina. “But we found it together,” said Luna. They both went quiet.\n\nA crab shuffled past wearing a teacup for a hat. “I ordered a crown,” he said, “but this one holds snacks!” Mina giggled. Luna did too. It felt easier to talk.\n\n“I wanted the pearl so much that I forgot to ask you,” Mina said. “What would feel fair?” They decided to take turns carrying it, then put it where everyone could enjoy it.\n\nThe pearl did not change. But the day felt brighter. Sharing did not mean Mina’s wishes did not matter. It meant Luna’s wishes mattered too.\n\nTalk together: What could you say when you and a friend both want the same toy?`,
      `The Wobbly Bridge\n\nIn ${worlds}, a little fox watched the others cross a stepping-stone path. His paws trembled. “Come on!” called Mina. Then she noticed his face.\n\n“Would you like help, or would you like me to wait?” she asked. “Wait, please,” he said. Mina stayed beside him. Luna tried to balance a leaf on her nose. It fell off every time. “My nose is clearly not a shelf,” she announced. Everyone smiled.\n\nThe fox tried one stone. Then another. When he slipped, they helped him back to the bank and checked that he was all right. They asked a grown-up to find a safer crossing.\n\nBeing brave did not mean ignoring a worried feeling. And being a good friend did not mean rushing someone. Sometimes kindness means listening and staying close.\n\nTalk together: How can you help someone who wants to go more slowly?`,
      `The Mixed-Up Invitation\n\nIn ${worlds}, Mina planned a picnic. She drew invitations with tiny pictures for friends who did not read yet. Luna delivered them, but accidentally gave the owl three and the rabbit none.\n\n“I thought everyone forgot me,” said Rabbit. Mina listened. “That must have felt lonely. I’m glad you told me.” Luna said, “I made a mistake. I’m sorry. Let’s fix it.”\n\nThey brought Rabbit an invitation and asked what food worked for everyone. Owl preferred seeds. Rabbit liked crunchy leaves. “I brought invisible sandwiches,” joked Luna. “Oh dear, I seem to have eaten them already!”\n\nThey made room for everyone. An apology was a beginning; helping to put things right was the next step. Friends can like different things and still belong together.\n\nTalk together: What could you do if someone was left out of a game?`,
    ];
    $("#storyText").textContent =
      stories[new Date().getDate() % stories.length];
  }

  function parents() {
    theme("language");
    let today = S.hist.filter((h) => h.date === D());
    $("#parentGoal").textContent = today.length
      ? "Continue today’s trail without restarting."
      : "Start reading, then math, then discovery.";
    $("#parentWhy").textContent = S.hist.length
      ? "Saved history exists and is used for progress display."
      : "No saved activity yet on this device.";
    $("#parentNext").textContent =
      "Use the stable journey daily, then expand activities.";
    const paths = {
      reading: [
        "Letter sounds",
        "CVC word building",
        "Sentence reading",
        "Story comprehension",
      ],
      math: [
        "Counting and quantities",
        "number composition",
        "Addition and subtraction",
        "Word problems",
      ],
      logic: [
        "Matching and sorting",
        "multi-step patterns",
        "Working memory",
        "Reasoning",
      ],
      science: [
        "Observing and comparing",
        "prediction and observation",
        "Testing ideas",
        "Explaining results",
      ],
      language: [
        "Listening and vocabulary",
        "story sequencing and why",
        "Retelling",
        "Making inferences",
      ],
      writing: [
        "Letter formation",
        "spelling and labels",
        "Writing sentences",
        "Creating stories",
      ],
    };
    const evidence = S.hist.filter(
      (h) => !h.final && typeof h.correct === "boolean" && !h.migrated,
    );
    const correct = evidence.filter((h) => h.correct).length;
    // Curriculum is derived from recorded attempts, never from decorative themes.
    $("#parentGoal").textContent =
      `${evidence.length} recorded answers · ${S.hist.filter((h) => h.final).length} completed missions`;
    $("#parentWhy").textContent = evidence.length
      ? `${Math.round((correct / evidence.length) * 100)}% accuracy across recorded answers`
      : "Complete a mission to begin tracking learning evidence.";
    $("#parentNext").textContent =
      "Review each subject below. Planned skills are shown separately from playable practice.";
    $("#domainProgress").innerHTML = Object.entries(paths)
      .map(([domain, skills]) => {
        const activity = A.find((item) => item.d === domain);
        const attempts = evidence.filter((h) => h.domain === domain);
        const successes = attempts.filter((h) => h.correct).length;
        const accuracy = attempts.length
          ? Math.round((successes / attempts.length) * 100)
          : 0;
        const days = new Set(attempts.map((h) => h.date)).size;
        const secure = attempts.length >= 9 && days >= 3 && accuracy >= 85;
        return `<details class="curriculum-domain" open><summary><span>${safe(th(domain)[2])}</span><span>${attempts.length ? accuracy + "% accuracy" : "Not assessed"}</span></summary>
        <div class="curriculum-evidence"><p>${attempts.length} answers · ${days} practice days · ${secure ? "Consistent practice evidence" : "Building practice evidence"}</p><progress max="100" value="${accuracy}" aria-label="${safe(th(domain)[2])} answer accuracy"></progress></div>
        <ol class="curriculum-path">${skills
          .map((skill, index) => {
            const playable = skill === activity.k;
            const status = playable
              ? secure
                ? "Consistent"
                : attempts.length
                  ? "Practicing"
                  : "Ready to practice"
              : "Planned · not assessed";
            return `<li><span class="curriculum-step">${index + 1}</span><div><b>${safe(skill)}</b><small>${status}</small>${playable ? `<p>${safe(activity.i)}</p><button class="soft-btn" data-practice="${domain}">Open practice</button>` : ""}</div></li>`;
          })
          .join("")}</ol></details>`;
      })
      .join("");
    $$("[data-practice]").forEach(
      (button) => (button.onclick = () => openDomain(button.dataset.practice)),
    );
    $("#historyList").innerHTML =
      S.hist
        .slice(-18)
        .reverse()
        .map(
          (h) =>
            `<li><b>${safe(h.activityTitle || "Sakhi activity")}</b><small>${safe(h.date)} • ${safe(h.domain || "")} • ${h.final ? "complete" : h.correct === true ? "correct" : h.correct === false ? "try again" : "saved"}</small></li>`,
        )
        .join("") ||
      "<li><b>No activity yet</b><small>Start today’s adventure to save progress.</small></li>";
    $("#historyStatus").innerHTML = S.legacy.imports.length
      ? `<b>Previous history preserved.</b><small>${S.legacy.imports.length} older Sakhi store(s) backed up and migrated where recognizable.</small>`
      : "<b>Production history store ready.</b><small>No older local history found on this device.</small>";
    $("#parentSettings").innerHTML =
      `<label><input type="checkbox" id="audio"${S.settings.audio ? " checked" : ""}> Natural voice instructions</label><div class="audio-check"><button class="soft-btn" id="testAudio">Test Sakhi voice</button><span id="audioStatus">${audioState === "error" ? "Voice needs attention" : "Natural voice ready"}</span></div><p>Reward celebrations wait until your child chooses Continue.</p><button class="soft-btn" id="export">Export history backup</button>`;
    $("#audio").onchange = (e) => {
      S.settings.audio = e.target.checked;
      if (!S.settings.audio) stop();
      save();
    };
    $("#testAudio").onclick = () =>
      speak("Hello, Princess. Sakhi's natural voice is ready.", "instruction");
    $("#export").onclick = () => {
      let blob = new Blob([JSON.stringify(S, null, 2)], {
          type: "application/json",
        }),
        u = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = u;
      a.download = "sakhi-history-" + D() + ".json";
      a.click();
      URL.revokeObjectURL(u);
    };
  }
  function hint() {
    S.hearts++;
    save();
    speak(
      act.d === "math"
        ? "Count what you have, then count up to the target."
        : act.d === "language"
          ? "Find what happened first, next, and last."
          : "Look for the clue and try one step at a time.",
    );
    $("#toast").textContent = "Hint used 💛";
    $("#toast").classList.add("show");
    setTimeout(() => $("#toast").classList.remove("show"), 1200);
  }
  function pwa() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("./sw.js")
      .then((r) => {
        let show = () => {
          $("#updateBanner").classList.add("show");
          $("#updateNow").onclick = () => {
            r.waiting && r.waiting.postMessage({ type: "SKIP_WAITING" });
            location.reload();
          };
          $("#updateLater").onclick = () =>
            $("#updateBanner").classList.remove("show");
        };
        if (r.waiting) show();
        r.addEventListener("updatefound", () => {
          let w = r.installing;
          w &&
            w.addEventListener("statechange", () => {
              if (w.state === "installed" && navigator.serviceWorker.controller)
                show();
            });
        });
        setInterval(() => r.update().catch(() => {}), 1800000);
      })
      .catch(console.warn);
  }
  function init() {
    $$("[data-nav]").forEach((b) => (b.onclick = () => show(b.dataset.nav)));
    $("#startToday").onclick = startAdventure;
    $("#startTrail").onclick = startAdventure;
    $("#freshTrail").onclick = () => {
      plan = null;
      show("adventure");
    };
    $("#activityHome").onclick = () => show("home");
    $("#nextActivity").onclick = goNext;
    $("#completionClose").onclick = () => {
      clearTimeout(timer);
      $("#completionOverlay").classList.remove("show");
      show("rewards");
    };
    $("#rewardHome").onclick = () => show("home");
    $("#bedtimeBtn").onclick = () => show("story");
    $("#readStory").onclick = () => speak($("#storyText").textContent, "story");
    $("#stopStory").onclick = stop;
    $("#storyHome").onclick = () => show("home");
    document.addEventListener(
      "visibilitychange",
      () => document.hidden && stop(),
    );
    document.addEventListener("keydown", (event) => {
      if (
        !$("#completionOverlay").classList.contains("show") ||
        event.key !== "Tab"
      )
        return;
      const first = $("#nextActivity"),
        last = $("#completionClose");
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    pwa();
    render();
  }
  window.SakhiProduction = {
    BUILD,
    state: () => JSON.parse(JSON.stringify(S)),
    startAdventure,
    show,
    speak,
    stop,
    audioStatus: () => ({
      state: audioState,
      provider: "ElevenLabs through Sakhi TTS",
      cacheEntries: audioCache.size,
    }),
  };
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init, { once: true })
    : init();
})();
