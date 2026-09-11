/* Sakhi artwork.
 *
 * Original illustration, drawn as layered SVG so it stays razor sharp on a
 * retina iPad and costs a few KB instead of a megabyte of PNG.
 *
 * What makes this read as illustration rather than clipart, and what to keep
 * doing if you extend it:
 *   - every shape is a multi-stop gradient, never a flat fill
 *   - one consistent light direction (upper left), so every form gets a
 *     highlight on the same side and a shadow opposite
 *   - a rim light: a thin bright stroke on the lit edge, which is what separates
 *     a subject from its background
 *   - soft ambient occlusion under overlapping shapes
 *   - a blurred glow behind the subject, tinted to the theme
 *   - specular highlights on the eye and horn
 *
 * Nothing here is traced from or derived from any existing character.
 */
window.SakhiArt = (function () {
  'use strict';

  var uid = 0;
  function ns() { return 'a' + (++uid); }

  /* Per-theme colour script. Each is a full palette, not a single hue: sky,
   * ground, the subject's body, the accent metal, and the glow. */
  var PALETTE = {
    unicorn_meadow: {
      sky: ['#ffd9f2', '#e5d4ff', '#cfe9ff'], glow: '#ff7ad1',
      body: ['#ffffff', '#fdf2ff', '#e6d4f5'], shade: '#c9a9e6',
      metal: ['#ffe89a', '#ffc24d', '#e08b1f'],
      mane: [['#ff5fa2', '#ff9ecb'], ['#a86bff', '#d3a5ff'], ['#4fb8ff', '#9fe0ff'], ['#ffd93d', '#ffefa1']],
      ground: ['#9be89b', '#4fc47a']
    },
    royal_castle: {
      sky: ['#ffe3f4', '#f0d9ff', '#ffeec9'], glow: '#c465ff',
      body: ['#fff6fb', '#ffe6f4', '#e9c6e6'], shade: '#b681c4',
      metal: ['#fff0a8', '#ffc94d', '#d98e12'],
      mane: [['#c957ff', '#e6a8ff'], ['#ff6fb4', '#ffb3d6'], ['#ffd54d', '#ffeaa8'], ['#8a5cff', '#c0a5ff']],
      ground: ['#e7c9ff', '#b98ce0']
    },
    ice_palace: {
      sky: ['#d6f0ff', '#dbe4ff', '#f0e2ff'], glow: '#5ec8ff',
      body: ['#ffffff', '#eefaff', '#cfe6f7'], shade: '#8fb6d4',
      metal: ['#e8f8ff', '#9fd8ff', '#4c9fd6'],
      mane: [['#4fc3ff', '#a8e5ff'], ['#8f9dff', '#c7cfff'], ['#7ce0e0', '#c2f5f5'], ['#e0d4ff', '#f4ecff']],
      ground: ['#e6f6ff', '#a9d5ef']
    },
    mermaid_lagoon: {
      sky: ['#c9f7ff', '#a7ecf5', '#ffdcef'], glow: '#26d3d3',
      body: ['#fffdf6', '#ffeede', '#f0c9b0'], shade: '#c98f74',
      metal: ['#fff0b0', '#ffc95c', '#d99226'],
      mane: [['#ff5f8f', '#ffa3bf'], ['#1fc4b8', '#7ce6dc'], ['#ff9f4d', '#ffd0a1'], ['#7a6bff', '#b9b0ff']],
      ground: ['#7de3d3', '#22a9a0']
    },
    wayfinder_cove: {
      sky: ['#1d3b6e', '#3a5fa0', '#ffb37a'], glow: '#ffc97a',
      body: ['#fff4e6', '#ffe2c4', '#e0b18a'], shade: '#a86f4a',
      metal: ['#ffe9a8', '#f5b942', '#b87a18'],
      mane: [['#2b2144', '#4a3a6b'], ['#3a2c55', '#5f4a85'], ['#241c38', '#3d2f5c'], ['#4d3a70', '#7a63a3']],
      ground: ['#2aa79a', '#12706c']
    },
    butterfly_cottage: {
      sky: ['#ffe0cc', '#ffd0e4', '#e6f5cc'], glow: '#ff8a4d',
      body: ['#fff8f0', '#ffe8d6', '#e8bfa0'], shade: '#b87f5e',
      metal: ['#ffe3a1', '#f0a94d', '#c47519'],
      mane: [['#e2734f', '#ffab88'], ['#8f4f9e', '#c98fd6'], ['#f0a94d', '#ffd699'], ['#5fa85f', '#a3d6a3']],
      ground: ['#f0c9a1', '#c99560']
    }
  };

  function pal(themeId) { return PALETTE[themeId] || PALETTE.unicorn_meadow; }

  /* Shared defs: gradients, the glow blur, the grain that stops large gradients
   * from banding on a big screen. */
  function defs(id, p) {
    return [
      '<defs>',
      // sky
      '<linearGradient id="sky' + id + '" x1="0" y1="0" x2="0.4" y2="1">',
      '<stop offset="0" stop-color="' + p.sky[0] + '"/>',
      '<stop offset="0.55" stop-color="' + p.sky[1] + '"/>',
      '<stop offset="1" stop-color="' + p.sky[2] + '"/></linearGradient>',
      // body: light from the upper left
      '<linearGradient id="body' + id + '" x1="0.15" y1="0.05" x2="0.85" y2="1">',
      '<stop offset="0" stop-color="' + p.body[0] + '"/>',
      '<stop offset="0.5" stop-color="' + p.body[1] + '"/>',
      '<stop offset="1" stop-color="' + p.body[2] + '"/></linearGradient>',
      // metal for horn / crown
      '<linearGradient id="metal' + id + '" x1="0" y1="0" x2="1" y2="1">',
      '<stop offset="0" stop-color="' + p.metal[0] + '"/>',
      '<stop offset="0.55" stop-color="' + p.metal[1] + '"/>',
      '<stop offset="1" stop-color="' + p.metal[2] + '"/></linearGradient>',
      // theme glow behind the subject
      '<radialGradient id="glow' + id + '" cx="0.5" cy="0.5" r="0.5">',
      '<stop offset="0" stop-color="' + p.glow + '" stop-opacity=".55"/>',
      '<stop offset="0.6" stop-color="' + p.glow + '" stop-opacity=".18"/>',
      '<stop offset="1" stop-color="' + p.glow + '" stop-opacity="0"/></radialGradient>',
      // ground
      '<linearGradient id="ground' + id + '" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="' + p.ground[0] + '"/>',
      '<stop offset="1" stop-color="' + p.ground[1] + '"/></linearGradient>',
      // mane strands
      p.mane.map(function (m, i) {
        return '<linearGradient id="mane' + i + id + '" x1="0" y1="0" x2="0.8" y2="1">' +
          '<stop offset="0" stop-color="' + m[0] + '"/>' +
          '<stop offset="1" stop-color="' + m[1] + '"/></linearGradient>';
      }).join(''),
      // soft shadow used under overlapping forms
      '<filter id="soft' + id + '" x="-40%" y="-40%" width="180%" height="180%">',
      '<feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#42225e" flood-opacity=".22"/></filter>',
      '<filter id="blur' + id + '" x="-50%" y="-50%" width="200%" height="200%">',
      '<feGaussianBlur stdDeviation="26"/></filter>',
      // grain: kills gradient banding on large fills
      '<filter id="grain' + id + '"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/>',
      '<feColorMatrix type="saturate" values="0"/>',
      '<feComponentTransfer><feFuncA type="linear" slope=".05"/></feComponentTransfer></filter>',
      '</defs>'
    ].join('');
  }

  /* Sparkle field. Deterministic per id so it does not jitter on re-render. */
  function sparkles(id, count, w, h, colour) {
    var out = [], seed = 7;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    for (var i = 0; i < count; i++) {
      var x = rnd() * w, y = rnd() * h * 0.8, s = 3 + rnd() * 7, o = 0.35 + rnd() * 0.5;
      out.push('<path d="M ' + x + ' ' + (y - s) + ' Q ' + x + ' ' + y + ' ' + (x + s) + ' ' + y +
        ' Q ' + x + ' ' + y + ' ' + x + ' ' + (y + s) +
        ' Q ' + x + ' ' + y + ' ' + (x - s) + ' ' + y +
        ' Q ' + x + ' ' + y + ' ' + x + ' ' + (y - s) + ' Z" fill="' + (colour || '#fff') + '" opacity="' + o.toFixed(2) + '"/>');
    }
    return out.join('');
  }

  /* ---- the unicorn ------------------------------------------------------- */
  /* Head in three-quarter view, facing left. Built as silhouette -> form
   * shading -> mane behind -> mane in front -> features -> rim light. */
  function unicorn(id, p) {
    /* Framed as a portrait. Drawn full-length the neck dominates and the animal
     * reads as a giraffe; scaling in so the head fills the frame is what makes
     * it read as a unicorn. */
    return ['<g transform="translate(190 228) scale(1.22) translate(-196 -170)">',
      /* Mane as ribbons that HUG the neck crest and run its full length. An arc
       * thrown out into empty space reads as a rainbow parked behind a horse. */
      '<g filter="url(#soft' + id + ')">',
      '<path d="M 294 92 C 368 110 400 184 384 258 C 374 306 362 352 354 398',
      ' C 356 344 358 296 348 250 C 336 182 318 132 280 114 Z" fill="url(#mane0' + id + ')"/>',
      '<path d="M 288 106 C 348 126 374 190 360 256 C 350 302 340 344 334 388',
      ' C 336 336 340 294 330 250 C 320 192 306 148 274 130 Z" fill="url(#mane2' + id + ')"/>',
      '</g>',

      /* Head + neck: short rounded muzzle, full cheek, neck that widens as it
       * descends instead of tapering to a wedge. */
      '<path d="M 250 420 C 244 356 240 306 226 276',
      ' C 206 254 176 250 150 240 C 130 233 116 226 116 212',
      ' C 116 198 130 190 148 186 C 174 180 196 172 214 156',
      ' C 234 138 244 120 252 106 C 262 88 288 84 300 100',
      ' C 314 118 318 146 320 176 C 326 240 344 330 360 420 Z"',
      ' fill="url(#body' + id + ')"/>',

      // form shadow under the jaw, and where the neck turns away from the light
      '<path d="M 226 276 C 206 254 176 250 150 240 C 178 258 204 272 232 282 Z" fill="' + p.shade + '" opacity=".26"/>',
      '<path d="M 306 210 C 322 290 340 356 352 420 L 360 420 C 344 330 326 240 320 176 Z" fill="' + p.shade + '" opacity=".28"/>',

      // cheek highlight, upper-left light
      '<ellipse cx="212" cy="196" rx="54" ry="42" fill="#fff" opacity=".45"/>',

      // ear: solid, large enough to read
      '<path d="M 292 96 C 298 58 320 36 338 44 C 352 52 348 86 326 116 Z" fill="url(#body' + id + ')"',
      ' stroke="' + p.shade + '" stroke-width="2.5" stroke-opacity=".45"/>',
      '<path d="M 300 94 C 305 66 320 52 331 56 C 338 62 334 84 320 106 Z" fill="' + p.shade + '" opacity=".5"/>',
      // contact shadow where the ear meets the skull
      '<path d="M 292 96 C 302 104 316 110 326 116 C 312 116 298 110 290 102 Z" fill="' + p.shade + '" opacity=".35"/>',

      // horn
      '<path d="M 250 108 C 246 74 244 42 240 8 C 256 44 268 78 276 104 Z" fill="url(#metal' + id + ')"/>',
      '<g stroke="' + p.metal[2] + '" stroke-width="2.6" opacity=".55" stroke-linecap="round">',
      '<path d="M 248 94 L 266 90"/><path d="M 245 72 L 259 68"/><path d="M 242 50 L 253 47"/>',
      '</g>',
      '<circle cx="241" cy="12" r="5.5" fill="#fff" opacity=".95"/>',

      // mane ribbons in front of the neck
      '<path d="M 278 120 C 328 144 346 200 332 254 C 322 294 312 336 308 376',
      ' C 310 328 316 292 306 252 C 296 202 282 168 258 148 Z" fill="url(#mane1' + id + ')"/>',
      '<path d="M 266 134 C 306 158 318 202 308 246 C 300 282 292 322 288 358',
      ' C 290 314 296 282 288 248 C 280 208 268 182 248 162 Z" fill="url(#mane3' + id + ')"/>',

      // forelock between horn and brow
      '<path d="M 254 106 C 240 132 220 146 198 150 C 220 160 244 152 262 132 Z" fill="url(#mane1' + id + ')"/>',

      // eye
      '<ellipse cx="196" cy="190" rx="16" ry="18" fill="#3a2350"/>',
      '<ellipse cx="196" cy="194" rx="10.5" ry="12" fill="#1d1030"/>',
      '<circle cx="190" cy="183" r="6" fill="#fff"/>',
      '<circle cx="203" cy="200" r="2.8" fill="#fff" opacity=".8"/>',
      '<path d="M 178 175 C 186 166 203 164 213 171" fill="none" stroke="#3a2350" stroke-width="5" stroke-linecap="round"/>',

      // nostril + mouth
      '<ellipse cx="132" cy="209" rx="6.5" ry="5" fill="' + p.shade + '" opacity=".8" transform="rotate(-20 132 209)"/>',
      '<path d="M 120 226 C 130 233 143 233 152 229" fill="none" stroke="' + p.shade + '" stroke-width="3.2" stroke-linecap="round" opacity=".7"/>',

      // blush
      '<ellipse cx="162" cy="212" rx="19" ry="11" fill="' + p.glow + '" opacity=".3"/>',

      // rim light along the lit edge
      '<path d="M 252 106 C 262 88 288 84 300 100 C 314 118 318 146 320 176" fill="none" stroke="#fff" stroke-width="4.5" opacity=".8" stroke-linecap="round"/>',
      '<path d="M 116 212 C 116 198 130 190 148 186 C 174 180 196 172 214 156" fill="none" stroke="#fff" stroke-width="3.2" opacity=".6" stroke-linecap="round"/>',
      '</g>'
    ].join('');
  }

  /* ---- per-theme hero motifs -------------------------------------------- */

  function castle(id, p) {
    return [
      '<g filter="url(#soft' + id + ')">',
      '<rect x="150" y="180" width="120" height="190" rx="8" fill="url(#body' + id + ')"/>',
      '<rect x="96" y="220" width="70" height="150" rx="8" fill="url(#body' + id + ')"/>',
      '<rect x="256" y="205" width="76" height="165" rx="8" fill="url(#body' + id + ')"/>',
      '<path d="M 140 180 L 210 96 L 280 180 Z" fill="url(#mane0' + id + ')"/>',
      '<path d="M 88 220 L 131 158 L 174 220 Z" fill="url(#mane1' + id + ')"/>',
      '<path d="M 248 205 L 294 140 L 340 205 Z" fill="url(#mane1' + id + ')"/>',
      '</g>',
      '<path d="M 186 300 C 186 272 234 272 234 300 L 234 370 L 186 370 Z" fill="url(#metal' + id + ')" opacity=".9"/>',
      '<circle cx="131" cy="262" r="13" fill="url(#metal' + id + ')"/>',
      '<circle cx="294" cy="248" r="13" fill="url(#metal' + id + ')"/>',
      '<path d="M 210 96 L 214 76 L 226 84 L 232 62" fill="none" stroke="url(#metal' + id + ')" stroke-width="5" stroke-linecap="round"/>',
      '<path d="M 150 180 L 210 96 L 270 180" fill="none" stroke="#fff" stroke-width="3.5" opacity=".55" stroke-linejoin="round"/>'
    ].join('');
  }

  function mermaidTail(id, p) {
    return [
      /* A tapered tail body with two broad flukes. Drawn as filled shapes: a
       * single thick stroke reads as a bean, not a tail. */
      '<g filter="url(#soft' + id + ')">',
      // S-curved body: a straight tail reads as a surfboard
      '<path d="M 202 58 C 250 104 254 174 228 232 C 214 264 192 290 180 316',
      ' L 156 308 C 168 280 186 252 196 224 C 216 170 222 108 202 58 Z" fill="url(#mane1' + id + ')"/>',
      // flukes in the contrasting pink, not the orange that fought the teal
      '<path d="M 178 314 C 120 304 82 330 72 372 C 118 386 160 358 178 314 Z" fill="url(#mane0' + id + ')"/>',
      '<path d="M 178 314 C 236 298 276 324 290 366 C 244 384 200 358 178 314 Z" fill="url(#mane0' + id + ')"/>',
      '</g>',
      // scale rows: three staggered arcs, fading down the tail
      '<g fill="#fff" opacity=".32">',
      '<ellipse cx="208" cy="120" rx="15" ry="9"/><ellipse cx="230" cy="142" rx="11" ry="7"/><ellipse cx="188" cy="140" rx="11" ry="7"/>',
      '<ellipse cx="212" cy="176" rx="13" ry="8"/><ellipse cx="230" cy="198" rx="10" ry="6"/><ellipse cx="192" cy="196" rx="10" ry="6"/>',
      '<ellipse cx="202" cy="232" rx="11" ry="7"/><ellipse cx="184" cy="258" rx="9" ry="6"/><ellipse cx="214" cy="254" rx="8" ry="5"/>',
      '</g>',
      // fluke veining
      '<g stroke="#fff" stroke-width="3" opacity=".45" fill="none" stroke-linecap="round">',
      '<path d="M 172 318 C 142 322 112 336 88 354"/><path d="M 172 328 C 146 336 124 346 104 362"/>',
      '<path d="M 184 318 C 218 322 248 338 272 356"/><path d="M 184 328 C 212 336 236 348 258 364"/>',
      '</g>',
      // rim light on the lit edge
      '<path d="M 202 58 C 248 104 252 172 228 230" fill="none" stroke="#fff" stroke-width="4.5" opacity=".7" stroke-linecap="round"/>',
      // bubbles rising
      '<g fill="#fff">',
      '<circle cx="302" cy="150" r="13" opacity=".55"/><circle cx="330" cy="206" r="8" opacity=".45"/>',
      '<circle cx="292" cy="244" r="6" opacity=".4"/><circle cx="112" cy="140" r="10" opacity=".5"/>',
      '<circle cx="86" cy="200" r="6" opacity=".4"/><circle cx="128" cy="232" r="5" opacity=".35"/>',
      '</g>'
    ].join('');
  }

  function sailboat(id, p) {
    return [
      '<circle cx="300" cy="120" r="52" fill="' + p.metal[0] + '" opacity=".9"/>',
      '<circle cx="300" cy="120" r="52" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/>',
      '<g filter="url(#soft' + id + ')">',
      '<path d="M 206 300 L 206 96 L 320 250 Z" fill="url(#mane0' + id + ')" opacity=".95"/>',
      '<path d="M 196 300 L 196 130 L 110 268 Z" fill="url(#body' + id + ')"/>',
      '<path d="M 92 300 L 320 300 L 282 356 L 130 356 Z" fill="url(#metal' + id + ')"/>',
      '</g>',
      '<path d="M 201 96 L 201 306" stroke="' + p.shade + '" stroke-width="7" stroke-linecap="round"/>',
      '<path d="M 196 130 L 196 296" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>',
      '<path d="M 60 366 C 120 350 160 382 216 366 C 268 352 306 380 356 366" fill="none" stroke="#fff" stroke-width="6" opacity=".55" stroke-linecap="round"/>'
    ].join('');
  }

  function cottage(id, p) {
    return [
      '<g filter="url(#soft' + id + ')">',
      '<rect x="120" y="212" width="182" height="158" rx="10" fill="url(#body' + id + ')"/>',
      '<path d="M 100 216 L 211 116 L 322 216 Z" fill="url(#mane0' + id + ')"/>',
      '</g>',
      '<rect x="186" y="272" width="52" height="98" rx="8" fill="url(#metal' + id + ')"/>',
      '<circle cx="228" cy="322" r="4.5" fill="' + p.shade + '"/>',
      '<rect x="136" y="248" width="40" height="40" rx="7" fill="' + p.sky[2] + '" opacity=".9"/>',
      '<rect x="248" y="248" width="40" height="40" rx="7" fill="' + p.sky[2] + '" opacity=".9"/>',
      '<path d="M 100 216 L 211 116 L 322 216" fill="none" stroke="#fff" stroke-width="4" opacity=".5" stroke-linejoin="round"/>',
      // butterflies
      '<g opacity=".95">',
      '<path d="M 330 150 C 344 132 362 138 356 156 C 368 146 380 158 366 170 C 352 182 334 170 330 150 Z" fill="url(#mane1' + id + ')"/>',
      '<path d="M 78 268 C 90 254 104 260 99 274 C 109 265 119 275 107 285 C 96 294 82 284 78 268 Z" fill="url(#mane1' + id + ')"/>',
      '</g>'
    ].join('');
  }

  var MOTIF = {
    unicorn_meadow: unicorn,
    ice_palace: unicorn,     // the ice world keeps the unicorn, in its own palette
    royal_castle: castle,
    mermaid_lagoon: mermaidTail,
    wayfinder_cove: sailboat,
    butterfly_cottage: cottage
  };

  /* A full hero scene: sky, atmosphere, glow, motif, ground, sparkles. */
  function scene(themeId, opts) {
    opts = opts || {};
    var p = pal(themeId), id = ns();
    var motif = (MOTIF[themeId] || unicorn)(id, p);
    return [
      '<svg class="sakhi-scene" viewBox="0 0 420 420" role="img" aria-label="' + (opts.label || 'Sakhi artwork') + '" xmlns="http://www.w3.org/2000/svg">',
      defs(id, p),
      '<rect width="420" height="420" rx="' + (opts.radius == null ? 36 : opts.radius) + '" fill="url(#sky' + id + ')"/>',
      // atmosphere: two soft light pools
      '<ellipse cx="120" cy="90" rx="150" ry="120" fill="#fff" opacity=".28" filter="url(#blur' + id + ')"/>',
      '<ellipse cx="330" cy="330" rx="150" ry="130" fill="' + p.glow + '" opacity=".2" filter="url(#blur' + id + ')"/>',
      // glow behind the subject
      '<circle cx="215" cy="215" r="165" fill="url(#glow' + id + ')"/>',
      // ground
      '<path d="M 0 336 C 90 312 150 348 220 336 C 300 322 360 350 420 332 L 420 420 L 0 420 Z" fill="url(#ground' + id + ')" opacity=".85"/>',
      motif,
      sparkles(id, 16, 420, 420, '#fff'),
      '<rect width="420" height="420" rx="' + (opts.radius == null ? 36 : opts.radius) + '" filter="url(#grain' + id + ')" opacity=".5" style="mix-blend-mode:overlay"/>',
      '</svg>'
    ].join('');
  }

  /* Small circular portrait for the header and theme cards. */
  function portrait(themeId, label) {
    var p = pal(themeId), id = ns();
    var motif = (MOTIF[themeId] || unicorn)(id, p);
    return [
      '<svg class="sakhi-portrait" viewBox="0 0 420 420" role="img" aria-label="' + (label || '') + '" xmlns="http://www.w3.org/2000/svg">',
      defs(id, p),
      '<circle cx="210" cy="210" r="210" fill="url(#sky' + id + ')"/>',
      '<circle cx="210" cy="210" r="170" fill="url(#glow' + id + ')"/>',
      '<g transform="translate(210 215) scale(1.06) translate(-210 -215)">' + motif + '</g>',
      '<circle cx="210" cy="210" r="205" fill="none" stroke="#fff" stroke-width="8" opacity=".55"/>',
      '</svg>'
    ].join('');
  }

  return { scene: scene, portrait: portrait, palette: pal, PALETTE: PALETTE };
})();
