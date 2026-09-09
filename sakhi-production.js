(function () {
  "use strict";
  const BUILD = "2026.09.09-storybook-audio",
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
    runId = null;
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
      settings: { audio: true, auto: true },
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
    audioState = "ready";
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
    setAudioState("loading", "Loading Sakhi’s natural voice…");
    try {
      const blob = await fetchVoice(text, kind);
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
      setAudioState("playing", "Sakhi is speaking");
      return true;
    } catch (error) {
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
    $("#hearAgain").onclick = () => speak(q[4] || act.i);
    $("#hintBtn").onclick = hint;
    wire(q);
    if (announceNext) {
      announceNext = false;
      void speak(q[4] || act.i);
    }
  }
  function question(q) {
    let story = act.story
      ? `<div class="story-strip">${safe(act.story)}</div>`
      : "";
    if (q[0] === "word")
      return `${story}<div class="question"><h2>${safe(q[1])}</h2><div class="word-answer">${sel.join(" ") || "Tap letters"}</div><div class="token-row">${q[3].map((x) => `<button class="token" data-x="${safe(x)}">${safe(x)}</button>`).join("")}</div><div class="center-row"><button class="soft-btn" id="reset">Reset</button><button class="magic-btn" id="check">Check</button></div></div>`;
    if (q[0] === "seq")
      return `${story}<div class="question"><h2>${safe(q[1])}</h2><div class="sequence-answer">${sel.join(" → ") || "Tap in order"}</div><div class="choice-grid">${q[3].map((x) => `<button class="choice-card" data-x="${safe(x)}">${safe(x)}</button>`).join("")}</div><div class="center-row"><button class="soft-btn" id="reset">Reset</button><button class="magic-btn" id="check">Check</button></div></div>`;
    if (q[0] === "num")
      return `<div class="question"><h2>${safe(q[1])}</h2><div class="math-scene"><span class="gem-row">${"💎".repeat(q[5])}</span><small>${q[5]} of ${q[6]} gems are already in the crown.</small></div><div class="choice-grid">${q[3].map((x) => `<button class="choice-card" data-a="${x}">${x}</button>`).join("")}</div></div>`;
    return `${story}<div class="question"><h2>${safe(q[1])}</h2><div class="choice-grid">${q[3].map((x) => `<button class="choice-card" data-a="${safe(x)}">${safe(x)}</button>`).join("")}</div></div>`;
  }
  function wire(q) {
    $$("[data-x]").forEach(
      (b) =>
        (b.onclick = () => {
          sel.push(b.dataset.x);
          b.disabled = true;
          activity();
        }),
    );
    $$("[data-a]").forEach(
      (b) => (b.onclick = () => answer(q, b.dataset.a, b)),
    );
    let r = $("#reset"),
      c = $("#check");
    if (r)
      r.onclick = () => {
        sel = [];
        activity();
      };
    if (c) c.onclick = () => answer(q, sel);
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
    $$("#interactionArea button").forEach(button => button.disabled = true);
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
      answer: a,
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
      speak("Yes! You found it.");
    } else {
      S.hearts++;
      speak("Almost. Try again slowly.");
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
    timer = setTimeout(() => {
      if (runId !== activeRun || view !== "activity") return;
      answerLocked = false;
      correct ? next() : activity();
    }, 2200);
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
    if (S.rewards.some(reward => reward.completionId === runId)) return;
    S.gems++;
    S.rewards.push({ id: id(), completionId: runId, date: D(), type: "UNICORN_GEM", reason: act.n });
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
      "Progress saved. You earned a Unicorn Gem.";
    $("#nextActivity").textContent = nextAct()
      ? "Next: " + th(nextAct().d)[1] + " →"
      : "Go to Rewards ⭐";
    $("#completionOverlay").classList.add("show");
    if (S.settings.auto) timer = setTimeout(goNext, 1700);
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
    $("#rewardStars").textContent = S.stars;
    $("#rewardGems").textContent = S.gems;
    $("#rewardHearts").textContent = S.hearts;
    let ds = [
      ...new Set(
        S.hist
          .filter((h) => h.date === D() && h.domain)
          .map((h) => th(h.domain)[2]),
      ),
    ];
    $("#rewardSummary").innerHTML = ds.length
      ? `<h2>Today’s magical adventure is complete!</h2><p>You practiced ${ds.join(", ")}.</p>`
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
    $("#storyText").textContent =
      `Once upon a gentle evening, Sakhi Unicorn carried a brave little princess across ${worlds}.\n\nThey listened for word sounds, counted sparkling gems, solved a tiny puzzle, and helped a kind friend. When something felt tricky, the princess took a slow breath and tried again.\n\nSakhi smiled because trying again is a special kind of magic. The moon rose, the stars twinkled, and every kingdom whispered, “You learned with a happy heart today.”\n\nThe little princess closed her eyes, feeling proud, calm, and ready for sweet dreams.`;
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
      reading: ["Letter sounds", "CVC word building", "Sentence reading", "Story comprehension"],
      math: ["Counting and quantities", "number composition", "Addition and subtraction", "Word problems"],
      logic: ["Matching and sorting", "multi-step patterns", "Working memory", "Reasoning"],
      science: ["Observing and comparing", "prediction and observation", "Testing ideas", "Explaining results"],
      language: ["Listening and vocabulary", "story sequencing and why", "Retelling", "Making inferences"],
      writing: ["Letter formation", "spelling and labels", "Writing sentences", "Creating stories"]
    };
    const evidence = S.hist.filter(h => !h.final && typeof h.correct === "boolean" && !h.migrated);
    const correct = evidence.filter(h => h.correct).length;
    // Curriculum is derived from recorded attempts, never from decorative themes.
    $("#parentGoal").textContent = `${evidence.length} recorded answers · ${S.hist.filter(h => h.final).length} completed missions`;
    $("#parentWhy").textContent = evidence.length ? `${Math.round(correct / evidence.length * 100)}% accuracy across recorded answers` : "Complete a mission to begin tracking learning evidence.";
    $("#parentNext").textContent = "Review each subject below. Planned skills are shown separately from playable practice.";
    $("#domainProgress").innerHTML = Object.entries(paths).map(([domain, skills]) => {
      const activity = A.find(item => item.d === domain);
      const attempts = evidence.filter(h => h.domain === domain);
      const successes = attempts.filter(h => h.correct).length;
      const accuracy = attempts.length ? Math.round(successes / attempts.length * 100) : 0;
      const days = new Set(attempts.map(h => h.date)).size;
      const secure = attempts.length >= 9 && days >= 3 && accuracy >= 85;
      return `<details class="curriculum-domain" open><summary><span>${safe(th(domain)[2])}</span><span>${attempts.length ? accuracy + "% accuracy" : "Not assessed"}</span></summary>
        <div class="curriculum-evidence"><p>${attempts.length} answers · ${days} practice days · ${secure ? "Consistent practice evidence" : "Building practice evidence"}</p><progress max="100" value="${accuracy}" aria-label="${safe(th(domain)[2])} answer accuracy"></progress></div>
        <ol class="curriculum-path">${skills.map((skill, index) => {
          const playable = skill === activity.k;
          const status = playable ? (secure ? "Consistent" : attempts.length ? "Practicing" : "Ready to practice") : "Planned · not assessed";
          return `<li><span class="curriculum-step">${index + 1}</span><div><b>${safe(skill)}</b><small>${status}</small>${playable ? `<p>${safe(activity.i)}</p><button class="soft-btn" data-practice="${domain}">Open practice</button>` : ""}</div></li>`;
        }).join("")}</ol></details>`;
    }).join("");
    $$("[data-practice]").forEach(button => button.onclick = () => openDomain(button.dataset.practice));
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
      `<label><input type="checkbox" id="audio"${S.settings.audio ? " checked" : ""}> Natural voice instructions</label><div class="audio-check"><button class="soft-btn" id="testAudio">Test Sakhi voice</button><span id="audioStatus">${audioState === "error" ? "Voice needs attention" : "Natural voice ready"}</span></div><label><input type="checkbox" id="auto"${S.settings.auto ? " checked" : ""}> Auto-advance after each mission</label><button class="soft-btn" id="export">Export history backup</button>`;
    $("#audio").onchange = (e) => {
      S.settings.audio = e.target.checked;
      if (!S.settings.audio) stop();
      save();
    };
    $("#auto").onchange = (e) => {
      S.settings.auto = e.target.checked;
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
