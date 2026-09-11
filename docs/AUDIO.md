# Sakhi V3 audio

`SakhiAudio` owns all browser audio behavior.

- Narration: Supabase `sakhi-tts` -> ElevenLabs, cached per line in the visit.
- Fallback narration: browser speech synthesis only when provider narration is unavailable.
- Isolated phonemes: validated local OGG recording first; otherwise the dedicated
  server phoneme route. Generic browser TTS is never allowed for a pure phoneme.
- First Start tap primes playback for iOS autoplay policy.
- Route changes stop current audio so lines cannot overlap.
- Parent Dashboard shows narration configuration and local phoneme coverage.

The two bundled local recordings are `/t/` and `/p/`. Remaining pure sounds must
be validated before they are considered locally verified.
