# Sakhi Learning Trails V3 RC3

RC3 is the audio + immersion patch built after real-device/local visual testing of RC2.

## What changed

- Rebuilt normal-instruction audio fallback for Safari/Chrome:
  - browser speech is primed inside the child's first Start tap;
  - waits briefly for the browser voice list;
  - resumes paused speech synthesis;
  - retries a queued first utterance once without mislabeling ordinary startup delay as "silent";
  - exposes provider/error diagnostics in Parent Dashboard;
  - adds a one-tap Parent "Test Sakhi voice" control.
- ElevenLabs through Supabase remains the preferred narration path when public Supabase config is present.
- Isolated phonemes still never fall back to TTS.
- Activity "Hear again" explicitly re-unlocks audio and reports whether ElevenLabs or the device voice is playing.
- Rebuilt subject scenes with original inline SVG world art instead of a mostly empty gradient banner.
- The entire activity view now inherits the active subject world's palette.
- Added companion story cues to every question so each task feels like part of the trail rather than a disconnected worksheet.
- Replaced themed counting emoji with controlled SVG stars, crystals, lanterns, roses, shells, butterflies, hearts and sparkles.
- Countable objects are now tappable: each touched object receives a visible count marker.
- Preserved the curriculum/presentation boundary: trails still cannot choose skill, band, prerequisite or answer.
- No remote character-image hotlinks were added. The existing original Sakhi unicorn remains the persistent companion/fallback asset.

## Important audio note

A clean RC3 ZIP intentionally ships with blank public Supabase configuration. In that case normal instructions use the device voice. When RC3 is installed over the existing repository with `install-over-existing.sh`, the installer preserves the repository's existing `supabase-config.js`, allowing the deployed build to use the already configured Supabase/ElevenLabs route.

The verified isolated-phoneme bank is a separate release requirement. Existing phoneme assets are preserved by the installer.
