/* Sakhi artwork registry.
 *
 * The rendered scenes in assets/scenes/ are the app's artwork. This module is
 * the one place that knows which scene belongs to which world, so nothing else
 * has to hardcode a file path.
 *
 * Scenes are 1536x1024 webp, ~170-340KB each. Only the default world's scene is
 * precached by the service worker; the rest are cached the first time they are
 * shown, so a first install stays small and offline still works for whatever
 * the child has actually visited.
 */
window.SakhiArt = (function () {
  'use strict';

  var DIR = './assets/scenes/';
  var THUMB_DIR = './assets/scenes/thumbs/';

  /* world id -> scene file + the alt text a screen reader should hear */
  var SCENES = {
    unicorn_meadow:    { file: 'rainbow-meadow.webp',   alt: 'A girl reading with a unicorn in a rainbow meadow below a castle' },
    royal_castle:      { file: 'royal-ballroom.webp',   alt: 'A grand royal ballroom with a sweeping staircase' },
    ice_palace:        { file: 'frozen-palace.webp',    alt: 'A palace of ice and snow under a bright winter sky' },
    mermaid_lagoon:    { file: 'mermaid-lagoon.webp',   alt: 'A coral lagoon with a mermaid among bubbles and shells' },
    forest_glade:      { file: 'forest-library.webp',   alt: 'A library of books nestled in an enchanted forest glade' },
    butterfly_cottage: { file: 'tower-art-studio.webp', alt: 'A sunlit tower art studio full of colour and butterflies' }
  };

  /* Not tied to a world: used behind the rewards screen. */
  var REWARD_SCENE = { file: 'story-castle.webp', alt: 'A storybook castle at golden hour' };

  function src(themeId) { return DIR + (SCENES[themeId] || SCENES.unicorn_meadow).file; }
  /* 256px jpeg, ~20KB. Decoding six full 1536x1024 scenes just to paint six
   * 96px circles is visibly slow even on a fast machine. */
  function thumb(themeId) {
    return THUMB_DIR + (SCENES[themeId] || SCENES.unicorn_meadow).file.replace(/\.webp$/, '.jpg');
  }
  function alt(themeId) { return (SCENES[themeId] || SCENES.unicorn_meadow).alt; }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  /* Hero scene. `eager` for the one visible on load, lazy for the rest. */
  function scene(themeId, opts) {
    opts = opts || {};
    return '<img class="sakhi-scene" src="' + esc(src(themeId)) + '"' +
      ' alt="' + esc(opts.label || alt(themeId)) + '"' +
      ' width="1536" height="1024"' +
      ' loading="' + (opts.eager ? 'eager' : 'lazy') + '" decoding="async">';
  }

  /* Circular crop for the world picker. Same file, so choosing a world costs no
   * extra download once its card has been seen. */
  function portrait(themeId, label) {
    return '<span class="sakhi-portrait"><img src="' + esc(thumb(themeId)) + '"' +
      /* Not lazy: these are inserted while the view is display:none, and the
       * lazy-load observer does not reliably fire once it becomes visible. They
       * are 20KB each and precached, so eager costs nothing. */
      ' alt="' + esc(label || alt(themeId)) + '" width="256" height="171"' +
      ' decoding="async"></span>';
  }

  function rewardScene() {
    return '<img class="sakhi-scene" src="' + esc(DIR + REWARD_SCENE.file) + '"' +
      /* same reason as portrait(): rendered into a hidden view */
      ' alt="' + esc(REWARD_SCENE.alt) + '" decoding="async">';
  }

  /* Warm a scene so switching worlds does not flash an empty box. */
  function prefetch(themeId) {
    if (!SCENES[themeId]) return;
    var img = new Image();
    img.decoding = 'async';
    img.src = src(themeId);
  }

  function all() {
    return Object.keys(SCENES).map(function (k) {
      return { theme: k, file: SCENES[k].file, src: DIR + SCENES[k].file, alt: SCENES[k].alt };
    });
  }

  return {
    DIR: DIR, SCENES: SCENES, REWARD_SCENE: REWARD_SCENE,
    scene: scene, portrait: portrait, rewardScene: rewardScene,
    src: src, thumb: thumb, alt: alt, prefetch: prefetch, all: all
  };
})();
