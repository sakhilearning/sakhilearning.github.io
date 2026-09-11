# Sakhi Learning Trails V3 RC3

Sakhi Learning Trails is a child-led Kindergarten practice PWA organized around persistent subject worlds rather than mood-selected themes.

- Reading & Phonics → Luna's Rainbow Library
- Math → Crystal Number Palace
- Writing → Lantern Letter Studio
- Stories & Language → Enchanted Story Castle
- Science → Mermaid Discovery Lagoon
- Logic → Butterfly Puzzle Garden
- Wellbeing → Friendship Garden
- Creative / Fine Motor / Movement → Starlight Create & Move Stage

The curriculum contains 85 skills and a 26-week, 130-day pacing plan. A normal day targets 30 total minutes with Reading, Math, Writing, a rotating domain, and an off-screen hands-on activity.

## Why RC3 exists

RC2 fixed the fragile deployment shell, but real local testing showed that audio fallback still needed hardening and the activity surface felt too much like a white worksheet. RC3 ships a self-contained `index.html` containing compiled CSS, runtime JavaScript, curriculum, pacing data, and an inline icon. This makes GitHub Pages deployment much less fragile while keeping the source code modular and testable.

Source CSS retains ordered cascade layers. The release build flattens them in order for broad browser compatibility, so production does not depend on browser support for CSS `@layer` and does not rely on accidental “last rule wins” overrides.

## Commands

```bash
npm ci
npm run release
npm run preview
```

`npm run release` is the pre-deploy gate.

## Audio

Normal narration uses the configured Supabase `sakhi-speech` Edge Function and ElevenLabs when available. Device speech is a fallback for ordinary narration only and is primed during the child's Start tap for better Safari/Chrome reliability. Parents also get a one-tap voice test and provider status. Isolated phonemes never use TTS and remain disabled until corresponding recordings are explicitly verified in `assets/audio/phonemes/manifest.json`.

## Secrets

Never commit an ElevenLabs API key, Supabase service-role key, email-provider key, or GitHub token. `supabase-config.js` contains public browser configuration only.

See `PATCH_NOTES_RC3.md` for the fixes in this release and `DEPLOY_MAC.md` for the exact upgrade/deploy steps.
