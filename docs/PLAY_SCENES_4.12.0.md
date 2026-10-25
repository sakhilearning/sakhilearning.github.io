# Early-math player redesign — 4.12.0

## Teaching strategy

The rejected picture-grid implementation repeated quantities in three clue cards and again in picture answer choices. That made a simple question visually dense. This version removes that interactive layout and uses one learning action per scene.

For “Which number sits between 7 and 9?”:

1. A small numeric clue reads `7 ? 9`.
2. One cartoon friend stands beside one group of eight footballs.
3. “Kick the balls” replays an eight-step kick animation into that same group.
4. A plain number rail offers 1–10. There are no picture answer cards or extra groups of seven and nine.
5. The child taps a number, then checks it. Feedback is brief, and the next scene replaces the current scene.

Quantities up to 20 occupy one organized field. Larger numbers use compact place-value support rather than dozens of repeated pictures. Zero lessons include zero in the number rail. Addition grows one group; subtraction removes items from one group. A static final state is available immediately, so animation is optional.

## New ownership boundaries

- `SakhiScenePlan` owns the pure teaching contract: action, quantity, object, character, clue, number range, and narration shape.
- `SakhiScenePlayer` owns the early-math DOM, READY/ANIMATING/AWAITING_ANSWER lifecycle, replay timers, response selection, and cancellation. It does not write mastery or learner history.
- The canonical templates module routes supported early-math questions to the player before the worksheet renderer. It does not append decorative layers around the new scene.
- `sakhi-play-scenes.css` owns the scene layout. The previous repeated-picture layout was removed.
- `SakhiAudio` remains the persistent playback service and adds character tone effects, local original music, and action sounds. Curriculum and progress remain the existing data services.

The scene narration reads the current question. It does not read an unrelated worked example while a different quantity is on screen. The worked explanation remains available in the optional teaching details.

This redesign replaces early-math interaction, not the entire account/curriculum platform or every later-grade activity. Comparisons, geometry, reading, writing, and more advanced activities retain their separate renderers.

## Sound

Parents can rotate character styles or select clear guide, gentle dinosaur, bright pixie, and playful friend. These styles adjust the pitch/pace of the existing bundled voice; they are not separately recorded actors. Phoneme playback retains its original speed. No paid voice provider or browser robot speech was added.

The music is a quiet original synthesized melody. Kicks, taps, success, and retries have short synthesized effects. Music starts through the replay gesture, pauses outside the scene/hidden tab, and has parent mute/volume controls. Narration suppresses newly scheduled music notes while speaking. Scene cancellation stops animation timers and sound scheduling.

## Art and provenance

26 unmodified OpenMoji assets are included locally with license, attribution, source URLs, and SHA-256 hashes. The scene uses those sticker files plus an original animated boot. There are no runtime image hotlinks. Source and license details are in `assets/theme-media/math-stickers/`.

## Validation

`test:math-visuals` covers:

- Quantity semantics and saved-question upgrades without changing answers or evidence keys.
- Exactly one eight-ball field, one character, ten plain number buttons, and no repeated picture choices.
- Scoring, reset, replay termination, subtraction, tap counting, and cancellation.
- Local asset hashes and registered sticker mappings.
- Character rates actually applied to speech playback, musical notes, one music loop, kick effects, mute/volume, and cleanup.

Browser checks cover the one-group scene, kick replay, numeric input, answer checking, next-question transition, and console errors. A final screenshot accompanies the patch package. Audio scheduling and tone rates are tested; subjective voice appeal and physical-device audio still benefit from family testing.
