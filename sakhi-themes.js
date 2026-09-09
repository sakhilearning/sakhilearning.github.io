/* Sakhi theme registry.
 *
 * A theme changes how the adventure LOOKS and SOUNDS and what the rewards are
 * CALLED. It must never change which skill is taught, in what order, or at what
 * difficulty. That rule is enforced structurally at the bottom of this file:
 * a theme carrying any curriculum-shaped key fails to register.
 *
 * Naming note: these are original characters and worlds. Where the brief named a
 * specific film franchise, the equivalent original world is used instead
 * (ocean/mermaid, ice palace, royal ball, wayfinder voyage, butterfly cottage)
 * so the published app carries no third-party character IP. The reward currency
 * names from the brief are kept as-is, since they are descriptive nouns.
 */
window.SakhiThemes = (function () {
  'use strict';

  /* Keys a theme is allowed to define. Anything else is rejected. */
  var COSMETIC_KEYS = [
    'id', 'name', 'tagline', 'companion', 'icon', 'palette', 'motifs',
    'narration', 'rewards', 'milestones', 'art'
  ];
  /* Keys that would mean a theme is trying to steer teaching. */
  var FORBIDDEN_KEYS = [
    'skills', 'skill_id', 'domain', 'domains', 'difficulty', 'difficulty_level',
    'curriculum', 'curriculum_version', 'prerequisites', 'recommended_next',
    'order', 'sequence', 'progression', 'mastery', 'placement', 'weights'
  ];

  var registry = {};

  /* Object.freeze is shallow, which would leave theme.palette and theme.rewards
   * writable — a theme could then be mutated at runtime from anywhere. */
  function deepFreeze(o) {
    Object.getOwnPropertyNames(o).forEach(function (k) {
      var v = o[k];
      if (v && typeof v === 'object' && !Object.isFrozen(v)) deepFreeze(v);
    });
    return Object.freeze(o);
  }

  function register(theme) {
    Object.keys(theme).forEach(function (k) {
      if (FORBIDDEN_KEYS.indexOf(k) !== -1) {
        throw new Error('Theme "' + theme.id + '" tried to define curriculum key "' + k + '". Themes are cosmetic only.');
      }
      if (COSMETIC_KEYS.indexOf(k) === -1) {
        throw new Error('Theme "' + theme.id + '" defines unknown key "' + k + '".');
      }
    });
    registry[theme.id] = deepFreeze(theme);
    return theme;
  }

  register({
    id: 'royal_castle',
    name: 'Royal Castle Ball',
    tagline: 'Gowns, gems and a grand staircase.',
    companion: 'Princess Amara',
    icon: '👑',
    palette: { a: '#ffe6f6', b: '#f3dcff', c: '#fff0cf', accent: '#a83fe0', ink: '#3d2050' },
    motifs: ['crown', 'gem', 'staircase', 'chandelier', 'rose'],
    narration: {
      welcome: 'Welcome back to the castle. The ballroom is ready for you.',
      encourage: 'A true princess tries again. You are doing beautifully.',
      celebrate: 'The whole court is clapping for you!'
    },
    rewards: { primary: { key: 'magic_stars', label: 'Magic Stars', icon: '⭐' },
               badge: { key: 'royal_badges', label: 'Royal Badges', icon: '🎖️' } },
    milestones: ['A candle lights on the chandelier', 'A rose blooms on the stair', 'The ballroom doors swing open'],
    art: { ground: 'castle', sky: 'sunset' }
  });

  register({
    id: 'ice_palace',
    name: 'Ice Crystal Palace',
    tagline: 'Snowflakes, frost and a quiet blue sky.',
    companion: 'Frost Princess Neve',
    icon: '❄️',
    palette: { a: '#ddf2ff', b: '#e2e9ff', c: '#f2e6ff', accent: '#2f9fe0', ink: '#1e3550' },
    motifs: ['snowflake', 'icicle', 'aurora', 'crystal', 'pine'],
    narration: {
      welcome: 'The palace gates are frosted open. Step inside.',
      encourage: 'Slow and steady, like snow falling. Try once more.',
      celebrate: 'The aurora is dancing just for you!'
    },
    rewards: { primary: { key: 'snow_crystals', label: 'Snow Crystals', icon: '❄️' },
               badge: { key: 'ice_trophies', label: 'Ice Trophies', icon: '🏆' } },
    milestones: ['A snowflake settles on the rail', 'An icicle chimes', 'The aurora ribbons overhead'],
    art: { ground: 'ice', sky: 'aurora' }
  });

  register({
    id: 'mermaid_lagoon',
    name: 'Mermaid Lagoon',
    tagline: 'Coral gardens, bubbles and a curious seal.',
    companion: 'Coral the Mermaid',
    icon: '🧜‍♀️',
    palette: { a: '#d2f8ff', b: '#c2f2f5', c: '#ffe2f0', accent: '#0fb3ad', ink: '#0e3f47' },
    motifs: ['shell', 'bubble', 'coral', 'starfish', 'kelp'],
    narration: {
      welcome: 'Coral is waiting by the reef. Swim down and say hello.',
      encourage: 'Take a big bubble breath and try again.',
      celebrate: 'The whole reef is glowing for you!'
    },
    rewards: { primary: { key: 'pearls', label: 'Lagoon Pearls', icon: '🫧' },
               badge: { key: 'shell_badges', label: 'Shell Badges', icon: '🐚' } },
    milestones: ['A bubble floats up', 'A starfish waves', 'The reef lights up in colour'],
    art: { ground: 'reef', sky: 'water' }
  });

  register({
    id: 'wayfinder_cove',
    name: 'Wayfinder Cove',
    tagline: 'Sails, stars and a brave little boat.',
    companion: 'Wayfinder Tala',
    icon: '⛵',
    palette: { a: '#e0f7ef', b: '#d6ecff', c: '#ffeacc', accent: '#0f8f80', ink: '#123b38' },
    motifs: ['sail', 'compass', 'wave', 'star', 'palm'],
    narration: {
      welcome: 'The tide is right and the stars are out. Ready to sail?',
      encourage: 'Every wayfinder gets turned around. Set your course again.',
      celebrate: 'You found your way! The stars are bright tonight.'
    },
    rewards: { primary: { key: 'courage_hearts', label: 'Courage Hearts', icon: '💛' },
               badge: { key: 'wayfinder_gems', label: 'Wayfinder Gems', icon: '💎' } },
    milestones: ['The sail catches wind', 'A star lines up on the horizon', 'Land comes into view'],
    art: { ground: 'shore', sky: 'night' }
  });

  register({
    id: 'butterfly_cottage',
    name: 'Butterfly Cottage',
    tagline: 'Candles, courtyards and a house full of colour.',
    companion: 'Lantern Fairy Mira',
    icon: '🦋',
    palette: { a: '#ffe6d6', b: '#ffd9ea', c: '#eef7d6', accent: '#e0603a', ink: '#46281f' },
    motifs: ['butterfly', 'candle', 'tile', 'vine', 'lantern'],
    narration: {
      welcome: 'The cottage doors are open and the candles are lit.',
      encourage: 'The house believes in you. One more try.',
      celebrate: 'Every candle in the cottage just flared bright!'
    },
    rewards: { primary: { key: 'miracle_candles', label: 'Miracle Candles', icon: '🕯️' },
               badge: { key: 'butterfly_badges', label: 'Butterfly Badges', icon: '🦋' } },
    milestones: ['A candle catches light', 'A butterfly lands on the sill', 'The whole courtyard glows'],
    art: { ground: 'courtyard', sky: 'dusk' }
  });

  register({
    id: 'unicorn_meadow',
    name: 'Unicorn Meadow',
    tagline: 'Rainbows, clouds and a very soft mane.',
    companion: 'Sakhi the Unicorn',
    icon: '🦄',
    palette: { a: '#ffe4f7', b: '#e9dcff', c: '#d6f0ff', accent: '#ff4fa8', ink: '#3a1f56' },
    motifs: ['rainbow', 'cloud', 'star', 'flower', 'horn'],
    narration: {
      welcome: 'Sakhi is grazing by the rainbow. She saved you a spot.',
      encourage: 'Sakhi nuzzles your shoulder. Try that one again.',
      celebrate: 'Sakhi is prancing in circles for you!'
    },
    rewards: { primary: { key: 'magic_stars', label: 'Magic Stars', icon: '⭐' },
               badge: { key: 'unicorn_gems', label: 'Unicorn Gems', icon: '💎' } },
    milestones: ['A rainbow stripe appears', 'A flower opens in the grass', 'The whole meadow shimmers'],
    art: { ground: 'meadow', sky: 'rainbow' }
  });

  var DEFAULT_ID = 'unicorn_meadow';

  function all() { return Object.keys(registry).map(function (k) { return registry[k]; }); }
  function get(id) { return registry[id] || registry[DEFAULT_ID]; }
  function ids() { return Object.keys(registry); }

  /* Paint the active theme. This only ever writes CSS custom properties and a
   * body attribute — it cannot reach activity selection. */
  function apply(id) {
    var t = get(id);
    var root = document.documentElement;
    root.style.setProperty('--theme-a', t.palette.a);
    root.style.setProperty('--theme-b', t.palette.b);
    root.style.setProperty('--theme-c', t.palette.c);
    root.style.setProperty('--theme-accent', t.palette.accent);
    root.style.setProperty('--theme-ink', t.palette.ink);
    document.body.dataset.theme = t.id;
    return t;
  }

  return {
    DEFAULT_ID: DEFAULT_ID,
    all: all, get: get, ids: ids, apply: apply,
    COSMETIC_KEYS: COSMETIC_KEYS, FORBIDDEN_KEYS: FORBIDDEN_KEYS
  };
})();
