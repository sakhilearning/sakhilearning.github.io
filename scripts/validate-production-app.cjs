const fs = require("fs");
const errors = [];
const read = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "");
const index = read("index.html"),
  js = read("sakhi-production.js"),
  css = read("sakhi-production.css"),
  sw = read("sw.js"),
  manifest = read("manifest.json");
const scenes = [
  "rainbow-meadow",
  "story-castle",
  "royal-ballroom",
  "frozen-palace",
  "mermaid-lagoon",
  "forest-library",
  "tower-art-studio",
];
const has = (text, token, msg) => {
  if (!text.includes(token)) errors.push(msg || `missing ${token}`);
};
has(index, "sakhi-production.css", "index must load production CSS");
has(index, "sakhi-production.js", "index must load production JS");
for (const old of [
  "app.js",
  "interaction-engine.js",
  "sakhi-v3.js",
  "daily-journey-service.js",
  "adaptive-engine.js",
  "visuals.js",
])
  if (index.includes(old))
    errors.push(`index still loads conflicting runtime: ${old}`);
if ((index.match(/<link[^>]+stylesheet/g) || []).length !== 1)
  errors.push("index must load exactly one stylesheet");
if ((index.match(/<script[^>]+src=/g) || []).length !== 1)
  errors.push("index must load exactly one application script");
for (const name of [
  "Unicorn Reading Meadow",
  "Royal Castle Academy",
  "Ice Princess Palace",
  "Mermaid Lagoon",
  "Enchanted Forest Friends",
  "Pixie Art Garden",
])
  has(js, name, `missing world name ${name}`);
for (const name of scenes) {
  const path = `assets/scenes/${name}.webp`;
  if (!fs.existsSync(path) || fs.statSync(path).size < 100000)
    errors.push(`missing full-resolution scene: ${path}`);
  has(sw, `./${path}`, `service worker does not cache ${path}`);
}
for (const token of [
  "rainbowMagicLearningV2",
  "sakhi.v3.state",
  "sakhiMagicLearningV3",
  "migrate",
  "sakhi.backup",
])
  has(js, token, `history preservation missing ${token}`);
for (const token of [
  "startAdventure",
  "function start(",
  "function complete(",
  "function goNext(",
  "function rewards(",
  "function story(",
])
  has(js, token, `journey flow missing ${token}`);
for (const token of [
  "sakhi-tts",
  "okzmrlrijovbuatjcgqi.supabase.co",
  "new Map()",
  "URL.createObjectURL",
  "player.play()",
  "audioStatus",
])
  has(js, token, `natural audio feature missing ${token}`);
for (const forbidden of [
  "speechSynthesis",
  "SpeechSynthesisUtterance",
  '<svg class="story-art"',
  "linearGradient id=",
])
  if (js.includes(forbidden))
    errors.push(
      `production runtime still contains replaced clipart/audio path: ${forbidden}`,
    );
if (css.includes("!important"))
  errors.push("production CSS must not contain !important overrides");
for (const word of ["patch", "hotfix", "override"])
  if (new RegExp("\\." + word + "[-_{.]", "i").test(css))
    errors.push(`production CSS contains a ${word} layer`);
if ((js.match(/id:\s*"[^\"]+"/g) || []).length < 6)
  errors.push("too few production activities");
if (
  !css.includes(".kingdom-card") ||
  !css.includes(".activity-view") ||
  !css.includes(".scene-image")
)
  errors.push("CSS missing scene/activity layout");
if (!manifest.includes("Sakhi Magic Learning"))
  errors.push("manifest missing app name");
if (errors.length) {
  console.error(
    "Production Sakhi validation failed:\n- " + errors.join("\n- "),
  );
  process.exit(1);
}
console.log(
  "Production Sakhi validation passed: one runtime, one stylesheet, seven real scenes, neural HTML audio, responsive layout, journey flow, and preserved history.",
);
