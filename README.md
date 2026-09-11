# Sakhi Learning Trails V3 RC1

A deployable preview/release-candidate of the high-end Sakhi Kindergarten learning app.

## What this bundle is for

Use this bundle to **deploy and test the V3 product direction now**: persistent subject trails, 85 Kindergarten skills across 8 domains, a 26-week/130-day plan, 30-minute mixed-modality sessions, parent progress, offline PWA behavior, and ElevenLabs narration through Supabase with browser voice fallback.

This bundle intentionally contains no Disney-owned artwork. The worlds are original magical princess/unicorn/fairy/mermaid settings. Rights-cleared character packs can be added later through the presentation layer without changing curriculum.

## Important audio change

This RC removes the old fragile "silent after 1.2 seconds" detection. Narration works as:

1. Child taps Start and unlocks the browser audio context.
2. If Supabase is configured, the app requests `functions/v1/sakhi-speech`, which proxies ElevenLabs server-side.
3. If premium narration is unavailable, normal instructions fall back to the device/browser voice.
4. **Isolated phonemes never use TTS fallback.** They require verified local recordings in `assets/audio/phonemes`.

No ElevenLabs secret belongs in this repository.

## Curriculum

- 8 domains
- 85 skills
- 26 weeks
- 130 planned days
- 30 minutes/day by default
- Core daily sequence: Reading/Phonics + Math + Writing + rotating whole-child subject + off-screen activity + celebration

Persistent subject worlds:

- Reading & Phonics -> Luna's Rainbow Library
- Math -> Crystal Number Palace
- Writing -> Lantern Letter Studio
- Stories & Language -> Enchanted Story Castle
- Science -> Mermaid Discovery Lagoon
- Logic -> Butterfly Puzzle Garden
- Wellbeing -> Friendship Garden
- Create & Move -> Starlight Create & Move Stage

The world is selected from the subject **after** curriculum/adaptive selection. Trails cannot decide the skill or difficulty.

## Local test on your Mac

```bash
npm ci
npm run qa
npm run preview
```

Open `http://localhost:4173`.

## Safest install over your current repo

You already created `backup/sakhi-v3-before-sync`, so keep it.

Extract this ZIP somewhere outside the repository, then:

```bash
cd /Users/vinaygovindam/Downloads/sakhi-learning
git checkout upgrade/sakhi-v3
git status
```

Only continue if the working tree is clean. Then run:

```bash
/path/to/extracted/sakhi-v3-release/install-over-existing.sh /Users/vinaygovindam/Downloads/sakhi-learning
```

The installer preserves your existing `supabase-config.js` and current phoneme directory, overlays this RC, then runs QA and builds `dist/`.

Review before commit:

```bash
git status
git diff --stat
npm run qa
npm run preview
```

When satisfied:

```bash
git add -A
git commit -m "Upgrade Sakhi to Learning Trails V3 RC1"
git push -u origin upgrade/sakhi-v3
```

You can test the branch via GitHub Pages workflow. Merge into `main` only after runtime testing on the child's real device.

## Supabase + ElevenLabs

Apply:

`supabase/migrations/20260911_sakhi_v3_rc1.sql`

Deploy:

```bash
supabase functions deploy sakhi-speech
```

Set secrets in Supabase (not GitHub Pages JS):

```bash
supabase secrets set ELEVENLABS_API_KEY=...
supabase secrets set ELEVENLABS_VOICE_ID=...
supabase secrets set ELEVENLABS_MODEL_ID=eleven_flash_v2_5
```

Keep only the public Supabase URL and anon/publishable key in `supabase-config.js`.

## Release note

This is a **testable RC**, not a claim that the isolated phoneme bank is complete. `assets/audio/phonemes/manifest.json` currently marks no phonemes verified because the actual validated sound files were not available in the build environment. Preserve and audit your existing recordings before enabling phoneme-specific playback.
